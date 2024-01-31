import { WASI, OpenFiles, TTY, isNode, isDeno } from "@wasmin/wasi-js";
import { promises } from "node:fs";

// File & Blob is now in node v19 (19.2)
// ignored for now because @types/node is not updated for node 19.2
// @ts-ignore
//import { File, Blob } from 'node:buffer';

import { FileSystemDirectoryHandle, getDirectoryHandleByURL, isBun } from "@wasmin/fs-js";
import { memory, getOriginPrivateDirectory, RegisterProvider, NFileSystemDirectoryHandle } from "@wasmin/fs-js";
import { node } from "@wasmin/node-fs-js";
import process from "node:process";

//import { s3 } from "@wasmin/s3-fs-js";
import { nfs } from "@wasmin/nfs-js";
import { github } from "@wasmin/github-fs-js";
import { parseArgs } from "node:util";

import chalk from 'chalk';

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
};

const SHELL_DEBUG = false;

function shellDebug(...args: any) {
    if (SHELL_DEBUG) {
        console.debug(...args);
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
                console.debug("stdin::read finally");
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

export function getSecretStore(): Record<string, Record<string, string | undefined>> {
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

export async function getRootFS(driver: any, mountUrl: string, overlay: boolean): Promise<FileSystemDirectoryHandle> {
    const secretStore = getSecretStore();
    let rootfs: FileSystemDirectoryHandle;
    if (mountUrl != "") {
        rootfs = await getDirectoryHandleByURL(mountUrl, secretStore, overlay);
    } else {
        // if environment variable NODE_ROOT_DIR is set it will use it as root path
        // else current directory
        let nodePath = process.env.NODE_ROOT_DIR;
        if (!nodePath || nodePath == "") {
            nodePath = process.cwd();
        }

        rootfs = await getOriginPrivateDirectory(driver, nodePath, overlay);
    }
    if (rootfs instanceof NFileSystemDirectoryHandle) {
        rootfs.secretStore = secretStore;
    }
    return rootfs;
}

async function getWasmModuleBufer(wasmBinary: string): Promise<{
    buffer: BufferSource;
    path: string;
}> {
    const defaultUrl = new URL("./nu.async.wasm", import.meta.url);
    const defaultUrlAlt = new URL("./nu.async.wasm", "file:///tmp/wasmin-tmp/");
    const defaultModuleSearchPaths = ["/snapshot/server/assets/nu.async.wasm", "./nu.async.wasm", defaultUrl, defaultUrlAlt];

    //let wasmBinary = "";
    let wasmBuf: BufferSource | undefined;

    let binaryFromEnv = wasmBinary;
    if (binaryFromEnv && binaryFromEnv != " ") {
        try {
            const binaryFromEnvBuf = await promises.readFile(binaryFromEnv);
            wasmBinary = binaryFromEnv;
            wasmBuf = binaryFromEnvBuf;
        } catch (err: any) {}
    } else {
        for (const modulePathTry of defaultModuleSearchPaths) {
            try {
                const wasmBinaryTry = modulePathTry;
                const wasmBufTry = await promises.readFile(wasmBinaryTry);
                wasmBuf = wasmBufTry;
                wasmBinary = wasmBinaryTry.toString();
                break;
            } catch (err: any) {}
        }
    }

    if (wasmBuf) {
        return { buffer: wasmBuf, path: wasmBinary };
    } else {
        throw new Error("Wasm module not found");
    }
}

export async function startNodeShell(rootfsDriver?: any, env?: Record<string, string>) {

    try {

        // Interfaces declared here because they are not exported from node:util
        interface ParseArgsOptionConfig {
            /**
             * Type of argument.
             */
            type: 'string' | 'boolean';
            /**
             * Whether this option can be provided multiple times.
             * If `true`, all values will be collected in an array.
             * If `false`, values for the option are last-wins.
             * @default false.
             */
            multiple?: boolean | undefined;
            /**
             * A single character alias for the option.
             */
            short?: string | undefined;
            /**
             * The default option value when it is not set by args.
             * It must be of the same type as the the `type` property.
             * When `multiple` is `true`, it must be an array.
             * @since v18.11.0
             */
            default?: string | boolean | string[] | boolean[] | undefined;
        }
        interface ParseArgsOptionsConfig {
            [longOption: string]: ParseArgsOptionConfig;
        }
    
        const options: ParseArgsOptionsConfig = {
            help: {
              type: 'boolean',
              short: 'h'
            },
            debug: {
                type: 'boolean',
                short: 'd',
            },
            component: {
                type: 'boolean',
                short: 'c',
            },
            mount: {
                type: 'string',
                short: 'm',
            },
            env: {
                type: 'string',
                short: 'e',
            },
            worker: {
                type: 'boolean',
                short: 'w',
            },
            overlay: {
                type: 'boolean',
                short: 'o',
            },
            count: {
                type: 'string'
            }
        };

        let isHelp = false;
        let componentMode = false;
        let runDebug = false;
        let workerMode = false;
        let useOverlayFs = false;
        let mountUrl = "";
        let wasmBinaryFromArgs = "";
        //let args: string[] = [];
        let runCount = 1;
        let argv = process.argv;
        shellDebug("shell argv:",  argv);
        let args = process.argv.slice(2);
        shellDebug("shell args:",  args);

        let wasmArgs: string[] = [];

        const {
            values,
            positionals,
        } = parseArgs({ args: args, options: options, allowPositionals: true });

        shellDebug("shell args values: ", values);
        shellDebug("shell args positionals: ", positionals);
        
        if (values.help) {
            isHelp = true;
        }
        if (values.component) {
            componentMode = true;
        }
        if (values.debug) {
            runDebug = true;
        }
        if (values.mount) {
            mountUrl = values.mount as string;
            shellDebug("mountUrl: ", mountUrl);
        }
        if (values.worker) {
            workerMode = true;
        }
        if (values.overlay) {
            useOverlayFs = true;
        }
        if (values.count) {
            const sRunCount = values.count as string;
            const nRunCount = new Number(sRunCount);
            runCount = nRunCount.valueOf();
        }

        let runtimeName = "undefined";
        if (isBun() ){
            runtimeName = chalk.yellow.bold("Bun");
        } else if (isDeno() ){
            runtimeName = chalk.yellow.bold("Deno");    
        } else if (isNode()) {
            runtimeName = chalk.green.bold("Node");
        }

        let h1 = chalk.redBright.bold;
        let h2 = chalk.green.underline;
        let fl = chalk.cyan;
        let flv = chalk.cyan;

        if (isHelp) {

            console.log(`
  ${h1('wasmin')} WebAssembly WASI Runtime on ${runtimeName}

  ${h2('Usage')}:
   > wasmin [flags] [wasm] [arguments]

  ${h2('Flags')}:
    ${fl('-c')}                          Run in component mode
    ${fl('-e')}                          Evironment variables
    ${fl('-d')}                          Debug Mode
    ${fl('-o')}                          Enable Overlay FileSystem
    ${fl('-m, --mount')}   ${flv('[path|url]')}    Mount Path or URL and use as root
    ${fl('-w')}                          Run in worker
    ${fl('--count')}                     Number of identical runs`);
            process.exit(0);
        }

        if (positionals.length>0) {
            wasmBinaryFromArgs = positionals[0];
            wasmArgs = positionals.slice(1);
        }
        shellDebug("wasmBinaryFromArgs: ", wasmBinaryFromArgs);


        // @ts-ignore
        //if (!isBun()) {
        //    RegisterProvider("s3", s3);
        //}
        // @ts-ignore
        RegisterProvider("github", github);
        // @ts-ignore
        RegisterProvider("nfs", nfs);

        process.stdin.resume();
        process.stdin.setEncoding("utf8");

        const preOpens: Record<string, FileSystemDirectoryHandle> = {};
        const rootDir = "/";
        const init_pwd = "/";
        const driver = USE_MEMORY ? memory : rootfsDriver || node;
        const rootfs = await getRootFS(driver, USE_MEMORY ? "" : mountUrl, useOverlayFs);
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


        let runs = 0;
        while (runs < runCount) {
            let startTime = performance.now();

            const modResponse = await getWasmModuleBufer(wasmBinaryFromArgs);
            const wasmBuf = modResponse.buffer;
            const wasmBinary = modResponse.path;    

            let newEnv = {...env};
            let newArgs = [...wasmArgs];
            shellDebug("newArgs: ", newArgs);
            //shellDebug(`run is: ${runs}`);
            if (runDebug) {
                // @ts-ignore
                globalThis.WASI_CALL_DEBUG=true;
            }
            if (workerMode) {
                const { WASIWorker } = await import("@wasmin/wasi-js");
                try {
                    const openFilesMap = {};
                    const wasi = new WASIWorker({
                        abortSignal: abortController.signal,
                        openFiles: openFilesMap,
                        stdin: stdin,
                        stdout: stdout,
                        stderr: stderr,
                        args: newArgs,
                        env: newEnv,
                        tty: tty,
                    });
                    const statusCode = await wasi.run(wasmBinary);
                    if (statusCode !== 0) {
                        shellDebug(`Exit code: ${statusCode}`);
                    }
                } catch (err: any) {
                    shellDebug(err.message);
                } finally {
                    if (DEBUG_MODE) {
                        shellDebug("finally");
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
                        args: newArgs,
                        env: newEnv,
                        tty: tty,
                    });
                    wasi.component = componentMode;
                    const statusCode = await wasi.run(wasmBuf);
                    if (statusCode !== 0) {
                        shellDebug(`Exit code: ${statusCode}`);
                    }
                } catch (err: any) {
                    shellDebug(err.message);
                } finally {
                    if (DEBUG_MODE) {
                        shellDebug("finally");
                    }
                    //process.exit(0);
                }
            }
            runs++;
            let endTime = performance.now();
            let timeElapsedMs = endTime - startTime;
            if (runCount>1) {
                console.log(`run took ${timeElapsedMs} ms`);
            }
        }
        process.exit(0);
    } catch (err: any) {
        if (err.code === 'ARG_UNKNOWN_OPTION') {
            console.log(err.message);
        } else {
            throw err;
        }    
    }
}
