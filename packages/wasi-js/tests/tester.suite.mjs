#!/usr/bin/env zx
/* eslint-disable no-undef */

import path from "node:path";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "fs/promises";
import { constructOneTestForTestSuite, constructWasiForTest } from "@wasm-env/wasi-js/tests/utils.js";
import { getOriginPrivateDirectory } from "@wasm-env/fs-js";
import { isBun } from "@wasm-env/wasi-js/index.js";
import { default as process } from "node:process";

const scriptDir = dirname(fileURLToPath(import.meta.url));
//const WASI_TESTSUITE_PATH = join(scriptDir, "./wasi-testsuite/tests/rust/testsuite");
//const testFile = "dangling_fd.json";
//const testFile = "fd_readdir.json";
//const testFile = "fdopendir-with-access.json"
//const testFile = "directory_seek.json"
//const testFile = "interesting_paths.json"
//const testFile = "fd_filestat_set.json";
//const testFile = "fd_filestat_get.wasm";
//const testFile = "fd_flags_set.json";

//const WASI_TESTSUITE_PATH = join(scriptDir, "./wasi-testsuite/tests/c/testsuite");
//const testFile = "fopen-with-access.json"
//const testFile = "pwrite-with-access.json"
//const testFile = "lseek.json"

const WASI_TESTSUITE_PATH = join(scriptDir, "./wasi-testsuite/tests/assemblyscript/testsuite");
const testFile = "environ_get-multiple-variables.json";
//const testFile = "fd_write-to-stdout.json"
//const testFile = "environ_sizes_get-multiple-variables.json";

let loop_count = 10;

for (let i = 0; i < loop_count; i++) {
    const testCase = await constructOneTestForTestSuite(WASI_TESTSUITE_PATH, testFile);
    console.log(`iteration: ${i}`);
    await runCase(testCase);
}

async function runCase(testCase) {
    let ret = {
        stdout: "",
        stderr: "",
    };
    const wasmPath = testCase.wasmPath;
    const stdout = testCase.stdout;
    let actualExitCode = 0;
    let actualStdout = "";
    let actualStderr = "";
    let exitCode = testCase.exitCode;
    if (!exitCode) {
        exitCode = 0;
    }
    try {
        let wasmMod;
        if (wasmPath) {
            wasmMod = await readFile(wasmPath);
        } else {
            throw Error("wasmPath is not set");
        }
        console.log("exitCode: ", exitCode);
        let w = undefined;
        ret = await constructWasiForTest(testCase);
        w = ret.wasi;
        console.log("wasi: ", w);

        if (w) {
            //w.wasiEnv.env["RUST_BACKTRACE"] = "full";
            //w.component = true;
            actualExitCode = await w.run(await wasmMod);
        }
    } catch (err) {
        console.log("err: ", err);
        console.log("err.stack: ", err.stack);
        actualStdout = ret.stdout;
        actualStderr = ret.stderr;

        console.log("actualStdout: ", actualStdout);
        console.log("actualStdErr: ", actualStderr);

        process.exit(1);
    }
    actualStdout = ret.stdout;
    actualStderr = ret.stderr;

    console.log("actualStdout: ", actualStdout);
    console.log("actualStdErr: ", actualStderr);
}
