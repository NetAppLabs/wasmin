/*
 * Main interface for using wasi-js
 */

import { instantiate } from "./vendored/asyncify/asyncify.js";
import {
    HandleWasmComponentImportFunc,
    HandleWasmImportFunc,
    instantiateOnWasmWorker,
    instantiateWithAsyncDetection,
} from "./desyncify.js";
import { WasmWorker } from "./wasmWorker.js";
import * as comlink from "comlink";

import { TTY } from "./tty.js";
import { initializeWasiExperimentalConsoleToImports } from "./wasi-experimental-console.js";
import { initializeWasiExperimentalFilesystemsToImports } from "./wasi-experimental-filesystems.js";
import { initializeWasiExperimentalProcessToImports } from "./wasi-experimental-process.js";
import { OpenFiles, Readable, Writable } from "./wasiFileSystem.js";
import { initializeWasiSnapshotPreview1AsyncToImports } from "./wasi_snapshot_preview1/host.js";
import { CStringArray, In, isExitStatus, lineOut, Out, sleep, wasiDebug, wasiError } from "./wasiUtils.js";
import { initializeWasiExperimentalSocketsToImports } from "./wasi_experimental_sockets/host.js";
import { Channel, makeChannel, writeMessage } from "./vendored/sync-message/index.js";
import {
    WasiSnapshotPreview2AsyncImportObject,
    constructWasiSnapshotPreview2Imports,
} from "./wasi_snapshot_preview2/async/index.js";
import { wasiWorkerDebug } from "./workerUtils.js";
import { WasiExperimentalSocketsPreview2Wrapper } from "./wasi_snapshot_preview2/async/wasi-experimental-sockets-wrapper.js";

export interface WasiOptions {
    openFiles?: OpenFiles;
    stdin?: In;
    stdout?: Out;
    stderr?: Out;
    args?: string[];
    env?: Record<string, string>;
    abortSignal?: AbortSignal;
    tty?: TTY;
}

export function wasiEnvFromWasiOptions(wasiOptions: WasiOptions): WasiEnv {
    if (wasiOptions instanceof WasiEnv) {
        const wasiEnv = wasiOptions as WasiEnv;
        return wasiEnv;
    } else {
        const wasiEnv = new WasiEnv(
            wasiOptions.openFiles,
            wasiOptions.stdin,
            wasiOptions.stdout,
            wasiOptions.stderr,
            wasiOptions.args,
            wasiOptions.env,
            wasiOptions.abortSignal,
            wasiOptions.tty
        );
        return wasiEnv;
    }
}

export class WasiEnv implements WasiOptions {
    constructor(
        openFiles?: OpenFiles,
        stdin?: In,
        stdout?: Out,
        stderr?: Out,
        args?: string[],
        env?: Record<string, string>,
        abortSignal?: AbortSignal,
        tty?: TTY,
        name?: string
    ) {
        if (!openFiles) {
            this._openFiles = new OpenFiles({});
        } else {
            this._openFiles = openFiles;
        }

        if (!stdin) {
            stdin = { read: () => new Uint8Array() };
        }
        this._stdin = stdin;
        const rstdin = stdin as Readable;
        this._openFiles.set(0, rstdin);

        if (!stdout) {
            stdout = lineOut(console.log);
        }
        this._stdout = stdout;
        const wstdout = stdout as Writable;
        this._openFiles.set(1, wstdout);

        if (!stderr) {
            stderr = lineOut(console.error);
        }
        this._stderr = stderr;
        const wstderr = stderr as Writable;
        this._openFiles.set(2, wstderr);

        if (!args) {
            this._args = [];
        } else {
            this._args = args;
        }
        if (name) {
            this._name = name;
        } else {
            this._name = "wasi";
        }
        // argv[0] is prefilled with name
        // TODO make this customizable
        const execNameWasm = this._name;
        // prefix argument list for first argument for executable itself
        this._args.splice(0, 0, execNameWasm);

        this._cargs = new CStringArray(this._args);
        if (!env) {
            env = {};
        }
        this._env = env;
        this._cenv = new CStringArray(Object.entries(this._env).map(([key, value]) => `${key}=${value}`));
        this._abortSignal = abortSignal;
        if (tty) {
            this._tty = tty;
        }
    }

    private _name: string;
    private _args: string[];
    private _env: Record<string, string>;
    private _cargs: CStringArray;
    private _cenv: CStringArray;
    private _openFiles: OpenFiles;
    private _stdin: In;
    private _stdout: Out;
    private _stderr: Out;
    private _abortSignal?: AbortSignal;
    private _suspendStdIn = false;
    private _tty?: TTY;

    get cargs() {
        return this._cargs;
    }
    get cenv() {
        return this._cenv;
    }
    get args() {
        return this._args;
    }
    get env() {
        return this._env;
    }
    get openFiles() {
        return this._openFiles;
    }
    get stdin() {
        return this._stdin;
    }
    set stdin(sin: In) {
        this._stdin = sin;
    }
    get stdout() {
        return this._stdout;
    }
    set stdout(sout: Out) {
        this._stdout = sout;
    }
    get stderr() {
        return this._stderr;
    }
    set stderr(serr: Out) {
        this._stderr = serr;
    }
    get abortSignal() {
        return this._abortSignal;
    }
    get suspendStdIn() {
        return this._suspendStdIn;
    }
    set suspendStdIn(susp: boolean) {
        this._suspendStdIn = susp;
    }
    get tty() {
        return this._tty;
    }
}

export class WASI {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = new WasiEnv(
            wasiOptions.openFiles,
            wasiOptions.stdin,
            wasiOptions.stdout,
            wasiOptions.stderr,
            wasiOptions.args,
            wasiOptions.env,
            wasiOptions.abortSignal,
            wasiOptions.tty
        );
        this._wasiEnv = wasiEnv;
    }
    public component = false;
    public singleWasmWorker = true;
    private _wasiEnv: WasiEnv;

    private _coreModuleInstance?: WebAssembly.Instance;
    private _coreModuleMemory?: WebAssembly.Memory;
    private _coreModuleImports?: WebAssembly.Imports;

    private _componentImportObject?: {};
    private _componentInstance?: {};

    private _channel?: Channel;
    private _worker?: WasmWorker;

    public get componentImportObject(): {} {
        if (!this._componentImportObject) {
            throw new Error("component imports not set");
        }
        return this._componentImportObject;
    }
    public set componentImportObject(value: {}) {
        this._componentImportObject = value;
    }

    get wasiEnv() {
        return this._wasiEnv;
    }

    get coreModuleImports() {
        return this._coreModuleImports as WebAssembly.Imports;
    }

    public async initializeComponentImports(wasiExperimentalSocketsNamespace?: string): Promise<string[]> {
        this.componentImportObject = this.initializeWasiSnapshotPreview2Imports();
        if (wasiExperimentalSocketsNamespace) {
            const componentImportObject = this.componentImportObject as WasiSnapshotPreview2AsyncImportObject;
            const filesystem = () => componentImportObject["wasi:filesystem/filesystem"];
            const sockets = () => {
                let sock = {
                    socketsInstanceNetwork: componentImportObject["wasi:sockets/instance-network"],
                    socketsNetwork: componentImportObject["wasi:sockets/network"],
                    socketsTcpCreateSocket: componentImportObject["wasi:sockets/tcp-create-socket"],
                    socketsTcp: componentImportObject["wasi:sockets/tcp"],
                    socketsIpNameLookup: componentImportObject["wasi:sockets/ip-name-lookup"],
                };
                return sock;
            };
            const componentImportObjectAny = this.componentImportObject as any;
            componentImportObjectAny[wasiExperimentalSocketsNamespace] = new WasiExperimentalSocketsPreview2Wrapper(
                filesystem,
                sockets
            );
        }

        const importNames: string[] = [];
        for (const [importName, _importValue] of Object.entries(this.componentImportObject)) {
            importNames.push(importName);
        }
        return importNames;
    }

    public async instantiate(
        wasmModOrBufSource: WebAssembly.Module | BufferSource,
        imports: WebAssembly.Imports
    ): Promise<any> {
        if (this.component) {
            return await this.instantiateComponent(wasmModOrBufSource, imports);
        } else {
            return await this.instantiateCore(wasmModOrBufSource, imports);
        }
    }
    // Instantiation for a WebAssembly Component Model Component
    public async instantiateComponent(
        wasmModOrBufSource: WebAssembly.Module | BufferSource,
        componentImportObject2: any
    ): Promise<WebAssembly.Instance | any> {
        const importNames: string[] = [];
        for (const [importName, _importValue] of Object.entries(this.componentImportObject)) {
            importNames.push(importName);
        }
        if (!this._channel) {
            const madeChannel = makeChannel();
            if (madeChannel) {
                this._channel = madeChannel;
            }
        } else {
            throw new Error("Channel not available");
        }
        const channel = this._channel;

        let handleComponentImportFunc: HandleWasmComponentImportFunc | undefined;
        const handleComponentImportFuncLocal: HandleWasmComponentImportFunc = async (
            channel: Channel,
            messageId: string,
            importName: string,
            functionName: string,
            args: any[]
        ) => {
            //const localComponentImportObject = componentImportObject;
            try {
                return await this.handleComponentImport(channel, messageId, importName, functionName, args);
            } catch (err: any) {
                wasiDebug("WASI.handleImportFuncLocal err: ", err);
                throw err;
            }
        };
        handleComponentImportFunc = comlink.proxy(handleComponentImportFuncLocal);
        if (handleComponentImportFunc) {
            wasiDebug("WASI: handleComponentImportFunc: ", handleComponentImportFunc);
        } else {
            wasiDebug("WASI: handleComponentImportFunc: ", handleComponentImportFunc);
        }

        if (!this._worker) {
            this._worker = new WasmWorker();
            await this._worker.createComponentWorker();
        }

        if (wasmModOrBufSource instanceof WebAssembly.Module) {
            throw new Error("WebAssembly.Module argument not supported for Component");
        } else {
            const bufSource = wasmModOrBufSource as BufferSource;
            if (channel) {
                if (this._worker.componentRunner) {
                    await this._worker.componentRunner.instantiate(
                        channel,
                        bufSource,
                        importNames,
                        handleComponentImportFunc
                    );
                } else {
                    throw new Error("WasmComponentWorkerThread not set");
                }
            } else {
                throw new Error("Channel not available");
            }
        }

        /*
        let instRes: {
            instance: WebAssembly.Instance;
            isAsyncified: boolean;
            channel?: Channel;
            worker?: WasmWorker;
            moduleInstanceId?: string;
        };
        if (withAsyncDetection) {
            instRes = await instantiateWithAsyncDetection(wasmModOrBufSource, imports, handleImportFunc);
        } else {
            let sourceBuffer: BufferSource | null = null;
            if (wasmModOrBufSource instanceof ArrayBuffer || ArrayBuffer.isView(wasmModOrBufSource)) {
                sourceBuffer = wasmModOrBufSource as BufferSource;
            }
            instRes = await instantiateOnWasmWorker(sourceBuffer, imports, handleImportFunc, this._worker);
        }
        wasiDebug("[run] got instRes: ", instRes);
        if (!this._coreModuleImports && imports) {
            this._coreModuleImports = imports;
        }
        this._coreModuleInstance = instRes.instance;
        this._channel = instRes.channel;
        if (this.singleWasmWorker) {
            this._worker = instRes.worker;
        }
        wasiDebug("[run] setting channel: ", this._channel);

        return this._coreModuleInstance;
        */
        return null;
    }

    // Instantiate for a regulare core Webassembly.Module
    public async instantiateCore(
        wasmModOrBufSource: WebAssembly.Module | BufferSource,
        imports: WebAssembly.Imports,
        withAsyncDetection = false
    ): Promise<WebAssembly.Instance> {
        let handleImportFunc: HandleWasmImportFunc | undefined;
        const useAsyncDetection = true;
        if (useAsyncDetection) {
            const handleImportFuncLocal: HandleWasmImportFunc = async (
                messageId: string,
                importName: string,
                functionName: string,
                args: any[],
                buf: ArrayBuffer
            ) => {
                const moduleImports = imports;
                try {
                    return await this.handleCoreImport(messageId, importName, functionName, args, buf, moduleImports);
                } catch (err: any) {
                    wasiDebug("WASI.handleCoreImport err: ", err);
                    throw err;
                }
            };
            handleImportFunc = comlink.proxy(handleImportFuncLocal);
            if (handleImportFunc) {
                wasiDebug("WASI: handleImportFunc: ", handleImportFunc);
            } else {
                wasiDebug("WASI: handleImportFunc: ", handleImportFunc);
            }
            let instRes: {
                instance: WebAssembly.Instance;
                isAsyncified: boolean;
                channel?: Channel;
                worker?: WasmWorker;
                moduleInstanceId?: string;
            };
            if (withAsyncDetection) {
                instRes = await instantiateWithAsyncDetection(wasmModOrBufSource, imports, handleImportFunc);
            } else {
                let sourceBuffer: BufferSource | null = null;
                if (wasmModOrBufSource instanceof ArrayBuffer || ArrayBuffer.isView(wasmModOrBufSource)) {
                    sourceBuffer = wasmModOrBufSource as BufferSource;
                }
                instRes = await instantiateOnWasmWorker(sourceBuffer, imports, handleImportFunc, this._worker);
            }
            wasiDebug("[run] got instRes: ", instRes);
            if (!this._coreModuleImports && imports) {
                this._coreModuleImports = imports;
            }
            this._coreModuleInstance = instRes.instance;
            this._channel = instRes.channel;
            if (this.singleWasmWorker) {
                this._worker = instRes.worker;
            }
            wasiDebug("[run] setting channel: ", this._channel);
        } else {
            let wasmMod: WebAssembly.Module;
            if (wasmModOrBufSource instanceof ArrayBuffer || ArrayBuffer.isView(wasmModOrBufSource)) {
                const modSource = wasmModOrBufSource as ArrayBufferView;
                wasmMod = WebAssembly.compile(modSource);
            } else {
                wasmMod = wasmModOrBufSource as WebAssembly.Module;
            }
            this._coreModuleInstance = await instantiate(wasmMod, imports);
        }
        return this._coreModuleInstance;
    }

    public async run(wasmModOrBufSource: WebAssembly.Module | BufferSource): Promise<number> {
        if (this.component) {
            const ret = await this.runComponent(wasmModOrBufSource);
            return ret;
        } else {
            const ret = await this.runCore(wasmModOrBufSource);
            return ret;
        }
    }

    public async runComponent(wasmModOrBufSource: WebAssembly.Module | BufferSource): Promise<number> {
        const importNames = await this.initializeComponentImports();

        await this.instantiateComponent(wasmModOrBufSource, this.componentImportObject);
        if (this._worker) {
            try {
                if (this._worker && this._worker.componentRunner) {
                    await this._worker.componentRunner.run();
                } else {
                    throw new Error("Worker or ComponentRunner not set");
                }
                return 0;
            } catch (err: any) {
                wasiDebug("runComponent err:", err);
                return 1;
            } finally {
                this._worker.terminate();
            }
        }
        throw new Error("WasmWorker not set");
    }

    public async runCore(wasmModOrBufSource: WebAssembly.Module | BufferSource): Promise<number> {
        wasiDebug("WASI.run:");
        this._coreModuleImports = this.initializeCoreImports();
        this._coreModuleInstance = await this.instantiateCore(wasmModOrBufSource, this._coreModuleImports, true);
        wasiDebug("[run] after instantiate , _moduleInstance: ", this._coreModuleInstance);
        const exports = this._coreModuleInstance.exports;
        wasiDebug("[run] exports: ", exports);
        //@ts-ignore
        const originalExports: WebAssembly.Exports = this._coreModuleInstance.originalExports;
        wasiDebug("[run] originalExports: ", originalExports);

        const { _start } = exports;
        this.initializeInstanceMemory(exports);
        try {
            if (this.wasiEnv.tty) {
                // Reloading to set correct rows and columns
                if (this.wasiEnv.tty.reload) {
                    await this.wasiEnv.tty.reload();
                }
            }
            wasiDebug("[run] calling _start: ");
            await (_start as any)();
            wasiDebug("[run] returning from _start: ");
            //this.stopWorker();
            return 0;
        } catch (err: any) {
            wasiError(err);
            wasiDebug("WASI.run in catch for _start , err: ", err);
            if (isExitStatus(err)) {
                wasiDebug("WASI.run in catch for _start: is ExitStatus");
                if (this._worker) {
                    if (this._worker.coreRunner) {
                        let workerThreadRunner = this._worker.coreRunner;
                        wasiDebug("WASI.run workerThreadRunner in exit:", workerThreadRunner);
                        workerThreadRunner[comlink.releaseProxy]();
                    }
                }
                this._coreModuleInstance = undefined;
                this._channel = undefined;
                return err.code;
            } else {
                throw err;
            }
        } finally {
            this.stopWorker();
        }
    }

    public async exportFunction(wasmModOrBufSource: WebAssembly.Module | BufferSource): Promise<WebAssembly.Exports> {
        if (!this._coreModuleImports) {
            this._coreModuleImports = this.initializeCoreImports();
        }
        if (!this._coreModuleInstance) {
            this._coreModuleInstance = await this.instantiateCore(wasmModOrBufSource, this._coreModuleImports, true);
        }
        let exports = this._coreModuleInstance.exports;

        return exports;
    }

    public async handleComponentImport(
        channel: Channel,
        messageId: string,
        importName: string,
        functionName: string,
        args: any[]
    ): Promise<void> {
        const componentImports = this.componentImportObject as any;
        const imp = componentImports[importName];
        const func = imp[functionName] as Function;

        let funcReturn, funcThrownError;
        try {
            // Binding "this" to section object for fuction
            const boundFunc = func.bind(imp);
            funcReturn = await boundFunc(...args);
        } catch (err: any) {
            funcThrownError = err;
        }
        if (funcThrownError) {
            //console.log(`WASI: handleComponentImport: importName: ${importName}, sectionName: ${sectionName}, functionName: ${functionName}: args: `,args, ` funcThrownError: `, funcThrownError)
            wasiWorkerDebug(
                `WASI: handleComponentImport: importName: ${importName} functionName: ${functionName}: args: `,
                args,
                `funcThrownError: `,
                funcThrownError
            );
        } else {
            //console.log(`WASI: handleComponentImport: importName: ${importName}, sectionName: ${sectionName}, functionName: ${functionName}: args: `,args, `return: `, funcReturn)
            wasiWorkerDebug(
                `WASI: handleComponentImport: importName: ${importName}, functionName: ${functionName}: args: `,
                args,
                `return: `,
                funcReturn
            );
        }
        const response = {
            return: funcReturn,
            error: funcThrownError,
        };
        writeMessage(channel, response, messageId);
    }

    public async handleCoreImport(
        messageId: string,
        importName: string,
        functionName: string,
        args: any[],
        buf: ArrayBuffer,
        moduleImports: WebAssembly.Imports
    ): Promise<void> {
        wasiDebug(`WASI handleImport: messageId: ${messageId} importName: ${importName} functionName: ${functionName}`);
        //const moduleImports = this.moduleImports;

        while (!this._channel) {
            wasiDebug("waiting for channel");
            await sleep(100);
        }
        const channel = this._channel;
        if (channel) {
            if (moduleImports) {
                let wasmBuf: ArrayBuffer;
                wasiDebug("wasi.handleIimport is not SharedArrayBuffer: ", buf);
                wasmBuf = buf;
                const mem: WebAssembly.Memory = {
                    buffer: wasmBuf,
                    grow: function (delta: number): number {
                        throw new Error("grow function not implemented.");
                    },
                };

                this._coreModuleMemory = mem;
                wasiDebug(`WASI handleImport: entering function: ${importName}.${functionName} args: `, args);
                wasiDebug(
                    `WASI handleImport: entering function: ${importName}.${functionName} memory: `,
                    this._coreModuleMemory
                );

                const modImport = moduleImports[importName];
                const importedFunc = modImport[functionName] as any;
                let funcReturn: any;
                let funcThrownError: any;
                try {
                    wasiDebug(`WASI handleImport: importedFunc: `, importedFunc);
                    if (functionName == "fd_write") {
                        wasiDebug("WASI handleImport, import is fd_write");
                    }
                    funcReturn = await importedFunc(...args);
                } catch (err: any) {
                    wasiDebug(`WASI handleImport: importedFunc err: `, err);
                    funcThrownError = err;
                }

                if (funcReturn !== undefined) {
                    wasiDebug(
                        `WASI handleImport: returning function: ${importName}.${functionName} funcReturn: `,
                        funcReturn
                    );
                } else if (funcThrownError !== undefined) {
                    wasiDebug(
                        `WASI handleImport: throwing error from function: ${importName}.${functionName} funcThrownError: `,
                        funcThrownError
                    );
                }
                let response: any;
                response = { return: funcReturn, error: funcThrownError };

                writeMessage(channel, response, messageId);
            } else {
                throw new Error("WASI handleImport: moduleImports not set");
            }
        } else {
            wasiDebug(`WASI handleImport: channel is not set`);
        }
    }

    private initializeWasiSnapshotPreview2Imports(): {} {
        return constructWasiSnapshotPreview2Imports(this._wasiEnv);
    }

    private initializeCoreImports(): WebAssembly.Imports {
        const wasmImports = {};
        const get_export_func = (name: string) => {
            return this.get_export(name);
        };
        initializeWasiSnapshotPreview1AsyncToImports(wasmImports, get_export_func, this.wasiEnv);
        initializeWasiExperimentalFilesystemsToImports(wasmImports, get_export_func, this.wasiEnv);
        initializeWasiExperimentalProcessToImports(wasmImports, get_export_func, this.wasiEnv);
        if (this.wasiEnv.tty) {
            initializeWasiExperimentalConsoleToImports(wasmImports, this.wasiEnv.tty);
        }
        initializeWasiExperimentalSocketsToImports(wasmImports, get_export_func, this.wasiEnv);
        return wasmImports;
    }

    private initializeInstanceMemory(exports: WebAssembly.Exports): void {
        if (this.wasiEnv.tty) {
            wasiDebug("WASI tty.setModuleInstanceExports");
            if (this.wasiEnv.tty.setModuleInstanceExports) {
                this.wasiEnv.tty.setModuleInstanceExports(exports);
            }
        } else {
            wasiDebug("WASI tty is null");
        }
        //const mem = memory as WebAssembly.Memory;
        //const memoryBuffer = mem.buffer;
        //this.wasiEnv.buffer = memoryBuffer;
    }

    private get_export(name: string): WebAssembly.ExportValue {
        if (this) {
            // special case for memory:
            if (name == "memory") {
                //wasiDebug("WASI getting memory")
                if (this._coreModuleMemory) {
                    wasiDebug("WASI getting memory, this._memory is set");
                    return this._coreModuleMemory;
                }
            }
            if (this._coreModuleInstance) {
                return this._coreModuleInstance.exports[name];
            } else {
                throw new Error(`WebAssembly moduleInstance not initialized, export ${name} not found`);
            }
        } else {
            throw new Error(`this not set on get_export`);
        }
    }

    public stopWorker(): void {
        this._worker?.terminate();
        this._worker = undefined;
    }
}
