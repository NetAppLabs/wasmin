import { instantiate } from "./nfs_rs.js";
import { WASIWorker } from "@netapplabs/wasi-js";

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
let _fs;
async function fetchCompile(url) {
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
await wasi.createWorker()
  .then((componentImports) => instantiate(compileCore, componentImports))
  .then((instance) => {
    const nfs = instance.nfs;
    //const nfsUrl = "nfs://localhost/Users/Shared/nfs/?nfsport=20490&mountport=20490";
    const rootPath = "/"
    const nfsUrl = "nfs://localhost/tmp/go-nfs-server?uid=502&gid=20&nfsport=20490&mountport=20490&auto-traverse-mounts=0";

    const mount = nfs.parseUrlAndMount(nfsUrl);

    console.log("mount identifier:", mount);
    const rootFh = nfs.lookup(mount, rootPath);
    console.log("root fh:", rootFh);
    //const entries = nfs.readdirplusPath(mount, rootPath);
    const entries = nfs.readdirplus(mount, rootFh);
    for (const entry of entries) {
      console.log(`/${entry.fileName} =`, entry);
    }
    nfs.umount(mount);
    try {
      nfs.lookup(mount, rootPath);
    } catch (e) {
      console.log("expected error: performing lookup using previously unmounted mount:", e.payload);
    }
    try {
      nfs.umount(mount);
    } catch (e) {
      console.log("expected error: unmounting previously unmounted mount:", e.payload);
    }
  })
  .finally(() => {
    wasi.stopWorker();
    console.log("done");
  });
