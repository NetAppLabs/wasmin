//import { describe, test, expect } from 'vitest'
import "jest-extended";

import path from "path";
import { readFile } from "fs/promises";
import { WASI, stringOut, OpenFiles, bufferIn, WasiCapabilities } from "@netapplabs/wasi-js";
import { FileSystemFileHandle } from "@netapplabs/fs-js";
import { backend, getRootHandle } from "./utils.js";

const EOL = "\n";

type Test = Partial<{
    exitCode: number;
    stdin: string;
    stdout: string;
}>;

const tests: (Test & { test: string })[] = [
    //{ test: "link" },
    // ---
    { test: "getentropy" },
    { test: "stat", stdout: `---500${EOL}` },
    { test: "cant_dotdot" },
    { test: "clock_getres" },
    { test: "exitcode", exitCode: 120 },
    { test: "fd_prestat_get_refresh" },
    { test: "freopen", stdout: `hello from input2.txt${EOL}` },
    { test: "ftruncate" },
    { test: "getrusage" },
    { test: "gettimeofday" },
    { test: "main_args" },
    { test: "notdir" },
    { test: "poll" },
    { test: "preopen_populates" },
    { test: "read_file", stdout: `hello from input.txt${EOL}` },
    {
        test: "read_file_twice",
        stdout: `hello from input.txt${EOL}hello from input.txt${EOL}`,
    },
    { test: "readdir" },
    { test: "write_file" },
    { test: "stdin", stdin: "hello world", stdout: "hello world" },
    { test: "stdout", stdout: "42" },
    { test: "stdout_with_flush", stdout: `12${EOL}34` },
    { test: "stdout_with_setbuf", stdout: `42` },
    { test: "export", stdout: `10 + 3 = 13${EOL}10 / 3 = 3.33${EOL}` },
];

const textEncoder = new TextEncoder();
describe("asyncified", () => {
    test.each(tests)(
        "$test",
        async ({ test, stdin, stdout = "", exitCode = 0 }) => {
            console.log("running test: ", test);
            const wasmPath = path.resolve(path.join("tests", "asyncified-wasm", `${test}.wasm`));
            const module = readFile(wasmPath).then((buf) => WebAssembly.compile(buf));

            const rootHandle = await getRootHandle(backend);
            if (backend == "memory") {
                const nodeRootHandle = await getRootHandle("fs-js");
                const dirs = ["sandbox", "tmp"];
                for (const dir of dirs) {
                    const memDirHandle = await rootHandle.getDirectoryHandle(dir, {
                        create: true,
                    });
                    const nodeDirHandle = await nodeRootHandle.getDirectoryHandle(dir);
                    for await (const [name, entry] of nodeDirHandle) {
                        if (entry.kind == "file") {
                            const esfh = entry as FileSystemFileHandle;
                            const esf = await esfh.getFile();
                            const sf = await memDirHandle.getFileHandle(name, {
                                create: true,
                            });
                            const sfc = await sf.createWritable({ keepExistingData: false });
                            const sfw = await sfc.getWriter();
                            await sfw.write(await esf.arrayBuffer());
                            await sfw.close();
                        } else {
                            await memDirHandle.getDirectoryHandle(name, { create: true });
                        }
                    }
                }
            }

            const [sandbox, tmp] = await Promise.all([
                rootHandle.getDirectoryHandle("sandbox"),
                rootHandle.getDirectoryHandle("tmp"),
            ]);

            let actualStdout = "";
            let actualStderr = "";
            let actualExitCode = 0;

            try {
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
                    capabilities: WasiCapabilities.FileSystem,
                });
                actualExitCode = await w.run(await module);
            } catch (err: any) {
                console.log("err: ", err);
                console.log("err.stack: ", err.stack);
            }
            expect(actualExitCode).toBe(exitCode);
            expect(actualStdout).toBe(stdout);
            expect(actualStderr).toBe("");
        },
        10000
    );
});
