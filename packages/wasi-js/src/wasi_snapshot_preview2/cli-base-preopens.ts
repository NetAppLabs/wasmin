import { CliBasePreopensNamespace as clibp } from "@wasm-env/wasi-snapshot-preview2";
import { CliBasePreopensAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-preopens";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";
import { FIRST_PREOPEN_FD } from "../wasiFileSystem.js";
type Descriptor = clibp.Descriptor


export function getDirectories(): [Descriptor, string][]{
    console.log("getDirectories");
    const desc: Descriptor = 0;
    const strs = "/";
    const ret: [Descriptor, string][] = [[
        desc,
        strs
    ]];
    return ret;
}

export class CliBasePreopensAsyncHost implements CliBasePreopensAsync {
    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async getDirectories(): Promise<[Descriptor, string][]> {
        let preopens: [Descriptor, string][] = [];
        let preopen_fd = FIRST_PREOPEN_FD;
        try {
            for (let i = preopen_fd; i++; true){
                const openDir = this._wasiEnv.openFiles.getPreOpen(preopen_fd);
                const path = openDir.path;
                preopens.push([preopen_fd, path]);
            }
        } catch(err: any){
            console.log("getDirectories: err: ", err);
        }
        return preopens;
    }
}