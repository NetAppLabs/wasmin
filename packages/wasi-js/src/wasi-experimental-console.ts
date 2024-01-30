import { clamp_host } from "./intrinsics.js";
import { TTY } from "./tty.js";
import { WasiEnv } from "./wasi.js";
import { wasiDebug } from "./wasiUtils.js";

export function addWasiExperimentalConsoleToImports(imports: any, obj: WasiExperimentalConsole) {
    if (!("wasi-experimental-console" in imports)) imports["wasi-experimental-console"] = {};
    imports["wasi-experimental-console"]["term-get-columns"] = async function () {
        const ret = await obj.termGetColumns();
        return clamp_host(ret, 0, 4294967295);
    };
    imports["wasi-experimental-console"]["term-get-rows"] = async function () {
        const ret = await obj.termGetRows();
        return clamp_host(ret, 0, 4294967295);
    };
    imports["wasi-experimental-console"]["term-set-raw-mode"] = async function (arg0: number) {
        const ret = await obj.termSetRawMode(arg0 >>> 0);
        return clamp_host(ret, 0, 4294967295);
    };
    imports["wasi-experimental-console"]["term-get-raw-mode"] = async function () {
        const ret = await obj.termGetRawMode();
        return clamp_host(ret, 0, 4294967295);
    };
}

export interface WasiExperimentalConsole {
    termGetColumns(): Promise<number>;
    termGetRows(): Promise<number>;
    termSetRawMode(mode: number): Promise<number>;
    termGetRawMode(): Promise<number>;
}

class WasiExperimentalConsoleHost implements WasiExperimentalConsole {
    constructor(tty: TTY) {
        this._tty = tty;
    }
    private _tty: TTY;
    async termGetColumns(): Promise<number> {
        let size = await this._tty.getSize();
        return size.columns;
    }
    async termGetRows(): Promise<number> {
        let size = await this._tty.getSize();
        return size.rows;
    }
    async termSetRawMode(mode: number): Promise<number> {
        wasiDebug(`termSetRawMode mode: ${mode}`);
        if (mode == 1) {
            if (this._tty) {
                const rawMode = true;
                await this._tty.setRawMode(rawMode);
            }
        } else if (mode == 0) {
            if (this._tty) {
                const rawMode = false;
                await this._tty.setRawMode(rawMode);
            }
        }
        return 0;
    }
    async termGetRawMode(): Promise<number> {
        if (this._tty) {
            if (this._tty) {
                const rawMode = await this._tty.getRawMode();
                if (rawMode) {
                    return 1;
                }
            }
        }
        return 0;
    }
}

export function initializeWasiExperimentalConsoleToImports(imports: any, tty: TTY) {
    const wHost = new WasiExperimentalConsoleHost(tty);
    addWasiExperimentalConsoleToImports(imports, wHost);
}
