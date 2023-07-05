const FileSystemHandlePermissionRead = "read";
const FileSystemHandlePermissionReadWrite = "readwrite";

import { FileSystemHandle, FileSystemHandlePermissionDescriptor, FileSystemHandleKind } from "./index.js";

const FS_DEBUG = false;
export class NFileSystemHandle implements FileSystemHandle {
    constructor(public adapter: FileSystemHandle) {
        this.kind = adapter.kind;
        this.name = adapter.name;
    }
    name: string;
    kind: FileSystemHandleKind;

    fsDebug(message?: any, ...optionalParams: any[]) {
        if (FS_DEBUG) {
            console.debug(message, optionalParams);
        }
    }

    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState> {
        if (this.adapter.queryPermission) {
            return this.adapter.queryPermission(descriptor);
        } else {
            if (descriptor) {
                if (descriptor.mode === FileSystemHandlePermissionRead) {
                    return "granted";
                } else if (descriptor.mode == FileSystemHandlePermissionReadWrite) {
                    const dynAdapter = this.adapter as any;
                    if (dynAdapter.writable) {
                        return dynAdapter.writable ? "granted" : "denied";
                    } else {
                        return "denied";
                    }
                } else {
                    throw new TypeError(`Mode ${descriptor.mode} must be 'read' or 'readwrite'`);
                }
            }
        }
        return "granted";
    }

    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState> {
        if (!descriptor) {
            descriptor = {
                mode: FileSystemHandlePermissionRead,
            };
        }
        if (this.adapter.requestPermission) {
            return this.adapter.requestPermission(descriptor);
        } else {
            if (descriptor.mode === FileSystemHandlePermissionRead) {
                return "granted";
            } else if (descriptor.mode == FileSystemHandlePermissionReadWrite) {
                const dynAdapter = this.adapter as any;
                if (dynAdapter.writable) {
                    return dynAdapter.writable ? "granted" : "denied";
                } else {
                    return "denied";
                }
            } else {
                throw new TypeError(`Mode ${descriptor.mode} must be 'read' or 'readwrite'`);
            }
        }
    }

    async isSameEntry(other: FileSystemHandle): Promise<boolean> {
        if (this === other) return true;
        if (other instanceof NFileSystemHandle) {
            if (typeof other !== "object" || this.kind !== other.kind || !other.adapter) {
                return false;
            }
            return this.adapter.isSameEntry(other.adapter);
        } else {
            return this.adapter.isSameEntry(other);
        }
    }

    get [Symbol.toStringTag]() {
        return "FileSystemHandle";
    }
}
