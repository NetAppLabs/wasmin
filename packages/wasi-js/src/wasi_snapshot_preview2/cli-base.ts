import { CliBaseEnvironmentNamespace as clibe } from "@wasm-env/wasi-snapshot-preview2";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";
type CliBaseEnvironmentAsync = clibe.CliBaseEnvironmentAsync;
import { CliBaseExitNamespace as clib } from "@wasm-env/wasi-snapshot-preview2";
import { ExitStatus } from "../wasiUtils.js";
type Result<T, E> = clib.Result<T, E>;
import { CliBasePreopensNamespace as clibp } from "@wasm-env/wasi-snapshot-preview2";
import { CliBasePreopensAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-preopens";
import { FIRST_PREOPEN_FD } from "../wasiFileSystem.js";
import { wasiError } from "../wasiUtils.js";
type Descriptor = clibp.Descriptor;
import { CliBaseStderrNamespace } from "@wasm-env/wasi-snapshot-preview2";
import { CliBaseStderrAsync, OutputStream } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-stderr";
import { CliBaseStdinNamespace } from "@wasm-env/wasi-snapshot-preview2";
import { CliBaseStdinAsync, InputStream } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-stdin";
import { CliBaseStdoutNamespace } from "@wasm-env/wasi-snapshot-preview2";
//import { CliBaseStdoutAsync, OutputStream } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-Stdout";
import { CliBaseStdoutAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-Stdout";

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
}

export class CliBaseExitAsyncHost implements clib.CliBaseExitAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async exit(status: Result<void, void>): Promise<void> {
        let rval = 0;
        if (status.tag == "ok") {
            rval = 0;
            console.log("CliBaseExitAsyncHost exit ok: ", status.val);
        } else if (status.tag == "err") {
            console.log("CliBaseExitAsyncHost exit err: ", status.val);
            // TODO: figure out correct handling for status.val
            rval = Number(status.val);
        }
        throw new ExitStatus(rval);
    }
}

export class CliBasePreopensAsyncHost implements CliBasePreopensAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getDirectories(): Promise<[Descriptor, string][]> {
        const preopens: [Descriptor, string][] = [];
        const preopen_fd = FIRST_PREOPEN_FD;
        try {
            for (let i = preopen_fd; i++; true) {
                const openDir = this._wasiEnv.openFiles.getPreOpen(preopen_fd);
                const path = openDir.path;
                preopens.push([preopen_fd, path]);
            }
        } catch (err: any) {
            wasiError("getDirectories: err: ", err);
        }
        return preopens;
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
