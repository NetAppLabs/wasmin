import * as comlink from "comlink";
import { WasmCoreWorkerThreadRunner } from "@netapplabs/wasi-js";

comlink.expose(new WasmCoreWorkerThreadRunner());
