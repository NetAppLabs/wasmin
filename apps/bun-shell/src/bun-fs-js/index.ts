import * as fsSync from "fs";
import * as fs from "fs/promises";
import { join } from "path";

import {
    InvalidModificationError,
    InvalidStateError,
    NotFoundError,
    SyntaxError,
    TypeMismatchError,
} from "@wasm-env/fs-js";
//} from "@wasm-env/fs-js/errors";
import { fileFrom, BlobDataItem } from "../fetch-blob/from";
import { MyBlob } from "../fetch-blob/blob";
//import { ImpleFileHandle, ImplFolderHandle, DefaultSink } from "@wasm-env/fs-js/adapters/implements";
import { ImpleFileHandle, ImplFolderHandle, DefaultSink } from "@wasm-env/fs-js";
import type { MyFile } from "../fetch-blob/file";
import { promisify } from "sys";

const BUN_FS_DEBUG = false;

export function bunFsDebug(msg?: any, ...optionalParams: any[]): void {
    if (BUN_FS_DEBUG) {
        console.log(...msg);
    }
}

type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

type SinkFileHandle = PromiseType<ReturnType<typeof fs.open>>;

export class Sink extends DefaultSink<SinkFileHandle> {
    constructor(fileHandle: SinkFileHandle, size: number) {
        super(fileHandle);
        this.size = size;
    }

    async abort() {
        fsSync.closeSync(this.fileHandle);
        //await this.fileHandle.close();
    }

    async write(chunk: any) {
        if (typeof chunk === "object") {
            if (chunk.type === "write") {
                if (Number.isInteger(chunk.position) && chunk.position >= 0) {
                    this.position = chunk.position;
                }
                if (!("data" in chunk)) {
                    //await this.fileHandle.close();
                    fsSync.closeSync(this.fileHandle);
                    throw new SyntaxError("write requires a data argument");
                }
                chunk = chunk.data;
            } else if (chunk.type === "seek") {
                if (Number.isInteger(chunk.position) && chunk.position >= 0) {
                    if (this.size < chunk.position) {
                        throw new InvalidStateError();
                    }
                    this.position = chunk.position;
                    return;
                } else {
                    fsSync.closeSync(this.fileHandle);
                    //await this.fileHandle.close();
                    throw new SyntaxError("seek requires a position argument");
                }
            } else if (chunk.type === "truncate") {
                if (Number.isInteger(chunk.size) && chunk.size >= 0) {
                    fsSync.ftruncateSync(this.fileHandle, chunk.size);
                    //await this.fileHandle.truncate(chunk.size);
                    this.size = chunk.size;
                    if (this.position > this.size) {
                        this.position = this.size;
                    }
                    return;
                } else {
                    //await this.fileHandle.close();
                    fsSync.closeSync(this.fileHandle);
                    throw new SyntaxError("truncate requires a size argument");
                }
            }
        }

        if (chunk instanceof ArrayBuffer) {
            chunk = new Uint8Array(chunk);
        } else if (typeof chunk === "string") {
            chunk = Buffer.from(chunk);
        } else if (chunk instanceof Blob) {
            bunFsDebug("write is Blob");
            // @ts-ignore
            for await (const data of chunk.stream()) {
                //const res = await this.fileHandle.writev(
                const written = fsSync.writevSync(this.fileHandle, [data as Buffer], this.position);
                this.position += written;
                this.size += written;
            }
            return;
        }
        bunFsDebug("write else");
        bunFsDebug("write else chunk: ", chunk);

        //chunk = new ArrayBuffer(chunk);
        //const written = fsSync.writevSync(this.fileHandle, [chunk], this.position);
        //const resp = await writeev(this.fileHandle, [chunk], this.position);

        try {
            //const writeev = promisify(fsSync.writev);
            //const resp = await writeev(this.fileHandle, chunk, this.position);
            //const written = fsSync.writevSync(this.fileHandle, chunk, this.position)
            /*const cb = function(err, bytesWritten, buffers){
        this.position += bytesWritten;
        this.size += bytesWritten;
        return;
      }
      fs.writeFile()
      fsSync.writev(this.fileHandle, chunk, cb);
      */
            const chunkLength = chunk.byteLength;
            bunFsDebug("write else chunkLength: ", chunkLength);
            const written = fsSync.writeSync(this.fileHandle, chunk, 0, chunkLength, this.position);
            //const written = resp.bytesWritten;
            //const res = await this.fileHandle.writev([chunk], this.position);
            this.position += written;
            this.size += written;
            bunFsDebug("write else written: ", written);
        } catch (err: any) {
            bunFsDebug("Error: ", err);
        }
    }

    async close() {
        fsSync.closeSync(this.fileHandle);
        //await this.fileHandle.close();
    }
}

export class BunFileHandle implements ImpleFileHandle<Sink, MyFile> {
    constructor(public path: string, public name: string) {}

    public kind = "file" as const;

    public async getFile() {
        const f = await fileFrom(this.path);
        //bunFsDebug("returning f: ",f);
        return f;
    }

    async isSameEntry(other: any): Promise<boolean> {
        return this.path === this.getPath.apply(other);
    }

    async createWritable() {
        const fileHandle = await fs.open(this.path, "r+").catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        //const { size } = await fileHandle.stat();
        const { size } = fsSync.fstatSync(fileHandle);
        return new Sink(fileHandle, size);
    }

    private getPath() {
        return this.path;
    }
}

export class BunFolderHandle implements ImplFolderHandle<BunFileHandle, BunFolderHandle> {
    constructor(public path: string, public name = "") {}
    public writable = true;
    public kind = "directory" as const;

    resolve(_possibleDescendant: BunFileHandle | BunFolderHandle): Promise<string[] | null> {
        throw new Error("Method not implemented.");
    }

    public isSameEntry(other: any) {
        return this.path === other.path;
    }

    public async *entries(): AsyncGenerator<readonly [string, BunFileHandle | BunFolderHandle], void, unknown> {
        const dir = this.path;
        const items = await fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of items) {
            const path = join(dir, name);
            const stat = await fs.lstat(path);
            if (stat.isFile()) {
                yield [name, new BunFileHandle(path, name)] as const;
            } else if (stat.isDirectory()) {
                yield [name, new BunFolderHandle(path, name)] as const;
            }
        }
    }

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        const path = join(this.path, name);
        const stat = await fs.lstat(path).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        let isDirectory = false;
        if (stat) {
            isDirectory = stat.isDirectory();
        }
        if (stat && isDirectory) return new BunFolderHandle(path, name);
        if (stat && !isDirectory) throw new TypeMismatchError();
        if (!options.create) throw new NotFoundError();
        await fs.mkdir(path);
        return new BunFolderHandle(path, name);
    }

    public async getFileHandle(name: string, opts: { create?: boolean } = {}) {
        const path = join(this.path, name);
        const stat = await fs.lstat(path).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        if (stat) {
            if (stat.isFile()) {
                return new BunFileHandle(path, name);
            } else {
                throw new TypeMismatchError();
            }
        }
        if (!opts.create) throw new NotFoundError();
        //await (await fs.open(path, "w")).close();
        const fHandle = await fs.open(path, "w");
        fsSync.closeSync(fHandle);
        return new BunFileHandle(path, name);
    }

    public async queryPermission() {
        return "granted" as const;
    }

    public async removeEntry(name: string, opts: { recursive?: boolean }) {
        const path = join(this.path, name);
        const stat = await fs.lstat(path).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        if (stat && stat.isDirectory()) {
            if (opts.recursive) {
                await fs.rm(path, { recursive: true }).catch((err) => {
                    if (err.code === "ENOTEMPTY") throw new InvalidModificationError();
                    throw err;
                });
            } else {
                await fs.rmdir(path).catch((err) => {
                    if (err.code === "ENOTEMPTY") throw new InvalidModificationError();
                    throw err;
                });
            }
        } else {
            await fs.unlink(path);
        }
    }
}

export default (path: string) => new BunFolderHandle(path);
