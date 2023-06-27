import { FileSystemHandlePermissionDescriptor } from "../index.js";

/* eslint-disable @typescript-eslint/member-ordering */
export interface ImpleSink<T> {
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

    abstract close(): Promise<void>;

    async seek(position: number): Promise<void> {
        return this.write({ type: "seek", position });
    }

    async truncate(size: number): Promise<void> {
        return this.write({ type: "truncate", size });
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

export interface ImpleFileHandle<T = any, U = any> {
    kind: "file";
    path: string;
    name: string;

    getFile: () => Promise<U>;
    isSameEntry: (other: any) => Promise<boolean>;
    createWritable: (options?: { keepExistingData?: boolean }) => Promise<T>;
}

export interface ImplFolderHandle<T = any, U = any> {
    kind: "directory";
    path: string;
    name: string;

    queryPermission?: (descriptor?: FileSystemHandlePermissionDescriptor) => Promise<PermissionState>;

    requestPermission?: (descriptor?: FileSystemHandlePermissionDescriptor) => Promise<PermissionState>;

    isSameEntry: (other: any) => boolean;

    entries: () => AsyncGenerator<readonly [string, T | U], void, unknown>;

    getDirectoryHandle: (name: string, options?: { create?: boolean; capture?: boolean }) => Promise<U>;

    getFileHandle: (name: string, options?: { create?: boolean }) => Promise<T | undefined>;

    removeEntry: (name: string, opts: { recursive?: boolean }) => Promise<void>;

    resolve?(possibleDescendant: T | U): Promise<string[] | null>;
}
