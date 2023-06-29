import {
    wasmHandlerDebug,
} from "./workerUtils.js";
import { createWorker } from "./vendored/web-worker/index.js";
import { isNode } from "./wasiUtils.js";
import { WasmCoreWorkerThreadRunner } from "./wasmCoreWorkerThreadRunner.js";
import * as comlink from "comlink";
import { WasmComponentWorkerThreadRunner } from "./wasmComponentWorkerThreadRunner.js";

export class WasmWorker {
    worker?: Worker;
    coreRunner?: comlink.Remote<WasmCoreWorkerThreadRunner>;
    componentRunner?: comlink.Remote<WasmComponentWorkerThreadRunner>;

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
            worker.addEventListener("message", (msg: MessageEvent<any>) => {
                //worker.on("message", (msg: MessageEvent<any>) => {
                // @ts-ignore
                if (globalThis.WASM_WORKER_THREAD_DEBUG) {
                    // console.log("WasmThread worker message received: ", msg);
                }
            });
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
            worker.addEventListener("message", (msg: MessageEvent<any>) => {
                // @ts-ignore
                if (globalThis.WASM_WORKER_THREAD_DEBUG) {
                }
            });
            //worker.on("error", err => console.log("`Worker error:", err));
            //worker.on("exit", code => console.log(`Worker exited with code ${code}.`));
        }
        wasmHandlerDebug("createComponentWorker started worker");
        const threadRemote = comlink.wrap<WasmComponentWorkerThreadRunner>(worker);

        this.componentRunner = threadRemote;
        this.worker = worker;
    }


    terminate() {
        this.worker?.terminate();
        this.coreRunner = undefined;
        this.componentRunner = undefined;
    }
}