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

import esbuild from 'esbuild';
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';

await esbuild.build({
  entryPoints: [
    "src/index.ts",
    "src/entry.ts",
    "src/wasmComponentWorkerThread.ts",
    "src/wasmCoreWorkerThread.ts",
    "src/wasiWorkerThread.ts"
  ],
  bundle: true,
  //outfile: 'dist/index.js',
  outdir: 'dist',
  //outbase: 'src',
  loader: {'.wasm': 'file'},
  sourcemap: true,
  //plugins: [envPlugin],
  plugins: [metaUrlPlugin({emit: true})],
  //plugins: [excludeImportMetaUrl()],
  format: "esm",
  platform: "node",
  external: [
    "node:buffer",
    "node:dns",
    "node:dgram",
    "node:net",
    "node:worker_threads",
    "node:process",
    "node:url",
    "node:vm",
    "crypto",
    "fs/promises",
    "node:path",
    "node:os",
    "node:fs",
    "node:util",
    "node:fs/promises",
    "bun",
  ]
})
