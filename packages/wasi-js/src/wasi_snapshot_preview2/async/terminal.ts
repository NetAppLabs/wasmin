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

export class TerminalStdinAsyncHost implements TerminalStdinAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    get openFiles() {
        return this._wasiEnv.openFiles;
    }

    async getTerminalStdin(): Promise<TerminalInput | undefined> {
        const stdin_fd = 0;
        const stdin = this.openFiles.get(stdin_fd);
        return stdin as TerminalInput;
    }
}

export class TerminalStdoutAsyncHost implements TerminalStdoutAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;
    get openFiles() {
        return this._wasiEnv.openFiles;
    }

    async getTerminalStdout(): Promise<TerminalOutput | undefined> {
        const stdout_fd = 1;
        const stdin = this.openFiles.get(stdout_fd);
        return stdin as TerminalOutput;
    }
}

export class TerminalStderrAsyncHost implements TerminalStderrAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;
    get openFiles() {
        return this._wasiEnv.openFiles;
    }
    
    async getTerminalStderr(): Promise<TerminalOutput | undefined> {
        const stderr_fd = 1;
        const stdin = this.openFiles.get(stderr_fd);
        return stdin as TerminalOutput;
    }
}

export class TerminalInputAsyncHost implements TerminalInputAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async dropTerminalInput(this0: TerminalInput): Promise<void> {
        // TODO implement
        // Silently ignored for now
    }
}

export class TerminalOutputAsyncHost implements TerminalOutputAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async dropTerminalOutput(this0: TerminalOutput): Promise<void> {
        // TODO implement
        // Silently ignored for now
    }
}