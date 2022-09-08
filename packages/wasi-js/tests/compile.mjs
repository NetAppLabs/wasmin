#!/usr/bin/env zx
/* eslint-disable no-undef */

import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";

const CLANG_PATH = `/Users/tryggvil/Development/netapp/wasm/wasi-sdk-16.0`;
const WASM_OPT_PATH = `/usr/local/bin/wasm-opt`;

(async () => {
    const srcPath = path.resolve(path.join(".", "c"));
    const wasmPath = path.resolve(path.join(".", "wasm"));
    const asyncWasmPath = path.resolve(path.join(".", "async-wasm"));

    const srcList = (await fs.readdir(srcPath))
        .filter((filenameWithExt) => path.extname(filenameWithExt) === ".c")
        .map((filenameWithExt) => filenameWithExt.replace(".c", ""));

    console.log("[compile: .c → .wasm]");

    await Promise.all(
        srcList.map((filename) => {
            return new Promise((resolve, reject) => {
                const input = path.join(srcPath, `${filename}.c`);
                const output = path.join(wasmPath, `${filename}.wasm`);
                const p = spawn(`${CLANG_PATH}/bin/clang`, [
                    `--sysroot=${CLANG_PATH}/share/wasi-sysroot`,

                    // The file size is generally 1.3 to almost 2 times larger.
                    //"-Wl,--export-all",
                    "-D_WASI_EMULATED_PROCESS_CLOCKS",
                    input,
                    `-o`,
                    output,
                ]);
                p.stdout.on("data", (payload) => reject(`[spawn/stdout]: ${payload.toString().trim()}`));
                p.stderr.on("data", (payload) => reject(`[spawn/stderr]: ${payload.toString().trim()}`));
                p.on("exit", async (exit_code) => {
                    if (exit_code !== 0) console.log(`[spawn/exit] ${exit_code}`);
                    resolve();
                });
            });
        })
    );

    console.log("[asyncify-wasm]");

    await Promise.all(
        srcList.map((filename) => {
            return new Promise((resolve, reject) => {
                const input = path.join(wasmPath, `${filename}.wasm`);
                const output = path.join(asyncWasmPath, `${filename}.wasm`);
                const p = spawn(WASM_OPT_PATH, ["--asyncify", input, `-o`, output]);
                p.stdout.on("data", (payload) => reject(`[spawn/stdout]: ${payload.toString().trim()}`));
                p.stderr.on("data", (payload) => reject(`[spawn/stderr]: ${payload.toString().trim()}`));
                p.on("exit", async (exit_code) => {
                    if (exit_code !== 0) console.log(`[spawn/exit] ${exit_code}`);
                    resolve();
                });
            });
        })
    );
})();
