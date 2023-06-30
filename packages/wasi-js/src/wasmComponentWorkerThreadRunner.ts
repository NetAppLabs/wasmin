import { HandleWasmComponentImportFunc, HandleWasmImportFunc } from "./desyncify.js";
import { Channel, makeChannel } from "./vendored/sync-message/index.js";
import { CommandRunner } from "./wasi_snapshot_preview2/command/index.js";
import { createComponentModuleImportProxyPerImportForChannel } from "./wasmWorker.js";
import { initializeComlinkHandlers, wasmWorkerThreadDebug } from "./workerUtils.js";
import * as comlink from "comlink";

export class WasmComponentWorkerThreadRunner {
    commandRunner?: CommandRunner;
    _channel?: Channel | null;
    constructor() {
        wasmWorkerThreadDebug("WasmThreadRunner creating");
        initializeComlinkHandlers();
    }

    async instantiate(channel: Channel, wasmBuf: BufferSource, importNames: string[], handleComponentImportFunc: HandleWasmComponentImportFunc){
        this._channel = channel;
        const impObject = this.createComponentModuleImportProxy(importNames, handleComponentImportFunc)
        this.commandRunner = new CommandRunner(impObject);
        await this.commandRunner.instantiate(wasmBuf)
    }

    async run() {
        if (this.commandRunner) {
            await this.commandRunner?.run();
        } else {
            throw new Error("CommandRunner not set");
        }
    }

    private createComponentModuleImportProxy(importNames: string[],handleComponentImportFunc: HandleWasmComponentImportFunc): {} {
        const componentImports: Record<string,any> = {};
        for (const importName of importNames) {
            componentImports[importName] = this.createComponentModuleImportProxyPerImport(importName, handleComponentImportFunc);
        }
        return componentImports;
    }

    private createComponentModuleImportProxyPerImport(importName: string, handleComponentImportFunc: HandleWasmComponentImportFunc): {} {
        const wasiWorker = this;
        const channel = this._channel;
        if (channel) {
            return createComponentModuleImportProxyPerImportForChannel(importName, channel, handleComponentImportFunc);
        } else {
            throw new Error("Channel not set");
        }
    }

}

