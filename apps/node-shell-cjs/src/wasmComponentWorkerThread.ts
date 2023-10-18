import * as comlink from "comlink";
import { WasmComponentWorkerThreadRunner } from "@wasmin/wasi-js";

comlink.expose(new WasmComponentWorkerThreadRunner());
