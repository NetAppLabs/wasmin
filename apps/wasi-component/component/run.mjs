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
const componentImports = wasi.getComponentImports();

// let randomInstance = {
//     getRandomBytes: (len) => {
//         let ret = new Uint8Array(Number(len));
//         let crypto = globalThis.crypto;
//         if (crypto) {
//             crypto.getRandomValues(ret);
//         } else {
//             let offset = 'A'.charCodeAt(0);
//             for (let i = 0; i < len; i++) {
//                 ret[i] = i + offset;
//             }
//         }
//         console.log("getRandomBytes - len:", len, "ret:", ret);
//         return ret;
//     }
// }

// const componentImports = {
//     'cli-base': {
//       cliBaseEnvironment: typeof CliBaseEnvironmentImports,
//       cliBasePreopens: typeof CliBasePreopensImports,
//       cliBaseExit: typeof CliBaseExitImports,
//       cliBaseStdin: typeof CliBaseStdinImports,
//       cliBaseStdout: typeof CliBaseStdoutImports,
//       cliBaseStderr: typeof CliBaseStderrImports,
//     },
//     filesystem: {
//       filesystemFilesystem: typeof FilesystemFilesystemImports,
//     },
//     io: {
//       ioStreams: typeof IoStreamsImports,
//     },
//     random: {
//       randomRandom: randomInstance,
//     },
// };

const rootInstance = await instantiate(compileCore, componentImports);

rootInstance.run();

wasi.stopWorker();

console.log("done");
