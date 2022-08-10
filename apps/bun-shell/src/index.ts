const bun_console = require("@wasm-env/bun-console");
const termSetRawMode = bun_console.termSetRawMode;

//import { exec } from 'bun-utilities/spawn'

//import { WASI, OpenFiles, TTY } from "../../../packages/wasi-js";
import { WASI, OpenFiles, TTY } from "@wasm-env/wasi-js";
import { memory, getOriginPrivateDirectory } from "@wasm-env/fs-js";
//import { termSetRawMode, termGetRawMode } from "@wasm-env/bun-console";

import { promises } from "node:fs";
import { default as fs } from "node:fs";



import "./std-polyfill.js";
//import {Bun} from 'bun';



//import { exec } from 'bun-utilities/spawn'
//import { exec } from "bun-utilities";



//import * as process from "node:process";
//import {stdin,stdout,stderr} from "bun";

//import { File, Blob } from "web-file-polyfill";
//import { ReadableStream, WritableStream } from "web-streams-polyfill";

// polyfill for node
//globalThis.File = File;
//globalThis.Blob = Blob;
//globalThis.WritableStream = WritableStream;
//globalThis.ReadableStream = ReadableStream;
//Object.setPrototypeOf(globalThis.WritableStream, WritableStream.prototype);

const DEBUG_MODE = false;

const runFunc = async () => {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  const Bun = globalThis["Bun"];
  //process.stdin.resume();
  //process.stdin.setEncoding("utf8");

  //const nodeTTy = require('node:tty');
  console.log(Bun.stdin.stream(), Bun.stdout.stream(), Bun.stderr.stream());

  /*fs.write(1, "output", 0, "utf8", (err, written) => {
    console.log(err, written);
  });*/
  //fs.writeFileSync("/dev/stdout", "output", "utf-8"); // => output
  //fs.writeFileSync(1, "testoutput", "utf-8"); // => output

  //await Bun.write(Bun.stdout, "output");


  const modeListener = function(rawMode: boolean): void {
    console.log('modeListener');
    if (rawMode ) {
      //stdin.stream().setRawMode(rawMode);
      console.log(`modeListener::rawMode ${rawMode}`);
      //Bun.stdin.setRawMode(rawMode);
      //.stdin.setRawMode(rawMode);
      //exec(["stty", "raw"]);
      //exec(["stty", "raw"]);
      termSetRawMode(1);
    } else {
      console.log(`modeListener::rawMode ${rawMode}`);
      //Bun.stdin.setRawMode(rawMode);
      //stdin.stream().setRawMode(rawMode);
      //process.stdin.setRawMode(rawMode);
      //exec(["stty", "-raw"]);
      termSetRawMode(0);
    }
  }

  const stdin = {
    async read(_num: number) {
      const isRawMode = tty.rawMode;
      let mychar = "";
      //console.log("stdin::read:");
      try {
        await new Promise<void>((resolve) => {
          //let data = fs.readFileSync(0, 'utf-8');
          
          /*      
          let data = ""
          while ( data === "" ) {
            //console.log("stdin::read: ", data);
            const fd = 0;
            //data = fs.readFileSync(0, 'utf-8');
            const BUFSIZE = 256;
            const buf = new ArrayBuffer(BUFSIZE);
            let totalBuf = new ArrayBuffer(BUFSIZE);
            let totalBytesRead = 0;
            let bytesRead = 0;
            const endByteRead = false;
            const dbuf = new DataView(buf);

            bytesRead = fs.readSync(fd, dbuf, 0, BUFSIZE, null);
            // Copy the new bytes to totalBuf.
            const tmpBuf = new ArrayBuffer(totalBytesRead + bytesRead);
            //totalBuf.copy(tmpBuf, 0, 0, totalBytesRead);
            //buf.copy(tmpBuf, totalBytesRead, 0, bytesRead);
            totalBuf = tmpBuf;
            totalBytesRead += bytesRead;

            data = dbuf.toString();
      
          }
          console.log("stdin::read: ", data);
          mychar = data;
          return resolve();
          */
          process.stdin.once("data", function (chunk) {
            const s: string = chunk as unknown as string;
            if (DEBUG_MODE) {
              //console.debug("read from stdin: ", s);
              console.debug(`read from stdin: "${s}" `);
            }
            console.debug(`read from stdin: "${s}" `, s);

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
      console.log("stdout:write:", data);
      //stdout.stream().write(data);
      //Bun.stdout.stream().write(data);
      fs.writeFileSync(1, data, "utf-8");
    },
  };

  let stderr = {
    write(data: Uint8Array) {
      console.log("stderr:write:", data);
      //stderr.stream().write(data);
      //Bun.stderr.stream().write(data);
      fs.writeFileSync(2, data, "utf-8");
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

  // require is here needed to get node export
  //const wasm_env_fs = require("@wasm-env/fs-js");
  //const getOriginPrivateDirectory = wasm_env_fs.getOriginPrivateDirectory;
  //const node = wasm_env_fs.node;
  //const memory = wasm_env_fs.memory;


  // if environment variable NODE_ROOT_DIR is set it will use it as root path
  // else current directory
  let nodePath = process.env.NODE_ROOT_DIR;
  if ( !nodePath || nodePath == "" ){
    nodePath = process.cwd();
  }
  //const rootfs = await getOriginPrivateDirectory(node, nodePath);
  const rootfs = await getOriginPrivateDirectory(memory);

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

  //const mod = WebAssembly.compile(await promises.readFile(shellBinary));
  //const mod = await WebAssembly.compile(buf);

  const buf = fs.readFileSync(shellBinary);
  //const mod = new WebAssembly.Module(buf);
  const mod = await WebAssembly.compile(buf);

  //const cols = stdout.columns;
  //const rows = stdout.rows;
  const cols = 80;
  const rows = 24;
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
        //RUST_BACKTRACE: "1",
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
    }).run(mod);
    if (statusCode !== 0) {
      console.log(`Exit code: ${statusCode}`);
    }
  } catch (err: any) {
    console.log(err.message);
  } finally {
    console.log("finally");
    process.exit(0);
  }
};

// @ts-ignore
await runFunc();
