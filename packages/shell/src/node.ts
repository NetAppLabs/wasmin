/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { WASI, OpenFiles, TTY, isNode, isDeno, OpenFilesMap, WASIWorker, TTYInstance, TTYSize, Writable, Readable, sleep, isArray, WasiCapabilities } from "@netapplabs/wasi-js";
import { promises } from "node:fs";
import { Socket } from "node:net";

// File & Blob is now in node v19+ (19.2)
// ignored for now because @types/node is not updated for node 19.2
// @ts-ignore
//import { File, Blob } from 'node:buffer';

import { FileSystemDirectoryHandle, getDirectoryHandleByURL, isBun } from "@netapplabs/fs-js";
import { memory, getOriginPrivateDirectory, RegisterProvider, NFileSystemDirectoryHandle } from "@netapplabs/fs-js";
import { node } from "@netapplabs/node-fs-js";
import process from "node:process";

import { s3 } from "@netapplabs/s3-fs-js";
import { nfs } from "@netapplabs/nfs-js";
// @ts-ignore
//import { SmbDirectoryHandle } from "@netapplabs/smb-js";

import { github } from "@netapplabs/github-fs-js";
import { parseArgs } from "node:util";

import chalk from 'chalk';
import { BufferedPipe } from "@netapplabs/wasi-js";
import { initializeLogging } from "@netapplabs/wasi-js";

let DEBUG_MODE = true;
const USE_MEMORY = false;
const TERM_REQUEST_CURSOR_POS = "\x1b[6n";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const cols = process.stdout.columns;
const rows = process.stdout.rows;

/*
export function smb(path: string): FileSystemDirectoryHandle {
    const handle = new SmbDirectoryHandle(path);
    // @ts-ignore
    return handle;
}
*/

const rawModeListener = async function (rawMode: boolean): Promise<void> {
    shellDebug("node rawModeListener, setRawMode ", rawMode);
    if (rawMode) {
        process.stdin.setRawMode(rawMode);
        while (process.stdin.isRaw != rawMode) {
            shellDebug("node rawModeListener, process.stdin.isRaw ", process.stdin.isRaw);
            await sleep(1);
        }
    } else {
        process.stdin.setRawMode(rawMode);
        while (process.stdin.isRaw != rawMode) {
            shellDebug("node rawModeListener, process.stdin.isRaw ", process.stdin.isRaw);
            await sleep(1);
        }
    }
};

declare global {
    var SHELL_DEBUG: boolean;
}
globalThis.SHELL_DEBUG = false;

function shellDebug(...args: any) {
    if (globalThis.SHELL_DEBUG) {
        console.debug(...args);
    }
}

const tty = new TTYInstance(cols, rows, process.stdin.isRaw, rawModeListener);

async function termResize() {
    var columns = process.stdout.columns;
    var rows = process.stdout.rows;
    const size: TTYSize = {
        columns: columns,
        rows: rows,
    }
    shellDebug(`termResize columns: ${columns} , rows: ${rows}`)
    await tty.setSize(size);
}
process.stdout.on("resize", termResize);


export function appendToUint8Array(arr: Uint8Array, data: Uint8Array): Uint8Array {
    const newArray = new Uint8Array(arr.length + data.length);
    newArray.set(arr); // copy old data
    newArray.set(data, arr.length); // copy new data after end of old data
    return newArray;
}


const stdin = new BufferedPipe();
const onDataFunc = stdin.ondata.bind(stdin);
let onDataFuncProxy = (sbdata: Uint8Array|string) => {
    let sdata: string;
    if (isString(sbdata)) {
        sdata = sbdata as string;
    } else if (sbdata instanceof Buffer) {
        let bdata = sbdata as Buffer;
        const arrayBuffer = new ArrayBuffer(bdata.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < bdata.length; ++i) {
            view[i] = bdata[i];
        }
        sbdata = view;
        let adata = sbdata as Uint8Array;
        sdata = textDecoder.decode(adata);
    } else {
        let adata = sbdata as Uint8Array;
        sdata = textDecoder.decode(adata);
    }
    shellDebug("stdin onDataFuncProxy: ", sbdata);
    if (sdata.includes('\x1b[')) {
        shellDebug("stdin including control");
        if (sdata.endsWith("R")) {
            shellDebug("stdin returning cursor position");
        }
    }
    return onDataFunc(sbdata);
}
if (globalThis.SHELL_DEBUG) {
    process.stdin.on("data", onDataFuncProxy);
} else {
    process.stdin.on("data", onDataFunc);
}


function isString(input: any) {  
    return typeof input === 'string' && Object.prototype.toString.call(input) === '[object String]'
}


/**
 * asyncWrite to make sure writes are finihsed on underlying
 * streams (stdin/stdout)
 **/
async function asyncWrite(stream: Socket, buf: Uint8Array | string) {
    var done = stream.write(buf);
    if (!done) {
        await new Promise(function (resolve) {
            let writeResolver: any = undefined;
            stream.on('drain', function () {
                if (writeResolver) writeResolver();
            });
            writeResolver = resolve;
        });
    }
}


let stdout = {
    async write(data: Uint8Array) {
        let str = textDecoder.decode(data);
        if (str.includes(TERM_REQUEST_CURSOR_POS)){
            shellDebug("stdout requesting cursor pos");
        }
        await asyncWrite(process.stdout, data);
    },
};
let stderr = {
    async write(data: Uint8Array) {
        await asyncWrite(process.stderr, data);
    },
};


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

export async function getRootFS(driver: any, mountUrl: string, unionOverlay: boolean): Promise<FileSystemDirectoryHandle> {
    const secretStore = getSecretStore();
    let rootfs: FileSystemDirectoryHandle;
    if (mountUrl != "" && !mountUrl.startsWith("/") && !mountUrl.startsWith(".") ) {
        rootfs = await getDirectoryHandleByURL(mountUrl, secretStore, unionOverlay);
    } else {
        if (!mountUrl || mountUrl == "") {
            // if environment variable WASMIN_ROOT_DIR is set it will use it as root path
            // else current directory
            let rootNodePath = process.env.WASMIN_ROOT_DIR;
            if (!rootNodePath || rootNodePath == "") {
                mountUrl = process.cwd();
            }
        }
        rootfs = await getOriginPrivateDirectory(driver, mountUrl, unionOverlay);
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
    let defaultUrl: URL|undefined = undefined;
    let defaultUrl2: URL|undefined = undefined;
    try {
        defaultUrl = new URL("./nu.async.wasm", import.meta.url);
        // try alternative search:
        let defaultUrlHref = defaultUrl.href;
        let pathParts = defaultUrlHref.split(".wasm");
        let newHref = `${pathParts[0]}-0000000000000000.wasm${pathParts[1]}`
        defaultUrl2 = new URL(newHref);
    } catch (e: any) {
        shellDebug("Fail loading default url");
    }


    const defaultUrlLocalTmp = new URL("./nu.async.wasm", "file:///tmp/wasmin-tmp/");
    let defaultModuleSearchPaths = [];
    if (defaultUrl !== undefined && defaultUrl2 !== undefined) {
        defaultModuleSearchPaths = ["/snapshot/server/assets/nu.async.wasm", "./nu.async.wasm", defaultUrl, defaultUrl2, defaultUrlLocalTmp];
    } else {
        defaultModuleSearchPaths = ["/snapshot/server/assets/nu.async.wasm", "./nu.async.wasm", defaultUrlLocalTmp];
    }

    //let wasmBinary = "";
    let wasmBuf: BufferSource | undefined;

    let binaryFromEnv = wasmBinary;
    shellDebug(`binaryFromEnv: '${binaryFromEnv}'`)
    if (binaryFromEnv && binaryFromEnv != "" && binaryFromEnv != " ") {
        try {
            const binaryFromEnvBuf = await promises.readFile(binaryFromEnv);
            wasmBinary = binaryFromEnv;
            wasmBuf = binaryFromEnvBuf;
        } catch (err: any) {}
    } else {
        for (const modulePathTry of defaultModuleSearchPaths) {
            try {
                shellDebug("trying reading from path/url ", modulePathTry);
                const wasmBinaryTry = modulePathTry;
                if (isBun()) {
                    // @ts-ignore
                    const compileBunFile = Bun.file(wasmBinaryTry);
                    wasmBuf = await compileBunFile.arrayBuffer();    
                } else {
                    const wasmBufTry = await promises.readFile(wasmBinaryTry);
                    wasmBuf = wasmBufTry;
                }
                wasmBinary = wasmBinaryTry.toString();
                shellDebug("successful reading from path/url ", wasmBinary);
                break;
            } catch (err: any) {
                shellDebug('trying reading err: ', err);
            }
        }
    }

    if (wasmBuf) {
        return { buffer: wasmBuf, path: wasmBinary };
    } else {
        let yellow = chalk.yellow;
        throw new Error(`Wasm module ${yellow(wasmBinary)} not found`);
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
            "allow-all": {
                type: 'boolean',
                short: 'a',
            },
            "allow-network": {
                type: 'boolean',
                short: 'n',
            },
            help: {
              type: 'boolean',
              short: 'h'
            },
            debug: {
                type: 'boolean',
                short: 'd',
            },
            trace: {
                type: 'string',
                multiple: true,
            },
            log: {
                type: 'string',
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
                multiple: true,
                short: 'e',
            },
            worker: {
                type: 'boolean',
                short: 'w',
            },
            union: {
                type: 'boolean',
                short: 'u',
            },
            count: {
                type: 'string'
            },
            network: {
                type: 'boolean',
                short: 'u',
            },
            "mount-working-dir": {
                type: 'boolean',
                short: 'p',
            },
            "sockets-promise-disable": {
                type: 'boolean'
            },
            "sockets-promise-timeout": {
                type: 'string'
            }
        };

        let capabilites = WasiCapabilities.None;
        let isHelp = false;
        let componentMode = false;
        let runDebug = false;
        let workerMode = false;
        let useUnionOverlayFs = false;
        let mountUrl = "";
        let wasmBinaryFromArgs = "";
        let mountDirectoryOrUrl = false;
        let sockets_promise_timeout = 1;

        //let args: string[] = [];
        let runCount = 1;
        let argv = process.argv;
        shellDebug("shell argv:",  argv);
        let args = process.argv.slice(2);
        shellDebug("shell args:",  args);

        let wasmArgs: string[] = [];
        if (!env) {
            env = {};
        }
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
            DEBUG_MODE = true;
        }
        if (values.trace) {
            let debugComponentsList = processMultipleArgValuesArray(values.trace);
            activateTraceDebugComponents(debugComponentsList)
        }
        if (values.log) {
            let fileNamePrefix = values.log as string;
            await initializeLogging({
                output: "file",
                fileNamePrefix: fileNamePrefix,
            })
        }
        if (values.env) {
            env = processMultipleArgValuesToMap(values.env);
        }
        if (values.mount) {
            mountDirectoryOrUrl = true;
            capabilites = capabilites | WasiCapabilities.FileSystem;
            mountUrl = values.mount as string;
            shellDebug("mountUrl: ", mountUrl);
        }
        if (values.worker) {
            workerMode = true;
        }
        if (values.union) {
            useUnionOverlayFs = true;
        }
        if (values.count) {
            const sRunCount = values.count as string;
            const nRunCount = new Number(sRunCount);
            runCount = nRunCount.valueOf();
        }
        if (values["mount-working-dir"] !== undefined) {
            capabilites = capabilites | WasiCapabilities.FileSystem;
            mountDirectoryOrUrl = true;
        }
        if (process.env.WASMIN_CAP_DIR !== undefined) {
            capabilites = capabilites | WasiCapabilities.FileSystem;
            mountDirectoryOrUrl = true;
        }
        if (values["sockets-promise-disable"] !== undefined) {
            // @ts-ignore
            globalThis.USE_ACCEPTED_SOCKET_PROMISE = false;
        }
        if (values["sockets-promise-timeout"] !== undefined) {
            const sPromiseTimeout = values["sockets-promise-timeout"] as string;
            const nPromiseTimeout = new Number(sPromiseTimeout);
            sockets_promise_timeout = nPromiseTimeout.valueOf();
            // @ts-ignore
            globalThis.USE_ACCEPTED_SOCKET_PROMISE_TIMEOUT = sockets_promise_timeout;
        }
        if (values["allow-all"] !== undefined) {
            capabilites = capabilites | WasiCapabilities.All;
        }
        if (process.env.WASMIN_CAP_ALL !== undefined) {
            capabilites = capabilites | WasiCapabilities.All;
        }
        if (values["allow-network"] !== undefined) {
            capabilites = capabilites | WasiCapabilities.Network;
        }
        if (process.env.WASMIN_CAP_NETWORK !== undefined) {
            capabilites = capabilites | WasiCapabilities.Network;
        }

        // @ts-ignore
        shellDebug(`globalThis.USE_ACCEPTED_SOCKET_PROMISE: ${globalThis.USE_ACCEPTED_SOCKET_PROMISE}`);
        // @ts-ignore
        shellDebug(`globalThis.USE_ACCEPTED_SOCKET_PROMISE_TIMEOUT: ${globalThis.USE_ACCEPTED_SOCKET_PROMISE_TIMEOUT}`);

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
    ${fl('-a, --allow-all')}               Allow all capabilities (also env variable WASMIN_CAP_ALL)
    ${fl('-n, --allow-network')}           Allow network sockets (also env variable WASMIN_CAP_NETWORK)
    ${fl('-p, --mount-working-dir')}       Mount Current Working Directory as root (also env variable WASMIN_CAP_DIR)
    ${fl('-m, --mount')}   ${flv('[path|url]')}      Mount Path or URL and use as root, e.g. ./subdir or nfs://host/export or s3://bucket
    ${fl('-c')}                            Run in component mode (enables preview1 on top of preview2)
    ${fl('-e')}                            Evironment variables
    ${fl('-d')}                            Debug Mode
    ${fl('--trace [comp1,comp2]')}         Enable trace debug for copmonent name (e.g. preview1/preview2)
    ${fl('--log [filename]')}              Enabling writing log/debug output to file
    ${fl('-u')}                            Enable Uniion overlayed FileSystem
    ${fl('-w')}                            Run in Worker (threads) mode
    ${fl('--count')}                       Number of identical runs
    ${fl('--sockets-promise-disable')}     Disable sockets promise implementation
    ${fl('--sockets-promise-timeout')}     Timeout in ms for sockets promise implementation`);

            process.exit(0);
        }

        if (positionals.length>0) {
            wasmBinaryFromArgs = positionals[0];
            wasmArgs = positionals.slice(1);
        }
        shellDebug("wasmBinaryFromArgs: ", wasmBinaryFromArgs);

        RegisterProvider("s3", s3);
        // @ts-ignore
        RegisterProvider("github", github);
        // @ts-ignore
        RegisterProvider("nfs", nfs);
        // @ts-ignore
        //RegisterProvider("smb", smb);

        if (!isBun()) {
            RegisterProvider("node", node);
        //} else if (isBun()) {
        //    const bunimport = await import("@netapplabs/bun-fs-js");
        //    const bunfs = bunimport.bun;
        //    RegisterProvider("bun", bunfs);
        }

        //process.stdin.resume();
        process.stdin.setEncoding("utf8");

        const preOpens: Record<string, FileSystemDirectoryHandle> = {};
        const rootDir = "/";
        const init_pwd = "/";

        env["RUST_BACKTRACE"] = "full";
        env["RUST_LOG"] = "wasi=trace";
        env["PWD"] = "/";
        env["TERM"] = "xterm-256color";
        env["COLORTERM"] = "truecolor";
        env["LC_CTYPE"] = "UTF-8";
        env["COMMAND_MODE"] = "unix2003";
        env["FORCE_COLOR"] = "true";
        env["PROMPT_INDICATOR"] = "wasmin> ";
        env["FORCE_COLOR"] = "true";
        //env["FORCE_HYPERLINK"] = "true";
        env["USER"] = "none";
        env["HOME"] = "/";

        const abortController = new AbortController();
        let runs = 0;
        while (runs < runCount) {
            let startTime = performance.now();

            const modResponse = await getWasmModuleBufer(wasmBinaryFromArgs);
            const wasmBuf = modResponse.buffer;
            const wasmBinary = modResponse.path;    

            let newEnv = {...env};
            let newArgs = [...wasmArgs];
            shellDebug("newArgs: ", newArgs);
            shellDebug("newEnv: ", newEnv);

            //shellDebug(`run is: ${runs}`);
            if (runDebug) {
                // @ts-ignore
                globalThis.WASI_CALL_DEBUG=true;
            }
            if (workerMode) {
                try {
                    const openFilesMap: OpenFilesMap = {};
                    if (mountUrl != "") {
                        shellDebug("mountUrl: ", mountUrl);
                        openFilesMap["/"] = mountUrl;
                    }
                    const wasi = new WASIWorker({
                        abortSignal: abortController.signal,
                        openFiles: openFilesMap,
                        stdin: stdin,
                        stdout: stdout,
                        stderr: stderr,
                        args: newArgs,
                        env: newEnv,
                        tty: tty,
                        name: wasmBinaryFromArgs,
                        componentMode: componentMode,
                        capabilities: capabilites,
                    });
                    const statusCode = await wasi.run(wasmBinary);
                    if (statusCode !== 0) {
                        shellDebug(`Exit code: ${statusCode}`);
                    }
                } catch (err: any) {
                    if (DEBUG_MODE) {
                        console.log(err);
                    }
                    prettyPrintError(err);
                    shellDebug(err);
                } finally {
                    if (DEBUG_MODE) {
                        shellDebug("finally");
                    }
                    process.exit(0);
                }
            } else {
                if (mountDirectoryOrUrl) {
                    const driver = USE_MEMORY ? memory : rootfsDriver || node;
                    shellDebug("mountUrl: ", mountUrl);
                    const rootfs = await getRootFS(driver, USE_MEMORY ? "" : mountUrl, useUnionOverlayFs);
                    preOpens[rootDir] = rootfs;
                    shellDebug("preOpens: ", preOpens);
                }
                const openFiles = new OpenFiles(preOpens);
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
                        name: wasmBinaryFromArgs,
                        componentMode: componentMode,
                        capabilities: capabilites,
                    });
                    const statusCode = await wasi.run(wasmBuf);
                    if (statusCode !== 0) {
                        shellDebug(`Exit code: ${statusCode}`);
                    }
                } catch (err: any) {
                    if (DEBUG_MODE) {
                        console.log(err);
                    }
                    prettyPrintError(err);
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
        prettyPrintError(err);
        process.exit(1);
    }
}

function prettyPrintError(err: any) {
    console.log(err);
    let h2 = chalk.green.underline;
    let rd = chalk.red;
    let green = chalk.green;
    let yellow = chalk.yellow;

    let binaryName = process.argv[0];
    if (binaryName.indexOf("wasmin") == -1 ) {
        binaryName = "wasmin";
    }
    console.log("");
    console.log(` ${h2('Error running module:')}`);
    console.log("");
    console.log(` ${rd(err.message)}`);
    console.log("");
    console.log(` ${green(`Please execute ${yellow(binaryName + " -h")} for options`)}`);

}

function processMultipleArgValuesToMap(vals: any){
    let ret: Record<string,string> = processMultipleArgValues(vals, true) as Record<string,string>;
    return ret;
}

function processMultipleArgValuesArray(vals: any, keyValue?: boolean){
    let ret: string[] = processMultipleArgValues(vals, false) as string[]
    return ret;
}

function processMultipleArgValues(vals: any, keyValue?: boolean){
    let retArray: string[] = [];
    if (isArray(vals)) {
        retArray = vals as string[];
        if (retArray.length == 1 ) {
            let gotSingle = retArray[0] as string;
            retArray = gotSingle.split(",");
        }
    } else {
        let gotSingle = vals as string;
        retArray = gotSingle.split(",");
    }
    if (keyValue === true) {
        let retMap: Record<string,string> = {};
        for (const keyVal of retArray) {
            let eKeyVal = keyVal.split("=");
            let eKey = eKeyVal[0];
            if (eKeyVal.length>1) {
                let eVal = eKeyVal[1];
                retMap[eKey] = eVal;
            }
        }
        return retMap;
    }
    return retArray;
}

function activateTraceDebugComponents(components: string[]) {
    shellDebug("activateTraceDebugComponents components: ", components);
    for (const comp of components) {
        if (comp.toUpperCase() == "S3") {
            (globalThis as any).S3_DEBUG = true;
        }
        let componentUpperCase = comp.toUpperCase();
        let var1 = `WASI_${componentUpperCase}_DEBUG`;
        let var2 = `${componentUpperCase}_DEBUG`;
        let evalStatement1 = `if (globalThis.${var1} !== undefined) {globalThis.${var1}=true;}`;
        let evalStatement2 = `if (globalThis.${var2} !== undefined) {globalThis.${var2}=true;}`;
        eval(evalStatement1);
        eval(evalStatement2);
    }
}