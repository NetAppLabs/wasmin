import { initializeComlinkHandlers, wasmHandlerDebug } from "./workerUtils.js";
import Worker, { createWorker } from "./vendored/web-worker/index.js";
import { isNode } from "./wasiUtils.js";
import { WasmCoreWorkerThreadRunner } from "./wasmCoreWorkerThreadRunner.js";
import * as comlink from "comlink";
import { WasmComponentWorkerThreadRunner } from "./wasmComponentWorkerThreadRunner.js";
import { Channel, readMessage, uuidv4 } from "./vendored/sync-message/index.js";
import { HandleWasmComponentImportFunc } from "./desyncify.js";

export class WasmWorker {
    worker?: Worker;
    coreRunner?: comlink.Remote<WasmCoreWorkerThreadRunner>;
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
        const workerUrl = new URL(workerUrlString, import.meta.url);

        wasmHandlerDebug("workerUrl:", workerUrl);
        worker = await createWorker(workerUrl, { type: "module" });
        wasmHandlerDebug("createWorker: ", worker);

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
        wasmHandlerDebug("createCoreWorker started worker");
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
        const workerUrl = new URL(workerUrlString, import.meta.url);

        wasmHandlerDebug("workerUrl:", workerUrl);
        worker = await createWorker(workerUrl, { type: "module" });
        wasmHandlerDebug("createWorker: ", worker);

        if (worker) {
            // @ts-ignore
            if (globalThis.WASM_WORKER_THREAD_DEBUG) {
                worker.addEventListener("message", (ev: MessageEvent<any>) => {
                    console.log("WasmThread worker message received: ", ev);
                });
            } //worker.on("error", err => console.log("`Worker error:", err));
            //worker.on("exit", code => console.log(`Worker exited with code ${code}.`));
        }
        wasmHandlerDebug("createComponentWorker started worker");
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

export function createComponentModuleImportProxyPerImportForChannel(
    importName: string,
    channel: Channel,
    handleComponentImportFunc: HandleWasmComponentImportFunc
): {} {
    const importDummy = {};
    return new Proxy(importDummy, {
        get: (_target, name, _receiver) => {
            const functionName = name as string;
            return (...args: any) => {
                const messageId = uuidv4();
                wasmHandlerDebug(
                    `Proxy handleComponentImportFunc: importName: ${importName} functionName:`,
                    functionName
                );
                handleComponentImportFunc(channel, messageId, importName, functionName, args);
                const ret = readMessage(channel, messageId);
                if (ret.error) {
                    throw ret.error;
                }
                return ret.return;
            };
        },
    });
}
