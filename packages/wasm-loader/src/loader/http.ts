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

import { debugMessage, WasmLoader } from "./generic.js";

export class HttpLoader implements WasmLoader {

    private isSecure = false;
    constructor(isSecure?: boolean) {
        if (isSecure !== undefined) {
            this.isSecure = isSecure;
        }
    }
    async instantiate(relPath: string): Promise<Uint8Array> {
        debugMessage("HttpLoader: isSecure: ", this.isSecure);
        debugMessage("HttpLoader: relPath: ", relPath);

        const relPathSplits = relPath.split("/");
        let cutOffLength = 0;
        const hostname = relPathSplits[1];
        debugMessage("HttpLoader: hostname: ", hostname);
        cutOffLength = cutOffLength + 1 + hostname.length;
        let port = relPathSplits[2];
        cutOffLength = cutOffLength + 1 + port.length;
        if (port == "") {
            if (this.isSecure) {
                port = "443";
            } else {
                port = "80";
            }
        }

        debugMessage("HttpLoader: port: ", port);

        const requestPath = relPath.substring(cutOffLength);
        debugMessage("HttpLoader: requestPath: ", requestPath);

        let protocol = "http";
        if (this.isSecure) {
            protocol = "https"
        }
        const wasmUrl = `${protocol}://${hostname}:${port}${requestPath}.wasm`;
        debugMessage("getting http url: ", wasmUrl)
        const metaUrl = new URL(wasmUrl);
        const wasmResponse = await fetch(metaUrl);
        const wasmBufArr = await wasmResponse.arrayBuffer();
        const wasmBuf = new Uint8Array(wasmBufArr);
        return wasmBuf;
    }
}
