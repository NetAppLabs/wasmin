import { Descriptor } from "./interfaces/wasi-filesystem-types.js";
import { Stat } from "@wasmin/fs-js";
export interface WasiNfsHandlePermissionDescriptor {
    mode: "read" | "readwrite";
}
export declare class WasiNfsHandle implements FileSystemHandle {
    protected _parent: Descriptor;
    protected _descriptor: Descriptor;
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
    constructor(parent: Descriptor, descriptor: Descriptor, kind: FileSystemHandleKind, fullName: string, name: string);
    isSameEntry(other: FileSystemHandle): Promise<boolean>;
    queryPermission(perm?: WasiNfsHandlePermissionDescriptor): Promise<PermissionState>;
    requestPermission(perm: WasiNfsHandlePermissionDescriptor): Promise<PermissionState>;
}
export declare class WasiNfsDirectoryHandle extends WasiNfsHandle implements FileSystemDirectoryHandle {
    [Symbol.asyncIterator]: WasiNfsDirectoryHandle["entries"];
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
    constructor(toWrap: WasiNfsHandle);
    stat(): Promise<Stat>;
    private entryHandles;
    entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]>;
    keys(): AsyncIterableIterator<string>;
    values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>;
    getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>;
    removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
    private static removeDirectory;
    resolve(possibleDescendant: FileSystemHandle): Promise<Array<string> | null>;
    private resolveDirectory;
    /**
     * @deprecated Old property just for Chromium <=85. Use `.keys()`, `.values()`, `.entries()`, or the directory itself as an async iterable in the new API.
     */
    getEntries: WasiNfsDirectoryHandle["values"];
}
export declare class WasiNfsFileHandle extends WasiNfsHandle implements FileSystemFileHandle {
    readonly kind: "file";
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isFile: true;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isDirectory: false;
    constructor(param: WasiNfsHandle);
    getFile(): Promise<File>;
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
    createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle>;
}
export declare class WasiNfsFile implements File {
    prototype: File;
    private _descriptor;
    lastModified: number;
    name: string;
    webkitRelativePath: string;
    size: number;
    type: string;
    constructor(descriptor: Descriptor, name: string);
    private uint8Array;
    arrayBuffer(): Promise<ArrayBuffer>;
    slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob;
    stream(): ReadableStream<Uint8Array>;
    text(): Promise<string>;
}
export declare class WasiNfsBlob implements Blob {
    prototype: Blob;
    private _descriptor;
    private _data;
    size: number;
    type: string;
    constructor(descriptor: Descriptor, data: Uint8Array, contentType?: string | undefined);
    arrayBuffer(): Promise<ArrayBuffer>;
    slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob;
    stream(): ReadableStream<Uint8Array>;
    text(): Promise<string>;
}
export declare class WasiNfsSink implements FileSystemWritableFileStream {
    private _parent;
    private _descriptor;
    private _descriptorTmp;
    private _fileName;
    private _fileNameTmp;
    private _keepExisting;
    private _valid;
    private _locked;
    private _orgSize;
    private _newSize;
    private _position;
    constructor(parent: Descriptor, descriptor: Descriptor, fullName: string, options?: FileSystemCreateWritableOptions);
    get locked(): boolean;
    private static copyContents;
    private ensureExistingIfToBeKept;
    write(data: FileSystemWriteChunkType): Promise<void>;
    seek(position: number): Promise<void>;
    truncate(size: number): Promise<void>;
    close(): Promise<void>;
    abort(_reason: string): Promise<void>;
    getWriter(): WritableStreamDefaultWriter;
}
export declare function wasiFilesystemNfs(path: string): Promise<WasiNfsDirectoryHandle>;
export default wasiFilesystemNfs;
//# sourceMappingURL=index.d.ts.map