/*
 * Main interface for using wasi-js
 */

import { instantiate } from "./asyncify";
import { instantiateWithAsyncDetection } from "./deasyncify";

import { TTY } from "./tty";
import { initializeWasiExperimentalConsoleToImports } from "./wasi-experimental-console";
import { initializeWasiExperimentalFilesystemsToImports } from "./wasi-experimental-filesystems";
import { initializeWasiExperimentalProcessToImports } from "./wasi-experimental-process";
import { OpenFiles } from "./wasiFileSystem";
import { initializeWasiSnapshotPreview1AsyncToImports } from "./wasi_snapshot_preview1_host";
import { CStringArray, ExitStatus, In, lineOut, Out, wasiDebug, wasiError } from "./wasiUtils";

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
export class WasiEnv {
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
        if (!stdout) {
            stdout = lineOut(console.log);
        }
        this._stdout = stdout;
        if (!stderr) {
            stderr = lineOut(console.error);
        }
        this._stderr = stderr;
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

    get wasiEnv() {
        return this._wasiEnv;
    }

    get moduleInstance() {
        return this._moduleInstance;
    }

    get moduleImports() {
        return this._moduleImports;
    }

    public async run(module: WebAssembly.Module): Promise<number> {
        wasiDebug("WASI.run:");
        this._moduleImports = this.initializeImports();

        const useAsyncDetection = false;
        if (useAsyncDetection) {
            const instRes = await instantiateWithAsyncDetection(module, this._moduleImports);
            this._moduleInstance = instRes.instance;
            //const isAsync = instRes.isAsync;
        } else {
            this._moduleInstance = await instantiate(module, this._moduleImports);
        }
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
            await (_start as any)();
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
        return wasmImports;
    }

    private initializeInstanceMemory(exports: WebAssembly.Exports): void {
        const { memory } = exports;
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
