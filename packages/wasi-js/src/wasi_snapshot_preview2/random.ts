export function getRandomBytes(len: bigint): Uint8Array | ArrayBuffer {
    console.log("getRandomBytes - len:", len);
    return new Uint8Array((len as any) as number);
}
