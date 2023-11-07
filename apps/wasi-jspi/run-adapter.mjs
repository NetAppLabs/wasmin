
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

const imports_for_proxy = {};
const bytes_adapter_proxy = await (await fetchOrReadFile('./greeting_adapter_proxy.wasm')).buffer
const instAProxy = await WebAssembly.instantiate(bytes_adapter_proxy, imports_for_proxy)
const instance_proxy = instAProxy.instance;
const table = instance_proxy.exports["$imports"];


const imports_from_adapter = {
    'wasi_snapshot_preview1': {
        fd_write: instance_proxy.exports["0"]
    },
};

const bytes_plain = await (await fetchOrReadFile('./greeting.wasm')).buffer
//const modPlain = await WebAssembly.compile(bytes_plain);
/*
for (let imp of WebAssembly.Module.imports(modPlain)) {
  let value;
  switch (imp.kind) {
    case "table":
      value = new WebAssembly.Table(imp.type);
      console.log("table value: ", value);
      break;
    case "memory":
      value = new WebAssembly.Memory(imp.type);
      console.log("memory value: ", value);
      break;
    case "global":
      value = new WebAssembly.Global(imp.type, undefined);
      console.log("global value: ", value);
      break;
    case "function":
      console.log("funcion imp value: ", imp);
      let wfmodule = imp.module;
      let wfname = imp.name;
      let wffunc = imp.type;
      console.log("function module name: ", wfmodule);
      console.log("function name: ", wfname);
      console.log("function : ", wffunc);
      value = wffunc;
      break;
  }
}*/

const modPlain = await WebAssembly.compile(bytes_plain);

const instPRes = await WebAssembly.instantiate(modPlain, imports_from_adapter)
const instance_plain = instPRes;
const memory = instance_plain.exports.memory;

const bytes_adapter = await (await fetchOrReadFile('./greeting_adapter.wasm')).buffer
const modAdapter = await WebAssembly.compile(bytes_adapter);

const imports_for_adapter = promisifyImportObject(wasi, modAdapter);

imports_for_adapter[""] = {
    "_start": instance_plain.exports._start,
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