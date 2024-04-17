/*
 * Main interface for using wasi-js
 */

import { instantiate } from "./vendored/asyncify/asyncify.js";
import {
    HandleCallType,
    HandleWasmComponentImportFunc,
    HandleWasmImportFunc,
    WasmRunMode,
    instantiateOnWasmWorker,
    instantiateWithAsyncDetection,
} from "./desyncify.js";
import { WasmWorker } from "./wasmWorker.js";
import * as comlink from "comlink";

import { TTY, TTYSize } from "./tty.js";
import { initializeWasiExperimentalConsoleToImports } from "./wasi-experimental-console.js";
import { initializeWasiExperimentalFilesystemsToImports } from "./wasi-experimental-filesystems.js";
import { initializeWasiExperimentalProcessToImports } from "./wasi-experimental-process.js";
import { OpenFiles, Readable, ReadableAsyncOrSync, Writable, WritableAsyncOrSync } from "./wasiFileSystem.js";
import { initializeWasiSnapshotPreview1AsyncToImports } from "./wasi_snapshot_preview1/host.js";
import {
    CStringArray,
    isExitStatus,
    lineOut,
    sleep,
    wasiCallDebug,
    wasiDebug,
    wasiError,
    wasiFdDebug,
} from "./wasiUtils.js";
import { initializeWasiExperimentalSocketsToImports } from "./wasi_experimental_sockets/host.js";
import { Channel, makeChannel, writeMessage } from "./vendored/sync-message/index.js";
import {
    WasiSnapshotPreview2AsyncImportObject,
    constructWasiSnapshotPreview2Imports,
} from "./wasi_snapshot_preview2/async/index.js";
import { getSymbolForString, isSymbol, isSymbolStringIdentifier, wasiWorkerDebug } from "./workerUtils.js";
import { Resource, containsResourceObjects, createProxyForResources, getResourceIdentifier, getResourceObjectForResourceProxy, getResourceSerializableForProxyObjects, storeResourceObjects } from "./wasiResources.js";


/**
 * Interface for constructing Environment for
 * a WASI instance
 */
export interface WasiOptions {
    openFiles?: OpenFiles;
    stdin?: ReadableAsyncOrSync;
    stdout?: WritableAsyncOrSync;
    stderr?: WritableAsyncOrSync;
    args?: string[];
    env?: Record<string, string>;
    abortSignal?: AbortSignal;
    tty?: TTY;
    name?: string;
    componentMode?: boolean,
}

/**
 * Converts a WasiOptions into a WasiEnv
 * if wasiOptions is instanceof WasiEnv it returns it
 * otherwise a copy is created.
 */
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
            wasiOptions.tty,
            wasiOptions.name,
            wasiOptions.componentMode
        );
        return wasiEnv;
    }
}


/**
 * WasiEnv holds the environment for a WASI instance
 */
export class WasiEnv implements WasiOptions {
    constructor(
        openFiles?: OpenFiles,
        stdin?: ReadableAsyncOrSync,
        stdout?: WritableAsyncOrSync,
        stderr?: WritableAsyncOrSync,
        args?: string[],
        env?: Record<string, string>,
        abortSignal?: AbortSignal,
        tty?: TTY,
        name?: string,
        componentMode?: boolean
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
        if (componentMode !== undefined) {
            this._componentMode = componentMode;
        } else {
            this._componentMode = false;
        }
    }

    private _name: string;
    private _args: string[];
    private _env: Record<string, string>;
    private _cargs: CStringArray;
    private _cenv: CStringArray;
    private _openFiles: OpenFiles;
    private _stdin: ReadableAsyncOrSync;
    private _stdout: WritableAsyncOrSync;
    private _stderr: WritableAsyncOrSync;
    private _abortSignal?: AbortSignal;
    private _suspendStdIn = false;
    private _tty?: TTY;
    private _componentMode: boolean;

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
    set stdin(sin: ReadableAsyncOrSync) {
        this._stdin = sin;
    }
    get stdout() {
        return this._stdout;
    }
    set stdout(sout: WritableAsyncOrSync) {
        this._stdout = sout;
    }
    get stderr() {
        return this._stderr;
    }
    set stderr(serr: WritableAsyncOrSync) {
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
    get componentMode() {
        return this._componentMode;
    }
    set componentMode(componentMode: boolean) {
        this._componentMode = componentMode;
    }

}

/**
 * 
 * Main interface for instanciating a WASI instance in the current thread.
 * For instanciating WASI in its own Worker see WASIWorker
 */
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
            wasiOptions.tty,
            wasiOptions.name,
            wasiOptions.componentMode
        );
        this._wasiEnv = wasiEnv;
    }
    public singleWasmWorker = true;
    // Environment vor this WASI instance
    private _wasiEnv: WasiEnv;

    // Only used in Core mode
    private _coreModuleInstance?: WebAssembly.Instance;
    private _coreModuleMemory?: WebAssembly.Memory;
    private _coreModuleImports?: WebAssembly.Imports;

    // Only used in Component mode
    private _componentImportObject?: {};
    private _resources?: {};

    // Channel for communication with WasmWorker if used
    private _channel?: Channel;
    // Worker for optionally running WebAssembly.Instance
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
    public get resources(): {} {
        if (!this._resources) {
            this._resources = new Map();
        }
        return this._resources;
    }

    get wasiEnv() {
        return this._wasiEnv;
    }

    get coreModuleImports() {
        return this._coreModuleImports as WebAssembly.Imports;
    }

    get component() {
        return this._wasiEnv.componentMode;
    }

    set component(componentMode: boolean) {
        this._wasiEnv.componentMode = componentMode;
    }

    get componentMode() {
        return this._wasiEnv.componentMode;
    }

    public async initializeComponentImports(wasiExperimentalSocketsNamespace?: string): Promise<string[]> {
        this.componentImportObject = this.initializeWasiSnapshotPreview2Imports();
        if (wasiExperimentalSocketsNamespace) {
            const componentImportObject = this.componentImportObject as WasiSnapshotPreview2AsyncImportObject;
            const filesystem = () => componentImportObject["wasi:filesystem/types"];
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
        if (this.componentMode) {
            return await this.instantiateComponent(wasmModOrBufSource);
        } else {
            return await this.instantiateCore(wasmModOrBufSource, imports);
        }
    }
    // Instantiation for a WebAssembly Component Model Component
    public async instantiateComponent(
        wasmModOrBufSource: WebAssembly.Module | BufferSource
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
            callType: HandleCallType,
            importName: string,
            functionName: string,
            args: any[]
        ) => {
            //const localComponentImportObject = componentImportObject;
            try {
                wasiCallDebug(`[wasi] [component] : [${importName}] [${functionName}]:`, args);
                return await this.handleComponentImport(channel, messageId, callType, importName, functionName, args);
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
                buf: ArrayBufferLike
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
                runMode: WasmRunMode
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
            wasiCallDebug(` Running wasm in mode: ${instRes.runMode} `);
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
                wasmMod = await WebAssembly.compile(modSource);
            } else {
                wasmMod = wasmModOrBufSource as WebAssembly.Module;
            }
            this._coreModuleInstance = await instantiate(wasmMod, imports);
        }
        return this._coreModuleInstance;
    }

    public async run(wasmModOrBufSource: WebAssembly.Module | BufferSource): Promise<number> {
        if (this.componentMode) {
            const ret = await this.runComponent(wasmModOrBufSource);
            return ret;
        } else {
            const ret = await this.runCore(wasmModOrBufSource);
            return ret;
        }
    }

    public async runComponent(wasmModOrBufSource: WebAssembly.Module | BufferSource): Promise<number> {
        const importNames = await this.initializeComponentImports();

        await this.instantiateComponent(wasmModOrBufSource);
        let runMode: WasmRunMode = "worker-component";
        wasiCallDebug(` Running wasm in mode: ${runMode} `);

        if (this._worker) {
            try {
                if (this._worker && this._worker.componentRunner) {
                    wasiDebug("before _worker.componentRunner");
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
        await this.initializeTTYSettings(exports);
        try {
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

    /**
     * 
     * @param callType import or resource
     * @param importName 
     * @returns 
     */
    public getObjectToCall(
        callType: HandleCallType,
        identifier: string,
    ): any {
        let res = undefined;
        if (callType == "import") {
            const componentImports = this.componentImportObject as any;
            const imp = componentImports[identifier];
            res = imp;
        } else  if (callType == "resource") {
            const resources = this.resources as any;
            res = resources[identifier];
        }
        if (res !== undefined) {
            return res;
        }
        throw new Error(`getObjectToCall could not find object with callType: ${callType} identifier: ${identifier}`)
    }

    public storeResource(
        importName: string,
        resourceId: number,
        res: any,
    ): any {
        const identifier = getResourceIdentifier(importName, resourceId);
        const resources = this.resources as any;
        wasiDebug(`storeResource storing resource object with identifier: ${identifier}`);
        resources[identifier] = res;
    }

    public lookupResource(
        importName: string,
        resourceId: number,
    ): Resource | undefined {
        const identifier = getResourceIdentifier(importName, resourceId);
        const resources = this.resources as any;
        wasiDebug(`lookupResource lookung up resource object with identifier: ${identifier}`);
        const res = resources[identifier];
        return res;
    }

    public async handleComponentImport(
        channel: Channel,
        messageId: string,
        callType: HandleCallType,
        importName: string,
        functionName: string,
        args: any[]
    ): Promise<void> {
        const imp = this.getObjectToCall(callType, importName);
        let func: Function|undefined = undefined;
        if (isSymbolStringIdentifier(functionName)) {
            let symbolKey = getSymbolForString(functionName);
            const asyncDisposeSymbolKey = Symbol.for("asyncDispose");
            const nodeJsAsyncDisposeSymbolKey = Symbol.for("nodejs.asyncDispose");
            let isDisposeSymbol = false;
            if (functionName == "Symbol(dispose)" || functionName == "Symbol(nodejs.dispose)") {
                isDisposeSymbol = true;
            }
            if (isDisposeSymbol) {
                // take asyncDispose if it exists
                func = imp[asyncDisposeSymbolKey] as Function;
                if (func == undefined) {
                    func = imp[nodeJsAsyncDisposeSymbolKey] as Function;
                }
            }
            if (func == undefined) {
                // else take regular dispose if it exists
                func = imp[symbolKey] as Function;
            }
            // return dummy symbol function if not found on resource:
            if (func == undefined) {
                func = () => {
                    let typeName = imp.constructor?.name;
                    if (typeName == undefined) {
                        typeName = imp.typeName;
                    }
                    wasiWorkerDebug(`warning: symbol ${functionName} function not implemented for resource with importName: ${importName}, typeName: ${typeName}`);
                    return;
                };
            }
        } else {
            const sFunctionName = functionName as string;
            func = imp[sFunctionName] as Function;
        }
        let newArgs = args;
        let i = 0;
        let lookupFunc = this.lookupResource;
        lookupFunc = lookupFunc.bind(this);
        for (let arg of newArgs) {
            let newArg = undefined;
            if (containsResourceObjects(arg)) {
                newArg = getResourceObjectForResourceProxy(arg, importName, lookupFunc);
            }
            if (newArg) {
                newArgs[i] = newArg;
            } else {
                newArgs[i] = arg;
            }
            i++;
        }

        let funcReturn, funcThrownError;
        try {
            // Binding "this" to section object for fuction
            const boundFunc = func.bind(imp);
            funcReturn = await boundFunc(...newArgs);
            if (containsResourceObjects(funcReturn)) {
                let storeFunc = this.storeResource;
                storeFunc = storeFunc.bind(this);
                storeResourceObjects(importName, funcReturn, storeFunc);
                funcReturn = getResourceSerializableForProxyObjects(funcReturn);
            }
        } catch (err: any) {
            funcThrownError = err;
        }
        if (funcThrownError) {
            wasiWorkerDebug(
                `WASI: handleComponentImport: importName: ${importName} functionName: ${functionName}: args: `,
                args,
                `funcThrownError: `,
                funcThrownError
            );
        } else {
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
        buf: ArrayBufferLike,
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
                let wasmBuf: ArrayBufferLike;
                wasiDebug("wasi.handleIimport is not SharedArrayBuffer: ", buf);
                wasmBuf = buf;
                const mem: WebAssembly.Memory = {
                    buffer: wasmBuf,
                    grow: function (delta: number): number {
                        throw new Error("grow function not implemented.");
                    },
                };

                this._coreModuleMemory = mem;
                if (functionName == "fd_read" || functionName == "fd_write") {
                    wasiFdDebug(`[WASI.handleCoreImport] calling: [${importName}.${functionName}] args: `, args);
                } else {
                    wasiDebug(`[WASI.handleCoreImport] calling: [${importName}.${functionName}] args: `, args);
                }
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

    private async initializeTTYSettings(exports: WebAssembly.Exports): Promise<void> {
        if (this.wasiEnv.tty) {
            const myTTy = this.wasiEnv.tty;
            const onResizeListener = async (size: TTYSize) => {
                // Call size exported function on wasm instance
                const { term_set_rows } = exports;
                const { term_set_columns } = exports;
                if (term_set_rows) {
                    const rows = size.rows;
                    wasiDebug("term_set_rows", rows);
                    await (term_set_rows as any)(rows);
                }
                if (term_set_columns) {
                    const columns = size.columns;
                    wasiDebug("term_set_columns", columns);
                    await (term_set_columns as any)(columns);
                }
                const { term_reload } = exports;
                if (term_reload) {
                    await (term_reload as any)();
                }
            }
            const onResizeListenerProxyFunc = comlink.proxy(onResizeListener);
            myTTy.setOnResize(onResizeListenerProxyFunc);

            // Trigger once for correct initial size:
            const curSize = await myTTy.getSize();
            await myTTy.setSize(curSize);

        } else {
            wasiDebug("WASI tty is null");
        }
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

