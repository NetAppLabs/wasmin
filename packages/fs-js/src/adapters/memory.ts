import {
    FileSystemHandle,
    FileSystemFileHandle,
    FileSystemDirectoryHandle,
    FileSystemWritableFileStream,
    FileSystemHandlePermissionDescriptor,
} from "../index.js";
import { InvalidModificationError, NotAllowedError, NotFoundError, TypeMismatchError } from "../errors.js";
import { DefaultSink, ImpleFileHandle, ImplFolderHandle } from "../implements.js";
import { FileSystemCreateWritableOptions, NFileSystemWritableFileStream, PreNameCheck } from "../index.js";
export class MemorySink extends DefaultSink<MemoryFileHandle> implements FileSystemWritableFileStream {
    constructor(fileHandle: MemoryFileHandle) {
        super(fileHandle);
        this.fileHandle = fileHandle;
        this.file = fileHandle.file;
        this.size = fileHandle.file.size;
        this.position = 0;
    }

    fileHandle: MemoryFileHandle;

    async abort() {
        await this.close();
    }

    async write(chunk: any) {
        return await this.genericWrite(chunk);
    }

    getWriter(): WritableStreamDefaultWriter<any> {
        const w = new WritableStreamDefaultWriter<any>(this);
        return w;
    }

    async close() {
        if (this.fileHandle.deleted) throw new NotFoundError();
        if (this.file) {
            this.fileHandle.file = this.file;
        }
        this.file = undefined;
        this.position = this.size = 0;
    }
}

export class MemoryFileHandle implements ImpleFileHandle<File, MemorySink>, FileSystemFileHandle {
    constructor(name = "", file = new File([], name), writable = true) {
        this.file = file;
        this.name = name;
        this.deleted = false;
        this.writable = writable;
        this.readable = true;
    }

    deleted: boolean;
    file: File;
    name: string;
    readable: boolean;
    writable: boolean;
    path = "";
    public kind = "file" as const;

    async getFile() {
        if (this.deleted) throw new NotFoundError();
        return this.file;
    }

    async createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle> {
        throw new Error("createSyncAccessHandle not implemented");
    }

    async createWritableSink(options?: FileSystemCreateWritableOptions) {
        if (!this.writable) throw new NotAllowedError();
        if (this.deleted) throw new NotFoundError();
        if (options && !options.keepExistingData) {
            const s = new MemorySink(this);
            await s.truncate(0);
            return s;
        }
        return new MemorySink(this);
    }

    async createWritable(options?: FileSystemCreateWritableOptions) {
        const sink = await this.createWritableSink(options);
        const fstream = new NFileSystemWritableFileStream(sink);
        return fstream;
    }

    async isSameEntry(other: any): Promise<boolean> {
        return this === other;
    }

    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    public destroy() {
        this.deleted = true;
        // @ts-ignore
        this.file = null;
    }
}

export class MemoryFolderHandle
    implements ImplFolderHandle<MemoryFileHandle, MemoryFolderHandle>, FileSystemDirectoryHandle
{
    constructor(name: string, writable = true) {
        this.name = name;
        this.deleted = false;
        this._entries = {};
        this.writable = writable;
        this.readable = true;
    }
    _entries: Record<string, MemoryFolderHandle | MemoryFileHandle>;
    name: string;
    deleted: boolean;
    readable: boolean;
    writable: boolean;
    public kind = "directory" as const;
    public path = "";

    [Symbol.asyncIterator]() {
        return this.entries();
    }

    get [Symbol.toStringTag]() {
        return "FileSystemDirectoryHandle";
    }

    async *entries(): AsyncGenerator<[string, MemoryFileHandle | MemoryFolderHandle]> {
        if (this.deleted) throw new NotFoundError();
        for (const [k, v] of Object.entries(this._entries)) {
            yield [k, v];
        }
    }

    async *values(): AsyncGenerator<MemoryFileHandle | MemoryFolderHandle> {
        if (this.deleted) throw new NotFoundError();
        for (const v of Object.values(this._entries)) {
            yield v;
        }
    }

    async *keys(): AsyncGenerator<string> {
        if (this.deleted) throw new NotFoundError();
        for (const k of Object.keys(this._entries)) {
            yield k;
        }
    }

    async insertHandle(handle: FileSystemHandle): Promise<FileSystemHandle> {
        return new Promise<FileSystemHandle>((resolve, _reject) => {
            const subDir = handle.name;
            const subHandle = handle as unknown as MemoryFolderHandle | MemoryFileHandle;
            this._entries[subDir] = subHandle;
            const fsHandle = subHandle as unknown as FileSystemHandle;
            resolve(fsHandle);
        });
    }

    async isSameEntry(other: FileSystemHandle): Promise<boolean> {
        return this === other;
    }

    async getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<MemoryFolderHandle> {
        PreNameCheck(name);
        if (this.deleted) throw new NotFoundError();
        const entry = this._entries[name];
        if (entry) {
            // entry exist
            if (entry instanceof MemoryFileHandle) {
                throw new TypeMismatchError();
            } else {
                return entry;
            }
        } else {
            if (options && options.create) {
                return (this._entries[name] = new MemoryFolderHandle(name));
            } else {
                throw new NotFoundError();
            }
        }
    }

    // @ts-ignore
    async getFileHandle(name: string, options?: { create?: boolean }): Promise<MemoryFileHandle> {
        PreNameCheck(name);
        let do_create = false;
        if (options) {
            if (options.create) {
                do_create = options.create;
            }
        }
        const entry = this._entries[name];
        const isFile = entry instanceof MemoryFileHandle;
        if (entry && isFile) return entry;
        if (entry && !isFile) throw new TypeMismatchError();
        if (!entry && !do_create) throw new NotFoundError();
        if (!entry && do_create) {
            return (this._entries[name] = new MemoryFileHandle(name));
        } else {
            throw new NotFoundError();
        }
    }

    async removeEntry(name: string, opts?: { recursive?: boolean }): Promise<void> {
        PreNameCheck(name);
        const entry = this._entries[name];
        if (!entry) throw new NotFoundError();
        if (opts) {
            entry.destroy(opts.recursive);
        } else {
            entry.destroy();
        }
        delete this._entries[name];
    }

    public destroy(recursive?: boolean) {
        for (const x of Object.values(this._entries)) {
            if (!recursive) throw new InvalidModificationError();
            x.destroy(recursive);
        }
        this._entries = {};
        this.deleted = true;
    }

    async queryPermission() {
        return "granted" as const;
    }

    async requestPermission() {
        return "granted" as const;
    }

    async resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null> {
        return null;
    }
}

export default (_path: string) => new MemoryFolderHandle("");
