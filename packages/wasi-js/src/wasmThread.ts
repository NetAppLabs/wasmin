import * as comlink from "comlink";
import { WasmThreadRunner } from "./wasmThreadRunner.js";

comlink.expose(new WasmThreadRunner());
