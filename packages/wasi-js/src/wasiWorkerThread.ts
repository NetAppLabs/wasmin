import * as comlink from "comlink";
import { WasiWorkerThreadRunner } from "./wasiWorker.js";

comlink.expose(new WasiWorkerThreadRunner());