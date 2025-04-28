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
import { denofh as denofs } from "@netapplabs/deno-fs-js";
import { setWorkerOverrideUrl } from '@netapplabs/wasi-js';

export async function main() {

    setWorkerOverrideUrl('./wasmComponentWorkerThread.js', import.meta.resolve("./wasmComponentWorkerThread.js"));
    setWorkerOverrideUrl('./wasmCoreWorkerThread.js', import.meta.resolve("./wasmCoreWorkerThread.js"));
    setWorkerOverrideUrl('./wasiWorkerThread.js', import.meta.resolve("./wasiWorkerThread.js"));

    await startShell(denofs);
}

// @ts-ignore
if (import.meta.main)  {
    (async () => {
        await main();
    })();
}
