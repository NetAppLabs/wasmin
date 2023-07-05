#!/usr/bin/env zx
/* eslint-disable no-undef */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "fs/promises";
import { constructOneTestForTestSuite, constructWasiForTest} from "@wasm-env/wasi-js/tests/utils.js"

const scriptDir = dirname(fileURLToPath(import.meta.url));
const WASI_TESTSUITE_PATH= join(scriptDir, "./wasi-testsuite/tests/rust/testsuite");
//const testFile = "dangling_fd.json";
const testFile = "fd_readdir.json";
//const testFile = "fdopendir-with-access.json"
//const testFile = "fopen-with-no-access.wasm"
//const testFile = "interesting_paths.json"

const testCase = await constructOneTestForTestSuite(WASI_TESTSUITE_PATH, testFile);

await runCase(testCase);

async function runCase(testCase) {
            let ret = {
                stdout: "",
                stderr: "",
            }
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
                ret = await constructWasiForTest(testCase);
                const w = ret.wasi;
                if (w) {
                    actualExitCode = await w.run(await wasmMod);
                }
            } catch (err) {
                console.log("err: ", err);
                console.log("err.stack: ", err.stack);
            }
            actualStdout = ret.stdout;
            actualStderr = ret.stderr;

            console.log("actualStdout: ", actualStdout);
            console.log("actualStdErr: ", actualStderr);
}

