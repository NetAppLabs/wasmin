import {
    FileSystemHandle,
    FileSystemFileHandle,
    FileSystemDirectoryHandle,
    FileSystemWritableFileStream,
    FileSystemHandlePermissionDescriptor,
    Mountable,
    FileSystemSyncAccessHandle,
} from "../index.js";
import { InvalidModificationError, NotAllowedError, NotFoundError, TypeMismatchError } from "../errors.js";
import { DefaultSink, ImpleFileHandle, ImplFolderHandle } from "../implements.js";
import { FileSystemCreateWritableOptions, NFileSystemWritableFileStream, PreNameCheck } from "../index.js";
import { MountedEntry } from "../ExtHandles.js";
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

    async write(chunk: FileSystemWriteChunkType) {
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
        this.position = 0;
        this.size = 0;
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
    implements ImplFolderHandle<MemoryFileHandle, MemoryFolderHandle>, FileSystemDirectoryHandle, Mountable
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

    async mountHandle(handle: FileSystemHandle): Promise<FileSystemHandle> {
        return new Promise<FileSystemHandle>((resolve, _reject) => {
            const subDir = handle.name;
            const subHandle = handle as unknown as MemoryFolderHandle | MemoryFileHandle;
            this.markHandleExternal(subHandle);
            this._entries[subDir] = subHandle;
            const fsHandle = subHandle as unknown as FileSystemHandle;
            resolve(fsHandle);
        });
    }
    async removeMounted(path: string): Promise<void> {
        let indexOfSlash = path.indexOf("/");
        if (indexOfSlash == -1 ) {
            await this.removeEntry(path, {recursive: false, onlyExternal: true})
        } else if (indexOfSlash == 0 ) {
            let subPath = path.substring(1);
            await this.removeMounted(subPath);
        } else if (indexOfSlash > 0 ) {
            let subName = path.substring(0, indexOfSlash);
            let restPath = path.substring(indexOfSlash+1);
            let subdir = await this.getDirectoryHandle(subName);
            await subdir.removeMounted(restPath);
        }
    }
    async listMounted(recurseDepth?: number): Promise<MountedEntry[]> {
        if (recurseDepth == undefined) {
            recurseDepth = 3;
        }
        let ret: MountedEntry[] = [];
        for (const [key, value] of Object.entries(this._entries)) {
            if (this.isExternalHandle(value)) {
                // @ts-ignore
                let source = extHandle.url;
                let entry: MountedEntry = {
                    path: key,
                    source: source,
                    attributes: []
                }
                ret.push(entry);
            } else {
                if (recurseDepth > 0) {
                    if (value.kind == "directory") {
                        let subMounted = await value.listMounted(recurseDepth-1);
                        for (const subMount of subMounted) {
                            let subPath = subMount.path;
                            subMount.path = key + "/" + subPath;
                            ret.push(subMount);
                        }
                    }
                }
            }
        }
        return ret;
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

    async removeEntry(name: string, opts?: { recursive?: boolean, onlyExternal?: boolean }): Promise<void> {
        PreNameCheck(name);
        const entry = this._entries[name];
        if (!entry) throw new NotFoundError();
        if (this.isExternalHandle(entry)) {
            let onlyExternal = false;
            if (opts !== undefined) {
                if (opts.onlyExternal !== undefined) {
                    onlyExternal = opts.onlyExternal;
                }
            }
            if (onlyExternal) {
                delete this._entries[name];
                return;
            }
        }
        if (opts) {
            entry.destroy(opts.recursive);
        } else {
            entry.destroy();
        }
        delete this._entries[name];
    }

    isExternalHandle(handle: FileSystemHandle): boolean {
        let handleAny = handle as any;
        if (handleAny.isExternal !== undefined) {
            return true;
        }
        return false;
    }

    markHandleExternal(handle: FileSystemHandle) {
        // Mark the handle with a property so we can track was external
        Object.defineProperty(handle, "isExternal", {
            enumerable: false,
            value: true,
        })
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
