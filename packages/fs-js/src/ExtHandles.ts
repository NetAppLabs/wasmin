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
    updateTimes(accessedTime: bigint|null, modifiedTime: bigint|null): Promise<void>;
}

export interface Stat {
    // fs inode
    readonly inode?: bigint;
    // creationTime in nanoseconds
    readonly creationTime: bigint;
    // modifiedTime in nanoseconds
    readonly modifiedTime: bigint;
    // accessedTime in nanoseconds
    readonly accessedTime: bigint;
    // accessedTime and modifiedTime in nanoseconds
}

// Extension to allow FileSystemHandle be able to be inserted into another
export interface Insertable {
    insertHandle(handle: FileSystemHandle): Promise<FileSystemHandle>;
}
