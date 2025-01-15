import { DefaultSink } from "./implements.js";
import { FileSystemSyncAccessHandle, FileSystemWritableFileStream } from "./index.js"
import { FileSystemWriteChunkType } from "./FileSystemAccess"


declare global {
    var FILESYSTEM_SYNC_WRITABLE_DEBUG: boolean;
}
globalThis.FILESYSTEM_SYNC_WRITABLE_DEBUG = false;

export function fileSystemSyncWritableDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.FILESYSTEM_SYNC_WRITABLE_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}


export class NFileSystemSyncSink extends DefaultSink<FileSystemSyncAccessHandle> implements FileSystemWritableFileStream {
    constructor(fileHandle: FileSystemSyncAccessHandle) {
        super(fileHandle);
        this.fileHandle = fileHandle;
        this.position = 0;
    }

    fileHandle: FileSystemSyncAccessHandle;

    getWriter(): WritableStreamDefaultWriter<any> {
        let str = new WritableStream(this);
        const w = new WritableStreamDefaultWriter<any>(str);
        return w;
    }

    async abort(reason?: any) {
        await this.close();
    }

    async write(chunk: FileSystemWriteChunkType) {
        fileSystemSyncWritableDebug("write chunk:", chunk);

        const preFile = this.file;
        try {
            await this.genericWrite(chunk);
            const file = this.file;
            if (file) {
                let ab = await file.arrayBuffer();
                let pos = this.position;
                this.fileHandle.write(ab, {at: pos});
            } else {
                throw new Error("Unexpected error, file is not set");
            }
        } catch (err: any) {
            fileSystemSyncWritableDebug("write err:", err);
            this.file = preFile;
            throw err;
        }
    }

    async close() {
        this.fileHandle.close();
        this.file = undefined;
        this.position = 0;
        this.size = 0;
    }
}

export class NFileSystemWritableSyncStream implements FileSystemWritableFileStream {
    constructor(syncAccessHandle: FileSystemSyncAccessHandle) {
        fileSystemSyncWritableDebug("Constructor NFileSystemWritableSyncFileStream with args: ", syncAccessHandle);
        this.locked = false;
        const sink = new NFileSystemSyncSink(syncAccessHandle);
        this._sink = sink;
    }
    locked: boolean;

    abort(reason?: unknown): Promise<void> {
        return this._sink.abort(reason);
    }
    getWriter(): WritableStreamDefaultWriter<any> {
        return this._sink.getWriter();
    }

    private _closed = false;
    private _sink: NFileSystemSyncSink;

    async close(): Promise<void> {
        fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: close start");
        this._closed = true;
        const w = this.getWriter();
        fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: w: ", w);
        // TODO inspect this on bun
        try {
            //console.trace();
            const p = w.close();
            const closePromise = p;
            fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: closePromise: ", closePromise);
            await closePromise;
        } catch (err: any) {
            if (err instanceof Error) {
                const eerr = err as Error;
                fileSystemSyncWritableDebug("NFileSystemWritableSyncStream close err: ", err);
                fileSystemSyncWritableDebug(eerr.stack);
            } else {
                fileSystemSyncWritableDebug("NFileSystemWritableSyncStream close unknown err: ", err);
            }
            throw err;
        }
        fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: w.close()");
        w.releaseLock();
        fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: close end");
        return;
    }

    async seek(position: number): Promise<void> {
        fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: seek");
        return this.write({ type: "seek", position });
    }

    async truncate(size: number): Promise<void> {
        fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: truncate");
        return this.write({ type: "truncate", size });
    }

    async write(data: FileSystemWriteChunkType): Promise<void> {
        fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: write start");
        if (this._closed) {
            return Promise.reject(new TypeError("Cannot write to a CLOSED writable stream"));
        }

        const writer = this.getWriter();
        await writer.write(data);
        try {
            writer.releaseLock();
        } catch (err: any) {
            fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: writer.releaseLock err:", err);
        }
        fileSystemSyncWritableDebug("NFileSystemWritableSyncStream: write end");
    }

    get [Symbol.toStringTag]() {
        return "NFileSystemWritableSyncStream";
    }
}
