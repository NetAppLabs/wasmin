import { WASI, WasiOptions } from "./wasi.js";
import * as comlink from "comlink";
import { getWasmBuffer, initializeHandlers, wasiWorkerDebug } from "./workerUtils.js";
import { ReciveMemoryFunc, USE_SHARED_MEMORY } from "./desyncify.js";
import { createWorker, Worker } from "./vendored/web-worker/index.js";
import { isNode } from "./wasiUtils.js";
import { Channel, makeAtomicsChannel, makeChannel, readMessage, uuidv4, writeMessage } from "./vendored/sync-message/index.js";

export class WASIWorker {
    wasiWorkerThread?: comlink.Remote<WasiWorkerThreadRunner>;
    worker?: Worker;
    constructor(wasiOptions: WasiOptions) {
        initializeHandlers();
        this._wasiOptions = wasiOptions;
    }
    private _wasiOptions: WasiOptions;
    private _channel?: Channel;

    get channel(): Channel {
        if (!this._channel) {
            throw new Error("channel not set");
        }
        return this._channel;
    }

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
        this.worker = await createWorker(workerUrl, { type: "module" });

        //const { URL } = await import("node:url");
        //const nodeEndpoint = await import("comlink/dist/umd/node-adapter.js");
        //const { Worker } = await import("node:worker_threads");
        //const worker =  new Worker(new URL("./wasiWorkerThreadNode.js");
        //const wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(nodeEndpoint(worker));

        this.wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(this.worker);
        wasiWorkerDebug("WASIWorker setOptions: ", wasiOptionsProxied);

        //worker.on("message", (incoming) => {
        this.worker.addEventListener("message", (msg: MessageEvent<any>) => {
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

        this.worker = await createWorker(workerUrl, { type: "module" });

        this.wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(this.worker);
        this._channel = createChannel();
        await this.wasiWorkerThread.initializeComponentImports();
    }

    public stopWorker(): void {
        this.worker?.terminate();
    }

    public getComponentImports(): {} {
        // TODO: obtain import names programmatically
        return {
            'cli-base': this.getComponentModuleImports('cli-base'),
            filesystem: this.getComponentModuleImports('filesystem'),
            io: this.getComponentModuleImports('io'),
            random: this.getComponentModuleImports('random'),
        };
    }

    private getComponentModuleImports(importName: string): {} {
        const wasiWorker = this;
        const importDummy = {};
        return new Proxy(importDummy, {
            get: (_target, name, _receiver) => {
                const sectionName = name as string;
                const sectionDummy = {};
                return new Proxy(sectionDummy, {
                    get: (_target, name, _receiver) => {
                        const functionName = name as string;
                        return (...args: any) => {
                            if (!wasiWorker.wasiWorkerThread) {
                                throw new Error("worker thread not set");
                            }

                            const workerThread = wasiWorker.wasiWorkerThread;
                            const channel = wasiWorker.channel;
                            const messageId = uuidv4();
                            workerThread.handleComponentImport(channel, messageId, importName, sectionName, functionName, args);
                            const ret = readMessage(channel, messageId);
                            if (ret.error) {
                                throw ret.error;
                            }
                            return ret.return;
                        };
                    },
                });
            },
        });
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

    public async initializeComponentImports(): Promise<void> {
        if (!this.wasi) {
            this.wasi = new WASI(this.wasiOptions || {});
        }
        await this.wasi.initializeComponentImports();
    }

    public async handleComponentImport(
        channel: Channel,
        messageId: string,
        importName: string,
        sectionName: string,
        functionName: string,
        args: any[]
    ): Promise<any> {
        await this.wasi?.handleComponentImport(channel, messageId, importName, sectionName, functionName, args);
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

function createChannel(): Channel {
    let channel: Channel | null;
    if (USE_SHARED_MEMORY) {
        channel = makeChannel();
    } else {
        const bufferSize = 64 * 1024 * 1024;
        channel = makeAtomicsChannel({ bufferSize });
    }
    if (!channel) {
        throw new Error("could not create channel");
    }
    return channel;
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
