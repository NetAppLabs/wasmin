import * as comlink from "comlink";
import { promises } from "node:fs";

declare let globalThis: any;
globalThis.WASI_WORKER_DEBUG = false;

globalThis.WASI_WORKER_SERIALIZE_DEBUG = false;

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

export async function getWasmModuleSource(moduleUrl: string) {
    const wasmBuf = await promises.readFile(moduleUrl);
    return wasmBuf;
}

export async function getWasmModule(moduleUrl: string) {
    const wasmBuf = await getWasmModuleSource(moduleUrl);
    const mod = await WebAssembly.compile(wasmBuf);
    return mod;
}

export async function getWasmModuleAndBuffer(moduleUrl: string) {
    const wasmBuf = await getWasmModuleSource(moduleUrl);
    const wasmMod = await WebAssembly.compile(wasmBuf);
    return { wasmMod, wasmBuf };
}

export function initializeHandlers() {
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

function isObject(value: any) {
    if (isArray(value)) {
        return false;
    } else {
        return typeof value === "object";
    }
}

function isFunction(value: any) {
    return typeof value === "function" || value instanceof Function || value instanceof MessagePort;
}

function isSymbol(value: any) {
    return typeof value === "symbol" || value instanceof Symbol;
}

function isArray(value: any) {
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
