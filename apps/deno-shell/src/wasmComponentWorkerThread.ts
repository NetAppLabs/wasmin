import * as comlink from "comlink";
import { WasmComponentWorkerThreadRunner } from "@netapplabs/wasi-js";

comlink.expose(new WasmComponentWorkerThreadRunner());
