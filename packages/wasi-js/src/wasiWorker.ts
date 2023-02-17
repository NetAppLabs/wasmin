import { WASI, WasiOptions } from "./wasi.js";
import * as comlink from "comlink";
import nodeEndpoint from "comlink/dist/umd/node-adapter.js";
import { Worker } from "node:worker_threads";
import { URL } from "node:url";
import { getWasmModuleAndBuffer, initializeHandlers, wasiWorkerDebug } from "./workerUtils.js";
import { TransferMemoryFunc } from "./deasyncify.js";

export class WASIWorker {
    constructor(wasiOptions: WasiOptions) {
        initializeHandlers();
        this._wasiOptions = wasiOptions;
    }
    private _wasiOptions: WasiOptions;

    public async run(moduleUrl: string): Promise<number> {
        //const wasiOptionsProxied = {};
        wasiWorkerDebug("WASIWorker this._wasiOptions: ", this._wasiOptions);
        const wasiOptionsProxied = getWasiOptionsProxied(this._wasiOptions);
        //const wasiOptionsProxied = this._wasiOptions;
        //const pathResolved = path.resolve(__dirname, './wasiWorkerThread.js', import.meta.url);
        //const pathResolved = path.resolve(__dirname, './wasiWorkerThread.js');
        const pathResolved =
            "file:///Users/tryggvil/Development/netapp/wasm/wasm-env/packages/wasi-js/dist/wasiWorkerThread.js";
        wasiWorkerDebug("WASIWorker pathResolved: ", pathResolved);

        const workerUrl = new URL(pathResolved);

        wasiWorkerDebug("WASIWorker workerUrl: ", workerUrl);
        //const worker = new Worker(`${__dirname}/wasiWorkerThread.js`);
        const worker = new Worker(workerUrl);

        //const worker =  new Worker(new URL("./worker.js", import.meta.url).href, { type: "module" });

        const wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(nodeEndpoint(worker));
        wasiWorkerDebug("WASIWorker setOptions: ", wasiOptionsProxied);

        worker.on("message", (incoming) => {
            wasiWorkerDebug("WASIWorker incoming message: ", { incoming });
        });

        try {
            await wasiWorkerThread.setOptions(wasiOptionsProxied);
        } catch (err: any) {
            wasiWorkerDebug("wasiWorkerThread.setOptions err: ", err);
            console.trace(err);
        }

        wasiWorkerDebug("WASIWorker run: ");
        return await wasiWorkerThread.run(moduleUrl);
    }
}

export class WasiWorkerThreadRunner {
    constructor() {
        initializeHandlers();
    }
    private wasiOptions?: WasiOptions;
    private wasi?: WASI;

    public setOptions(options: WasiOptions): void {
        wasiWorkerDebug("WasiWorkerThread setOptions options: ", options);
        this.wasiOptions = options;
    }

    public setStdOutWriter(writeFunc: (buf: Uint8Array) => Promise<void>): void {
        wasiWorkerDebug("WasiWorkerThread setStdOutWriter writeFunc: ", writeFunc);
        const newStdout = {
            write: writeFunc,
        };
        if (this.wasiOptions) {
            this.wasiOptions.stdout = newStdout;
        } else {
            throw new Error("WasiOptions not set");
        }
    }

    public async handleImport(messageId: string, importName: string, functionName: string, args: any[], buf: ArrayBuffer, transferMemoryFunc: TransferMemoryFunc): Promise<void> {
        wasiWorkerDebug(`WasiWorkerThreadRunner: handleImport: importName: ${importName} functionName: ${functionName}`);
        const wasi = this.wasi;
        if (wasi) {
            wasiWorkerDebug(`WasiWorkerThreadRunner: handleImport: wasi is set`);
            return await wasi.handleImport(messageId, importName, functionName, args, buf, transferMemoryFunc);
        } else {
            wasiWorkerDebug(`WasiWorkerThreadRunner: handleImport: wasi is not set`);
        }
        throw new Error(`Error handling import: ${importName} functionName: ${functionName}`);
    }

    public async run(moduleUrl: string): Promise<number> {
        wasiWorkerDebug("WasiWorkerThread run: moduleUrl:", moduleUrl);

        wasiWorkerDebug("WasiWorkerThread wasiOptions: ", this.wasiOptions);


        if (this.wasiOptions) {
            const wasiOpts = this.wasiOptions;
            wasiWorkerDebug("WasiWorkerThread wasiOpts: ", wasiOpts);
    
            this.wasi = new WASI(wasiOpts);
            wasiWorkerDebug("WasiWorkerThread wasi: ");

            const { wasmMod, wasmBuf } = await getWasmModuleAndBuffer(moduleUrl);
            wasiWorkerDebug("WasiWorkerThread mod: ", wasmMod);


            return await this.wasi.run(wasmMod, wasmBuf);
        } else {
            throw new Error("run wasiOptions not set");
        }
    }
}

export function getWasiOptionsProxied(options: WasiOptions): WasiOptions {
    const wasiOptionsProxied: WasiOptions = {};
    wasiOptionsProxied.args = options.args;
    wasiOptionsProxied.env = options.env;

    const origStdIn = options.stdin;
    if (origStdIn) {
        wasiOptionsProxied.stdin = origStdIn;
    }

    const origStdOut = options.stdout;
    if (origStdOut) {
        wasiOptionsProxied.stdout = origStdOut;
    }

    const origStdErr = options.stderr;
    if (origStdErr) {
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
