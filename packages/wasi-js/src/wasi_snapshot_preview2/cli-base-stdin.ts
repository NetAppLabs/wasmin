import { CliBaseStdinNamespace } from "@wasm-env/wasi-snapshot-preview2";
import { CliBaseStdinAsync, InputStream } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-stdin";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";

export class CliBaseStdinAsyncHost implements CliBaseStdinAsync{
    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async getStdin(): Promise<InputStream> {
        //TODO: synchronize stdin numbering in openFiles
        const stdin_fd_no = 0;
        return stdin_fd_no;
    }

}