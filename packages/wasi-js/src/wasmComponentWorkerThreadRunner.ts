import { initializeComlinkHandlers, wasmWorkerThreadDebug} from "./workerUtils.js";
import * as comlink from "comlink";

export class WasmComponentWorkerThreadRunner {
    constructor() {
        wasmWorkerThreadDebug("WasmThreadRunner creating");
        initializeComlinkHandlers();
    }

    async instantiate(){

    }

    async run() {
        
    }
}
