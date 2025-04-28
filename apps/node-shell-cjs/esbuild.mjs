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
import textReplace from 'esbuild-plugin-text-replace';
import { Transform } from 'esbuild-plugin-transform'

let tmpDir = '"/tmp/wasmin-tmp/"';
let tmpDirUrl = `"file://${tmpDir}"`;

let pattern = '__filename'

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

let replacePlugin = textReplace(
  {
    include: /\.js*$/ ,
    pattern:[
          [pattern, tmpDir],
    ]
  }
)

export function rewriteNodeExternal() {
  return {
    name: 'rewriteNodeExternal',
    setup(build) {
      build.onResolve({ filter: /(^crypto$|^buffer$|^stream$|^util$|^url$|^child_process$|^http$|^http2$|^os$|^path$|^fs$|^process$)/ }, (args) => ({
        path: `node:${args.path}`,
        external: true,
      }))
    },
  }
}

let activePlugins = [Transform({
  plugins: [
    rewriteNodeExternal(),
    metaUrlPlugin({emit: true}),
    replacePlugin,
  ]
})];

await esbuild.build({
  entryPoints: [
    "src/index.ts",
    "src/wasmComponentWorkerThreadNode.ts",
    "src/wasmCoreWorkerThreadNode.ts",
    "src/wasiWorkerThreadNode.ts"
  ],
  loader: {'.wasm': 'file'},
  bundle: true,
  outdir: 'dist',
  outbase: 'src',
  sourcemap: true,
  plugins: activePlugins,
  format: "cjs",
  platform: "node",
  external: [
    "bun",
  ]
})
