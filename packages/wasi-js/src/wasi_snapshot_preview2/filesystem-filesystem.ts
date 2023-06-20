//import { Descriptor, DescriptorType, Filesize, OutputStream } from "@wasm-env/wasi-snapshot-preview2"
import { FilesystemFilesystemNamespace as fs } from "@wasm-env/wasi-snapshot-preview2";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi";
import { FileOrDir, OpenDirectory, OpenFile, Socket } from "../wasiFileSystem";
type FileSize = fs.Filesize;
type Descriptor = fs.Descriptor;
type DescriptorType = fs.DescriptorType;
type DescriptorStat = fs.DescriptorStat;
type DescriptorFlags = fs.DescriptorFlags;
type InputStream = fs.InputStream;
type OutputStream = fs.OutputStream;
type DirectoryEntryStream = fs.DirectoryEntryStream;
type Datetime = fs.Datetime;

export function writeViaStream(t: Descriptor, offset: fs.Filesize): fs.OutputStream {
    console.log("writeViaStream");
    const outStr: fs.OutputStream = 0;
    return outStr;
}

export function appendViaStream(t: Descriptor): fs.OutputStream{
    console.log("appendViaStream");
    const outStr: fs.OutputStream = 0;
    return outStr;
}

export function dropDescriptor(t: Descriptor): void {
    console.log("dropDescriptor");
    return;
}

export function getType(t: Descriptor): DescriptorType {
    console.log("getType");
    const descriptorType: DescriptorType = 'unknown';
    return descriptorType;
}

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
        return await this.openFiles.openReader(fd, offset);
    }
    async writeViaStream(fd: Descriptor, offset: FileSize): Promise<OutputStream> {
        return await this.openFiles.openWriter(fd, offset);
    }
    appendViaStream(fd: Descriptor): Promise<OutputStream> {
        throw new Error("Method not implemented.");
    }
    advise(fd: Descriptor, offset: FileSize, length: bigint, advice: fs.Advice): Promise<void> {
        throw new Error("Method not implemented.");
    }
    syncData(fd: Descriptor): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getFlags(fd: Descriptor): Promise<DescriptorFlags> {
        throw new Error("Method not implemented.");
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
    setTimes(fd: Descriptor, dataAccessTimestamp: fs.NewTimestamp, dataModificationTimestamp: fs.NewTimestamp): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async read(fd: Descriptor, length: bigint, offset: FileSize): Promise<[Uint8Array | ArrayBuffer, boolean]> {
        // TODO handle offset
        // TODO handle bigint
        const input = this.openFiles.getAsReadable(fd);
        const lengthNumber = Number(length);
        const chunk = await input.read(lengthNumber);
        return [chunk, true];
    }
    async write(fd: Descriptor, buffer: Uint8Array, offset: FileSize): Promise<bigint> {
        // TODO handle offset
        // TODO handle bigint
        const out = this.openFiles.getAsWritable(fd);
        await out.write(buffer);
        const readNo = buffer.length;
        return BigInt(readNo);
    }
    readDirectory(fd: Descriptor): Promise<DirectoryEntryStream> {
        throw new Error("Method not implemented.");
    }
    sync(fd: Descriptor): Promise<void> {
        throw new Error("Method not implemented.");
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
    setTimesAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, dataAccessTimestamp: fs.NewTimestamp, dataModificationTimestamp: fs.NewTimestamp): Promise<void> {
        throw new Error("Method not implemented.");
    }
    linkAt(fd: Descriptor, oldPathFlags: fs.PathFlags, oldPath: string, newDescriptor: Descriptor, newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    openAt(fd: Descriptor, pathFlags: fs.PathFlags, path: string, openFlags: fs.OpenFlags, flags: DescriptorFlags, modes: fs.Modes): Promise<Descriptor> {
        throw new Error("Method not implemented.");
    }
    readlinkAt(fd: Descriptor, path: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    removeDirectoryAt(fd: Descriptor, path: string): Promise<void> {
        throw new Error("Method not implemented.");
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
    unlinkFileAt(fd: Descriptor, path: string): Promise<void> {
        throw new Error("Method not implemented.");
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
    readDirectoryEntry(dirFd: DirectoryEntryStream): Promise<fs.DirectoryEntry | null> {
        throw new Error("Method not implemented.");
    }
    dropDirectoryEntryStream(fd: Descriptor): Promise<void> {
        throw new Error("Method not implemented.");
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
