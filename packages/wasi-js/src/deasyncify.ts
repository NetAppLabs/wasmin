import { Asyncify } from "./asyncify.js";
import { Channel, makeAtomicsChannel, makeChannel, readMessage, uuidv4 } from "./sync-message/index.js";
import { initializeHandlers } from "./workerUtils.js";
import * as comlink from "comlink";
import nodeEndpoint from "comlink/dist/umd/node-adapter.js";
import { Worker, parentPort } from "node:worker_threads";
import { URL } from "node:url";
import { sleep } from "./wasiUtils.js";
import { Console } from "node:console";
import { default as fs } from "node:fs";

//
// deasyncify is for allowing async imports in a WebAssembly.Instance
// implemented by running the WebAssembly.Instance itelf as a Worker running within WasmThreadRunner
//

export const USED_SHARED_MEMORY = true;

export const wasmThreadDLogger = new Console({
    stdout: fs.createWriteStream("wasmthread-out.log"),
    stderr: fs.createWriteStream("wasmthread-err.log"),
});

export const wasmProxyLogger = new Console({
    stdout: fs.createWriteStream("wasmproxy-out.log"),
    stderr: fs.createWriteStream("wasmproxy-err.log"),
});

declare let globalThis: any;
globalThis.WASM_THREAD_DEBUG = false;

export function wasmThreadDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_THREAD_DEBUG) {
        wasmProxyLogger.log(msg, ...optionalParams);
        if (parentPort) {
            parentPort.postMessage(msg);
            const message = { msg: msg, params: [...optionalParams] };
            parentPort.postMessage(message);
        } else {
            console.debug(msg, ...optionalParams);
        }
    }
}

globalThis.WASM_PROXY_DEBUG = false;

export function wasmProxyDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_PROXY_DEBUG) {
        wasmProxyLogger.log(msg, ...optionalParams);
        if (parentPort) {
            parentPort.postMessage(msg);
            const message = { msg: msg, params: [...optionalParams] };
            parentPort.postMessage(message);
        } else {
            console.debug(msg, ...optionalParams);
        }
    }
}

export type TransferMemoryFunc = (buf: ArrayBuffer) => void;

export type HandleWasmImportFunc = (
    messageId: string,
    importName: string,
    functionName: string,
    args: any[],
    memory: ArrayBuffer,
    transferMemoryFunc: TransferMemoryFunc
) => any;

export type GetMemoryFunc = () => ArrayBuffer;

function copyBuffer(src: ArrayBuffer, dst: ArrayBuffer) {
    new Uint8Array(dst).set(new Uint8Array(src));
    return dst;
}

export class WasmThreadRunner {
    constructor() {
        wasmThreadDebug("WasmThreadRunner creating");
        initializeHandlers();
    }
    private wasmInstance?: WebAssembly.Instance;
    private sharedMemory?: SharedArrayBuffer;

    public async instantiate(
        modSource: BufferSource,
        knownImports: string[],
        channel: Channel,
        handleImportFunc: HandleWasmImportFunc
    ): Promise<void> {
        wasmThreadDebug("WasmThreadRunner instantiate");

        const transferMemoryFuncLocal = (buf: ArrayBuffer) => {
            wasmThreadDebug("WasmThreadRunner calling transferMemoryFuncLocal");
            if (this && this.wasmInstance && this.wasmInstance.exports) {
                const mem = this.wasmInstance.exports.memory as WebAssembly.Memory;
                // @ts-ignore
                //mem.buffer = buf;
                copyBuffer(buf, mem.buffer);
            } else {
                throw new Error("this.wasmInstance.exports not set");
            }
        };
        //const transferMemoryFunc = comlink.proxy(transferMemoryFuncLocal);
        const transferMemoryFunc = transferMemoryFuncLocal;

        const getMemoryFunc = () => {
            wasmThreadDebug("WasmThreadRunner calling getMemoryFunc");
            if (this && this.wasmInstance && this.wasmInstance.exports && this.wasmInstance.exports.memory) {
                const mem = this.wasmInstance.exports.memory as WebAssembly.Memory;
                //const buf = mem.buffer;
                //const copiedBuf = structuredClone(buf);
                //return copiedBuf;
                if (USED_SHARED_MEMORY) {
                    if (!this.sharedMemory) {
                        this.sharedMemory = new SharedArrayBuffer(mem.buffer.byteLength);
                    }
                    copyBuffer(mem.buffer, this.sharedMemory);
                    return this.sharedMemory;
                } else {
                    return mem.buffer;
                }
            }
            throw new Error("Coud not get WebAssembly instance memory");
        };
        const wrappedImports = wrapAllImportsToProxy(
            knownImports,
            channel,
            handleImportFunc,
            getMemoryFunc,
            transferMemoryFunc
        );
        //wasmThreadDebug("WasmThreadRunner instantiate wrappedImports: ", wrappedImports);

        const instantiatedSource = await WebAssembly.instantiate(modSource, wrappedImports);
        this.wasmInstance = instantiatedSource.instance;
    }

    public async handleExportedFunction(functionName: string, args: any[]): Promise<any> {
        wasmThreadDebug("WasmThreadRunner handleExportedFunction: ", functionName);
        while (!this.wasmInstance) {
            wasmThreadDebug("waiting for wasmInstance");
            await sleep(100);
        }
        if (this.wasmInstance) {
            wasmThreadDebug("WasmThreadRunner handleExportedFunction functionName: ", functionName);
            const exportedfunc = this.wasmInstance.exports[functionName] as any;
            if (exportedfunc) {
                const result = exportedfunc(...args);
                return result;
            } else {
                return;
            }
        } else {
            throw new Error("WasmInstance not set");
        }
    }
}

export async function instantiateWithAsyncDetection(
    sourceModule: WebAssembly.Module,
    sourceBuffer: BufferSource,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc
): Promise<{ instance: WebAssembly.Instance; isAsync: boolean; channel?: Channel }> {
    wasmProxyDebug("instantiateWithAsyncDetection");
    let isAsyncified = false;
    const syncInstance = await WebAssembly.instantiate(sourceModule, imports);

    if (syncInstance.exports["asyncify_get_state"] == null) {
        isAsyncified = false;
        wasmProxyDebug("asyncify_get_state == null , isAsync: ", isAsyncified);
    } else {
        isAsyncified = true;
        wasmProxyDebug("asyncify_get_state != null, isAsync: ", isAsyncified);
    }
    if (isAsyncified) {
        const state = new Asyncify();
        const asyncifiedInstance = await WebAssembly.instantiate(sourceModule, state.wrapImports(imports));
        state.init(asyncifiedInstance, imports);
        return { instance: asyncifiedInstance, isAsync: isAsyncified };
    } else {
        wasmProxyDebug("instantiateWithAsyncDetection making channel");
        //const channel = makeChannel();
        const bufferSize = 64 * 1024 * 1024;
        const channel = makeAtomicsChannel({ bufferSize });
        wasmProxyDebug("instantiateWithAsyncDetection made channel: ", channel);

        if (channel) {
            if (!sourceBuffer) {
                throw new Error("BufferSource must be set for non-asyncified wasm modules to work");
            }
            const workerPath =
                "file:///Users/tryggvil/Development/netapp/wasm/wasm-env/packages/wasi-js/dist/wasmThread.js";
            const workerUrl = new URL(workerPath);
            // First argument is a function that must return a new Worker object
            //const client = new SyncClient<WasmThreadRunner>(() => new Worker(workerUrl), channel);
            const worker = new Worker(workerUrl);
            worker.on("message", (msg: any) => {
                if (globalThis.WASM_THREAD_DEBUG) {
                    console.log("WasmThread worker message received: ", msg);
                }
            });
            //worker.on("error", err => console.error(error));
            //worker.on("exit", code => console.log(`Worker exited with code ${code}.`));

            wasmProxyDebug("instantiateWithAsyncDetection started worker");

            const client = comlink.wrap<WasmThreadRunner>(nodeEndpoint(worker));
            wasmProxyDebug("instantiateWithAsyncDetection wrapped client");
            //const proxiedInstance = await instantiateProxy(source, wrapAllImportsSync(imports, channel, handleImport), client);
            const proxiedInstance = await instantiateProxy(sourceBuffer, imports, channel, client, handleImportFunc);
            wasmProxyDebug("instantiateWithAsyncDetection returning");

            return { instance: proxiedInstance, isAsync: isAsyncified, channel: channel };
        } else {
            throw new Error("Unable to create message channel");
        }
    }
}

async function instantiateProxy(
    moduleSource: BufferSource,
    importObject?: WebAssembly.Imports,
    channel?: Channel,
    client?: comlink.Remote<WasmThreadRunner>,
    handleImportFunc?: HandleWasmImportFunc
): Promise<WebAssembly.Instance> {
    wasmProxyDebug("instantiateProxy");
    const exportsDummy: WebAssembly.Exports = {};
    const workerProxy = client;
    const exportsProxy = new Proxy(exportsDummy, {
        get: (target, name, receiver) => {
            wasmProxyDebug("instantiateProxy get:", name);
            if (workerProxy) {
                wasmProxyDebug("instantiateProxy creating wrappedFunction");
                const wrappedFunction = async (...args: any[]) => {
                    wasmProxyDebug("instantiateProxy calling wrappedFunction");
                    const functionName = name as string;
                    wasmProxyDebug("instantiateProxy calling wrappedFunction functionName: ", functionName);
                    return await workerProxy.handleExportedFunction(functionName, args);
                };
                return wrappedFunction;
            } else {
                throw new Error("workerProxy not set");
            }
        },
    });
    wasmProxyDebug("workerProxy creating: instanceProxy");
    const instanceProxy: WebAssembly.Instance = {
        exports: exportsProxy,
    };
    wasmProxyDebug("workerProxy created: instanceProxy");
    const knownImports: string[] = [];
    if (importObject) {
        for (const [importKey, value] of Object.entries(importObject)) {
            wasmProxyDebug("workerProxy pushing importKey: ", importKey);
            knownImports.push(importKey);
        }
    }
    if (workerProxy && channel && handleImportFunc) {
        wasmProxyDebug("workerProxy calling instantiate");
        workerProxy.instantiate(moduleSource, knownImports, channel, handleImportFunc);
    } else {
        throw new Error("workerProxy, channel or handleImportFunc not set");
    }
    return instanceProxy;
}

function wrapAllImportsToProxy(
    knownImports: string[],
    channel: Channel,
    handleImport: HandleWasmImportFunc,
    getMemoryFunc: GetMemoryFunc,
    transferMemoryFunc: TransferMemoryFunc
): WebAssembly.Imports {
    wasmThreadDebug("wrapAllImportsToProxy");

    const updatedImports: Record<string, WebAssembly.ModuleImports> = {};
    for (const [_importKey, importValue] of Object.entries(knownImports)) {
        updatedImports[importValue] = wrapImportsToProxy(
            importValue,
            channel,
            handleImport,
            getMemoryFunc,
            transferMemoryFunc
        );
    }
    return updatedImports;
}

function wrapImportsToProxy(
    importName: string,
    channel: Channel,
    handleImport: HandleWasmImportFunc,
    getMemoryFunc: GetMemoryFunc,
    transferMemoryFunc: TransferMemoryFunc
): WebAssembly.ModuleImports {
    wasmThreadDebug("wrapImportsToProxy importName: ", importName);

    const impDummy: WebAssembly.ModuleImports = {};

    const importsProxy = new Proxy(impDummy, {
        get: (target, name, receiver) => {
            wasmThreadDebug(`wrapImportsToProxy importName: ${importName} get:`, name);

            const myChannel = channel;
            const myImportName = importName;
            const functionName = name as string;
            const wrappedFunction = (...args: any[]) => {
                const messageId = uuidv4();
                wasmThreadDebug(
                    `wrapImportsToProxy calling wrappedFunction ${functionName} messageId: ${messageId} args: `,
                    args
                );
                //wasmThreadDebug(`wrapImportsToProxy calling wrappedFunction ${functionName} myChannel: `, myChannel);

                let memory = getMemoryFunc();
                if (!USED_SHARED_MEMORY) {
                    memory = comlink.transfer(memory, [memory]);
                }
                // @ts-ignore
                handleImport(messageId, myImportName, functionName, args, memory, undefined);

                const retMessage = readMessage(myChannel, messageId);
                const retValue = retMessage.return;

                if (USED_SHARED_MEMORY) {
                    transferMemoryFunc(memory);
                } else {
                    const numberArrayMemory = retMessage.memory as number[];
                    const typedArrayMemory = new Uint8Array(numberArrayMemory);
                    const buf = typedArrayMemory.buffer;
                    wasmThreadDebug(
                        `wrapImportsToProxy returning from wrappedFunction ${functionName} with buf: `,
                        buf
                    );
                    transferMemoryFunc(buf);
                }

                //wasmThreadDebug(`wrapImportsToProxy returning from wrappedFunction ${functionName} with typedArrayMemory: `, typedArrayMemory);
                wasmThreadDebug(
                    `wrapImportsToProxy returning from wrappedFunction ${functionName} with retValue: `,
                    retValue
                );

                return retValue;
            };
            return wrappedFunction;
        },
    });
    return importsProxy;
}
