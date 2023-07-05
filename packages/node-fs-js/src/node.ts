import { promises as fs } from "node:fs";

import { join } from "node:path";

import {
    InvalidModificationError,
    InvalidStateError,
    NFileSystemWritableFileStream,
    NotFoundError,
    SyntaxError,
    TypeMismatchError,
    PreNameCheck,
    Inodable,
} from "@wasm-env/fs-js";
import { fileFrom } from "./fetch-blob/form.js";
import {
    ImpleFileHandle,
    ImplFolderHandle,
    DefaultSink,
    FileSystemCreateWritableOptions,
    FileSystemWritableFileStream,
} from "@wasm-env/fs-js";
import type { MyFile } from "./fetch-blob/file.js";

type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

type SinkFileHandle = PromiseType<ReturnType<typeof fs.open>>;

export class NodeSink extends DefaultSink<SinkFileHandle> implements FileSystemWritableFileStream {
    constructor(fileHandle: SinkFileHandle, size: number) {
        super(fileHandle);
        this.size = size;
    }

    getWriter(): WritableStreamDefaultWriter<any> {
        const w = new WritableStreamDefaultWriter<any>(this);
        return w;
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

export class NodeFileHandle implements ImpleFileHandle<NodeSink, MyFile>, Inodable {
    constructor(public path: string, public name: string, public inode = 0n) {}

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

    public async createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>{
        const sink = await this.createWritableSink(options);
        const fstream = new NFileSystemWritableFileStream(sink);
        return fstream;
    }
    
    public async createWritableSink(options?: FileSystemCreateWritableOptions) {
        const fileHandle = await fs.open(this.path, "r+").catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        const { size } = await fileHandle.stat();
        if (options && !options.keepExistingData) {
            const s = new NodeSink(fileHandle, size);
            await s.truncate(0);
            return s;
        }
        return new NodeSink(fileHandle, size);
    }

    private getPath() {
        return this.path;
    }
}

export class NodeFolderHandle implements ImplFolderHandle<NodeFileHandle, NodeFolderHandle>, Inodable{
    constructor(public path: string, public name = "", public inode=0n) {}
    public writable = true;
    public kind = "directory" as const;

    [Symbol.asyncIterator]() {
        return this.entries();
    }

    get [Symbol.toStringTag]() {
        return "FileSystemDirectoryHandle";
    }
    
    resolve(_possibleDescendant: NodeFileHandle | NodeFolderHandle): Promise<string[] | null> {
        throw new Error("Method not implemented.");
    }

    public isSameEntry(other: any) {
        return this.path === other.path;
    }

    /*
    async *entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]> {
        for await (const [, entry] of this.entriesInner()) {
            const entryName = entry.name;
                yield [
                    entryName,
                    entry.kind === "file"
                        ? new NFileSystemFileHandle(entry)
                        : new NFileSystemDirectoryHandle(entry, this.secretStore),
                ];
        }
    }
    */

    public async *entries(): AsyncGenerator<[string, NodeFileHandle | NodeFolderHandle]> {
        const dir = this.path;
        const items = fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of await items) {
            const path = join(dir, name);
            const stat = await fs.lstat(path);
            if (stat.isFile()) {
                yield [name, new NodeFileHandle(path, name, BigInt(stat.ino))];
            } else if (stat.isDirectory()) {
                yield [name, new NodeFolderHandle(path, name, BigInt(stat.ino))];
            }
        }
    }

    public async *values(): AsyncGenerator<NodeFileHandle | NodeFolderHandle> {
        const dir = this.path;
        const items = await fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of items) {
            const path = join(dir, name);
            const stat = await fs.lstat(path);
            if (stat.isFile()) {
                yield new NodeFileHandle(path, name, BigInt(stat.ino));
            } else if (stat.isDirectory()) {
                yield new NodeFolderHandle(path, name, BigInt(stat.ino));
            }
        }
    }

    public async *keys(): AsyncGenerator<string> {
        const dir = this.path;
        const items = await fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of items) {
            yield name;
        }
    }

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        PreNameCheck(name);
        const path = join(this.path, name);
        const stat = await fs.lstat(path).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        const isDirectory = stat?.isDirectory();
        if (stat && isDirectory) return new NodeFolderHandle(path, name, BigInt(stat.ino));
        if (stat && !isDirectory) throw new TypeMismatchError();
        if (!options.create) throw new NotFoundError();
        await fs.mkdir(path);
        const stat2 = await fs.lstat(path).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        let newinode = 0;
        if (stat2) {
            newinode = stat2.ino;
        }
        return new NodeFolderHandle(path, name, BigInt(newinode));
    }

    public async getFileHandle(name: string, opts: { create?: boolean } = {}) {
        PreNameCheck(name);
        const path = join(this.path, name);
        const stat = await fs.lstat(path).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        if (stat) {
            if (stat.isFile()) return new NodeFileHandle(path, name, BigInt(stat.ino));
            else throw new TypeMismatchError();
        }
        if (!opts.create) throw new NotFoundError();
        const fhandle = await fs.open(path, "w");
        const stat2 = await fhandle.stat();
        await fhandle.close();
        return new NodeFileHandle(path, name, BigInt(stat2.ino));
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

export default (path: string) => new NodeFolderHandle(path);
