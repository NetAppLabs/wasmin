import { NfsMount, ReaddirplusEntry, ObjRes } from "./interfaces/component-nfs-rs-nfs.js";
import { Stat } from "@wasmin/fs-js";
declare global {
    var NFS_JS_DEBUG: boolean;
}
export declare function nfsDebug(msg?: any, ...optionalParams: any[]): void;
export interface ReaddirplusEntryCached extends ReaddirplusEntry {
    directoryHandle?: NfsDirectoryHandle;
}
export interface NfsHandlePermissionDescriptor {
    mode: "read" | "readwrite";
}
export interface NfsDirectoryHandleParent {
    parentDir?: NfsDirectoryHandle;
    mount?: NfsMount;
    fhDir?: Uint8Array;
}
export declare class NfsHandle implements FileSystemHandle {
    protected _parent?: NfsDirectoryHandle;
    protected _mount: NfsMount;
    protected _fhDir: Uint8Array;
    protected _fh: Uint8Array;
    protected _fileid: bigint;
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
    constructor(parent: NfsDirectoryHandleParent, fh: Uint8Array, fileid: bigint, kind: FileSystemHandleKind, fullName: string, name: string);
    isSameEntry(other: FileSystemHandle): Promise<boolean>;
    queryPermission(perm?: NfsHandlePermissionDescriptor): Promise<PermissionState>;
    requestPermission(perm: NfsHandlePermissionDescriptor): Promise<PermissionState>;
    stat(): Promise<Stat>;
}
declare class ReaddirplusEntryCache {
    timestamp: number;
    entries?: Promise<ReaddirplusEntryCached[]>;
    constructor(timestamp?: number);
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
    protected _readdirplusEntryCache: ReaddirplusEntryCache;
    constructor(url: string);
    constructor(toWrap: NfsHandle);
    private invalidateReaddirplusCache;
    getEntryCachedByFileHandle(fh: Uint8Array): Promise<ObjRes | undefined>;
    getNameNormalized(name: string): string;
    isSameNameNormalized(name1: string, name2: string): boolean;
    populateReaddirCache(entries: ReaddirplusEntry[], name: string): ObjRes;
    isReadDirCacheAlive(): boolean;
    getEntryByNameTryLookupFromCache(name: string): Promise<{
        obj: ObjRes;
        entry?: ReaddirplusEntryCached;
    }>;
    private readdirplus;
    private entryHandles;
    entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]>;
    keys(): AsyncIterableIterator<string>;
    values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>;
    requestPermission(perm: NfsHandlePermissionDescriptor): Promise<PermissionState>;
    getDirectoryHandleTryCached(name: string): Promise<FileSystemDirectoryHandle>;
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
    constructor(mount: NfsMount, fh: Uint8Array, name: string);
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
    constructor(mount: NfsMount, fh: Uint8Array, data: Uint8Array, contentType?: string | undefined);
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
    constructor(mount: NfsMount, fhDir: Uint8Array, fh: Uint8Array, fullName: string, options?: FileSystemCreateWritableOptions);
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