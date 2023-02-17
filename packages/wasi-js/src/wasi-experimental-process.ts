import { getOriginPrivateDirectory, memory } from "@wasm-env/fs-js";
import { FileOrDir, OpenFiles } from "./wasiFileSystem.js";
import { UTF8_DECODER, clamp_host } from "./intrinsics.js";
import { WASI, WasiEnv } from "./wasi.js";
import { wasiDebug, translateErrorToErrorno, parseCStringArray } from "./wasiUtils.js";
import { Fd } from "./wasi_snapshot_preview1/bindings.js";

export function addWasiExperimentalProcessToImports(
    imports: any,
    obj: WasiExperimentalProcess,
    get_export: (name: string) => WebAssembly.ExportValue
): void {
    if (!("wasi-experimental-process" in imports)) imports["wasi-experimental-process"] = {};
    imports["wasi-experimental-process"]["exec"] = async function (
        arg0: number,
        arg1: number,
        arg2: number,
        arg3: number,
        arg4: number,
        arg5: number
    ) {
        const memory = get_export("memory") as WebAssembly.Memory;
        const ptr0 = arg0;
        const len0 = arg1;
        const ptr1 = arg2;
        const len1 = arg3;
        const ptr2 = arg4;
        const len2 = arg5;
        let ret = 0;
        try {
            ret = await obj.exec(
                UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr0, len0)),
                UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr1, len1)),
                UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr2, len2))
            );
        } catch (err: any) {
            return translateErrorToErrorno(err);
        }
        return clamp_host(ret, 0, 4294967295);
    };
}

export function initializeWasiExperimentalProcessToImports(
    imports: any,
    get_export: (name: string) => WebAssembly.ExportValue,
    wasi: WasiEnv
) {
    const wHost = new WasiExperimentalProcessHost(wasi);
    addWasiExperimentalProcessToImports(imports, wHost, get_export);
}

export interface WasiExperimentalProcess {
    exec(cwd: string, name: string, argv: string): Promise<number>;
}

class WasiExperimentalProcessHost implements WasiExperimentalProcess {
    constructor(wasi: WasiEnv) {
        this._wasiEnv = wasi;
    }
    private _wasiEnv: WasiEnv;
    async exec(cwd: string, name: string, argvString: string): Promise<number> {
        wasiDebug("exec cwd: ", cwd);
        wasiDebug("exec name: ", name);
        //const argvString = string.get(this._getBuffer(), argv_ptr, argv_len);
        wasiDebug("exec argvString: ", argvString);
        const args: string[] = parseCStringArray(argvString);
        wasiDebug("exec args: ", args);
        // TODO simplify this
        //prepend name as first arg:
        const nameWasm = name + ".async.wasm";
        args.splice(0, 0, nameWasm);
        wasiDebug("exec args prepended: ", args);
        let moduleWaiting: Promise<WebAssembly.Module> | undefined;

        const tryByPath = true;
        let tryByUrl = true;

        if (tryByPath) {
            // Try by filesystem:
            try {
                const wasmFile = "./" + nameWasm;
                const rootFd = 3 as Fd;
                const wasiFile = await this._wasiEnv.openFiles
                    .getPreOpen(rootFd)
                    .getFileOrDir(wasmFile, FileOrDir.File);
                const file = await wasiFile.getFile();
                const bufferSource = await file.arrayBuffer();
                //bufferSource = this._openFiles.findRelPath(wasmFile);
                moduleWaiting = WebAssembly.compile(bufferSource);
                tryByUrl = false;
            } catch (err: any) {
                console.error("wasi::exec err: ", err);
            }
        }

        if (tryByUrl) {
            // Try by url:
            const wasmUrl = "./" + nameWasm;
            wasiDebug("wasmUrl: ", wasmUrl);
            try {
                moduleWaiting = WebAssembly.compileStreaming(fetch(wasmUrl));
            } catch (err: any) {
                console.error("wasi::exec err: ", err);
            }
        }

        const devnull = {
            async read(len: number): Promise<Uint8Array> {
                return new Promise((resolve) => {
                    wasiDebug("devnull read: ", len);
                    resolve(new Uint8Array([]));
                });
            },
            async write(data: Uint8Array): Promise<void> {
                const textDecoder = new TextDecoder();
                const str = textDecoder.decode(data, { stream: true }).replaceAll("\n", "\r\n");
                wasiDebug("devnull write: ", str);
            },
        };
        const module = await moduleWaiting;

        const devNull = devnull;
        const runInSandbox = false;
        let openFiles: OpenFiles;
        if (runInSandbox) {
            // not inheriting openfiles from parent:
            const preOpens: Record<string, FileSystemDirectoryHandle> = {};
            const memfs = await getOriginPrivateDirectory(memory);
            preOpens["/"] = memfs;
            openFiles = new OpenFiles(preOpens);
        } else {
            openFiles = this._wasiEnv.openFiles;
        }
        const oldStdin = this._wasiEnv.stdin;
        const oldStdOut = this._wasiEnv.stdout;
        const oldStderr = this._wasiEnv.stderr;
        const abortSignal = this._wasiEnv.abortSignal;
        const oldTtyRawMode = this._wasiEnv.tty?.rawMode || false;
        const env: Record<string, string> = {};

        // debug
        env["RUST_BACKTRACE"] = "1";
        env["RUST_LOG"] = "wasi=trace";
        //temp workaround
        env["USER"] = "none";
        env["HOME"] = "/";

        const tty = this._wasiEnv.tty;

        this._wasiEnv.suspendStdIn = true;
        this._wasiEnv.stdin = devNull;
        this._wasiEnv.stderr = devNull;
        this._wasiEnv.stdout = devNull;
        if (this._wasiEnv.tty) {
            // resetting rawMode false for the new process
            this._wasiEnv.tty.rawMode = false;
        }

        const exitCode = 0;

        return new Promise((resolve, _reject) => {
            const w = new WASI({
                openFiles: openFiles,
                abortSignal: abortSignal,
                stdin: oldStdin,
                stdout: oldStdOut,
                stderr: oldStderr,
                args: args,
                env: env,
                tty: tty,
            });
            w.run(module!)
                .then((exitCode) => {
                    if (exitCode !== 0) {
                        wasiDebug(`exec:run exit code: ${exitCode}`);
                    }
                    resolve(exitCode);
                })
                .catch((err: any) => {
                    wasiDebug(`exec:run:catch exitCode: ${exitCode} err: ${err}`);
                    console.log("wasi-experimental-process:exec error: ", err);
                    resolve(translateErrorToErrorno(err));
                })
                .finally(() => {
                    wasiDebug(`exec:run:finally exitCode: ${exitCode}`);
                    this._wasiEnv.stdin = oldStdin;
                    this._wasiEnv.stdout = oldStdOut;
                    this._wasiEnv.stderr = oldStderr;
                    this._wasiEnv.suspendStdIn = false;
                    if (this._wasiEnv.tty) {
                        this._wasiEnv.tty.rawMode = oldTtyRawMode;
                    }
                });
        });
    }
}
