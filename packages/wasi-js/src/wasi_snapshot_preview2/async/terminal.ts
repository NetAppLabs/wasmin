import { TerminalStdInNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalStdinAsync = TerminalStdInNamespace.WasiCliTerminalStdinAsync;
type TerminalInput = TerminalStdInNamespace.TerminalInput;
import { TerminalStdOutNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalStdoutAsync = TerminalStdOutNamespace.WasiCliTerminalStdoutAsync;
type TerminalOutput = TerminalStdOutNamespace.TerminalOutput;
import { TerminalStErrNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalStderrAsync = TerminalStErrNamespace.WasiCliTerminalStderrAsync;
type TerminalOutputErr = TerminalStErrNamespace.TerminalOutput;
import { TerminalInputNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalInputAsync = TerminalInputNamespace.WasiCliTerminalInputAsync;
import { TerminalOutputNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalOutputAsync = TerminalOutputNamespace.WasiCliTerminalOutputAsync;


import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";

export class TerminalStdinAsyncHost implements TerminalStdinAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getTerminalStdin(): Promise<TerminalInput | undefined> {
        return 0;
    }
}

export class TerminalStdoutAsyncHost implements TerminalStdoutAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getTerminalStdout(): Promise<TerminalOutput | undefined> {
        return 1;
    }
}

export class TerminalStderrAsyncHost implements TerminalStderrAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getTerminalStderr(): Promise<TerminalOutput | undefined> {
        return 2;
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