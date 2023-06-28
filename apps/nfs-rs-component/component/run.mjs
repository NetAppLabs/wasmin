import { instantiate  } from "./nfs_rs.js";
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

const wasiExperimentalSocketsNamespace = { package: "nfs-rs-component", world: "nfsRsComponentWasiExperimentalSockets" };
const wasi = new WASIWorker({});
await wasi.createWorker(wasiExperimentalSocketsNamespace)
  .then((componentImports) => instantiate(compileCore, componentImports))
  .then((instance) => {
    const nfs = instance.nfs;
    nfs.parseUrlAndMount("nfs://localhost/Users/Shared/nfs/?nfsport=20490&mountport=20490");
    console.log("root fh:", nfs.lookup("/"));
    const entries = nfs.readdirplusPath("/");
    for (const entry of entries) {
        console.log(entry);
    }
    nfs.umount();
  })
  .finally(() => {
    wasi.stopWorker();
    console.log("done");
  });
