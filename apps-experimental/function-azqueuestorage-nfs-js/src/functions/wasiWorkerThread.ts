import { parentPort } from "node:worker_threads";
import * as comlink from "comlink";
import nodeEndpoint from "comlink/dist/umd/node-adapter.js";
import { WasiWorkerThreadRunner } from "@netapplabs/wasi-js";

if (!parentPort) {
    throw new Error("InvalidWorker");
}

comlink.expose(new WasiWorkerThreadRunner(), nodeEndpoint(parentPort));