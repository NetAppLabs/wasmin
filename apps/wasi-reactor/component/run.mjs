import { instantiate  } from "./wasi_reactor.js";
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

const reactorInstance = await instantiate(compileCore, wasi.componentImports);

console.log(await reactorInstance.hello("Mr. Reactor"));
console.log(await reactorInstance.hello("there"));
console.log(await reactorInstance.hello("to one"));
console.log(await reactorInstance.hello("to all"));
console.log("uuid:", await reactorInstance.uuid());

wasi.stopWorker();

console.log("done");