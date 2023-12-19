
import { promisifyWebAssemblyExports, promisifyImportObject } from "./dist/index.js";
import { WasiImpl, getPromisifiedInstance } from "./dist/index.js";
import { testConstructProxyModule, testConstructAdapterModule } from "./dist/wasmgen.js";

const isNode = typeof process !== "undefined" && process.versions && process.versions.node;

async function fetchOrReadFile(url) {
  if (isNode) {
    const metaUrl = new URL(url, import.meta.url);
    let _fs = await import("fs/promises");
    return await _fs.readFile(metaUrl);
  }
  return await fetch(url);
}

async function writeFile(path, buf) {
  if (isNode) {
    let _fs = await import("fs/promises");
    return await _fs.writeFile(path, buf);
  }
}

const wasi = new WasiImpl();

const bytesMainModule = await (await fetchOrReadFile('./greeting.wasm')).buffer
const mainModule = await WebAssembly.compile(bytesMainModule);

const promInstance = await getPromisifiedInstance(mainModule, wasi);

const p = await wasi.start(promInstance)