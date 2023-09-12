import * as fsSync from "node:fs";
import * as fs from "node:fs/promises";
import { join } from "node:path";

import {
    FileSystemDirectoryHandle,
    FileSystemFileHandle,
    FileSystemHandlePermissionDescriptor,
    FileSystemSyncAccessHandle,
    FileSystemWritableFileStream,
    InvalidModificationError,
    InvalidStateError,
    NFileSystemWritableFileStream,
    NotFoundError,
    PreNameCheck,
    Stat,
    Statable,
    SyntaxError,
    TypeMismatchError,
} from "@wasm-env/fs-js";
import { ImpleFileHandle, ImplFolderHandle, DefaultSink, FileSystemCreateWritableOptions } from "@wasm-env/fs-js";

// @ts-ignore
import { WritableStreamDefaultWriter, FileBlob, BunFile } from "bun";
//import { WritableStreamDefaultWriter, FileBlob, BunFile } from "bun-types";

const BUN_FS_DEBUG = false;

export function bunFsDebug(msg?: any, ...optionalParams: any[]): void {
    if (BUN_FS_DEBUG) {
        console.log(...msg);
    }
}

interface BunStats {
    ino: bigint;
    dev: bigint;
    ctimeNs: bigint;
    atimeNs: bigint;
    mtimeNs: bigint;
    size: bigint;
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

        try {
            const chunkLength = chunk.byteLength;
            bunFsDebug("write else chunkLength: ", chunkLength);
            const written = fsSync.writeSync(this.fileHandleNumber, chunk, 0, chunkLength, this.position);
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

// @ts-ignore because of typescript .prototype bug regarding File/Blob
export class BunFileHandle implements ImpleFileHandle<BunSink, FileBlob>, FileSystemFileHandle, Statable {
    constructor(public path: string, public name: string) {}

    public kind = "file" as const;

    // @ts-ignore because of typescript .prototype bug regarding File/Blob
    async getFile() {
        try {
            // @ts-ignore
            const bf = Bun.file(this.path) as BunFile;
            const f = bf;
            return f;
        } catch (err: any) {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        }
    }

    async isSameEntry(other: any): Promise<boolean> {
        return this.path === this.getPath.apply(other);
    }

    // @ts-ignore because of typescript .prototype bug regarding File/Blob
    async createWritableSink(options?: FileSystemCreateWritableOptions) {
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

    async createWritable(options?: FileSystemCreateWritableOptions) {
        const sink = await this.createWritableSink(options);
        const fstream = new NFileSystemWritableFileStream(sink);
        return fstream;
    }

    private getPath() {
        return this.path;
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

    async stat(): Promise<Stat> {
        const nodeStat = await fs.stat(this.path, { bigint: true });
        const stat = bunStatToStat(nodeStat);
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

export class BunFolderHandle
    implements ImplFolderHandle<BunFileHandle, BunFolderHandle>, FileSystemDirectoryHandle, Statable
{
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

    async isSameEntry(other: any) {
        return this.path === other.path;
    }

    async *entries(): AsyncGenerator<[string, BunFileHandle | BunFolderHandle]> {
        bunFsDebug("bunfs: entries");
        const dir = this.path;
        const items = await fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of items) {
            const path = join(dir, name);
            const stat = await fs.lstat(path);
            if (stat.isFile()) {
                yield [name, new BunFileHandle(path, name)];
            } else if (stat.isDirectory()) {
                yield [name, new BunFolderHandle(path, name)];
            }
        }
    }

    async *values(): AsyncGenerator<BunFileHandle | BunFolderHandle> {
        bunFsDebug("bunfs: values");
        const dir = this.path;
        const items = await fs.readdir(dir).catch((err) => {
            if (err.code === "ENOENT") throw new NotFoundError();
            throw err;
        });
        for (const name of items) {
            const path = join(dir, name);
            const stat = await fs.lstat(path);
            bunFsDebug("bunfs: values name: ", name);
            if (stat.isFile()) {
                yield new BunFileHandle(path, name);
            } else if (stat.isDirectory()) {
                yield new BunFolderHandle(path, name);
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
            const path = join(dir, name);
            const stat = await fs.lstat(path);
            if (stat.isFile()) {
                yield name;
            } else if (stat.isDirectory()) {
                yield name;
            }
        }
    }

    async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
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

    async getFileHandle(name: string, opts: { create?: boolean } = {}) {
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
        const fHandle = await fs.open(path, "w");
        fsSync.closeSync(fHandle);
        return new BunFileHandle(path, name);
    }

    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
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
        const bunStat = await fs.stat(this.path, { bigint: true });
        const stat = bunStatToStat(bunStat);
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

export default (path: string) => new BunFolderHandle(path);

function bunStatToStat(stat: BunStats): Stat {
    const ctimeNs = stat.ctimeNs;
    const mtimeNs = stat.mtimeNs;
    const atimeNs = stat.atimeNs;
    const ino = stat.ino;
    const s: Stat = {
        creationTime: ctimeNs,
        accessedTime: atimeNs,
        modifiedTime: mtimeNs,
        inode: ino,
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
