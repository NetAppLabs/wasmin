
import { WasiOptions } from "./wasi.js";
import * as comlink from 'comlink';
import nodeEndpoint from 'comlink/dist/umd/node-adapter.js';
import { WasiThreadRunner } from "./wasiWorkerThread.js";
import { Worker } from 'node:worker_threads';
import { default as path } from 'node:path';
import { URL } from 'node:url';
import { initializeHandlers } from "./workerUtils.js";


export class WASIWorker {

  constructor(wasiOptions: WasiOptions) {
    initializeHandlers();
    this._wasiOptions = wasiOptions;
  }
  private _wasiOptions: WasiOptions;

  public async run(moduleUrl: string): Promise<number> {

    //const wasiOptionsProxied = {};
    console.log("WASIWorker this._wasiOptions: ", this._wasiOptions);
    const wasiOptionsProxied = getWasiOptionsProxied(this._wasiOptions);
    //const wasiOptionsProxied = this._wasiOptions;
    //const pathResolved = path.resolve(__dirname, './wasiWorkerThread.js', import.meta.url);
    //const pathResolved = path.resolve(__dirname, './wasiWorkerThread.js');
    const pathResolved = "file:///Users/tryggvil/Development/netapp/wasm/wasm-env/packages/wasi-js/dist/wasiWorkerThread.js";
    console.log("WASIWorker pathResolved: ", pathResolved);

    const workerUrl = new URL(pathResolved);

    console.log("WASIWorker workerUrl: ", workerUrl);
    //const worker = new Worker(`${__dirname}/wasiWorkerThread.js`);
    const worker = new Worker(workerUrl);
    //const worker =  new Worker(new URL("./worker.js", import.meta.url).href, { type: "module" });

    const wasiRunner = comlink.wrap<WasiThreadRunner>(nodeEndpoint(worker));
    console.log("WASIWorker setOptions: ", wasiOptionsProxied);
    

    try {
      await wasiRunner.setOptions(wasiOptionsProxied);
    } catch(err: any){
      console.log("wasiRunner.setOptions err: ", err);
      console.trace(err);
    }

    console.log("WASIWorker run: ");
    return await wasiRunner.run(moduleUrl);
  }
}


export function getWasiOptionsProxied(options: WasiOptions): WasiOptions {
  const wasiOptionsProxied: WasiOptions = {};
  wasiOptionsProxied.args = options.args;
  wasiOptionsProxied.env = options.env;

  
  const origStdIn = options.stdin;
  if (origStdIn){
    wasiOptionsProxied.stdin = origStdIn;
  }
  
  const origStdOut = options.stdout;
  if (origStdOut){
    wasiOptionsProxied.stdout = origStdOut;
  }

  const origStdErr = options.stderr;
  if (origStdErr){
    wasiOptionsProxied.stderr = origStdErr;
  }

  /*
  const origTty = options.tty;
  if (origTty){
    wasiOptionsProxied.tty = origTty;
  }
  */

  return wasiOptionsProxied;
}