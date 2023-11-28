import { instantiate as componentInstantiate } from './component.js';
export async function instantiate(compileCore, imports, instantiateCore) {
    // @ts-ignore
    return await componentInstantiate(compileCore, imports, instantiateCore);
}
const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
export async function fetchCompile(url) {
    if (isNode) {
        let _fs = await import("fs/promises");
        return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
}
export async function compileCore(url) {
    // special case for main core module of component
    /*if (url == "component.core.wasm") {
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
    }*/
    if (url == "component.core.wasm") {
        throw new Error("unsupported component.core.wasm");
    }
    else if (url == "component.core2.wasm") {
        const metaUrl = new URL("./component.core2.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    }
    else if (url == "component.core3.wasm") {
        const metaUrl = new URL("./component.core3.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    }
    else if (url == "component.core4.wasm") {
        const metaUrl = new URL("./component.core4.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    }
    else if (url == "component.core5.wasm") {
        const metaUrl = new URL("./component.core5.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    }
    else {
        throw new Error(`unsupported wasm URL: ${url}`);
    }
    /*url = "./" + url;
    const metaUrl = new URL(url, import.meta.url);
    return await fetchCompile(metaUrl);
    */
}
//# sourceMappingURL=index.js.map