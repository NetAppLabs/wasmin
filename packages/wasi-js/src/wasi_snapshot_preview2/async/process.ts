import { ProcessNamespace as procns } from "@wasmin/wasi-snapshot-preview2/async";
import { IoStreamsNamespace as ions } from "@wasmin/wasi-snapshot-preview2/async";

type WasiExtProcessProcess = procns.WasiExtProcessProcess;
type Process = procns.Process;
type ExecArgs = procns.ExecArgs;
type ProcessId = procns.ProcessId;
type ProcessStatus = procns.ProcessStatus;

type ProcessErrorCode = procns.ErrorCode;
type InputStream = ions.InputStream;
type OutputStream = ions.OutputStream;

import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { Resource } from "../../wasiResources.js";
import { wasiPreview2Debug, wasiProcessDebug } from "../../wasiDebug.js";
import { ProcessControl, WasiProcess } from "../../wasiProcess.js";
import { BufferedPipe } from "../../wasiPipes.js";
import { FileSystemFileDescriptor } from "./filesystem.js";
import { getInputStreamForReadableFd, getOutputStreamForWritableFd } from "./preview2Utils.js";

export class ProcessResource implements Process, Resource {
    constructor(wasiOptions: WasiOptions, name: string, execArgs?: ExecArgs) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
        this.name = name;
        this.execArgs = execArgs;
        this.status = 'created';
    }

    private _wasiEnv: WasiEnv;
    private name: string;
    private execArgs?: ExecArgs;
    private processId?: ProcessId;
    private innerProcess?: WasiProcess;
    private status: ProcessStatus;
    private stdIn?: OutputStream;
    private stdOut?: InputStream;
    private stdErr?: InputStream;

    get openFiles() {
        return this._wasiEnv.openFiles;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    resource: number;
    
    async getProcessId(): Promise<ProcessId | undefined> {
        return this.processId;
    }
    async getName(): Promise<string> {
        return this.name;
    }
    async getArgv(): Promise<string[] | undefined> {
        return this.execArgs?.argv;
    }
    async getEnv(): Promise<procns.EnvVariable[] | undefined> {
        return this.execArgs?.env;
    }
    async getStdin(): Promise<procns.OutputStream> {
        if (this.stdIn !== undefined) {
            return this.stdIn;
        } else {
            throw 'not-started';
        }
    }
    setStdin(stdin: procns.OutputStream): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getStdout(): Promise<procns.InputStream> {
        if (this.stdOut !== undefined) {
            return this.stdOut;
        } else {
            throw 'not-started';
        }
    }
    setStdout(stdout: procns.InputStream): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getStderr(): Promise<procns.InputStream> {
        if (this.stdErr !== undefined) {
            return this.stdErr;
        } else {
            throw 'not-started';
        }
    }
    setStderr(stderr: procns.InputStream): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getStatus(): Promise<procns.ProcessStatus> {
        return this.status;
    }
    getParent(): Promise<procns.Process | undefined> {
        throw new Error("Method not implemented.");
    }
    getChildren(): Promise<procns.Process[] | undefined> {
        throw new Error("Method not implemented.");
    }
    async getRoot(): Promise<procns.Descriptor | undefined> {
        return this.execArgs?.root;
    }
    getCapabilities(): Promise<procns.Capabilites | undefined> {
        throw new Error("Method not implemented.");
    }
    getTimeStart(): Promise<procns.Datetime> {
        throw new Error("Method not implemented.");
    }
    getTimeEnd(): Promise<procns.Datetime> {
        throw new Error("Method not implemented.");
    }
    terminate(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    initProcess(): void {
        let name = this.name;
        let cwd = "/";
        let args: string[] = [];
        let env: Record<string,string> = {};
        if (this.execArgs !== undefined ) {
            let argvFromArgs = this.execArgs.argv;
            if (argvFromArgs !== undefined) {
                args = argvFromArgs;
            }
            let envFromArgs = this.execArgs.env;
            if (envFromArgs !== undefined) {
                for (const envArg of envFromArgs) {
                    const key = envArg[0];
                    const value = envArg[1];
                    env[key] = value;
                }
            }
            let rootDescriptor = this.execArgs.root;
            if (rootDescriptor !== undefined) {
                if (rootDescriptor instanceof FileSystemFileDescriptor) {
                    let fsDesc = rootDescriptor as FileSystemFileDescriptor;
                    cwd = fsDesc.path;
                }
            }
        }
        let procControl = new ProcessControl();
        let newStdin = new BufferedPipe();
        let newStdOut = new BufferedPipe();
        let newStdErr = new BufferedPipe();

        let newProcFd = this._wasiEnv.openFiles.add(procControl);
        let newStdInFd = this._wasiEnv.openFiles.add(newStdin);
        let newStdOutFd = this._wasiEnv.openFiles.add(newStdOut);
        let newStdErrFd = this._wasiEnv.openFiles.add(newStdErr);

        this.stdIn = getOutputStreamForWritableFd(this._wasiEnv, newStdInFd);
        this.stdOut = getInputStreamForReadableFd(this._wasiEnv, newStdOutFd);
        this.stdErr = getInputStreamForReadableFd(this._wasiEnv, newStdErrFd);

        let proc = new WasiProcess(
            this._wasiEnv,
            name,
            cwd,
            args,
            env,
            newStdin,
            newStdOut,
            newStdErr,
            procControl
        );
        this.innerProcess = proc;
    }

    async start(): Promise<ProcessId> {
        try {
            this.initProcess();
            let newPid = await this.innerProcess?.start();
            this.status = 'running';
            if (newPid !== undefined) {
                this.processId = newPid;
                return newPid;
            }
            throw 'invalid';
        } catch (err: any) {
            wasiProcessDebug("start() got error: ", err);
            let newErr: ProcessErrorCode = "invalid";
            throw newErr;
        }
    }
}

export class WasiExtProcessProcessAsyncHost implements WasiExtProcessProcess {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

    async create(name: string, args: ExecArgs | undefined): Promise<Process> {
        let proc = new ProcessResource(this.wasiEnv, name, args);
        return proc;
    }

    async exec(name: string, args: ExecArgs | undefined): Promise<Process> {
        try {
            let proc = await this.create(name, args);
            proc.start()
                .then(() => {
                    wasiPreview2Debug(`exec process.start: then`);
                })
                .catch((err: any) => {
                    wasiPreview2Debug(`exec process.start: catch err: ${err}`);
                })
                .finally(() => {
                    wasiPreview2Debug(`exec process.start: finally`);
                });
            return proc;
        } catch (err: any) {
            wasiPreview2Debug("WasiExtProcessProcessAsyncHost exec err: ", err);
            let pErr: ProcessErrorCode = "invalid";
            throw pErr;
        }
    }

    async processes(): Promise<Process[]> {
        throw new Error("Method not implemented.");
    }

}