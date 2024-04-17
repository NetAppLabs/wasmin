import { HandleWasmComponentImportFunc, HandleWasmImportFunc } from "./desyncify.js";
import { Channel, makeChannel } from "./vendored/sync-message/index.js";
import { wasmWorkerThreadDebug } from "./wasiDebug.js";
import { CommandRunner } from "./wasi_snapshot_preview2/command/index.js";
import { createComponentImportOrResourceProxy } from "./wasmWorker.js";
import { initializeComlinkHandlers } from "./workerUtils.js";
import * as comlink from "comlink";


/**
 * 
 * Implementation of the Worker when a WebAssembly component
 * is running within this Worker
 * 
 */
export class WasmComponentWorkerThreadRunner {
    commandRunner?: CommandRunner;
    handleComponentImportFunc?: any;
    _channel?: Channel | null;
    constructor() {
        // TODO: find better way than setting high limit
        //events.defaultMaxListeners = 600;
        //process.on("warning", (e) => wasmWorkerThreadDebug("warn", e));
        wasmWorkerThreadDebug("WasmComponentWorkerThreadRunner creating");
        initializeComlinkHandlers();
    }

    async instantiate(
        channel: Channel,
        wasmBuf: BufferSource,
        importNames: string[],
        handleComponentImportFunc: HandleWasmComponentImportFunc
    ) {
        wasmWorkerThreadDebug("wasmComponentThreadRunner init");
        this._channel = channel;
        const impObject: Record<string, any> = this.createComponentModuleImportProxy(
            importNames,
            handleComponentImportFunc
        );
        this.commandRunner = new CommandRunner(impObject);
        this.handleComponentImportFunc = handleComponentImportFunc;
        await this.commandRunner.instantiate(wasmBuf);
    }

    async run() {
        wasmWorkerThreadDebug("wasmComponentThreadRunner run");
        if (this.commandRunner) {
            try {
                await this.commandRunner?.run();
            } finally {
                wasmWorkerThreadDebug("wasmComponentThreadRunner run finally");
                this.cleanup();
            }
        } else {
            throw new Error("CommandRunner not set");
        }
    }

    private createComponentModuleImportProxy(
        importNames: string[],
        handleComponentImportFunc: HandleWasmComponentImportFunc
    ): Record<string, any> {
        const componentImports: Record<string, any> = {};
        for (const importName of importNames) {
            componentImports[importName] = this.createComponentModuleImportProxyPerImport(
                importName,
                handleComponentImportFunc
            );
        }
        return componentImports;
    }

    private createComponentModuleImportProxyPerImport(
        importName: string,
        handleComponentImportFunc: HandleWasmComponentImportFunc
    ): {} {
        const wasiWorker = this;
        const channel = this._channel;
        if (channel) {
            return createComponentImportOrResourceProxy("import", importName, channel, handleComponentImportFunc);
        } else {
            throw new Error("Channel not set");
        }
    }

    public cleanup(): void {
        wasmWorkerThreadDebug("WasmComponentWorkerThreadRunner.cleanup");
        if (this.commandRunner) {
            wasmWorkerThreadDebug("WasmComponentWorkerThreadRunner.cleanup commandRunner: ", this.commandRunner);
            this.commandRunner.cleanup();
        }
        if (this.handleComponentImportFunc) {
            wasmWorkerThreadDebug(
                "WasmComponentWorkerThreadRunner.cleanup handleImportFunc: ",
                this.handleComponentImportFunc
            );
            if (this.handleComponentImportFunc[comlink.releaseProxy]) {
                wasmWorkerThreadDebug("WasmComponentWorkerThreadRunner.cleanup handleImportFunc releaseProxy");
                this.handleComponentImportFunc[comlink.releaseProxy]();
            }
        }
    }
}
