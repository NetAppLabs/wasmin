
import { WASI, OpenFiles, TTY } from "@wasm-env/wasi-js";
import { promises } from "node:fs";
import { default as path } from "node:path";


// File & Blob is now in node v19 (19.2)
// ignored for now because @types/node is not updated for node 19.2
// @ts-ignore
//import { File, Blob } from 'node:buffer';

import { memory, getOriginPrivateDirectory, RegisterProvider, NFileSystemDirectoryHandle } from "@wasm-env/fs-js";
import { node } from "@wasm-env/node-fs-js";

import { default as s3 } from "@wasm-env/s3-fs-js";
import { default as github } from "@wasm-env/github-fs-js";


const DEBUG_MODE = false;
const USE_MEMORY = false;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const cols = process.stdout.columns;
const rows = process.stdout.rows;
const rawMode = true;

const modeListener = function (rawMode: boolean): void {
  if (rawMode) {
    process.stdin.setRawMode(rawMode);
  } else {
    process.stdin.setRawMode(rawMode);
  }
}

const tty = new TTY(cols, rows, rawMode, modeListener);

const stdin = {
  async read(_num: number) {
    const isRawMode = tty.rawMode;
    let mychar = "";
    try {
      await new Promise<void>((resolve) => {
        process.stdin.once("data", function (chunk) {
          const s: string = chunk as unknown as string;
          if (DEBUG_MODE) {
            //console.debug("read from stdin: ", s);
            console.debug(`read from stdin: "${s}" `);
          }
          mychar = s;
          return resolve();
        });
      });
    } finally {
      if (DEBUG_MODE) {
        console.log("stdin::read finally");
      }
    }
    if (isRawMode) {
      return textEncoder.encode(mychar);
    } else {
      return textEncoder.encode(mychar);
    }
  },
};

const stdout = {
  write(data: Uint8Array) {
    process.stdout.write(data);
  },
};

let stderr = {
  write(data: Uint8Array) {
    process.stderr.write(data);
  },
};
if (DEBUG_MODE) {
  stderr = {
    write(data: Uint8Array) {
      console.error(textDecoder.decode(data, { stream: true }));
    },
  };
}


export function getSecretStore(): Record<string,Record<string,string|undefined>> {
  const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

  const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const secretStore = {
    aws: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    github: {
      token: GITHUB_TOKEN,
      username: GITHUB_USERNAME,
    },
  };
  return secretStore;
}

export async function getRootFS(): Promise<FileSystemDirectoryHandle>{
  // if environment variable NODE_ROOT_DIR is set it will use it as root path
  // else current directory
  let nodePath = process.env.NODE_ROOT_DIR;
  if (!nodePath || nodePath == "") {
    nodePath = process.cwd();
  }
  let rootfs: NFileSystemDirectoryHandle;
  if (USE_MEMORY) {
    rootfs = await getOriginPrivateDirectory(memory, nodePath);
  } else {
    rootfs = await getOriginPrivateDirectory(node, nodePath);
  }
  const secretStore = getSecretStore();
  rootfs.secretStore = secretStore;
  return rootfs;
}


async function getWasmModule(): Promise<{module: WebAssembly.Module, path: string}> {

  const moduleSearchPaths = [
    "/snapshot/server/assets/nu.async.wasm",
    "./nu.async.wasm"
  ]

  let wasmBinary = ""
  let wasmBuf: BufferSource | undefined;

  const binaryFromEnv = process.env.NODE_SHELL_BINARY;
  if (binaryFromEnv && binaryFromEnv != " ") {
    try {
      const binaryFromEnvBuf = await promises.readFile(binaryFromEnv);
      wasmBinary = binaryFromEnv;
      wasmBuf = binaryFromEnvBuf;
    } catch (err: any){}
  } else {
    for (const modulePathTry of moduleSearchPaths) {
      try {
        const wasmBinaryTry = modulePathTry;
        const wasmBufTry = await promises.readFile(wasmBinaryTry);
        wasmBuf = wasmBufTry;
        wasmBinary = wasmBinaryTry;
        break;
      } catch (err: any){}
    }
  }

  // TODO: figure out to make import.meta.url work:
  //const wasmRes = await fetch(new URL('./nu.async.wasm', import.meta.url)) 
  //const wasmBuf = await wasmRes.arrayBuffer();
  if (wasmBuf) {
    const mod = await WebAssembly.compile(wasmBuf);
    return {module: mod, path: wasmBinary};
  } else {
    throw new Error("Wasm Shell module not found");
  }
}

export async function startNodeShell(rootfs?: FileSystemDirectoryHandle, env?: Record<string,string>) {

  // @ts-ignore
  RegisterProvider("s3", s3);
  // @ts-ignore
  RegisterProvider("github", github);

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  const preOpens: Record<string, FileSystemDirectoryHandle> = {};
  const rootDir = "/";
  const init_pwd = "/";
  if (!rootfs) {
    rootfs = await getRootFS();
  }
  if (!env) {
    env = {
      RUST_BACKTRACE: "full",
      //RUST_LOG: "wasi=trace",
      PWD: init_pwd,
      TERM: "xterm-256color",
      COLORTERM: "truecolor",
      LC_CTYPE: "UTF-8",
      COMMAND_MODE: "unix2003",
      //FORCE_HYPERLINK: "true",
      FORCE_COLOR: "true",
      PROMPT_INDICATOR: " > ",
      //USER: "none",
      //HOME: "/",
    };
  }
  preOpens[rootDir] = rootfs;
  const abortController = new AbortController();
  const openFiles = new OpenFiles(preOpens);


  const modResponse = await getWasmModule();
  const mod = modResponse.module;
  const wasmBinary = modResponse.path;
  const args: string[] = [wasmBinary];

  const workerEnv = process.env.NODE_SHELL_WORKER;

  let useWorker = false;
  if (workerEnv) {
    useWorker = true;
  }
  if (useWorker) {
    const {WASIWorker} = await import("@wasm-env/wasi-js");
    try {
      const wasi = new WASIWorker({
        abortSignal: abortController.signal,
        openFiles: openFiles,
        stdin: stdin,
        stdout: stdout,
        stderr: stderr,
        args: args,
        env: env,
        tty: tty,
      });

      const statusCode = await wasi.run(wasmBinary);
      if (statusCode !== 0) {
        console.log(`Exit code: ${statusCode}`);
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      if (DEBUG_MODE) {
        console.log("finally");
      }
      process.exit(0);
    }
  } else {
    try {
      const wasi = new WASI({
        abortSignal: abortController.signal,
        openFiles: openFiles,
        stdin: stdin,
        stdout: stdout,
        stderr: stderr,
        args: args,
        env: env,
        tty: tty,
      });
      const statusCode = await wasi.run(mod);
      if (statusCode !== 0) {
        console.log(`Exit code: ${statusCode}`);
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      if (DEBUG_MODE) {
        console.log("finally");
      }
      process.exit(0);
    }
  }
}
