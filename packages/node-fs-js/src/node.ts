import { promises as fs } from "node:fs";
import { join } from "node:path";

//import fs from "node:fs/promises";
//import { join } from "node:path";

import {
    InvalidModificationError,
    InvalidStateError,
    NotFoundError,
    SyntaxError,
    TypeMismatchError,
} from "@wasm-env/fs-js";
//} from "@wasm-env/fs-js/errors";
import { fileFrom, BlobDataItem } from "./fetch-blob/form";
import { MyBlob } from "./fetch-blob/blob";
//import { ImpleFileHandle, ImplFolderHandle, DefaultSink } from "@wasm-env/fs-js/adapters/implements";
import { ImpleFileHandle, ImplFolderHandle, DefaultSink } from "@wasm-env/fs-js";
import type { MyFile } from "./fetch-blob/file";

type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

type SinkFileHandle = PromiseType<ReturnType<typeof fs.open>>;

export class Sink extends DefaultSink<SinkFileHandle> {
    constructor(fileHandle: SinkFileHandle, size: number) {
        super(fileHandle);
        this.size = size;
    }

    async abort() {
        await this.fileHandle.close();
    }

    async write(chunk: any) {
        if (typeof chunk === "object") {
            if (chunk.type === "write") {
                if (Number.isInteger(chunk.position) && chunk.position >= 0) {
                    this.position = chunk.position;
                }
                if (!("data" in chunk)) {
                    await this.fileHandle.close();
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
                    await this.fileHandle.close();
                    throw new SyntaxError("seek requires a position argument");
                }
            } else if (chunk.type === "truncate") {
                if (Number.isInteger(chunk.size) && chunk.size >= 0) {
                    await this.fileHandle.truncate(chunk.size);
                    this.size = chunk.size;
                    if (this.position > this.size) {
                        this.position = this.size;
                    }
                    return;
                } else {
                    await this.fileHandle.close();
                    throw new SyntaxError("truncate requires a size argument");
                }
            }
        }

        if (chunk instanceof ArrayBuffer) {
            chunk = new Uint8Array(chunk);
        } else if (typeof chunk === "string") {
            chunk = Buffer.from(chunk);
        } else if (chunk instanceof Blob) {
            // @ts-ignore
            for await (const data of chunk.stream()) {
                const res = await this.fileHandle.writev([data as Buffer], this.position);
                this.position += res.bytesWritten;
                this.size += res.bytesWritten;
            }
            return;
        }

        const res = await this.fileHandle.writev([chunk], this.position);
        this.position += res.bytesWritten;
        this.size += res.bytesWritten;
    }

    async close() {
        await this.fileHandle.close();
    }
}

export class FileHandle implements ImpleFileHandle<Sink, MyFile> {
    constructor(public path: string, public name: string) {}

    public kind = "file" as const;

    public async getFile() {
        const _stat = await fs.stat(this.path).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        /*return new MyBlob([
      new BlobDataItem(this.path, 0, stat.size, stat.mtimeMs),
    ]);*/
        return await fileFrom(this.path);
        /*return await new Promise<MyFile>((_resolve, _reject) => {
      console.log("calling getFile()");
    });*/
    }

    async isSameEntry(other: any): Promise<boolean> {
        return this.path === this.getPath.apply(other);
    }

    async createWritable() {
        const fileHandle = await fs.open(this.path, "r+").catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        const { size } = await fileHandle.stat();
        return new Sink(fileHandle, size);
    }

    private getPath() {
        return this.path;
    }
}

export class FolderHandle implements ImplFolderHandle<FileHandle, FolderHandle> {
    constructor(public path: string, public name = "") {}
    public writable = true;
    public kind = "directory" as const;

    resolve(_possibleDescendant: FileHandle | FolderHandle): Promise<string[] | null> {
        throw new Error("Method not implemented.");
    }

    public isSameEntry(other: any) {
        return this.path === other.path;
    }

    public async *entries(): AsyncGenerator<readonly [string, FileHandle | FolderHandle], void, unknown> {
        const dir = this.path;
        const items = await fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of items) {
            const path = join(dir, name);
            const stat = await fs.lstat(path);
            if (stat.isFile()) {
                yield [name, new FileHandle(path, name)] as const;
            } else if (stat.isDirectory()) {
                yield [name, new FolderHandle(path, name)] as const;
            }
        }
    }

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        const path = join(this.path, name);
        const stat = await fs.lstat(path).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        const isDirectory = stat?.isDirectory();
        if (stat && isDirectory) return new FolderHandle(path, name);
        if (stat && !isDirectory) throw new TypeMismatchError();
        if (!options.create) throw new NotFoundError();
        await fs.mkdir(path);
        return new FolderHandle(path, name);
    }

    public async getFileHandle(name: string, opts: { create?: boolean } = {}) {
        const path = join(this.path, name);
        const stat = await fs.lstat(path).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        if (stat) {
            if (stat.isFile()) return new FileHandle(path, name);
            else throw new TypeMismatchError();
        }
        if (!opts.create) throw new NotFoundError();
        await (await fs.open(path, "w")).close();
        return new FileHandle(path, name);
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

export default (path: string) => new FolderHandle(path);
