import { Datetime, Descriptor, DescriptorFlags, OpenFlags, PathFlags } from "./interfaces/wasi-filesystem-types.js";
import { Root, instantiate } from "./wasi_filesystem.js";
import { WASIWorker } from "@wasmin/wasi-js";
import {
    NFileSystemWritableFileStream,
    PreNameCheck,
    InvalidModificationError,
    NotFoundError,
    SyntaxError,
    TypeMismatchError,
    Stat,
} from "@wasmin/fs-js";
import process from "node:process";

// XXX: elsewhere reads are getting sliced into 4k chunks but 32k chunks seem to work fine (and faster)
//      have tried larger chunks (e.g. 64k) which seem to still work but are only marginally faster so...
let MAX_READ_SIZE = 32768;
if (process !== undefined) {
    if (process.env !== undefined) {
        let max_read = process.env.WASMIN_MAX_NFS_READ_SIZE
        if (max_read){
            MAX_READ_SIZE = Number(max_read);
        }
    }
}

const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
let _fs: any;
async function fetchCompile(url: URL) {
    if (url.protocol === "compiled:" || url.pathname.startsWith("/$bunfs/root/")) {
        const filePaths = url.pathname.split("/");
        const fileName = filePaths[filePaths.length-1];
        url = new URL(fileName, "file:///tmp/wasmin-tmp/");
    }
    if (isNode) {
        _fs = _fs || (await import("node:fs/promises"));
        return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
}

async function compileCore(url: string) {
    if (url == "wasi_filesystem.core.wasm") {
        const metaUrl = new URL("./wasi_filesystem.core.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    } else if (url == "wasi_filesystem.core2.wasm") {
        const metaUrl = new URL("./wasi_filesystem.core2.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    } else if (url == "wasi_filesystem.core3.wasm") {
        const metaUrl = new URL("./wasi_filesystem.core3.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    } else if (url == "wasi_filesystem.core4.wasm") {
        const metaUrl = new URL("./wasi_filesystem.core4.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    } else {
        throw new Error(`unsupported wasm URL: ${url}`);
    }
}

const wasiWorkers: Record<string, WASIWorker> = {};
const wasmInstances: Record<string, Root> = {};
const instantiations: Record<string, Promise<WASIWorker>> = {};

async function ensureInstantiation(path: string) {
    if (!instantiations[path]) {
        instantiations[path] = new Promise(async (resolve, reject) => {
            wasiWorkers[path] = new WASIWorker({env: {NFS_URL_FOR_WASI_FILESYSTEM: path}});
            await wasiWorkers[path]
                .createWorker()
                .then((componentImports) => instantiate(compileCore, componentImports as any))
                .then((instance) => (wasmInstances[path] = instance))
                .catch((e) => reject(e));
            resolve(wasiWorkers[path]);
        });
    }
    await instantiations[path];
}

export interface WasiNfsHandlePermissionDescriptor {
    mode: "read" | "readwrite";
}

export class WasiNfsHandle implements FileSystemHandle {
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
    constructor(parent: Descriptor, descriptor: Descriptor, kind: FileSystemHandleKind, fullName: string, name: string) {
        this._parent = parent;
        this._descriptor = descriptor;
        this._fullName = fullName;
        this.kind = kind;
        this.name = name;
        this.isFile = kind == "file";
        this.isDirectory = kind == "directory";
    }
    isSameEntry(other: FileSystemHandle): Promise<boolean> {
        return new Promise(async (resolve) => {
            const anyOther = other as any;
            if (anyOther._descriptor) {
                resolve(this._descriptor.isSameObject(anyOther._descriptor));
            } else {
                resolve(
                    other.kind === this.kind &&
                    other.name === this.name &&
                    (!anyOther._fullName || anyOther._fullName === this._fullName)
                );
            }
        });
    }
    async queryPermission(perm?: WasiNfsHandlePermissionDescriptor): Promise<PermissionState> {
        return new Promise(async (resolve, reject) => {
            try {
                const flags = this._descriptor.getFlags();
                if (!flags.read || (perm?.mode === "readwrite" && !flags.write)) {
                    resolve("denied");
                } else {
                    resolve("granted");
                }
            } catch (_e: any) {
                // reject(_e);
                reject("access denied"); // TODO: verify
            }
        });
    }
    async requestPermission(perm: WasiNfsHandlePermissionDescriptor): Promise<PermissionState> {
        return this.queryPermission(perm); // TODO: verify that there's nothing we can do to implement requestPermission
    }
}

export class WasiNfsDirectoryHandle extends WasiNfsHandle implements FileSystemDirectoryHandle {
    [Symbol.asyncIterator]: WasiNfsDirectoryHandle["entries"] = this.entries;
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
    constructor(param: string | WasiNfsHandle) {
        let parent: Descriptor;
        let descriptor: Descriptor;
        let kind: FileSystemHandleKind;
        let fullName: string;
        let name: string;
        if (typeof param === "string") {
            const url = param as string;
            const wasmInstance = wasmInstances[url];
            const dirs = wasmInstance["wasi:filesystem/preopens@0.2.0"].getDirectories();
            if (dirs.length !== 1 || dirs[0][1] !== "/") {
                console.log(`wasi:filesystem/preopens/get-directories returned unexpected ${dirs}`);
                throw new Error("internal error"); // FIXME: improve error message?
            }
            parent = dirs[0][0];
            descriptor = dirs[0][0];
            fullName = dirs[0][1];
            kind = "directory";
            name = "";
        } else {
            const toWrap = param as WasiNfsDirectoryHandle;
            parent = toWrap._parent;
            descriptor = toWrap._descriptor;
            kind = toWrap.kind;
            fullName = toWrap._fullName;
            name = toWrap.name;
        }
        super(parent, descriptor, kind, fullName, name);
        this[Symbol.asyncIterator] = this.entries;
        this.kind = "directory";
        this.isFile = false;
        this.isDirectory = true;
        this.getEntries = this.values;
    }
    async stat(): Promise<Stat> {
        const attr = this._descriptor.stat();
        const dataModificationTimestamp = attr.dataModificationTimestamp ?? { seconds: 0n, nanoseconds: 0 };
        const dataAccessTimestamp = attr.dataAccessTimestamp ?? { seconds: 0n, nanoseconds: 0 };
        const mtime = dataModificationTimestamp.seconds * 1_000_000_000n + BigInt(dataModificationTimestamp.nanoseconds);
        const atime = dataAccessTimestamp.seconds * 1_000_000_000n + BigInt(dataAccessTimestamp.nanoseconds);
        const stats: Stat = {
            inode: undefined, // FIXME: inode from stat (can we even do anything about this? wasi:filesystem doesn't seem to export inode or equivalent...)
            size: attr.size,
            creationTime: mtime,
            modifiedTime: mtime,
            accessedTime: atime,
        };
        return stats;
    }
    private async *entryHandles(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle> {
        try {
            const pathFlags: PathFlags = {};
            const openFlags: OpenFlags = {};
            const openDirFlags: OpenFlags = {directory: true};
            const descriptorFlags: DescriptorFlags = {read: true, write: true, mutateDirectory: true}; // TODO: verify w.r.t. access
            const dirStream = this._descriptor.readDirectory();
            for (let entry = dirStream.readDirectoryEntry(); entry; entry = dirStream.readDirectoryEntry()) {
                const stat = this._descriptor.statAt(pathFlags, entry.name);
                if (stat.type == "directory") {
                    const descriptor = this._descriptor.openAt(pathFlags, entry.name, openDirFlags, descriptorFlags);
                    yield new WasiNfsDirectoryHandle(
                        new WasiNfsHandle(this._descriptor, descriptor, "directory", this._fullName + entry.name + "/", entry.name)
                    );
                } else {
                    const descriptor = this._descriptor.openAt(pathFlags, entry.name, openFlags, descriptorFlags);
                    yield new WasiNfsFileHandle(
                        new WasiNfsHandle(this._descriptor, descriptor, "file", this._fullName + entry.name, entry.name)
                    );
                }
            }
        } catch (e: any) {
            if (e.message === "bad-descriptor" || e.message === "not-directory" || e.message === "no-entry") {
                throw new NotFoundError();
            }
            throw e;
        }
    }
    async *entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]> {
        for await (const entry of this.entryHandles()) {
            yield [entry.name, entry];
        }
    }
    async *keys(): AsyncIterableIterator<string> {
        for await (const entry of this.entryHandles()) {
            yield entry.name;
        }
    }
    async *values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle> {
        for await (const entry of this.entryHandles()) {
            yield entry;
        }
    }
    async getDirectoryHandle(
        name: string,
        options?: FileSystemGetDirectoryOptions
    ): Promise<FileSystemDirectoryHandle> {
        return new Promise(async (resolve, reject) => {
            try {
                PreNameCheck(name);
                const pathFlags: PathFlags = {}; // TODO: verify
                const openFlags: OpenFlags = {create: options?.create, directory: true, exclusive: false}; // TODO: verify
                const descriptorFlags: DescriptorFlags = {read: true, write: true, mutateDirectory: true}; // TODO: verify
                const descriptor = this._descriptor.openAt(pathFlags, name, openFlags, descriptorFlags);
                return resolve(
                    new WasiNfsDirectoryHandle(
                        new WasiNfsHandle(this._descriptor, descriptor, "directory", this._fullName + name + "/", name)
                    ) as FileSystemDirectoryHandle
                );
            } catch (e: any) {
                if (e.message === "no-entry") {
                    return reject(new NotFoundError())
                }
                if (e.message === "not-directory") {
                    return reject(new TypeMismatchError());
                }
                return reject(e);
            }

            // TODO: verify that Descriptor.openAt should create directory when flags indicate as such
            //        if not, change above catch-block to ignore error (except on TypeError?) and uncomment below
            //        if Descriptor.openAt should create directory when flags indicate as such, remove this comment and below
            // if (!options?.create) {
            //     return reject(new NotFoundError());
            // }

            // try {
            //     const pathFlags: PathFlags = {}; // TODO: verify
            //     const openFlags: OpenFlags = {directory: true}; // TODO: verify
            //     const descriptorFlags: DescriptorFlags = {read: true, write: true, mutateDirectory: true}; // TODO: verify
            //     this._descriptor.createDirectoryAt(name);
            //     const dir = this._descriptor.openAt(pathFlags, name, openFlags, descriptorFlags);
            //     return resolve(
            //         new WasiNfsDirectoryHandle(
            //             new WasiNfsHandle(dir, "directory", this._fullName + name + "/", name)
            //         ) as FileSystemDirectoryHandle
            //     );
            // } catch (e: any) {
            //     return reject(e);
            // }
        });
    }
    async getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle> {
        return new Promise(async (resolve, reject) => {
            try {
                PreNameCheck(name);
                const pathFlags: PathFlags = {}; // TODO: verify
                const openFlags: OpenFlags = {create: options?.create, directory: false, exclusive: false}; // TODO: verify
                const descriptorFlags: DescriptorFlags = {read: true, write: true, mutateDirectory: true}; // TODO: verify
                const descriptor = this._descriptor.openAt(pathFlags, name, openFlags, descriptorFlags);
                return resolve(
                    new WasiNfsFileHandle(
                        new WasiNfsHandle(this._descriptor, descriptor, "file", this._fullName + name, name)
                    ) as FileSystemFileHandle
                );
            } catch (e: any) {
                if (e.message === "no-entry") {
                    return reject(new NotFoundError())
                }
                if (e.message === "is-directory") {
                    return reject(new TypeMismatchError());
                }
                return reject(e);
            }
        });
    }
    async removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                PreNameCheck(name);
                const pathFlags = {}; // TODO: verify
                const stat = this._descriptor.statAt(pathFlags, name);
                if (stat.type === "directory") {
                    WasiNfsDirectoryHandle.removeDirectory(this._descriptor, name, !!options?.recursive);
                } else {
                    this._descriptor.unlinkFileAt(name);
                }
                return resolve();
            } catch (e: any) {
                if (e.message === "bad-descriptor" || e.message === "no-entry") {
                    return reject(new NotFoundError());
                }
                if (e.message === "not-empty" || e.message === "io") {
                    return reject(new InvalidModificationError());
                }
                // TODO: verify that error type is NotFoundError on not-found-error and InvalidModificationError on dir-not-empty error (and I/O error?)
                // if (e.payload?.nfsErrorCode === NFS3ERR_NOENT || e.payload?.nfsErrorCode === NFS3ERR_STALE) {
                //     return reject(new NotFoundError());
                // } else if (e.payload?.nfsErrorCode === NFS3ERR_IO || e.payload?.nfsErrorCode === NFS3ERR_NOTEMPTY) {
                //     return reject(new InvalidModificationError());
                // }
                return reject(e);
            }
        });
    }
    private static removeDirectory(parentDir: Descriptor, name: string, recursive: boolean) {
        if (recursive) {
            const pathFlags: PathFlags = {}; // TODO: verify
            const openFlags: OpenFlags = {create: false, directory: true}; // TODO: verify
            const descriptorFlags: DescriptorFlags = {read: true, write: true, mutateDirectory: true}; // TODO: verify
            const dir = parentDir.openAt(pathFlags, name, openFlags, descriptorFlags);
            const dirStream = dir.readDirectory();
            for (let entry = dirStream.readDirectoryEntry(); entry; entry = dirStream.readDirectoryEntry()) {
                if (entry.name !== "." && entry.name !== "..") {
                    if (entry.type === "directory") {
                        WasiNfsDirectoryHandle.removeDirectory(dir, entry.name, recursive);
                    } else {
                        dir.unlinkFileAt(entry.name);
                    }
                }
            }
        }
        parentDir.removeDirectoryAt(name);
    }
    async resolve(possibleDescendant: FileSystemHandle): Promise<Array<string> | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const anyPossibleDescendant = possibleDescendant as any;
                if (anyPossibleDescendant._descriptor && anyPossibleDescendant._descriptor !== this._descriptor) {
                    return resolve(null); // FIXME: reject instead?
                }

                const ret = await this.resolveDirectory(this.values(), possibleDescendant);
                return resolve(ret);
            } catch (e: any) {
                return reject(e);
            }
        });
    }
    private async resolveDirectory(
        subentries: AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>,
        possibleDescendant: FileSystemHandle
    ): Promise<Array<string> | null> {
        for await (const subentry of subentries) {
            if (await subentry.isSameEntry(possibleDescendant)) {
                const ret = subentry.name.substring(1).split("/");
                ret.pop();
                return ret;
            }
            if (subentry.kind === "directory") {
                const nfsEntry = subentry as WasiNfsDirectoryHandle;
                const ret = await this.resolveDirectory(nfsEntry.values(), possibleDescendant);
                if (ret) {
                    return ret;
                }
            }
        }
        return null;
    }

    /**
     * @deprecated Old property just for Chromium <=85. Use `.keys()`, `.values()`, `.entries()`, or the directory itself as an async iterable in the new API.
     */
    getEntries: WasiNfsDirectoryHandle["values"];
}

export class WasiNfsFileHandle extends WasiNfsHandle implements FileSystemFileHandle {
    readonly kind: "file";
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isFile: true;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isDirectory: false;
    constructor(param: WasiNfsHandle) {
        const toWrap = param as WasiNfsFileHandle;
        super(toWrap._parent, toWrap._descriptor, toWrap.kind, toWrap._fullName, toWrap.name);
        this.kind = "file";
        this.isFile = true;
        this.isDirectory = false;
    }
    async getFile(): Promise<File> {
        return new Promise((resolve, reject) => {
            try {
                const file = new WasiNfsFile(this._descriptor, this.name) as unknown;
                return resolve(file as File);
            } catch (e: any) {
                if (e.message === "bad-descriptor" || e.message === "no-entry") {
                    return reject(new NotFoundError());
                }
                return reject(e);
            }
        });
    }
    async createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream> {
        return new Promise(async (resolve, reject) => {
            try {
                const sink = new WasiNfsSink(this._parent, this._descriptor, this._fullName, options);
                return resolve(new NFileSystemWritableFileStream(sink));
            } catch (e: any) {
                if (e.message === "bad-descriptor" || e.message === "no-entry") {
                    return reject(new NotFoundError());
                }
                return reject(e);
            }
        });
    }
    async createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle> {
        throw new Error("not supported"); // FIXME: add support?
    }
}

// @ts-ignore
export class WasiNfsFile implements File {
    prototype: File;
    private _descriptor: Descriptor;
    lastModified: number;
    name: string;
    webkitRelativePath: string;
    size: number;
    type: string;
    constructor(descriptor: Descriptor, name: string) {
        const stat = descriptor.stat();
        const dataModificationTimestamp: Datetime = stat.dataModificationTimestamp ?? {seconds: 0n, nanoseconds: 0};

        this.prototype = new File([], name);
        this._descriptor = descriptor;
        this.lastModified = Number(dataModificationTimestamp.seconds) * 1000 + Math.round(dataModificationTimestamp.nanoseconds / 1_000_000);
        this.name = name;
        this.webkitRelativePath = name;
        this.size = Number(stat.size);
        this.type = "unknown";
    }
    private uint8Array(start?: number | undefined, end?: number | undefined): Uint8Array {
        let idx = 0;
        let pos = start || 0;
        let size = Math.max((end ? end : this.size) - pos, 0);
        const buf = new Uint8Array(size);
        while (size > 0) {
            const count = Math.min(size, MAX_READ_SIZE);
            const chunk = this._descriptor.read(BigInt(count), BigInt(pos));
            buf.set(chunk[0], idx);
            idx += chunk[0].byteLength;
            // FIXME: what if chunk[1] is true? (i.e. Descriptor.read return indicates EOF)
            pos += count;
            size -= count;
        }
        return buf;
    }
    arrayBuffer(): Promise<ArrayBuffer> {
        return new Promise(async (resolve, reject) => {
            try {
                return resolve(this.uint8Array().buffer);
            } catch (e: any) {
                return reject(e);
            }
        });
    }
    slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob {
        const buf = this.uint8Array(start, end);
        const blob = new WasiNfsBlob(this._descriptor, buf, contentType) as unknown;
        return blob as Blob;
    }
    stream(): ReadableStream<Uint8Array> {
        let pos = 0;
        let size = this.size;
        const readChunk = (): Uint8Array => {
            const count = Math.min(size, MAX_READ_SIZE);
            const chunk = this._descriptor.read(BigInt(count), BigInt(pos));
            pos += count;
            size -= count;
            return chunk[0];
        };
        return new ReadableStream({
            type: "bytes",
            pull(controller) {
                if (size > 0) {
                    controller.enqueue(readChunk());
                } else {
                    controller.close();
                }
            },
        });
    }
    text(): Promise<string> {
        return this.arrayBuffer().then((buf) => {
            const decoder = new TextDecoder("utf-8");
            return decoder.decode(buf);
        });
    }
}

// @ts-ignore
export class WasiNfsBlob implements Blob {
    prototype: Blob;
    private _descriptor: Descriptor;
    private _data: Uint8Array;
    size: number;
    type: string;
    constructor(descriptor: Descriptor, data: Uint8Array, contentType?: string | undefined) {
        this.prototype = new Blob();
        this._descriptor = descriptor;
        this._data = data;
        this.size = data.byteLength;
        this.type = contentType || "unknown";
    }
    arrayBuffer(): Promise<ArrayBuffer> {
        return new Promise(async (resolve) => resolve(this._data));
    }
    slice(start?: number | undefined, end?: number | undefined, contentType?: string | undefined): Blob {
        const blob = new WasiNfsBlob(this._descriptor, this._data.slice(start, end), contentType) as unknown;
        return blob as Blob;
    }
    stream(): ReadableStream<Uint8Array> {
        let pulled = false;
        const data = this._data;
        return new ReadableStream({
            type: "bytes",
            pull(controller) {
                if (!pulled) {
                    controller.enqueue(data);
                    pulled = true;
                } else {
                    controller.close();
                }
            },
        });
    }
    text(): Promise<string> {
        return this.arrayBuffer().then((buf) => {
            const decoder = new TextDecoder("utf-8");
            return decoder.decode(buf);
        });
    }
}

export class WasiNfsSink implements FileSystemWritableFileStream {
    private _parent: Descriptor;
    private _descriptor: Descriptor;
    private _descriptorTmp: Descriptor;
    private _fileName: string;
    private _fileNameTmp: string;
    private _keepExisting: boolean;
    private _valid: boolean;
    private _locked: boolean;
    private _orgSize: number;
    private _newSize: number;
    private _position: number;
    constructor(parent: Descriptor, descriptor: Descriptor, fullName: string, options?: FileSystemCreateWritableOptions) {
        const pathFlags: PathFlags = {}; // TODO: verify
        const openFlags: OpenFlags = {create: true, directory: false, exclusive: true}; // TODO: verify
        const descriptorFlags: DescriptorFlags = {read: true, write: true, mutateDirectory: true}; // TODO: verify

        this._fileName = fullName.slice(fullName.lastIndexOf("/") + 1);
        this._fileNameTmp = "." + this._fileName + "-tmp" + Date.now();
        this._parent = parent;
        this._descriptor = descriptor;
        this._descriptorTmp = parent.openAt(pathFlags, this._fileNameTmp, openFlags, descriptorFlags);
        this._keepExisting = !!options?.keepExistingData;
        this._valid = true;
        this._locked = false;
        this._orgSize = Number(descriptor.stat().size);
        this._newSize = this._keepExisting ? this._orgSize : 0;
        this._position = 0;
    }
    get locked() {
        return this._locked;
    }
    private static copyContents(descriptorFrom: Descriptor, descriptorTo: Descriptor, size: number) {
        let pos = 0n;
        while (size > 0) {
            const count = Math.min(size, MAX_READ_SIZE);
            const contents = descriptorFrom.read(BigInt(count), pos);
            descriptorTo.write(contents[0], pos);
            // FIXME: what if contents[1] is true? (i.e. Descriptor.read return indicates EOF)
            pos += BigInt(count);
            size -= count;
        }
    }
    private ensureExistingIfToBeKept() {
        if (this._keepExisting) {
            if (this._orgSize > 0) {
                WasiNfsSink.copyContents(this._descriptor, this._descriptorTmp, this._orgSize);
            }
            this._keepExisting = false;
        }
    }
    async write(data: FileSystemWriteChunkType): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            const anyData = data as any;
            if (anyData.type === "seek") {
                if (!("position" in anyData) || typeof anyData.position !== "number") {
                    return reject(new SyntaxError("seek requires a position argument"));
                }
                await this.seek(anyData.position)
                    .then(() => resolve())
                    .catch((e) => reject(e));
                return;
            }
            if (anyData.type === "truncate") {
                if (!("size" in anyData) || typeof anyData.size !== "number") {
                    return reject(new SyntaxError("truncate requires a size argument"));
                }
                await this.truncate(anyData.size)
                    .then(() => resolve())
                    .catch((e) => reject(e));
                return;
            }

            if (anyData.type === "write") {
                if (!("data" in anyData)) {
                    return reject(new SyntaxError("write requires a data argument"));
                }
                if ("position" in anyData) {
                    await this.seek(anyData.position);
                }
                data = anyData.data;
            }

            let buffer: ArrayBuffer;
            if (data instanceof ArrayBuffer) {
                buffer = data;
            } else if (ArrayBuffer.isView(data)) {
                buffer = data as any;
            } else if (data instanceof DataView) {
                buffer = data.buffer;
            } else if (data instanceof Blob) {
                buffer = await data.arrayBuffer();
            } else if (data instanceof String) {
                const encoder = new TextEncoder();
                buffer = encoder.encode(data.toString());
            } else {
                const encoder = new TextEncoder();
                buffer = encoder.encode(data as string);
            }

            try {
                this.ensureExistingIfToBeKept();
                this._descriptorTmp.write(new Uint8Array(buffer), BigInt(this._position));
                this._position += buffer.byteLength;
                if (this._position > this._newSize) {
                    this._newSize = this._position;
                }
                return resolve();
            } catch (e: any) {
                return reject(e);
            }
        });
    }
    async seek(position: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            this._position = position;
            return resolve();
        });
    }
    async truncate(size: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            try {
                this.ensureExistingIfToBeKept();
                this._descriptorTmp.setSize(BigInt(size));
                if (this._position > size) {
                    this._position = size;
                }
                this._newSize = size;
                return resolve();
            } catch (e: any) {
                return reject(e);
            }
        });
    }
    async close(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            try {
                if (!this._keepExisting) {
                    // XXX: if this._keepExisting is still set, no writes or truncates have occurred
                    this._parent.renameAt(this._fileNameTmp, this._parent, this._fileName);
                } else {
                    this._parent.unlinkFileAt(this._fileNameTmp);
                }
                this._valid = false;
                return resolve();
            } catch (e: any) {
                return reject(e);
            }
        });
    }
    async abort(_reason: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            try {
                this._parent.unlinkFileAt(this._fileNameTmp);
                this._valid = false;
                return resolve();
            } catch (e: any) {
                return reject(e);
            }
        });
    }
    getWriter(): WritableStreamDefaultWriter {
        if (!this._valid) {
            throw new TypeError("invalid stream");
        }
        if (this.locked) {
            throw new Error("Invalid state: WritableStream is locked");
        }

        const fileStream = this;
        const stream = new WritableStream({
            abort(reason) {
                return fileStream.abort(reason);
            },
            close() {
                return fileStream.close();
            },
            write(chunk, _controller) {
                return fileStream.write(chunk);
            },
        });
        const writer = new WritableStreamDefaultWriter(stream);
        const anyWriter = writer as any;
        fileStream._locked = true;
        anyWriter._releaseLock = writer.releaseLock;
        anyWriter.releaseLock = () => {
            anyWriter._releaseLock();
            fileStream._locked = false;
        };
        return writer;
    }
}

export async function wasiFilesystemNfs(path: string): Promise<WasiNfsDirectoryHandle> {
    await ensureInstantiation(path);
    return new WasiNfsDirectoryHandle(path);
}
export default wasiFilesystemNfs;
