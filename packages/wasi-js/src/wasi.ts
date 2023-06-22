/*
 * Main interface for using wasi-js
 */

import { instantiate } from "./vendored/asyncify/asyncify.js";
import {
    HandleWasmImportFunc,
    instantiateOnThreadRemote,
    instantiateWithAsyncDetection,
    USE_SHARED_ARRAYBUFFER_WORKAROUND,
    USE_SHARED_MEMORY,
    USE_SINGLE_THREAD_REMOTE,
    WasmThreadRunner,
} from "./desyncify.js";
import * as comlink from "comlink";

import { TTY } from "./tty.js";
import { initializeWasiExperimentalConsoleToImports } from "./wasi-experimental-console.js";
import { initializeWasiExperimentalFilesystemsToImports } from "./wasi-experimental-filesystems.js";
import { initializeWasiExperimentalProcessToImports } from "./wasi-experimental-process.js";
import { OpenFiles, Readable, Writable } from "./wasiFileSystem.js";
import { initializeWasiSnapshotPreview1AsyncToImports } from "./wasi_snapshot_preview1/host.js";
import { copyBuffer, CStringArray, In, isExitStatus, lineOut, Out, sleep, wasiDebug, wasiError } from "./wasiUtils.js";
import { initializeWasiExperimentalSocketsToImports } from "./wasi_experimental_sockets/host.js";
import { Channel, writeMessage } from "./vendored/sync-message/index.js";
import { WasiSnapshotPreview2ImportObject, constructWasiSnapshotPreview2Imports } from "./wasi_snapshot_preview2/index.js";
import { wasiWorkerDebug } from "./workerUtils.js";

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

class MultiModule {
    _moduleInstances: WebAssembly.Instance[] = [];
    _moduleImports: WebAssembly.Imports[] = [];
}

export type InstantiateMultipleFunc = () => Promise<{
    instanceSource: BufferSource,
    instanceImport: WebAssembly.Imports,
    instances: WebAssembly.Instance[],
    imports: WebAssembly.Imports[],
}>;

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
    private _threadRemote?: comlink.Remote<WasmThreadRunner>;
    private _memory?: WebAssembly.Memory;
    // private _multiModule?: MultiModule;
    private _componentImportObject?: WasiSnapshotPreview2ImportObject;
    public get componentImportObject(): WasiSnapshotPreview2ImportObject {
        if (!this._componentImportObject) {
            throw new Error("component imports not set");
        }
        return this._componentImportObject;
    }
    public set componentImportObject(value: WasiSnapshotPreview2ImportObject) {
        this._componentImportObject = value;
    }

    get wasiEnv() {
        return this._wasiEnv;
    }

    /*
    get moduleInstance() {
        return this._multiModule ? this._multiModule._moduleInstances : [this._moduleInstance] as WebAssembly.Instance[];
    }
    */

    get moduleImports() {
        // return this._multiModule ? this._multiModule._moduleImports : [this._moduleImports] as WebAssembly.Imports[];
        return this._moduleImports as WebAssembly.Imports;
    }

    // public async instantiateMultiModule(instantiateMultipleFunc: InstantiateMultipleFunc): Promise<WebAssembly.Instance> {
    //     const ret = await instantiateMultipleFunc();
    //     this._multiModule = {
    //         _moduleInstances: ret.instances,
    //         _moduleImports: ret.imports,
    //     };
    //     //return this.instantiateSingle(ret.instanceSource, ret.instanceImport);
    //     const firstInstance = ret.instances[1];
    //     return firstInstance;
    // }

    public async initializeComponentImports(): Promise<string[]> {
        return this.initializeWasiSnapshotPreview2Imports();
    }

    public async instantiateSingle(
        wasmModOrBufSource: BufferSource,
        imports: WebAssembly.Imports
    ): Promise<WebAssembly.Instance> {
        // console.log("instantiateSingle:");
        let handleImportFunc: HandleWasmImportFunc | undefined;
        let threadRemote: comlink.Remote<WasmThreadRunner> | undefined;
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
                    return await this.handleImport(messageId, importName, functionName, args, buf, moduleImports);
                } catch (err: any) {
                    wasiDebug("WASI.handleImportFuncLocal err: ", err);
                    throw err;
                }
            };
            handleImportFunc = comlink.proxy(handleImportFuncLocal);
            if (handleImportFunc) {
                wasiDebug("WASI: handleImportFunc: ", handleImportFunc);
            } else {
                wasiDebug("WASI: handleImportFunc: ", handleImportFunc);
            }
            const instRes = await instantiateOnThreadRemote(
                wasmModOrBufSource,
                imports,
                handleImportFunc,
                this._threadRemote
            );
            wasiDebug("[run] got instRes: ", instRes);
            if (!this._moduleImports && imports) {
                /*const imps: Record<string, WebAssembly.ModuleImports> = {}; // this.initializeImports();
                for (const [importKey, importValue] of Object.entries(imports)) {
                    // if (importKey !== "wasi_snapshot_preview1") {
                        let vals: WebAssembly.ModuleImports = {};
                        for (const [funcKey, funcValue] of Object.entries(importValue)) {
                            vals[funcKey] = funcValue;
                        }
                        imps[importKey] = vals;
                        // console.log("WASI: handleImportFunc: importKey:", importKey);
                    // }
                }
                this._moduleImports = imps;
                // console.log("WASI: handleImportFunc: _moduleImports:", this._moduleImports);
                */
               this._moduleImports = imports;
            }
            this._moduleInstance = instRes.instance;
            this._channel = instRes.channel;
            if (USE_SINGLE_THREAD_REMOTE) {
                this._threadRemote = instRes.threadRemote;
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
            this._moduleInstance = await instantiate(wasmMod, imports);
        }
        return this._moduleInstance;
    }

    public async run(wasmModOrBufSource: WebAssembly.Module | BufferSource): Promise<number> {
        wasiDebug("WASI.run:");
        this._moduleImports = this.initializeImports();
        let handleImportFunc: HandleWasmImportFunc | undefined;
        let threadRemote: comlink.Remote<WasmThreadRunner> | undefined;
        const useAsyncDetection = true;
        if (useAsyncDetection) {
            const handleImportFuncLocal: HandleWasmImportFunc = async (
                messageId: string,
                importName: string,
                functionName: string,
                args: any[],
                buf: ArrayBuffer
            ) => {
                try {
                    const moduleImports = this.moduleImports;
                    return await this.handleImport(messageId, importName, functionName, args, buf, moduleImports);
                } catch (err: any) {
                    wasiDebug("WASI.handleImportFuncLocal err: ", err);
                    throw err;
                }
            };
            handleImportFunc = comlink.proxy(handleImportFuncLocal);
            if (handleImportFunc) {
                wasiDebug("WASI: handleImportFunc: ", handleImportFunc);
            } else {
                wasiDebug("WASI: handleImportFunc: ", handleImportFunc);
            }
            const instRes = await instantiateWithAsyncDetection(
                wasmModOrBufSource,
                this._moduleImports,
                handleImportFunc
            );
            wasiDebug("[run] got instRes: ", instRes);
            this._moduleInstance = instRes.instance;
            this._channel = instRes.channel;
            threadRemote = instRes.threadRemote;
            wasiDebug("[run] setting channel: ", this._channel);
        } else {
            let wasmMod: WebAssembly.Module;
            if (wasmModOrBufSource instanceof ArrayBuffer || ArrayBuffer.isView(wasmModOrBufSource)) {
                const modSource = wasmModOrBufSource as ArrayBufferView;
                wasmMod = WebAssembly.compile(modSource);
            } else {
                wasmMod = wasmModOrBufSource as WebAssembly.Module;
            }
            this._moduleInstance = await instantiate(wasmMod, this._moduleImports);
        }
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
            if (isExitStatus(err)) {
                wasiDebug("WASI.run in catch for _start: is ExitStatus");
                if (threadRemote) {
                    wasiDebug("WASI.run threadRemote in exit:", threadRemote);
                    threadRemote[comlink.releaseProxy]();
                }
                this._moduleInstance = undefined;
                this._channel = undefined;
                return err.statusCode;
            } else {
                throw err;
            }
        }
    }

    public async exportFunction(module: WebAssembly.Module): Promise<WebAssembly.Exports> {
        const imports = this.initializeImports();
        const { exports } = await instantiate(module, imports);
        this.initializeInstanceMemory(exports);

        return exports;
    }

    public async handleComponentImport(
        channel: Channel,
        messageId: string,
        importName: string,
        sectionName: string,
        functionName: string,
        args: any[]
    ): Promise<void> {
        const componentImports = this.componentImportObject as any;
        const sections = componentImports[importName];
        const section = sections[sectionName];
        const func = section[functionName] as Function;

        let funcReturn, funcThrownError;
        try {
            // Binding "this" to section object for fuction
            const boundFunc = func.bind(section);
            funcReturn = await boundFunc(...args);
        } catch (err: any) {
            funcThrownError = err;
        }
        if (funcThrownError) {
            //console.log(`WASI: handleComponentImport: importName: ${importName}, sectionName: ${sectionName}, functionName: ${functionName}: args: `,args, ` funcThrownError: `, funcThrownError)
            wasiWorkerDebug(`WASI: handleComponentImport: importName: ${importName}, sectionName: ${sectionName}, functionName: ${functionName}: args: `,args, `funcThrownError: `, funcThrownError)
        } else {
            //console.log(`WASI: handleComponentImport: importName: ${importName}, sectionName: ${sectionName}, functionName: ${functionName}: args: `,args, `return: `, funcReturn)
            wasiWorkerDebug(`WASI: handleComponentImport: importName: ${importName}, sectionName: ${sectionName}, functionName: ${functionName}: args: `,args, `return: `, funcReturn)
        }
        const response = {
            return: funcReturn,
            error: funcThrownError,
        };
        writeMessage(channel, response, messageId);
    }

    public async handleImport(
        messageId: string,
        importName: string,
        functionName: string,
        args: any[],
        buf: ArrayBuffer,
        moduleImports: WebAssembly.Imports,
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
                if (USE_SHARED_ARRAYBUFFER_WORKAROUND && buf instanceof SharedArrayBuffer) {
                    wasiDebug("wasi.handleIimport is SharedArrayBuffer buf: ", buf);
                    wasmBuf = new ArrayBuffer(buf.byteLength);
                    copyBuffer(buf, wasmBuf);
                } else {
                    wasiDebug("wasi.handleIimport is not SharedArrayBuffer: ", buf);
                    wasmBuf = buf;
                }
                const mem: WebAssembly.Memory = {
                    buffer: wasmBuf,
                    grow: function (delta: number): number {
                        throw new Error("grow function not implemented.");
                    },
                };

                this._memory = mem;
                wasiDebug(`WASI handleImport: entering function: ${importName}.${functionName} args: `, args);
                wasiDebug(`WASI handleImport: entering function: ${importName}.${functionName} memory: `, this._memory);

                const modImport = moduleImports[importName];
                const importedFunc = modImport[functionName] as any;
                let funcReturn: any;
                let funcThrownError: any;
                try {
                    wasiDebug(`WASI handleImport: importedFunc: `, importedFunc);
                    if (functionName == "fd_write") {
                        console.log("WASI handleImport, import is fd_write");
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
                if (USE_SHARED_MEMORY) {
                    if (USE_SHARED_ARRAYBUFFER_WORKAROUND && buf instanceof SharedArrayBuffer) {
                        copyBuffer(wasmBuf, buf);
                    }
                    response = { return: funcReturn, error: funcThrownError };
                } else {
                    const newBuf = this._memory.buffer;
                    const newTypedArray = new Uint8Array(newBuf);
                    const newNumberArray = Array.from(newTypedArray);
                    response = {
                        memory: newNumberArray,
                        return: funcReturn,
                        error: funcThrownError,
                    };
                    this._memory = undefined;
                }

                writeMessage(channel, response, messageId);
            } else {
                throw new Error("WASI handleImport: moduleImports not set");
            }
        } else {
            wasiDebug(`WASI handleImport: channel is not set`);
        }
    }

    private initializeWasiSnapshotPreview2Imports(): string[] {
        this._componentImportObject = constructWasiSnapshotPreview2Imports(this._wasiEnv);

        const importNames: string[] = [];
        for (const [importName, _importValue] of Object.entries(this._componentImportObject)) {
            importNames.push(importName);
        }
        return importNames;
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
            wasiDebug("WASI tty.setModuleInstanceExports");
            this.wasiEnv.tty.setModuleInstanceExports(exports);
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
