/* eslint-disable @typescript-eslint/member-ordering */

import { TypeMismatchError } from "@wasm-env/fs-js";
import { HostManagerInstance } from "./host";
import { Logger } from "./log";
import { Host, Process } from "./types";
//import { FileSystemDirectoryHandle } from '@types/wicg-file-system-access';
//import { FileSystemDirectoryHandle } from 'wicg-file-system-access';
//import { default as g } from 'wicg-file-system-access';
//type PermissionState = "denied" | "granted" | "prompt";

/*
declare var File: {
    prototype: File;
    new(fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File;
};
*/
const textEncoder = new TextEncoder();

async function getTestProccesses(): Promise<Process[]> {
    const proc1: Process = {
        id: "test",
        cmd: "testercmd",
        env: {
            test: "ok",
        },
        args: ["asdf", "arg2"],
    };
    const proc2: Process = {
        id: "test2",
        cmd: "testercmd2",
    };
    const procs = [proc1, proc2];
    return procs;
}

async function getHostProcesses(): Promise<Record<string, Process>> {
    const procs = await HostManagerInstance.processManager.map();
    return procs;
}

async function getHosts(): Promise<Record<string, Host>> {
    const hosts = await HostManagerInstance.map();
    return hosts;
}

export async function getProcFsHandle(): Promise<FileSystemDirectoryHandle> {
    //const procs = await HostManagerInstance.processManager.list();
    const procs = getHostProcesses;
    const newHandle = new ObjectFileSystemDirectoryHandle("proc", procs);
    return newHandle;
}

export async function getHostsFsHandle(): Promise<FileSystemDirectoryHandle> {
    //const procs = await HostManagerInstance.processManager.list();
    const hosts = getHosts;
    const newHandle = new ObjectFileSystemDirectoryHandle("hosts", hosts);
    return newHandle;
}

export class ObjectFileSystemDirectoryHandle implements FileSystemDirectoryHandle {
    constructor(name: string, obj: Object | (() => Promise<Object>)) {
        this.obj = obj;
        this.name = name;
        this.isFile = false;
        this.isDirectory = true;
        this.kind = "directory";
    }
    obj: Object | (() => Promise<Object>);
    name: string;
    [Symbol.asyncIterator]() {
        return this.entries();
    }
    async isSameEntry(other: FileSystemHandle): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor | undefined): Promise<PermissionState> {
        return "granted";
    }
    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor | undefined): Promise<PermissionState> {
        return "granted";
    }
    /**
     * @deprecated Old property just for Chromium <=85. Use `.getFileHandle()` in the new API.
     */
    // @ts-ignore
    getFile: FileSystemDirectoryHandle["getFileHandle"];
    /**
     * @deprecated Old property just for Chromium <=85. Use `.getDirectoryHandle()` in the new API.
     */
    // @ts-ignore
    getDirectory: FileSystemDirectoryHandle["getDirectoryHandle"];
    /**
     * @deprecated Old property just for Chromium <=85. Use `.keys()`, `.values()`, `.entries()`, or the directory itself as an async iterable in the new API.
     */
    // @ts-ignore
    getEntries: FileSystemDirectoryHandle["values"];
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isFile: false;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    readonly isDirectory: true;
    kind: "directory";
    async getHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemHandle> {
        const key = name;
        let obj = this.obj as any;
        if (typeof this.obj === "function") {
            obj = await this.obj();
        }
        const value = obj[key];
        const entryName = key;
        let kind = "file";
        Logger.log("getHandle: key:", key, " value: ", value);

        if (value instanceof Array) {
            kind = "directory";
            Logger.log("getHandle(): key: ", key, "is array");
            type Arrtype = typeof value;
            /*type ArrtypeElement = Arrtype[number];
            const styp = ArrtypeElement
            if (ArrtypeElement == string) {
      
            }*/
            const arr = value as Arrtype;
            const s = typeof value;
            Logger.log("arrtyp:", s);
        } else if (value instanceof Object) {
            Logger.log("getHandle(): key: ", key, "is object");
            kind = "directory";
        }
        let ret: FileSystemHandle;
        kind === "file"
            ? (ret = new ObjectFileSystemFileHandle(entryName, value))
            : (ret = new ObjectFileSystemDirectoryHandle(entryName, value));
        Logger.log("getHandle returning ret: ", ret);
        return ret;
    }
    async getDirectoryHandle(
        name: string,
        options?: FileSystemGetDirectoryOptions
    ): Promise<FileSystemDirectoryHandle> {
        const ret = (await this.getHandle(name, options)) as FileSystemDirectoryHandle;
        Logger.log("getDirectoryHandle returning ret: ", ret);
        return ret;
    }
    async *entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]> {
        //this.fsDebug("entries: for :", this.adapter);
        let obj = this.obj;
        if (typeof this.obj === "function") {
            obj = await this.obj();
        }
        const entr = Object.entries(obj);
        for (const [key, value] of entr) {
            Logger.log("entries: key:", key, " value: ", value);
            const entryName = key;
            let kind = "file";
            if (value instanceof Array) {
                kind = "directory";
                Logger.log("entries(): key: ", key, "is array");
                type Arrtype = typeof value;
                /*type ArrtypeElement = Arrtype[number];
                const styp = ArrtypeElement
                if (ArrtypeElement == string) {
          
                }*/
                const arr = value as Arrtype;
                const s = typeof value;
                Logger.log("arrtyp:", s);
            } else if (value instanceof Object) {
                Logger.log("entries(): key: ", key, "is object");
                kind = "directory";
            }
            /*
            yield [
                entryName,
                kind === "file"
                    ? new ObjectFileSystemFileHandle(entryName, value)
                    : new ObjectFileSystemDirectoryHandle(entryName, value),
            ];*/
            Logger.log("entries(): key: ", key, "kind: " + kind);
            if (kind === "file") {
                yield [entryName, new ObjectFileSystemFileHandle(entryName, value)];
            } else {
                yield [entryName, new ObjectFileSystemFileHandle(entryName, value)];
            }
        }
    }
    async *values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle> {
        for await (const [_key, value] of this.entries()) {
            yield value;
        }
    }
    async *keys(): AsyncGenerator<string> {
        for await (const [key, _value] of this.entries()) {
            yield key;
        }
    }
    async getFileHandle(
        name: string,
        options?: {
            create: boolean;
        }
    ): Promise<FileSystemFileHandle> {
        const hret = await this.getHandle(name, options);
        if (hret.kind == "file") {
            const ret = hret as FileSystemFileHandle;
            Logger.log("getFileHandle returning ret: ", ret);
            return ret;
        } else {
            Logger.log("getFileHandle throwing TypeMismatchError");
            throw new TypeMismatchError();
        }
    }
    async removeEntry(
        name: string,
        options?: {
            recursive: boolean;
        }
    ): Promise<void> {
        throw new Error("not implemented");
    }
    resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null> {
        throw new Error("not implemented");
    }
    //[Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemFileHandle | FileSystemDirectoryHandle]>;
    //get [Symbol.toStringTag](): string;
}

export class ObjectFileSystemFileHandle implements FileSystemFileHandle {
    constructor(name: string, obj: any) {
        this.name = name;
        this.obj = obj;
        this.isFile = true;
        this.isDirectory = false;
    }
    name: string;
    obj: any;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isFile: true;

    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isDirectory: false;

    public kind = "file" as const;
    async isSameEntry(other: FileSystemHandle): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor | undefined): Promise<PermissionState> {
        return "granted";
    }
    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor | undefined): Promise<PermissionState> {
        return "granted";
    }
    async createWritable(options: { keepExistingData?: boolean } = {}): Promise<FileSystemWritableFileStream> {
        throw new Error("createWritable not supported");
    }

    async getFile(): Promise<File> {
        Logger.log("in getFile ", this.name);
        const data = this.obj;
        Logger.log("in getFile ", this.name, "data ", data);
        const buffer = textEncoder.encode(data as string);
        Logger.log("in getFile buffer: ", this.name, buffer);

        const mimeType = "application/octet-stream";
        const b = new Blob([buffer], { type: mimeType });
        Logger.log("in getFile b: ", this.name, b);
        //return b;
        //const lastModified = new Date();
        const lastModified = 0;
        //const f = new File([buffer], this.name, {type: mimeType, lastModified: lastModified});
        const f = new File([buffer], this.name);
        Logger.log("in getFile returning f: ", this.name, f);
        return f;
    }

    get [Symbol.toStringTag]() {
        return "FileSystemFileHandle";
    }
}
