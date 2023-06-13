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
import { initializeHandlers } from "./workerUtils.js";
import * as comlink from "comlink";
import Worker, { createWorker } from "./vendored/web-worker/index.js";
import { copyBuffer, isNode, sleep } from "./wasiUtils.js";

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
    moduleInstanceId: string
    exportRef: string,
};

export type WrappedExportedFunction = {
    isWrappedFunction: boolean,
    moduleInstanceId: string,
    functionName: string,
};

export type ImportReference = ImportExportReference | string;

export type ReciveMemoryFunc = (buf: ArrayBuffer) => void;

export type HandleWasmImportFunc = (
    messageId: string,
    importName: string,
    functionName: string,
    args: any[],
    memory: ArrayBuffer
) => any;

export type GetMemoryFunc = (functionName: string) => ArrayBuffer;

export class WasmThreadRunner {
    constructor() {
        wasmThreadDebug("WasmThreadRunner creating");
        initializeHandlers();
        this._wasmInstances = [];
        this._wasmInstancesMap = {};
    }
    private _wasmInstances: WebAssembly.Instance[];
    private _wasmInstancesMap: Record<string,WebAssembly.Instance>
    private _wasmInstance?: WebAssembly.Instance;
    private _exportsMemory?: WebAssembly.Memory;
    private _sharedMemory?: SharedArrayBuffer;
    private _handleImportFunc?: HandleWasmImportFunc;

    get wasmInstance() {
        return this._wasmInstance;
    }

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
        knownImports: Record<string, Record<string,ImportReference>>,
        channel: Channel,
        handleImportFunc: HandleWasmImportFunc,
        moduleInstanceId?: string,
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
                throw new Error("WasmThreadRunner this.wasmInstance.exports not set");
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
        if (instantiatedSource.instance.exports && instantiatedSource.instance.exports.memory && instantiatedSource.instance.exports.memory instanceof WebAssembly.Memory) {
            this._exportsMemory = instantiatedSource.instance.exports.memory;
            this._wasmInstance = instantiatedSource.instance;
        }
    }

    threadWrapAllImports(
        knownImports: Record<string, Record<string,ImportReference>>,
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
        importValues: Record<string,ImportReference>,
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
                if (myImportName === "env" && functionName === "memory") {
                    // console.log(`threadWrapImportNamespace importName: ${myImportName} functionName: ${functionName} envMemory: ${envMemory}`);
                    // return envMemory;
                    return this.exportsMemory;
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
                wasmThreadDebug(`threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: `, USE_SINGLE_THREAD_REMOTE);
                if (USE_SINGLE_THREAD_REMOTE){
                    const importReference = importValues[functionName];
                    wasmThreadDebug(`threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: importReference: `, importReference);
                    if (importReference){
                        const importExportReference = importReference as ImportExportReference;
                        if (importExportReference.exportRef){
                            const exportRef = importExportReference.exportRef;
                            const moduleInstanceId = importExportReference.moduleInstanceId;
                            const modInst = wasmThreadRunner._wasmInstancesMap[moduleInstanceId];
                            if (modInst) {
                                const exportedFunc = modInst.exports[exportRef];
                                wasmThreadDebug(`threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: exportedFunc: `, exportedFunc);
                                return exportedFunc;
                            }
                        }
                    } else {
                        wasmThreadDebug(`threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: importReference else : `);
                        for (const [impKey,impValue] of Object.entries(importValues)){
                            const importExportReference = impValue as ImportExportReference;
                            if (importExportReference.exportRef){
                                const exportRef = importExportReference.exportRef;
                                if (exportRef == functionName){
                                    const exportRef = importExportReference.exportRef;
                                    const moduleInstanceId = importExportReference.moduleInstanceId;
                                    const modInst = wasmThreadRunner._wasmInstancesMap[moduleInstanceId];
                                    if (modInst) {
                                        const exportedFunc = modInst.exports[exportRef];
                                        wasmThreadDebug(`threadWrapImportNamespace USE_SINGLE_THREAD_REMOTE: exportedFunc2: `, exportedFunc);
                                        return exportedFunc;
                                    }
                                }
                            }
                        }
                    }
                }
                const wrappedImportFunction = (...args: any[]) => {
                    const messageId = uuidv4();
                    // const messageId = "01234567-0123-0123-0123-0123456789ab";
                    wasmThreadDebug(
                        `threadWrapImportNamespace calling wrappedImportFunction ${functionName} messageId: ${messageId} args: `,
                        args
                    );
                    //wasmThreadDebug(`threadWrapAllImports calling wrappedImportFunction ${functionName} myChannel: `, myChannel);

                    // console.log(`threadWrapImportNamespace wrappedImportFunction importName: ${myImportName} functionName: ${functionName} messageId: ${messageId} getMemoryFunc call`);
                    let memory = getMemoryFunc(functionName);
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

    public async executeExportedFunctionSync(myChannel: Channel, messageId: string, functionName: string, args: any[]): Promise<any> {

        let funcReturn = undefined;
        let funcThrownError = undefined;

        try {
            funcReturn = await this.executeExportedFunction(functionName, args);
        } catch (err: any) {
            funcThrownError = err;
        }
        const response = { return: funcReturn, error: funcThrownError };

        wasmThreadDebug("executeExportedFunctionSync before : readMessage, channel:", myChannel);
        const retMessage = writeMessage(myChannel, response, messageId);
        wasmThreadDebug("executeExportedFunctionSync after : readMessage");

        return funcReturn;
    }

    public async executeExportedFunction(functionName: string, args: any[]): Promise<any> {
        // console.log("WasmThreadRunner executeExportedFunction: ", functionName);

        if (functionName == "6") {
            wasmThreadDebug("WasmThreadRunner executeExportedFunction: ", functionName);
        }
        // console.log("WasmThreadRunner executeExportedFunction: ", functionName);
        while (!this.wasmInstance) {
            wasmThreadDebug("WasmThreadRunner executeExportedFunction: waiting for wasmInstance");
            await sleep(100);
        }
        if (this.wasmInstance) {
            // console.log("WasmThreadRunner executeExportedFunction functionName: ", functionName);
            // console.log("WasmThreadRunner executeExportedFunction wasmInstance: ", this.wasmInstance);
            // console.log("WasmThreadRunner executeExportedFunction wasmInstance.exports: ", this.wasmInstance.exports);

            const exportedMember = this.wasmInstance.exports[functionName] as any;
            // console.log("WasmThreadRunner executeExportedFunction functionName: ", functionName, "exportedMember: ", exportedMember);
            // console.log("WasmThreadRunner executeExportedFunction functionName: ", functionName, "exportedMember.toString(): ", exportedMember.toString());
            // console.log("WasmThreadRunner executeExportedFunction functionName: ", functionName, "exportedMember.length: ", exportedMember.length);

            if (isFunction(exportedMember)) {
                let exportedfunc = exportedMember;
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
                    result = exportedfunc(...args);
                    wasmThreadDebug("returning from exportedFunc");
                    return result;
                } catch (err: any) {
                    wasmThreadDebug(`err catched from from exportedFunc: ${functionName} , err:`, err);
                    if (err instanceof WebAssembly.RuntimeError){
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
                if (exportedMember instanceof WebAssembly.Memory){
                    let wasmMem = exportedMember as WebAssembly.Memory;
                    let exportReturn = wasmMem.buffer;
                    // console.log("WasmThreadRunner isWasmEmory executeExportedFunction functionName: ", functionName, "exportReturn: ", exportReturn);
                    //return wasmMem;
                    //return exportedMember;
                    return exportReturn;
                } else if (exportedMember instanceof WebAssembly.Table){
                    let wasmTable = exportedMember as WebAssembly.Table;
                    // console.log("WasmThreadRunner isNotFunction executeExportedFunction functionName: ", functionName, "exportedMember: ", exportedMember);
                    let wasmTableSerialized = JSON.stringify(wasmTable);
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

const isFunction = (value: any) => value && (Object.prototype.toString.call(value) === "[object Function]" || "function" === typeof value || value instanceof Function);


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
    }

    return instantiateOnThreadRemote(sourceBuffer, imports, handleImportFunc);
}

export async function instantiateOnThreadRemote(
    sourceBuffer: BufferSource | null,
    imports: WebAssembly.Imports,
    handleImportFunc: HandleWasmImportFunc,
    threadRemote?: comlink.Remote<WasmThreadRunner>,
): Promise<{
    instance: WebAssembly.Instance;
    isAsync: boolean;
    channel?: Channel;
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

        if(!threadRemote) {
            threadRemote = await acquireThreadRemote();
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
            moduleInstanceId,
        );
        wasmHandlerDebug("instantiate returning");

        return {
            instance: proxiedInstance,
            isAsync: false,
            channel: channel,
            threadRemote: threadRemote,
            moduleInstanceId: moduleInstanceId,
        };
    } else {
        throw new Error("Unable to create message channel");
    }
}

export const USE_SINGLE_THREAD_REMOTE = true;

async function acquireThreadRemote(): Promise<comlink.Remote<WasmThreadRunner>> {
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
    return threadRemote;
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
            if (threadRemote) {
                wasmHandlerDebug("instantiateProxy creating wrappedExportFunction");
                // hack - refine this:
                if (name == "$imports") {
                    // TODO: imlement fetching local $imports from local
                    // moduleinstance if using shared worker
                    const expFunc = threadRemote.executeExportedFunction;
                    let imp = expFunc(name, []);
                    return imp;
                }
                if (name == "memory") {
                    const expFunc = threadRemote.executeExportedFunction;
                    let imp = expFunc(name, []);
                    return imp;
                }

                // if wrapExportFunctionSync is true it wraps it in a synchronous function
                // using syncmessage readMessage and writeMessage
                let wrapExportFunctionSync = false;
                const functionName = name as string;
                let wrappedExportFunction = undefined;

                if (wrapExportFunctionSync) {
                    // In this case the wrappedExportFunction is synchronous
                    wrappedExportFunction = (...args: any[]) => {
                        wasmHandlerDebug("instantiateProxy calling wrappedExportFunction synchronous");
                        if (name == "6") {
                            console.log("instantiateProxy calling wrappedExportFunction synchronous with name 6");
                        }
                        wasmHandlerDebug("instantiateProxy calling wrappedExportFunction synchronous functionName: ", functionName);
                        const messageId = uuidv4();
                        const expFunc = threadRemote.executeExportedFunctionSync;
                        if (exportChannel) {
                            expFunc(exportChannel, messageId, functionName, args);
                            wasmThreadDebug("threadWrapImportNamespace after : readMessage");
                            const checkInterrupt = function checkInterrupt(): boolean {
                                return true;
                            }
                            const retries = 100;
                            let retValue = undefined;
                            let errValue = undefined;
                            for (let i = 0; i< retries; i++) {
                                const retMessage = readMessage(exportChannel, messageId, {checkInterrupt});
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
                        wasmHandlerDebug("instantiateProxy calling wrappedExportFunction async functionName: ", functionName);
                        const expFunc = threadRemote.executeExportedFunction;
                        const retval = await expFunc(functionName, args);
                        return retval;
                    };
                }


                const wrappedExportedFunctionTyped = wrappedExportFunction as unknown as WrappedExportedFunction;
                // custom properties set to wrappedExportFunction function:
                wrappedExportedFunctionTyped.isWrappedFunction = true;
                wrappedExportedFunctionTyped.functionName = name as string
                wrappedExportedFunctionTyped.moduleInstanceId = moduleInstanceId as string;

                return wrappedExportFunction;
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
    const knownImports: Record<string, Record<string,ImportReference>> = {};
    if (importObject) {
        for (const [importKey, value] of Object.entries(importObject)) {
            wasmHandlerDebug("workerProxy pushing importKey: ", importKey);
            knownImports[importKey] = {};
            if (value.$imports) {
                const importValue = (value.$imports as any) as string;
                const importsForNamespace = knownImports[importKey];
                importsForNamespace["$imports"] = importValue;
            } 
            for (const [refKey, refValue] of Object.entries(value)) {
                if (isFunction(refValue)){
                    const importFunc = refValue as unknown as WrappedExportedFunction;
                    if (importFunc.isWrappedFunction){
                        const funcReference: ImportExportReference = {
                            exportRef: importFunc.functionName,
                            moduleInstanceId: importFunc.moduleInstanceId,
                        }
                        const importsForNamespace = knownImports[importKey];
                        importsForNamespace[refKey]= funcReference;
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