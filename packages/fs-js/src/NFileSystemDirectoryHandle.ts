import { NFileSystemHandle } from "./NFileSystemHandle.js";
import { NFileSystemFileHandle } from "./NFileSystemFileHandle.js";
import { getDirectoryHandleByURL } from "./getDirectoryHandleByURL.js";
import { TypeMismatchError } from "./errors.js";
import { FileSystemHandle } from "./FileSystemAccess.js";
import { FileSystemDirectoryHandle, FileSystemFileHandle, Mountable, PreNameCheck } from "./index.js";
import { MountedEntry } from "./ExtHandles.js";

const FILESYSTEM_DEBUG = false;

export function fileSystemDebug(msg?: any, ...optionalParams: any[]): void {
    if (FILESYSTEM_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}
export class NFileSystemDirectoryHandle extends NFileSystemHandle implements FileSystemDirectoryHandle, Mountable {
    constructor(public adapter: FileSystemDirectoryHandle, secretStore?: any) {
        super(adapter);
        this.secretStore = secretStore;
        this._externalHandleCache = {};
    }
    static MOUNTED_HANDLE_FILE_LINK_SUFFIX = ".link";
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
            const newName = `${name}${NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX}`;
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
            if (entryName.endsWith(NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX)) {
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
            if (entryName.endsWith(NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX)) {
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
    }

    async *keys(): AsyncGenerator<string> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const [name, _] of this.adapter.entries()) {
            if (name.endsWith(NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX)) {
                const newName = name.replace(NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX, "");
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
            const newName = `${name}${NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX}`;
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
    }

    async removeEntry(name: string, options = { recursive: false}): Promise<void> {
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

    async removeMounted(path: string): Promise<void> {
        let adapterany = this.adapter as any;
        if (adapterany.removeMounted) {
            return await adapterany.removeMounted(path);
        } else {
            let indexOfSlash = path.indexOf("/");
            if (indexOfSlash == -1 ) {
                let fileName = path;
                const fileNameWithSuffix = `${fileName}${NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX}`;
                await this.removeEntry(fileNameWithSuffix, {recursive: false})
                delete this._externalHandleCache[path];
            } else if (indexOfSlash == 0 ) {
                let subPath = path.substring(1);
                await this.removeMounted(subPath);
            } else if (indexOfSlash > 0 ) {
                let subName = path.substring(0, indexOfSlash);
                let restPath = path.substring(indexOfSlash+1);
                let subdir = await this.getDirectoryHandle(subName);
                if (subdir instanceof NFileSystemDirectoryHandle) {
                    await subdir.removeMounted(restPath);
                }
            }
        }
    }

    async listMounted(recurseDepth?: number): Promise<MountedEntry[]> {
        if (recurseDepth == undefined) {
            recurseDepth = 3;
        }
        let adapterany = this.adapter as any;
        if (adapterany.listMounted) {
            return await adapterany.listMounted(recurseDepth);
        } else {
            this.fsDebug("listMounted: for :", this.adapter);
            let ret: MountedEntry[] = [];
            if (recurseDepth > 0 ) {
                for await (const [, entry] of this.adapter.entries()) {
                    const entryName = entry.name;
                    if (entryName.endsWith(NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX)) {
                        const newEntry = await this.getExternalHandle(entryName);
                        let newEntryAny = newEntry as any;
                        const newEntryName = newEntry.name;
                        let sourceUrl = newEntryAny.url;
                        if (sourceUrl == undefined) {
                            if (newEntryAny.adapter !== undefined) {
                                newEntryAny = newEntryAny.adapter;
                                sourceUrl = newEntryAny.url;
                            }
                        }
                        if (sourceUrl == undefined) {
                            sourceUrl = "";
                        }
                        let entry: MountedEntry = {
                            path: newEntryName,
                            source: sourceUrl,
                            attributes: []
                        }
                        ret.push(entry);
                      
                    } else {
                        if (recurseDepth > 0) {
                            if (entry.kind == "directory") {
                                let subDir = new NFileSystemDirectoryHandle(entry, this.secretStore);
                                let subMounted = await subDir.listMounted(recurseDepth-1);
                                for (const subMount of subMounted) {
                                    let subPath = subMount.path;
                                    subMount.path = entryName + "/" + subPath;
                                    ret.push(subMount);
                                }
                            }
                        }
                    }
                }
            }
            return ret;
        }
    }

    // Mount an external handle into the FS
    async mountHandle(handle: FileSystemHandle): Promise<FileSystemHandle> {
        let adapterany = this.adapter as any;
        if (adapterany.mountHandle) {
            let mountable = adapterany as Mountable;
            return mountable.mountHandle(handle);
        } else {
            const serializedHandle = JSON.stringify(handle);
            const fileName = handle.name;
            const fileNameWithSuffix = `${fileName}${NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX}`;
            const newFh = await this.adapter.getFileHandle(fileNameWithSuffix, {
                create: true,
            });
            const keepExistingData = false;
            const writer = await newFh.createWritable({
                keepExistingData: keepExistingData,
            });
            const chunk = serializedHandle;
            await writer.write(chunk);
            await writer.close();
            const cacheInsert = true;
            if (cacheInsert) {
                const name = newFh;
                const newName = `${name}${NFileSystemDirectoryHandle.MOUNTED_HANDLE_FILE_LINK_SUFFIX}`;
                this._externalHandleCache[newName] = newFh;
            }
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
                // deserialize handle from json
                const obj = JSON.parse(str);
                returnFh = obj as FileSystemDirectoryHandle | FileSystemFileHandle;
            } catch (error: any) {
                fileSystemDebug("error on JSON.parse for getExternalHandle: ", error);
            }
            let returnFhDeserialized = returnFh as any;
            if (returnFhDeserialized.adapter) {
                // prefer the .adapter instance if any
                returnFh = returnFhDeserialized.adapter;
                returnFhDeserialized = returnFh;
            }
            if (returnFhDeserialized.url) {
                const secretStore = this.secretStore;
                try {
                    // re-awake the FS Handle by getting instance from URL
                    returnFh = await getDirectoryHandleByURL(returnFhDeserialized.url, secretStore);
                } catch (error: any) {
                    fileSystemDebug("error on getDirectoryHandleByURL: ", error);
                }
            }
            if (returnFh == null) {
                returnFh = newFh;
            }
            // update name from set name
            // if name is different from default populated by getDirectoryHandleByURL
            // @ts-ignore
            returnFh.name = returnFhDeserialized.name;
            this._externalHandleCache[fileName] = returnFh;
            if (returnFh.kind === "file") {
                return returnFh as FileSystemFileHandle;
            } else {
                return returnFh as FileSystemDirectoryHandle;
            }
        }
    }
}
