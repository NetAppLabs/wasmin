#!/usr/bin/env zx
/* eslint-disable no-undef */

import { spawn } from "node:child_process";
import { resolve, join, dirname } from "node:path";
import fs from "node:fs/promises";
import { readFile } from "fs/promises";
import { WASI, OpenFiles, stringOut, bufferIn } from "@wasmin/wasi-js";
import { getOriginPrivateDirectory } from "@wasmin/fs-js";
import { node } from "@wasmin/node-fs-js";
import { fileURLToPath } from "node:url";
import { isBun } from "@wasmin/wasi-js/index.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));

let baseDir = scriptDir;
console.log("Current directory:", baseDir);

const textEncoder = new TextEncoder();

async function getRootHandle(backend) {
    switch (backend) {
        case "memory":
            return getOriginPrivateDirectory(memory);
        default: {
            if (isBun()) {
                const bunmod = await import("@wasmin/bun-fs-js");
                const bun = bunmod.bun;
                return getOriginPrivateDirectory(bun, resolve(join(baseDir, "fixtures")));
            } else {
                return getOriginPrivateDirectory(node, resolve(join(baseDir, "fixtures")));
            }
        }
    }
}

let backend = "node";
let stdin = "";
let actualStdout = "";
let actualStderr = "";

//let test = "getentropy";
//let test = "exitcode";
//let test = "readdir";
//let test = "write_file";
//let test = "cant_dotdot";
//let test = "stat";
//let test = "ftruncate";
//let test = "stdin";
//stdin = "hello world";
//let test = "stdout";
//let test = "stdout_with_flush";
//let test = "freopen";
//let test = "poll";
//let test = "read_file";
//let test = "read_file_twice";
//let test = "preopen_populates";
let test = "clock_getres";
//let test = "exitcode";

//let subdir = "wasm";
let subdir = "shared-wasm";
let oneWasmPath = resolve(join(baseDir, subdir, `${test}.wasm`));
console.log("oneWasmPath:", oneWasmPath);
//let oneWasmPath = resolve(join(baseDir, "component.core.wasm"));
//const module = readFile(wasmPath).then((buf) => WebAssembly.compile(buf));
const wasmMod = readFile(oneWasmPath);

const rootHandle = await getRootHandle(backend);

const [sandbox, tmp] = await Promise.all([
    rootHandle.getDirectoryHandle("sandbox"),
    rootHandle.getDirectoryHandle("tmp"),
]);

const w = new WASI({
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
let actualExitCode = 0;
try {
    //w.component = true;
    actualExitCode = await w.run(await wasmMod);
} catch (err) {
    console.log("run err: ", err);
}
console.log("stdin:", stdin);
console.log("stdout:", actualStdout);
console.log("stderr:", actualStderr);

console.log("actualExitCode: ", actualExitCode);
