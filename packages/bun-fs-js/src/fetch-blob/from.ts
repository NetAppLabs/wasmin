import * as fsSync from "fs";
import * as fs from "fs/promises";
import { basename } from "path";

import { MyBlob, blobDebug } from "./blob";
import { MyFile } from "./file";
import { NotFoundError } from "@wasm-env/fs-js";

export const blobFrom = async (path: string, type?: string) => {
    const s = await fs.stat(path);
    return fromBlob(s, path, type);
};

export const fileFrom = async (path: string, type?: string) => {
    try {
        const s = fsSync.statSync(path);
        return fromFile(s, path, type);
    } catch (err: any) {
        if (err.code === "ENOENT") throw new NotFoundError();
        throw err;
    }

};

const fromBlob = (stat: fsSync.Stats, path: string, type = "") => {
    //const mtimeMsInt = Math.floor(stat.mtimeMs);
    const mtime = stat.mtime;
    const mtimeMsInt = Math.floor(mtime.getTime() / 1000);
    return new MyBlob([new BlobDataItem(path, 0, stat.size, mtimeMsInt)], {
        type,
    });
};

const fromFile = (stat: fsSync.Stats, path: string, type = "") => {
    //const mtimeMsInt = Math.floor(stat.mtimeMs);
    const mtime = stat.mtime;
    const mtimeMsInt = Math.floor(mtime.getTime() / 1000);
    const fSize = stat.size;
    //console.log("stat; ",stat);
    //console.log("fromFile: path: ",path, "mtime: ", mtimeMsInt, "fSize: ", fSize);
    return new MyFile([new BlobDataItem(path, 0, fSize, mtimeMsInt)], basename(path), { type, lastModified: mtime });
};

class NotReadableError extends Error {
    constructor() {
        super(
            "The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired."
        );
        this.name = "NotReadableError";
    }
}

/**
 * This is a blob backed up by a file on the disk
 * with minium requirement. Its wrapped around a Blob as a blobPart
 * so you have no direct access to this.
 */

export class BlobDataItem {
    constructor(private path: string, private start: number, public size: number, public lastModified: number) {}

    /**
     * Slicing arguments is first validated and formatted
     * to not be out of range by Blob.prototype.slice
     */
    slice(sliceStart: number, end: number) {
        blobDebug(`BlobDataItem slice start sliceStart: ${sliceStart} end: ${end}`);
        //return new BlobDataItem(this.path, start, end, this.lastModified);
        const f = Bun.file(this.path);
        const sl = f.slice(sliceStart, end);
        blobDebug(`BlobDataItem slice this.path: ${this.path} sl:`, sl);
        return sl;
    }

    async *stream() {
        blobDebug(`BlobDataItem stream: this.start: ${this.start}`);
        const s = fsSync.statSync(this.path);
        const mtime = s.mtime;
        const mtimeMsInt = Math.floor(mtime.getTime() / 1000);
        //const { mtimeMs } = await fs.stat(this.path);
        //const mtimeMsInt = Math.floor(mtimeMs);

        if (mtimeMsInt > this.lastModified) {
            throw new NotReadableError();
        }

        const start = this.start;
        const end = Math.max(this.start + this.size - 1, 0);
        blobDebug(`BlobDataItem stream: ${start} end: ${end}`);

        const readStream = fsSync.createReadStream(this.path, {
            start: start,
            end: end,
        });
        blobDebug("BlobDataItem stream path: ", this.path, " start: ", start, " end: ", end);
        blobDebug("BlobDataItem stream readStream: ", readStream);
        yield readStream;
    }

    get [Symbol.toStringTag]() {
        return "Blob";
    }
}
