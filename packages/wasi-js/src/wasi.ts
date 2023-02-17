/*
 * Main interface for using wasi-js
 */

import { instantiate } from "./asyncify.js";
import {
    HandleWasmImportFunc,
    instantiateWithAsyncDetection,
    TransferMemoryFunc,
    USED_SHARED_MEMORY,
} from "./deasyncify.js";
import * as comlink from "comlink";

import { TTY } from "./tty.js";
import { initializeWasiExperimentalConsoleToImports } from "./wasi-experimental-console.js";
import { initializeWasiExperimentalFilesystemsToImports } from "./wasi-experimental-filesystems.js";
import { initializeWasiExperimentalProcessToImports } from "./wasi-experimental-process.js";
import { OpenFiles, Readable, Writable } from "./wasiFileSystem.js";
import { initializeWasiSnapshotPreview1AsyncToImports } from "./wasi_snapshot_preview1/host.js";
import { CStringArray, ExitStatus, In, lineOut, Out, sleep, wasiDebug, wasiError } from "./wasiUtils.js";
import { initializeWasiExperimentalSocketsToImports } from "./wasi_experimental_sockets/host.js";
import { Channel, writeMessage } from "./sync-message/index.js";

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
export class WasiEnv implements WasiOptions {
    constructor(
        openFiles?: OpenFiles,
        stdin?: In,
        stdout?: Out,
        stderr?: Out,
        args?: string[],
        env?: Record<string, string>,
        abortSignal?: AbortSignal,
        tty?: TTY
    ) {
        if (!openFiles) {
            openFiles = new OpenFiles({});
        }
        this._openFiles = openFiles;

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
    private _wasiEnv: WasiEnv;
    private _moduleInstance?: WebAssembly.Instance;
    private _moduleImports?: WebAssembly.Imports;
    private _channel?: Channel;
    private _memory?: WebAssembly.Memory;

    get wasiEnv() {
        return this._wasiEnv;
    }

    get moduleInstance() {
        return this._moduleInstance;
    }

    get moduleImports() {
        return this._moduleImports;
    }

    public async run(wasmMod: WebAssembly.Module, wasmBuf?: BufferSource): Promise<number> {
        wasiDebug("WASI.run:");
        this._moduleImports = this.initializeImports();

        const useAsyncDetection = true;
        if (useAsyncDetection) {
            const handleImportFuncLocal: HandleWasmImportFunc = async (
                messageId: string,
                importName: string,
                functionName: string,
                args: any[],
                buf: ArrayBuffer,
                transferMemoryFunc: TransferMemoryFunc
            ) => {
                return await this.handleImport(messageId, importName, functionName, args, buf, transferMemoryFunc);
            };
            const handleImportFunc = comlink.proxy(handleImportFuncLocal);
            if (wasmBuf) {
                const instRes = await instantiateWithAsyncDetection(
                    wasmMod,
                    wasmBuf,
                    this._moduleImports,
                    handleImportFunc
                );
                wasiDebug("[run] got instRes: ", instRes);
                this._moduleInstance = instRes.instance;
                this._channel = instRes.channel;
                wasiDebug("[run] setting channel: ", this._channel);
            } else {
                throw new Error("wasmBuf must be set for non-asynified wasm modules");
            }
        } else {
            this._moduleInstance = await instantiate(wasmMod, this._moduleImports);
        }
        wasiDebug("[run] after instantiate ");
        wasiDebug("[run] after instantiate , _moduleInstance: ", this._moduleInstance);
        const exports = this._moduleInstance.exports;
        wasiDebug("[run] exports: ", exports);
        //@ts-ignore
        const originalExports: WebAssembly.Exports = this._moduleInstance.originalExports;
        wasiDebug("[run] originalExports: ", originalExports);

        const { _start } = exports;
        this.initializeInstanceMemory(exports);
        try {
            if (this.wasiEnv.tty) {
                // Reloading to set correct rows and columns
                await this.wasiEnv.tty.reload();
            }
            wasiDebug("[run] calling _start: ");
            await (_start as any)();
            wasiDebug("[run] returning from _start: ");
            return 0;
        } catch (err: any) {
            wasiError(err);
            wasiDebug("WASI.run in catch for _start , err: ", err);
            if (err instanceof ExitStatus) {
                wasiDebug("WASI.run: is ExitStatus");
                return err.statusCode;
            }
            throw err;
        }
    }

    public async exportFunction(module: WebAssembly.Module): Promise<WebAssembly.Exports> {
        const imports = this.initializeImports();
        const { exports } = await instantiate(module, imports);
        this.initializeInstanceMemory(exports);

        return exports;
    }

    public async handleImport(
        messageId: string,
        importName: string,
        functionName: string,
        args: any[],
        buf: ArrayBuffer,
        transferMemoryFunc: TransferMemoryFunc
    ): Promise<void> {
        wasiDebug(`WASI handleImport: messageId: ${messageId} importName: ${importName} functionName: ${functionName}`);
        const moduleImports = this.moduleImports;

        while (!this._channel) {
            wasiDebug("waiting for channel");
            await sleep(100);
        }
        const channel = this._channel;
        if (channel) {
            //wasiDebug(`WASI handleImport: channel is set`);
            if (moduleImports) {
                const mem: WebAssembly.Memory = {
                    buffer: buf,
                    grow: function (delta: number): number {
                        throw new Error("grow function not implemented.");
                    },
                };
                this._memory = mem;
                wasiDebug(`WASI handleImport: this._memory: `, this._memory);
                wasiDebug(`WASI handleImport: args: `, args);

                const modImport = moduleImports[importName];
                const importedFunc = modImport[functionName] as any;
                const funcReturn = await importedFunc(...args);
                //wasiDebug(`WASI handleImport: importedFunc: ${importedFunc} args: `, args);
                wasiDebug(`WASI handleImport: funcReturn: `, funcReturn);

                let response: any;
                if (USED_SHARED_MEMORY) {
                    response = { return: funcReturn };
                } else {
                    const newBuf = this._memory.buffer;
                    const newTypedArray = new Uint8Array(newBuf);
                    const newNumberArray = Array.from(newTypedArray);
                    //const newTypedArrayBufString = JSON.stringify(newTypedArrayBuf2);
                    //const mem = this._memory
                    //transferMemoryFunc(buf);
                    // Tell other worker we have finished with response:
                    response = { memory: newNumberArray, return: funcReturn };
                    this._memory = undefined;
                }

                writeMessage(channel, response, messageId);
            } else {
                throw new Error("Wasi moduleImports not set");
            }
        } else {
            wasiDebug(`WASI handleImport: channel is not set`);
        }
        throw new Error(`Error handling import: ${importName} functionName: ${functionName}`);
    }

    private initializeImports(): WebAssembly.Imports {
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
        //const { memory } = exports;
        if (this.wasiEnv.tty) {
            wasiDebug("tty.setModuleInstanceExports");
            this.wasiEnv.tty.setModuleInstanceExports(exports);
        } else {
            wasiDebug("tty is null");
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
                if (this._memory) {
                    wasiDebug("WASI getting memory, this._memory is set");
                    return this._memory;
                } else {
                    wasiDebug("WASI getting memory, this._memory is not set");
                }
            }
            if (this._moduleInstance) {
                return this._moduleInstance.exports[name];
            } else {
                throw new Error(`WebAssembly moduleInstance not initialized, export ${name} not found`);
            }
        } else {
            throw new Error(`this not set on get_export`);
        }
    }
}
