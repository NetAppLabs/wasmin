/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { clamp_host } from "./intrinsics.js";
import { TTY } from "./tty.js";
import { WasiEnv } from "./wasi.js";

export function addWasiExperimentalConsoleToImports(importNs: string, imports: any, obj: WasiExperimentalConsole) {
    if (!(importNs in imports)) imports[importNs] = {};
    let term_get_columns_func = async function () {
        const ret = await obj.termGetColumns();
        return clamp_host(ret, 0, 4294967295);
    };
    imports[importNs]["term_get_columns"] = term_get_columns_func;
    imports[importNs]["term-get-columns"] = term_get_columns_func;
    let term_get_rows_func = async function () {
        const ret = await obj.termGetRows();
        return clamp_host(ret, 0, 4294967295);
    };
    imports[importNs]["term_get_rows"] = term_get_rows_func;
    imports[importNs]["term-get-rows"] = term_get_rows_func;
    let term_set_raw_mode_func = async function (arg0: number) {
        const ret = await obj.termSetRawMode(arg0 >>> 0);
        return clamp_host(ret, 0, 4294967295);
    };
    imports[importNs]["term_set_raw_mode"] = term_set_raw_mode_func;
    imports[importNs]["term-set-raw-mode"] = term_set_raw_mode_func;
    let term_get_raw_mode_func = async function () {
        const ret = await obj.termGetRawMode();
        return clamp_host(ret, 0, 4294967295);
    };
    imports[importNs]["term_get_raw_mode"] = term_get_raw_mode_func;
    imports[importNs]["term-get-raw-mode"] = term_get_raw_mode_func;
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
    let experimentalConsoleImportNs = "wasi_experimental_console";
    addWasiExperimentalConsoleToImports(experimentalConsoleImportNs, imports, wHost);
    let wasiPreview1Ns = "wasi_snapshot_preview1";
    addWasiExperimentalConsoleToImports(wasiPreview1Ns, imports, wHost);

}
