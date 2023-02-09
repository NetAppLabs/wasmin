

import * as comlink from 'comlink';

/*
const funcTransferHandler: comlink.TransferHandler<Function,Function> = {
  serialize(obj: any): any {
    workerDebug("serialize on obj: ", obj);
    const { port1, port2 } = new MessageChannel();
    comlink.expose(obj, port1);
    return port2;
  },
  deserialize(obj: any): any {
    workerDebug("deserialize on obj: ", obj);
    return comlink.proxy(obj as comlink.Endpoint);
  },
  canHandle: function (value: unknown): value is Function {
    workerDebug("canHandle on obj: ", value);
    return value instanceof Function;
  }
}


TransferHandler<object, MessagePort>

const optsTransferHandler: comlink.TransferHandler<WasiOptions,WasiOptions> = {
  serialize(obj: any): any {
    workerDebug("serialize on obj: ", obj);
    const { port1, port2 } = new MessageChannel();
    comlink.expose(obj, port1);
    return port2;
  },
  deserialize(obj: any): any {
    workerDebug("deserialize on obj: ", obj);
    return comlink.proxy(obj as comlink.Endpoint);
  },
  canHandle: function (value: unknown): value is WasiOptions {
    //const wasiOpts: WasiOptions = {};
    return true;
  }
}
*/

/*

export interface TransferHandler<T, S> {
  canHandle(value: unknown): value is T;
  serialize(value: T): [S, Transferable[]];
  deserialize(value: S): T;
}

const proxyTransferHandler: TransferHandler<object, MessagePort> = {
  canHandle: (val): val is ProxyMarked =>
    isObject(val) && (val as ProxyMarked)[proxyMarker],
  serialize(obj) {
    const { port1, port2 } = new MessageChannel();
    expose(obj, port1);
    return [port2, [port2]];
  },
  deserialize(port) {
    port.start();
    return wrap(port);
  },
};
*/


declare let globalThis: any;
globalThis.WASI_WORKER_DEBUG = false;

export function workerDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}


export function initializeHandlers() {
    /*comlink.transferHandlers.set("FUNC", {
        canHandle: function (value: unknown): value is Function {
            workerDebug("FUNC.canHandle on obj: ", value);
            //return value instanceof Function;
            return isFunction(value);
        },
        serialize: (obj) => {
            workerDebug("FUNC.serialize on obj: ", obj);
            const ret = serializeFunction(obj);
            return ret as any;
        },
        deserialize: (port) => {
            workerDebug("FUNC.deserialize on port: ", port);
            return deserializeFunction(port);
        },
    });*/

    const objectTransferHandler: comlink.TransferHandler<Object, MessagePort|Object|undefined> = {
        canHandle: function (value: Object): value is Object {
            workerDebug("OBJECT.canHandle on obj: ", value);
            return isObject(value);
        },
        serialize: function(obj: Object): [MessagePort|Object|undefined, Transferable[]] {
            workerDebug("OBJECT.serialize on obj: ", obj);
            // eslint-disable-next-line prefer-const
            let [serObj, transferrable] = serializeObject(obj);
            workerDebug("OBJECT.serialize(): serObj: ", serObj);
            if (!transferrable) {
                transferrable = new Array<Transferable>();
            }
            workerDebug("OBJECT.serialize(): transferrable ", transferrable);
            return [serObj, transferrable];
        },
        deserialize: function(obj: MessagePort|Object): Object {
            workerDebug("OBJECT.deserialize on obj: ", obj);
            return deserializeObject(obj as Object);
        },
    }
    
    comlink.transferHandlers.set("OBJECT", objectTransferHandler);
}



function isObject(value: any) {
    if (isArray(value)){
        return false;
    } else {
        return (typeof value === "object")
    }
}

function isFunction(value: any) {
    return (typeof value === "function" || value instanceof Function || value instanceof MessagePort)
}

function isSymbol(value: any) {
    return (typeof value === "symbol" || value instanceof Symbol)
}

function isArray(value: any) {
    return Array.isArray(value) || (ArrayBuffer.isView(value) && Object.prototype.toString.call(value) !== "[object DataView]");
}

function serializeAny(obj: any): [MessagePort|Object|undefined, Transferable[]|undefined] {
    workerDebug("serializeAny on obj: ", obj);
    if (isArray(obj)) {
        workerDebug("serializeAny isArray ", obj);
        const newObj = serializeObject(obj, true);
        return newObj;
    } else if (isFunction(obj)) {
        workerDebug("serializeAny isFunction ", obj);
        const newObj = serializeFunction(obj);
        return newObj;
    } else if (isObject(obj)) {
        workerDebug("serializeAny isObject ", obj);
        const newObj = serializeObject(obj);
        return newObj;
    } else if (isSymbol(obj)) {
        workerDebug("serializeAny skip symbol ", obj);
        return [undefined,undefined];
    } else {
        workerDebug("serializeAny else ", obj);
        const newObj = obj;
        return [newObj,undefined];
    }
}

function deserializeAny(obj: any) {
    workerDebug("deserializeAny on obj: ", obj);
    if (isArray(obj)) {
        workerDebug("deserializeObject isArray ", obj);
        const newObj = deserializeObject(obj, true);
        return newObj;
    } else if (isFunction(obj)) {
        workerDebug("deserializeObject isFunction ", obj);
        const newObj = deserializeFunction(obj);
        return newObj;
    } else if (isObject(obj)) {
        workerDebug("deserializeObject isObject ", obj);
        const newObj = deserializeObject(obj);
        return newObj;
    } else if (isSymbol(obj)) {
        workerDebug("deserializeAny skip symbol ", obj);
        return null;
    } else {
        workerDebug("deserializeAny else ", obj);
        const newObj = obj;
        return newObj;
    }
}

function serializeObject(obj: Object, isArray=false): [MessagePort|Object, Transferable[]|undefined]{
    workerDebug(`serializeObject on isArray=${isArray} obj: `, obj);
    let newObj: any|undefined;
    if (isArray) {
        newObj = [];
    } else {
        newObj = {};
    }
    let transferrable: Transferable[]|undefined;

    let k: keyof typeof obj;
    for (k in obj) {
        const v = obj[k];
        if (v) {
            workerDebug("serializeObject on obj key: ", k);
            const [sVal, sTransferrable] = serializeAny(v);
            if (sVal) {
                newObj[k] = sVal;
            }
            if (sTransferrable) {
                if (!transferrable) {
                    transferrable = new Array<Transferable>();
                }
                if (transferrable){
                    sTransferrable.forEach((val)=>transferrable?.push(val));
                }
            }
        }
    }
    return [newObj, transferrable];
}

function deserializeObject(obj: any, isArray=false) {
    workerDebug("deserializeObject on obj: ", obj);
    let newObj: any|undefined;
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

function serializeFunction(obj: unknown): [MessagePort|Object, Transferable[]] {
    workerDebug("serializeFunction on obj: ", obj);
    const { port1, port2 } = new MessageChannel();
    comlink.expose(obj, port1);
    return [port2, [port2]];
    
}

function deserializeFunction(port: MessagePort) {
    workerDebug("deserializeFunction on obj: ", port);
    port.start();
    return comlink.wrap(port);
}
