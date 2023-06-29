import * as comlink from "comlink";
import { WasmCoreWorkerThreadRunner } from "./wasmCoreWorkerThreadRunner.js";

comlink.expose(new WasmCoreWorkerThreadRunner());
