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

import { TextDecoderWrapper } from "./utils.js";

export function clamp_host(i: number, min: number, max: number) {
    if (!Number.isInteger(i)) throw new TypeError(`must be an integer`);
    if (i < min || i > max) throw new RangeError(`must be between ${min} and ${max}`);
    return i;
}

let DATA_VIEW = new DataView(new ArrayBuffer(0));

export function data_view(mem: WebAssembly.Memory) {
    if (DATA_VIEW.buffer !== mem.buffer) DATA_VIEW = new DataView(mem.buffer);
    return DATA_VIEW;
}
export const UTF8_DECODER = new TextDecoderWrapper("utf-8");

const UTF8_ENCODER = new TextEncoder();

export type realloc_func = (old_ptr: number, old_len: number, align: number, new_len: number) => Promise<number>;

export async function utf8_encode(
    s: string,
    realloc: realloc_func,
    memory: any
) {
    if (typeof s !== "string") throw new TypeError("expected a string");

    if (s.length === 0) {
        UTF8_ENCODED_LEN = 0;
        return 1;
    }

    let alloc_len = 0;
    let ptr = 0;
    let writtenTotal = 0;
    while (s.length > 0) {
        ptr = await realloc(ptr, alloc_len, 1, alloc_len + s.length);
        alloc_len += s.length;
        const { read, written } = UTF8_ENCODER.encodeInto(
            s,
            new Uint8Array(memory.buffer, ptr + writtenTotal, alloc_len - writtenTotal)
        );
        writtenTotal += written || 0;
        s = s.slice(read);
    }
    if (alloc_len > writtenTotal) ptr = await realloc(ptr, alloc_len, 1, writtenTotal);
    UTF8_ENCODED_LEN = writtenTotal;
    return ptr;
}
export let UTF8_ENCODED_LEN = 0;
