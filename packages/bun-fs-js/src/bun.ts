import * as fsSync from "node:fs";
import * as fs from "node:fs/promises";
import { join } from "node:path";

import {
    FileSystemWritableFileStream,
    InvalidModificationError,
    InvalidStateError,
    NFileSystemWritableFileStream,
    NotFoundError,
    PreNameCheck,
    SyntaxError,
    TypeMismatchError,
} from "@wasm-env/fs-js";
import { ImpleFileHandle, ImplFolderHandle, DefaultSink, FileSystemCreateWritableOptions } from "@wasm-env/fs-js";

import type { MyFile } from "./fetch-blob/file";
import { fileFrom } from "./fetch-blob/from.js";

const BUN_FS_DEBUG = false;

export function bunFsDebug(msg?: any, ...optionalParams: any[]): void {
    if (BUN_FS_DEBUG) {
        console.log(...msg);
    }
}

type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

type SinkFileHandle = PromiseType<ReturnType<typeof fs.open>>;

export class BunSink extends DefaultSink<SinkFileHandle> implements FileSystemWritableFileStream {
    constructor(fileHandle: SinkFileHandle, size: number) {
        super(fileHandle);
        this.size = size;
    }

    getWriter(): WritableStreamDefaultWriter<any> {
        const w = new WritableStreamDefaultWriter<any>(this);
        return w;
    }

    get fileHandleNumber() {
        const fh = this.fileHandle;
        const fhNumber = fh as number;
        return fhNumber;
    }

    async abort() {
        fsSync.closeSync(this.fileHandleNumber);
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
                    fsSync.closeSync(this.fileHandleNumber);
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
                    fsSync.closeSync(this.fileHandleNumber);
                    //await this.fileHandle.close();
                    throw new SyntaxError("seek requires a position argument");
                }
            } else if (chunk.type === "truncate") {
                if (Number.isInteger(chunk.size) && chunk.size >= 0) {
                    fsSync.ftruncateSync(this.fileHandleNumber, chunk.size);
                    //await this.fileHandle.truncate(chunk.size);
                    this.size = chunk.size;
                    if (this.position > this.size) {
                        this.position = this.size;
                    }
                    return;
                } else {
                    //await this.fileHandle.close();
                    fsSync.closeSync(this.fileHandleNumber);
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
                const written = fsSync.writevSync(this.fileHandleNumber, [data as Buffer], this.position);
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
            const written = fsSync.writeSync(this.fileHandleNumber, chunk, 0, chunkLength, this.position);
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
        fsSync.closeSync(this.fileHandleNumber);
        //await this.fileHandle.close();
    }
}

export class BunFileHandle implements ImpleFileHandle<BunSink, MyFile> {
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

    public async createWritableSink(options?: FileSystemCreateWritableOptions) {
        let fSize = 0;
        if (options && !options.keepExistingData) {
            await fs.truncate(this.path).catch((err) => {
                if (err.code === "ENOENT") throw new NotFoundError();
                throw err;
            });
        }
        let fileHandle = await fs.open(this.path, "r+").catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        const fhNumber = fileHandle as number;
        const { size } = fsSync.fstatSync(fhNumber);
        fSize = size;
        const sink = new BunSink(fileHandle, fSize);
        return sink;
    }

    // @ts-ignore
    public async createWritable(options?: FileSystemCreateWritableOptions) {
        const sink = await this.createWritableSink(options);
        const fstream = new NFileSystemWritableFileStream(sink);
        return fstream;
    }

    private getPath() {
        return this.path;
    }
}

export class BunFolderHandle implements ImplFolderHandle<BunFileHandle, BunFolderHandle> {
    constructor(public path: string, public name = "") {}
    public writable = true;
    public kind = "directory" as const;

    [Symbol.asyncIterator]() {
        return this.entries();
    }

    get [Symbol.toStringTag]() {
        return "FileSystemDirectoryHandle";
    }

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
        PreNameCheck(name);
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
        PreNameCheck(name);
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

    public async removeEntry(name: string, opts?: { recursive?: boolean }) {
        PreNameCheck(name);
        const path = join(this.path, name);
        const stat = await fs.lstat(path).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        if (stat && stat.isDirectory()) {
            if (opts && opts.recursive) {
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
