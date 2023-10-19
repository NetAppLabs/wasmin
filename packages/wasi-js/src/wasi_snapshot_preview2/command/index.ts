import { wasmWorkerThreadDebug } from "../../workerUtils.js";
import { wasiPreview2Debug } from "../async/preview2Utils.js";
import { instantiate, Root, ImportObject, compileCore } from "@wasmin/wasi-snapshot-preview1-command-component";
import * as comlink from "comlink";

export type WasiCommand = Root;

export function importProxyDebug(msg?: any, ...optionalParams: any[]) {
    console.debug(msg, ...optionalParams);
    //wasmWorkerThreadDebug(msg, ...optionalParams);
}


const instantiateCoreProxied = async (module: WebAssembly.Module, importObject: Record<string, any>) => {
    let proxyHandler = {
        get: (obj: any, name: string) => proxyTransformer("", name, obj[name]),
    };

    let importFunctionWrapper = (namespace: string, name: string, fn: any) => {
        return (...args: any[]) => {
            let doLogCore = false;
            let doLogComponent = false;

            if (namespace.startsWith("wasi_")) {
                doLogCore = true;
            }
            if (namespace.startsWith("wasi:")) {
                doLogComponent = true;
            }

            if (doLogCore) {
                importProxyDebug(`--- [${namespace}] [${name}]`, args);
            }
            if (doLogComponent) {
                importProxyDebug(`<---> [component] [${namespace}] [${name}]`, args);
            }
            const value = fn(...args);
            if (doLogCore) {
                importProxyDebug(`--- [${namespace}] [${name}] returning: `, value);
            }
            return value;
        };
    }
    
    let proxyTransformer = (namespace: string, name: string, value: any): any => {
        //importProxyDebug("--- transforming ", name);
        //const typeValue = typeof value;
        //importProxyDebug(`typeof value: ${typeValue}`)
        if (typeof value === "function") {
            return importFunctionWrapper(namespace, name, value);
        } else if (typeof value === "object") {
            if (value instanceof WebAssembly.Memory) {
                return value;
            } else if (value instanceof WebAssembly.Table) {
                return value;
            }
            let namespace = name;
            let innerProxyHandler = {
                get: (obj: any, name: string) => proxyTransformer(namespace, name, obj[name]),
            };        
            return new Proxy(value, innerProxyHandler);
        }
        return value;
    };
    
    if (importObject) {
        const obj = importObject;
        const proxiedImportObject = new Proxy(obj, proxyHandler);
        return await WebAssembly.instantiate(module, proxiedImportObject);
    } else {
        return await WebAssembly.instantiate(module, importObject);
    }
}

export function getInstantiateCoreFunc() {
    //const instantiateCore = WebAssembly.instantiate;
    let instantiateCore :  (module: WebAssembly.Module, imports: Record<string, any>) => Promise<WebAssembly.Instance>;

    // @ts-ignore
    //const callDebug = globalThis.WASI_CALL_DEBUG;
    const callDebug = false;
    wasiPreview2Debug(`getInstantiateCoreFunc: ${callDebug}`);
    if (callDebug) {
        wasiPreview2Debug("getInstantiateCoreFunc: WASI_CALL_DEBUG==true");
        instantiateCore = instantiateCoreProxied;
    } else {
        wasiPreview2Debug("getInstantiateCoreFunc: WASI_CALL_DEBUG==false");
        instantiateCore = WebAssembly.instantiate;
    }
    return instantiateCore;
}

export class CommandRunner {
    importObject?: Record<string, any>;
    wasmModOrBufferSource?: WebAssembly.Module | BufferSource;
    commandComponent?: WasiCommand;

    constructor(importObject: Record<string, any>) {
        this.importObject = importObject;
    }

    async compileCoreLocal(url: string) {
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
        return await compileCore(url);
    }

    async instantiate(wasmModOrBufferSource: WebAssembly.Module | BufferSource): Promise<WasiCommand> {
        this.wasmModOrBufferSource = wasmModOrBufferSource;
        const importObject = this.importObject;
        const compileFunc = this.compileCoreLocal;
        const boundCompilerFunc = compileFunc.bind(this);

        const instantiateCore = getInstantiateCoreFunc();
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
                //this.commandComponent.run();
                const runner = this.commandComponent.run;
                runner.run();
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
