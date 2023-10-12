import { CliBaseEnvironmentNamespace as clibe } from "@wasmin/wasi-snapshot-preview2";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
type CliBaseEnvironmentAsync = clibe.WasiCliEnvironmentAsync;
import { CliBaseExitNamespace as clib } from "@wasmin/wasi-snapshot-preview2";
import { ExitStatus } from "../../wasiUtils.js";
type Result<T, E> = clib.Result<T, E>;
import { wasiError } from "../../wasiUtils.js";
import { CliBaseStderrNamespace as clibsderrns } from "@wasmin/wasi-snapshot-preview2";
type CliBaseStderrAsync = clibsderrns.WasiCliStderrAsync;
type OutputStream = clibsderrns.OutputStream;
import { CliBaseStdinNamespace as clibsdinns } from "@wasmin/wasi-snapshot-preview2";
type CliBaseStdinAsync = clibsdinns.WasiCliStdinAsync;
type InputStream = clibsdinns.InputStream;
import { CliBaseStdoutNamespace as clibsdoutns } from "@wasmin/wasi-snapshot-preview2";
import { wasiPreview2Debug } from "./preview2Utils.js";
type CliBaseStdoutAsync = clibsdoutns.WasiCliStdoutAsync;

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

export class CliBaseExitAsyncHost implements clib.WasiCliExitAsync {
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
        //TODO: synchronize stderr numbering in openFiles
        const stderr_fd_no = 2;
        return stderr_fd_no;
    }
}

export class CliBaseStdinAsyncHost implements CliBaseStdinAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getStdin(): Promise<InputStream> {
        //TODO: synchronize stdin numbering in openFiles
        const stdin_fd_no = 0;
        return stdin_fd_no;
    }
}

export class CliBaseStdoutAsyncHost implements CliBaseStdoutAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getStdout(): Promise<OutputStream> {
        //TODO: synchronize stdin numbering in openFiles
        const stdout_fd_no = 1;
        return stdout_fd_no;
    }
}
