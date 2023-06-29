#!/usr/bin/env zx
/* eslint-disable no-undef */

import { spawn } from "node:child_process";
import { resolve, join, dirname } from "node:path";
import fs from "node:fs/promises";
import { readFile } from "fs/promises";
import { WASI, OpenFiles, stringOut, bufferIn } from "@wasm-env/wasi-js";
import { getOriginPrivateDirectory } from "@wasm-env/fs-js";
import { node } from "@wasm-env/node-fs-js";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));

let baseDir = scriptDir;
console.log("Current directory:", baseDir);

const textEncoder = new TextEncoder();

async function getRootHandle(backend) {
    switch (backend) {
        case "memory":
            return getOriginPrivateDirectory(memory);
        default:
            return getOriginPrivateDirectory(node, resolve(join(baseDir, "fixtures")));
    }
}

let backend = "node";
let stdin = "";
let actualStdout = "";
let actualStderr = "";

let test = "export";

let oneWasmPath = resolve(join(baseDir, "shared-wasm", `${test}.wasm`));
//const module = readFile(wasmPath).then((buf) => WebAssembly.compile(buf));
const wasmMod = readFile(oneWasmPath);

const rootHandle = await getRootHandle(backend);

const [sandbox, tmp] = await Promise.all([
    rootHandle.getDirectoryHandle("sandbox"),
    rootHandle.getDirectoryHandle("tmp"),
]);

const w2 = new WASI({
    openFiles: new OpenFiles({
        // @ts-ignore
        "/sandbox": sandbox,
        // @ts-ignore
        "/tmp": tmp,
    }),
    stdin: bufferIn(textEncoder.encode(stdin)),
    stdout: stringOut((text) => (actualStdout += text)),
    stderr: stringOut((text) => (actualStderr += text)),
    args: ["foo", "-bar", "--baz=value"],
    env: {
        NODE_PLATFORM: "win32",
    },
});
const w = new WASI({});
//let actualExitCode = await w.instantiate(await wasmMod);

//let actualExitCode = await w.instantiate(await wasmMod);

let actualExitCode = 0 ;

/*
let coreModuleImports = w.initializeCoreImports();
let instance = await w.instantiate(await wasmMod, coreModuleImports);
let exports = instance.exports;
*/
const exports = await w.exportFunction(await wasmMod);

let { sum } = exports

let sumRet = await sum(1,2);
console.log("sumRet:", sumRet);
w.stopWorker();

console.log("stdin:", stdin);
console.log("stdout:", actualStdout);
console.log("stderr:", actualStderr);
console.log("actualExitCode: ", actualExitCode);
