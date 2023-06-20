import { WASI, WasiOptions } from "./wasi.js";
import * as comlink from "comlink";
import { getWasmBuffer, initializeHandlers, wasiWorkerDebug } from "./workerUtils.js";
import { ReciveMemoryFunc } from "./desyncify.js";
import { createWorker } from "./vendored/web-worker/index.js";
import { isNode } from "./wasiUtils.js";
import { readMessage, uuidv4 } from "./vendored/sync-message/index.js";

export class WASIWorker {
    wasiWorkerThread?: comlink.Remote<WasiWorkerThreadRunner>;
    constructor(wasiOptions: WasiOptions) {
        initializeHandlers();
        this._wasiOptions = wasiOptions;
    }
    private _wasiOptions: WasiOptions;

    public async run(moduleUrl: string): Promise<number> {
        //const wasiOptionsProxied = {};
        wasiWorkerDebug("WASIWorker this._wasiOptions: ", this._wasiOptions);
        const wasiOptionsProxied = getWasiOptionsProxied(this._wasiOptions);

        let workerUrlString = "./wasiWorkerThread.js";
        if (isNode()) {
            workerUrlString = "./wasiWorkerThreadNode.js";
        }
        const workerUrl = new URL(workerUrlString, import.meta.url);
        wasiWorkerDebug("WASIWorker workerUrl: ", workerUrl);
        const worker = await createWorker(workerUrl, { type: "module" });

        //const { URL } = await import("node:url");
        //const nodeEndpoint = await import("comlink/dist/umd/node-adapter.js");
        //const { Worker } = await import("node:worker_threads");
        //const worker =  new Worker(new URL("./wasiWorkerThreadNode.js");
        //const wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(nodeEndpoint(worker));

        this.wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(worker);
        wasiWorkerDebug("WASIWorker setOptions: ", wasiOptionsProxied);

        //worker.on("message", (incoming) => {
        worker.addEventListener("message", (msg: MessageEvent<any>) => {
            wasiWorkerDebug("WASIWorker incoming message: ", { msg });
        });

        try {
            await this.wasiWorkerThread.setOptions(wasiOptionsProxied);
        } catch (err: any) {
            wasiWorkerDebug("wasiWorkerThread.setOptions err: ", err);
            console.trace(err);
        }

        wasiWorkerDebug("WASIWorker run: ");
        return await this.wasiWorkerThread.run(moduleUrl);
    }

    public async createWorker(): Promise<void> {
        let workerUrlString = "./wasiWorkerThread.js";
        if (isNode()) {
            workerUrlString = "./wasiWorkerThreadNode.js";
        }
        const workerUrl = new URL(workerUrlString, import.meta.url);
        wasiWorkerDebug("WASIWorker workerUrl: ", workerUrl);

        const worker = await createWorker(workerUrl, { type: "module" });

        this.wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(worker);

    }

    public handleImport(
        importName: string,
        functionName: string,
        args: any[],
        buf: ArrayBuffer,
    ): any {
        if (this.wasiWorkerThread) {
            const channel = undefined;
            const messageId = uuidv4();
            this.wasiWorkerThread.handleImport(messageId,importName,functionName,args,buf);
            // @ts-ignore
            const retMsg = readMessage(channel, messageId);
        }
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

    public async handleImport(
        messageId: string,
        importName: string,
        functionName: string,
        args: any[],
        buf: ArrayBuffer
    ): Promise<void> {
        wasiWorkerDebug(
            `WasiWorkerThreadRunner: handleImport: importName: ${importName} functionName: ${functionName}`
        );
        const wasi = this.wasi;
        if (wasi) {
            const moduleImports = this.wasi?.moduleImports;
            if (moduleImports) {
                wasiWorkerDebug(`WasiWorkerThreadRunner: handleImport: wasi is set`);
                return await wasi.handleImport(messageId, importName, functionName, args, buf, moduleImports);
            } else {
                console.error("no moduleImports set");
            }
        } else {
            wasiWorkerDebug(`WasiWorkerThreadRunner: handleImport: wasi is not set`);
        }
        throw new Error(`WasiWorkerThreadRunner Error handling import: ${importName} functionName: ${functionName}`);
    }

    public async run(moduleUrl: string): Promise<number> {
        wasiWorkerDebug("WasiWorkerThread run: moduleUrl:", moduleUrl);

        wasiWorkerDebug("WasiWorkerThread wasiOptions: ", this.wasiOptions);

        if (this.wasiOptions) {
            const wasiOpts = this.wasiOptions;
            wasiWorkerDebug("WasiWorkerThread wasiOpts: ", wasiOpts);

            this.wasi = new WASI(wasiOpts);
            wasiWorkerDebug("WasiWorkerThread wasi: ");

            const { wasmBuf } = await getWasmBuffer(moduleUrl);

            return await this.wasi.run(wasmBuf);
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
