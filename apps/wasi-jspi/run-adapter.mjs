
import { promisifyWebAssemblyExports, promisifyImportObject } from "./dist/index.js";
import { WasiImpl } from "./dist/index.js";
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



const imports_for_proxy = {};
//const bytes_adapter_proxy = await (await fetchOrReadFile('./greeting_adapter_proxy.wasm')).buffer
const bytes_adapter_proxy_arr = testConstructProxyModule();
const bytes_adapter_proxy = bytes_adapter_proxy_arr.buffer;

const instAProxy = await WebAssembly.instantiate(bytes_adapter_proxy, imports_for_proxy)
const instance_proxy = instAProxy.instance;
const table = instance_proxy.exports["$imports"];

const imports_from_adapter = {
  'wasi_snapshot_preview1': {
    fd_write: instance_proxy.exports["0"]
  },
};



const instPRes = await WebAssembly.instantiate(mainModule, imports_from_adapter)
const instance_main = instPRes;
const memory = instance_main.exports.memory;

//const bytes_adapter = await (await fetchOrReadFile('./greeting_adapter.wasm')).buffer
const bytes_adapter_arr = testConstructAdapterModule();
const bytes_adapter = bytes_adapter_arr.buffer;
//await writeFile("./greeting_adapter_gen.wasm", bytes_adapter_arr);
const modAdapter = await WebAssembly.compile(bytes_adapter);

const imports_for_adapter = promisifyImportObject(wasi, modAdapter);

imports_for_adapter[""] = {
  "_start": instance_main.exports._start,
  "$imports": table,
};
imports_for_adapter["env"] = {
  "memory": memory,
};

const instARes = await WebAssembly.instantiate(modAdapter, imports_for_adapter)
const instance_adapter = instARes;

const promisifiedInstance = Object.create(WebAssembly.Instance.prototype)
Object.defineProperty(promisifiedInstance, 'exports', { value: promisifyWebAssemblyExports(instance_adapter.exports, ['_start']) })
promisifiedInstance.exports.memory = memory;

const p = await wasi.start(promisifiedInstance)