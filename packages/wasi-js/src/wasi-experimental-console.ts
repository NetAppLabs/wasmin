import { clamp_host } from "./intrinsics.js";
import { TTY } from "./tty.js";
import { WasiEnv } from "./wasi.js";
import { wasiDebug } from "./wasiUtils.js";

export function addWasiExperimentalConsoleToImports(imports: any, obj: WasiExperimentalConsole) {
    if (!("wasi-experimental-console" in imports)) imports["wasi-experimental-console"] = {};
    imports["wasi-experimental-console"]["term-get-columns"] = function () {
        const ret = obj.termGetColumns();
        return clamp_host(ret, 0, 4294967295);
    };
    imports["wasi-experimental-console"]["term-get-rows"] = function () {
        const ret = obj.termGetRows();
        return clamp_host(ret, 0, 4294967295);
    };
    imports["wasi-experimental-console"]["term-set-raw-mode"] = function (arg0: number) {
        const ret = obj.termSetRawMode(arg0 >>> 0);
        return clamp_host(ret, 0, 4294967295);
    };
    imports["wasi-experimental-console"]["term-get-raw-mode"] = function () {
        const ret = obj.termGetRawMode();
        return clamp_host(ret, 0, 4294967295);
    };
}

export interface WasiExperimentalConsole {
    termGetColumns(): number;
    termGetRows(): number;
    termSetRawMode(mode: number): number;
    termGetRawMode(): number;
}

class WasiExperimentalConsoleHost implements WasiExperimentalConsole {
    constructor(tty: TTY) {
        this._tty = tty;
    }
    private _tty: TTY;
    termGetColumns(): number {
        return this._tty.columns;
    }
    termGetRows(): number {
        return this._tty.rows;
    }
    termSetRawMode(mode: number): number {
        wasiDebug(`termSetRawMode mode: ${mode}`);
        if (mode == 1) {
            if (this._tty) {
                this._tty.rawMode = true;
            }
        } else if (mode == 0) {
            if (this._tty) {
                this._tty.rawMode = false;
            }
        }
        return 0;
    }
    termGetRawMode(): number {
        if (this._tty) {
            if (this._tty.rawMode) {
                return 1;
            }
        }
        return 0;
    }
}

export function initializeWasiExperimentalConsoleToImports(imports: any, tty: TTY) {
    const wHost = new WasiExperimentalConsoleHost(tty);
    addWasiExperimentalConsoleToImports(imports, wHost);
}