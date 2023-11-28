import { Asyncify } from "./vendored/asyncify/asyncify.js";
import { Channel, makeChannel, readMessage, syncSleep, uuidv4 } from "./vendored/sync-message/index.js";
import { isFunction, wasmHandlerDebug } from "./workerUtils.js";
import * as comlink from "comlink";
import Worker, { createWorker } from "./vendored/web-worker/index.js";
import { isNode } from "./wasiUtils.js";
import { WasmWorker } from "./wasmWorker.js";
import { WasmCoreWorkerThreadRunner } from "./wasmCoreWorkerThreadRunner.js";
import { instantiatePromisified } from "@wasmin/wasm-promisify"; 

//
// desyncify is for allowing async imports in a WebAssembly.Instance
// implemented by running the WebAssembly.Instance itelf as a Worker running within WasmThreadRunner
// using SharedArrayBuffer as memory.
// If the WebAssembly.Instance exported memory is not shared it is copied over.
//

declare let globalThis: any;
let promisifyEnabled = true;

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

// Function for storing memory for wasm instance received from worker
export type StoreReceivedMemoryFunc = (buf: ArrayBuffer) => void;
// Function for preparing memory to be sent over to worker
export type GetMemoryForSendFunc = (functionName: string) => ArrayBuffer;

export type HandleWasmImportFunc = (
    messageId: string,
    importName: string,
    functionName: string,
    args: any[],
    memory: ArrayBuffer
) => any;

export type HandleWasmComponentImportFunc = (
    channel: Channel,
    messageId: string,
    importName: string,
    functionName: string,
    args: any[]
) => any;

export async function instantiateWithAsyncDetection(
    wasmModOrBufSource: WebAssembly.Module | BufferSource,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc
): Promise<{
    instance: WebAssembly.Instance;
    isAsyncified: boolean;
    channel?: Channel;
    worker?: WasmWorker;
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
        return { instance: asyncifiedInstance, isAsyncified: isAsyncified };
    } else if (promisifyEnabled) {
        const promInstance = await instantiatePromisified(wasmMod, imports);
        return { instance: promInstance, isAsyncified: false };
    }
    return instantiateOnWasmWorker(sourceBuffer, imports, handleImportFunc);
}

export async function instantiateOnWasmWorker(
    sourceBuffer: BufferSource | null,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc,
    worker?: WasmWorker
): Promise<{
    instance: WebAssembly.Instance;
    isAsyncified: boolean;
    channel?: Channel;
    worker?: WasmWorker;
    moduleInstanceId?: string;
}> {
    wasmHandlerDebug("instantiate making channel");
    let channel: Channel | null;
    channel = makeChannel();
    wasmHandlerDebug("instantiate made channel: ", channel);

    if (channel) {
        if (!sourceBuffer) {
            throw new Error("BufferSource must be set for non-asyncified wasm modules to work");
        }

        // Create a worker if it is not passed in
        if (!worker) {
            worker = new WasmWorker();
            await worker.createCoreWorker();
        }

        const threadRemote = worker?.coreRunner;
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
            isAsyncified: false,
            channel: channel,
            worker: worker,
            moduleInstanceId: moduleInstanceId,
        };
    } else {
        throw new Error("Unable to create message channel");
    }
}

async function handlerInstanciateProxy(
    moduleSource: BufferSource,
    importObject?: WebAssembly.Imports,
    channel?: Channel,
    threadRemote?: comlink.Remote<WasmCoreWorkerThreadRunner>,
    handleImportFunc?: HandleWasmImportFunc,
    moduleInstanceId?: string
): Promise<WebAssembly.Instance> {
    wasmHandlerDebug("instantiateProxy");

    //let exportChannel: Channel | null;
    //exportChannel = makeChannel();

    const exportsDummy: WebAssembly.Exports = {};
    const exportsProxy = new Proxy(exportsDummy, {
        get: (target, name, receiver) => {
            // edge case when the Proxy is await-ed
            if (name == "then") {
                return undefined;
            }

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
                        wasmHandlerDebug(
                            "instantiateProxy calling wrappedExportFunction synchronous functionName: ",
                            functionName
                        );
                        const messageId = uuidv4();
                        const expFunc = threadRemote.executeExportedFunctionSync;
                        const exportChannel = channel;
                        if (exportChannel) {
                            expFunc(moduleInstanceId, exportChannel, messageId, functionName, args);
                            //wasmHandlerDebug("threadWrapImportNamespace after : readMessage");
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
                        const sargs = await args;
                        wasmHandlerDebug(
                            "instantiateProxy calling wrappedExportFunction async functionName: ",
                            functionName,
                            ", sargs: ",
                            sargs,
                            "moduleInstanceId: ",
                            moduleInstanceId
                        );
                        const expFunc = threadRemote.executeExportedFunction;
                        const retval = await expFunc(moduleInstanceId, functionName, sargs);
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
