import { WASI, WasiOptions } from "./wasi.js";
import * as comlink from "comlink";
import { getWasmBuffer, getWorkerUrl, initializeComlinkHandlers, wasiWorkerDebug } from "./workerUtils.js";
import { HandleCallType, HandleWasmComponentImportFunc, HandleWasmImportFunc, StoreReceivedMemoryFunc } from "./desyncify.js";
import { createWorker, Worker } from "./vendored/web-worker/index.js";
import { isNode } from "./wasiUtils.js";
import {
    Channel,
    makeAtomicsChannel,
    makeChannel,
    readMessage,
    uuidv4,
    writeMessage,
} from "./vendored/sync-message/index.js";
import { OpenFiles, ReadableAsyncOrSync, WritableAsyncOrSync } from "./wasiFileSystem.js";
import { RegisterProvider, getDirectoryHandleByURL, isBun } from "@wasmin/fs-js";
import { TTY, TTYInstance } from "./tty.js";
import { FileSystemDirectoryHandle } from "@wasmin/fs-js";
import { createComponentImportOrResourceProxy } from "./wasmWorker.js";
import { node } from "@wasmin/node-fs-js";
//import { nfs } from "@wasmin/nfs-js";

export type ProviderUrl = string;
export type OpenFilesMap = Record<string, ProviderUrl>;
export interface WasiWorkerOptions {
    openFiles?: OpenFilesMap;
    stdin?: ReadableAsyncOrSync;
    stdout?: WritableAsyncOrSync;
    stderr?: WritableAsyncOrSync;
    args?: string[];
    env?: Record<string, string>;
    abortSignal?: AbortSignal;
    tty?: TTY;
    name?: string,
    componentMode?: boolean,
}

/**
 * 
 * Interface from the client side for running WASI in its own dedicated Worker.
 * 
 */
export class WASIWorker {
    constructor(wasiOptions: WasiWorkerOptions) {
        initializeComlinkHandlers();
        this._wasiOptions = wasiOptions;
    }
    wasiWorkerThread?: comlink.Remote<WasiWorkerThreadRunner>;
    worker?: Worker;

    private _wasiOptions: WasiWorkerOptions;
    private _channel?: Channel;
    private _componentImports?: Record<string, any>;

    get channel(): Channel {
        if (!this._channel) {
            throw new Error("channel not set");
        }
        return this._channel;
    }

    public get componentImports(): {} {
        if (!this._componentImports) {
            throw new Error("component imports not set");
        }
        return this._componentImports;
    }

    public async run(moduleUrl: string): Promise<number> {
        wasiWorkerDebug("WASIWorker this._wasiOptions: ", this._wasiOptions);

        await this.createWorker();

        if (this.worker && this.wasiWorkerThread) {
            return await this.wasiWorkerThread.run(moduleUrl);
        } else {
            throw new Error("Wasi Worker not initialized");
        }
    }


    public async createWorker(wasiExperimentalSocketsNamespace?: string): Promise<{}> {
        let workerUrlString = "./wasiWorkerThread.js";
        //let workerUrl = new URL("./wasiWorkerThread.js", import.meta.url);
        if (isNode()) {
            workerUrlString = "./wasiWorkerThreadNode.js";
            //workerUrl = new URL("./wasiWorkerThreadNode.js", import.meta.url);
        }
        const workerUrl = getWorkerUrl(workerUrlString);

        this.worker = await createWorker(workerUrl, { type: "module" });

        this.wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(this.worker);
        this._channel = createChannel();

            //worker.on("message", (incoming) => {
        this.worker.addEventListener("message", (msg: MessageEvent<any>) => {
            wasiWorkerDebug("WASIWorker incoming message: ", { msg });
        });
        const wasiOptionsProxied = getWasiOptionsProxied(this._wasiOptions);
        try {
            await this.wasiWorkerThread.setOptions(wasiOptionsProxied);
        } catch (err: any) {
            wasiWorkerDebug("wasiWorkerThread.setOptions err: ", err);
        }
        wasiWorkerDebug("WASIWorker createWorker: ");

        const importNames = await this.wasiWorkerThread.initializeComponentImports(wasiExperimentalSocketsNamespace);
        this._componentImports = this.createComponentModuleImportProxy(importNames);
        return this._componentImports;
    }

    public stopWorker(): void {
        const wasiWorker = this;
        const workerThread = wasiWorker.wasiWorkerThread;
        if (workerThread) {
            const handleComponentImportFunc = workerThread.handleComponentImport;
            if (handleComponentImportFunc) {
                if (handleComponentImportFunc[comlink.releaseProxy]) {
                    handleComponentImportFunc[comlink.releaseProxy]();
                }
            }
            if (workerThread[comlink.releaseProxy]) {
                workerThread[comlink.releaseProxy]();
            }
        }
        this.worker?.terminate();
    }

    private createComponentModuleImportProxy(importNames: string[]): {} {
        this._componentImports = {};
        for (const importName of importNames) {
            this._componentImports[importName] = this.createComponentModuleImportProxyPerImport(importName);
        }
        return this._componentImports;
    }

    private createComponentModuleImportProxyPerImport(importName: string): {} {
        const wasiWorker = this;
        const channel = wasiWorker.channel;
        const workerThread = wasiWorker.wasiWorkerThread;
        if (workerThread) {
            const handleComponentImportFunc = workerThread.handleComponentImport;
            return createComponentImportOrResourceProxy("import", importName, channel, handleComponentImportFunc);
        } else {
            throw new Error("WasiWorkerThread not set");
        }
    }
}

/**
 * 
 * Implementation of running a WASI instance in this Worker.
 * 
 */
export class WasiWorkerThreadRunner {
    constructor() {
        initializeComlinkHandlers();
        if (isNode()) {
            RegisterProvider("node", node);
        //} else if (isBun()) {
        //    const bunimport = await import("@wasmin/bun-fs-js");
        //    const bunfs = bunimport.bun;
        //    RegisterProvider("bun", bunfs);
        }
        // @ts-ignore
        //RegisterProvider("nfs", nfs);
    }
    private wasiWorkerOptions?: WasiWorkerOptions;
    private wasi?: WASI;

    public setOptions(options: WasiWorkerOptions): void {
        wasiWorkerDebug("WasiWorkerThread setOptions options: ", options);
        this.wasiWorkerOptions = options;
    }

    public async toWasiOptions(wasiWorkerOptions?: WasiWorkerOptions): Promise<WasiOptions> {
        let tty = wasiWorkerOptions?.tty;
        if (!tty) {
            tty = new TTYInstance(80, 24, true);
        }
        const wasiOpts: WasiOptions = {
            stdin: wasiWorkerOptions?.stdin,
            stdout: wasiWorkerOptions?.stdout,
            stderr: wasiWorkerOptions?.stderr,
            env: wasiWorkerOptions?.env,
            args: wasiWorkerOptions?.args,
            abortSignal: wasiWorkerOptions?.abortSignal,
            tty: tty,
            name: wasiWorkerOptions?.name,
            componentMode: wasiWorkerOptions?.componentMode,
        };

        if (wasiWorkerOptions?.openFiles) {
            const ofMap: Record<string, FileSystemDirectoryHandle> = {};
            for (const [path, url] of Object.entries(wasiWorkerOptions.openFiles)) {
                const handle = await getDirectoryHandleByURL(url);
                ofMap[path] = handle;
            }
            wasiOpts.openFiles = new OpenFiles(ofMap);
        } else {
            wasiOpts.openFiles = new OpenFiles({});
        }

        return wasiOpts;
    }
    /*
    public setStdOutWriter(writeFunc: (buf: Uint8Array) => Promise<void>): void {
        wasiWorkerDebug("WasiWorkerThread setStdOutWriter writeFunc: ", writeFunc);
        const newStdout = {
            write: writeFunc,
        };
        if (this.wasiWorkerOptions) {
            this.wasiWorkerOptions.stdout = newStdout;
        } else {
            throw new Error("WasiOptions not set");
        }
    }*/

    public async initializeComponentImports(wasiExperimentalSocketsNamespace?: string): Promise<string[]> {
        this.wasi = new WASI(await this.toWasiOptions(this.wasiWorkerOptions));
        return await this.wasi.initializeComponentImports(wasiExperimentalSocketsNamespace);
    }

    public async handleComponentImport(
        channel: Channel,
        messageId: string,
        callType: HandleCallType,
        importName: string,
        functionName: string,
        args: any[]
    ): Promise<any> {
        await this.wasi?.handleComponentImport(channel, messageId, callType, importName, functionName, args);
    }

    public async handleCoreImport(
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
            const moduleImports = this.wasi?.coreModuleImports;
            if (moduleImports) {
                wasiWorkerDebug(`WasiWorkerThreadRunner: handleImport: wasi is set`);
                return await wasi.handleCoreImport(messageId, importName, functionName, args, buf, moduleImports);
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

        wasiWorkerDebug("WasiWorkerThread wasiOptions: ", this.wasiWorkerOptions);
        
        //this.wasi = new WASI(await this.toWasiOptions(wasiWorkerOpts));
        //wasiWorkerDebug("WasiWorkerThread wasi: ");

        const { wasmBuf } = await getWasmBuffer(moduleUrl);

        if (this.wasi) {
            return await this.wasi.run(wasmBuf);
        } else {
            throw new Error("run WASI not set");
        }
    }
}

function createChannel(): Channel {
    let channel: Channel | null;
    channel = makeChannel();
    if (!channel) {
        throw new Error("could not create channel");
    }
    return channel;
}


export function getWasiOptionsProxied(options: WasiWorkerOptions): WasiWorkerOptions {
    const wasiOptionsProxied: WasiWorkerOptions = {};
    wasiOptionsProxied.args = options.args;
    wasiOptionsProxied.env = options.env;
    wasiOptionsProxied.openFiles = options.openFiles;

    const origStdIn = options.stdin;
    if (origStdIn) {
        const stdInProxied = comlink.proxy(origStdIn)
        wasiOptionsProxied.stdin = stdInProxied;
    }

    const origStdOut = options.stdout;
    if (origStdOut) {
        const stdOutProxied = comlink.proxy(origStdOut)
        wasiOptionsProxied.stdout = stdOutProxied;
    }

    const origStdErr = options.stderr;
    if (origStdErr) {
        const stdErrProxied = comlink.proxy(origStdErr)
        wasiOptionsProxied.stderr = stdErrProxied;
    }

    const origTty = options.tty;
    if (origTty) {
        const ttyProxied = comlink.proxy(origTty)
        wasiOptionsProxied.tty = ttyProxied;
    }
    wasiOptionsProxied.componentMode = options.componentMode;

    return wasiOptionsProxied;
}

