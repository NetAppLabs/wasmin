import { ReadableStream } from "web-streams-polyfill";

import { toIterator } from "./utils";

export class MyBlob {
    /**
     * The Blob() constructor returns a new Blob object. The content
     * of the blob consists of the concatenation of the values given
     * in the parameter array.
     */
    constructor(blobParts: any[] | Uint8Array = [], options: { type?: string } = {}) {
        const parts = [];
        let size = 0;

        if (options === null) options = {};

        for (const element of blobParts) {
            let part: Uint8Array | MyBlob;
            if (ArrayBuffer.isView(element)) {
                part = new Uint8Array(
                    element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength)
                );
            } else if (element instanceof ArrayBuffer) {
                part = new Uint8Array(element.slice(0));
            } else if (element instanceof MyBlob) {
                part = element;
            } else {
                part = new TextEncoder().encode(element);
            }

            size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
            parts.push(part);
        }

        const type = options.type === undefined ? "" : String(options.type);

        this.type = /^[\x20-\x7E]*$/.test(type) ? type : "";
        this.size = size;
        this.parts = parts;
    }

    static [Symbol.hasInstance](object: any) {
        return (
            object &&
            typeof object === "object" &&
            typeof object.constructor === "function" &&
            (typeof object.stream === "function" || typeof object.arrayBuffer === "function") &&
            /^(Blob|File)$/.test(object[Symbol.toStringTag])
        );
    }

    public parts: Array<MyBlob | Uint8Array> = [];
    public type = ""; //the MIME type of the file.
    public size = 0; // size of the Blob in bytes.

    /**
     * The text() method in the Blob interface returns a Promise
     * that resolves with a string containing the contents of
     * the blob, interpreted as UTF-8.
     */
    async text(): Promise<string> {
        // More optimized than using this.arrayBuffer()
        // that requires twice as much ram
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.parts, false)) {
            str += decoder.decode(part, { stream: true });
        }
        // Remaining
        str += decoder.decode();
        return str;
    }

    /**
     * The arrayBuffer() method in the Blob interface returns a
     * Promise that resolves with the contents of the blob as
     * binary data contained in an ArrayBuffer.
     */
    async arrayBuffer(): Promise<ArrayBuffer> {
        // Easier way... Just a unnecessary overhead
        // const view = new Uint8Array(this.size);
        // await this.stream().getReader({mode: 'byob'}).read(view);
        // return view.buffer;

        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.parts, false)) {
            data.set(chunk, offset);
            offset += chunk.length;
        }

        return data.buffer;
    }

    stream() {
        const it = toIterator(this.parts, true);
        const type = "bytes";
        return new ReadableStream({
            type: type,
            async pull(ctrl) {
                const chunk = await it.next();
                chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
            },
        });
    }

    /**
     * The Blob interface's slice() method creates and returns a
     * new Blob object which contains data from a subset of the
     * blob on which it's called.
     */
    slice(start = 0, end = this.size, type = "") {
        const { size } = this;

        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);

        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.parts;
        const blobParts = [];
        let added = 0;

        for (const part of parts) {
            // don't add the overflow to new blobParts
            if (added >= span) {
                break;
            }

            const size = ArrayBuffer.isView(part) ? part.byteLength : part.size;
            if (relativeStart && size <= relativeStart) {
                // Skip the beginning and change the relative
                // start & end position as we skip the unwanted parts
                relativeStart -= size;
                relativeEnd -= size;
            } else {
                let chunk;
                if (ArrayBuffer.isView(part)) {
                    chunk = part.subarray(relativeStart, Math.min(size, relativeEnd));
                    added += chunk.byteLength;
                } else {
                    chunk = part.slice(relativeStart, Math.min(size, relativeEnd));
                    added += chunk.size;
                }
                relativeEnd -= size;
                blobParts.push(chunk);
                relativeStart = 0; // All next sequential parts should start at 0
            }
        }

        const blob = new MyBlob([], { type: String(type).toLowerCase() });
        blob.size = span;
        blob.parts = blobParts;

        return blob;
    }

    get [Symbol.toStringTag]() {
        return "Blob";
    }
}
