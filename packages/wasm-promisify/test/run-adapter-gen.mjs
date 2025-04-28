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


import { promisifyWebAssemblyExports, promisifyImportObject } from "./dist/index.js";
import { WasiImpl, instantiatePromisified } from "./dist/index.js";
import { testConstructProxyModule, testConstructAdapterModule } from "./dist/wasmgen.js";

const isNode = typeof process !== "undefined" && process.versions && process.versions.node;

async function fetchOrReadFile(url) {
  if (isNode) {
    const metaUrl = new URL(url, import.meta.url);
    let _fs = await import("fs/promises");
    return await _fs.readFile(metaUrl);
  }
  return await fetch(url);
}

async function writeFile(path, buf) {
  if (isNode) {
    let _fs = await import("fs/promises");
    return await _fs.writeFile(path, buf);
  }
}

const wasi = new WasiImpl();

const bytesMainModule = await (await fetchOrReadFile('./greeting.wasm')).buffer
const mainModule = await WebAssembly.compile(bytesMainModule);
const importsObj = wasi.imports();
const promInstance = await instantiatePromisified(mainModule, importsObj);

const p = await wasi.start(promInstance)