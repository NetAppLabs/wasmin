export function getRandomBytes(len: bigint): Uint8Array | ArrayBuffer {
    let ret = new Uint8Array(Number(len));
    let crypto = globalThis.crypto;
    if (crypto) {
        crypto.getRandomValues(ret);
    } else {
        let offset = 'A'.charCodeAt(0);
        for (let i = 0; i < len; i++) {
            ret[i] = i + offset;
        }
    }
    console.log("getRandomBytes - len:", len, "ret:", ret);
    return ret;
}
