import { parentPort } from "node:worker_threads";
import * as comlink from "comlink";
import nodeEndpoint from "comlink/dist/umd/node-adapter.js";
import { WasmCoreWorkerThreadRunner } from "@wasmin/wasi-js";

if (!parentPort) {
    throw new Error("InvalidWorker");
}

comlink.expose(new WasmCoreWorkerThreadRunner(), nodeEndpoint(parentPort));
