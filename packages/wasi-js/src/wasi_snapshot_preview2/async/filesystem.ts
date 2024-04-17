//import { Descriptor, DescriptorType, Filesize, OutputStream } from "@wasmin/wasi-snapshot-preview2/async"
import { FilesystemFilesystemNamespace as fs } from "@wasmin/wasi-snapshot-preview2/async";
import { FilesystemPreopensNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type PreopensAsync = FilesystemPreopensNamespace.WasiFilesystemPreopens;
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { FileOrDir, OpenDirectory, OpenFile, Socket } from "../../wasiFileSystem.js";
import { Fdflags, FdflagsN, Oflags, OflagsN } from "../../wasi_snapshot_preview1/bindings.js";
import { unimplemented, wasiDebug, wasiError, wasiWarn } from "../../wasiUtils.js";
import {
    adviceStringtoAdviceN,
    toDateTimeFromMs,
    toDateTimeFromNs,
    toMillisFromDatetime,
    toMillisFromTimestamp,
    toNanosFromDatetime,
    toNanosFromTimestamp,
    translateError,
    wasiPreview2Debug,
} from "./preview2Utils.js";
import { FileSystemHandle, FileSystemFileHandle, Statable } from "@wasmin/fs-js";

type FileSize = fs.Filesize;
type Descriptor = fs.Descriptor;
type DescriptorType = fs.DescriptorType;
type DescriptorStat = fs.DescriptorStat;
type DescriptorFlags = fs.DescriptorFlags;
type InputStream = fs.InputStream;
type OutputStream = fs.OutputStream;
type DirectoryEntryStream = fs.DirectoryEntryStream;
type Filesize = fs.Filesize;

import { FIRST_PREOPEN_FD } from "../../wasiFileSystem.js";
import { InStream, OutStream } from "./io.js";
import { Resource } from "../../wasiResources.js";

export class FileSystemPreopensAsyncHost implements PreopensAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.Descriptor = FileSystemFileDescriptor;
    }
    public Descriptor: typeof FileSystemFileDescriptor;
    private _wasiEnv: WasiEnv;

    async getDirectories(): Promise<[Descriptor, string][]> {
        const preopens: [Descriptor, string][] = [];
        const preopen_fd = FIRST_PREOPEN_FD;
        try {
            for (let i = preopen_fd; true; i++) {
                const openDir = this._wasiEnv.openFiles.getPreOpen(i);
                const path = openDir.path;
                const desc = new FileSystemFileDescriptor(this._wasiEnv, i, path);
                preopens.push([desc, path]);
            }
        } catch (err: any) {
            wasiError("getDirectories: err: ", err);
        }
        return preopens;
    }
}

export class FileSystemFileSystemAsyncHost implements fs.WasiFilesystemTypes {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async filesystemErrorCode(err: fs.Error): Promise<fs.ErrorCode | undefined> {
        let debugstr = err.toDebugString();
        wasiPreview2Debug("filesystemErrorCode: ", err);
        return 'unsupported';
        //throw new Error("Method not implemented.");
    }
    private _wasiEnv: WasiEnv;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
}

export class FileSystemFileDescriptor implements fs.Descriptor, Resource {
    private _wasiEnv: WasiEnv;
    public _fd: number;
    public resource: number;
    private _path: string;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    get fd() {
        return this._fd;
    }
    get path() {
        return this._path;
    }

    constructor(wasiOptions: WasiOptions, fd: number, path: string) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._fd = fd;
        this._path = path;
        this.resource = this.openFiles.addResource(this);
    }
    async readViaStream(offset: bigint): Promise<fs.InputStream> {
        try {
            const newFd = this.openFiles.openReader(this.fd, offset);
            wasiPreview2Debug("FileSystemFileSystemAsyncHost: readViaStream newFd:", newFd);
            const closeFdOnStreamClose = true;
            const instr = new InStream(this._wasiEnv, newFd, closeFdOnStreamClose);
            return instr;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async writeViaStream(offset: bigint): Promise<fs.OutputStream> {
        try {
            const newFd = this.openFiles.openWriter(this.fd, offset);
            wasiPreview2Debug("FileSystemFileSystemAsyncHost: writeViaStream newFd:", newFd);
            const closeFdOnStreamClose = true;
            const outstr = new OutStream(this._wasiEnv, newFd, closeFdOnStreamClose);
            return outstr;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async appendViaStream(): Promise<fs.OutputStream> {
        try {
            const newFd = this.openFiles.openWriter(this.fd, 0n, true);
            const closeFdOnStreamClose = true;
            const outstr = new OutStream(this._wasiEnv, newFd, closeFdOnStreamClose);
            return outstr;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async advise(offset: bigint, length: bigint, advice: fs.Advice): Promise<void> {
        try {
            const of = this.openFiles.getAsFile(this.fd);
            // TODO look into how to keep track of offset and len
            // of.setSize(Number(len));
            //of.position = Number(offset);
            of.advice = adviceStringtoAdviceN(advice);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async syncData(): Promise<void> {
        try {
            await this.openFiles.getAsFile(this.fd).flush();
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async getFlags(): Promise<fs.DescriptorFlags> {
        const dFlags: DescriptorFlags = {
            read: true,
            write: true,
            fileIntegritySync: false,
            dataIntegritySync: false,
            requestedWriteSync: false,
            mutateDirectory: false,
        };
        return dFlags;
    }
    async getType(): Promise<fs.DescriptorType> {
        try {
            const fdhandle = this.openFiles.get(this.fd);
            if (fdhandle instanceof OpenFile) {
                return "regular-file";
            } else if (fdhandle instanceof OpenDirectory) {
                return "directory";
            } else if (fdhandle instanceof Socket) {
                return "socket";
            } else {
                return "character-device";
            }
        } catch (err: any) {
            wasiPreview2Debug(`filesystem:getType for fd: ${this.fd} err: `, err);
            throw translateError(err);
        }
    }
    async setSize(size: bigint): Promise<void> {
        try {
            await this.openFiles.getAsFile(this.fd).setSize(Number(size));
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async setTimes(dataAccessTimestamp: fs.NewTimestamp, dataModificationTimestamp: fs.NewTimestamp): Promise<void> {
        try {
            const of = this.openFiles.getAsFileOrDir(this.fd);
            const handle = of.handle;
            if ((handle as any).updateTimes) {
                const uh = handle as unknown as Statable;
                const dataAccessTimestampNs = toNanosFromTimestamp(dataAccessTimestamp);
                const dataModificationTimestampNs = toNanosFromTimestamp(dataModificationTimestamp);
                await uh.updateTimes(dataAccessTimestampNs, dataModificationTimestampNs);
            }
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async read(length: bigint, offset: bigint): Promise<[Uint8Array, boolean]> {
        try {
            // TODO: convert to using 'using' syntax
            //await using input = await this.readViaStream(offset);
            let input = await this.readViaStream(offset);
            //const input = this.openFiles.getAsReadable(newFd);
            // TODO: gracefully handle bigint
            const chunk = await input.read(length);
            //await this.openFiles.closeReader(newFd);
            let isEnd = false;
            if (chunk.length < length) {
                isEnd = true;
            }
            await input[Symbol.asyncDispose]();
            return [chunk, isEnd];
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async write(buffer: Uint8Array, offset: bigint): Promise<bigint> {
        try {
            // TODO: convert to using 'using' syntax
            //await using out = await this.writeViaStream(offset);
            const out = await this.writeViaStream(offset);
            //const out = this.openFiles.getAsWritable(newFd);
            await out.write(buffer);
            const wroteSize = buffer.length;
            await out[Symbol.asyncDispose]();
            return BigInt(wroteSize);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async readDirectory(): Promise<fs.DirectoryEntryStream> {
        try {
            const dirReadFd = this.openFiles.openOpenDirectoryIterator(this.fd);
            const dirStream = this.openFiles.getAsOpenDirectoryIterator(dirReadFd);
            return dirStream;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async sync(): Promise<void> {
        try {
            await this.openFiles.getAsFile(this.fd).flush();
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async createDirectoryAt(path: string): Promise<void> {
        try {
            const openDir = this.openFiles.getAsDir(this.fd);
            await openDir.openWithCreate(path, true, FileOrDir.Dir, openDir.handle);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async stat(): Promise<fs.DescriptorStat> {
        try {
            const resource = this.openFiles.get(this.fd);
            if (resource instanceof OpenFile || resource instanceof OpenDirectory) {
                const handle = resource.handle;
                let stat = await populateDescriptorStat(this.fd, handle);
                return stat;
            }
        } catch (err: any) {
            throw translateError(err);
        }
        throw "bad-descriptor";
    }
    async statAt(pathFlags: fs.PathFlags, path: string): Promise<fs.DescriptorStat> {
        try {
            wasiDebug(`statAt: fd: ${this.fd} path: ${path}`);
            const openDir = this.openFiles.getAsDir(this.fd);
            const handle = await openDir.getFileOrDir(path, FileOrDir.Any);
            let stat = await populateDescriptorStat(this.fd, handle);
            return stat;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async setTimesAt(pathFlags: fs.PathFlags, path: string, dataAccessTimestamp: fs.NewTimestamp, dataModificationTimestamp: fs.NewTimestamp): Promise<void> {
        try {
            const opendir = this.openFiles.getAsDir(this.fd);
            const handle = await opendir.getFileOrDir(path, FileOrDir.Any);
            if ((handle as any).updateTimes) {
                const uh = handle as unknown as Statable;
                const dataAccessTimestampNs = toNanosFromTimestamp(dataAccessTimestamp);
                const dataModificationTimestampNs = toNanosFromTimestamp(dataModificationTimestamp);
                await uh.updateTimes(dataAccessTimestampNs, dataModificationTimestampNs);
            }
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async linkAt(oldPathFlags: fs.PathFlags, oldPath: string, newDescriptor: fs.Descriptor, newPath: string): Promise<void> {
        throw 'not-permitted';
    }
    async openAt(pathFlags: fs.PathFlags, path: string, openFlags: fs.OpenFlags, flags: fs.DescriptorFlags): Promise<fs.Descriptor> {
        try {
            const fd = this.fd;
            let fdflags: Fdflags = 0x0;
            let oflags: Oflags = 0x0;

            if (openFlags.create) oflags |= OflagsN.CREAT;
            if (openFlags.directory) oflags |= OflagsN.DIRECTORY;
            if (openFlags.exclusive) oflags |= OflagsN.EXCL;
            if (openFlags.truncate) oflags |= OflagsN.TRUNC;

            /*
            if (descriptorFlags.read && descriptorFlags.write)
                oflags |= OflagsN.O_RDWR;
            else if (descriptorFlags.write)
                oflags |= OflagsN.O_WRONLY;
            
            if (modes.readable)
            fdflags |= todo;
            if (modes.writeable)
            fsMode |= todo;
            if (modes.executable)
            fsMode |= todo;
            */

            wasiDebug(`[openAt fd: ${fd}, oflags: ${oflags}, path: ${path}, fdflags: ${fdflags} ]`);

            if (fdflags & FdflagsN.NONBLOCK) {
                wasiWarn(
                    `openAt Asked for non-blocking mode on path ${path} with dirFd: ${fd} while opening the file, falling back to blocking one.`
                );
                fdflags &= ~FdflagsN.NONBLOCK;
            }
            if (fdflags & FdflagsN.DSYNC) {
                unimplemented("openAt FdFlags.DSYNC");
            } else if (fdflags & FdflagsN.RSYNC) {
                unimplemented("openAt FdFlags.RSYNC");
            } else if (fdflags & FdflagsN.SYNC) {
                unimplemented("openAt FdFlags.SYNC");
            }

            const openDir = this.openFiles.getAsDir(fd);
            const resultFd = await this.openFiles.open(openDir, path, oflags, fdflags);
            wasiDebug(`[openAt result: dirFd: ${fd}, path: ${path}, resultFd: ${resultFd} ]`);
            const resultDescriptor = new FileSystemFileDescriptor(this.wasiEnv, resultFd, path);
            return resultDescriptor;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async readlinkAt(path: string): Promise<string> {
        throw 'not-permitted';
    }
    async removeDirectoryAt(path: string): Promise<void> {
        try {
            const fd = this.fd;
            wasiDebug(`[removeDirectoryAt] fd: ${fd} path: ${path}`);
            const openDir = this.openFiles.getAsDir(fd);
            await openDir.delete(path);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    renameAt(oldPath: string, newDescriptor: fs.Descriptor, newPath: string): Promise<void> {
        throw 'not-permitted';
    }
    symlinkAt(oldPath: string, newPath: string): Promise<void> {
        throw 'not-permitted';
    }
    async unlinkFileAt(path: string): Promise<void> {
        try {
            const fd = this.fd;
            wasiDebug(`[unlinkFileAt] fd: ${fd} path: ${path}`);
            const dir = this.openFiles.getAsDir(fd);
            await dir.delete(path);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async isSameObject(other: fs.Descriptor): Promise<boolean> {
        const thisMd = await this.metadataHash();
        const otherMd = await other.metadataHash();
        if (( thisMd.lower == otherMd.lower ) && ( thisMd.upper == otherMd.upper)) {
            return true;
        }
        return false;
    }
    async metadataHash(): Promise<fs.MetadataHashValue> {
        const stat = await this.stat();
        const value = `${stat.type}-${stat.size}-${stat.dataAccessTimestamp}-${stat.dataModificationTimestamp}`;
        const enc = new TextEncoder();
        const buffer = enc.encode(value);
        let hash_bytes = await crypto.subtle.digest("SHA-1", buffer);

        let view = new DataView(hash_bytes, 0);
        let lower = view.getBigUint64(0, true);
        let upper = view.getBigUint64(8, true);

        let res: fs.MetadataHashValue = {
            lower: lower,
            upper: upper,
        }
        return res;
    }
    async metadataHashAt(pathFlags: fs.PathFlags, path: string): Promise<fs.MetadataHashValue> {
        const stat = await this.statAt(pathFlags, path);
        const value = `${stat.type}-${stat.size}-${stat.dataAccessTimestamp}-${stat.dataModificationTimestamp}`;
        const enc = new TextEncoder();
        const buffer = enc.encode(value);
        // TODO revise this, ensure this is accurate enough
        let hash_bytes = await crypto.subtle.digest("SHA-1", buffer);

        let view = new DataView(hash_bytes, 0);
        let lower = view.getBigUint64(0, true);
        // TODO better error handling:
        let upper = view.getBigUint64(8, true);

        let res: fs.MetadataHashValue = {
            lower: lower,
            upper: upper,
        }
        return res;
    }

    async [Symbol.asyncDispose](): Promise<void> {
        try {
            await this.openFiles.close(this.fd);
            await this.openFiles.disposeResource(this);
        } catch (err: any) {
            wasiPreview2Debug("Descriptor[Symbol.asyncDispose]() err: ", err);
        }
    }
}

async function populateDescriptorStat(fd: number, fHandle: FileSystemHandle): Promise<DescriptorStat> {
    let size = 0n;
    let timeMilliseconds = 0;
    let ftype = "directory" as DescriptorType;
    if (fHandle.kind == "file") {
        const ffHandle = fHandle as FileSystemFileHandle;
        const file = await ffHandle.getFile();
        if (file) {
            size = BigInt(file.size);
            timeMilliseconds = file.lastModified;
        }
        ftype = "regular-file";
    }
    const time = toDateTimeFromMs(timeMilliseconds);
    let ctime = time;
    let atime = time;
    let mtime = time;
    let inode = 0n;
    if ((fHandle as any).stat) {
        const statable = fHandle as unknown as Statable;
        const s = await statable.stat();
        const got_inode = s.inode;
        if (got_inode) {
            inode = got_inode;
        }
        const got_atime = s.accessedTime;
        if (got_atime) {
            atime = toDateTimeFromNs(got_atime);
        }
        const got_ctime = s.creationTime;
        if (got_ctime) {
            ctime = toDateTimeFromNs(got_ctime);
        }
        const got_mtime = s.modifiedTime;
        if (got_mtime) {
            mtime = toDateTimeFromNs(got_mtime);
        }
    }
    const newStat: DescriptorStat = {
        //device: 0n,
        //inode: inode,
        type: ftype,
        linkCount: 0n,
        statusChangeTimestamp: ctime,
        dataModificationTimestamp: mtime,
        dataAccessTimestamp: atime,
        size: size,
    };
    return newStat;
}
