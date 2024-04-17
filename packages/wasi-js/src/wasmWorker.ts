import { getWorkerUrl, initializeComlinkHandlers, isSymbol, wasiWorkerDebug, wasmWorkerClientDebug } from "./workerUtils.js";
import Worker, { createWorker } from "./vendored/web-worker/index.js";
import { isBun, isNode, wasiCallDebug, wasiDebug } from "./wasiUtils.js";
import { WasmCoreWorkerThreadRunner } from "./wasmCoreWorkerThreadRunner.js";
import * as comlink from "comlink";
import { WasmComponentWorkerThreadRunner } from "./wasmComponentWorkerThreadRunner.js";
import { Channel, readMessage, uuidv4 } from "./vendored/sync-message/index.js";
import { HandleCallType, HandleWasmComponentImportFunc } from "./desyncify.js";
import { ResourceProxy, containsResourceObjects, createResourceProxy, createProxyForResources, getResourceSerializableForProxyObjects } from "./wasiResources.js";

/**
 * Interface from the client side when a running a WebAssembly instance or component
 * on its own Worker
 */
export class WasmWorker {
    worker?: Worker;
    // Runner when in Core mode
    coreRunner?: comlink.Remote<WasmCoreWorkerThreadRunner>;
    // Runner when in Component mode
    componentRunner?: comlink.Remote<WasmComponentWorkerThreadRunner>;

    constructor() {
        initializeComlinkHandlers();
    }

    async createCoreWorker() {
        let worker: Worker;
        let workerUrlString = "./wasmCoreWorkerThread.js";
        if (isNode()) {
            workerUrlString = "./wasmCoreWorkerThreadNode.js";
        }
        const workerUrl = getWorkerUrl(workerUrlString);
        
        wasmWorkerClientDebug("workerUrl:", workerUrl);
        worker = await createWorker(workerUrl, { type: "module" });
        wasmWorkerClientDebug("createWorker: ", worker);

        if (worker) {
            // @ts-ignore
            if (globalThis.WASM_WORKER_THREAD_DEBUG) {
                worker.addEventListener("message", (ev: MessageEvent<any>) => {
                    wasmWorkerClientDebug("WasmThread worker message received: ", ev);
                });
            }
            //worker.on("error", err => console.log("`Worker error:", err));
            //worker.on("exit", code => console.log(`Worker exited with code ${code}.`));
        }
        wasmWorkerClientDebug("createCoreWorker started worker");
        const threadRemote = comlink.wrap<WasmCoreWorkerThreadRunner>(worker);

        this.coreRunner = threadRemote;
        this.worker = worker;
    }

    async createComponentWorker() {
        let worker: Worker;
        let workerUrlString = "./wasmComponentWorkerThread.js";
        if (isNode()) {
            workerUrlString = "./wasmComponentWorkerThreadNode.js";
        }
        const workerUrl = getWorkerUrl(workerUrlString);
        wasmWorkerClientDebug("createComponentWorker workerUrl:", workerUrl);
        worker = await createWorker(workerUrl, { type: "module" });
        wasmWorkerClientDebug("createWorker: ", worker);

        if (worker) {
            // @ts-ignore
            if (globalThis.WASM_WORKER_THREAD_DEBUG) {
                worker.addEventListener("message", (ev: MessageEvent<any>) => {
                    console.log("WasmThread worker message received: ", ev);
                });
            }
            //worker.on("error", err => console.log("`Worker error:", err));
            //worker.on("exit", code => console.log(`Worker exited with code ${code}.`));
        }
        wasmWorkerClientDebug("createComponentWorker started worker");
        const threadRemote = comlink.wrap<WasmComponentWorkerThreadRunner>(worker);

        this.componentRunner = threadRemote;
        this.worker = worker;
    }

    terminate() {
        this.cleanup();
        this.worker?.terminate();
    }

    cleanup() {
        if (this.coreRunner) {
            try {
                if (this.coreRunner[comlink.releaseProxy]) {
                    this.coreRunner[comlink.releaseProxy]();
                }
            } catch (err: any) {
                //console.log('err componentRunner ProxyRelease');
            }
        }
        this.coreRunner = undefined;
        if (this.componentRunner) {
            try {
                if (this.componentRunner[comlink.releaseProxy]) {
                    this.componentRunner[comlink.releaseProxy]();
                }
            } catch (err: any) {
                //console.log('err componentRunner ProxyRelease');
            }
        }
        this.componentRunner = undefined;
    }
}

export class ImportInterfaceProxy {
    constructor(importName: string) {
        this.importName = importName;
    }
    importName: string;
}

export function createComponentImportOrResourceProxy(
    callType: HandleCallType,
    importName: string,
    channel: Channel,
    handleComponentImportFunc: HandleWasmComponentImportFunc
): {} {
    let importTarget: ImportInterfaceProxy| ResourceProxy;
    if (callType == "resource") {
        const resourcesString = importName.split(":");
        const sResourceId = resourcesString[resourcesString.length-1];
        const resourceId = Number(sResourceId);
        importTarget = new ResourceProxy(resourceId, importName);
    } else if (callType == "import") {
        importTarget = new ImportInterfaceProxy(importName);
    } else {
        // should never be reachable
        importTarget = new ImportInterfaceProxy(importName);
    }

    return new Proxy(importTarget, {
        get: (_target, name, _receiver) => {
            const functionNameOrSymbol = name;
            let functionNameOrMember = "";
            let isSymbolReference = false;
            if (isSymbol(functionNameOrSymbol)) {
                functionNameOrMember = functionNameOrSymbol.toString();
                isSymbolReference = true;
            } else {
                functionNameOrMember = functionNameOrSymbol as string;
            }
            /*if (functionName == "InputStream"
                || functionName == "OutputStream" 
                || functionName == "Pollable"
                || functionName == "Descriptor"
                ) 
            */
            // Assuming we are referring to a resource if first character is UpperCase
            if (!isSymbolReference && (functionNameOrMember.charAt(0) === functionNameOrMember.charAt(0).toUpperCase() ))
            {
                const dummyResource = createResourceProxy(
                    functionNameOrMember,
                    callType,
                    importName,
                    channel,
                    handleComponentImportFunc,
                    getProxyFunctionToCall,
                );
                return dummyResource;
            } else if (functionNameOrMember == "resource") {
                const res = importTarget as ResourceProxy;
                return res.resource;
            }
            else if (functionNameOrMember == "prototype") {
                wasmWorkerClientDebug("trying to get prototype property");
                return _receiver;
            } 
            
            const funcToCall = getProxyFunctionToCall(
                functionNameOrMember,
                callType,
                importName,
                channel,
                handleComponentImportFunc
            );
            return funcToCall;
        },
    });
}

export type GetProxyFunctionToCall = (
    functionName: string,
    callType: HandleCallType,
    importName: string,
    channel: Channel,
    handleComponentImportFunc: HandleWasmComponentImportFunc
) => Function;


export function getProxyFunctionToCall(
    functionName: string,
    callType: HandleCallType,
    importName: string,
    channel: Channel,
    handleComponentImportFunc: HandleWasmComponentImportFunc
) {
    const funcToCall = (...args: any) => {
        let newArgs = args;
        let i = 0;
        let lastBuffer: ArrayBuffer|undefined;
        let lastTypedArray: Array<any>| undefined;
        // Making sure TypedArrays are transferred as Transferrable
        for (let arg of newArgs) {
            let arr = arg as Array<any>;
            if (ArrayBuffer.isView(arg)) {
                wasmWorkerClientDebug("istransfer:", arg);
                let typedArray = arg as ArrayBufferView;
                const lastBufferArrayBufferLike = typedArray.buffer;
                if (lastBufferArrayBufferLike instanceof ArrayBuffer) {
                    lastBuffer = lastBufferArrayBufferLike as ArrayBuffer;
                    wasmWorkerClientDebug("lastBuffer pre transfer: ", lastBuffer);
                    lastTypedArray = arr;
                    wasmWorkerClientDebug("lastTypedArray pre transfer: ", lastTypedArray);
                    // Simply marking the ArrayBuffer under the array as Transferrable
                    // This puts the ArrayBuffer in the transfer cache
                    comlink.transfer(newArgs,[lastBuffer]);
                }
            } else {
                const resObj = getResourceSerializableForProxyObjects(arg);
                if (resObj !== undefined) {
                    newArgs[i] = resObj;
                    wasmWorkerClientDebug("resObj: ", resObj);
                } else {
                    newArgs[i] = arg;
                }
            }
            i++;
        }
        const messageId = uuidv4();
        wasmWorkerClientDebug(
            `Proxy handleComponentImportFunc: importName: ${importName} functionName:`,
            functionName
        );
        handleComponentImportFunc(channel, messageId, callType, importName, functionName, newArgs);
        let ret = readMessage(channel, messageId);
        if (lastBuffer) {
            wasmWorkerClientDebug("lastBuffer post transfer: ", lastBuffer);
        }
        wasmWorkerClientDebug("lastTypedArray post transfer: ", lastTypedArray);
        if (ret.error) {
            let retError = ret.error;
            wasmWorkerClientDebug("ret.error: ", retError);
            wasiCallDebug(`[wasi] [component] [${importName}] [${functionName}] error: `, retError);
            if (containsResourceObjects(retError)) {
                retError = createProxyForResources(retError, importName, channel, handleComponentImportFunc);
            }
            throw retError;
        }
        let retObj = ret.return;
        wasiCallDebug(`[wasi] [component] [${importName}] [${functionName}] return: `, retObj);
        if (containsResourceObjects(retObj)) {
            retObj = createProxyForResources(retObj, importName, channel, handleComponentImportFunc);
        }
        return retObj;
    };
    return funcToCall;
}