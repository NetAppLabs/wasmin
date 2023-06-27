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
import { FileSystemCreateWritableOptions } from "../index.js";
export class Sink extends DefaultSink<FileHandle> {
    constructor(fileHandle: FileHandle) {
        super(fileHandle);
        this.fileHandle = fileHandle;
        this.file = fileHandle.file;
        this.size = fileHandle.file.size;
        this.position = 0;
    }

    fileHandle: FileHandle;
    file: FileHandle["file"];
    size: FileHandle["file"]["size"];
    position: number;

    async abort() {
        await this.close();
    }

    async write(chunk: any) {
        let file = this.file;

        if (typeof chunk === "object") {
            if (chunk.type === "write") {
                if (Number.isInteger(chunk.position) && chunk.position >= 0) {
                    this.position = chunk.position;
                    if (this.size < chunk.position) {
                        this.file = new File(
                            [this.file, new ArrayBuffer(chunk.position - this.size)],
                            this.file.name,
                            this.file
                        );
                    }
                }
                if (!("data" in chunk)) {
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
                    throw new SyntaxError("seek requires a position argument");
                }
            } else if (chunk.type === "truncate") {
                if (Number.isInteger(chunk.size) && chunk.size >= 0) {
                    file =
                        chunk.size < this.size
                            ? new File([file.slice(0, chunk.size)], file.name, file)
                            : new File([file, new Uint8Array(chunk.size - this.size)], file.name);

                    this.size = file.size;
                    if (this.position > file.size) {
                        this.position = file.size;
                    }
                    this.file = file;
                    return;
                } else {
                    throw new SyntaxError("truncate requires a size argument");
                }
            }
        }

        chunk = new Blob([chunk]);

        let blob = this.file;
        // Calc the head and tail fragments
        const head = blob.slice(0, this.position);
        const tail = blob.slice(this.position + chunk.size);

        // Calc the padding
        let padding = this.position - head.size;
        if (padding < 0) {
            padding = 0;
        }
        blob = new File([head, new Uint8Array(padding), chunk, tail], blob.name);

        this.size = blob.size;
        this.position += chunk.size;

        this.file = blob;
    }

    async close() {
        if (this.fileHandle.deleted) throw new NotFoundError();
        this.fileHandle.file = this.file;
        // @ts-ignore
        this.file = this.position = this.size = null;
    }
}

export class FileHandle implements ImpleFileHandle<Sink, File> {
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

    public async createWritable(options?: FileSystemCreateWritableOptions) {
        if (!this.writable) throw new NotAllowedError();
        if (this.deleted) throw new NotFoundError();
        if (options && !options.keepExistingData ){
            const s = new Sink(this);
            await s.truncate(0);
            return s;
        }
        return new Sink(this);
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

export class FolderHandle implements ImplFolderHandle<FileHandle, FolderHandle> {
    constructor(name: string, writable = true) {
        this.name = name;
        this.deleted = false;
        this._entries = {};
        this.writable = writable;
        this.readable = true;
    }

    _entries: Record<string, FolderHandle | FileHandle>;
    name: string;
    deleted: boolean;
    readable: boolean;
    writable: boolean;
    public kind = "directory" as const;
    public path = "";

    public async *entries() {
        if (this.deleted) throw new NotFoundError();
        yield* Object.entries(this._entries);
    }

    async insertHandle(handle: FileSystemHandle): Promise<FileSystemHandle> {
        return new Promise<FileSystemHandle>((resolve, _reject) => {
            const subDir = handle.name;
            const subHandle = handle as unknown as FolderHandle | FileHandle;
            this._entries[subDir] = subHandle;
            const fsHandle = subHandle as unknown as FileSystemHandle;
            resolve(fsHandle);
        });
    }

    public isSameEntry(other: any) {
        return this === other;
    }

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        if (this.deleted) throw new NotFoundError();
        const entry = this._entries[name];
        if (entry) {
            // entry exist
            if (entry instanceof FileHandle) {
                throw new TypeMismatchError();
            } else {
                return entry;
            }
        } else {
            if (options.create) {
                return (this._entries[name] = new FolderHandle(name));
            } else {
                throw new NotFoundError();
            }
        }
    }

    // @ts-ignore
    public async getFileHandle(name: string, options?: { create?: boolean }): Promise<FileHandle | undefined> {
        let do_create = false;
        if (options) {
            if (options.create) {
                do_create = options.create;
            }
        }
        const entry = this._entries[name];
        const isFile = entry instanceof FileHandle;
        if (entry && isFile) return entry;
        if (entry && !isFile) throw new TypeMismatchError();
        if (!entry && !do_create) throw new NotFoundError();
        if (!entry && do_create) {
            return (this._entries[name] = new FileHandle(name));
        } else {
            return undefined;
        }
    }

    public async removeEntry(name: string, opts: { recursive?: boolean }): Promise<void> {
        const entry = this._entries[name];
        if (!entry) throw new NotFoundError();
        entry.destroy(opts.recursive);
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
}

export default (_path: string) => new FolderHandle("");
