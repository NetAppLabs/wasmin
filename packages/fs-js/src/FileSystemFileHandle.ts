import { NFileSystemHandle } from "./FileSystemHandle.js";
import { FileSystemWritableFileStream } from "./FileSystemWritableFileStream.js";

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
        this.isFile = true;
        this.isDirectory = false;
    }

    async createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle> {
        throw new Error("Method not implemented.");
    }
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isFile: true;

    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isDirectory: false;

    public kind = "file" as const;

    async createWritable(options: { keepExistingData?: boolean } = {}): Promise<FileSystemWritableFileStream> {
        const thisAdapter = this.getAdapterFileSystemFileHandle();
        if (thisAdapter.createWritable) {
            const isBun = detectBun();
            if (isBun) {
                // Temporary hack for Bun as FileSystemWritableFileStream does not work
                // TODO: remove this once FileSystemWritableFileStream becomes usable in bun
                //const wr = await thisAdapter.createWritable(options);
                const wr = new FileSystemWritableFileStream(await thisAdapter.createWritable(options));
                return wr;
            } else {
                return new FileSystemWritableFileStream(await thisAdapter.createWritable(options));
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
