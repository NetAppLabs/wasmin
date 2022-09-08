//import { describe, test, expect } from 'vitest'

import path from "path";
import { readFile } from "fs/promises";
import { WASI, stringOut, OpenFiles, bufferIn } from "../src";
import { getOriginPrivateDirectory } from "@wasm-env/fs-js";
//import { node } from "@wasm-env/fs-js";
import { node } from "@wasm-env/fs-js-node";
import { memory } from "@wasm-env/fs-js";

/*
// require is here needed to get node export
const wasm_env_fs = require("@wasm-env/fs-js");
const getOriginPrivateDirectory = wasm_env_fs.getOriginPrivateDirectory;
const memory = wasm_env_fs.getOriginPrivateDirectory;
const node = wasm_env_fs.node;
*/

/*
declare let globalThis: any;
globalThis.WASI_DEBUG = true;
globalThis.WASI_FD_DEBUG = false;
globalThis.WASI_FS_DEBUG = true;
*/
//TODO: look into why File global is not polyfilled by web-file-polyfill
const testMemory = false;

const EOL = "\n";

type Test = Partial<{
    exitCode: number;
    stdin: string;
    stdout: string;
}>;

/*
const tests: (Test & { test: string })[] = [
    //{ test: "link" },
    // ---
    { test: "ftruncate" },
    //{ test: "stat" , stdout: `---500${EOL}` },
];
*/
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
    //{ test: "ftruncate" },
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
    { test: "async-export", stdout: `10 + 3 = 13${EOL}10 / 3 = 3.33${EOL}` },
];

const textEncoder = new TextEncoder();
describe("all", () => {
    test.each(tests)("$test", async ({ test, stdin, stdout = "", exitCode = 0 }) => {
        const wasmPath = path.resolve(path.join("tests", "wasm", `${test}.wasm`));
        const module = readFile(wasmPath).then((buf) => WebAssembly.compile(buf));

        let rootHandle: FileSystemDirectoryHandle;
        const nodeRootHandle = await getOriginPrivateDirectory(node, path.resolve(path.join("tests", "fixtures")));
        if (testMemory) {
            console.log("test: memory");

            const memRootHandle = await getOriginPrivateDirectory(memory);
            const dirs = ["sandbox", "tmp"];
            for (const dir of dirs) {
                console.log("dir: ", dir);
                const memDirHandle = await memRootHandle.getDirectoryHandle(dir, { create: true });
                const nodeDirHandle = await nodeRootHandle.getDirectoryHandle(dir);
                for await (const [name, entry] of nodeDirHandle) {
                    if (entry.kind == "file") {
                        console.log("copying: ", name);
                        const esfh = entry as FileSystemFileHandle;
                        console.log("copying2 : ", name);

                        const esf = await esfh.getFile();
                        console.log("esf : ", esf);

                        const sf = await memDirHandle.getFileHandle(name, { create: true });
                        console.log("sf : ", sf);

                        const sfc = await sf.createWritable({ keepExistingData: false });
                        console.log("sfc : ", sfc);

                        const sfw = await sfc.getWriter();
                        console.log("sfw : ", sfw);

                        sfw.write(await esf.arrayBuffer());
                        sfw.close();
                    }
                }
            }
            rootHandle = memRootHandle;
        } else {
            rootHandle = nodeRootHandle;
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
            });
            actualExitCode = await w.run(await module);
        } catch (err: any) {
            console.log("err: ", err);
            console.log("err.stack: ", err.stack);
        }
        expect(actualExitCode).toBe(exitCode);
        expect(actualStdout).toBe(stdout);
        expect(actualStderr).toBe("");
    });
});
