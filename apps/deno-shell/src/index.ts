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


import staticFiles from "./embed/static/dir.ts"

import * as fsSync from "node:fs";
import {promises as fs} from "node:fs";
import path from "node:path";

function debugMessage(...args: any[]) {
    if (globalThis.SHELL_DEBUG) {
        console.debug(...args);
    }
}

const tmpDir = "/tmp/wasmin-deno-tmp";

if (!fsSync.existsSync(tmpDir)) {
    await fs.mkdir(tmpDir);
}

let fileList = staticFiles.list();
for (const fileName of fileList) {
    debugMessage(`Writing static file: ${fileName} to dir ${tmpDir}`);

    let file = await staticFiles.load(fileName);
    let fileConents = await file.bytes();
    let filePath = path.join(tmpDir, fileName);

    await fs.writeFile(filePath, fileConents);
}

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}

const mainentry = await import("../dist/entry.js");

(async () => {
    await mainentry.main();
})();
