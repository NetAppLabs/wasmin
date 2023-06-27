import { Asyncify } from "./vendored/asyncify/asyncify.js";
import {
    Channel,
    makeAtomicsChannel,
    makeChannel,
    readMessage,
    syncSleep,
    uuidv4,
    writeMessage,
} from "./vendored/sync-message/index.js";
import { isFunction } from "./workerUtils.js";
import * as comlink from "comlink";
import Worker, { createWorker } from "./vendored/web-worker/index.js";
import { copyBuffer, isNode, sleep } from "./wasiUtils.js";
import { WasmThreadRunner } from "./wasmThreadRunner.js";

//
// desyncify is for allowing async imports in a WebAssembly.Instance
// implemented by running the WebAssembly.Instance itelf as a Worker running within WasmThreadRunner
// using SharedArrayBuffer as memory.
// If the WebAssembly.Instance exported memory is not shared it is copied over.
//

// If true uses a SharedArrayBuffer as memory passed between workers
export const USE_SHARED_MEMORY = true;

// Copies the SharedArrayBuffer if true over to ArrayBuffer
// Workaround for issues such as with TextDecoder
export const USE_SHARED_ARRAYBUFFER_WORKAROUND = false;

declare let globalThis: any;
globalThis.WASM_THREAD_DEBUG = false;

export function wasmThreadDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_THREAD_DEBUG) {
        if (isNode()) {
            workerDebugNode(msg, ...optionalParams);
        } else {
            console.debug(msg, ...optionalParams);
        }
    }
}

globalThis.WASM_HANDLER_DEBUG = false;

export function wasmHandlerDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_HANDLER_DEBUG) {
        if (isNode()) {
            workerDebugNode(msg, ...optionalParams);
        } else {
            console.debug(msg, ...optionalParams);
        }
    }
}

export async function workerDebugNode(msg?: any, ...optionalParams: any[]): Promise<void> {
    const { parentPort } = await import("node:worker_threads");
    if (parentPort) {
        parentPort.postMessage(msg);
        const message = { msg: msg, params: [...optionalParams] };
        parentPort.postMessage(message);
    } else {
        console.debug(msg, ...optionalParams);
    }
}

export type ImportExportReference = {
    moduleInstanceId: string;
    exportRef: string;
};

export type WrappedExportedFunction = {
    isWrappedFunction: boolean;
    moduleInstanceId: string;
    functionName: string;
};

export type ImportReference = ImportExportReference | string | SharedArrayBuffer;

export type ReciveMemoryFunc = (buf: ArrayBuffer) => void;

export type HandleWasmImportFunc = (
    messageId: string,
    importName: string,
    functionName: string,
    args: any[],
    memory: ArrayBuffer
) => any;

export type GetMemoryFunc = (functionName: string) => ArrayBuffer;

export async function instantiateWithAsyncDetection(
    wasmModOrBufSource: WebAssembly.Module | BufferSource,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc
): Promise<{
    instance: WebAssembly.Instance;
    isAsync: boolean;
    channel?: Channel;
    worker?: Worker;
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
    }

    return instantiateOnThreadRemote(sourceBuffer, imports, handleImportFunc);
}

export async function instantiateOnThreadRemote(
    sourceBuffer: BufferSource | null,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc,
    worker?: Worker,
    threadRemote?: comlink.Remote<WasmThreadRunner>
): Promise<{
    instance: WebAssembly.Instance;
    isAsync: boolean;
    channel?: Channel;
    worker?: Worker;
    threadRemote?: comlink.Remote<WasmThreadRunner>;
    moduleInstanceId?: string;
}> {
    wasmHandlerDebug("instantiate making channel");
    let channel: Channel | null;
    if (USE_SHARED_MEMORY) {
        channel = makeChannel();
    } else {
        const bufferSize = 64 * 1024 * 1024;
        channel = makeAtomicsChannel({ bufferSize });
    }
    wasmHandlerDebug("instantiate made channel: ", channel);

    if (channel) {
        if (!sourceBuffer) {
            throw new Error("BufferSource must be set for non-asyncified wasm modules to work");
        }

        if (!threadRemote) {
            [worker, threadRemote] = await acquireThreadRemote();
        }

        wasmHandlerDebug("instantiate wrapped threadRemote");
        const moduleInstanceId = uuidv4();
        wasmHandlerDebug("instantiate wrapped threadRemote moduleInstanceId: ", moduleInstanceId);
        const proxiedInstance = await handlerInstanciateProxy(
            sourceBuffer,
            imports,
            channel,
            threadRemote,
            handleImportFunc,
            moduleInstanceId
        );
        wasmHandlerDebug("instantiate returning");

        return {
            instance: proxiedInstance,
            isAsync: false,
            channel: channel,
            worker: worker,
            threadRemote: threadRemote,
            moduleInstanceId: moduleInstanceId,
        };
    } else {
        throw new Error("Unable to create message channel");
    }
}

export const USE_SINGLE_THREAD_REMOTE = true;

async function acquireThreadRemote(): Promise<[Worker, comlink.Remote<WasmThreadRunner>]> {
    const useNodeWorkerThreads = false;
    let worker: Worker;
    if (useNodeWorkerThreads) {
        const workerPath =
            "file:///Users/tryggvil/Development/netapp/wasm/wasm-env/packages/wasi-js/dist/wasmThread.js";
        const workerUrl = new URL(workerPath);
        worker = new Worker(workerUrl);
    } else {
        let workerUrlString = "./wasmThread.js";
        if (isNode()) {
            workerUrlString = "./wasmThreadNode.js";
        }
        const workerUrl = new URL(workerUrlString, import.meta.url);

        wasmHandlerDebug("workerUrl:", workerUrl);
        worker = await createWorker(workerUrl, { type: "module" });
        wasmHandlerDebug("createWorker: ", worker);
    }

    if (worker) {
        worker.addEventListener("message", (msg: MessageEvent<any>) => {
            //worker.on("message", (msg: MessageEvent<any>) => {
            if (globalThis.WASM_THREAD_DEBUG) {
                // console.log("WasmThread worker message received: ", msg);
            }
        });
        //worker.on("error", err => console.log("`Worker error:", err));
        //worker.on("exit", code => console.log(`Worker exited with code ${code}.`));
    }
    wasmHandlerDebug("acquireWorker started worker");
    const threadRemote = comlink.wrap<WasmThreadRunner>(worker);
    return [worker, threadRemote];
}

async function handlerInstanciateProxy(
    moduleSource: BufferSource,
    importObject?: WebAssembly.Imports,
    channel?: Channel,
    threadRemote?: comlink.Remote<WasmThreadRunner>,
    handleImportFunc?: HandleWasmImportFunc,
    moduleInstanceId?: string
): Promise<WebAssembly.Instance> {
    wasmHandlerDebug("instantiateProxy");

    let exportChannel: Channel | null;
    if (USE_SHARED_MEMORY) {
        exportChannel = makeChannel();
    } else {
        const bufferSize = 64 * 1024 * 1024;
        exportChannel = makeAtomicsChannel({ bufferSize });
    }

    const exportsDummy: WebAssembly.Exports = {};
    const exportsProxy = new Proxy(exportsDummy, {
        get: (target, name, receiver) => {
            // console.log("handlerInstanciateProxy: target: ", target, "name", name, "receiver", receiver);
            // console.log("instantiateProxy get:", name);
            if (threadRemote && moduleInstanceId) {
                wasmHandlerDebug("instantiateProxy creating wrappedExportFunction");
                // hack - refine this:
                if (name == "$imports") {
                    // TODO: imlement fetching local $imports from local
                    // moduleinstance if using shared worker
                    const expFunc = threadRemote.executeExportedFunction;
                    const imp = expFunc(moduleInstanceId, name, []);
                    return imp;
                }
                if (name == "memory") {
                    const expFunc = threadRemote.executeExportedFunction;
                    const imp = expFunc(moduleInstanceId, name, []);
                    return imp;
                }

                // if wrapExportFunctionSync is true it wraps it in a synchronous function
                // using syncmessage readMessage and writeMessage
                const wrapExportFunctionSync = false;
                const functionName = name as string;
                let wrappedExportFunction = undefined;

                if (wrapExportFunctionSync) {
                    // In this case the wrappedExportFunction is synchronous
                    wrappedExportFunction = (...args: any[]) => {
                        wasmHandlerDebug("instantiateProxy calling wrappedExportFunction synchronous");
                        if (name == "6") {
                            console.log("instantiateProxy calling wrappedExportFunction synchronous with name 6");
                        }
                        wasmHandlerDebug(
                            "instantiateProxy calling wrappedExportFunction synchronous functionName: ",
                            functionName
                        );
                        const messageId = uuidv4();
                        const expFunc = threadRemote.executeExportedFunctionSync;
                        if (exportChannel) {
                            expFunc(moduleInstanceId, exportChannel, messageId, functionName, args);
                            wasmThreadDebug("threadWrapImportNamespace after : readMessage");
                            const checkInterrupt = function checkInterrupt(): boolean {
                                return true;
                            };
                            const retries = 100;
                            let retValue = undefined;
                            let errValue = undefined;
                            for (let i = 0; i < retries; i++) {
                                const retMessage = readMessage(exportChannel, messageId, { checkInterrupt });
                                if (retMessage) {
                                    retValue = retMessage.return;
                                    errValue = retMessage.error;
                                    break;
                                } else {
                                    syncSleep(1, exportChannel);
                                }
                            }
                            if (errValue) {
                                console.error("threadWrapImportNamespace after : readMessage error:", errValue);
                                throw errValue;
                            }
                            return retValue;
                        } else {
                            console.warn("channel not set for handlerInstanciateProxy wrappedExportFunctionSync");
                        }
                    };
                } else {
                    // In this case the wrappedExportFunction is async
                    wrappedExportFunction = async (...args: any[]) => {
                        wasmHandlerDebug("instantiateProxy calling wrappedExportFunction async");
                        const functionName = name as string;
                        if (name == "6") {
                            console.log("instantiateProxy calling wrappedExportFunction async with name 6");
                        }
                        wasmHandlerDebug(
                            "instantiateProxy calling wrappedExportFunction async functionName: ",
                            functionName
                        );
                        const expFunc = threadRemote.executeExportedFunction;
                        const retval = await expFunc(moduleInstanceId, functionName, args);
                        return retval;
                    };
                }

                const wrappedExportedFunctionTyped = wrappedExportFunction as unknown as WrappedExportedFunction;
                // custom properties set to wrappedExportFunction function:
                wrappedExportedFunctionTyped.isWrappedFunction = true;
                wrappedExportedFunctionTyped.functionName = name as string;
                wrappedExportedFunctionTyped.moduleInstanceId = moduleInstanceId as string;

                return wrappedExportFunction;
            } else {
                throw new Error("threadRemote or moduleInstanceId not set");
            }
        },
    });
    wasmHandlerDebug("workerProxy creating: instanceProxy");
    const instanceProxy: WebAssembly.Instance = {
        exports: exportsProxy,
    };
    wasmHandlerDebug("workerProxy created: instanceProxy");
    const knownImports: Record<string, Record<string, ImportReference>> = {};
    if (importObject) {
        for (const [importKey, value] of Object.entries(importObject)) {
            wasmHandlerDebug("workerProxy pushing importKey: ", importKey);
            knownImports[importKey] = {};
            if (value.$imports) {
                const importValue = value.$imports as any as string;
                const importsForNamespace = knownImports[importKey];
                importsForNamespace["$imports"] = importValue;
            }
            for (const [refKey, refValue] of Object.entries(value)) {
                if (isFunction(refValue)) {
                    const importFunc = refValue as unknown as WrappedExportedFunction;
                    if (importFunc.isWrappedFunction) {
                        const funcReference: ImportExportReference = {
                            exportRef: importFunc.functionName,
                            moduleInstanceId: importFunc.moduleInstanceId,
                        };
                        const importsForNamespace = knownImports[importKey];
                        importsForNamespace[refKey] = funcReference;
                    }
                } else {
                    if (refValue instanceof SharedArrayBuffer) {
                        const importsForNamespace = knownImports[importKey];
                        importsForNamespace[refKey] = refValue;
                    }
                }
            }
        }
    }
    if (threadRemote && channel && handleImportFunc) {
        wasmHandlerDebug("workerProxy calling instantiate");
        threadRemote.instantiate(moduleSource, knownImports, channel, handleImportFunc, moduleInstanceId);
    } else {
        throw new Error("workerProxy, channel or handleImportFunc not set");
    }
    return instanceProxy;
}
