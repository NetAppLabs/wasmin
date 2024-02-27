import { ProcessNamespace as procns } from "@wasmin/wasi-snapshot-preview2/async";
type WasiExtProcessProcess = procns.WasiExtProcessProcess;
type Process = procns.Process;
type ExecArgs = procns.ExecArgs;
type EnvVariable = procns.EnvVariable;
type ProcessId = procns.ProcessId;

type ProcessErrorCode = procns.ErrorCode;

import { WASI, WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { Resource } from "../../wasiResources.js";
import { wasiPreview2Debug } from "../../wasiDebug.js";

export class ProcessResource implements Process, Resource {
    constructor(wasiOptions: WasiOptions, name: string, execArgs?: ExecArgs) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
        this.name = name;
        this.execArgs = execArgs;
        this.oldTtyRawMode = false;
    }

    private _wasiEnv: WasiEnv;
    private name: string;
    private execArgs?: ExecArgs;
    private wasi?: WASI;
    private moduleOrSource?: WebAssembly.Module | BufferSource;
    private oldTtyRawMode: boolean;
    private processId?: ProcessId;

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
    getName(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getArgv(): Promise<string[] | undefined> {
        throw new Error("Method not implemented.");
    }
    getEnv(): Promise<procns.EnvVariable[] | undefined> {
        throw new Error("Method not implemented.");
    }
    getStdin(): Promise<procns.OutputStream> {
        throw new Error("Method not implemented.");
    }
    setStdin(stdin: procns.OutputStream): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getStdout(): Promise<procns.InputStream> {
        throw new Error("Method not implemented.");
    }
    setStdout(stdout: procns.InputStream): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getStderr(): Promise<procns.InputStream> {
        throw new Error("Method not implemented.");
    }
    setStderr(stderr: procns.InputStream): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getStatus(): Promise<procns.ProcessStatus> {
        throw new Error("Method not implemented.");
    }
    getParent(): Promise<procns.Process | undefined> {
        throw new Error("Method not implemented.");
    }
    getChildren(): Promise<procns.Process[] | undefined> {
        throw new Error("Method not implemented.");
    }
    getRoot(): Promise<procns.Descriptor | undefined> {
        throw new Error("Method not implemented.");
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

    async init(): Promise<void> {

    }

    async start(): Promise<procns.ProcessId> {
        let newPid = BigInt(1);
        this.processId = newPid;
        return this.processId;
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
        await proc.init();
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