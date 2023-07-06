import path from "path";
import { readdir, readFile } from "fs/promises";
import { WASI, stringOut, OpenFiles, bufferIn } from "../index.js";
import { getOriginPrivateDirectory, FileSystemDirectoryHandle } from "@wasm-env/fs-js";
import { node } from "@wasm-env/node-fs-js";
import { memory } from "@wasm-env/fs-js";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

type backendType = "fs-js" | "nfs-js" | "memory";
export let testFsBackend: backendType = "fs-js";
switch (process.env.TEST_WASI_USING_BACKEND) {
    case "memory":
        testFsBackend = "memory";
        break;
    case "nfs-js":
        testFsBackend = "nfs-js";
        break;
    default:
        testFsBackend = "fs-js";
        break;
}

export async function copyFsInto(rootPath: string, rootHandle: FileSystemDirectoryHandle, dirs = ["sandbox", "tmp"]) {
    const nodeRootHandle = await getRootHandle("fs-js", rootPath);
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

export async function getRootHandle(backend: string, rootPath: string): Promise<FileSystemDirectoryHandle> {
    //const nfsUrl = "nfs://127.0.0.1" + path.resolve(".", "tests", "fixtures") + "/";
    let dirHandle: FileSystemDirectoryHandle;
    switch (backend) {
        case "memory":
            dirHandle = await getOriginPrivateDirectory(memory, "", false);
            await copyFsInto(rootPath, dirHandle);
        //case "nfs-js": return new NfsDirectoryHandle(nfsUrl);
        default:
            dirHandle = await getOriginPrivateDirectory(node, path.resolve(rootPath), false);
    }
    return dirHandle;
}

export type Test = Partial<{
    test: string;
    args: string[];
    env: Record<string, string>;
    dirs: string[];
    exitCode: number;
    stdin: string;
    stdout: string;
    wasmPath: string;
    rootPath: string;
}>;

export async function constructTestsForTestSuites(testsuitePaths: string[]): Promise<Test[]> {
    const tests: Test[] = [];
    for (const tsuite of testsuitePaths) {
        const testsforsuite = await constructTestsForTestSuite(tsuite);
        for (const testinner of testsforsuite) {
            tests.push(testinner);
        }
    }
    return tests;
}

export async function constructTestsForTestSuite(testsuitePath: string): Promise<Test[]> {
    const tests: Test[] = [];
    const files = await readdir(testsuitePath);

    for (const fileName of files) {
        const newTest = await constructOneTestForTestSuite(testsuitePath, fileName);
        let skipThisWasm = false;
        if (newTest) {
            // Filter out if it already contains:
            for (const t of tests) {
                if (t.wasmPath) {
                    if (t.wasmPath == newTest?.wasmPath) {
                        skipThisWasm = true;
                    }
                }
            }
            if (!skipThisWasm) {
                tests.push(newTest);
            }
        }
    }
    return tests;
}

export async function constructOneTestForTestSuite(testsuitePath: string, fileName: string): Promise<Test | undefined> {
    const skipList = ["manifest"];
    if (fileName.endsWith(".json")) {
        const testName = fileName.substring(0, fileName.length - ".json".length);
        if (skipList.includes(testName)) {
            return undefined;
        }
        const fullFileName = path.join(testsuitePath, fileName);
        const fileContentsBuffer = await readFile(fullFileName);
        const fileContents = textDecoder.decode(fileContentsBuffer);
        const vars = JSON.parse(fileContents);
        const wasmPath = path.resolve(path.join(testsuitePath, `${testName}.wasm`));

        const test = "wasi-testsuite-" + testName;
        let args: string[] = [];
        if (vars.args) {
            args = vars.args;
        }
        let env: Record<string, string> = {};
        if (vars.env) {
            env = vars.env;
        }
        let dirs: string[] = [];
        if (vars.dirs) {
            dirs = vars.dirs;
        }
        let exitCode: number = 0;
        if (vars.exit_code) {
            exitCode = vars.exit_code;
        }
        let stdin: string = "";
        if (vars.stdin) {
            stdin = vars.stdin;
        }
        let stdout: string = "";
        if (vars.stdout) {
            stdout = vars.stdout;
        }

        const addedTest: Test = {
            test: test,
            args: args,
            env: env,
            dirs: dirs,
            exitCode: exitCode,
            stdin: stdin,
            stdout: stdout,
            wasmPath: wasmPath,
            rootPath: testsuitePath,
        };
        return addedTest;
    } else if (fileName.endsWith(".wasm")) {
        const testName = fileName.substring(0, fileName.length - ".wasm".length);
        const wasmPath = path.resolve(path.join(testsuitePath, `${testName}.wasm`));
        let skipThisWasm = false;
        if (!skipThisWasm) {
            const test = "wasi-testsuite-" + testName;
            const args: string[] = [];
            const env = {};
            const dirs: string[] = [];
            const exitCode = 0;
            const stdin = "";
            const stdout = "";
            const addedTest: Test = {
                test: test,
                args: args,
                env: env,
                dirs: dirs,
                exitCode: exitCode,
                stdin: stdin,
                stdout: stdout,
                wasmPath: wasmPath,
                rootPath: testsuitePath,
            };
            return addedTest;
        }
    }
    return undefined;
}

export async function constructWasiForTest(testCase: Test) {
    const wasmPath = testCase.wasmPath;
    const rootPath = testCase.rootPath;
    const dirs = testCase.dirs;
    const args = testCase.args;
    const env = testCase.env;
    const stdin = testCase.stdin;
    //let actualStdout = "";
    //let actualStderr = "";
    const ret: {
        wasi?: WASI;
        stdout: string;
        stderr: string;
    } = {
        stdout: "",
        stderr: "",
    };
    let rootHandle: FileSystemDirectoryHandle;
    if (rootPath) {
        rootHandle = await getRootHandle(testFsBackend, rootPath);
    } else {
        throw Error("RootHandle not set");
    }

    const dirHandles: Record<string, FileSystemDirectoryHandle> = {};

    if (dirs) {
        for (const dir of dirs) {
            const dirHandle = await rootHandle.getDirectoryHandle(dir);
            //const mountDirName = "/" + dir;
            const mountDirName = dir;
            dirHandles[mountDirName] = dirHandle;
        }
    }
    const openFiles = new OpenFiles(dirHandles);

    //if (env) {
    //    env["RUST_BACKTRACE"] = "full";
    //}

    const wasiOpts = {
        openFiles: openFiles,
        stdin: bufferIn(textEncoder.encode(stdin)),
        stdout: stringOut((text) => (ret.stdout += text)),
        stderr: stringOut((text) => (ret.stderr += text)),
        args: args,
        env: env,
    };
    const w = new WASI(wasiOpts);
    ret.wasi = w;
    return ret;
}
