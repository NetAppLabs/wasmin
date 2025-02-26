// types already exported from typescript lib.dom.d.ts

export type WriteCommandType = "seek" | "truncate" | "write";
export interface WriteParams {
    data?: BufferSource | Blob | string | null;
    position?: number | null;
    size?: number | null;
    type: WriteCommandType;
}
export interface FileSystemGetFileOptions {
    create?: boolean;
}
export interface FileSystemRemoveOptions {
    recursive?: boolean;
}
export interface FileSystemReadWriteOptions {
    at?: number;
}
export type FileSystemHandleKind = "directory" | "file" | "link";
export type FileSystemWriteChunkType = BufferSource | Blob | string | WriteParams;
export type PermissionState = "denied" | "granted" | "prompt";
export type FileSystemPermissionMode = "read" | "readwrite";

export interface FileSystemGetDirectoryOptions {
    create?: boolean;
}

export interface FileSystemCreateWritableOptions {
    keepExistingData?: boolean;
}

export interface FileSystemHandlePermissionDescriptor {
    mode?: FileSystemPermissionMode | undefined;
}

/**
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemHandle)
 */
export interface FileSystemHandle {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/kind) */
    readonly kind: FileSystemHandleKind;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/name) */
    readonly name: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemHandle/isSameEntry) */
    isSameEntry(other: FileSystemHandle): Promise<boolean>;
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle/queryPermission) */
    queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle/requestPermission) */
    requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
}

/**
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle)
 */
export interface FileSystemDirectoryHandle extends FileSystemHandle {
    readonly kind: "directory";
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getDirectoryHandle) */
    getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/getFileHandle) */
    getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/removeEntry) */
    removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/resolve) */
    resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/keys) */
    keys(): AsyncIterableIterator<string>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/values) */
    values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemDirectoryHandle/entries) */
    entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]>;
    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/entries) */
    [Symbol.asyncIterator]: FileSystemDirectoryHandle["entries"];
}

/**
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle)
 */
export interface FileSystemFileHandle extends FileSystemHandle {
    readonly kind: "file";
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/createSyncAccessHandle) */
    createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/createWritable) */
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemFileHandle/getFile) */
    getFile(): Promise<File>;
}

/**
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream)
 */
// @ts-ignore
export interface FileSystemWritableFileStream extends WritableStream {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/seek) */
    seek(position: number): Promise<void>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/truncate) */
    truncate(size: number): Promise<void>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemWritableFileStream/write) */
    write(data: FileSystemWriteChunkType): Promise<void>;
}

/**
 * Available only in secure contexts.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle)
 */
export interface FileSystemSyncAccessHandle {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/close) */
    close(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/flush) */
    flush(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/getSize) */
    getSize(): number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/read) */
    read(buffer: BufferSource, options?: FileSystemReadWriteOptions): number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/truncate) */
    truncate(newSize: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FileSystemSyncAccessHandle/write) */
    write(buffer: BufferSource, options?: FileSystemReadWriteOptions): number;
}