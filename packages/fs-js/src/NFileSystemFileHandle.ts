import { NFileSystemHandle } from "./NFileSystemHandle.js";
import { NFileSystemWritableFileStream } from "./NFileSystemWritableFileStream.js";
import { NFileSystemWritableSyncStream } from "./NFileSystemWritableSyncStream.js";
import { FileSystemFileHandle, FileSystemSyncAccessHandle } from "./index.js";
import { FileSystemWritableFileStream } from "./FileSystemAccess.js";

export function isBun() {
    // only bun has global Bun
    try {
        // @ts-ignore
        return globalThis.Bun != null;
    } catch (e) {
        return false;
    }
}

export function isDeno() {
    // only deno has global Deno
    try {
        // @ts-ignore
        return globalThis.Deno != null;
    } catch (e) {
        return false;
    }
}

export class NFileSystemFileHandle extends NFileSystemHandle implements FileSystemFileHandle {
    constructor(adapter: FileSystemFileHandle) {
        super(adapter);
    }

    async createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle> {
        const inner = this.adapter as any;
        if (inner.createSyncAccessHandle) {
            const ah = await inner.createSyncAccessHandle();
            return ah;
        }
        throw new Error("Method not implemented.");
    }

    public kind = "file" as const;

    async createWritable(options: { keepExistingData?: boolean } = {}): Promise<FileSystemWritableFileStream> {
        const thisAdapter = this.getAdapterFileSystemFileHandle();
        if (thisAdapter.createWritable) {
            const wr = new NFileSystemWritableFileStream(await thisAdapter.createWritable(options));
            return wr;
        } else if (thisAdapter.createSyncAccessHandle) {
            // Specifically for Safari
            // See https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/
            const accessHandle = await thisAdapter.createSyncAccessHandle();
            const writer = new NFileSystemWritableSyncStream(accessHandle);
            return writer;
        }
        throw new Error("createWritable not supported");
    }

    getFile(): Promise<File> {
        return Promise.resolve(this.getAdapterFileSystemFileHandle().getFile());
    }

    get [Symbol.toStringTag]() {
        return "FileSystemFileHandle";
    }

    private getAdapterFileSystemFileHandle(): FileSystemFileHandle {
        return this.adapter as FileSystemFileHandle;
    }
}
