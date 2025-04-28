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

/*
const res = await fetch('http://127.0.0.1:5001/say-hello/James', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ greeting: 'Hello' }),
});
const t = await res.text();
console.log(t);
*/

import { Process } from "../server/types.js";

const p: Process = {
    cmd: "http://test.com/test.wasm",
    status: "running",
    env: {},
    args: [],
    stdin: "default",
    stdout: "default",
    stderr: "default",
    mounts: {},
    features: {},
};

const res = await fetch("http://127.0.0.1:5001/processes", {
    method: "POST",
    //headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p),
});
const t = await res.text();

console.log(t);
//console.log(body);
