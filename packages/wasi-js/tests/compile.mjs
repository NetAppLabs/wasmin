#!/usr/bin/env zx
/* eslint-disable no-undef */

import { spawn } from "node:child_process";
import path from "node:path";
import fsp from "node:fs/promises";
import fs from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const WASI_SDK_PATH = `/Users/tryggvil/Development/netapp/wasm/wasi-sdk-20.0`;
const WASM_OPT_PATH = `/opt/homebrew/bin/wasm-opt`;
const scriptDir = dirname(fileURLToPath(import.meta.url));

(async () => {
    const SHARED_SCRIPT_WASM_PATH = path.resolve(path.join(scriptDir, `../../../bin/shared-wasm`));

    const srcPath = path.resolve(path.join(scriptDir, "c"));

    const wasmPath = path.resolve(path.join(scriptDir, "wasm"));
    const asyncifiedWasmPath = path.resolve(path.join(scriptDir, "asyncified-wasm"));
    const sharedWasmPath = path.resolve(path.join(scriptDir, "shared-wasm"));

    if (!fs.existsSync(wasmPath)) {
        fs.mkdirSync(wasmPath);
    }

    if (!fs.existsSync(asyncifiedWasmPath)) {
        fs.mkdirSync(asyncifiedWasmPath);
    }

    if (!fs.existsSync(sharedWasmPath)) {
        fs.mkdirSync(sharedWasmPath);
    }

    const srcList = (await fsp.readdir(srcPath))
        .filter((filenameWithExt) => path.extname(filenameWithExt) === ".c")
        .map((filenameWithExt) => filenameWithExt.replace(".c", ""));

    console.log("[compile: .c → .wasm]");

    await Promise.all(
        srcList.map((filename) => {
            return new Promise((resolve, reject) => {
                const input = path.join(srcPath, `${filename}.c`);
                const output = path.join(wasmPath, `${filename}.wasm`);
                const p = spawn(`${WASI_SDK_PATH}/bin/clang`, [
                    `--sysroot=${WASI_SDK_PATH}/share/wasi-sysroot`,

                    // The file size is generally 1.3 to almost 2 times larger.
                    //"-Wl,--export-all",
                    "-D_WASI_EMULATED_PROCESS_CLOCKS",
                    "-lwasi-emulated-process-clocks",
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
                const output = path.join(sharedWasmPath, `${filename}.wasm`);
                const p = spawn(SHARED_SCRIPT_WASM_PATH, [input, output]);
                p.stdout.on("data", (payload) => reject(`[spawn/stdout]: ${payload.toString().trim()}`));
                p.stderr.on("data", (payload) => reject(`[spawn/stderr]: ${payload.toString().trim()}`));
                p.on("exit", async (exit_code) => {
                    if (exit_code !== 0) console.log(`[spawn/exit] ${exit_code}`);
                    resolve();
                });
            });
        })
    );

    console.log("[shared-wasm]");

    await Promise.all(
        srcList.map((filename) => {
            return new Promise((resolve, reject) => {
                const input = path.join(wasmPath, `${filename}.wasm`);
                const output = path.join(asyncifiedWasmPath, `${filename}.wasm`);
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
