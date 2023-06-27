import {
    GetMemoryFunc,
    HandleWasmImportFunc,
    ImportExportReference,
    ImportReference,
    ReciveMemoryFunc,
    USE_SHARED_MEMORY,
    USE_SINGLE_THREAD_REMOTE,
    wasmThreadDebug,
} from "./desyncify.js";
import { Channel, readMessage, uuidv4, writeMessage } from "./vendored/sync-message/index.js";
import { copyBuffer, sleep } from "./wasiUtils.js";
import { initializeHandlers, isFunction } from "./workerUtils.js";
import * as comlink from "comlink";

export class WasmThreadRunner {
    constructor() {
        wasmThreadDebug("WasmThreadRunner creating");
        initializeHandlers();
        this._wasmInstances = [];
        this._wasmInstancesMap = {};
    }
    private _wasmInstances: WebAssembly.Instance[];
    private _wasmInstancesMap: Record<string, WebAssembly.Instance>;
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

    public async instantiate(
        modSource: BufferSource,
        knownImports: Record<string, Record<string, ImportReference>>,
        channel: Channel,
        handleImportFunc: HandleWasmImportFunc,
        moduleInstanceId?: string
    ): Promise<void> {
        wasmThreadDebug("WasmThreadRunner instantiate");

        const recieveMemoryFuncLocal = (buf: ArrayBuffer) => {
            wasmThreadDebug("WasmThreadRunner calling recieveMemoryFuncLocal");
            if (this && this.exportsMemory) {
                const mem = this.exportsMemory as WebAssembly.Memory;
                if (mem.buffer instanceof SharedArrayBuffer) {
                    wasmThreadDebug("WasmThreadRunner recieveMemoryFuncLocal isSharedArrayBuffer");
                    // no need to copy if SharedArrayBuffer
                } else {
                    // copy buf into wasm memory
                    wasmThreadDebug("WasmThreadRunner recieveMemoryFuncLocal copyBuffer", buf, mem.buffer);
                    copyBuffer(buf, mem.buffer);
                }
            } else {
                throw new Error("WasmThreadRunner this.exportsMemory not set");
            }
        };

        const getMemoryFuncLocal = (functionName: string) => {
            wasmThreadDebug("WasmThreadRunner calling getMemoryFunc");
            // console.log(`WasmThreadRunner calling getMemoryFunc functionName: ${functionName}`);
            if (this && this.exportsMemory) {
                // console.log(`WasmThreadRunner calling getMemoryFunc functionName: ${functionName} this.wasmInstance.exports.memory: ${this.wasmInstance.exports.memory}`);
                const mem = this.exportsMemory as WebAssembly.Memory;
                // console.log(`WasmThreadRunner calling getMemoryFunc functionName: ${functionName} mem: ${mem}`);
                if (USE_SHARED_MEMORY) {
                    if (mem.buffer instanceof SharedArrayBuffer) {
                        // console.log(`WasmThreadRunner calling getMemoryFunc functionName: ${functionName} with SharedArrayBuffer`);
                        this._sharedMemory = mem.buffer as SharedArrayBuffer;
                    } else {
                        // console.log(`WasmThreadRunner calling getMemoryFunc functionName: ${functionName} with non-SharedArrayBuffer`);
                        if (!this._sharedMemory) {
                            this._sharedMemory = new SharedArrayBuffer(mem.buffer.byteLength);
                        } else {
                            if (this._sharedMemory.byteLength != mem.buffer.byteLength) {
                                this._sharedMemory = new SharedArrayBuffer(mem.buffer.byteLength);
                            }
                        }
                        wasmThreadDebug("getMemoryFuncLocal copyBuffer: ", mem.buffer, this.sharedMemory);
                        copyBuffer(mem.buffer, this._sharedMemory);
                    }
                    return this._sharedMemory;
                } else {
                    const newMemBuf = new ArrayBuffer(mem.buffer.byteLength);
                    copyBuffer(mem.buffer, newMemBuf);
                    return newMemBuf;
                }
            }
            throw new Error(`Coud not get WebAssembly instance memory - functionName: ${functionName}`);
        };
        const wrappedImports = this.threadWrapAllImports(
            knownImports,
            channel,
            handleImportFunc,
            getMemoryFuncLocal,
            recieveMemoryFuncLocal
        );

        const instantiatedSource = await WebAssembly.instantiate(modSource, wrappedImports);
        // console.log(`WasmThreadRunner instantiate modSource.byteLength: ${modSource.byteLength} instantiatedSource.instance.exports.memory: ${instantiatedSource.instance.exports.memory}`);

        this._wasmInstances.push(instantiatedSource.instance);
        if (moduleInstanceId) {
            this._wasmInstancesMap[moduleInstanceId] = instantiatedSource.instance;
        } else {
            console.log("Warning, moduleInstanceId is undefined for WasmThreadRunner.instantiate");
        }
        this._handleImportFunc = handleImportFunc;
        if (
            instantiatedSource.instance.exports &&
            instantiatedSource.instance.exports.memory &&
            instantiatedSource.instance.exports.memory instanceof WebAssembly.Memory
        ) {
            this._exportsMemory = instantiatedSource.instance.exports.memory;
            //this._wasmInstance = instantiatedSource.instance;
        }
    }

    threadWrapAllImports(
        knownImports: Record<string, Record<string, ImportReference>>,
        channel: Channel,
        handleImport: HandleWasmImportFunc,
        getMemoryFunc: GetMemoryFunc,
        recieveMemoryFunc: ReciveMemoryFunc
    ): WebAssembly.Imports {
        wasmThreadDebug("threadWrapAllImports");

        const updatedImports: Record<string, WebAssembly.ModuleImports> = {};
        for (const [importKey, importValues] of Object.entries(knownImports)) {
            updatedImports[importKey] = this.threadWrapImportNamespace(
                importKey,
                importValues,
                channel,
                handleImport,
                getMemoryFunc,
                recieveMemoryFunc
            );
        }
        return updatedImports;
    }

    threadWrapImportNamespace(
        importName: string,
        importValues: Record<string, ImportReference>,
        channel: Channel,
        handleImport: HandleWasmImportFunc,
        getMemoryFunc: GetMemoryFunc,
        recieveMemoryFunc: ReciveMemoryFunc
    ): WebAssembly.ModuleImports {
        wasmThreadDebug("threadWrapImportNamespace importName: ", importName);

        const impDummy: WebAssembly.ModuleImports = {};
        const wasmThreadRunner = this;

        const importsProxy = new Proxy(impDummy, {
            get: (target, name, receiver) => {
                wasmThreadDebug(`threadWrapImportNamespace importName: ${importName} get:`, name);

                const myChannel = channel;
                const myImportName = importName;
                const functionName = name as string;
                if (functionName == "random_get") {
                    wasmThreadDebug("in threadWrapImportNamespace proxy get random_get");
                }
                if (myImportName === "env" && functionName === "memory") {
                    // console.log(`threadWrapImportNamespace importName: ${myImportName} functionName: ${functionName} envMemory: ${envMemory}`);
                    // return envMemory;
                    if (this.exportsMemory) {
                        return this.exportsMemory;
                    } else {
                        const mem = importValues["memory"];
                        if (mem instanceof SharedArrayBuffer) {
                            const wasmMem: WebAssembly.Memory = {
                                buffer: mem,
                                grow: function (delta: number): number {
                                    throw new Error("grow function not implemented.");
                                },
                            };
                            return wasmMem;
                        }
                    }
                }
                if (myImportName === "" && functionName === "$imports") {
                    // TODO: special case if $imports and fetch it locally from a string reference
                    // if using shared workers use string reference to look up $imports table from another module

                    // const table = new WebAssembly.Table({element: "anyfunc", initial: 10, maximum: 10});
                    // console.log(`threadWrapImportNamespace importName: ${myImportName} functionName: ${functionName} table: ${table}`);
                    // return table;
                    // console.log(`threadWrapImportNamespace importName: ${myImportName} functionName: ${functionName} return: this._wasmInstances[0].exports.$imports`);
                    return this._wasmInstances[0].exports.$imports;
                }
                wasmThreadDebug(
                    `threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: ${functionName} `,
                    USE_SINGLE_THREAD_REMOTE
                );
                if (USE_SINGLE_THREAD_REMOTE) {
                    const importReference = importValues[functionName];
                    wasmThreadDebug(
                        `threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: ${functionName} importReference: `,
                        importReference
                    );
                    if (importReference) {
                        const importExportReference = importReference as ImportExportReference;
                        if (importExportReference.exportRef) {
                            const exportRef = importExportReference.exportRef;
                            const moduleInstanceId = importExportReference.moduleInstanceId;
                            const modInst = wasmThreadRunner._wasmInstancesMap[moduleInstanceId];
                            if (modInst) {
                                const exportedFunc = modInst.exports[exportRef];
                                wasmThreadDebug(
                                    `threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: ${functionName} exportedFunc: `,
                                    exportedFunc
                                );
                                return exportedFunc;
                            }
                        }
                    } else {
                        wasmThreadDebug(
                            `threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: ${functionName} importReference else : `
                        );
                        for (const [impKey, impValue] of Object.entries(importValues)) {
                            const importExportReference = impValue as ImportExportReference;
                            if (importExportReference.exportRef) {
                                const exportRef = importExportReference.exportRef;
                                if (exportRef == functionName) {
                                    const exportRef = importExportReference.exportRef;
                                    const moduleInstanceId = importExportReference.moduleInstanceId;
                                    const modInst = wasmThreadRunner._wasmInstancesMap[moduleInstanceId];
                                    if (modInst) {
                                        const exportedFunc = modInst.exports[exportRef];
                                        console.log(
                                            `threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: ${functionName} else exportedFunc2: `,
                                            exportedFunc
                                        );
                                        return exportedFunc;
                                    }
                                }
                            }
                        }
                    }
                }
                wasmThreadDebug("returning wrappedImportFunction for ", functionName);
                const wrappedImportFunction = (...args: any[]) => {
                    const messageId = uuidv4();
                    // const messageId = "01234567-0123-0123-0123-0123456789ab";
                    wasmThreadDebug(
                        `threadWrapImportNamespace calling wrappedImportFunction ${functionName} messageId: ${messageId} args: `,
                        args
                    );
                    //wasmThreadDebug(`threadWrapAllImports calling wrappedImportFunction ${functionName} myChannel: `, myChannel);

                    // console.log(`threadWrapImportNamespace wrappedImportFunction importName: ${myImportName} functionName: ${functionName} messageId: ${messageId} getMemoryFunc call`);
                    //let memory = getMemoryFunc(functionName);
                    let memory = new ArrayBuffer(0);
                    try {
                        memory = getMemoryFunc(functionName);
                    } catch (err: any) {
                        console.error("Error getMemoryFunc: ", err);
                    }
                    // console.log(`threadWrapImportNamespace wrappedImportFunction importName: ${myImportName} functionName: ${functionName} messageId: ${messageId} memory: ${memory}`);
                    if (!USE_SHARED_MEMORY) {
                        memory = comlink.transfer(memory, [memory]);
                        wasmThreadDebug("threadWrapImportNamespace marking memory as transferrable, memory: ", memory);
                    }
                    try {
                        wasmThreadDebug("threadWrapImportNamespace handleImport: ", handleImport);
                        handleImport(messageId, myImportName, functionName, args, memory);
                    } catch (err: any) {
                        wasmThreadDebug("threadWrapImportNamespace handleImport: ", err);
                    }
                    wasmThreadDebug("threadWrapImportNamespace before : readMessage, channel:", myChannel);
                    const retMessage = readMessage(myChannel, messageId);
                    const retValue = retMessage.return;
                    const errValue = retMessage.error;
                    wasmThreadDebug("threadWrapImportNamespace after : readMessage");

                    if (USE_SHARED_MEMORY) {
                        recieveMemoryFunc(memory);
                    } else {
                        const numberArrayMemory = retMessage.memory as number[];
                        wasmThreadDebug("threadWrapImportNamespace numberArrayMemory: ", numberArrayMemory);
                        const typedArrayMemory = new Uint8Array(numberArrayMemory);
                        const buf = typedArrayMemory.buffer;
                        wasmThreadDebug(
                            `threadWrapImportNamespace returning from wrappedImportFunction ${functionName} with buf: `,
                            buf
                        );
                        recieveMemoryFunc(buf);
                    }

                    if (errValue) {
                        wasmThreadDebug(
                            `threadWrapImportNamespace error thrown from wrappedImportFunction ${functionName} with errValue: `,
                            errValue
                        );
                        throw errValue;
                    } else {
                        //wasmThreadDebug(`threadWrapImportNamespace returning from wrappedImportFunction ${functionName} with typedArrayMemory: `, typedArrayMemory);
                        wasmThreadDebug(
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

        wasmThreadDebug("executeExportedFunctionSync before : readMessage, channel:", myChannel);
        const retMessage = writeMessage(myChannel, response, messageId);
        wasmThreadDebug("executeExportedFunctionSync after : readMessage");

        return funcReturn;
    }

    public async executeExportedFunction(moduleInstanceId: string, functionName: string, args: any[]): Promise<any> {
        // console.log("WasmThreadRunner executeExportedFunction: ", functionName);

        if (functionName == "6") {
            wasmThreadDebug("WasmThreadRunner executeExportedFunction: ", functionName);
        }
        // console.log("WasmThreadRunner executeExportedFunction: ", functionName);
        let wasmInstance = this._wasmInstancesMap[moduleInstanceId];
        while (!wasmInstance) {
            wasmThreadDebug("WasmThreadRunner executeExportedFunction: waiting for wasmInstance");
            await sleep(100);
            wasmInstance = this._wasmInstancesMap[moduleInstanceId];
        }
        if (wasmInstance) {
            // console.log("WasmThreadRunner executeExportedFunction functionName: ", functionName);
            // console.log("WasmThreadRunner executeExportedFunction wasmInstance: ", wasmInstance);
            // console.log("WasmThreadRunner executeExportedFunction wasmInstance.exports: ", wasmInstance.exports);

            const exportedMember = wasmInstance.exports[functionName] as any;
            // console.log("WasmThreadRunner executeExportedFunction functionName: ", functionName, "exportedMember: ", exportedMember);
            // console.log("WasmThreadRunner executeExportedFunction functionName: ", functionName, "exportedMember.toString(): ", exportedMember.toString());
            // console.log("WasmThreadRunner executeExportedFunction functionName: ", functionName, "exportedMember.length: ", exportedMember.length);

            if (isFunction(exportedMember)) {
                const exportedfunc = exportedMember;
                try {
                    let result: any;
                    // console.log("WasmThreadRunner exportedfunc:", exportedfunc, ...args);
                    /*if (functionName == "6") {
                        const arg_0 = args[0];
                        const arg_1 = args[1];
                        const arg_2 = args[2];
                        const arg_3 = args[3];
                        result = exportedfunc.bind(this.wasmInstance).call(arg_0, arg_1, arg_2, arg_3);
                    } else {
                        result = exportedfunc(...args);
                    }*/
                    const fn = async () => {
                        result = exportedfunc(...args);
                        wasmThreadDebug("returning from exportedFunc");
                        return result;
                    };
                    return await fn();
                } catch (err: any) {
                    wasmThreadDebug(`err catched from from exportedFunc: ${functionName} , err:`, err);
                    if (err instanceof WebAssembly.RuntimeError) {
                        const e = err as WebAssembly.RuntimeError;
                        // console.log("WebAssembly.RuntimeError"); // "Hello"
                        // console.log(e.message); // "Hello"
                        // console.log(e.name); // "RuntimeError"
                        // console.log(e.cause); // "someFile"
                        // console.log(e.stack); // returns the location where the code was run
                    }
                    throw err;
                }
            } else {
                // console.log("WasmThreadRunner executeExportedFunction "+functionName+" exportedMember:", exportedMember);
                if (exportedMember instanceof WebAssembly.Memory) {
                    const wasmMem = exportedMember as WebAssembly.Memory;
                    const exportReturn = wasmMem.buffer;
                    // console.log("WasmThreadRunner isWasmEmory executeExportedFunction functionName: ", functionName, "exportReturn: ", exportReturn);
                    //return wasmMem;
                    //return exportedMember;
                    return exportReturn;
                } else if (exportedMember instanceof WebAssembly.Table) {
                    const wasmTable = exportedMember as WebAssembly.Table;
                    // console.log("WasmThreadRunner isNotFunction executeExportedFunction functionName: ", functionName, "exportedMember: ", exportedMember);
                    const wasmTableSerialized = JSON.stringify(wasmTable);
                    const wasmTableLength = wasmTable.length;
                    // console.log("exportedMember wasmTableLength", wasmTableLength);

                    for (let i = 0; i < wasmTable.length; i++) {
                        const ti = wasmTable.get(i);
                        // console.log("exportedMember wasmTable i:"+i, ti);
                    }
                    // console.log("exportedMember wasmTable", wasmTable);
                    // console.log("exportedMember wasmTableSerialized", wasmTableSerialized);
                    return wasmTableSerialized;
                } else {
                    return exportedMember;
                }
            }
        } else {
            throw new Error("WasmInstance not set");
        }
    }
}
