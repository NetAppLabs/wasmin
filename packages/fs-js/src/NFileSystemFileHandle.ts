import { Timestampable } from "./ExtHandles.js";
import { NFileSystemHandle } from "./NFileSystemHandle.js";
import { NFileSystemWritableFileStream } from "./NFileSystemWritableFileStream.js";
import { FileSystemFileHandle } from "./index.js";

export function detectBun() {
    // only bun has global Bun
    try {
        // @ts-ignore
        return globalThis.Bun != null;
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

    async createWritable(options: { keepExistingData?: boolean } = {}): Promise<NFileSystemWritableFileStream> {
        const thisAdapter = this.getAdapterFileSystemFileHandle();
        if (thisAdapter.createWritable) {
            const isBun = detectBun();
            if (isBun) {
                // Temporary hack for Bun as NFileSystemWritableFileStream does not work
                // TODO: remove this once NFileSystemWritableFileStream becomes usable in bun
                //const wr = await thisAdapter.createWritable(options);
                const wr = new NFileSystemWritableFileStream(await thisAdapter.createWritable(options));
                return wr;
            } else {
                return new NFileSystemWritableFileStream(await thisAdapter.createWritable(options));
            }

            // @ts-ignore
        } else if (thisAdapter.createAccessHandle) {
            // Specifically for Safari
            // See https://github.com/WICG/file-system-access/blob/main/AccessHandle.md
            // and https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/
            // @ts-ignore
            const accessHandle = await thisAdapter.createAccessHandle();
            const writer = accessHandle.writable.getWriter();
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
