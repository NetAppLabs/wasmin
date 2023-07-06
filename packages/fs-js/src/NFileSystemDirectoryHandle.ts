import { NFileSystemHandle } from "./NFileSystemHandle.js";
import { NFileSystemFileHandle } from "./NFileSystemFileHandle.js";
import { getDirectoryHandleByURL } from "./getDirectoryHandleByURL.js";
import { TypeMismatchError } from "./errors.js";
import { FileSystemHandle } from "./FileSystemAccess.js";
import { FileSystemDirectoryHandle, FileSystemFileHandle, PreNameCheck } from "./index.js";

const FILESYSTEM_DEBUG = false;

export function fileSystemDebug(msg?: any, ...optionalParams: any[]): void {
    if (FILESYSTEM_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}
export class NFileSystemDirectoryHandle extends NFileSystemHandle implements FileSystemDirectoryHandle {
    constructor(public adapter: FileSystemDirectoryHandle, secretStore?: any) {
        super(adapter);
        //this.getFile = this.getFileHandle;
        //this.getDirectory = this.getDirectoryHandle;
        //this.getEntries = this.values;
        this.secretStore = secretStore;
        this._externalHandleCache = {};
    }
    static LINK_SUFFIX = ".link";
    secretStore: any;
    _externalHandleCache: Record<string, FileSystemDirectoryHandle | FileSystemFileHandle>;

    public kind = "directory" as const;

    async getDirectoryHandle(
        name: string,
        options?: FileSystemGetDirectoryOptions
    ): Promise<FileSystemDirectoryHandle> {
        PreNameCheck(name);
        try {
            const f = new NFileSystemDirectoryHandle(
                await this.adapter.getDirectoryHandle(name, options),
                this.secretStore
            );
            return f;
        } catch (error: any) {
            const newName = `${name}${NFileSystemDirectoryHandle.LINK_SUFFIX}`;
            try {
                const f = await this.getExternalHandle(newName);
                if (f.kind === "directory") {
                    return f as FileSystemDirectoryHandle;
                } else {
                    throw error;
                }
                // eslint-disable-next-line no-empty
            } catch (error2: any) {}
            throw error;
        }
    }

    async *entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]> {
        this.fsDebug("entries: for :", this.adapter);
        for await (const [, entry] of this.adapter.entries()) {
            const entryName = entry.name;
            if (entryName.endsWith(NFileSystemDirectoryHandle.LINK_SUFFIX)) {
                const newEntry = await this.getExternalHandle(entryName);
                const newEntryName = newEntry.name;
                yield [
                    newEntryName,
                    newEntry.kind === "file"
                        ? new NFileSystemFileHandle(newEntry)
                        : new NFileSystemDirectoryHandle(newEntry, this.secretStore),
                ];
            } else {
                yield [
                    entryName,
                    entry.kind === "file"
                        ? new NFileSystemFileHandle(entry)
                        : new NFileSystemDirectoryHandle(entry, this.secretStore),
                ];
            }
        }
    }

    async *values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle> {
        this.fsDebug("values: for :", this.adapter);
        for await (const [, entry] of this.adapter.entries()) {
            const entryName = entry.name;
            if (entryName.endsWith(NFileSystemDirectoryHandle.LINK_SUFFIX)) {
                const newEntry = await this.getExternalHandle(entryName);
                yield newEntry.kind === "file"
                    ? new NFileSystemFileHandle(newEntry)
                    : new NFileSystemDirectoryHandle(newEntry, this.secretStore);
            } else {
                yield entry.kind === "file"
                    ? new NFileSystemFileHandle(entry)
                    : new NFileSystemDirectoryHandle(entry, this.secretStore);
            }
        }
        /*
    for await (const [, entry] of this.adapter.entries())
      yield entry.kind === "file"
        ? new NFileSystemFileHandle(entry)
        : new NFileSystemDirectoryHandle(entry);
    */
    }

    async *keys(): AsyncGenerator<string> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const [name, _] of this.adapter.entries()) {
            if (name.endsWith(NFileSystemDirectoryHandle.LINK_SUFFIX)) {
                const newName = name.replace(NFileSystemDirectoryHandle.LINK_SUFFIX, "");
                yield newName;
            } else {
                yield name;
            }
        }
    }

    async getFileHandle(name: string, options = { create: false }): Promise<FileSystemFileHandle> {
        PreNameCheck(name);
        try {
            const f = new NFileSystemFileHandle(await this.adapter.getFileHandle(name, options));
            return f;
        } catch (error: any) {
            fileSystemDebug("getFileHandle: err: ", error);
            const newName = `${name}${NFileSystemDirectoryHandle.LINK_SUFFIX}`;
            try {
                const f = await this.getExternalHandle(newName);
                if (f.kind === "file") {
                    return f as FileSystemFileHandle;
                } else {
                    throw new TypeMismatchError();
                }
                // eslint-disable-next-line no-empty
            } catch (error2: any) {}
            throw error;
        }
        /*
    return new NFileSystemFileHandle(
      await this.adapter.getFileHandle(name, options)
    );
    */
    }

    async removeEntry(name: string, options = { recursive: false }): Promise<void> {
        PreNameCheck(name);
        return this.adapter.removeEntry(name, options);
    }

    async resolve(possibleDescendant: NFileSystemHandle): Promise<string[] | null> {
        if (this.adapter.resolve) {
            return this.adapter.resolve(possibleDescendant);
        } else {
            if (await possibleDescendant.isSameEntry(this)) {
                return [];
            }
            const paths: string[] = [];
            const handle: FileSystemHandle = this as unknown as NFileSystemFileHandle;
            const openSet = [{ handle: handle, path: paths }];

            while (openSet.length) {
                const currentSet = openSet.pop();
                const current = currentSet?.handle;
                const path = currentSet?.path;
                if (current && path) {
                    if (current instanceof NFileSystemDirectoryHandle) {
                        const curdir = current as NFileSystemDirectoryHandle;
                        for await (const entry of curdir.values()) {
                            if (await entry.isSameEntry(possibleDescendant)) {
                                return [...path, entry.name];
                            }
                            if (entry.kind === "directory") {
                                openSet.push({ handle: entry, path: [...path, entry.name] });
                            }
                        }
                    }
                }
            }

            return null;
        }
    }

    [Symbol.asyncIterator]() {
        return this.entries();
    }

    get [Symbol.toStringTag]() {
        return "FileSystemDirectoryHandle";
    }

    // Extensions

    // Inserts an external handle into the FS
    async insertHandle(handle: FileSystemHandle): Promise<FileSystemHandle> {
        // @ts-ignore
        if (this.adapter.insertHandle) {
            // @ts-ignore
            return this.adapter.insertHandle(handle);
        } else {
            const serializedHandle = JSON.stringify(handle);
            const fileName = handle.name;
            const fileNameWithSuffix = `${fileName}${NFileSystemDirectoryHandle.LINK_SUFFIX}`;
            const newFh = await this.adapter.getFileHandle(fileNameWithSuffix, {
                create: true,
            });
            const keepExistingData = false;
            const writer = await newFh.createWritable({
                keepExistingData: keepExistingData,
            });
            const chunk = serializedHandle;
            writer.write(chunk);
            writer.close();
            return handle;
        }
    }

    // Gets an external handle as FileSystemHandle
    async getExternalHandle(fileName: string): Promise<FileSystemDirectoryHandle | FileSystemFileHandle> {
        let returnFh = this._externalHandleCache[fileName];
        if (returnFh) {
            return returnFh;
        } else {
            const newFh = await this.adapter.getFileHandle(fileName);
            const file = await newFh.getFile();
            const ab = await file.arrayBuffer();
            const str = new TextDecoder().decode(ab);
            try {
                const obj = JSON.parse(str);
                returnFh = obj as FileSystemDirectoryHandle | FileSystemFileHandle;
            } catch (error: any) {
                fileSystemDebug("error on JSON.parse for getExternalHandle: ", error);
            }
            let returnFhAny = returnFh as any;
            if (returnFhAny.adapter) {
                returnFh = returnFhAny.adapter;
                returnFhAny = returnFh;
            }
            if (returnFhAny.url) {
                const secretStore = this.secretStore;
                try {
                    returnFh = await getDirectoryHandleByURL(returnFhAny.url, secretStore);
                } catch (error: any) {
                    fileSystemDebug("error on getDirectoryHandleByURL: ", error);
                }
            }
            if (returnFh == null) {
                returnFh = newFh;
            }
            this._externalHandleCache[fileName] = returnFh;
            if (returnFh.kind === "file") {
                return returnFh as FileSystemFileHandle;
            } else {
                return returnFh as FileSystemDirectoryHandle;
            }
        }
    }
}
