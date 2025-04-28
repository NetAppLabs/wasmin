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

import { startShell } from "@netapplabs/shell";
import { getAsset, isSea} from 'node:sea';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { setWorkerOverrideUrl } from '@netapplabs/wasi-js';

// File class was added as experimental in node v19.2
import { File } from "node:buffer";

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}

let tmpDir = '/tmp/wasmin-tmp/';
let tmpDirUrl = `file://${tmpDir}`;

export async function copyResourcesToTmp() {
    if (isSea()) {
        let assetsIndex = getAsset("assetsIndex.json");
        let td = new TextDecoder();
        let assetsIndexJson = td.decode(assetsIndex as ArrayBuffer)
        let assetsIndexObj = JSON.parse(assetsIndexJson);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }
        for (let k in assetsIndexObj){
            let asFile = getAsset(k) as ArrayBuffer;
            const fullPath = path.join( tmpDir, k );
            let fileArr = new Uint8Array(asFile);
            fs.writeFileSync(fullPath, fileArr);
        }
        let newWorker1TmpFileUrl = `${tmpDirUrl}/wasmComponentWorkerThreadNode.js`;
        let newWorker2TmpFileUrl = `${tmpDirUrl}/wasmCoreWorkerThreadNode.js`;
        let newWorker3TmpFileUrl = `${tmpDirUrl}/wasiWorkerThreadNode.js`;
        setWorkerOverrideUrl('./wasmComponentWorkerThreadNode.js', newWorker1TmpFileUrl);
        setWorkerOverrideUrl('./wasmCoreWorkerThreadNode.js', newWorker2TmpFileUrl);
        setWorkerOverrideUrl('./wasiWorkerThreadNode.js', newWorker3TmpFileUrl);
    }
}


export async function main() {
	await startShell();
}

(async () => {
    await copyResourcesToTmp();
    await main();
})();
