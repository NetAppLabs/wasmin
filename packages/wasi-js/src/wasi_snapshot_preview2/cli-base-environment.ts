import { CliBaseEnvironmentNamespace as clibe } from "@wasm-env/wasi-snapshot-preview2";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi";
type CliBaseEnvironmentAsync = clibe.CliBaseEnvironmentAsync;

export class CliBaseEnvironmentAsyncHost implements CliBaseEnvironmentAsync {
    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async getEnvironment(): Promise<[string, string][]> {
        let retEnv: [string,string][] = [];
        for (const [key,val] of Object.entries(this._wasiEnv.env)) {
            retEnv.push([key,val]);
        }
        return retEnv;
    }
    async getArguments(): Promise<string[]> {
        return this._wasiEnv.args;
    }

}