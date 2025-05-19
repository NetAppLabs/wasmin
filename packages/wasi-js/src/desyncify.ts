/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Asyncify, proxyGet } from "./vendored/asyncify/asyncify.js";
import { Channel, makeChannel, readMessage, syncSleep, uuidv4 } from "./vendored/sync-message/index.js";
import { isFunction } from "./workerUtils.js";
import * as comlink from "comlink";
import { WasmWorker } from "./wasmWorker.js";
import { WasmCoreWorkerThreadRunner } from "./wasmCoreWorkerThreadRunner.js";
import { instantiatePromisified, isStackSwitchingEnabled as isStackSwitchingEnabledPromisify, isJspiEnabled, instantiateJSPIwrapped } from "@netapplabs/wasm-promisify";
import { wasmWorkerClientDebug } from "./wasiDebug.js";

//
// desyncify is for allowing async imports in a WebAssembly.Instance
// implemented by a running the module with optional strategies described in instantiateWithAsyncDetection 
//
// "asyncify" | "jspi" | "worker-core-memory-shared" | "worker-core-memory-copy"
//
// 
// worker-component for running a component in a dedicated Worker
// jspi-component for running a component in a modified jspi capable module
//

/**
 * Run modes for core WebAssembly Modules
 * 
 * asyncify:
 *   Module must be pre-processed with asyncify.
 *   Used if module is found to to be asyncified.
 * 
 * jspi:
 *   Module is unmodified, but runtime must have support for experimental-wasm-stack-switching
 *   or Javascript Promise Integration.
 *   Used if jspi is availalable in runtime.
 *   Implemented by creating a Proxy WebAssembly.Instance and creating wrapper Wasm binaries
 *   in runtime using @netapplabs/wasm-promisify library.
 * 
 * worker-core-memory-shared:
 *    Running the WebAssembly.Instance itelf as a Worker running within WasmCoreWorkerThreadRunner
 *    Module is modified by changing memory export to be Shared.
 *    Used if module has an exported shared memory.
 *    Returned WebAssembly.Instance is a proxy of the actual WebAssembly.Instance that is
 *    running within the Worker.
 *    For this case the wasmModOrBufSource must be a BufferSource and can not be a WebAssembly.Module
 *    and handleImportFunc must be set.
 *    Memory is passed between threads as SharedArrayBuffer.
 * 
 * worker-core-memory-copy:
 *    Running the WebAssembly.Instance itelf as a Worker running within WasmCoreWorkerThreadRunner
 *    Module is unmodified and memory is copied between threads.
 *    Returned WebAssembly.Instance is a proxy of the actual WebAssembly.Instance that is
 *    running within the Worker.
 *    For this case the wasmModOrBufSource must be a BufferSource and can not be a WebAssembly.Module
 *    and handleImportFunc must be set.
 *    This is the fallback method if none of the above work.
 */
export type WasmCoreRunMode = "asyncify" | "jspi" | "stack-switching" | "worker-core-memory-shared" | "worker-core-memory-copy";

/**
 * Run modes for core WebAssembly Components
 * 
 * worker-component:
 *   Component is run in a dedicated WebWorker with WASI in main thread.
 * 
 * jspi-component:
 *   Component is unmodified, but runtime must have support for experimental-wasm-stack-switching
 *   or Javascript Promise Integration.
 *   Used if jspi is availalable in runtime.
 *   Implemented by creating a Proxy WebAssembly.Instance and creating wrapper Wasm binaries
 *   in runtime using @netapplabs/wasm-promisify library.
 */
export type WasmComponentRunMode = "worker-component" | "jspi-component" | "stack-switching-component";

export type WasmRunMode = WasmCoreRunMode | WasmComponentRunMode;

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

/**
 * Function for storing memory for WebAssembly.Instance received from worker
 */
export type StoreReceivedMemoryFunc = (buf: ArrayBufferLike) => void;

/**
 * Function for preparing memory from WebAssembly.Instance to be sent over to worker
 */
export type GetMemoryForSendFunc = (functionName: string) => ArrayBufferLike;

/**
 * Function for handling import calls from a WebAssembly.Instance to
 * (WASI) implementor for a core WebAssembly.Instance
 */
export type HandleWasmImportFunc = (
    messageId: string,
    importName: string,
    functionName: string,
    args: any[],
    memory: ArrayBufferLike
) => any;

export type HandleCallType = "resource" | "import";

/**
 * Function for handling import calls from a WebAssembly component to
 * (WASI) implementor for a WebAssembly component
 */
export type HandleWasmComponentImportFunc = (
    channel: Channel,
    messageId: string,
    callType: HandleCallType,
    identifierName: string,
    functionName: string,
    args: any[]
) => any;


export function isStackSwitchingEnabled() {
    return isStackSwitchingEnabledPromisify();
}

/**
 * 
 * Instanciates a WebAssembly.Instance with the strategies:
 * 
 * asyncify:
 *   Module must be pre-processed with asyncify.
 *   Used if module is found to to be asyncified.
 * 
 * jspi:
 *   Module is unmodified, but runtime must have support for experimental-wasm-stack-switching
 *   or Javascript Promise Integration.
 *   Used if jspi is availalable in runtime.
 *   Implemented by creating a Proxy WebAssembly.Instance and creating wrapper Wasm binaries
 *   in runtime using @netapplabs/wasm-promisify library.
 * 
 * worker-core-memory-shared:
 *    Running the WebAssembly.Instance itelf as a Worker running within WasmThreadRunner
 *    Module is modified by changing memory export to be Shared.
 *    Used if module has an exported shared memory.
 *    Returned WebAssembly.Instance is a proxy of the actual WebAssembly.Instance that is
 *    running within the Worker.
 *    For this case the wasmModOrBufSource must be a BufferSource and can not be a WebAssembly.Module
 *    and handleImportFunc must be set.
 *    Memory is passed between threads as SharedArrayBuffer.
 * 
 * worker-core-memory-copy:
 *    Running the WebAssembly.Instance itelf as a Worker running within WasmThreadRunner
 *    Module is unmodified and memory is copied between threads.
 *    Returned WebAssembly.Instance is a proxy of the actual WebAssembly.Instance that is
 *    running within the Worker.
 *    For this case the wasmModOrBufSource must be a BufferSource and can not be a WebAssembly.Module
 *    and handleImportFunc must be set.
 *    This is the fallback method if none of the above work.
 * 
*/
export async function instantiateWithAsyncDetection(
    wasmModOrBufSource: WebAssembly.Module | BufferSource,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc
): Promise<{
    instance: WebAssembly.Instance;
    runMode: WasmRunMode,
    channel?: Channel;
    worker?: WasmWorker;
}> {
    wasmWorkerClientDebug("instantiateWithAsyncDetection");
    let isAsyncified = false;
    let wasmMod: WebAssembly.Module;
    let sourceBuffer: BufferSource | null = null;
    let jspiEnabled = isJspiEnabled();
    let stackSwitchingEnabled = isStackSwitchingEnabled();
    if (wasmModOrBufSource instanceof ArrayBuffer || ArrayBuffer.isView(wasmModOrBufSource)) {
        sourceBuffer = wasmModOrBufSource as BufferSource;
        wasmMod = await WebAssembly.compile(sourceBuffer);
    } else {
        wasmMod = wasmModOrBufSource as WebAssembly.Module;
    }
    const syncInstance = await WebAssembly.instantiate(wasmMod, imports);
    if (syncInstance.exports["asyncify_get_state"] == null) {
        isAsyncified = false;
        wasmWorkerClientDebug("asyncify_get_state == null , isAsync: ", isAsyncified);
    } else {
        // TODO: look into issue with wasi_vfs_pack_fs + asyncify - disable for now
        if (syncInstance.exports["wasi_vfs_pack_fs"] != null) {
            isAsyncified = false;
        } else {
            isAsyncified = true;
        }
        wasmWorkerClientDebug("asyncify_get_state != null, isAsync: ", isAsyncified);
    }
    if (isAsyncified) {
        wasmWorkerClientDebug("module is Asyncified attempting Asyncify instantiate");
        const state = new Asyncify();
        const asyncifiedInstance = await WebAssembly.instantiate(wasmMod, state.wrapImports(imports));
        state.init(asyncifiedInstance, imports);
        return { instance: asyncifiedInstance, runMode: "asyncify" };
    } else if (jspiEnabled) {
        wasmWorkerClientDebug("jspi available - attempting instantiatePromisified");
        const promInstance = await instantiateJSPIwrapped(wasmMod, imports);
        return { instance: promInstance, runMode: "jspi" };

    } else if (stackSwitchingEnabled) {
        wasmWorkerClientDebug("jspi available - attempting instantiatePromisified");
        const promInstance = await instantiatePromisified(wasmMod, imports);
        return { instance: promInstance, runMode: "stack-switching" };
    }
    wasmWorkerClientDebug("fallback on instantiating instance on WasmWorker");
    return instantiateOnWasmWorker(sourceBuffer, imports, handleImportFunc);
}

/**
 * Instanciates a WebAssembly.Instance from client
 * on worker by sending the module bytes to the
 * WasmWorker (threadRemote)
 */
export async function instantiateOnWasmWorker(
    sourceBuffer: BufferSource | null,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc,
    worker?: WasmWorker
): Promise<{
    instance: WebAssembly.Instance;
    runMode: WasmRunMode
    channel?: Channel;
    worker?: WasmWorker;
    moduleInstanceId?: string;
}> {
    wasmWorkerClientDebug("instantiate making channel");
    let channel: Channel | null;
    channel = makeChannel();
    wasmWorkerClientDebug("instantiate made channel: ", channel);

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
        wasmWorkerClientDebug("instantiate wrapped threadRemote");
        const moduleInstanceId = uuidv4();
        wasmWorkerClientDebug("instantiate wrapped threadRemote moduleInstanceId: ", moduleInstanceId);
        const proxiedInstanceRes = await wasmWorkerClientInstanciateProxy(
            sourceBuffer,
            imports,
            channel,
            threadRemote,
            handleImportFunc,
            moduleInstanceId
        );
        let proxiedInstance = proxiedInstanceRes.instance;
        let runMode = proxiedInstanceRes.runMode;
        wasmWorkerClientDebug("instantiate returning");

        return {
            instance: proxiedInstance,
            runMode: runMode,
            channel: channel,
            worker: worker,
            moduleInstanceId: moduleInstanceId,
        };
    } else {
        throw new Error("Unable to create message channel");
    }
}

/**
 * 
 * Instanciates a Proxy object for a WebAssembly.Instance on the
 * client-side for communicating with the WasmWorker
 * 
 */
async function wasmWorkerClientInstanciateProxy(
    moduleSource: BufferSource,
    importObject?: WebAssembly.Imports,
    channel?: Channel,
    threadRemote?: comlink.Remote<WasmCoreWorkerThreadRunner>,
    handleImportFunc?: HandleWasmImportFunc,
    moduleInstanceId?: string
): Promise<{instance: WebAssembly.Instance, runMode: WasmRunMode}> {
    wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy");

    const exportsDummy: WebAssembly.Exports = {};
    const exportsProxy = new Proxy(exportsDummy, {
        get: (target, name, receiver) => {
            // edge case when the Proxy is await-ed
            if (name == "then") {
                return undefined;
            }

            // wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy: target: ", target, "name", name, "receiver", receiver);
            // wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy get:", name);
            if (threadRemote && moduleInstanceId) {
                wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy creating wrappedExportFunction");
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
                        wasmWorkerClientDebug(
                            "wasmWorkerClientInstanciateProxy calling wrappedExportFunction synchronous functionName: ",
                            functionName
                        );
                        const messageId = uuidv4();
                        const expFunc = threadRemote.executeExportedFunctionSync;
                        const exportChannel = channel;
                        if (exportChannel) {
                            expFunc(moduleInstanceId, exportChannel, messageId, functionName, args);
                            //wasmWorkerClientDebug("threadWrapImportNamespace after : readMessage");
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
                            console.warn("channel not set for wasmWorkerClientInstanciateProxy wrappedExportFunctionSync");
                        }
                    };
                } else {
                    // In this case the wrappedExportFunction is async
                    wrappedExportFunction = async (...args: any[]) => {
                        wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy calling wrappedExportFunction async");
                        const functionName = name as string;
                        const sargs = await args;
                        wasmWorkerClientDebug(
                            "wasmWorkerClientInstanciateProxy calling wrappedExportFunction async functionName: ",
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
                throw new Error("wasmWorkerClientInstanciateProxy threadRemote or moduleInstanceId not set");
            }
        },
    });
    wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy threadRemote creating: instanceProxy");
    const instanceProxy: WebAssembly.Instance = {
        exports: exportsProxy,
    };
    wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy threadRemote created: instanceProxy");
    const knownImports: Record<string, Record<string, ImportReference>> = {};
    if (importObject) {
        for (const [importKey, value] of Object.entries(importObject)) {
            wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy threadRemote pushing importKey: ", importKey);
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
        wasmWorkerClientDebug("wasmWorkerClientInstanciateProxy calling instantiate on threadRemote");
        const runMode = await threadRemote.instantiate(moduleSource, knownImports, channel, handleImportFunc, moduleInstanceId);
        return {instance: instanceProxy, runMode: runMode};
    } else {
        throw new Error("wasmWorkerClientInstanciateProxy threadRemote, channel or handleImportFunc not set");
    }
}
