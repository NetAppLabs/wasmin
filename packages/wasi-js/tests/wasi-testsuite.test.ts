//import { describe, test, expect } from 'vitest'
import "jest-extended";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "fs/promises";
import { Test, constructTestsForTestSuites, constructWasiForTest} from "@wasm-env/wasi-js/tests/utils.js"
import { WASI } from "@wasm-env/wasi-js";

const scriptDir = dirname(fileURLToPath(import.meta.url));

const WASI_TESTSUITE_PATH_RUST = join(scriptDir, "wasi-testsuite/tests/rust/testsuite");
const WASI_TESTSUITE_PATH_C = join(scriptDir, "wasi-testsuite/tests/c/testsuite");
const WASI_TESTSUITE_PATH_AS = join(scriptDir, "wasi-testsuite/tests/assemblyscript/testsuite");

async function constructTestsWithSkip(){
    const tests: Test[] = await constructTestsForTestSuites([WASI_TESTSUITE_PATH_C, WASI_TESTSUITE_PATH_RUST, WASI_TESTSUITE_PATH_AS]);
    const testSkipRemoved: Test[] = [];
    const skips: string[] = [
        "dangling_symlink",
        "fopen-with-no-access",
        "fd_advise",
        "fd_filestat_set"
    ];

    for (const t of tests) {
        let skip = false;
        for (const sk of skips){
            if (t.test.includes(sk)) {
                console.log(`skipping ${sk}`);
                skip = true;
            }
        }
        if (!skip) {
            testSkipRemoved.push(t);
        }
    }
    return testSkipRemoved;
}

const tests = await constructTestsWithSkip();

describe("all", () => {
    test.each(tests)(
        "$test",
        async (testCase: Test) => {
            let ret: {
                stdout: string
                stderr: string
                wasi?: WASI
            } = {
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
                let wasmMod: BufferSource;
                if (wasmPath) {
                    wasmMod = await readFile(wasmPath);
                } else {
                    throw Error("wasmPath is not set");
                }
                ret = await constructWasiForTest(testCase);
                const w = ret.wasi;
                if (w) {
                    actualExitCode = await w.run(await wasmMod);
                }
            } catch (err: any) {
                console.log("err: ", err);
                console.log("err.stack: ", err.stack);
            }
            actualStdout = ret.stdout;
            actualStderr = ret.stderr;
            expect(actualExitCode).toBe(exitCode);
            expect(actualStdout).toBe(stdout);
            expect(actualStderr).toBe("");
        },
        100000
    );
});
