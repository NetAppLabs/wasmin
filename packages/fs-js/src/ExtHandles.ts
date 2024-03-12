import { FileSystemHandle } from "./FileSystemAccess.js";

export interface FileSystemLinkHandle extends FileSystemHandle {
    kind: "link";
    destination: string;
}

// Extension to allow FileSystemHandle to be able to create links
export interface Linkable {
    createHardLink(name: string, destination: string): void;
    createSymbolicLink(name: string, destination: string): void;
}

// Extension to allow FileSystemHandle to have stat
export interface Statable {
    // fs stat
    stat(): Promise<Stat>;
    // accessedTime and modifiedTime in nanoseconds
    updateTimes(accessedTime: bigint | null, modifiedTime: bigint | null): Promise<void>;
}

export interface Stat {
    // fs inode
    readonly inode?: bigint;
    // size in bytes
    readonly size: bigint;
    // creationTime in nanoseconds
    readonly creationTime: bigint;
    // modifiedTime in nanoseconds
    readonly modifiedTime: bigint;
    // accessedTime in nanoseconds
    readonly accessedTime: bigint;
    // accessedTime and modifiedTime in nanoseconds
}

export interface MountedEntry {
    path: string,
    source: string,
    attributes: string[],
}

// Extension to allow FileSystemHandle be able to be Mounted onto another
export interface Mountable {
    mountHandle(handle: FileSystemHandle): Promise<FileSystemHandle>;
    removeMounted(path: string): Promise<void>;
    listMounted(recurseDepth?: number): Promise<MountedEntry[]>;
}