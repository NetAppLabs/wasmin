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

    async genericWrite(chunk: FileSystemWriteChunkType) {
        let file = this.file;
        let chunkData: BufferSource | Blob | string | null | undefined = chunk as (BufferSource | Blob | string);
        if (file) {
            if (typeof chunk === "object") {
                let wChunk = chunk as WriteParams;
                if (wChunk.type === "write") {
                    if (wChunk.position !== undefined && wChunk.position !== null && Number.isInteger(wChunk.position) && wChunk.position >= 0) {
                        this.position = wChunk.position;
                        if (this.size < wChunk.position) {
                            file = new File([file, new ArrayBuffer(wChunk.position - this.size)], file.name, file);
                        }
                    }
                    if (!("data" in chunk)) {
                        throw new SyntaxError("write requires a data argument");
                    }
                    chunkData = wChunk.data;
                } else if (wChunk.type === "seek") {
                    if (wChunk.position !== undefined && wChunk.position !== null && Number.isInteger(wChunk.position) && wChunk.position >= 0) {
                        if (this.size < wChunk.position) {
                            throw new InvalidStateError();
                        }
                        this.position = wChunk.position;
                        return;
                    } else {
                        throw new SyntaxError("seek requires a position argument");
                    }
                } else if (wChunk.type === "truncate") {
                    if (wChunk.size !== undefined && wChunk.size !== null && Number.isInteger(wChunk.size) && wChunk.size >= 0) {
                        file =
                            wChunk.size < this.size
                                ? new File([file.slice(0, wChunk.size)], file.name, file)
                                : new File([file, new Uint8Array(wChunk.size - this.size)], file.name);

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

            let blobChunk = (chunkData !== undefined && chunkData !== null ) ? new Blob([chunkData]) : new Blob([]);
            let blobFile = file;

            // Calculate the head and tail fragments
            const head = blobFile.slice(0, this.position);
            const tail = blobFile.slice(this.position + blobChunk.size);
            // Calculate the padding
            let padding = this.position - head.size;
            if (padding < 0) {
                padding = 0;
            }
            blobFile = new File([head, new Uint8Array(padding), blobChunk, tail], blobFile.name);

            this.size = blobFile.size;
            this.position += blobChunk.size;

            this.file = blobFile;
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
