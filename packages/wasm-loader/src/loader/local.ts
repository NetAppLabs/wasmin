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

import { WasmLoader, debugMessage } from "./generic.js";

export class LocalLoader implements WasmLoader {
    async instantiate(relPath: string): Promise<Uint8Array> {
        debugMessage("LocalLoader: relPath: ", relPath);
        const functionsPrefixDir = "/src/functions";
        const curDir = process.cwd();

        const wasmUrl = "file://localhost" + curDir + functionsPrefixDir + relPath + ".wasm";
        debugMessage("LocalLoader: wasmUrl: ", wasmUrl);
        const fsUrl = new URL(wasmUrl);

        debugMessage("LocalLoader fsUrl: ", fsUrl);
        let _fs = await import("fs/promises");
        const wasmBufArr = await _fs.readFile(fsUrl);
        const wasmBuf = new Uint8Array(wasmBufArr);
        return wasmBuf;
    }
}
