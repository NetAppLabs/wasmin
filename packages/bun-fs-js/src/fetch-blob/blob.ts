//import { ReadableStream as WebStreamsPolyFillReadableStream } from "web-streams-polyfill";
//import { ReadableStream } from "web-streams-polyfill";

const BLOG_DEBUG = false;

export function blobDebug(msg?: any, ...optionalParams: any[]): void {
    if (BLOG_DEBUG) {
        console.log(msg, ...optionalParams);
    }
}

import { toIterator } from "./utils";

export class MyBlob {
    /**
     * The Blob() constructor returns a new Blob object. The content
     * of the blob consists of the concatenation of the values given
     * in the parameter array.
     */
    constructor(blobParts: any[] | Uint8Array = [], options: { type?: string } = {}) {
        blobDebug("MyBlob constructor, blobParts: ", blobParts);
        blobDebug("MyBlob constructor, options: ", options);
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
                //part = element.slice(0);
            } else {
                part = new TextEncoder().encode(element);
            }

            size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
            blobDebug("MyBlob constructor setting size: ", size);
            parts.push(part);
        }

        const type = options.type === undefined ? "" : String(options.type);

        this.type = /^[\x20-\x7E]*$/.test(type) ? type : "";
        blobDebug("MyBlob constructor setting this.size: ", size);
        this._size = size;
        this.parts = parts;
    }

    get size() {
        return this._size;
    }
    set size(s: number) {
        blobDebug("MyBlob set size: ", s);
        //console.trace();
        this._size = s;
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
    //public size = 0; // size of the Blob in bytes.
    private _size: number;

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
            str += decoder.decode(part);
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
    async arrayBuffer(): Promise<ArrayBufferLike> {
        blobDebug("arrayBuffer start");
        const useIterator = true;

        // Easier way... Just a unnecessary overhead
        // const view = new Uint8Array(this.size);
        // await this.stream().getReader({mode: 'byob'}).read(view);
        // return view.buffer;
        if (useIterator) {
            blobDebug("arrayBuffer this.size:", this.size);
            const data = new Uint8Array(this.size);
            let offset = 0;
            for await (const chunk of toIterator(this.parts, false)) {
                //blobDebug("arrayBuffer chunk:", chunk);
                blobDebug("arrayBuffer pre offset:", offset);
                blobDebug("arrayBuffer chunk.length:", chunk.length);
                //blobDebug("arrayBuffer chunk.size:", chunk.size);
                data.set(chunk, offset);
                offset += chunk.length;
                blobDebug("arrayBuffer post offset:", offset);
            }

            return data.buffer;
        } else {
            //const view = new Uint8Array(this.size);
            //await this.stream().getReader({mode: 'byob'}).read(view);
            const res = await this.stream().getReader().read();
            if (res.done) {
                return new ArrayBuffer(0);
            } else {
                return res.value;
            }
            //return view.buffer;
        }
    }

    stream() {
        blobDebug("stream start");
        const it = toIterator(this.parts, true);
        // seems not to be available in Buns ReadableStream:
        //const type = "bytes";
        return new ReadableStream({
            //type: type,
            async pull(ctrl: any) {
                blobDebug("pull start");
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
        blobDebug("slice start , start: ", start, " end: ", end, "type: ", type);
        const { size } = this;
        blobDebug("slice start , size: ", size);

        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        blobDebug("slice relativeStart: ", relativeStart);
        blobDebug("slice relativeEnd: ", relativeEnd);

        const span = Math.max(relativeEnd - relativeStart, 0);
        blobDebug("slice span: ", span);

        const parts = this.parts;
        const blobParts = [];
        let added = 0;
        let iteration = 0;
        blobDebug("slice for loop start");
        for (const part of parts) {
            iteration = iteration + 1;
            blobDebug("slice for loop iteration:", iteration);

            // don't add the overflow to new blobParts
            if (added >= span) {
                blobDebug("slice for break");
                break;
            }

            if ("byteLength" in part) {
                blobDebug("part.byteLength: ", part.byteLength);
            }
            if ("size" in part) {
                blobDebug("part.size: ", part.size);
            }

            const forSize = ArrayBuffer.isView(part) ? part.byteLength : part.size;
            blobDebug("slice for forSize:", forSize);
            if (relativeStart && forSize <= relativeStart) {
                blobDebug("slice for relativeStart && size <= relativeStart");
                // Skip the beginning and change the relative
                // start & end position as we skip the unwanted parts
                relativeStart -= forSize;
                relativeEnd -= forSize;
            } else {
                blobDebug("slice for else: ");
                let chunk;
                const typ = typeof part;
                if (part instanceof MyBlob) {
                    blobDebug(" part is MyBlob ");
                } else if (part instanceof Blob) {
                    blobDebug(" part is Blob ");
                } else {
                    blobDebug(" part is uknown ");
                }

                if (ArrayBuffer.isView(part)) {
                    chunk = part.subarray(relativeStart, Math.min(forSize, relativeEnd));
                    added += chunk.byteLength;
                    blobDebug("slice isView added: ", added, " typ: ", typ);
                } else {
                    chunk = part.slice(relativeStart, Math.min(forSize, relativeEnd));
                    added += chunk.size;
                    blobDebug("slice added: ", added, " typ: ", typ);
                }
                relativeEnd -= forSize;
                /*if (relativeEnd < 0) {
          relativeEnd = 0;
        }*/
                blobDebug("slice for relativeEnd: ", relativeEnd);
                blobParts.push(chunk);
                relativeStart = 0; // All next sequential parts should start at 0
            }
        }

        const blob = new MyBlob([], { type: String(type).toLowerCase() });
        blob.size = span;
        blob.parts = blobParts;

        blobDebug("slice end");

        return blob;
    }

    get [Symbol.toStringTag]() {
        return "Blob";
    }
}
