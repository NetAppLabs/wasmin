import { getOriginPrivateDirectory, join, memory } from "@netapplabs/fs-js";
import { FileOrDir, OpenFiles, Readable, Writable } from "./wasiFileSystem.js";
import { WASI, WasiEnv } from "./wasi.js";
import { FileSystemDirectoryHandle } from "@netapplabs/fs-js";
import { BufferedPipe } from "./wasiPipes.js";
import { TTYInstance } from "./tty.js";
import { wasiProcessDebug } from "./wasiDebug.js";
import { sleep } from "./utils.js";


let enc = new TextEncoder(); // utf-8

const TERM_SET_RAW_MODE_CSI = enc.encode("\x1b[0;1W");
const TERM_UNSET_RAW_MODE_CSI = enc.encode("\x1b[0;0W");

type ProcControlMessage = number;
const PROC_EXIT: ProcControlMessage = 0xa1;
const TERM_SET_RAW_MODE: ProcControlMessage = 0xb1;
const TERM_UNSET_SET_RAW_MODE: ProcControlMessage = 0xb2;

export class ProcessControl extends BufferedPipe {
    async writeControlMessage(msg: ProcControlMessage) {
        let procMsg = new Uint8Array(1);
        procMsg[0] = msg;        
        await this.write(procMsg);
    }
}

export class WasiProcess {

    constructor(
        wasiEnv: WasiEnv,
        name: string,
        cwd: string,
        args: string[],
        env: Record<string,string>,
        stdin: Readable,
        stdout: Writable,
        stderr: Writable,
        procControl: ProcessControl,
    ) {
        this._wasiEnv = wasiEnv;
        this.name = name;
        this.cwd = cwd;
        this.args = args;
        this.env = env;
        this.stdin = stdin;
        this.stdout = stdout;
        this.stderr = stderr;
        this.procControl = procControl;
    }
    
    get wasiEnv () {
        return this._wasiEnv;
    }

    _wasiEnv: WasiEnv;
    name: string;
    cwd: string;
    args: string[];
    env: Record<string,string>;
    stdin: Readable;
    stdout: Writable;
    stderr: Writable;
    procControl: ProcessControl;

    async start() {

        let cwd = this.cwd;
        let args = this.args;
        let env = this.env;
        let name = this.name;
        let processName = this.name;
        let procControl = this.procControl;
        let newStdin = this.stdin;
        let newStdOut = this.stdout;
        let newStdErr = this.stderr;

        let moduleOrSource: WebAssembly.Module | BufferSource | undefined;

        // Name with suffixes to try to execute:
        const nameWasmTries = [name, name + ".async.wasm", name + ".wasm"];

        for (const nameWasm of nameWasmTries) {
            wasiProcessDebug("exec args prepended: ", args);

            const tryByPath = true;
            let tryByUrl = true;

            if (tryByPath) {
                // Try by filesystem:
                try {
                    // TODO inpect this:
                    if (cwd == ".") {
                        cwd = "/";
                    }
                    wasiProcessDebug("exec: tryByPath cwd: ", cwd);
                    wasiProcessDebug("exec: tryByPath nameWasm: ", nameWasm);

                    let wasmFilePath = join(cwd, nameWasm);
                    if (wasmFilePath.startsWith("/")) {
                        wasmFilePath = wasmFilePath.substring(1, wasmFilePath.length);
                    }
                    wasiProcessDebug("exec: tryByPath: wasmFilePath: ", wasmFilePath);

                    const relOpen = this._wasiEnv.openFiles.findRelPath(cwd);
                    if (relOpen) {
                        const preOpenDir = relOpen.preOpen;
                        wasiProcessDebug("exec: tryByPath: preOpenDir: ", preOpenDir);

                        const wasiFile = await preOpenDir.getFileOrDir(wasmFilePath, FileOrDir.File);

                        const file = await wasiFile.getFile();
                        const bufferSource = await file.arrayBuffer();
                        wasiProcessDebug(`exec: tryByPath successful loading wasm from path: ${wasmFilePath}`);

                        moduleOrSource = bufferSource;
                        tryByUrl = false;
                    }
                } catch (err: any) {
                    wasiProcessDebug("exec: tryByPath err: ", err);
                }
            }

            if (tryByUrl) {
                // Try by url:
                const wasmUrl = "./" + nameWasm;
                wasiProcessDebug("exec: tryByUrl wasmUrl: ", wasmUrl);
                try {
                    //moduleWaiting = WebAssembly.compileStreaming(fetch(wasmUrl));
                    const res = await fetch(wasmUrl);
                    if (res.ok) {
                        const contentType = res.headers.get("Content-Type");
                        if (contentType == "application/wasm") {
                            moduleOrSource = await res.arrayBuffer();
                            wasiProcessDebug(`exec: tryByUrl successful loading wasm from  url: ${wasmUrl}`);
                        }
                    }
                } catch (err: any) {
                    wasiProcessDebug("exec: tryByUrl err: ", err.message);
                }
            }

            if (moduleOrSource) {
                processName = nameWasm;
                break;
            }
        }

        if (!moduleOrSource) {
            throw new Error(name + " not found");
        }

        const runInSandbox = false;
        let openFiles: OpenFiles;
        if (runInSandbox) {
            // not inheriting sub openfiles from parent - instead use memory fs
            const preOpens: Record<string, FileSystemDirectoryHandle> = {};
            const memfs = await getOriginPrivateDirectory(memory);
            preOpens["/"] = memfs;
            openFiles = new OpenFiles(preOpens);
        } else {
            openFiles = await this._wasiEnv.openFiles.cloneFromPath(cwd);
        }
        const abortSignal = this._wasiEnv.abortSignal;

        // debug
        //env["RUST_BACKTRACE"] = "1";
        //env["RUST_LOG"] = "wasi=trace";
        //temp workaround
        //env["USER"] = "none";
        //env["HOME"] = "/";

        let parent_prompt_indicator = this.wasiEnv.env["PROMPT_INDICATOR"];
        
        if (parent_prompt_indicator !== undefined ){
            env["PROMPT_INDICATOR"] = `sub-${parent_prompt_indicator}`;
        }

        const parentTty = this._wasiEnv.tty;

        let procColumns = 80;
        let procRows = 24;
        let procRawMode = false;
        if (parentTty !== undefined) {
            let curSize = await parentTty.getSize();
            procColumns = curSize.columns;
            procRows = curSize.rows;
            procRawMode = await parentTty.getRawMode();
        }
        const rawModeListener = async function (rawMode: boolean): Promise<void> {
            wasiProcessDebug("proc rawModeListener, setRawMode ", rawMode);
            if (rawMode) {
                //await newStdOut.write(TERM_SET_RAW_MODE_CSI);
                await procControl.writeControlMessage(TERM_SET_RAW_MODE);
            } else {
                //await newStdOut.write(TERM_UNSET_RAW_MODE_CSI);
                await procControl.writeControlMessage(TERM_UNSET_SET_RAW_MODE);
            }
            // wait until rawMode has been propagated
            if (parentTty) {
                let realTTYRawMode = await parentTty.getRawMode();
                while (realTTYRawMode != rawMode) {
                    realTTYRawMode = await parentTty.getRawMode();
                    wasiProcessDebug(`proc rawModeListener waiting raw mode realTTYRawMode: ${realTTYRawMode} rawMode: ${rawMode}`);
                    await sleep(1);
                }
                await sleep(5);
                wasiProcessDebug(`proc rawModeListener done waiting raw mode realTTYRawMode: ${realTTYRawMode} rawMode: ${rawMode}`);
            }
        };
        let processTty = new TTYInstance(procColumns, procRows, procRawMode, rawModeListener);
        let overridedGetRawModeToReal = async function () {
            if (parentTty) {
                return await parentTty.getRawMode();
            }
            return false;
        };
        // ovverride getRawMode to return rawMode for real TTY
        processTty.getRawMode = overridedGetRawModeToReal.bind(processTty);
        const exitCode = 0;
        
        const w = new WASI({
            openFiles: openFiles,
            abortSignal: abortSignal,
            stdin: newStdin,
            stdout: newStdOut,
            stderr: newStdErr,
            args: args,
            env: env,
            tty: processTty,
            name: processName,
            componentMode: this.wasiEnv.componentMode,
        });


        let procStartFuncPromise = async () => {
            wasiProcessDebug("starting procStartFuncPromise")
            // new Promise((resolve, _reject) => {
                wasiProcessDebug("starting w.run: ");
                //let originalRawMode = await tty?.getRawMode();
                //tty?.setRawMode(false);
                w.run(moduleOrSource!)
                    .then((exitCode) => {
                        wasiProcessDebug(`exec:run then exit code: ${exitCode}`);
                        if (exitCode !== 0) {
                            wasiProcessDebug(`exec:run exit code: ${exitCode}`);
                        }
                        //resolve(exitCode);
                    })
                    .catch((err: any) => {
                        wasiProcessDebug(`exec:run:catch exitCode: ${exitCode} err: ${err}`);
                        //resolve(translateErrorToErrorno(err));
                    })
                    .finally(async () => {

                        await sleep(10);
                        procControl.writeControlMessage(PROC_EXIT);
                        /*
                        wasiProcessDebug(`exec:run:finally closing fd ${newStdInFd}`);
                        await this._wasiEnv.openFiles.close(newStdInFd);
                        wasiProcessDebug(`exec:run:finally closing fd ${newStdOutFd}`);
                        await this._wasiEnv.openFiles.close(newStdOutFd);
                        wasiProcessDebug(`exec:run:finally closing fd ${newStdErrFd}`);
                        await this._wasiEnv.openFiles.close(newStdErrFd);
                        */
                        /*if (originalRawMode !== undefined) {
                            tty?.setRawMode(originalRawMode);
                        }*/
                        wasiProcessDebug(`exec:run:finally exitCode: ${exitCode}`);
                    });
            //});
            wasiProcessDebug("returning from procStartFuncPromise")
        }

        let procStartFuncSync = () => {
            procStartFuncPromise();
        }
        wasiProcessDebug('pre procStartFuncSync');
        procStartFuncSync();
        wasiProcessDebug('returning from exec');

        let pid = BigInt(1)
        return pid;
    }
}