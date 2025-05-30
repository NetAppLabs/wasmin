import { ProcessNamespace as procns } from "@netapplabs/wasi-snapshot-preview2/async";
import { IoStreamsNamespace as ions } from "@netapplabs/wasi-snapshot-preview2/async";
import { FilesystemFilesystemNamespace as fsn } from "@netapplabs/wasi-snapshot-preview2/async";

type WasiExtProcessProcess = procns.WasiExtProcessProcess;
type Process = procns.Process;
type ExecArgs = procns.ExecArgs;
type ProcessId = procns.ProcessId;
type ProcessStatus = procns.ProcessStatus;
type Capabilites = procns.Capabilites;
type EnvVariable = procns.EnvVariable;

type ProcessErrorCode = procns.ErrorCode;
type InputStream = ions.InputStream;
type OutputStream = ions.OutputStream;
type Descriptor = fsn.Descriptor;


import { WasiCapabilities, WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
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
    async setArgv(argv: string[]): Promise<void> {
        this.argv = argv;
    }
    async setEnv(env: EnvVariable[]): Promise<void> {
        this.env = env;
    }
    async setRoot(root: Descriptor): Promise<void> {
        this.root = root;
    }
    async setCapabilities(caps: Capabilites): Promise<void> {
        this.capabilities = caps;
    }

    private _wasiEnv: WasiEnv;
    private name: string;
    private processId?: ProcessId;
    private innerProcess?: WasiProcess;
    private status: ProcessStatus;
    private stdIn?: Descriptor;
    private stdOut?: Descriptor;
    private stdErr?: Descriptor;
    private processControl?: Descriptor;
    private argv?: string[];
    private env?: EnvVariable[];
    private capabilities?: Capabilites;
    private root?: Descriptor;

    get openFiles() {
        return this._wasiEnv.openFiles;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    resource: number;

    set execArgs(execArgs: ExecArgs|undefined) {
        if (execArgs) {
            this.argv = execArgs.argv;
            this.env = execArgs.env;
            this.capabilities = execArgs.capabilities;
            this.root = execArgs.root;
        }
    }
    
    async getProcessId(): Promise<ProcessId> {
        if (this.processId !== undefined) {
            return this.processId;
        }
        throw 'not-started';
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
    async getStdin(): Promise<Descriptor> {
        if (this.stdIn !== undefined) {
            return this.stdIn;
        } else {
            throw 'not-started';
        }
    }
    async getStdout(): Promise<Descriptor> {
        if (this.stdOut !== undefined) {
            return this.stdOut;
        } else {
            throw 'not-started';
        }
    }
    async getStderr(): Promise<Descriptor> {
        if (this.stdErr !== undefined) {
            return this.stdErr;
        } else {
            throw 'not-started';
        }
    }

    async getProcessControl(): Promise<Descriptor> {
        if (this.processControl !== undefined) {
            return this.processControl;
        } else {
            throw 'not-started';
        }
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
        let args: string[] | undefined;
        if (this.argv !== undefined) {
            args = this.argv;
        } else {
            args = [];
        }
        let env: Record<string,string> = {};
        if (this.env !== undefined) {
            let envFromArgs = this.env;
            if (envFromArgs !== undefined) {
                for (const envArg of envFromArgs) {
                    const key = envArg[0];
                    const value = envArg[1];
                    env[key] = value;
                }
            }
        }
        let rootDescriptor = this.root;
        if (rootDescriptor !== undefined) {
            if (rootDescriptor instanceof FileSystemFileDescriptor) {
                let fsDesc = rootDescriptor as FileSystemFileDescriptor;
                if (fsDesc.path !== undefined) {
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

        this.stdIn = new FileSystemFileDescriptor(this._wasiEnv, newStdInFd);
        this.stdOut = new FileSystemFileDescriptor(this._wasiEnv, newStdOutFd);
        this.stdErr = new FileSystemFileDescriptor(this._wasiEnv, newStdErrFd);
        this.processControl = new FileSystemFileDescriptor(this._wasiEnv, newProcFd);

        let capabilities = WasiCapabilities.None;

        if (this.capabilities) {
            if (this.capabilities.inherit) {
                capabilities = this._wasiEnv.capabilities;
            } else  if (this.capabilities.none) {
                capabilities = WasiCapabilities.None;         
            } else {
                if (this.capabilities.filesystem) {
                    capabilities = capabilities | WasiCapabilities.FileSystem;
                }
                if (this.capabilities.network) {
                    capabilities = capabilities | WasiCapabilities.Network;
                }
                if (this.capabilities.all) {
                    capabilities = capabilities | WasiCapabilities.All;
                }
            }
        }
        this._wasiEnv.capabilities
        
        let proc = new WasiProcess(
            this._wasiEnv,
            name,
            cwd,
            args,
            env,
            newStdin,
            newStdOut,
            newStdErr,
            procControl,
            capabilities,
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
        this.Process = ProcessResource;
    }
    private _wasiEnv: WasiEnv;
    public Process: typeof ProcessResource;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

    async create(name: string): Promise<Process> {
        let proc = new ProcessResource(this.wasiEnv, name);
        return proc;
    }

    async exec(name: string, execArgs: ExecArgs | undefined): Promise<Process> {
        try {
            let proc = await this.create(name);
            if (execArgs !== undefined) {
                if (execArgs.argv !== undefined) {
                    proc.setArgv(execArgs.argv);
                }
                if (execArgs.env !== undefined) {
                    proc.setEnv(execArgs.env);
                }
                if (execArgs.root !== undefined) {
                    proc.setRoot(execArgs.root);
                }
                if (execArgs.capabilities !== undefined) {
                    proc.setCapabilities(execArgs.capabilities);
                }
            }
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