import { TerminalStdInNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalStdinAsync = TerminalStdInNamespace.WasiCliTerminalStdin;
type TerminalInput = TerminalStdInNamespace.TerminalInput;
import { TerminalStdOutNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalStdoutAsync = TerminalStdOutNamespace.WasiCliTerminalStdout;
type TerminalOutput = TerminalStdOutNamespace.TerminalOutput;
import { TerminalStErrNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalStderrAsync = TerminalStErrNamespace.WasiCliTerminalStderr;
type TerminalOutputErr = TerminalStErrNamespace.TerminalOutput;
import { TerminalInputNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalInputAsync = TerminalInputNamespace.WasiCliTerminalInput;
import { TerminalOutputNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalOutputAsync = TerminalOutputNamespace.WasiCliTerminalOutput;
import { TerminalInputExtendedNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
import { TerminalOutputExtendedNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
import { TerminalStdInExtendedNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
import { TerminalStdOutExtendedNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
import { TerminalStdErrExtendedNamespace } from "@netapplabs/wasi-snapshot-preview2/async";

type WasiExtCliTerminalInputExtended = TerminalInputExtendedNamespace.WasiExtCliTerminalInputExtended;
type TerminalInputExtended = TerminalInputExtendedNamespace.TerminalInputExtended;

type WasiExtCliTerminalOutputExtended = TerminalOutputExtendedNamespace.WasiExtCliTerminalOutputExtended;
type TerminalOutputExtended = TerminalOutputExtendedNamespace.TerminalOutputExtended;

type WasiExtCliTerminalStdinExtended = TerminalStdInExtendedNamespace.WasiExtCliTerminalStdinExtended;
type WasiExtCliTerminalStdoutExtended = TerminalStdOutExtendedNamespace.WasiExtCliTerminalStdoutExtended;
type WasiExtCliTerminalStderrExtended = TerminalStdErrExtendedNamespace.WasiExtCliTerminalStderrExtended;

type RowsAndColumns = TerminalOutputExtendedNamespace.RowsAndColumns;

import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { Resource } from "../../wasiResources.js";
import { wasiPreview2Debug } from "../../wasiDebug.js";

export class TerminalInputInstance implements TerminalInput, TerminalInputExtended, Resource {
    constructor(wasiOptions: WasiOptions, fd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this.fd = fd;
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
        this.TerminalInput = TerminalInputInstance;
        this.TerminalInputExtended = TerminalInputInstance;
    }
    async getRawMode(): Promise<boolean> {
        let rawMode =  await this._wasiEnv.tty?.getRawMode();
        if (rawMode !== undefined) {
            return rawMode;
        } else {
            return false;
        }
    }
    async setRawMode(rawMode: boolean): Promise<void> {
        await this._wasiEnv.tty?.setRawMode(rawMode);
    }
    private _wasiEnv: WasiEnv;
    public TerminalInput: typeof TerminalInputInstance;
    public TerminalInputExtended: typeof TerminalInputInstance;


    get openFiles() {
        return this._wasiEnv.openFiles;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    fd: number;
    resource: number;
};

export class TerminalOutputInstance implements TerminalOutput,TerminalOutputExtended, Resource {
    constructor(wasiOptions: WasiOptions, fd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this.fd = fd;
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
        this.TerminalOutput = TerminalOutputInstance;
        this.TerminalOutputExtended = TerminalOutputInstance;
    }
    async windowSize(): Promise<RowsAndColumns> {
        let termSize = await this._wasiEnv.tty?.getSize();
        if (termSize !== undefined) {
            return termSize;
        } else {
            return {
                columns: 80,
                rows: 24,
            }
        }
    }
    private _wasiEnv: WasiEnv;
    public TerminalOutput: typeof TerminalOutputInstance;
    public TerminalOutputExtended: typeof TerminalOutputInstance;

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
        this.TerminalInputExtended = TerminalInputInstance;
    }
    private _wasiEnv: WasiEnv;
    public TerminalInput: typeof TerminalInputInstance;
    public TerminalInputExtended: typeof TerminalInputInstance;

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

export class TerminalStdoutAsyncHost implements TerminalStdoutAsync, WasiExtCliTerminalStdoutExtended {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.TerminalOutput = TerminalOutputInstance;
        this.TerminalOutputExtended = TerminalOutputInstance;
    }
    private _wasiEnv: WasiEnv;
    public TerminalOutput: typeof TerminalOutputInstance;
    public TerminalOutputExtended: typeof TerminalOutputInstance;

    get openFiles() {
        return this._wasiEnv.openFiles;
    }

    async getTerminalStdout(): Promise<TerminalOutputExtended | undefined> {
        wasiPreview2Debug("TerminalStdoutAsyncHost getTerminalStdout");
        const stdout_fd = 1;
        let termInstance = new TerminalOutputInstance(this._wasiEnv, stdout_fd);
        return termInstance;
    }

    async toExtended(input: TerminalStdOutNamespace.TerminalOutput): Promise<TerminalOutputExtended | undefined> {
        let asExtended = input as TerminalOutputExtended;
        return asExtended;
    }
}

export class TerminalStderrAsyncHost implements TerminalStderrAsync, WasiExtCliTerminalStderrExtended {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.TerminalOutput = TerminalOutputInstance;
        this.TerminalOutputExtended = TerminalOutputInstance;
    }
    
    public TerminalOutput: typeof TerminalOutputInstance;
    public TerminalOutputExtended: typeof TerminalOutputInstance;

    private _wasiEnv: WasiEnv;
    get openFiles() {
        return this._wasiEnv.openFiles;
    }
    
    async getTerminalStderr(): Promise<TerminalOutputExtended | undefined> {
        wasiPreview2Debug("TerminalStderrAsyncHost getTerminalStderr");
        const stderr_fd = 2;
        let termInstance = new TerminalOutputInstance(this._wasiEnv, stderr_fd);
        return termInstance;
    }
    async toExtended(input: TerminalOutput): Promise<TerminalOutputExtended | undefined> {
        let asExtended = input as TerminalOutputExtended;
        return asExtended;
    }

}