export class TextDecoderWrapper implements TextDecoder {
    constructor(label?: string | undefined, options?: TextDecoderOptions | undefined) {
        let encoding = label;
        if (!encoding) {
            encoding = "utf8";
        }
        this.encoding = encoding;
        this.fatal = false;
        this.ignoreBOM = true;
        this.innerDecoder = new TextDecoder(this.encoding);
    }
    encoding: string;
    fatal: boolean;
    ignoreBOM: boolean;
    innerDecoder: TextDecoder;

    decode(input?: BufferSource, options?: TextDecodeOptions): string {
        if (input instanceof Uint8Array) {
            const uArr = input as Uint8Array;
            return this.decodeUint8Array(uArr, options);
        } else {
            return this.innerDecoder.decode(input, options);
        }
    }

    decodeUint8Array(input?: Uint8Array, options?: TextDecodeOptions): string {
        if (input) {
            if (input.buffer instanceof SharedArrayBuffer) {
                const newData = new Uint8Array(input);
                return this.innerDecoder.decode(newData, options);
            } else {
                return this.innerDecoder.decode(input, options);
            }
        }
        return "";
    }
}

export function isBun() {
    // only bun has global Bun
    try {
        // @ts-ignore
        return globalThis.Bun != null;
    } catch (e) {
        return false;
    }
}

export function isDeno() {
    // only deno has global Deno
    try {
        // @ts-ignore
        return globalThis.Deno != null;
    } catch (e) {
        return false;
    }
}

export function isNodeorDeno() {
    if (isDeno()) {
        return true;
    } else {
        return isNode();
    }
}

export function isNodeorBunorDeno() {
    if (isDeno()) {
        return true;
    } else {
        return isNodeorBun();
    }
}

export function isNodeorBun() {
    return globalThis.process != null;
}

export function isNode() {
    if (isBun()) {
        return false;
    } else if (isDeno()) {
        return false;
    } else {
        // node.js/bun/deno have global process class
        return globalThis.process != null;
    }
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copyUint8Array(src: Uint8Array)  {
    var dst = new ArrayBuffer(src.byteLength);
    let uint8Arr = new Uint8Array(dst);
    uint8Arr.set(new Uint8Array(src));
    return uint8Arr;
}

export function appendToUint8Array(arr: Uint8Array, additionalData: Uint8Array): Uint8Array {
    let additionalDataLength = additionalData.byteLength;
    const newArray = new Uint8Array(arr.byteLength + additionalDataLength);
    newArray.set(arr, 0); // copy old data
    if (additionalDataLength > 0) {
        newArray.set(additionalData, arr.byteLength); // copy new data after end of old data
    }
    return newArray;
}

export function copyBuffer(src: ArrayBufferLike, dst: ArrayBufferLike) {
    const srcBytes = new Uint8Array(src);
    const size = src.byteLength;
    const view = new DataView(dst);
    for (let i = 0; i < size; i++) {
        view.setUint8(i, srcBytes[i]);
    }
}