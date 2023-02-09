
import { parentPort, workerData } from 'node:worker_threads';
import * as comlink from 'comlink';
import nodeEndpoint from 'comlink/dist/umd/node-adapter.js';
import { WASI, WasiOptions } from './wasi.js';
import { promises } from "node:fs";
import { initializeHandlers } from './workerUtils.js';

export async function getWasmModule(moduleUrl: string) {
  const wasmBuf = await promises.readFile(moduleUrl);
  const mod = await WebAssembly.compile(wasmBuf);
  return mod;
}

if (!parentPort) {
  throw new Error('InvalidWorker');
}

export class WasiThreadRunner {
  constructor() {
    initializeHandlers();
  }
  private wasiOptions = workerData;

  public setOptions(options: WasiOptions): void {
    console.log("WasiThreadRunner setOptions options: ", options);
    this.wasiOptions = options;
  }

  public setStdOutWriter(writeFunc: (buf: Uint8Array) => Promise<void>): void {
    console.log("WasiThreadRunner setStdOutWriter writeFunc: ", writeFunc);
    //this.wasiOptions = options;
    const newStdout = {
      write: writeFunc
    }
    this.wasiOptions.stdout = newStdout;
  }

  public async run(moduleUrl: string): Promise<number> {
    console.log("WasiThreadRunner run: moduleUrl:", moduleUrl);

    console.log("WasiThreadRunner wasiOptions: ", this.wasiOptions);

    const wasiOpts = this.wasiOptions
    console.log("WasiThreadRunner wasiOpts: ", wasiOpts);

    const wasi = new WASI(wasiOpts);
    //const wasi = new WASI({});
    console.log("WasiThreadRunner wasi: ");

    const mod = await getWasmModule(moduleUrl);
    console.log("WasiThreadRunner mod: ");

    return await wasi.run(mod);
  }
}

comlink.expose(new WasiThreadRunner(), nodeEndpoint(parentPort));