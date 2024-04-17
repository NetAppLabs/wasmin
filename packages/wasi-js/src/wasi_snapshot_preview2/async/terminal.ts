import { TerminalStdInNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalStdinAsync = TerminalStdInNamespace.WasiCliTerminalStdin;
type TerminalInput = TerminalStdInNamespace.TerminalInput;
import { TerminalStdOutNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalStdoutAsync = TerminalStdOutNamespace.WasiCliTerminalStdout;
type TerminalOutput = TerminalStdOutNamespace.TerminalOutput;
import { TerminalStErrNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalStderrAsync = TerminalStErrNamespace.WasiCliTerminalStderr;
type TerminalOutputErr = TerminalStErrNamespace.TerminalOutput;
import { TerminalInputNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalInputAsync = TerminalInputNamespace.WasiCliTerminalInput;
import { TerminalOutputNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalOutputAsync = TerminalOutputNamespace.WasiCliTerminalOutput;


import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { Resource } from "../../wasiResources.js";
import { wasiPreview2Debug } from "./preview2Utils.js";

export class TerminalInputInstance implements TerminalInput, Resource {
    constructor(wasiOptions: WasiOptions, fd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this.fd = fd;
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
    }
    private _wasiEnv: WasiEnv;

    get openFiles() {
        return this._wasiEnv.openFiles;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    fd: number;
    resource: number;
};

export class TerminalOutputInstance implements TerminalOutput, Resource {
    constructor(wasiOptions: WasiOptions, fd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this.fd = fd;
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
    }
    private _wasiEnv: WasiEnv;

    get openFiles() {
        return this._wasiEnv.openFiles;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    fd: number;
    resource: number;

};

export class TerminalStdinAsyncHost implements TerminalStdinAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.TerminalInput = TerminalInputInstance;
    }
    private _wasiEnv: WasiEnv;
    public TerminalInput: typeof TerminalInputInstance;

    get openFiles() {
        return this._wasiEnv.openFiles;
    }

    async getTerminalStdin(): Promise<TerminalInput | undefined> {
        wasiPreview2Debug("TerminalStdinAsyncHost TerminalStdinAsyncHost");
        const stdin_fd = 0;
        //const stdin = this.openFiles.get(stdin_fd);
        let termInstance = new TerminalInputInstance(this._wasiEnv, stdin_fd);
        return termInstance;
    }
}

export class TerminalStdoutAsyncHost implements TerminalStdoutAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.TerminalOutput = TerminalOutputInstance;
    }
    private _wasiEnv: WasiEnv;
    public TerminalOutput: typeof TerminalOutputInstance;

    get openFiles() {
        return this._wasiEnv.openFiles;
    }

    async getTerminalStdout(): Promise<TerminalOutput | undefined> {
        wasiPreview2Debug("TerminalStdoutAsyncHost getTerminalStdout");
        const stdout_fd = 1;
        let termInstance = new TerminalOutputInstance(this._wasiEnv, stdout_fd);
        return termInstance;
    }
}

export class TerminalStderrAsyncHost implements TerminalStderrAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.TerminalOutput = TerminalOutputInstance;
    }
    public TerminalOutput: typeof TerminalOutputInstance;
    private _wasiEnv: WasiEnv;
    get openFiles() {
        return this._wasiEnv.openFiles;
    }
    
    async getTerminalStderr(): Promise<TerminalOutput | undefined> {
        wasiPreview2Debug("TerminalStderrAsyncHost getTerminalStderr");
        const stderr_fd = 2;
        let termInstance = new TerminalOutputInstance(this._wasiEnv, stderr_fd);
        return termInstance;
    }
}