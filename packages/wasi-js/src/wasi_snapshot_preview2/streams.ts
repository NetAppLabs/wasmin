import { InputStream, OutputStream } from "./imports/streams.js";

export function dropInputStream(t: InputStream): void {
    console.log("dropInputStream");
    return;
}

export function dropOutputStream(t: OutputStream): void {
    console.log("dropOutputStream");
    return;
}

export function write(t: OutputStream, buf: Uint8Array): bigint {
    let len = buf.length;
    console.log(`write ${len}`, t, buf);
    let bigNum = BigInt(len);
    let d = new TextDecoder();
    let str = d.decode(buf);
    console.log(str);
    return bigNum;
}

export function blockingWrite(t: OutputStream, buf: Uint8Array): bigint {
    let len = buf.length;
    console.log(`blockingWrite ${len}`, t, buf);
    let bigNum = BigInt(len);
    return bigNum;
}