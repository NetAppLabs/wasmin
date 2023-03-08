import { MyBlob } from "./blob";
import { BlobDataItem } from "./from";

const UTIL_DEBUG = false;

export function utilDebug(msg?: any, ...optionalParams: any[]): void {
    if (UTIL_DEBUG) {
        console.log(...msg);
    }
}

// 64 KiB (same size chrome slice theirs blob into Uint8array's)
const POOL_SIZE = 65536;

export async function* toIterator(
    parts: Array<MyBlob | Uint8Array>,
    clone = true
    //): AsyncGenerator<Uint8Array> {
) {
    for (const part of parts) {
        // TODO find out why stream does not work in bun memory fs
        //if ("stream" in part) {
        //if (part instanceof BlobDataItem) {
        //  utilDebug("toIterator stream")
        //  yield* part.stream();
        //} else if (ArrayBuffer.isView(part)) {
        if (ArrayBuffer.isView(part)) {
            if (clone) {
                let position = part.byteOffset;
                const end = part.byteOffset + part.byteLength;
                utilDebug("toIterator isView clone position: ", position);
                utilDebug("toIterator isView clone end: ", end);
                while (position !== end) {
                    const size = Math.min(end - position, POOL_SIZE);
                    utilDebug("toIterator isView clone size: ", size);
                    const chunk = part.buffer.slice(position, position + size);
                    position += chunk.byteLength;
                    yield new Uint8Array(chunk);
                }
            } else {
                yield part;
            }
        } else {
            utilDebug("toIterator else");
            // For blobs that have arrayBuffer but no stream method (nodes buffer.Blob)
            let position = 0;
            while (position !== part.size) {
                utilDebug("toIterator else position: ", position);
                const chunk = part.slice(position, Math.min(part.size, position + POOL_SIZE));
                const buffer = await chunk.arrayBuffer();
                position += buffer.byteLength;
                yield new Uint8Array(buffer);
            }
        }
    }
}
