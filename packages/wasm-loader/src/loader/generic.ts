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

import { OciLoader } from './oci.js';
import { LocalLoader } from './local.js';
import { MetaLoader } from './meta.js';
import { HttpLoader } from './http.js';
// @ts-ignore
import compile from 'wat-compiler'


declare global {
    var WASM_LOADER_DEBUG: boolean;
}
globalThis.WASM_LOADER_DEBUG = false;
export function debugMessage(message?: any, ...optionalParams: any[]) {
    if (globalThis.WASM_LOADER_DEBUG) {
        console.log(message, ...optionalParams);
    }
}

export interface WasmLoader {
    instantiate(relPath: string): Promise<Uint8Array>
}