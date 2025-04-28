#!/bin/bash
# Copyright 2025 NetApp Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0


rm -f component/nfs_rs.*
rm -rf component/interfaces

echo "jco being used: `npx which jco`"
echo "jco version: `npx jco --version`"
npx jco transpile nfs_rs.wasm -o component -I --no-wasi-shim

if `git status | grep -q "modified:   component/interfaces/wasi-io-streams.d.ts"`; then
    echo "detected locally modified component/interfaces/wasi-io-streams.d.ts"
    echo "-- checking for jco transpile silliness"
    echo "--- a/packages/nfs-js/component/interfaces/wasi-io-streams.d.ts
+++ b/packages/nfs-js/component/interfaces/wasi-io-streams.d.ts
@@ -15,11 +15,6 @@ export interface StreamErrorClosed {
 import type { Pollable } from '../interfaces/wasi-io-poll.js';
 export { Pollable };
 
-export class InputStream {
-  blockingRead(len: bigint): Uint8Array;
-  subscribe(): Pollable;
-}
-
 export class OutputStream {
   checkWrite(): bigint;
   write(contents: Uint8Array): void;
@@ -27,3 +22,8 @@ export class OutputStream {
   blockingFlush(): void;
   subscribe(): Pollable;
 }
+
+export class InputStream {
+  blockingRead(len: bigint): Uint8Array;
+  subscribe(): Pollable;
+}" > silly.diff
    git diff component/interfaces/wasi-io-streams.d.ts | tail -n +3 > wasi-io-streams.diff
    if `diff -q wasi-io-streams.diff silly.diff &> /dev/null`; then
        echo "-- jco transpile silliness detected"
        echo "-- reverting component/interfaces/wasi-io-streams.d.ts"
        echo "git checkout component/interfaces/wasi-io-streams.d.ts"
        git checkout component/interfaces/wasi-io-streams.d.ts
    fi
    rm wasi-io-streams.diff silly.diff
fi

npm run ts --prefix .
