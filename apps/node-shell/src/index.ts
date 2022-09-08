
import { WASI, OpenFiles, TTY } from "@wasm-env/wasi-js";
import { promises } from "node:fs";


import { File, Blob } from "web-file-polyfill";
import { ReadableStream, WritableStream } from "web-streams-polyfill";

import { getOriginPrivateDirectory} from "@wasm-env/fs-js";
import { node} from "@wasm-env/fs-js-node";

// polyfill for node
globalThis.File = File;
globalThis.Blob = Blob;
globalThis.WritableStream = WritableStream;
globalThis.ReadableStream = ReadableStream;
Object.setPrototypeOf(globalThis.WritableStream, WritableStream.prototype);

const DEBUG_MODE = false;

(async () => {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  const modeListener = function(rawMode: boolean): void {
    if (rawMode ) {
      process.stdin.setRawMode(rawMode);
    } else {
      process.stdin.setRawMode(rawMode);
    }
  }

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

  const preOpens: Record<string, FileSystemDirectoryHandle> = {};

  // if environment variable NODE_ROOT_DIR is set it will use it as root path
  // else current directory
  let nodePath = process.env.NODE_ROOT_DIR;
  if ( !nodePath || nodePath == "" ){
    nodePath = process.cwd();
  }
  const rootfs = await getOriginPrivateDirectory(node, nodePath);

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
  // @ts-ignore
  rootfs.secretStore = secretStore;
  const rootDir = "/";
  const init_pwd = "/";
  preOpens[rootDir] = rootfs;
  const abortController = new AbortController();
  const openFiles = new OpenFiles(preOpens);

  const args: string[] = [];

  let shellBinary = "./nu.async.wasm";

  const binaryFromEnv = process.env.NODE_SHELL_BINARY;
  if ( binaryFromEnv && binaryFromEnv != " "){
    shellBinary = binaryFromEnv;
  }

  const mod = WebAssembly.compile(await promises.readFile(shellBinary));

  const cols = process.stdout.columns;
  const rows = process.stdout.rows;
  const rawMode = true;
  const tty = new TTY(cols, rows, rawMode, modeListener);

  try {
    const statusCode = await new WASI({
      abortSignal: abortController.signal,
      openFiles: openFiles,
      stdin: stdin,
      stdout: stdout,
      stderr: stderr,
      args: args,
      env: {
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
      },
      tty: tty,
    }).run(await mod);
    if (statusCode !== 0) {
      console.log(`Exit code: ${statusCode}`);
    }
  } catch (err: any) {
    console.log(err.message);
  } finally {
    console.log("finally");
    process.exit(0);
  }
})();
