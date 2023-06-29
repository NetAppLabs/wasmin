import * as comlink from "comlink";
import { WasmComponentWorkerThreadRunner } from "./wasmComponentWorkerThreadRunner.js";

comlink.expose(new WasmComponentWorkerThreadRunner());
