import { instantiate, Root, ImportObject } from "./runner.js";
import * as comlink from "comlink";

const isNode = typeof process !== "undefined" && process.versions && process.versions.node;

async function fetchCompile(url: URL) {
    if (isNode) {
        let _fs = await import("fs/promises");
        return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
}

export type WasiCommand = Root;

const instantiateCore = WebAssembly.instantiate;

export class CommandRunner {
    importObject?: Record<string, any>;
    wasmModOrBufferSource?: WebAssembly.Module | BufferSource;
    commandComponent?: WasiCommand;

    constructor(importObject: Record<string, any>) {
        this.importObject = importObject;
    }

    async compileCore(url: string) {
        // special case for main core module of component
        if (url == "component.core.wasm") {
            if (this.wasmModOrBufferSource) {
                if (this.wasmModOrBufferSource instanceof WebAssembly.Module) {
                    return this.wasmModOrBufferSource as WebAssembly.Module;
                } else {
                    const bufSource = this.wasmModOrBufferSource as BufferSource;
                    const mod = await WebAssembly.compile(bufSource);
                    return mod;
                }
            } else {
                throw new Error("Wasm module source not set");
            }
        }
        url = "./" + url;
        const metaUrl = new URL(url, import.meta.url);
        return await fetchCompile(metaUrl);
    }

    async instantiate(wasmModOrBufferSource: WebAssembly.Module | BufferSource): Promise<WasiCommand> {
        this.wasmModOrBufferSource = wasmModOrBufferSource;
        const importObject = this.importObject;
        const compileFunc = this.compileCore;
        const boundCompilerFunc = compileFunc.bind(this);

        try {
            if (importObject) {
                const impObject = importObject as unknown as ImportObject;
                this.commandComponent = await instantiate(boundCompilerFunc, impObject, instantiateCore);
            }
        } catch (err: any) {
            throw err;
        }
        if (this.commandComponent) {
            return this.commandComponent;
        }
        throw new Error("Error intantiating Wasi Command");
    }

    async run() {
        if (this.commandComponent) {
            try {
                this.commandComponent.run();
            } finally {
                this.cleanup();
            }
        } else {
            throw new Error("commandComponent not set");
        }
    }

    [comlink.finalizer]() {
        this.cleanup();
    }

    cleanup() {}
}
