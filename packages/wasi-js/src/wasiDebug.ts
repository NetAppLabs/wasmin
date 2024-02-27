import { isNode } from "./utils.js";

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
        console.debug(msg, ...optionalParams);
    }
}

export function wasiError(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        console.error(msg, ...optionalParams);
        if (msg instanceof Error) {
            const e = msg as Error;
            console.error(e.name);
            console.error(e.message);
            console.error(e.cause);
            console.error(e.stack);
        }
    }
}

export function wasiWarn(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiPreview1Debug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PREVIEW1_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiPreview2Debug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PREVIEW2_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiResourceDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_RESOURCE_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiFileSystemDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_FILESYSTEM_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiSocketsDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_SOCKETS_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}


export function wasiPreview1FdDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PREVIEW1_FD_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasmWorkerClientDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_WORKER_CLIENT_DEBUG) {
        if (isNode()) {
            workerDebugNode(msg, ...optionalParams);
        } else {
            console.debug(msg, ...optionalParams);
        }
    }
}

export async function workerDebugNode(msg?: any, ...optionalParams: any[]): Promise<void> {
    const { parentPort } = await import("node:worker_threads");
    if (parentPort) {
        const message = { msg: msg, params: [...optionalParams] };
        parentPort.postMessage(message);
    } else {
        console.debug(msg, ...optionalParams);
    }
}

export function wasmWorkerThreadDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASM_WORKER_THREAD_DEBUG) {
        if (isNode()) {
            workerDebugNode(msg, ...optionalParams);
        } else {
            console.debug(msg, ...optionalParams);
        }
    }
}

export function wasiWorkerDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_WORKER_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiWorkerSerializeDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_WORKER_SERIALIZE_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiProcessDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PROCESS_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiPipesDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_PIPES_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}
