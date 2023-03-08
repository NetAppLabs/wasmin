// require needed for now:
const bun_console = require("@wasm-env/bun-console");
const termSetRawMode = bun_console.termSetRawMode;
const termGetColumns = bun_console.termGetColumns;
const termGetRows = bun_console.termGetRows;

// TODO figure out ESM import
//import { termSetRawMode, termGetColumns, termGetRows } from "@wasm-env/bun-console";

import { WASI, OpenFiles, TTY } from "@wasm-env/wasi-js";
import { getOriginPrivateDirectory, RegisterProvider } from "@wasm-env/fs-js";

import { readFileSync } from "fs";

//polyfill needed for process.stdin/stdout/stderr
import "./std-polyfill.js";

import { bun as bunFs } from "@wasm-env/bun-fs-js";

// s3 not currently working because of missing node:http2
//import { s3 } from "@wasm-env/s3-fs-js";
import { github } from "@wasm-env/github-fs-js";

const DEBUG_MODE = false;

const startShell = async () => {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();

    const Bun = globalThis["Bun"];
    if (DEBUG_MODE) {
        console.log(Bun.stdin.stream(), Bun.stdout.stream(), Bun.stderr.stream());
    }

    const modeListener = function (rawMode: boolean): void {
        if (DEBUG_MODE) {
            console.log("modeListener");
        }
        if (rawMode) {
            if (DEBUG_MODE) {
                console.log(`modeListener::rawMode ${rawMode}`);
            }
            termSetRawMode(1);
        } else {
            if (DEBUG_MODE) {
                console.log(`modeListener::rawMode ${rawMode}`);
            }
            termSetRawMode(0);
        }
    };

    const stdin = {
        async read(_num: number) {
            const isRawMode = tty.rawMode;
            let mychar = "";
            try {
                await new Promise<void>((resolve) => {
                    // polyfilled process.stdin
                    process.stdin.once("data", function (chunk) {
                        let s = "";
                        if (chunk) {
                            if (chunk.value) {
                                const val = chunk.value;
                                s = textDecoder.decode(val);
                            }
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
        async write(data: Uint8Array) {
            if (DEBUG_MODE) {
                console.log("stdout:write:", data);
            }
            await Bun.write(Bun.stdout, data);
        },
    };

    let stderr = {
        async write(data: Uint8Array) {
            if (DEBUG_MODE) {
                console.log("stderr:write:", data);
            }
            await Bun.write(Bun.stderr, data);
        },
    };

    if (DEBUG_MODE) {
        stderr = {
            write(data: Uint8Array): Promise<void> {
                console.error(textDecoder.decode(data));
                return;
            },
        };
    }

    //RegisterProvider("s3", s3);
    RegisterProvider("github", github);

    const preOpens: Record<string, FileSystemDirectoryHandle> = {};

    let nodePath = process.env.NODE_ROOT_DIR;
    if (!nodePath || nodePath == "") {
        nodePath = process.cwd();
    }
    //const rootfs = await getOriginPrivateDirectory(node, nodePath);
    //const rootfs = await getOriginPrivateDirectory(memory);
    const rootfs = await getOriginPrivateDirectory(bunFs, nodePath);

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

    rootfs.secretStore = secretStore;
    const rootDir = "/";
    const init_pwd = "/";
    preOpens[rootDir] = rootfs;
    const abortController = new AbortController();
    const openFiles = new OpenFiles(preOpens);

    const args: string[] = [];

    let wasmBinary = "./nu.async.wasm";

    const binaryFromEnv = process.env.NODE_SHELL_BINARY;
    if (binaryFromEnv && binaryFromEnv != " ") {
        wasmBinary = binaryFromEnv;
    }

    const wasmBuf = readFileSync(wasmBinary);
    const mod = await WebAssembly.compile(wasmBuf);

    const cols = termGetColumns();
    const rows = termGetRows();
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
await startShell();
