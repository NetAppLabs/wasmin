import {
    GetMemoryForSendFunc,
    HandleWasmImportFunc,
    ImportExportReference,
    ImportReference,
    StoreReceivedMemoryFunc,
} from "./desyncify.js";
import { Channel, readMessage, uuidv4, writeMessage } from "./vendored/sync-message/index.js";
import { copyBuffer, sleep } from "./wasiUtils.js";
import { initializeComlinkHandlers, isFunction, wasmWorkerThreadDebug } from "./workerUtils.js";
import * as comlink from "comlink";

export class WasmCoreWorkerThreadRunner {
    constructor() {
        wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner creating");
        initializeComlinkHandlers();
        this._wasmInstances = {};
    }
    private _wasmInstances: Record<string, WebAssembly.Instance>;
    private _exportsMemory?: WebAssembly.Memory;
    private _sharedMemory?: SharedArrayBuffer;
    private _handleImportFunc?: HandleWasmImportFunc;

    get exportsMemory() {
        return this._exportsMemory;
    }

    get sharedMemory() {
        return this._sharedMemory;
    }

    get handleImportFunc() {
        return this._handleImportFunc;
    }

    get wasmInstances() {
        return this._wasmInstances;
    }

    public async instantiate(
        modSource: BufferSource,
        knownImports: Record<string, Record<string, ImportReference>>,
        channel: Channel,
        handleImportFunc: HandleWasmImportFunc,
        moduleInstanceId?: string
    ): Promise<void> {
        wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner instantiate");

        const storeReceivedMemoryFuncLocal = (buf: ArrayBuffer) => {
            wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner calling storeReceivedMemoryFuncLocal");
            if (this && this.exportsMemory) {
                const mem = this.exportsMemory as WebAssembly.Memory;
                if (mem.buffer instanceof SharedArrayBuffer) {
                    wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner storeReceivedMemoryFuncLocal isSharedArrayBuffer");
                    // no need to copy if SharedArrayBuffer
                } else {
                    // copy buf into wasm memory
                    wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner storeReceivedMemoryFuncLocal copyBuffer", buf, mem.buffer);
                    copyBuffer(buf, mem.buffer);
                }
            } else {
                throw new Error("WasmCoreWorkerThreadRunner this.exportsMemory not set");
            }
        };

        const getMemoryForSendFuncLocal = (functionName: string) => {
            wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner calling getMemoryForSendFunc");
            if (this && this.exportsMemory) {
                const mem = this.exportsMemory as WebAssembly.Memory;
                //wasmWorkerThreadDebug(`WasmCoreWorkerThreadRunner calling getMemoryForSendFunc functionName: ${functionName} mem: ${mem}`);
                if (mem.buffer instanceof SharedArrayBuffer) {
                    wasmWorkerThreadDebug(
                        `WasmCoreWorkerThreadRunner calling getMemoryForSendFunc functionName: ${functionName} with SharedArrayBuffer`
                    );
                    this._sharedMemory = mem.buffer as SharedArrayBuffer;
                } else {
                    wasmWorkerThreadDebug(
                        `WasmCoreWorkerThreadRunner calling getMemoryForSendFunc functionName: ${functionName} with non-SharedArrayBuffer`
                    );
                    if (!this._sharedMemory) {
                        this._sharedMemory = new SharedArrayBuffer(mem.buffer.byteLength);
                    } else {
                        if (this._sharedMemory.byteLength != mem.buffer.byteLength) {
                            this._sharedMemory = new SharedArrayBuffer(mem.buffer.byteLength);
                        }
                    }
                    wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner getMemoryForSendFuncLocal copyBuffer: ", mem.buffer, this.sharedMemory);
                    copyBuffer(mem.buffer, this._sharedMemory);
                }
                return this._sharedMemory;
            }
            throw new Error(`Coud not get WebAssembly instance memory - functionName: ${functionName}`);
        };

        // Imports are wrapped to be handled on remote worker
        // imports are processed by the handleImportFunc proxy
        const wrappedImports = threadWrapAllImports(
            this,
            knownImports,
            channel,
            handleImportFunc,
            getMemoryForSendFuncLocal,
            storeReceivedMemoryFuncLocal
        );

        // Actual module instntiation on this worker
        const instantiatedSource = await WebAssembly.instantiate(modSource, wrappedImports);

        if (moduleInstanceId) {
            this.wasmInstances[moduleInstanceId] = instantiatedSource.instance;
        } else {
            console.warn("Warning, moduleInstanceId is undefined for WasmCoreWorkerThreadRunner.instantiate");
        }
        this._handleImportFunc = handleImportFunc;
        if (
            instantiatedSource.instance.exports &&
            instantiatedSource.instance.exports.memory &&
            instantiatedSource.instance.exports.memory instanceof WebAssembly.Memory
        ) {
            this._exportsMemory = instantiatedSource.instance.exports.memory;
        }
    }

    public cleanup(): void {
        wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner.cleanup");
        if (this.handleImportFunc) {
            wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner.cleanup handleImportFunc: ", this.handleImportFunc);
            // @ts-ignore
            if (this.handleImportFunc[comlink.releaseProxy]) {
                wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner.cleanup handleImportFunc releaseProxy");
                // @ts-ignore
                this.handleImportFunc[comlink.releaseProxy]();
            }
        }
    }

    public async executeExportedFunctionSync(
        moduleInstanceId: string,
        myChannel: Channel,
        messageId: string,
        functionName: string,
        args: any[]
    ): Promise<any> {
        let funcReturn = undefined;
        let funcThrownError = undefined;

        try {
            funcReturn = await this.executeExportedFunction(moduleInstanceId, functionName, args);
        } catch (err: any) {
            funcThrownError = err;
        }
        const response = { return: funcReturn, error: funcThrownError };

        wasmWorkerThreadDebug("executeExportedFunctionSync before : readMessage, channel:", myChannel);
        const retMessage = writeMessage(myChannel, response, messageId);
        wasmWorkerThreadDebug("executeExportedFunctionSync after : readMessage");

        return funcReturn;
    }

    public async executeExportedFunction(moduleInstanceId: string, functionName: string, args: any[]): Promise<any> {
        wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner executeExportedFunction: ", functionName);
        let wasmInstance = this.wasmInstances[moduleInstanceId];
        while (!wasmInstance) {
            wasmWorkerThreadDebug("WasmCoreWorkerThreadRunner executeExportedFunction: waiting for wasmInstance");
            await sleep(100);
            wasmInstance = this.wasmInstances[moduleInstanceId];
        }
        if (wasmInstance) {
            const exportedMember = wasmInstance.exports[functionName] as any;
            if (isFunction(exportedMember)) {
                const exportedfunc = exportedMember;
                try {
                    let result: any;
                    const fn = async () => {
                        result = exportedfunc(...args);
                        wasmWorkerThreadDebug("returning from exportedFunc");
                        return result;
                    };
                    return await fn();
                } catch (err: any) {
                    wasmWorkerThreadDebug(`err catched from from exportedFunc: ${functionName} , err:`, err);
                    if (err instanceof WebAssembly.RuntimeError) {
                        const e = err as WebAssembly.RuntimeError;
                    }
                    throw err;
                }
            } else {
                wasmWorkerThreadDebug(
                    "WasmCoreWorkerThreadRunner executeExportedFunction " + functionName + " exportedMember:",
                    exportedMember
                );
                if (exportedMember instanceof WebAssembly.Memory) {
                    const wasmMem = exportedMember as WebAssembly.Memory;
                    const exportReturn = wasmMem.buffer;
                    return exportReturn;
                } else {
                    return exportedMember;
                }
            }
        } else {
            throw new Error("WasmInstance not set");
        }
    }
}

function threadWrapAllImports(
    wasmThreadRunner: WasmCoreWorkerThreadRunner,
    knownImports: Record<string, Record<string, ImportReference>>,
    channel: Channel,
    handleImport: HandleWasmImportFunc,
    getMemoryForSendFunc: GetMemoryForSendFunc,
    storeReceivedMemoryFunc: StoreReceivedMemoryFunc
): WebAssembly.Imports {
    wasmWorkerThreadDebug("threadWrapAllImports");

    const updatedImports: Record<string, WebAssembly.ModuleImports> = {};
    for (const [importKey, importValues] of Object.entries(knownImports)) {
        updatedImports[importKey] = threadWrapImportNamespace(
            wasmThreadRunner,
            importKey,
            importValues,
            channel,
            handleImport,
            getMemoryForSendFunc,
            storeReceivedMemoryFunc
        );
    }
    return updatedImports;
}

function threadWrapImportNamespace(
    wasmThreadRunner: WasmCoreWorkerThreadRunner,
    importName: string,
    importValues: Record<string, ImportReference>,
    channel: Channel,
    handleImport: HandleWasmImportFunc,
    getMemoryForSendFunc: GetMemoryForSendFunc,
    storeReceivedMemoryFunc: StoreReceivedMemoryFunc
): WebAssembly.ModuleImports {
    wasmWorkerThreadDebug("threadWrapImportNamespace importName: ", importName);

    const impDummy: WebAssembly.ModuleImports = {};

    const importsProxy = new Proxy(impDummy, {
        get: (target, name, receiver) => {
            wasmWorkerThreadDebug(`threadWrapImportNamespace importName: ${importName} get:`, name);

            const myChannel = channel;
            const myImportName = importName;
            const functionName = name as string;
            if (functionName == "random_get") {
                wasmWorkerThreadDebug("in threadWrapImportNamespace proxy get random_get");
            }
            if (myImportName === "env" && functionName === "memory") {
                if (wasmThreadRunner.exportsMemory) {
                    return wasmThreadRunner.exportsMemory;
                } else {
                    throw new Error("env.memory not found");
                }
            }
            if (myImportName === "" && functionName === "$imports") {
                // TODO: special case if $imports and fetch it locally from a string reference
                // if using shared workers use string reference to look up $imports table from another module

                for (const [_modId, wasmInstance] of Object.entries(wasmThreadRunner.wasmInstances)) {
                    const modExport = wasmInstance.exports;
                    if (modExport) {
                        if (modExport.$imports) {
                            return modExport.$imports;
                        }
                    }
                }
            }
            wasmWorkerThreadDebug(`threadWrapImportNamespace : ${functionName} `);
            const importReference = importValues[functionName];
            wasmWorkerThreadDebug(`threadWrapImportNamespace : ${functionName} importReference: `, importReference);
            if (importReference) {
                const importExportReference = importReference as ImportExportReference;
                if (importExportReference.exportRef) {
                    const exportRef = importExportReference.exportRef;
                    const moduleInstanceId = importExportReference.moduleInstanceId;
                    const modInst = wasmThreadRunner.wasmInstances[moduleInstanceId];
                    if (modInst) {
                        const exportedFunc = modInst.exports[exportRef];
                        wasmWorkerThreadDebug(
                            `threadWrapImportNamespace : ${functionName} exportedFunc: `,
                            exportedFunc
                        );
                        return exportedFunc;
                    }
                }
            } else {
                wasmWorkerThreadDebug(`threadWrapImportNamespace : ${functionName} importReference else : `);
                for (const [impKey, impValue] of Object.entries(importValues)) {
                    const importExportReference = impValue as ImportExportReference;
                    if (importExportReference.exportRef) {
                        const exportRef = importExportReference.exportRef;
                        if (exportRef == functionName) {
                            const exportRef = importExportReference.exportRef;
                            const moduleInstanceId = importExportReference.moduleInstanceId;
                            const modInst = wasmThreadRunner.wasmInstances[moduleInstanceId];
                            if (modInst) {
                                const exportedFunc = modInst.exports[exportRef];
                                wasmWorkerThreadDebug(
                                    `threadWrapImportNamespace : ${functionName} else exportedFunc2: `,
                                    exportedFunc
                                );
                                return exportedFunc;
                            }
                        }
                    }
                }
            }
            wasmWorkerThreadDebug("returning wrappedImportFunction for ", functionName);
            const wrappedImportFunction = (...args: any[]) => {
                const messageId = uuidv4();
                wasmWorkerThreadDebug(
                    `threadWrapImportNamespace calling wrappedImportFunction ${functionName} messageId: ${messageId} args: `,
                    args
                );
                let memory: ArrayBuffer;
                try {
                    memory = getMemoryForSendFunc(functionName);
                } catch (err: any) {
                    throw new Error("Error getMemoryForSendFunc: ", err);
                }
                //wasmThreadDebug(`threadWrapImportNamespace wrappedImportFunction importName: ${myImportName} functionName: ${functionName} messageId: ${messageId} memory: `, memory);
                try {
                    wasmWorkerThreadDebug("threadWrapImportNamespace handleImport: ", handleImport);
                    handleImport(messageId, myImportName, functionName, args, memory);
                } catch (err: any) {
                    wasmWorkerThreadDebug("threadWrapImportNamespace handleImport: ", err);
                }
                wasmWorkerThreadDebug("threadWrapImportNamespace before : readMessage, channel:", myChannel);
                const retMessage = readMessage(myChannel, messageId);
                const retValue = retMessage.return;
                const errValue = retMessage.error;
                wasmWorkerThreadDebug("threadWrapImportNamespace after : readMessage");

                storeReceivedMemoryFunc(memory);

                if (errValue) {
                    wasmWorkerThreadDebug(
                        `threadWrapImportNamespace error thrown from wrappedImportFunction ${functionName} with errValue: `,
                        errValue
                    );
                    throw errValue;
                } else {
                    wasmWorkerThreadDebug(
                        `threadWrapImportNamespace returning from wrappedImportFunction ${functionName} with retValue: `,
                        retValue
                    );
                }
                return retValue;
            };
            return wrappedImportFunction;
        },
    });
    return importsProxy;
}
