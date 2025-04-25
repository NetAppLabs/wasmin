import { parentPort } from "node:worker_threads";
import * as comlink from "comlink";
import nodeEndpoint from "comlink/dist/umd/node-adapter.js";
import { WasmComponentWorkerThreadRunner } from "@netapplabs/wasi-js";

if (!parentPort) {
    throw new Error("InvalidWorker");
}

comlink.expose(new WasmComponentWorkerThreadRunner(), nodeEndpoint(parentPort));
