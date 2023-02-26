import { Asyncify } from "./asyncify.js";
import { Channel, makeAtomicsChannel, makeChannel, readMessage, uuidv4 } from "./vendored/sync-message/index.js";
import { initializeHandlers } from "./workerUtils.js";
import * as comlink from "comlink";
import Worker, { createWorker } from "./vendored/web-worker/index.js";
//import { URL } from "node:url";

import { parentPort } from "node:worker_threads";
//import nodeEndpoint from "comlink/dist/umd/node-adapter.js";
//import {Worker} from 'node:worker_threads';

import { sleep } from "./wasiUtils.js";

//
// desyncify is for allowing async imports in a WebAssembly.Instance
// implemented by running the WebAssembly.Instance itelf as a Worker running within WasmThreadRunner
// using SharedArrayBuffer as memory.
// If the WebAssembly.Instance exported memory is not shared it is copied over.
//

export const USED_SHARED_MEMORY = true;

/*
export const wasmThreadDLogger = new Console({
    stdout: fs.createWriteStream("wasmthread-out.log"),
    stderr: fs.createWriteStream("wasmthread-err.log"),
});

export const wasmProxyLogger = new Console({
    stdout: fs.createWriteStream("wasmproxy-out.log"),
    stderr: fs.createWriteStream("wasmproxy-err.log"),
});
*/

declare let globalThis: any;
globalThis.WASM_THREAD_DEBUG = false;

export function wasmThreadDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_THREAD_DEBUG) {
        console.debug(msg, ...optionalParams);
        if (parentPort) {
            parentPort.postMessage(msg);
            const message = { msg: msg, params: [...optionalParams] };
            parentPort.postMessage(message);
        } else {
            console.debug(msg, ...optionalParams);
        }
    }
}

globalThis.WASM_HANDLER_DEBUG = false;

export function wasmHandlerDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_HANDLER_DEBUG) {
        console.debug(msg, ...optionalParams);
        if (parentPort) {
            parentPort.postMessage(msg);
            const message = { msg: msg, params: [...optionalParams] };
            parentPort.postMessage(message);
        } else {
            console.debug(msg, ...optionalParams);
        }
    }
}

export type ReciveMemoryFunc = (buf: ArrayBuffer) => void;

export type HandleWasmImportFunc = (
    messageId: string,
    importName: string,
    functionName: string,
    args: any[],
    memory: ArrayBuffer
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
    private handleImportFunc?: HandleWasmImportFunc;

    public async instantiate(
        modSource: BufferSource,
        knownImports: string[],
        channel: Channel,
        handleImportFunc: HandleWasmImportFunc
    ): Promise<void> {
        wasmThreadDebug("WasmThreadRunner instantiate");

        const recieveMemoryFuncLocal = (buf: ArrayBuffer) => {
            wasmThreadDebug("WasmThreadRunner calling transferMemoryFuncLocal");
            if (this && this.wasmInstance && this.wasmInstance.exports) {
                const mem = this.wasmInstance.exports.memory as WebAssembly.Memory;
                if (mem.buffer instanceof SharedArrayBuffer) {
                    // no need to copy if SharedArrayBuffer
                } else {
                    // copy buf into wasm memory
                    copyBuffer(buf, mem.buffer);
                }
            } else {
                throw new Error("this.wasmInstance.exports not set");
            }
        };

        const getMemoryFuncLocal = () => {
            wasmThreadDebug("WasmThreadRunner calling getMemoryFunc");
            if (this && this.wasmInstance && this.wasmInstance.exports && this.wasmInstance.exports.memory) {
                const mem = this.wasmInstance.exports.memory as WebAssembly.Memory;
                if (USED_SHARED_MEMORY) {
                    if (mem.buffer instanceof SharedArrayBuffer) {
                        this.sharedMemory = mem.buffer as SharedArrayBuffer;
                    } else {
                        if (!this.sharedMemory) {
                            this.sharedMemory = new SharedArrayBuffer(mem.buffer.byteLength);
                        } else {
                            if (this.sharedMemory.byteLength != mem.buffer.byteLength) {
                                this.sharedMemory = new SharedArrayBuffer(mem.buffer.byteLength);
                            }
                        }
                        copyBuffer(mem.buffer, this.sharedMemory);
                    }
                    return this.sharedMemory;
                } else {
                    return mem.buffer;
                }
            }
            throw new Error("Coud not get WebAssembly instance memory");
        };
        const wrappedImports = threadWrapAllImports(
            knownImports,
            channel,
            handleImportFunc,
            getMemoryFuncLocal,
            recieveMemoryFuncLocal
        );

        const instantiatedSource = await WebAssembly.instantiate(modSource, wrappedImports);
        this.wasmInstance = instantiatedSource.instance;
        this.handleImportFunc = handleImportFunc;
    }

    public cleanup(): void {
        console.log("WasmThreadRunner.cleanup");
        if (this.handleImportFunc) {
            console.log("WasmThreadRunner.cleanup handleImportFunc: ", this.handleImportFunc);
            // @ts-ignore
            if (this.handleImportFunc[comlink.releaseProxy]) {
                console.log("WasmThreadRunner.cleanup handleImportFunc releaseProxy");
                // @ts-ignore
                this.handleImportFunc[comlink.releaseProxy]();
            }
        }
    }

    public async executeExportedFunction(functionName: string, args: any[]): Promise<any> {
        wasmThreadDebug("WasmThreadRunner executeExportedFunction: ", functionName);
        while (!this.wasmInstance) {
            wasmThreadDebug("WasmThreadRunner executeExportedFunction: waiting for wasmInstance");
            await sleep(100);
        }
        if (this.wasmInstance) {
            wasmThreadDebug("WasmThreadRunner executeExportedFunction functionName: ", functionName);
            const exportedfunc = this.wasmInstance.exports[functionName] as any;
            if (exportedfunc) {
                try {
                    const result = exportedfunc(...args);
                    console.log("returning from exportedFunc");
                    return result;
                } catch (err: any) {
                    console.log("err catched from from exportedFunc:", err);
                    throw err;
                }
            } else {
                return;
            }
        } else {
            throw new Error("WasmInstance not set");
        }
    }
}

export async function instantiateWithAsyncDetection(
    wasmModOrBufSource: WebAssembly.Module | BufferSource,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc
): Promise<{
    instance: WebAssembly.Instance;
    isAsync: boolean;
    channel?: Channel;
    threadRemote?: comlink.Remote<WasmThreadRunner>;
}> {
    wasmHandlerDebug("instantiateWithAsyncDetection");
    let isAsyncified = false;
    let wasmMod: WebAssembly.Module;
    let sourceBuffer: BufferSource | null = null;
    if (wasmModOrBufSource instanceof ArrayBuffer || ArrayBuffer.isView(wasmModOrBufSource)) {
        sourceBuffer = wasmModOrBufSource as BufferSource;
        wasmMod = await WebAssembly.compile(sourceBuffer);
    } else {
        wasmMod = wasmModOrBufSource as WebAssembly.Module;
    }
    const syncInstance = await WebAssembly.instantiate(wasmMod, imports);
    if (syncInstance.exports["asyncify_get_state"] == null) {
        isAsyncified = false;
        wasmHandlerDebug("asyncify_get_state == null , isAsync: ", isAsyncified);
    } else {
        isAsyncified = true;
        wasmHandlerDebug("asyncify_get_state != null, isAsync: ", isAsyncified);
    }
    if (isAsyncified) {
        const state = new Asyncify();
        const asyncifiedInstance = await WebAssembly.instantiate(wasmMod, state.wrapImports(imports));
        state.init(asyncifiedInstance, imports);
        return { instance: asyncifiedInstance, isAsync: isAsyncified };
    } else {
        wasmHandlerDebug("instantiateWithAsyncDetection making channel");
        let channel: Channel | null;
        if (USED_SHARED_MEMORY) {
            channel = makeChannel();
        } else {
            const bufferSize = 64 * 1024 * 1024;
            channel = makeAtomicsChannel({ bufferSize });
        }
        wasmHandlerDebug("instantiateWithAsyncDetection made channel: ", channel);

        if (channel) {

            if (!sourceBuffer) {
                throw new Error("BufferSource must be set for non-asyncified wasm modules to work");
            }

            const useAbsolutePath = false;
            let worker: Worker;
            if (useAbsolutePath) {
                const workerPath =
                    "file:///Users/tryggvil/Development/netapp/wasm/wasm-env/packages/wasi-js/dist/wasmThread.js";
                const workerUrl = new URL(workerPath);
                worker = new Worker(workerUrl);
                //worker = new Worker(import.meta.url);
            } else {
                //worker = new Worker(new URL("./worker.js", import.meta.url).href, { type: "module" });
                //const workerUrlString = await import.meta.resolve("./wasmThread.js", import.meta.url);
                //const workerUrl = new URL(workerUrlString);

                const workerUrl = new URL("./wasmThread.js", import.meta.url);

                wasmHandlerDebug("workerUrl:", workerUrl);
                //const importSrc = `import ${JSON.stringify(workerUrl)};`;
                //const blob = new Blob([importSrc], { type: "text/javascript" });
                // @ts-ignore
                //const objectURL = URL.createObjectURL(blob);
                //const worker = new Worker(workerUrl.href, { type: "module" });
                //const worker = new Worker(workerUrl.href);
                //worker = new Worker(workerUrl);
                worker = await createWorker(workerUrl);
                wasmHandlerDebug("createWorker: ", worker);
            }

            if (worker) {
                worker.addEventListener("message", (msg: MessageEvent<any>) => {
                //worker.on("message", (msg: MessageEvent<any>) => {
                    if (globalThis.WASM_THREAD_DEBUG) {
                        console.log("WasmThread worker message received: ", msg);
                    }
                });

                //worker.on("error", err => console.log("`Worker error:", err));
                //worker.on("exit", code => console.log(`Worker exited with code ${code}.`));
            }
            wasmHandlerDebug("instantiateWithAsyncDetection started worker");

            //const threadRemote = comlink.wrap<WasmThreadRunner>(nodeEndpoint(worker));
            const threadRemote = comlink.wrap<WasmThreadRunner>(worker);

            wasmHandlerDebug("instantiateWithAsyncDetection wrapped threadRemote");
            const proxiedInstance = await handlerInstanciateProxy(
                sourceBuffer,
                imports,
                channel,
                threadRemote,
                handleImportFunc
            );
            wasmHandlerDebug("instantiateWithAsyncDetection returning");

            return {
                instance: proxiedInstance,
                isAsync: isAsyncified,
                channel: channel,
                threadRemote: threadRemote,
            };
        } else {
            throw new Error("Unable to create message channel");
        }
    }
}

async function handlerInstanciateProxy(
    moduleSource: BufferSource,
    importObject?: WebAssembly.Imports,
    channel?: Channel,
    threadRemote?: comlink.Remote<WasmThreadRunner>,
    handleImportFunc?: HandleWasmImportFunc
): Promise<WebAssembly.Instance> {
    wasmHandlerDebug("instantiateProxy");
    const exportsDummy: WebAssembly.Exports = {};
    const exportsProxy = new Proxy(exportsDummy, {
        get: (target, name, receiver) => {
            wasmHandlerDebug("instantiateProxy get:", name);
            if (threadRemote) {
                wasmHandlerDebug("instantiateProxy creating wrappedFunction");
                const wrappedFunction = async (...args: any[]) => {
                    wasmHandlerDebug("instantiateProxy calling wrappedFunction");
                    const functionName = name as string;
                    wasmHandlerDebug("instantiateProxy calling wrappedFunction functionName: ", functionName);
                    return await threadRemote.executeExportedFunction(functionName, args);
                };
                return wrappedFunction;
            } else {
                throw new Error("threadRemote not set");
            }
        },
    });
    wasmHandlerDebug("workerProxy creating: instanceProxy");
    const instanceProxy: WebAssembly.Instance = {
        exports: exportsProxy,
    };
    wasmHandlerDebug("workerProxy created: instanceProxy");
    const knownImports: string[] = [];
    if (importObject) {
        for (const [importKey, value] of Object.entries(importObject)) {
            wasmHandlerDebug("workerProxy pushing importKey: ", importKey);
            knownImports.push(importKey);
        }
    }
    if (threadRemote && channel && handleImportFunc) {
        wasmHandlerDebug("workerProxy calling instantiate");
        threadRemote.instantiate(moduleSource, knownImports, channel, handleImportFunc);
    } else {
        throw new Error("workerProxy, channel or handleImportFunc not set");
    }
    return instanceProxy;
}

function threadWrapAllImports(
    knownImports: string[],
    channel: Channel,
    handleImport: HandleWasmImportFunc,
    getMemoryFunc: GetMemoryFunc,
    recieveMemoryFunc: ReciveMemoryFunc
): WebAssembly.Imports {
    wasmThreadDebug("threadWrapAllImports");

    const updatedImports: Record<string, WebAssembly.ModuleImports> = {};
    for (const [_importKey, importValue] of Object.entries(knownImports)) {
        updatedImports[importValue] = threadWrapImportNamespace(
            importValue,
            channel,
            handleImport,
            getMemoryFunc,
            recieveMemoryFunc
        );
    }
    return updatedImports;
}

function threadWrapImportNamespace(
    importName: string,
    channel: Channel,
    handleImport: HandleWasmImportFunc,
    getMemoryFunc: GetMemoryFunc,
    recieveMemoryFunc: ReciveMemoryFunc
): WebAssembly.ModuleImports {
    wasmThreadDebug("threadWrapImportNamespace importName: ", importName);

    const impDummy: WebAssembly.ModuleImports = {};

    const importsProxy = new Proxy(impDummy, {
        get: (target, name, receiver) => {
            wasmThreadDebug(`threadWrapImportNamespace importName: ${importName} get:`, name);

            const myChannel = channel;
            const myImportName = importName;
            const functionName = name as string;
            const wrappedFunction = (...args: any[]) => {
                const messageId = uuidv4();
                wasmThreadDebug(
                    `threadWrapImportNamespace calling wrappedFunction ${functionName} messageId: ${messageId} args: `,
                    args
                );
                //wasmThreadDebug(`threadWrapAllImports calling wrappedFunction ${functionName} myChannel: `, myChannel);

                let memory = getMemoryFunc();
                if (!USED_SHARED_MEMORY) {
                    memory = comlink.transfer(memory, [memory]);
                }
                try {
                    handleImport(messageId, myImportName, functionName, args, memory);
                } catch (err: any) {
                    console.log("threadWrapImportNamespace handleImport: ", err);
                }
                const retMessage = readMessage(myChannel, messageId);
                const retValue = retMessage.return;
                const errValue = retMessage.error;

                if (USED_SHARED_MEMORY) {
                    recieveMemoryFunc(memory);
                } else {
                    const numberArrayMemory = retMessage.memory as number[];
                    const typedArrayMemory = new Uint8Array(numberArrayMemory);
                    const buf = typedArrayMemory.buffer;
                    wasmThreadDebug(
                        `threadWrapImportNamespace returning from wrappedFunction ${functionName} with buf: `,
                        buf
                    );
                    recieveMemoryFunc(buf);
                }

                //wasmThreadDebug(`threadWrapImportNamespace returning from wrappedFunction ${functionName} with typedArrayMemory: `, typedArrayMemory);
                wasmThreadDebug(
                    `threadWrapImportNamespace returning from wrappedFunction ${functionName} with retValue: `,
                    retValue
                );
                wasmThreadDebug(
                    `threadWrapImportNamespace error thrown from wrappedFunction ${functionName} with errValue: `,
                    errValue
                );
                if (errValue) {
                    throw errValue;
                }
                return retValue;
            };
            return wrappedFunction;
        },
    });
    return importsProxy;
}
