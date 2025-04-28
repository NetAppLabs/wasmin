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

import { isNode } from "./utils.js";
import { CurrentLogger } from "./wasiLogging.js";

declare global {
    var WASI_DEBUG: boolean;
    var WASI_CALL_DEBUG: boolean;
    var WASI_PREVIEW1_DEBUG: boolean;
    var WASI_PREVIEW2_DEBUG: boolean;
    var WASI_PREVIEW1_FD_DEBUG: boolean;
    var WASI_RESOURCE_DEBUG: boolean;
    var WASI_WORKER_DEBUG: boolean;
    var WASI_WORKER_SERIALIZE_DEBUG: boolean;
    var WASI_FILESYSTEM_DEBUG: boolean
    var WASI_PROCESS_DEBUG: boolean;
    var WASI_SOCKETS_DEBUG: boolean;
    var WASI_PIPES_DEBUG: boolean;
    var WASM_WORKER_THREAD_DEBUG: boolean;
    var WASM_WORKER_CLIENT_DEBUG: boolean;
}
globalThis.WASI_DEBUG = false;
globalThis.WASI_CALL_DEBUG = false;
globalThis.WASI_PREVIEW1_DEBUG = false;
globalThis.WASI_PREVIEW2_DEBUG = false;
globalThis.WASI_PREVIEW1_FD_DEBUG = false;
globalThis.WASI_RESOURCE_DEBUG = false;
globalThis.WASI_WORKER_DEBUG = false;
globalThis.WASI_WORKER_SERIALIZE_DEBUG = false;
globalThis.WASI_FILESYSTEM_DEBUG = false;
globalThis.WASI_PROCESS_DEBUG = false;
globalThis.WASI_PIPES_DEBUG = false;
globalThis.WASM_WORKER_THREAD_DEBUG = false;
globalThis.WASM_WORKER_CLIENT_DEBUG = false;
globalThis.WASI_SOCKETS_DEBUG = false;


export function wasiCallDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_CALL_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiError(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        CurrentLogger.error(msg, ...optionalParams);
        if (msg instanceof Error) {
            const e = msg as Error;
            CurrentLogger.error(e.name);
            CurrentLogger.error(e.message);
            CurrentLogger.error(e.cause);
            CurrentLogger.error(e.stack);
        }
    }
}

export function wasiWarn(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiPreview1Debug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PREVIEW1_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiPreview2Debug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PREVIEW2_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiResourceDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_RESOURCE_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiFileSystemDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_FILESYSTEM_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiSocketsDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_SOCKETS_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}


export function wasiPreview1FdDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PREVIEW1_FD_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasmWorkerClientDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_WORKER_CLIENT_DEBUG) {
        if (isNode()) {
            workerDebugNode(msg, ...optionalParams);
        } else {
            CurrentLogger.debug(msg, ...optionalParams);
        }
    }
}

export async function workerDebugNode(msg?: any, ...optionalParams: any[]): Promise<void> {
    const { parentPort } = await import("node:worker_threads");
    if (parentPort) {
        const message = { msg: msg, params: [...optionalParams] };
        parentPort.postMessage(message);
    } else {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasmWorkerThreadDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_WORKER_THREAD_DEBUG) {
        if (isNode()) {
            workerDebugNode(msg, ...optionalParams);
        } else {
            CurrentLogger.debug(msg, ...optionalParams);
        }
    }
}

export function wasiWorkerDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_WORKER_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiWorkerSerializeDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_WORKER_SERIALIZE_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiProcessDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PROCESS_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}

export function wasiPipesDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PIPES_DEBUG) {
        CurrentLogger.debug(msg, ...optionalParams);
    }
}
