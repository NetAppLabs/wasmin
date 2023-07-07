import { FileSystemHandlePermissionDescriptor, InvalidStateError } from "./index.js";
import { FileSystemFileHandle, FileSystemDirectoryHandle } from "./FileSystemAccess.js";

export interface ImpleSink<T> extends UnderlyingSink<any> {
    fileHandle: T;
    size: number;
    position: number;

    abort: (reason?: any) => Promise<void>;
    write: (data: FileSystemWriteChunkType) => Promise<void>;
    close: () => Promise<void>;
    seek: (position: number) => Promise<void>;
    truncate: (size: number) => Promise<void>;
}

export abstract class DefaultSink<T> implements ImpleSink<T> {
    constructor(fileHandle: T) {
        this.fileHandle = fileHandle;
        this.size = 0;
        this.position = 0;
        this.locked = false;
    }
    private _closed = false;
    fileHandle: T;
    size: number;
    position: number;
    locked: boolean;
    file?: File;

    abstract close(): Promise<void>;

    async seek(position: number): Promise<void> {
        return this.write({ type: "seek", position });
    }

    async truncate(size: number): Promise<void> {
        return this.write({ type: "truncate", size });
    }

    async genericWrite(chunk: any) {
        let file = this.file;
        if (file) {
            if (typeof chunk === "object") {
                if (chunk.type === "write") {
                    if (Number.isInteger(chunk.position) && chunk.position >= 0) {
                        this.position = chunk.position;
                        if (this.size < chunk.position) {
                            file = new File([file, new ArrayBuffer(chunk.position - this.size)], file.name, file);
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

            let blob = file;
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
    }

    abstract write(data: FileSystemWriteChunkType): Promise<void>;

    abstract getWriter(): WritableStreamDefaultWriter;

    async abort(_reason?: any): Promise<void> {
        return;
    }

    get [Symbol.toStringTag]() {
        return "DefaultSink";
    }
}

export interface ImpleFileHandle<F extends File, S extends ImpleSink<any>> {
    kind: "file";
    path: string;
    name: string;

    getFile: () => Promise<F>;
    isSameEntry: (other: any) => Promise<boolean>;
    createWritableSink: (options?: FileSystemCreateWritableOptions) => Promise<S>;
    createWritable: (options?: FileSystemCreateWritableOptions) => Promise<FileSystemWritableFileStream>;
}

export interface ImplFolderHandle<F extends FileSystemFileHandle, D extends FileSystemDirectoryHandle> {
    kind: "directory";
    path: string;
    name: string;

    queryPermission: (descriptor?: FileSystemHandlePermissionDescriptor) => Promise<PermissionState>;

    requestPermission: (descriptor?: FileSystemHandlePermissionDescriptor) => Promise<PermissionState>;

    isSameEntry: (other: any) => Promise<boolean>;

    entries: () => AsyncGenerator<[string, F | D]>;

    values: () => AsyncGenerator<F | D>;

    keys: () => AsyncGenerator<string>;

    getDirectoryHandle: (name: string, options?: { create?: boolean; capture?: boolean }) => Promise<D>;

    getFileHandle: (name: string, options?: { create?: boolean }) => Promise<F>;

    removeEntry: (name: string, opts: { recursive?: boolean }) => Promise<void>;

    resolve(possibleDescendant: F | D): Promise<string[] | null>;
}
