import { Typeson } from "typeson";
import { builtin, date, error, regexp, typedArrays, bigint, bigintObject, arraybuffer } from "typeson-registry";

let TYPESON_INSTANCE: Typeson;

export function getTypeson() {
    if (!TYPESON_INSTANCE) {
        const typeson = new Typeson().register([
            builtin,
            bigint,
            bigintObject,
            date,
            error,
            regexp,
            typedArrays,
            arraybuffer,
            // ...
        ]);
        TYPESON_INSTANCE = typeson;
    }
    return TYPESON_INSTANCE;
}

const DESER_OPTIMIZED = true;

export function toUint8Array(message: any): Uint8Array {
    if (DESER_OPTIMIZED) {
        return toUint8ArrayOptimized(message);
    } else {
        const encoder = new TextEncoder();
        let bytes = encoder.encode(jsonStringify(message));
        return bytes;
    }
}

export function toUint8ArrayOptimized(message: any): Uint8Array {
    let binaryMarker = 0;
    let bytes: Uint8Array|undefined = undefined;
    if (message.return && message.error === undefined) {
        if (Array.isArray(message.return)) {
            const arr = message.return;
            if (arr.length==1) {
                const firstArr = arr[0];
                if (ArrayBuffer.isView(firstArr)) {
                    binaryMarker = 1;
                    bytes = firstArr as Uint8Array;
                }
            } else if (arr.length==2) {
                const firstArr = arr[0];
                const secondArr = arr[1];
                if (ArrayBuffer.isView(firstArr) && secondArr==false) {
                    binaryMarker = 2;
                    bytes = firstArr as Uint8Array;
                } else if (ArrayBuffer.isView(firstArr) && secondArr==true) {
                    binaryMarker = 3;
                    bytes = firstArr as Uint8Array;
                }

            }
        }
    }
    if (!bytes) {
        const encoder = new TextEncoder();
        bytes = encoder.encode(jsonStringify(message));
    }
    const retArr = new Uint8Array(bytes.length+1);
    retArr[0] = binaryMarker;
    retArr.set(bytes,1);
    return retArr;
}

export function fromUint8Array(bytes: Uint8Array): any {
    if (DESER_OPTIMIZED) {
        return fromUint8ArrayOptimized(bytes);
    } else {
        const decoder = new TextDecoder();
        const text = decoder.decode(bytes);
        const parsed = jsonParse(text);
        return parsed;
    }
}


export function fromUint8ArrayOptimized(bytes: Uint8Array): any {
    const marker = bytes[0];
    if (marker==1) {
        bytes = bytes.slice(1);
        const retValue = [bytes];
        const ret = {
            return: retValue,
            error: undefined,
        }
        return ret;
    } else if (marker==2) {
            bytes = bytes.slice(1);
            const retValue = [bytes,false];
            const ret = {
                return: retValue,
                error: undefined,
            }
            return ret;
    } else if (marker==3) {
            bytes = bytes.slice(1);
            const retValue = [bytes,true];
            const ret = {
                return: retValue,
                error: undefined,
            }
            return ret;
    } else if (marker == 0) {
        const decoder = new TextDecoder();
        bytes = bytes.slice(1);
        const text = decoder.decode(bytes);
        const parsed = jsonParse(text);
        return parsed;
    }
}

export function jsonStringify(obj: any) {
    const typeson = getTypeson();
    const jsonFriendly = typeson.encapsulate(obj);
    const str = JSON.stringify(jsonFriendly);
    return str;
}

export function jsonParse(jsonString: string) {
    // Parse using good old JSON.parse()
    const parsed = JSON.parse(jsonString);
    // Revive back again:
    const typeson = getTypeson();
    const revived = typeson.revive(parsed);
    return revived;
}
