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

import * as comlink from "comlink";
import { wasiWorkerDebug, wasiWorkerSerializeDebug, wasmWorkerClientDebug } from "./wasiDebug.js";
import { isDeno } from "./utils.js";

declare global {
    var WASMIN_WORKER_OVERRIDE_URLS: any;
}

export function getWorkerOverrideUrls(): Record<string,string|URL> {
    if (!globalThis.WASMIN_WORKER_OVERRIDE_URLS) {
        globalThis.WASMIN_WORKER_OVERRIDE_URLS = {};
    }
    return globalThis.WASMIN_WORKER_OVERRIDE_URLS;
 }


export function getWorkerUrl(workerUrlString: string): URL | string {
    const workerOverrideUrls = getWorkerOverrideUrls();
    wasmWorkerClientDebug(`getWorkerUrl workerOverrideUrls: `, workerOverrideUrls);
    const overrideUrl = workerOverrideUrls[workerUrlString];
    let workerUrl: URL;
    if (overrideUrl !== undefined) {
        if (overrideUrl instanceof URL) {
            workerUrl = overrideUrl;
        } else {
            workerUrl = new URL(overrideUrl);
        }
        wasmWorkerClientDebug(`getWorkerUrl got overrided url ${overrideUrl} for ${workerUrl}`);
        return workerUrl;
    } else {
        let workerUrl = new URL(workerUrlString, import.meta.url);
        wasmWorkerClientDebug(`getWorkerUrl workerUrlString: ${workerUrlString} url:`, workerUrl);
        return workerUrl;
    }
}

export function setWorkerOverrideUrl(workerUrlString: string, workerOverrideUrlString: string|URL) {
    wasmWorkerClientDebug(`setWorkerOverrideUrl set overrided url ${workerOverrideUrlString} for ${workerUrlString}`);
    const workerOverrideUrls = getWorkerOverrideUrls();
    workerOverrideUrls[workerUrlString] = workerOverrideUrlString;
}

export async function getWasmModuleSource(urlOrPath: string): Promise<ArrayBuffer> {
    let url;
    try {
        url = urlOrPath;
        try {
            url = new URL(urlOrPath);
        } catch (err: any) {
            wasiWorkerDebug("trying url: failed to parse url: ", urlOrPath);
        }
        wasiWorkerDebug("trying fetch: on url: ", url);
        const res = await fetch(url);
        const data = await res.arrayBuffer();
        return data;
    } catch (err: any) {
        wasiWorkerDebug("getWasmModuleSource failed to get url: ", err);
        const promises = await import("node:fs/promises");
        // cut off querystring if any
        if (urlOrPath.includes("?")) {
            let splits = urlOrPath.split("?");
            urlOrPath = splits[0];
        }
        const wasmBuf = await promises.readFile(urlOrPath);
        const wasmArrayBuffer = wasmBuf.buffer;
        return wasmArrayBuffer as ArrayBuffer;
    }
}

export async function getWasmModule(moduleUrl: string) {
    const wasmBuf = await getWasmModuleSource(moduleUrl);
    const mod = await WebAssembly.compile(wasmBuf);
    return mod;
}

export async function getWasmModuleAndBuffer(moduleUrl: string): Promise<{wasmMod: WebAssembly.Module, wasmBuf: ArrayBuffer}> {
    const wasmBuf = await getWasmModuleSource(moduleUrl);
    const wasmMod = await WebAssembly.compile(wasmBuf);
    return { wasmMod, wasmBuf };
}

export async function getWasmBuffer(moduleUrl: string): Promise<{wasmBuf: ArrayBuffer}> {
    const wasmBuf = await getWasmModuleSource(moduleUrl);
    return { wasmBuf };
}

export function initializeComlinkHandlers() {
    /*comlink.transferHandlers.set("FUNC", {
        canHandle: function (value: unknown): value is Function {
            wasiWorkerDebug("FUNC.canHandle on obj: ", value);
            //return value instanceof Function;
            return isFunction(value);
        },
        serialize: (obj) => {
            wasiWorkerDebug("FUNC.serialize on obj: ", obj);
            const ret = serializeFunction(obj);
            return ret as any;
        },
        deserialize: (port) => {
            wasiWorkerDebug("FUNC.deserialize on port: ", port);
            return deserializeFunction(port);
        },
    });*/

    const objectTransferHandler: comlink.TransferHandler<Object, MessagePort | Object | undefined> = {
        canHandle: function (value: Object): value is Object {
            wasiWorkerSerializeDebug("OBJECT.canHandle on obj: ", value);
            return shouldHandleObject(value);
        },
        serialize: function (obj: Object): [MessagePort | Object | undefined, Transferable[]] {
            wasiWorkerSerializeDebug("OBJECT.serialize on obj: ", obj);
            // eslint-disable-next-line prefer-const
            let [serObj, transferrable] = serializeObject(obj);
            wasiWorkerSerializeDebug("OBJECT.serialize(): serObj: ", serObj);
            if (!transferrable) {
                transferrable = new Array<Transferable>();
            }
            wasiWorkerSerializeDebug("OBJECT.serialize(): transferrable ", transferrable);
            return [serObj, transferrable];
        },
        deserialize: function (obj: MessagePort | Object): Object {
            wasiWorkerSerializeDebug("OBJECT.deserialize on obj: ", obj);
            return deserializeObject(obj as Object);
        },
    };

    comlink.transferHandlers.set("OBJECT", objectTransferHandler);
}

function shouldHandleObject(value: any) {
    if (value) {
        // TODO improve object detection for serialization
        if (isObject(value)) {
            const stdin = value.stdin;
            if (stdin) {
                return true;
            }
        }
    }
    return false;
}

export function isObject(value: any) {
    if (isArray(value)) {
        return false;
    } else {
        return typeof value === "object";
    }
}

export function isFunction(value: any) {
    return typeof value === "function" || value instanceof Function || value instanceof MessagePort;
}

export function isSymbol(value: any) {
    return typeof value === "symbol" || value instanceof Symbol;
}

export function isSymbolStringIdentifier(functionName: string) {
    if (functionName.startsWith("Symbol(")) {
        return true;
    }
    return false;
}

export function getSymbolForString(symbolString: string) {
    const symId1 = symbolString.replaceAll("Symbol(", "");
    const symId = symId1.replaceAll(")", "");
    return Symbol.for(symId);
}

export function isArray(value: any) {
    return (
        Array.isArray(value) ||
        (ArrayBuffer.isView(value) && Object.prototype.toString.call(value) !== "[object DataView]")
    );
}

function serializeAny(obj: any): [MessagePort | Object | undefined, Transferable[] | undefined] {
    wasiWorkerSerializeDebug("serializeAny on obj: ", obj);
    if (isArray(obj)) {
        wasiWorkerSerializeDebug("serializeAny isArray ", obj);
        const newObj = serializeObject(obj, true);
        return newObj;
    } else if (isFunction(obj)) {
        wasiWorkerSerializeDebug("serializeAny isFunction ", obj);
        const newObj = serializeFunction(obj);
        return newObj;
    } else if (isObject(obj)) {
        wasiWorkerSerializeDebug("serializeAny isObject ", obj);
        const newObj = serializeObject(obj);
        return newObj;
    } else if (isSymbol(obj)) {
        wasiWorkerSerializeDebug("serializeAny skip symbol ", obj);
        return [undefined, undefined];
    } else {
        wasiWorkerSerializeDebug("serializeAny else ", obj);
        const newObj = obj;
        return [newObj, undefined];
    }
}

function deserializeAny(obj: any) {
    wasiWorkerSerializeDebug("deserializeAny on obj: ", obj);
    if (isArray(obj)) {
        wasiWorkerSerializeDebug("deserializeObject isArray ", obj);
        const newObj = deserializeObject(obj, true);
        return newObj;
    } else if (isFunction(obj)) {
        wasiWorkerSerializeDebug("deserializeObject isFunction ", obj);
        const newObj = deserializeFunction(obj);
        return newObj;
    } else if (isObject(obj)) {
        wasiWorkerSerializeDebug("deserializeObject isObject ", obj);
        const newObj = deserializeObject(obj);
        return newObj;
    } else if (isSymbol(obj)) {
        wasiWorkerSerializeDebug("deserializeAny skip symbol ", obj);
        return null;
    } else {
        wasiWorkerSerializeDebug("deserializeAny else ", obj);
        const newObj = obj;
        return newObj;
    }
}

function serializeObject(obj: Object, isArray = false): [MessagePort | Object, Transferable[] | undefined] {
    wasiWorkerSerializeDebug(`serializeObject on isArray=${isArray} obj: `, obj);
    let newObj: any | undefined;
    if (isArray) {
        newObj = [];
    } else {
        newObj = {};
    }
    let transferrable: Transferable[] | undefined;

    let k: keyof typeof obj;
    for (k in obj) {
        const v = obj[k];
        if (v) {
            wasiWorkerSerializeDebug("serializeObject on obj key: ", k);
            const [sVal, sTransferrable] = serializeAny(v);
            if (sVal) {
                newObj[k] = sVal;
            }
            if (sTransferrable) {
                if (!transferrable) {
                    transferrable = new Array<Transferable>();
                }
                if (transferrable) {
                    sTransferrable.forEach((val) => transferrable?.push(val));
                }
            }
        }
    }
    return [newObj, transferrable];
}

function deserializeObject(obj: any, isArray = false) {
    wasiWorkerSerializeDebug("deserializeObject on obj: ", obj);
    let newObj: any | undefined;
    if (isArray) {
        newObj = [];
    } else {
        newObj = {};
    }
    let k: keyof typeof obj;
    for (k in obj) {
        const v = obj[k];
        const val = deserializeAny(v);
        if (val) {
            newObj[k] = val;
        }
    }
    return newObj;
}

function serializeFunction(obj: unknown): [MessagePort | Object, Transferable[]] {
    wasiWorkerDebug("serializeFunction on obj: ", obj);
    const { port1, port2 } = new MessageChannel();
    comlink.expose(obj, port1);
    return [port2, [port2]];
}

function deserializeFunction(port: MessagePort) {
    wasiWorkerDebug("deserializeFunction on obj: ", port);
    port.start();
    return comlink.wrap(port);
}

/*
export const isFunction2 = (value: any) =>
    value &&
    (Object.prototype.toString.call(value) === "[object Function]" ||
        "function" === typeof value ||
        value instanceof Function);
*/
