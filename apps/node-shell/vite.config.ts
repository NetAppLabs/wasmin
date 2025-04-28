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

import { defineConfig } from "vite";

export default defineConfig({
    build: {
        target: "esnext",
        lib: {
            entry: "src/index.ts",
            name: "@netapplabs/node-shell",
        },
        rollupOptions: {
            external: [
                "node:fs",
                "node:path",
                "node",
                "node:fs:promises",
                "node:crypto",
                "stream",
                "node:stream",
                "http",
                "https",
                "node:util",
                "node:buffer",
                "node:dns",
                "node:net",
                "node:url",
                "node:module",
                "node:worker_threads",
                "node:console",
            ],
            output: {
                globals: {
                    fs: "fs",
                    path: "path",
                    node: "node",
                    "node:fs": "fs",
                    "node:path": "path",
                    "node:stream": "stream",
                    "node:dns": "dns",
                    "node:net": "net",
                    "node:buffer": "buffer",
                    "node:util": "util",
                    "node:crypto": "crypto",
                    "node:url": "url",
                    "node:worker_threads": "worker_threads",
                },
            },
        },
    },
});
