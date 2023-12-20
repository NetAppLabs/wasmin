import * as comlink from "comlink";
import { WasmCoreWorkerThreadRunner } from "@wasmin/wasi-js";

comlink.expose(new WasmCoreWorkerThreadRunner());
