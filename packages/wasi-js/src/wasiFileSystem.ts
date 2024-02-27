// Copyright 2020 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { SystemError } from "./errors.js";
import { Oflags, OflagsN, Fdflags, FdflagsN, ErrnoN } from "./wasi_snapshot_preview1/bindings.js";
import { AdviceN, Fd } from "./wasi_snapshot_preview1/bindings.js";
import { FilesystemFilesystemNamespace as fs } from "@wasmin/wasi-snapshot-preview2/async";
type DirectoryEntry = fs.DirectoryEntry;
type DescriptorType = fs.DescriptorType;
type FileSystemDescriptorNumber = number;
import { Statable, openDirectoryHandle } from "@wasmin/fs-js";
import {
    FileSystemHandle,
    FileSystemDirectoryHandle,
    FileSystemFileHandle,
    FileSystemWritableFileStream,
} from "@wasmin/fs-js";
import { DisposeAsyncResourceFunc, Resource } from "./wasiResources.js";
import { wasiError, wasiFileSystemDebug } from "./wasiDebug.js";


/**
 * Generic Writable stream interface
 */
export interface Readable {
    read(len: number): Promise<Uint8Array>;
}

export interface ReadableAsyncOrSync {
    read(len: number): Uint8Array | Promise<Uint8Array>;
}

/**
 * Generic Writable stream interface
 */
export interface Writable {
    write(data: Uint8Array): Promise<void>;
}

export interface WritableAsyncOrSync {
    write(data: Uint8Array): void | Promise<void>;
}

/**
 * Generic Interface too look if stream has more bytes
 */
export interface Peekable {
    peek(): Promise<number>;
}

export class Socket implements Writable, Readable {

    private _fdFlags: Fdflags = 0;
    async read(_len: number): Promise<Uint8Array> {
        throw new SystemError(ErrnoN.NOTSUP);
    }

    async write(_data: Uint8Array): Promise<void> {
        throw new SystemError(ErrnoN.NOTSUP);
    }

    get fdFlags() {
        return this._fdFlags;
    }
    set fdFlags(flags: Fdflags) {
        this._fdFlags = flags;
    }
}

export interface FsPollable extends AsyncDisposable {
    block(): Promise<void>;
    ready(): Promise<boolean>;
}

export type Handle = FileSystemFileHandle | FileSystemDirectoryHandle;

export type OpenResource = OpenFile | OpenDirectory | Writable | Readable | Socket | OpenDirectoryIterator | FsPollable | Resource;
export class OpenDirectory {
    constructor(public readonly path: string, readonly _handle: FileSystemDirectoryHandle, public isFile = false) {}

    private _currentIter:
        | {
              pos: number;
              reverted: FileSystemHandle | undefined;
              iter: AsyncIterableIterator<FileSystemHandle>;
          }
        | undefined = undefined;

    asFile(): never {
        throw new SystemError(ErrnoN.ISDIR);
    }

    asDir() {
        return this;
    }

    get handle() {
        return this._handle;
    }

    getEntries(start = 0): AsyncIterableIterator<FileSystemHandle> & {
        revert: (handle: FileSystemHandle) => void;
    } {
        wasiFileSystemDebug(`[getEntries], path: ${this.path}`);
        if (this._currentIter?.pos !== start) {
            // We're at incorrect position and will have to skip [start] items.
            this._currentIter = {
                pos: 0,
                reverted: undefined,
                iter: this._handle.values(),
            };
        } else {
            // We are already at correct position, so zero this out.
            start = 0;
        }
        const currentIter = this._currentIter;
        return {
            next: async () => {
                // This is a rare case when the caller tries to start reading directory
                // from a different position than our iterator is on.
                //
                // This can happen e.g. with multiple iterators, or if previous iteration
                // has been cancelled.
                //
                // In those cases, we need to first manually skip [start] items from the
                // iterator, and on the next calls we'll be able to continue normally.
                for (; start; start--) {
                    await currentIter.iter.next();
                }
                // If there is a handle saved by a `revert(...)` call, take and return it.
                const { reverted } = currentIter;
                if (reverted) {
                    currentIter.reverted = undefined;
                    currentIter.pos++;
                    return {
                        value: reverted,
                        done: false,
                    };
                }
                // Otherwise use the underlying iterator.
                const res = await currentIter.iter.next();
                if (!res.done) {
                    currentIter.pos++;
                } else {
                    // null the currentIter if done
                    this._currentIter = undefined;
                }
                return res;
            },
            // This function allows to go one step back in the iterator
            // by saving an item in an internal buffer.
            // That item will be given back on the next iteration attempt.
            //
            // This allows to avoid having to restart the underlying
            // forward iterator over and over again just to find the required
            // position.
            revert: (handle: FileSystemHandle) => {
                if (currentIter.reverted || currentIter.pos === 0) {
                    //throw new Error("Cannot revert a handle in the current state.");
                    throw new SystemError(ErrnoN.NOENT);
                }
                currentIter.pos--;
                currentIter.reverted = handle;
            },
            [Symbol.asyncIterator]() {
                return this;
            },
        };
    }

    async getFileOrDir(path: string, mode: FileOrDir.File, openFlags?: Oflags): Promise<FileSystemFileHandle>;
    async getFileOrDir(path: string, mode: FileOrDir.Dir, openFlags?: Oflags): Promise<FileSystemDirectoryHandle>;
    async getFileOrDir(path: string, mode: FileOrDir, openFlags?: Oflags): Promise<Handle>;
    async getFileOrDir(path: string, mode: FileOrDir, openFlags: Oflags = 0) {
        wasiFileSystemDebug(`[getFileOrDir] path: ${path} mode: ${mode} openFlags: ${openFlags}`);
        const { parent, name: maybeName } = await this._resolve(path);
        // Handle case when we couldn't get a parent, only direct handle
        // (this means it's a preopened directory).
        if (maybeName === undefined) {
            if (mode & FileOrDir.Dir) {
                if (openFlags & (OflagsN.CREAT | OflagsN.EXCL)) {
                    throw new SystemError(ErrnoN.EXIST);
                }
                if (openFlags & OflagsN.TRUNC) {
                    throw new SystemError(ErrnoN.ISDIR);
                }
                return parent;
            } else {
                throw new SystemError(ErrnoN.ISDIR);
            }
        }
        const name = maybeName;
        if (openFlags & OflagsN.DIRECTORY) {
            if (mode & FileOrDir.Dir) {
                mode = FileOrDir.Dir;
            } else {
                throw new TypeError(`Open flags ${openFlags} require a directory but mode ${mode} doesn't allow it.`);
            }
        }
        let handle: Handle;
        if (openFlags & OflagsN.CREAT) {
            if (openFlags & OflagsN.EXCL) {
                let exists = true;
                try {
                    await this.openWithCreate(name, false, mode, parent);
                } catch {
                    exists = false;
                }
                if (exists) {
                    wasiFileSystemDebug(`throwing EXIST error as ${name} does exist`);
                    throw new SystemError(ErrnoN.EXIST);
                }
            }
            handle = await this.openWithCreate(name, true, mode, parent);
        } else {
            handle = await this.openWithCreate(name, false, mode, parent);
        }
        if (openFlags & OflagsN.TRUNC) {
            if ((handle as any).isDirectory || handle.kind === "directory") {
                throw new SystemError(ErrnoN.ISDIR);
            }
        }
        return handle;
    }

    async openWithCreate(name: string, create: boolean, mode: FileOrDir, parent: FileSystemDirectoryHandle) {
        const parentName = parent.name;
        // if mode is either FileOrDir.File or FileOrDir.Any
        if (mode & FileOrDir.File) {
            try {
                wasiFileSystemDebug(
                    `[openWithCreate]: trying: getFileHandle on parent: ${parentName} child: ${name} mode: ${mode}`
                );
                return await parent.getFileHandle(name, { create });
            } catch (err: any) {
                wasiFileSystemDebug("openWithCreate err: ", err);
                if (err.name === "TypeMismatchError" || err.name === "TypeError") {
                    if (!(mode & FileOrDir.Dir)) {
                        // throw an error because we request dir but got file
                        // ignoring this error because it is common
                        throw new SystemError(ErrnoN.ISDIR, true);
                    }
                } else if (!(mode == FileOrDir.Any)) {
                    // throw an error only if we are requesting file
                    // otherwise if we are requesting Dir/Any it will be handled below
                    // re-throw as SystemError so it is better handled
                    throw new SystemError(ErrnoN.NOENT);
                }
            }
        }
        // else if mode is FileOrDir.Dir
        try {
            wasiFileSystemDebug(
                `[openWithCreate]: trying: getDirectoryHandle on parent: ${parentName} child: ${name} mode: ${mode}`
            );
            return await parent.getDirectoryHandle(name, { create: create });
        } catch (err: any) {
            if (err.name === "TypeMismatchError") {
                // throw an error because we got presumably a file instead of a dir
                // ignoring this error because it is common
                throw new SystemError(ErrnoN.NOTDIR, true);
            } else {
                throw err;
            }
        }
    }

    async delete(path: string, options?: FileSystemRemoveOptions): Promise<void> {
        wasiFileSystemDebug("[delete]");
        const { parent, name } = await this._resolve(path);
        if (!name) {
            throw new SystemError(ErrnoN.ACCES);
        }
        await parent.removeEntry(name, options);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close() {}

    private async _resolve(path: string) {
        wasiFileSystemDebug(`[_resolve] path: ${path}`);
        const parts = path ? path.split("/") : [];
        const resolvedParts = [];
        for (const item of parts) {
            if (item === "..") {
                if (resolvedParts.pop() === undefined) {
                    throw new SystemError(ErrnoN.PERM);
                }
            } else if (item !== ".") {
                if (item !== "") {
                    resolvedParts.push(item);
                }
            }
        }
        const name = resolvedParts.pop();
        let parent = this._handle;
        for (const item of resolvedParts) {
            parent = await parent.getDirectoryHandle(item);
        }
        return {
            parent,
            name,
        };
    }
}

export class OpenDirectoryIterator implements Resource, AsyncDisposable {
    constructor(fd: FileSystemDescriptorNumber, openDir: OpenDirectory, disposeFunc: DisposeAsyncResourceFunc) {
        this._descriptor = fd;
        this._openDir = openDir;
        this.resource = -1;
        this.onDispose = disposeFunc;
    }
    [Symbol.asyncDispose](): Promise<void> {
        return this.onDispose(this);
    }
    private _openDir: OpenDirectory;
    private _descriptor: FileSystemDescriptorNumber;
    private _cursor = 0;
    public resource: number;
    public onDispose: DisposeAsyncResourceFunc;

    public get cursor(): number {
        return this._cursor;
    }
    public set cursor(value: number) {
        this._cursor = value;
    }
    public get openDir(): OpenDirectory {
        return this._openDir;
    }
    public set openDir(value: OpenDirectory) {
        this._openDir = value;
    }

    async readDirectoryEntry(): Promise<DirectoryEntry | undefined> {
        return await this.next();
    }

    async next(): Promise<DirectoryEntry | undefined> {
        let count = 0;

        const iterator = this.openDir.handle.values();
        for await (const handle of iterator) {
            // TODO handle abort
            //this._checkAbort();
            const descriptorNum = this._descriptor + count;
            let inode = 0n;
            if ((handle as any).stat) {
                const statable = handle as unknown as Statable;
                const s = await statable.stat();
                const got_inode = s.inode;
                if (got_inode) {
                    inode = got_inode;
                }
            }
            let ftype: DescriptorType = "unknown";
            const { name } = handle;
            if (handle.kind == "file") {
                ftype = "regular-file";
            } else if (handle.kind == "directory") {
                ftype = "directory";
            }
            const ret: DirectoryEntry = {
                type: ftype,
                name: name,
                //inode: inode,
            };
            if (count == this.cursor) {
                this.cursor++;
                return ret;
            }
            count++;
        }
        return undefined;
    }
}

export class OpenFile implements Readable, Writable {
    constructor(
        public readonly path: string,
        private readonly _handle: FileSystemFileHandle,
        private _fdFlags: Fdflags = 0,
        public isFile = true
    ) {}

    public position = 0;
    public advice: AdviceN = AdviceN.NORMAL;
    private _writer: FileSystemWritableFileStream | undefined = undefined;

    async getFile(): Promise<File> {
        wasiFileSystemDebug("[getfile]");
        // TODO: do we really have to?
        //await this.flush();
        const f = await this._handle.getFile();
        return f;
    }

    get handle() {
        return this._handle;
    }

    async setSize(size: number): Promise<void> {
        await this.close();
        const writer = await this._getWriter(false);
        await writer.truncate(size);
        await this.close();
    }

    async read(len: number): Promise<Uint8Array> {
        wasiFileSystemDebug(`[read] len: ${len}`);
        const file = await this.getFile();
        wasiFileSystemDebug(`[read] file`, file);
        let toPos = this.position + len;
        if (toPos > file.size) {
            toPos = file.size;
        }
        wasiFileSystemDebug(`[read] slicing from: ${this.position} to ${toPos}`);
        const slice = file.slice(this.position, toPos);
        wasiFileSystemDebug(`[read] slice`, slice);
        const arrayBuffer = await slice.arrayBuffer();
        wasiFileSystemDebug(`[read] arrayBuffer`, arrayBuffer);
        this.position += arrayBuffer.byteLength;
        return new Uint8Array(arrayBuffer);
    }

    async write(data: Uint8Array): Promise<void> {
        wasiFileSystemDebug("[write]");
        const writer = await this._getWriter();
        if (this.fdFlags & FdflagsN.APPEND) {
            // if Append mode then write to the end position of the file
            const f = await this.getFile();
            this.position = f.size;
        }
        await writer.write({ type: "write", position: this.position, data });
        this.position += data.length;
    }

    async flush(): Promise<void> {
        wasiFileSystemDebug("[flush]");
        if (!this._writer) return;
        await this._writer.close();
        this._writer = undefined;
    }

    asFile(): OpenFile {
        return this;
    }

    asDir(): never {
        throw new SystemError(ErrnoN.NOTDIR);
    }

    asWritable(): Writable {
        return this;
    }

    asReadable(): Readable {
        return this;
    }

    async close(): Promise<void> {
        await this.flush();
    }

    public set fdFlags(fdFlags: Fdflags) {
        this._fdFlags = fdFlags;
    }

    public get fdFlags(): Fdflags {
        return this._fdFlags;
    }

    private async _getWriter(keepExistingData = true) {
        return (
            this._writer ||
            (this._writer = await this._handle.createWritable({
                keepExistingData: keepExistingData,
            }))
        );
    }
}

export const enum FileOrDir {
    File = 1, // 1 << 0
    Dir = 2, // 1 << 1
    Any = 3, // File | Dir
}

export const FIRST_PREOPEN_FD = 3 as Fd;

export class OpenFiles {
    constructor(preOpen: Record<string, FileSystemDirectoryHandle>) {
        wasiFileSystemDebug("[preOpen]", preOpen);
        for (const path in preOpen) {
            this._add(path, preOpen[path]);
        }
        this._firstNonPreopenFd = this._nextFd;
    }

    private _files = new Map<Fd, OpenResource>();
    private _nextFd = FIRST_PREOPEN_FD;
    private _firstNonPreopenFd: Fd;

    getPreOpen(fd: Fd): OpenDirectory {
        wasiFileSystemDebug(`[getpreopen fd: ${fd}]`);
        wasiFileSystemDebug("OpenFiles.this: ", this);
        if (fd >= FIRST_PREOPEN_FD && fd < this._firstNonPreopenFd) {
            return this.get(fd) as OpenDirectory;
        } else {
            throw new SystemError(ErrnoN.BADF, true);
        }
    }

    getPreOpens(): [OpenDirectory, number, string][] {
        const preopens: [OpenDirectory, number, string][] = [];
        const preopen_fd = FIRST_PREOPEN_FD;
        try {
            for (let i = preopen_fd; true; i++) {
                const openDir = this.getPreOpen(i);
                const path = openDir.path;
                preopens.push([openDir, i, path]);
            }
        } catch (err: any) {
            wasiError("getDirectories: err: ", err);
        }
        return preopens;
    }


    async open(preOpen: OpenDirectory, path: string, openFlags?: Oflags, fdFlags?: Fdflags): Promise<number> {
        wasiFileSystemDebug(`[open] path: ${path} openFlags: ${openFlags} fsFlags: ${fdFlags}`);
        if (path.startsWith("/")) {
            throw new SystemError(ErrnoN.PERM);
        }
        let prefix = "";
        if (preOpen.path != "/") {
            prefix = preOpen.path;
        }
        const pathWithPrefix = `${prefix}/${path}`;
        const fileOrDir = await preOpen.getFileOrDir(path, FileOrDir.Any, openFlags);
        if (path.endsWith("/")) {
            if (fileOrDir.kind == "file") {
                throw new SystemError(ErrnoN.NOTDIR);
            }
        }
        return this._add(pathWithPrefix, fileOrDir, fdFlags);
    }

    async openRelativeToRoot(path: string, openFlags?: Oflags, fdFlags?: Fdflags): Promise<number> {
        let foundRel = this.findRelPath(path);
        if (foundRel) {
            let preopenDir = foundRel.preOpen;
            let num = await this.open(preopenDir, path);
            return num;
        } else {
            throw new SystemError(ErrnoN.NOENT);            
        }
    }

    get(fd: Fd): OpenResource {
        wasiFileSystemDebug(`[get] fd: ${fd}`);
        const openFile = this._files.get(fd);
        if (!openFile) {
            throw new SystemError(ErrnoN.BADF);
        }
        return openFile;
    }

    exists(fd: Fd): boolean {
        wasiFileSystemDebug(`[exists] fd: ${fd}`);
        const openFile = this._files.get(fd);
        if (!openFile) {
            return false;
        }
        return true;
    }

    set(fd: Fd, res: OpenResource) {
        wasiFileSystemDebug(`[set] fd: ${fd}`);
        this._files.set(fd, res);
    }

    add(res: OpenResource): Fd {
        wasiFileSystemDebug("[add]", res);
        this._files.set(this._nextFd, res);
        const newFd = this._nextFd++ as Fd;
        const resAny = res as any;
        if (resAny.resource !== undefined ) {
            const resRes = resAny as Resource;
            resRes.resource = newFd;
        }
        return newFd;
    }

    addResource(res: Resource): Fd {
        wasiFileSystemDebug("[addResource]", res);
        return this.add(res);
    }

    isFile(fd: Fd): boolean {
        const h = this.get(fd);
        if (h instanceof OpenFile) {
            const f = h as OpenFile;
            return f.isFile;
        } else {
            return false;
        }
    }

    getAsFile(fd: Fd): OpenFile {
        const h = this.get(fd);
        if (h instanceof OpenFile) {
            return h as OpenFile;
        } else if (h instanceof OpenDirectory) {
            throw new SystemError(ErrnoN.ISDIR);
        } else {
            throw new SystemError(ErrnoN.NOTSUP);
        }
    }

    getAsSocket(fd: Fd): Socket {
        const h = this.get(fd);
        if (h instanceof Socket) {
            return h as Socket;
        } else if (h instanceof OpenDirectory) {
            throw new SystemError(ErrnoN.ISDIR);
        } else {
            throw new SystemError(ErrnoN.NOTSUP);
        }
    }

    getAsDir(fd: Fd): OpenDirectory {
        const h = this.get(fd);
        if (h instanceof OpenDirectory) {
            return h as OpenDirectory;
        } else if (h instanceof OpenFile) {
            throw new SystemError(ErrnoN.NOTDIR);
        } else {
            throw new SystemError(ErrnoN.NOTDIR);
        }
    }

    isDirectory(fd: Fd): boolean {
        const h = this.get(fd);
        if (h instanceof OpenDirectory) {
            const d = h as OpenDirectory;
            const isFile = d.isFile;
            return !isFile;
        } else {
            return false;
        }
    }

    isSocket(fd: Fd): boolean {
        const h = this.get(fd);
        if (h instanceof Socket) {
            return true;
        } else {
            return false;
        }
    }

    getAsFileOrDir(fd: Fd): OpenDirectory | OpenFile {
        const h = this.get(fd);
        if (h instanceof OpenDirectory) {
            return h as OpenDirectory;
        } else if (h instanceof OpenFile) {
            return h as OpenFile;
        } else {
            throw new SystemError(ErrnoN.NOTSUP);
        }
    }

    getAsWritable(fd: Fd): Writable {
        const h = this.get(fd);
        const obj = h as any;
        if (obj.write) {
            return obj as Writable;
        } else {
            throw new SystemError(ErrnoN.NOTSUP);
        }
    }

    getAsReadable(fd: Fd): Readable {
        const h = this.get(fd);
        const obj = h as any;
        if (obj.read) {
            return obj as Readable;
        } else {
            throw new SystemError(ErrnoN.NOTSUP);
        }
    }

    async renumber(from: Fd, to: Fd): Promise<void> {
        wasiFileSystemDebug("[renumber] from fd:", from, "to fd:", to);
        await this.close(to);
        this._files.set(to, this._take(from));
    }

    async close(fd: Fd) {
        wasiFileSystemDebug("[close] fd:", fd);
        const res = this._take(fd);
        const fdhandle = res as any;
        if (fdhandle.close) {
            await fdhandle.close();
        }
    }

    async closeReader(fd: Fd) {
        wasiFileSystemDebug("[closeReader]");
        if (this.isFile(fd)) {
            const reader = this._take(fd) as OpenFile;
            await reader.close();
        }
    }

    async closeWriter(fd: Fd) {
        wasiFileSystemDebug("[closeWriter]");
        if (this.isFile(fd)) {
            const writer = this._take(fd) as OpenFile;
            await writer.close();
        }
    }

    openReader(fd: Fd, offset?: bigint): Fd {
        let reader: Readable;
        if (!this.isFile(fd)) {
            return fd;
        }

        const file = this.getAsFile(fd);
        const path = file.path;
        const handle = file.handle;
        const fdFlags = file.fdFlags;
        const newFile = new OpenFile(path, handle, fdFlags);
        // TODO: safely handle bigint
        newFile.position = Number(offset);
        reader = newFile;
        const newFd = this.add(reader);
        return newFd;
    }

    openWriter(fd: Fd, offset?: bigint, append?: boolean): Fd {
        let writer: Writable;
        if (!this.isFile(fd)) {
            return fd;
        }

        const file = this.getAsFile(fd);
        const path = file.path;
        const handle = file.handle;
        let fdFlags = file.fdFlags;
        if (append) {
            fdFlags = fdFlags & FdflagsN.APPEND;
        }
        const newFile = new OpenFile(path, handle, fdFlags);
        // TODO: safely handle bigint
        if (!append) {
            newFile.position = Number(offset);
        }
        writer = newFile;
        const newFd = this.add(writer);
        return newFd;
    }

    openOpenDirectoryIterator(fd: Fd): Fd {
        const openDir = this.getAsDir(fd);
        const disposeFunc = this.getDisposeResourceFunc();
        const iter = new OpenDirectoryIterator(fd, openDir, disposeFunc);
        const iterFd = this.addResource(iter);
        return iterFd;
    }

    getAsOpenDirectoryIterator(fd: Fd): OpenDirectoryIterator {
        const res = this.get(fd);
        return res as OpenDirectoryIterator;
    }

    getDisposeResourceFunc(): DisposeAsyncResourceFunc {
        return this.disposeResource.bind(this);
    }

    async disposeResource(resource: Resource): Promise<void> {
        const resId = resource.resource;
        wasiFileSystemDebug("[disposeResource] resource:", resource);
        const _res = this._take(resId);
    }

    addPreopenedDir(path: string, handle: Handle) {
        this._nextFd = this._add(path, handle);
        this._firstNonPreopenFd = this._nextFd;
    }

    async mountHandleOnRoot(handle: Handle, subDir = handle.name) {
        return await this.mountHandleOnPath(handle, "/", subDir);
    }

    async mountHandleOnPath(handle: Handle, destPath: string, subDir = handle.name) {
        if (subDir != handle.name) {
            // @ts-ignore
            handle.name = subDir;
        }
        const rootFd = FIRST_PREOPEN_FD;
        const rootDir = this.getAsDir(rootFd);
        wasiFileSystemDebug(`mountHandleOnPath destPath: ${destPath} rootDirOpenFile: `, rootDir);
        if (rootDir) {
            const rootDirHandle = rootDir._handle;
            wasiFileSystemDebug("mountHandleOnPath rootDirDirHandle: ", rootDirHandle);
            let dirHandleToMountOn = rootDirHandle as any;
            if (destPath != "/") {
                dirHandleToMountOn = await openDirectoryHandle(rootDirHandle, destPath);
            }
            if (dirHandleToMountOn.insertHandle) {
                dirHandleToMountOn.insertHandle(handle);
            } else {
                console.warn("Could not mount subdirectory on root: ", handle);
            }
        }
    }

    private _add(path: string, handle: Handle, fsFlags?: Fdflags) {
        wasiFileSystemDebug("[_add]", path);
        this._files.set(
            this._nextFd,
            handle.kind === "file" ? new OpenFile(path, handle, fsFlags) : new OpenDirectory(path, handle)
        );
        return this._nextFd++ as Fd;
    }

    private _take(fd: Fd) {
        wasiFileSystemDebug("[_take]");
        const handle = this.get(fd);
        this._files.delete(fd);
        return handle;
    }

    // Translation of the algorithm from __wasilibc_find_relpath.
    // eslint-disable-next-line @typescript-eslint/member-ordering
    findRelPath(path: string) {
        wasiFileSystemDebug("[findRelPath]");
        let fdNumber = 0;
        /// Are the `prefix_len` bytes pointed to by `prefix` a prefix of `path`?
        function prefixMatches(prefix: string, path: string) {
            // Allow an empty string as a prefix of any relative path.
            if (path[0] != "/" && !prefix) {
                return true;
            }

            // Check whether any bytes of the prefix differ.
            if (!path.startsWith(prefix)) {
                return false;
            }

            // Ignore trailing slashes in directory names.
            let i = prefix.length;
            while (i > 0 && prefix[i - 1] == "/") {
                --i;
            }

            // Match only complete path components.
            const last = path[i];
            return last === "/" || !last;
        }

        // Search through the preopens table. Iterate in reverse so that more
        // recently added preopens take precedence over less recently addded ones.
        let matchLen = 0;
        let foundPre;
        for (let i = this._firstNonPreopenFd - 1; i >= FIRST_PREOPEN_FD; --i) {
            let fdNumberTry = i;
            const pre = this.get(fdNumberTry as Fd) as OpenDirectory;
            let prefix = pre.path;

            if (path !== "." && !path.startsWith("./")) {
                // We're matching a relative path that doesn't start with "./" and
                // isn't ".".
                if (prefix.startsWith("./")) {
                    prefix = prefix.slice(2);
                } else if (prefix === ".") {
                    prefix = prefix.slice(1);
                }
            }

            // If we haven't had a match yet, or the candidate path is longer than
            // our current best match's path, and the candidate path is a prefix of
            // the requested path, take that as the new best path.
            if ((!foundPre || prefix.length > matchLen) && prefixMatches(prefix, path)) {
                foundPre = pre;
                fdNumber = fdNumberTry;
                matchLen = prefix.length;
            }
        }

        if (!foundPre) {
            throw new SystemError(ErrnoN.NOENT);
        }

        // The relative path is the substring after the portion that was matched.
        let computed = path.slice(matchLen);

        // Omit leading slashes in the relative path.
        computed = computed.replace(/^\/+/, "");

        // *at syscalls don't accept empty relative paths, so use "." instead.
        computed = computed || ".";

        return {
            preopenFd: fdNumber,
            preOpen: foundPre,
            relativePath: computed,
        };
    }

    /**
     * 
     * Returns a new OpenFiles cloned from subdirectory
     * 
     * @param subPath 
     * @returns 
     */
    async cloneFromPath(subPath: string) {
        let relativeRootDir: FileSystemDirectoryHandle | undefined = undefined;
        const relPreOpen = this.findRelPath(subPath);
        if (relPreOpen) {
            const preOpenDir = relPreOpen.preOpen;
            relativeRootDir = await preOpenDir.getFileOrDir(subPath, FileOrDir.Dir);
        }
        let relPreopenMap: Record<string, FileSystemDirectoryHandle> = {};
        if (relativeRootDir !== undefined) {
            relPreopenMap["/"] = relativeRootDir;
        }
        return new OpenFiles( relPreopenMap );
    }
}
