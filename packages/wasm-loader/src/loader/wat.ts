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

import { debugMessage, WasmLoader } from "./generic.js";
// @ts-ignore
import { compile } from 'wat-compiler';

export class WatLoader implements WasmLoader {
    instantiate(relPath: string): Promise<Uint8Array> {
        const wasmWat = `
        (module
            (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

            (memory $mem 1)
            (export "memory" (memory $mem))

            (data (i32.const 8) "${relPath}\n")

            (func $main
                (i32.store (i32.const 0) (i32.const 8))
                (i32.store (i32.const 4) (i32.const 12))

                (call $fd_write
                    (i32.const 1)
                    (i32.const 0)
                    (i32.const 1)
                    (i32.const 20)
                )
                drop
            )
            (export "_start" (func $main))
        )`
        const wasmBuf = compile(wasmWat);
        // @ts-ignore
        return wasmBuf;
    }
}