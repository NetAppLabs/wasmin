import * as comlink from "comlink";
import { WasmThreadRunner } from "./desyncify.js";

comlink.expose(new WasmThreadRunner());
