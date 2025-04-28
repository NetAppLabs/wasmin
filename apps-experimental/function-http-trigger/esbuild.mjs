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

import { build } from 'esbuild';
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';

let activePlugins = [
    metaUrlPlugin({emit: true}),
];

await build({
  entryPoints: [
    'src/functions/trigger.ts',
    'src/functions/wasiWorkerThreadNode.ts',
    'src/functions/wasmCoreWorkerThreadNode.ts',
    'src/functions/wasmComponentWorkerThreadNode.ts',
  ],
  format: 'esm',
  splitting: false,
  minify: false,
  bundle: true,
  platform: 'node',
  target: 'node20',
  sourcemap: false,
  //watch: false,
  outdir: 'dist/functions',
  plugins: activePlugins,
  //outExtension: { '.js' : '.mjs' },
  // external: [
  //   "@azure/functions",
  //   "@azure/storage-queue",
  // ],
  external: [
     "@azure/functions-core",
  ],
  banner:{
    js: `
    import { Buffer } from 'node:buffer';
    import { fileURLToPath } from 'node:url';
    import { createRequire as topLevelCreateRequire } from 'node:module';
    const require = topLevelCreateRequire(import.meta.url);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    `
  }
});
