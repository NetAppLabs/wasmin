import { instantiate, Root } from "./runner.js";

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
    importObject?: any;
    wasmModOrBufferSource?: WebAssembly.Module | BufferSource;
    commandComponent?: WasiCommand;

    constructor(importObject: any) {
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

        try{
            this.commandComponent = await instantiate(boundCompilerFunc, importObject, instantiateCore);
            console.log("commandComponent: ", this.commandComponent);
        } catch(err: any) {
            console.log("instantiate err: ",err);
            throw err;
        }
        return this.commandComponent;
    }

    async run() {
        if (this.commandComponent) {
            this.commandComponent.run();
        } else {
            throw new Error("commandComponent not set");
        }
    }
}
