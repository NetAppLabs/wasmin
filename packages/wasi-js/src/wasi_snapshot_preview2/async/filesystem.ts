//import { Descriptor, DescriptorType, Filesize, OutputStream } from "@wasm-env/wasi-snapshot-preview2"
import { FilesystemFilesystemNamespace as fs } from "@wasm-env/wasi-snapshot-preview2";
import { FilesystemPreopensNamespace } from "@wasm-env/wasi-snapshot-preview2";
type PreopensAsync = FilesystemPreopensNamespace.WasiFilesystemPreopensAsync;
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
import { FileSystemHandle, FileSystemFileHandle, Statable } from "@wasm-env/fs-js";

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

export class FileSystemPreopensAsyncHost implements PreopensAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getDirectories(): Promise<[Descriptor, string][]> {
        const preopens: [Descriptor, string][] = [];
        const preopen_fd = FIRST_PREOPEN_FD;
        try {
            for (let i = preopen_fd; true; i++) {
                const openDir = this._wasiEnv.openFiles.getPreOpen(i);
                const path = openDir.path;
                preopens.push([i, path]);
            }
        } catch (err: any) {
            wasiError("getDirectories: err: ", err);
        }
        return preopens;
    }
}

export class FileSystemFileSystemAsyncHost implements fs.WasiFilesystemTypesAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }

    private _wasiEnv: WasiEnv;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    async readViaStream(fd: Descriptor, offset: FileSize): Promise<InputStream> {
        try {
            const newFd = await this.openFiles.openReader(fd, offset);
            wasiPreview2Debug("FileSystemFileSystemAsyncHost: readViaStream newFd:", newFd);
            return newFd;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async writeViaStream(fd: Descriptor, offset: FileSize): Promise<OutputStream> {
        try {
            const newFd = await this.openFiles.openWriter(fd, offset);
            wasiPreview2Debug("FileSystemFileSystemAsyncHost: writeViaStream newFd:", newFd);
            return newFd;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async appendViaStream(fd: Descriptor): Promise<OutputStream> {
        try {
            return await this.openFiles.openWriter(fd, 0n, true);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async advise(fd: Descriptor, offset: FileSize, length: bigint, advice: fs.Advice): Promise<void> {
        try {
            const of = this.openFiles.getAsFile(fd);
            // TODO look into how to keep track of offset and len
            // of.setSize(Number(len));
            //of.position = Number(offset);
            of.advice = adviceStringtoAdviceN(advice);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async syncData(fd: Descriptor): Promise<void> {
        try {
            await this.openFiles.getAsFile(fd).flush();
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async getFlags(fd: Descriptor): Promise<DescriptorFlags> {
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
    async getType(fd: Descriptor): Promise<DescriptorType> {
        try {
            const fdhandle = this.openFiles.get(fd);
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
            wasiPreview2Debug(`filesystem:getType for fd: ${fd} err: `, err);
            throw translateError(err);
        }
    }
    async setSize(fd: Descriptor, size: bigint): Promise<void> {
        try {
            await this.openFiles.getAsFile(fd).setSize(Number(size));
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async setTimes(
        fd: Descriptor,
        dataAccessTimestamp: fs.NewTimestamp,
        dataModificationTimestamp: fs.NewTimestamp
    ): Promise<void> {
        try {
            const of = this.openFiles.getAsFileOrDir(fd);
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
    async read(fd: Descriptor, length: Filesize, offset: Filesize): Promise<[Uint8Array, boolean]> {
        try {
            const newFd = await this.readViaStream(fd, offset);
            const input = this.openFiles.getAsReadable(newFd);
            // TODO: gracefully handle bigint
            const lengthNumber = Number(length);
            const chunk = await input.read(lengthNumber);
            this.openFiles.closeFileClone(newFd);
            let isEnd = false;
            if (chunk.length < length) {
                isEnd = true;
            }
            return [chunk, isEnd];
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async write(fd: Descriptor, buffer: Uint8Array, offset: FileSize): Promise<bigint> {
        try {
            const newFd = await this.writeViaStream(fd, offset);
            const out = this.openFiles.getAsWritable(newFd);
            await out.write(buffer);
            const readNo = buffer.length;
            this.openFiles.closeFileClone(newFd);
            return BigInt(readNo);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async readDirectory(fd: Descriptor): Promise<DirectoryEntryStream> {
        try {
            const dirReadFd = await this.openFiles.openOpenDirectoryIterator(fd);
            return dirReadFd;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async sync(fd: Descriptor): Promise<void> {
        try {
            await this.openFiles.getAsFile(fd).flush();
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async createDirectoryAt(fd: Descriptor, path: string): Promise<void> {
        try {
            const openDir = this.openFiles.getAsDir(fd);
            await openDir.openWithCreate(path, true, FileOrDir.Dir, openDir.handle);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async stat(fd: Descriptor): Promise<DescriptorStat> {
        try {
            const resource = this.openFiles.get(fd);
            if (resource instanceof OpenFile || resource instanceof OpenDirectory) {
                const handle = resource.handle;
                let stat = await populateDescriptorStat(fd, handle);
                return stat;
            }
        } catch (err: any) {
            throw translateError(err);
        }
        throw "bad-descriptor";
    }
    async statAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string): Promise<DescriptorStat> {
        try {
            //const resource = this.openFiles.get(fd);
            wasiDebug(`statAt: fd: ${fd} path: ${path}`);
            const openDir = this.openFiles.getAsDir(fd);
            const handle = await openDir.getFileOrDir(path, FileOrDir.Any);
            let stat = await populateDescriptorStat(fd, handle);
            return stat;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async setTimesAt(
        fd: Descriptor,
        pathFlags: fs.PathFlags,
        path: string,
        dataAccessTimestamp: fs.NewTimestamp,
        dataModificationTimestamp: fs.NewTimestamp
    ): Promise<void> {
        try {
            const opendir = this.openFiles.getAsDir(fd);
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
    linkAt(
        fd: Descriptor,
        oldPathFlags: fs.PathFlags,
        oldPath: string,
        newDescriptor: Descriptor,
        newPath: string
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async openAt(
        fd: Descriptor,
        pathFlags: fs.PathFlags,
        path: string,
        openFlags: fs.OpenFlags,
        descriptorFlags: DescriptorFlags,
        modes: fs.Modes
    ): Promise<Descriptor> {
        try {
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
            return resultFd;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async readlinkAt(fd: Descriptor, path: string): Promise<string> {
        /*
        const fd = await this.openAt(fd, {symlinkFollow: false});
        const openDir = this.openFiles.getAsDir(fd);
        const handle = await openDir.getFileOrDir(path, FileOrDir.Any);
        const resultFd = await this.openFiles.open(openDir, path, oflags, fdflags);
        return path;
        */
        throw 'not-permitted';
    }
    async removeDirectoryAt(fd: Descriptor, path: string): Promise<void> {
        try {
            wasiDebug(`[removeDirectoryAt] fd: ${fd} path: ${path}`);
            const openDir = this.openFiles.getAsDir(fd);
            await openDir.delete(path);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async renameAt(fd: Descriptor, oldPath: string, newDescriptor: Descriptor, newPath: string): Promise<void> {
        throw 'not-permitted';
    }
    async symlinkAt(fd: Descriptor, oldPath: string, newPath: string): Promise<void> {
        throw 'not-permitted';
    }
    async accessAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, type: fs.AccessType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async unlinkFileAt(fd: Descriptor, path: string): Promise<void> {
        try {
            wasiDebug(`[unlinkFileAt] fd: ${fd} path: ${path}`);
            const dir = this.openFiles.getAsDir(fd);
            await dir.delete(path);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async changeFilePermissionsAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, modes: fs.Modes): Promise<void> {
        throw 'not-permitted';
    }
    async changeDirectoryPermissionsAt(
        fd: Descriptor,
        pathFlags: fs.PathFlags,
        path: string,
        modes: fs.Modes
    ): Promise<void> {
        throw 'not-permitted';
    }
    lockShared(fd: Descriptor): Promise<void> {
        throw new Error("Method not implemented.");
    }
    lockExclusive(fd: Descriptor): Promise<void> {
        throw new Error("Method not implemented.");
    }
    tryLockShared(fd: Descriptor): Promise<void> {
        throw new Error("Method not implemented.");
    }
    tryLockExclusive(fd: Descriptor): Promise<void> {
        throw new Error("Method not implemented.");
    }
    unlock(fd: Descriptor): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async dropDescriptor(fd: Descriptor): Promise<void> {
        try {
            await this.openFiles.close(fd);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async readDirectoryEntry(dirFd: DirectoryEntryStream): Promise<fs.DirectoryEntry | undefined> {
        try {
            const dirIter = await this.openFiles.getAsOpenDirectoryIterator(dirFd);
            const next = await dirIter.next();
            return next;
        } catch (err: any) {
            wasiPreview2Debug("readDirectoryEntry err:", err);
            throw translateError(err);
        }
    }
    async dropDirectoryEntryStream(dirFd: DirectoryEntryStream): Promise<void> {
        try {
            await this.openFiles.close(dirFd);
        } catch (err: any) {
            throw translateError(err);
        }
    }

    async isSameObject(fd: Descriptor, otherFd: Descriptor): Promise<boolean> {
        const thisMd = await this.metadataHash(fd);
        const otherMd = await this.metadataHash(otherFd);
        if (( thisMd.lower == otherMd.lower ) && ( thisMd.upper == otherMd.upper)) {
            return true;
        }
        return false;
    }
    async metadataHash(fd: Descriptor): Promise<fs.MetadataHashValue> {
        const stat = await this.stat(fd);
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
    async metadataHashAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string): Promise<fs.MetadataHashValue> {
        const stat = await this.statAt(fd, pathFlags, path);
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
}

async function populateDescriptorStat(fd: Descriptor, fHandle: FileSystemHandle): Promise<DescriptorStat> {
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
