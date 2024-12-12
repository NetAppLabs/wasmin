import { CliBaseEnvironmentNamespace as clibe } from "@netapplabs/wasi-snapshot-preview2/async";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
type CliBaseEnvironmentAsync = clibe.WasiCliEnvironment;
import { CliBaseExitNamespace as clib } from "@netapplabs/wasi-snapshot-preview2/async";
import { ExitStatus } from "../../wasiPreview1Utils.js";
type Result<T, E> = clib.Result<T, E>;
import { wasiError } from "../../wasiDebug.js";
import { CliBaseStderrNamespace as clibsderrns } from "@netapplabs/wasi-snapshot-preview2/async";
type CliBaseStderrAsync = clibsderrns.WasiCliStderr;
type OutputStream = clibsderrns.OutputStream;
import { CliBaseStdinNamespace as clibsdinns } from "@netapplabs/wasi-snapshot-preview2/async";
type CliBaseStdinAsync = clibsdinns.WasiCliStdin;
type InputStream = clibsdinns.InputStream;
import { CliBaseStdoutNamespace as clibsdoutns } from "@netapplabs/wasi-snapshot-preview2/async";
import { wasiPreview2Debug } from "../../wasiDebug.js";
import { InStream, OutStream } from "./io.js";
type CliBaseStdoutAsync = clibsdoutns.WasiCliStdout;

export class CliBaseEnvironmentAsyncHost implements CliBaseEnvironmentAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getEnvironment(): Promise<[string, string][]> {
        const retEnv: [string, string][] = [];
        for (const [key, val] of Object.entries(this._wasiEnv.env)) {
            retEnv.push([key, val]);
        }
        return retEnv;
    }
    async getArguments(): Promise<string[]> {
        return this._wasiEnv.args;
    }

    async initialCwd(): Promise<string | undefined> {
        return ".";
    }

}

export class CliBaseExitAsyncHost implements clib.WasiCliExit {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async exit(status: Result<any, any>): Promise<void> {
        let rval = 0;
        if (status.tag == "ok") {
            rval = 0;
            wasiPreview2Debug("CliBaseExitAsyncHost exit ok: ", status.val);
        } else if (status.tag == "err") {
            if (status.val) {
                wasiPreview2Debug("CliBaseExitAsyncHost exit err: ", status.val);
                // TODO: figure out correct handling for status.val
                rval = Number(status.val);
            } else {
                rval = 1;
            }
        }
        throw new ExitStatus(rval);
    }
}
export class CliBaseStderrAsyncHost implements CliBaseStderrAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getStderr(): Promise<OutputStream> {
        wasiPreview2Debug("CliBaseStderrAsyncHost getStderr");
        //TODO: synchronize stderr numbering in openFiles
        const stderr_fd_no = 2;
        const closeFdOnStreamClose = false;
        const stderr = new OutStream(this._wasiEnv, stderr_fd_no, closeFdOnStreamClose);
        return stderr;
    }
}

export class CliBaseStdinAsyncHost implements CliBaseStdinAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getStdin(): Promise<InputStream> {
        wasiPreview2Debug("CliBaseStderrAsyncHost getStdin");
        //TODO: synchronize stdin numbering in openFiles
        const stdin_fd_no = 0;
        const closeFdOnStreamClose = false;
        const stdin = new InStream(this._wasiEnv, stdin_fd_no, closeFdOnStreamClose);
        return stdin;
    }
}

export class CliBaseStdoutAsyncHost implements CliBaseStdoutAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getStdout(): Promise<OutputStream> {
        wasiPreview2Debug("CliBaseStderrAsyncHost getStdout");
        //TODO: synchronize stdin numbering in openFiles
        const stdout_fd_no = 1;
        const closeFdOnStreamClose = false;
        const stdout = new OutStream(this._wasiEnv, stdout_fd_no, closeFdOnStreamClose);
        return stdout;
    }
}
