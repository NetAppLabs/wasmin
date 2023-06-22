import { instantiate  } from "./component.js";
import { WASIWorker } from "@wasm-env/wasi-js";

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
let _fs;
async function fetchCompile (url) {
  if (isNode) {
    _fs = _fs || await import('fs/promises');
    return WebAssembly.compile(await _fs.readFile(url));
  }
  return fetch(url).then(WebAssembly.compileStreaming);
}

async function compileCore(url) {
    url = "./" + url;
    return await fetchCompile(new URL(url, import.meta.url));
}

const wasi = new WASIWorker({});
await wasi.createWorker();

const rootInstance = await instantiate(compileCore, wasi.componentImports);

rootInstance.run();

wasi.stopWorker();

console.log("done");
