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

import { appendToUint8Array, copyUint8Array } from "./utils.js";
import { Peekable, Readable, Writable } from "./wasiFileSystem.js";
import { sleep } from "./utils.js";
import { wasiPipesDebug } from "./wasiDebug.js"

const textEncoder = new TextEncoder();


export class BufferedPipe implements Readable, Writable, Peekable {
    _chunksQueue: Array<Uint8Array> = [];
    retriesOnPeek: number = 1;
    read: (len: number) => Promise<Uint8Array>;
    peek: () => Promise<number>;
    constructor(retriesOnPeek?: number) {
        if (retriesOnPeek !== undefined) {
            this.retriesOnPeek = retriesOnPeek;
        }
        this.read = this.readFunc.bind(this);
        this.peek = this.peekFunc.bind(this);
    }
    async write(data: Uint8Array): Promise<void> {
        let copiedData = copyUint8Array(data);
        let dataLen = copiedData.byteLength;
        wasiPipesDebug(`write: dataLen: ${dataLen} data: `, copiedData);
        this._chunksQueue.push(copiedData);
    }
    get firstbuf(): Uint8Array | undefined {
        let chunk = this._chunksQueue.shift();
        if (chunk !== undefined) {
            wasiPipesDebug(`firstbuf: returning chunk: `, chunk);
        }
        return chunk;
    }

    // Returns the number of bytes available if any
    async peekFunc(): Promise<number> {
        let trynum = 0;
        let tries = this.retriesOnPeek;
        while (trynum <= tries) {
            const buf = this._chunksQueue.at(0);
            if (buf) {
                wasiPipesDebug(`peekFunc: got buf: `, buf);
                if (buf.byteLength > 0) {
                    return buf.byteLength;
                }
            }
            if (this.retriesOnPeek != 0) {
                await sleep(1);
            }
            trynum ++;
        }
        return 0;
    }

    // Reads at maximum len number of bytes from buffer 
    async readFunc(len: number): Promise<Uint8Array> {
        return await this.readRecurseFunc(len, false);
    }

    // Reads recurively
    async readRecurseFunc(len: number, isRecursing?: boolean): Promise<Uint8Array> {
        if (len > 0) {
            const buf = this.firstbuf;
            if (buf) {
                const databufferLen = buf.byteLength;
                let chunksQueueLength = this._chunksQueue.length;
                wasiPipesDebug(`readRecurseFunc: databufferLen: ${databufferLen} , len: ${len} chunksQueueLength: ${chunksQueueLength}`);
                wasiPipesDebug(`readRecurseFunc: this._chunksQueue: `, this._chunksQueue);
                if (databufferLen > 0) {
                    if (len < databufferLen) {
                        const retChunks = buf.subarray(0, len);
                        const leftChunks = buf.subarray(len);
                        // insert back the remains of the chunk
                        wasiPipesDebug(`readRecurseFunc: unshift: `, leftChunks);
                        this._chunksQueue.unshift(leftChunks);
                        return retChunks;
                    } if (len == databufferLen) {
                        const retChunks = buf;
                        return retChunks;
                    } else {
                        // len > databufferLen
                        const firstChunk = buf;
                        const restLen = len - databufferLen;
                        // try read remaining of len and append it
                        const nextChunk = await this.readRecurseFunc(restLen, true);
                        const retChunks = appendToUint8Array(firstChunk, nextChunk);
                        wasiPipesDebug(`readRecurseFunc: databufferLen: ${databufferLen} , len: ${len} chunksQueueLength: ${chunksQueueLength} retChunks:`, retChunks);
                        return retChunks;
                    }
                }
            }
        }
        if (!isRecursing) {
            // sleep here to avoid blocking
            // because sometimes read is called in a loop
            await sleep(1);
        }
        return new Uint8Array(0);
    }

    // Callback to add data to buffer
    ondataArray(data: Uint8Array): void {
        let dataLen = data.byteLength;
        wasiPipesDebug(`ondataArray: dataLen: ${dataLen} data: `, data);
        this._chunksQueue.push(data);
    }
    // Callback to add data to buffer
    ondata(sbdata: Uint8Array|string): void {
        if (isString(sbdata)) {
            let sdata = sbdata as string;
            return this.ondataString(sdata);
        } else {
            let data = sbdata as Uint8Array;
            return this.ondataArray(data);
        }
    }

    // Callback to add string data to buffer
    ondataString(sdata: string): void {
        const data = textEncoder.encode(sdata);
        this.ondataArray(data);
    }
}

function isString(input: any) {  
    return typeof input === 'string' && Object.prototype.toString.call(input) === '[object String]'
}
