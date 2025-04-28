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

declare global {
    var TTY_DEBUG: boolean;
}
globalThis.TTY_DEBUG = false;

function ttyDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.TTY_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export interface TTYSize {
    columns: number,
    rows: number,
}

export type TTYOnResizeFunc = (size: TTYSize) => Promise<void>;
export interface TTY {
    setRawMode(rawMode: boolean): Promise<void>;
    getRawMode(): Promise<boolean>;
    getSize(): Promise<TTYSize>;
    setSize(size: TTYSize): Promise<void>;
    setOnResize(onResizeFunc: TTYOnResizeFunc): Promise<void>;
}

export class TTYInstance implements TTY {
    constructor(columns: number, rows: number, rawMode: boolean, rawModeListener?: (rawMode: boolean) => Promise<void>) {
        this._columns = columns;
        this._rows = rows;
        this._rawMode = rawMode;
        this._rawModeListener = rawModeListener;
        this.setSize = this.setSizeImpl.bind(this);
        this.getSize = this.getSizeImpl.bind(this);
        this.getRawMode = this.getRawModeImpl.bind(this);
        this.setRawMode = this.setRawModeImpl.bind(this);
        this.setOnResize = this.setOnResizeImpl.bind(this);
    }
    async setRawModeImpl(rawMode: boolean): Promise<void> {
        ttyDebug("TTYInstance set rawMode: ", rawMode);
        if (this._rawModeListener) {
            await this._rawModeListener(rawMode);
        }
        this._rawMode = rawMode;
        return;
    }
    async getRawModeImpl(): Promise<boolean> {
        return this._rawMode;
    }
    async getSizeImpl(): Promise<TTYSize> {
        let size: TTYSize = {
            columns: this._columns,
            rows: this._rows,
        }
        return size;
    }
    async setSizeImpl(size: TTYSize): Promise<void> {
        this._rows = size.rows;
        ttyDebug('setting rows: ', size.rows);
        this._columns = size.columns;
        ttyDebug('setting columns: ', size.columns);
        if (this._onResize) {
            await this._onResize(size);
        }
    }
    async setOnResizeImpl(onResizeFunc: TTYOnResizeFunc): Promise<void> {
        this._onResize = onResizeFunc;
    }
    _columns: number;
    _rows: number;
    _rawMode: boolean;
    _rawModeListener?: (rawMode: boolean) => Promise<void>;
    setSize: (size: TTYSize) => Promise<void>;
    getSize: () => Promise<TTYSize>;
    getRawMode: () => Promise<boolean>;
    setRawMode: (rawMode: boolean) => Promise<void>;
    _onResize?: TTYOnResizeFunc;
    setOnResize: (resizeFunc: TTYOnResizeFunc) => Promise<void>;

}
