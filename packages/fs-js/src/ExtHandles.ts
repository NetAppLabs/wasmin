import { FileSystemHandle } from "./FileSystemAccess.js";

export interface FileSystemLinkHandle extends FileSystemHandle {
    kind: "link";
    destination: string;
}

export interface Linkable {
    createSymbolicLink(name: string, destination: string): void;
}

export interface Inodable {
    inode: bigint;
}

export interface Timestampable {
    modifiedTime: number;
    creationTime: number;
    accessedTime: number;
}
