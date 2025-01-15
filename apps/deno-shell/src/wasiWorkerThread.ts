import * as comlink from "comlink";
import { WasiWorkerThreadRunner } from "@netapplabs/wasi-js";

comlink.expose(new WasiWorkerThreadRunner());
