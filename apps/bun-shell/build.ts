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

import type { BunPlugin, PluginBuilder } from "bun";
import { constants } from "bun:sqlite";

const myPlugin: BunPlugin = {
  name: "Custom loader",
  setup(builder: PluginBuilder) {
    builder.onLoad({ filter: /^hello:world$/ }, (args) => {
      console.log("onload hello: ", args);
      return { exports: { foo: "bar" }, loader: "object" };
    });
    builder.onResolve({ filter: /^wasm$/ }, (args) => {
      console.log("resolved wasm: ", args);
      return { path: "/tmp/woah.wasm" };
    });
   //  console.log("build: ", build);
    // implementation
  },
};

let output = await Bun.build({
  entrypoints: [
    "./src/index.ts",
    "./src/wasmComponentWorkerThread.ts",
    "./src/wasmCoreWorkerThread.ts",
    "./src/wasiWorkerThread.ts"
  ],
  outdir: "./dist",
  //plugins: [myPlugin],
  root: "./src",
  //splitting: true,
  target: "bun",
  //splitting: false,
  //minify: true,
  sourcemap: 'external',
});

console.log(output);
