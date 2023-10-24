import { Mount } from "./interfaces/component-nfs-rs-nfs";
export interface NfsHandlePermissionDescriptor {
    mode: "read" | "readwrite";
}
export declare class NfsHandle implements FileSystemHandle {
    protected _mount: Mount;
    protected _fhDir: Uint8Array;
    protected _fh: Uint8Array;
    protected _fullName: string;
    readonly kind: FileSystemHandleKind;
    readonly name: string;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isFile: boolean;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isDirectory: boolean;
    constructor(mount: Mount, fhDir: Uint8Array, fh: Uint8Array, kind: FileSystemHandleKind, fullName: string, name: string);
    isSameEntry(other: FileSystemHandle): Promise<boolean>;
    queryPermission(perm?: NfsHandlePermissionDescriptor): Promise<PermissionState>;
    requestPermission(perm: NfsHandlePermissionDescriptor): Promise<PermissionState>;
}
export declare class NfsDirectoryHandle extends NfsHandle implements FileSystemDirectoryHandle {
    [Symbol.asyncIterator]: NfsDirectoryHandle["entries"];
    readonly kind: "directory";
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isFile: false;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isDirectory: true;
    constructor(url: string);
    constructor(toWrap: NfsHandle);
    private entryHandles;
    entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]>;
    keys(): AsyncIterableIterator<string>;
    values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>;
    getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>;
    removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
    private removeDirectory;
    resolve(possibleDescendant: FileSystemHandle): Promise<Array<string> | null>;
    private resolveDirectory;
    /**
     * @deprecated Old property just for Chromium <=85. Use `.keys()`, `.values()`, `.entries()`, or the directory itself as an async iterable in the new API.
     */
    getEntries: NfsDirectoryHandle["values"];
}
export declare class NfsFileHandle extends NfsHandle implements FileSystemFileHandle {
    readonly kind: "file";
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isFile: true;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isDirectory: false;
    constructor(param: NfsHandle);
    getFile(): Promise<File>;
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
    createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>;
}
export declare class NfsFile implements File {
    prototype: File;
    private _mount;
    private _fh;
    lastModified: number;
    name: string;
    webkitRelativePath: string;
    size: number;
    type: string;
    constructor(mount: Mount, fh: Uint8Array, name: string);
    private uint8Array;
    arrayBuffer(): Promise<ArrayBuffer>;
    slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob;
    stream(): ReadableStream<Uint8Array>;
    text(): Promise<string>;
}
export declare class NfsBlob implements Blob {
    prototype: Blob;
    private _mount;
    private _fh;
    private _data;
    size: number;
    type: string;
    constructor(mount: Mount, fh: Uint8Array, data: Uint8Array, contentType?: string | undefined);
    arrayBuffer(): Promise<ArrayBuffer>;
    slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob;
    stream(): ReadableStream<Uint8Array>;
    text(): Promise<string>;
}
export declare class NfsSink implements FileSystemWritableFileStream {
    private _mount;
    private _fhDir;
    private _fh;
    private _fhTmp;
    private _fileName;
    private _fileNameTmp;
    private _keepExisting;
    private _valid;
    private _locked;
    private _orgSize;
    private _newSize;
    private _position;
    constructor(mount: Mount, fhDir: Uint8Array, fh: Uint8Array, fullName: string, options?: FileSystemCreateWritableOptions);
    get locked(): boolean;
    private copyContents;
    private ensureExistingIfToBeKept;
    write(data: FileSystemWriteChunkType): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
    close(): Promise<void>;
    abort(_reason: string): Promise<void>;
    getWriter(): WritableStreamDefaultWriter;
}
export declare function nfs(path: string): Promise<NfsDirectoryHandle>;
export default nfs;
//# sourceMappingURL=index.d.ts.map