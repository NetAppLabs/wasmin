/* eslint-disable @typescript-eslint/member-ordering */
import { HostManagerInstance } from "./host.js";
import { getLogger } from "./log.js";
import { Host, Process } from "./types.js";

import { TypeMismatchError } from "@wasmin/fs-js";
import {
    PermissionState,
    FileSystemHandle,
    FileSystemDirectoryHandle,
    FileSystemFileHandle,
    FileSystemSyncAccessHandle,
    FileSystemHandlePermissionDescriptor,
    FileSystemWritableFileStream,
} from "@wasmin/fs-js";

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
    kind: "directory";
    async getHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemHandle> {
        const logger = await getLogger();
        const key = name;
        let obj = this.obj as any;
        if (typeof this.obj === "function") {
            obj = await this.obj();
        }
        const value = obj[key];
        const entryName = key;
        let kind = "file";
        logger.log("getHandle: key:", key, " value: ", value);

        if (value instanceof Array) {
            kind = "directory";
            logger.log("getHandle(): key: ", key, "is array");
            type Arrtype = typeof value;
            /*type ArrtypeElement = Arrtype[number];
            const styp = ArrtypeElement
            if (ArrtypeElement == string) {
      
            }*/
            const arr = value as Arrtype;
            const s = typeof value;
            logger.log("arrtyp:", s);
        } else if (value instanceof Object) {
            logger.log("getHandle(): key: ", key, "is object");
            kind = "directory";
        }
        let ret: FileSystemHandle;
        kind === "file"
            ? (ret = new ObjectFileSystemFileHandle(entryName, value))
            : (ret = new ObjectFileSystemDirectoryHandle(entryName, value));
        logger.log("getHandle returning ret: ", ret);
        return ret;
    }
    async getDirectoryHandle(
        name: string,
        options?: FileSystemGetDirectoryOptions
    ): Promise<FileSystemDirectoryHandle> {
        const logger = await getLogger();
        const ret = (await this.getHandle(name, options)) as FileSystemDirectoryHandle;
        logger.log("getDirectoryHandle returning ret: ", ret);
        return ret;
    }
    async *entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]> {
        const logger = await getLogger();

        //this.fsDebug("entries: for :", this.adapter);
        let obj = this.obj;
        if (typeof this.obj === "function") {
            obj = await this.obj();
        }
        const entr = Object.entries(obj);
        for (const [key, value] of entr) {
            logger.log("entries: key:", key, " value: ", value);
            const entryName = key;
            let kind = "file";
            if (value instanceof Array) {
                kind = "directory";
                logger.log("entries(): key: ", key, "is array");
                type Arrtype = typeof value;
                /*type ArrtypeElement = Arrtype[number];
                const styp = ArrtypeElement
                if (ArrtypeElement == string) {
          
                }*/
                const arr = value as Arrtype;
                const s = typeof value;
                logger.log("arrtyp:", s);
            } else if (value instanceof Object) {
                logger.log("entries(): key: ", key, "is object");
                kind = "directory";
            }
            /*
            yield [
                entryName,
                kind === "file"
                    ? new ObjectFileSystemFileHandle(entryName, value)
                    : new ObjectFileSystemDirectoryHandle(entryName, value),
            ];*/
            logger.log("entries(): key: ", key, "kind: " + kind);
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
        const logger = await getLogger();

        const hret = await this.getHandle(name, options);
        if (hret.kind == "file") {
            const ret = hret as FileSystemFileHandle;
            logger.log("getFileHandle returning ret: ", ret);
            return ret;
        } else {
            logger.log("getFileHandle throwing TypeMismatchError");
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
    }
    name: string;
    obj: any;

    public kind = "file" as const;
    async createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle> {
        throw new Error("Method not implemented.");
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
    async createWritable(options: { keepExistingData?: boolean } = {}): Promise<FileSystemWritableFileStream> {
        throw new Error("createWritable not supported");
    }

    async getFile(): Promise<File> {
        const logger = await getLogger();

        logger.log("in getFile ", this.name);
        const data = this.obj;
        logger.log("in getFile ", this.name, "data ", data);
        const buffer = textEncoder.encode(data as string);
        logger.log("in getFile buffer: ", this.name, buffer);

        const mimeType = "application/octet-stream";
        const b = new Blob([buffer], { type: mimeType });
        logger.log("in getFile b: ", this.name, b);
        //return b;
        //const lastModified = new Date();
        const lastModified = 0;
        //const f = new File([buffer], this.name, {type: mimeType, lastModified: lastModified});
        const f = new File([buffer], this.name);
        logger.log("in getFile returning f: ", this.name, f);
        return f;
    }

    get [Symbol.toStringTag]() {
        return "FileSystemFileHandle";
    }
}
