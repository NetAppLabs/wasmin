//import { Descriptor, DescriptorType, Filesize, OutputStream } from "@wasm-env/wasi-snapshot-preview2"
import { FilesystemFilesystemNamespace as fs } from "@wasm-env/wasi-snapshot-preview2";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";
import { FileOrDir, OpenDirectory, OpenFile, Socket } from "../wasiFileSystem.js";
import { Fdflags, FdflagsN, Oflags, OflagsN } from "../wasi_snapshot_preview1/bindings.js";
import { unimplemented, wasiDebug, wasiWarn } from "../wasiUtils.js";
type FileSize = fs.Filesize;
type Descriptor = fs.Descriptor;
type DescriptorType = fs.DescriptorType;
type DescriptorStat = fs.DescriptorStat;
type DescriptorFlags = fs.DescriptorFlags;
type InputStream = fs.InputStream;
type OutputStream = fs.OutputStream;
type DirectoryEntryStream = fs.DirectoryEntryStream;
type Datetime = fs.Datetime;

export class FileSystemFileSystemAsyncHost implements fs.FilesystemFilesystemAsync{
    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    get wasiEnv(){
        return this._wasiEnv;
    }
    get openFiles(){
        return this.wasiEnv.openFiles;
    }
    async readViaStream(fd: Descriptor, offset: FileSize): Promise<InputStream> {
        const newFd = await this.openFiles.openReader(fd, offset);
        console.log("FileSystemFileSystemAsyncHost: readViaStream newFd:",newFd);
        return newFd;
    }
    async writeViaStream(fd: Descriptor, offset: FileSize): Promise<OutputStream> {
        const newFd = await this.openFiles.openWriter(fd, offset);
        console.log("FileSystemFileSystemAsyncHost: writeViaStream newFd:",newFd);
        return newFd;
    }
    async appendViaStream(fd: Descriptor): Promise<OutputStream> {
        return await this.openFiles.openWriter(fd, 0n, true);
    }
    async advise(fd: Descriptor, offset: FileSize, length: bigint, advice: fs.Advice): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async syncData(fd: Descriptor): Promise<void> {
        await this.openFiles.getAsFile(fd).flush();
    }
    async getFlags(fd: Descriptor): Promise<DescriptorFlags> {
        const dFlags: DescriptorFlags = {
            read: true,
            write: true,
            fileIntegritySync: false,
            dataIntegritySync: false,
            requestedWriteSync: false,
            mutateDirectory: false,
        }
        return dFlags;
    }
    async getType(fd: Descriptor): Promise<DescriptorType> {
        const fdhandle = this.openFiles.get(fd);
        if (fdhandle instanceof OpenFile){
            return 'regular-file'
        } else if (fdhandle instanceof OpenDirectory){
            return 'directory'
        } else if (fdhandle instanceof Socket){
            return 'socket'
        } else {
            return 'character-device'
        }
    }
    async setSize(fd: Descriptor, size: bigint): Promise<void> {
        await this.openFiles.getAsFile(fd).setSize(Number(size));
    }
    async setTimes(fd: Descriptor, dataAccessTimestamp: fs.NewTimestamp, dataModificationTimestamp: fs.NewTimestamp): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async read(fd: Descriptor, length: bigint, offset: FileSize): Promise<[Uint8Array | ArrayBuffer, boolean]> {
        const newFd = await this.readViaStream(fd, offset);
        const input = this.openFiles.getAsReadable(newFd);
        // TODO: gracefully handle bigint
        const lengthNumber = Number(length);
        const chunk = await input.read(lengthNumber);
        this.openFiles.close(newFd);
        let isEnd = false;
        if (chunk.length < length){
            isEnd = true;
        }
        return [chunk, isEnd];
    }
    async write(fd: Descriptor, buffer: Uint8Array, offset: FileSize): Promise<bigint> {
        const newFd = await this.writeViaStream(fd, offset);
        const out = this.openFiles.getAsWritable(newFd);
        await out.write(buffer);
        const readNo = buffer.length;
        this.openFiles.close(newFd);
        return BigInt(readNo);
    }
    async readDirectory(fd: Descriptor): Promise<DirectoryEntryStream> {
        const dirReadFd = await this.openFiles.openOpenDirectoryIterator(fd);
        return dirReadFd;
    }
    async sync(fd: Descriptor): Promise<void> {
        await this.openFiles.getAsFile(fd).flush();
    }
    async createDirectoryAt(fd: Descriptor, path: string): Promise<void> {
        const openDir = this.openFiles.getAsDir(fd);
        await openDir.openWithCreate(path,true,FileOrDir.Dir,openDir.handle);
    }
    async stat(fd: Descriptor): Promise<DescriptorStat> {
        const fdhandle = this.openFiles.get(fd);
        let stat: DescriptorStat;
        if (fdhandle instanceof OpenFile){
            const handle = fdhandle.handle;
            stat = populateDescriptorStat(handle.kind === "file" ? await handle.getFile() : undefined);
            return stat;
        } else {
            stat = populateDescriptorStat(undefined);
        }
        return stat;
    }
    async statAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string): Promise<DescriptorStat> {
        const handle = await this.openFiles.getPreOpen(fd).getFileOrDir(path, FileOrDir.Any);
        const stat = populateDescriptorStat(handle.kind === "file" ? await handle.getFile() : undefined);
        return stat;
    }
    async setTimesAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, dataAccessTimestamp: fs.NewTimestamp, dataModificationTimestamp: fs.NewTimestamp): Promise<void> {
        throw new Error("Method not implemented.");
    }
    linkAt(fd: Descriptor, oldPathFlags: fs.PathFlags, oldPath: string, newDescriptor: Descriptor, newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async openAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, openFlags: fs.OpenFlags, descriptorFlags: DescriptorFlags, modes: fs.Modes): Promise<Descriptor> {

        let fdflags: Fdflags = 0x0;
        let oflags: Oflags = 0x0;

        if (openFlags.create)
            oflags |= OflagsN.CREAT;
        if (openFlags.directory)
            oflags |= OflagsN.DIRECTORY;
        if (openFlags.exclusive)
            oflags |= OflagsN.EXCL;
        if (openFlags.truncate)
            oflags |= OflagsN.TRUNC;
        
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
    }
    readlinkAt(fd: Descriptor, path: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async removeDirectoryAt(fd: Descriptor, path: string): Promise<void> {
        wasiDebug(`[removeDirectoryAt] fd: ${fd} path: ${path}`);
        const openDir = this.openFiles.getAsDir(fd);
        await openDir.delete(path);
    }
    renameAt(fd: Descriptor, oldPath: string, newDescriptor: Descriptor, newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    symlinkAt(fd: Descriptor, oldPath: string, newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    accessAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, type: fs.AccessType): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async unlinkFileAt(fd: Descriptor, path: string): Promise<void> {
        wasiDebug(`[unlinkFileAt] fd: ${fd} path: ${path}`);
        const resource = this.openFiles.get(fd);
        if (resource instanceof OpenDirectory) {
            const dir = resource as OpenDirectory;
            await dir.delete(path);
        } else if (resource instanceof OpenFile) {
            const f = resource as OpenFile;
            wasiWarn("unexpected file fd in unlinkFileAt");
            throw 'bad-descriptor';
        } else {
            throw 'bad-descriptor';
        }
        return;
    }
    changeFilePermissionsAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, modes: fs.Modes): Promise<void> {
        throw new Error("Method not implemented.");
    }
    changeDirectoryPermissionsAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, modes: fs.Modes): Promise<void> {
        throw new Error("Method not implemented.");
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
        await this.openFiles.close(fd);
    }
    async readDirectoryEntry(dirFd: DirectoryEntryStream): Promise<fs.DirectoryEntry | null> {
        const dirIter = await this.openFiles.getAsOpenDirectoryIterator(dirFd);
        const next = await dirIter.next();
        return next;
    }
    async dropDirectoryEntryStream(dirFd: DirectoryEntryStream): Promise<void> {
        await this.openFiles.close(dirFd);
    }

}

function populateDescriptorStat(file: File | undefined): DescriptorStat{
    let size = 0n;
    let timeSeconds = 0n;
    let timeNanoSeconds = 0;
    if (file) {
        size = BigInt(file.size);
        timeSeconds = BigInt(file.lastModified) / 1000n;
        timeNanoSeconds = file.lastModified * 1000;
    }
    const time: Datetime = {
        seconds: timeSeconds,
        nanoseconds: timeNanoSeconds,
    }
    const newStat: DescriptorStat = {
        device: 0n,
        inode: 0n,
        type: file ? 'regular-file' : 'directory',
        linkCount: 0n,
        statusChangeTimestamp: time,
        dataModificationTimestamp: time,
        dataAccessTimestamp: time,
        size: size,
    };
    return newStat;
}
