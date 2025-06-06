import { promises as fs } from "node:fs";

import { join, basename } from "node:path";

import {
    InvalidModificationError,
    InvalidStateError,
    NFileSystemWritableFileStream,
    NotFoundError,
    SyntaxError,
    TypeMismatchError,
    PreNameCheck,
    Stat,
    FileSystemHandlePermissionDescriptor,
    Statable,
    FileSystemSyncAccessHandle,
} from "@netapplabs/fs-js";
import { fileFrom } from "./fetch-blob/form.js";
import { ImpleFileHandle, ImplFolderHandle, DefaultSink, FileSystemCreateWritableOptions } from "@netapplabs/fs-js";
import { FileSystemWritableFileStream, FileSystemDirectoryHandle, FileSystemFileHandle } from "@netapplabs/fs-js";
import type { MyFile } from "./fetch-blob/file.js";

type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

type SinkFileHandle = PromiseType<ReturnType<typeof fs.open>>;

interface NodeStats {
    ino: bigint;
    dev: bigint;
    ctimeNs: bigint;
    atimeNs: bigint;
    mtimeNs: bigint;
    size: bigint;
}

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
            let enc = new TextEncoder(); // always utf-8
            //chunk = Buffer.from(chunk);
            chunk = enc.encode(chunk);
        } else if (chunk instanceof Blob) {
            // @ts-ignore
            for await (const data of chunk.stream()) {
                const res = await this.fileHandle.writev([data as Uint8Array], this.position);
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

export class NodeFileHandle
    // @ts-ignore because of typescript .prototype bug regarding File/Blob
    implements ImpleFileHandle<MyFile, NodeSink>, FileSystemFileHandle, Statable
{
    constructor(public path: string, public name: string) {}

    kind = "file" as const;

    // @ts-ignore because of typescript .prototype bug regarding File/Blob
    async getFile(): Promise<MyFile> {
        const _stat = await fs.stat(this.path, { bigint: true }).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        // @ts-ignore because of typescript .prototype bug regarding File/Blob
        return await fileFrom(this.path);
    }

    async isSameEntry(other: any): Promise<boolean> {
        return this.path === this.getPath.apply(other);
    }

    async createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream> {
        const sink = await this.createWritableSink(options);
        const fstream = new NFileSystemWritableFileStream(sink);
        return fstream;
    }

    async createWritableSink(options?: FileSystemCreateWritableOptions) {
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

    async createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle> {
        throw new Error("createSyncAccessHandle not implemented");
    }

    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    private getPath() {
        return this.path;
    }

    async stat(): Promise<Stat> {
        const nodeStat = await fs.stat(this.path, { bigint: true });
        const stat = nodeStatToStat(nodeStat);
        return stat;
    }

    async updateTimes(accessTime: bigint | null, modifiedTime: bigint | null): Promise<void> {
        let setAccessTime = accessTime;
        let setModifiedTime = modifiedTime;
        if (setAccessTime == null || setModifiedTime == null) {
            const thisStat = await this.stat();
            if (setModifiedTime == null) {
                setModifiedTime = thisStat.modifiedTime;
            }
            if (setAccessTime == null) {
                setAccessTime = thisStat.accessedTime;
            }
        }
        const tSetAccessTime = toUnixTimestampNumber(setAccessTime);
        const tSetModifiedTime = toUnixTimestampNumber(setModifiedTime);
        //utimesSync(this.path, tSetAccessTime, tSetModifiedTime);
        await fs.utimes(this.path, tSetAccessTime, tSetModifiedTime);
    }
}

export class NodeFolderHandle
    implements ImplFolderHandle<NodeFileHandle, NodeFolderHandle>, FileSystemDirectoryHandle, Statable
{
    constructor(public path: string, public name: string) {}
    writable = true;
    kind = "directory" as const;

    [Symbol.asyncIterator]() {
        return this.entries();
    }

    get [Symbol.toStringTag]() {
        return "FileSystemDirectoryHandle";
    }

    resolve(_possibleDescendant: NodeFileHandle | NodeFolderHandle): Promise<string[] | null> {
        throw new Error("Method not implemented.");
    }

    async isSameEntry(other: any) {
        return this.path === other.path;
    }

    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    async *entries(): AsyncGenerator<[string, NodeFileHandle | NodeFolderHandle]> {
        const dir = this.path;
        const items = fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of await items) {
            const path = join(dir, name);
            const stat = await fs.lstat(path, { bigint: true });
            if (stat.isFile()) {
                yield [name, new NodeFileHandle(path, name)];
            } else if (stat.isDirectory()) {
                yield [name, new NodeFolderHandle(path, name)];
            }
        }
    }

    async *values(): AsyncGenerator<NodeFileHandle | NodeFolderHandle> {
        const dir = this.path;
        const items = await fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of items) {
            const path = join(dir, name);
            const stat = await fs.lstat(path, { bigint: true });
            if (stat.isFile()) {
                yield new NodeFileHandle(path, name);
            } else if (stat.isDirectory()) {
                yield new NodeFolderHandle(path, name);
            }
        }
    }

    async *keys(): AsyncGenerator<string> {
        const dir = this.path;
        const items = await fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of items) {
            yield name;
        }
    }

    async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        PreNameCheck(name);
        const path = join(this.path, name);
        const stat = await fs.lstat(path, { bigint: true }).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        const isDirectory = stat?.isDirectory();
        if (stat && isDirectory) return new NodeFolderHandle(path, name);
        if (stat && !isDirectory) throw new TypeMismatchError();
        if (!options.create) throw new NotFoundError();
        await fs.mkdir(path);
        const stat2 = await fs.lstat(path, { bigint: true }).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        if (stat2) {
            return new NodeFolderHandle(path, name);
        } else {
            throw new NotFoundError();
        }
    }

    async getFileHandle(name: string, opts: { create?: boolean } = {}) {
        PreNameCheck(name);
        const path = join(this.path, name);
        const stat = await fs.lstat(path, { bigint: true }).catch((err) => {
            if (err.code !== "ENOENT") throw err;
        });
        if (stat) {
            if (stat.isFile()) return new NodeFileHandle(path, name);
            else throw new TypeMismatchError();
        }
        if (!opts.create) throw new NotFoundError();
        const fhandle = await fs.open(path, "w");
        const stat2 = await fhandle.stat({ bigint: true });
        stat2.ctime;
        await fhandle.close();
        return new NodeFileHandle(path, name);
    }

    async removeEntry(name: string, opts?: { recursive?: boolean }) {
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

    async stat(): Promise<Stat> {
        const nodeStat = await fs.stat(this.path, { bigint: true });
        const stat = nodeStatToStat(nodeStat);
        return stat;
    }

    async updateTimes(accessTime: bigint | null, modifiedTime: bigint | null): Promise<void> {
        let setAccessTime = accessTime;
        let setModifiedTime = modifiedTime;
        if (setAccessTime == null || setModifiedTime == null) {
            const thisStat = await this.stat();
            if (setModifiedTime == null) {
                setModifiedTime = thisStat.modifiedTime;
            }
            if (setAccessTime == null) {
                setAccessTime = thisStat.accessedTime;
            }
        }
        const tSetAccessTime = toUnixTimestampNumber(setAccessTime);
        const tSetModifiedTime = toUnixTimestampNumber(setModifiedTime);
        //utimesSync(this.path, tSetAccessTime, tSetModifiedTime);
        await fs.utimes(this.path, tSetAccessTime, tSetModifiedTime);
    }
}

export default (absolutePath: string) => {
    const name = basename(absolutePath);
    const fh = new NodeFolderHandle(absolutePath, name);
    return fh;
};

function nodeStatToStat(stat: NodeStats): Stat {
    const ctimeNs = stat.ctimeNs;
    const mtimeNs = stat.mtimeNs;
    const atimeNs = stat.atimeNs;
    const ino = stat.ino;
    const size = stat.size;
    const s: Stat = {
        creationTime: ctimeNs,
        accessedTime: atimeNs,
        modifiedTime: mtimeNs,
        inode: ino,
        size
    };
    return s;
}

function toUnixTimestampNumber(timeNs: bigint) {
    let timeMs = Number(timeNs / 1_000_000n);
    const timeMsFloored = Math.round(timeMs);
    // convert to fractional UNIX timestamp like 123.456
    const timeMsUnixSecondsFractional = timeMsFloored / 1000;
    return timeMsUnixSecondsFractional;
}
