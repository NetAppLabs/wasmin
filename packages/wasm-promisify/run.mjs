
import {promisifyWebAssemblyExports, promisifyImportObject} from "./dist/index.js";
import { WasiImpl } from "./dist/index.js";

const isNode = typeof process !== "undefined" && process.versions && process.versions.node;

async function fetchOrReadFile(url) {
    if (isNode) {
        const metaUrl = new URL(url, import.meta.url);
        let _fs = await import("fs/promises");
        return await _fs.readFile(metaUrl);
    }
    return await fetch(url);
}

const wasi = new WasiImpl();

const bytes = await (await fetchOrReadFile('./greeting_jspi.wasm')).buffer
const mod= await WebAssembly.compile(bytes)
const imports = promisifyImportObject(wasi, mod);
const instance = await WebAssembly.instantiate(mod, imports)

const promisifiedInstance = Object.create(WebAssembly.Instance.prototype)
Object.defineProperty(promisifiedInstance, 'exports', { value: promisifyWebAssemblyExports(instance.exports, ['_start']) })

const p = wasi.start(promisifiedInstance)