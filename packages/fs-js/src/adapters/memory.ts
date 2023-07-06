import { FileSystemWritableFileStream } from "../FileSystemAccess.js";
import {
    InvalidModificationError,
    InvalidStateError,
    NotAllowedError,
    NotFoundError,
    SyntaxError,
    TypeMismatchError,
} from "../errors.js";
import { DefaultSink, ImpleFileHandle, ImplFolderHandle } from "./implements.js";
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

export class MemoryFileHandle implements ImpleFileHandle<MemorySink, File> {
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

    public async getFile() {
        if (this.deleted) throw new NotFoundError();
        return this.file;
    }

    public async createWritableSink(options?: FileSystemCreateWritableOptions) {
        if (!this.writable) throw new NotAllowedError();
        if (this.deleted) throw new NotFoundError();
        if (options && !options.keepExistingData) {
            const s = new MemorySink(this);
            await s.truncate(0);
            return s;
        }
        return new MemorySink(this);
    }

    public async createWritable(options?: FileSystemCreateWritableOptions) {
        const sink = await this.createWritableSink(options);
        const fstream = new NFileSystemWritableFileStream(sink);
        return fstream;
    }

    public async isSameEntry(other: any): Promise<boolean> {
        return this === other;
    }

    public destroy() {
        this.deleted = true;
        // @ts-ignore
        this.file = null;
    }
}

export class MemoryFolderHandle implements ImplFolderHandle<MemoryFileHandle, MemoryFolderHandle> {
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

    public async *entries() {
        if (this.deleted) throw new NotFoundError();
        yield* Object.entries(this._entries);
    }

    public async *values() {
        if (this.deleted) throw new NotFoundError();
        yield* Object.values(this._entries);
    }

    public async *keys() {
        if (this.deleted) throw new NotFoundError();
        yield* Object.keys(this._entries);
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

    public isSameEntry(other: any) {
        return this === other;
    }

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
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
            if (options.create) {
                return (this._entries[name] = new MemoryFolderHandle(name));
            } else {
                throw new NotFoundError();
            }
        }
    }

    // @ts-ignore
    public async getFileHandle(name: string, options?: { create?: boolean }): Promise<MemoryFileHandle | undefined> {
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
            return undefined;
        }
    }

    public async removeEntry(name: string, opts?: { recursive?: boolean }): Promise<void> {
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

    public async queryPermission() {
        return "granted" as const;
    }
}

export default (_path: string) => new MemoryFolderHandle("");
