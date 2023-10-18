import * as comlink from "comlink";
import { WasiWorkerThreadRunner } from "@wasmin/wasi-js";

comlink.expose(new WasiWorkerThreadRunner());
