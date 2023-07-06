import { WASI, WasiOptions } from "./wasi.js";
import * as comlink from "comlink";
import { getWasmBuffer, initializeComlinkHandlers, wasiWorkerDebug } from "./workerUtils.js";
import { HandleWasmComponentImportFunc, HandleWasmImportFunc, StoreReceivedMemoryFunc } from "./desyncify.js";
import { createWorker, Worker } from "./vendored/web-worker/index.js";
import { In, Out, isNode } from "./wasiUtils.js";
import {
    Channel,
    makeAtomicsChannel,
    makeChannel,
    readMessage,
    uuidv4,
    writeMessage,
} from "./vendored/sync-message/index.js";
import { OpenFiles } from "./wasiFileSystem.js";
import { getDirectoryHandleByURL } from "@wasm-env/fs-js";
import { TTY } from "./tty.js";
import { FileSystemDirectoryHandle } from "@wasm-env/fs-js";
import { createComponentModuleImportProxyPerImportForChannel } from "./wasmWorker.js";

export type ProviderUrl = string;
export type OpenFilesMap = Record<string, ProviderUrl>;
export interface WasiWorkerOptions {
    openFiles?: OpenFilesMap;
    stdin?: In;
    stdout?: Out;
    stderr?: Out;
    args?: string[];
    env?: Record<string, string>;
    abortSignal?: AbortSignal;
    tty?: TTY;
}

export class WASIWorker {
    constructor(wasiOptions: WasiWorkerOptions) {
        initializeComlinkHandlers();
        this._wasiOptions = wasiOptions;
    }
    wasiWorkerThread?: comlink.Remote<WasiWorkerThreadRunner>;
    worker?: Worker;

    private _wasiOptions: WasiWorkerOptions;
    private _channel?: Channel;
    private _componentImports?: any;

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
        const wasiOptionsProxied = getWasiOptionsProxied(this._wasiOptions);

        await this.createWorker();

        if (this.worker && this.wasiWorkerThread) {
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
        } else {
            throw new Error("Wasi Worker not initialized");
        }
    }

    public async createWorker(wasiExperimentalSocketsNamespace?: string): Promise<{}> {
        let workerUrlString = "./wasiWorkerThread.js";
        if (isNode()) {
            workerUrlString = "./wasiWorkerThreadNode.js";
        }
        const workerUrl = new URL(workerUrlString, import.meta.url);
        wasiWorkerDebug("WASIWorker workerUrl: ", workerUrl);

        this.worker = await createWorker(workerUrl, { type: "module" });

        this.wasiWorkerThread = comlink.wrap<WasiWorkerThreadRunner>(this.worker);
        this._channel = createChannel();
        const importNames = await this.wasiWorkerThread.initializeComponentImports(wasiExperimentalSocketsNamespace);
        this._componentImports = this.createComponentModuleImportProxy(importNames);
        return this._componentImports;
    }

    public stopWorker(): void {
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
            return createComponentModuleImportProxyPerImportForChannel(importName, channel, handleComponentImportFunc);
        } else {
            throw new Error("WasiWorkerThread not set");
        }
    }
}

export class WasiWorkerThreadRunner {
    constructor() {
        initializeComlinkHandlers();
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
            tty = new TTY(80, 24, true);
        }
        const wasiOpts: WasiOptions = {
            stdin: wasiWorkerOptions?.stdin,
            stdout: wasiWorkerOptions?.stdout,
            stderr: wasiWorkerOptions?.stderr,
            env: wasiWorkerOptions?.env,
            args: wasiWorkerOptions?.args,
            abortSignal: wasiWorkerOptions?.abortSignal,
            tty: tty,
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
    }

    public async initializeComponentImports(wasiExperimentalSocketsNamespace?: string): Promise<string[]> {
        if (!this.wasi) {
            this.wasi = new WASI(await this.toWasiOptions(this.wasiWorkerOptions));
        }
        return await this.wasi.initializeComponentImports(wasiExperimentalSocketsNamespace);
    }

    public async handleComponentImport(
        channel: Channel,
        messageId: string,
        importName: string,
        functionName: string,
        args: any[]
    ): Promise<any> {
        await this.wasi?.handleComponentImport(channel, messageId, importName, functionName, args);
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

        if (this.wasiWorkerOptions) {
            const wasiWorkerOpts = this.wasiWorkerOptions;
            wasiWorkerDebug("WasiWorkerThread wasiWorkerOpts: ", wasiWorkerOpts);

            this.wasi = new WASI(await this.toWasiOptions(wasiWorkerOpts));
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

    const origTty = options.tty;
    if (origTty) {
        wasiOptionsProxied.tty = origTty;
    }

    return wasiOptionsProxied;
}
