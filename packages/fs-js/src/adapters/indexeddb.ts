import {
    InvalidModificationError,
    InvalidStateError,
    NotFoundError,
    SyntaxError,
    TypeMismatchError,
} from "../errors.js";
import { getDirectoryHandleByURL } from "../getDirectoryHandleByURL.js";
import { DefaultSink, ImpleFileHandle, ImplFolderHandle } from "./implements.js";
import { NFileSystemDirectoryHandle } from "../NFileSystemDirectoryHandle.js";
import { openFileHandle } from "./util.js";
import { default as yaml } from "js-yaml";
import { FileSystemDirectoryHandle, FileSystemHandlePermissionDescriptor } from "../index.js";

const INDEXEDDB_DEBUG = false;

function indexedDBDebug(message?: any, ...optionalParams: any[]) {
    if (INDEXEDDB_DEBUG) {
        console.debug(message, optionalParams);
    }
}
export class Sink extends DefaultSink<FileHandle> implements FileSystemWritableFileStream {
    constructor(fileHandle: FileHandle, file: File) {
        super(fileHandle);
        this.fileHandle = fileHandle;
        const db = fileHandle._db;
        const id = fileHandle._id;
        this.db = db;
        this.id = id;
        const size = file.size;
        this.size = size;
        this.position = 0;
        this.file = file;
    }
    db: IDBDatabase;
    id: IDBValidKey;
    fileHandle: FileHandle;
    size: number;
    position: number;
    file: File;

    getWriter(): WritableStreamDefaultWriter<any> {
        const w = new WritableStreamDefaultWriter<any>(this);
        return w;
    }

    //async write(data: FileSystemWriteChunkType): Promise<void> {
    async write(chunk: any): Promise<void> {
        if (typeof chunk === "object") {
            if (chunk.type === "write") {
                if (Number.isInteger(chunk.position) && chunk.position >= 0) {
                    if (this.size < chunk.position) {
                        this.file = new File(
                            [this.file, new ArrayBuffer(chunk.position - this.size)],
                            this.file.name,
                            this.file
                        );
                    }
                    this.position = chunk.position;
                }
                if (!("data" in chunk)) {
                    throw new DOMException("write requires a data argument");
                }
                chunk = chunk.data;
            } else if (chunk.type === "seek") {
                if (Number.isInteger(chunk.position) && chunk.position >= 0) {
                    if (this.size < chunk.position) {
                        throw new InvalidStateError();
                    }
                    this.position = chunk.position;
                    return;
                } else {
                    throw new SyntaxError("write requires a data argument");
                }
            } else if (chunk.type === "truncate") {
                if (Number.isInteger(chunk.size) && chunk.size >= 0) {
                    let file = this.file;
                    file =
                        chunk.size < this.size
                            ? new File([file.slice(0, chunk.size)], file.name, file)
                            : new File([file, new Uint8Array(chunk.size - this.size)], file.name, file);

                    this.size = file.size;
                    if (this.position > file.size) {
                        this.position = file.size;
                    }
                    this.file = file;
                    return;
                } else {
                    throw new SyntaxError("truncate requires a size argument");
                }
            }
        }

        chunk = new Blob([chunk]);

        let blob = this.file;
        // Calc the head and tail fragments
        const head = blob.slice(0, this.position);
        const tail = blob.slice(this.position + chunk.size);

        // Calc the padding
        let padding = this.position - head.size;
        if (padding < 0) {
            padding = 0;
        }
        blob = new File([head, new Uint8Array(padding), chunk, tail], blob.name);
        this.size = blob.size;
        this.position += chunk.size;
        this.file = blob;
    }

    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            const [tx, table] = store(this.db);
            const tableKeyValue = table.get(this.id);
            tableKeyValue.onsuccess = (evt) => {
                if (evt) {
                    tableKeyValue.result ? table.put(this.file, this.id) : reject(new NotFoundError());
                }
            };
            tx.oncomplete = () => resolve();
            tx.onerror = reject;
            tx.onabort = reject;
        });
    }

    async abort(): Promise<void> {
        indexedDBDebug("abort");
    }
}

export class FileHandle implements ImpleFileHandle<Sink, File> {
    constructor(db: IDBDatabase, id: IDBValidKey, name: string) {
        this._db = db;
        this._id = id;
        this.name = name;
        this.kind = "file";
        this.readable = true;
        this.writable = true;
        this.path = "";
    }
    path: string;
    _db: IDBDatabase;
    _id: IDBValidKey;
    name: string;
    kind: "file";
    readable: boolean;
    writable: boolean;

    /** @param {FileHandle} other */
    async isSameEntry(other: FileHandle): Promise<boolean> {
        return this._id === other._id;
    }

    async getFile(): Promise<File> {
        /** @type {File} */
        const file = await new Promise<File>((resolve, reject) => {
            const req = store(this._db)[1].get(this._id);
            req.onsuccess = (evt) => resolve(req.result);
            req.onerror = (evt) => reject(req.error);
        });
        if (!file) throw new NotFoundError();
        return file;
    }

    async createWritable(opts?: any) {
        let file = await this.getFile(); // Used directly to test existences
        file = opts.keepExistingData ? file : new File([], this.name);
        return new Sink(this, file);
    }
}

/**
 * @param {IDBDatabase} db
 * @returns {[IDBTransaction, IDBObjectStore]}
 */
function store(db: IDBDatabase): [IDBTransaction, IDBObjectStore] {
    //const tx = db.transaction("entries", "readwrite", { durability: "relaxed" });
    const tx = db.transaction("entries", "readwrite");
    return [tx, tx.objectStore("entries")];
}

function rimraf(evt: any, toDelete: FileHandle | FolderHandle, recursive = true) {
    const { source, result } = evt.target;
    for (const [id, isFile] of Object.values(toDelete || result)) {
        if (isFile) source.delete(id);
        else if (recursive) {
            source.get(id).onsuccess = rimraf;
            source.delete(id);
        } else {
            source.get(id).onsuccess = (evt: any) => {
                if (Object.keys(evt.target.result).length !== 0) {
                    evt.target.transaction.abort();
                } else {
                    source.delete(id);
                }
            };
        }
    }
}

export class FolderHandle implements ImplFolderHandle<FileHandle, FolderHandle> {
    /**
     * @param {IDBDatabase} db
     * @param {IDBValidKey} id
     * @param {string} name
     */
    constructor(db: IDBDatabase, id: IDBValidKey, name: string) {
        this._db = db;
        this._id = id;
        this.kind = "directory";
        this.name = name;
        this.readable = true;
        this.writable = true;
        this.path = "";
        this._cachedEntries = {};
    }
    path: string;
    _db: IDBDatabase;
    _id: IDBValidKey;
    kind: "directory";
    name: string;
    readable: boolean;
    writable: boolean;
    _cachedEntries: Record<string, FolderHandle | FileHandle>;
    _rootFolderHandle?: FolderHandle;

    /** @returns {AsyncGenerator<[string, FileHandle | FolderHandle]>} */
    async *entries(): AsyncGenerator<[string, FileHandle | FolderHandle]> {
        const req = store(this._db)[1].get(this._id);
        await new Promise<void>((rs, rj) => {
            req.onsuccess = () => rs();
            req.onerror = () => rj(req.error);
        });
        const entries = req.result as FileHandle | FolderHandle[];
        if (!entries) throw new NotFoundError();
        for (const [name, [id, isFile, isExternal]] of Object.entries(entries)) {
            if (isFile) {
                yield [name, new FileHandle(this._db, id, name)];
            } else if (isExternal) {
                const extHandle = await this.getExternalFolderHandle(name, id, isFile, isExternal);
                yield [name, extHandle];
            } else {
                const fh = new FolderHandle(this._db, id, name);
                fh._rootFolderHandle = this._rootFolderHandle;
                yield [name, fh];
            }
        }
    }

    /** @param {FolderHandle} other  */
    isSameEntry(other: FolderHandle) {
        return this._id === other._id;
    }

    /**
     * @param {string} name
     * @param {{ create: boolean; }} opts
     */
    async getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FolderHandle> {
        return new Promise((resolve, reject) => {
            const table = store(this._db)[1];
            const req = table.get(this._id);
            let do_create = false;
            if (options) {
                if (options.create) {
                    do_create = options.create;
                }
            }
            req.onsuccess = () => {
                const entries = req.result;
                const entry = entries[name];
                entry // entry exist
                    ? entry[1] // isFile?
                        ? reject(new TypeMismatchError())
                        : resolve(this.getExternalFolderHandle(name, entry[0], entry[1], entry[2]))
                    : do_create
                    ? (table.add({}).onsuccess = (evt) => {
                          const target = evt.target as IDBRequest;
                          const id = target.result;
                          entries[name] = [id, false];
                          table.put(entries, this._id).onsuccess = () => {
                              const fh = new FolderHandle(this._db, id, name);
                              fh._rootFolderHandle = this._rootFolderHandle;
                              resolve(fh);
                          };
                      })
                    : reject(new NotFoundError());
            };
        });
    }

    async getExternalFolderHandle(
        name: string,
        id: number,
        isFile: boolean,
        isExternal: boolean
    ): Promise<FolderHandle> {
        const cachedEntry = this._cachedEntries[name];
        if (cachedEntry) {
            return cachedEntry as FolderHandle;
        } else {
            let ret: FolderHandle | undefined;
            if (isFile) {
                throw new TypeMismatchError();
            } else if (isExternal) {
                const handeRetrieved = new Promise<FileSystemDirectoryHandle>((resolve, reject) => {
                    const req = store(this._db)[1].get(id);
                    req.onsuccess = (evt) => resolve(req.result);
                    req.onerror = (evt) => reject(req.error);
                });
                if (!handeRetrieved) throw new NotFoundError();
                try {
                    let extHandleDirectoryHandle = await handeRetrieved;

                    // @ts-ignore
                    if (extHandleDirectoryHandle.adapter) {
                        // @ts-ignore
                        extHandleDirectoryHandle = extHandleDirectoryHandle.adapter;
                    }
                    // @ts-ignore
                    if (extHandleDirectoryHandle.url) {
                        const secStore = await this.loadSecurityStore();
                        // @ts-ignore
                        const url = extHandleDirectoryHandle.url;
                        const extHandleDirectoryHandleFSDir = await getDirectoryHandleByURL(url, secStore);
                        extHandleDirectoryHandle = extHandleDirectoryHandleFSDir;
                    }
                    const extHandle = extHandleDirectoryHandle as unknown as FolderHandle;
                    this.verifyPermission(extHandleDirectoryHandle, true);
                    ret = extHandle;
                } catch (error: any) {
                    console.log("indexeddb.getExternalFolderHandle error: ", error);
                }
            }
            if (!ret) {
                ret = new FolderHandle(this._db, id, name);
                ret._rootFolderHandle = this._rootFolderHandle;
            }
            this._cachedEntries[name] = ret;
            return ret;
        }
    }

    async verifyPermission(fileHandle: FileSystemDirectoryHandle, withWrite = true) {
        const opts: FileSystemHandlePermissionDescriptor = {
            mode: "read",
        };
        if (withWrite) {
            opts.mode = "readwrite";
        }

        if (fileHandle.queryPermission) {
            // Check if we already have permission, if so, return true.
            if ((await fileHandle.queryPermission(opts)) === "granted") {
                return true;
            }
        } else {
            console.warn("fileHandle.queryPermission does not exist on ", fileHandle);
        }

        if (fileHandle.requestPermission) {
            // Request permission to the file, if the user grants permission, return true.
            if ((await fileHandle.requestPermission(opts)) === "granted") {
                return true;
            }
            console.warn("fileHandle.requestPermission does not exist on ", fileHandle);
        }

        // The user did not grant permission, return false.
        return false;
    }

    /**
     * @param {string} name
     * @param {{ create: boolean; }} opts
     */
    async getFileHandle(name: string, options?: { create?: boolean }): Promise<FileHandle> {
        indexedDBDebug(`indexeddb.getFileHandle name: ${name}`);
        return new Promise<FileHandle>((resolve, reject) => {
            const table = store(this._db)[1];
            const query = table.get(this._id);
            let do_create = false;
            if (options) {
                if (options.create) {
                    do_create = options.create;
                }
            }
            query.onsuccess = () => {
                const entries = query.result;
                const entry = entries[name];
                if (entry && entry[1]) resolve(new FileHandle(this._db, entry[0], name));
                if (entry && !entry[1]) reject(new TypeMismatchError());
                if (!entry && !do_create) reject(new NotFoundError());
                if (!entry && do_create) {
                    const q = table.put(new File([], name));
                    q.onsuccess = () => {
                        const id = q.result;
                        entries[name] = [id, true];
                        const query = table.put(entries, this._id);
                        query.onsuccess = () => {
                            resolve(new FileHandle(this._db, id, name));
                        };
                    };
                }
            };
        });
    }

    async removeEntry(name: string, opts: { recursive?: boolean }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const [tx, table] = store(this._db);
            const cwdQ = table.get(this._id);
            cwdQ.onsuccess = (evt) => {
                const cwd = cwdQ.result;
                const toDelete = { _: cwd[name] };
                const toDeleteFileOrFolderUnknown = toDelete as unknown;
                const toDeleteFileOrFolder = toDeleteFileOrFolderUnknown as FileHandle | FolderHandle;
                if (!toDelete._) {
                    return reject(new NotFoundError());
                }
                delete cwd[name];
                table.put(cwd, this._id);
                rimraf(evt, toDeleteFileOrFolder, !!opts.recursive);
            };
            tx.oncomplete = () => {
                delete this._cachedEntries[name];
                resolve();
            };
            tx.onerror = reject;
            tx.onabort = () => {
                reject(new InvalidModificationError());
            };
        });
    }

    async insertHandle(handle: FileSystemHandle): Promise<FileSystemHandle> {
        const name = handle.name;
        const create = true;
        return new Promise((resolve, reject) => {
            const table = store(this._db)[1];
            const req = table.get(this._id);
            req.onsuccess = () => {
                const entries = req.result;
                const entry = entries[name];
                entry // entry exist
                    ? entry[1] // isFile?
                        ? reject(new TypeMismatchError())
                        : resolve(handle)
                    : create
                    ? (table.add(handle).onsuccess = (evt) => {
                          const target = evt.target as IDBRequest;
                          const id = target.result;
                          const isFile = false;
                          const isExternal = true;
                          entries[name] = [id, isFile, isExternal];
                          table.put(entries, this._id).onsuccess = () => resolve(handle);
                      })
                    : reject(new NotFoundError());
            };
        });
    }

    async loadSecurityStore(): Promise<any> {
        let ret: any = {};
        try {
            indexedDBDebug("loadSecurityStore: begin ");
            const rootHandle = await this.getRootFolderHandle();
            const keystorePath = "/var/keystore.yaml";
            indexedDBDebug("loadSecurityStore: before openFile");
            const f = await rootHandle.openFile(keystorePath);
            indexedDBDebug("loadSecurityStore: f: ", f);
            const dec = new TextDecoder();
            const yamlString = dec.decode(await f.arrayBuffer());
            indexedDBDebug(`loadSecurityStore: yamlString: ${yamlString}`);
            ret = yaml.load(yamlString);
        } catch (error: any) {
            console.warn("loadSecurityStore: error:", error);
        }
        return ret;
    }

    async openFile(subPath: string): Promise<File> {
        const thisAsFHandle = this as unknown as FileSystemDirectoryHandle;
        const fh = await openFileHandle(new NFileSystemDirectoryHandle(thisAsFHandle), subPath);
        const f = await fh.getFile();
        return f;
    }

    async getRootFolderHandle(): Promise<FolderHandle> {
        return new Promise<FolderHandle>((resolve) => {
            if (this._rootFolderHandle) {
                resolve(this._rootFolderHandle);
            } else {
                //if not set try to look it up from the db:
                const request = indexedDB.open("fileSystem");
                request.onsuccess = () => {
                    resolve(new FolderHandle(request.result, 1, ""));
                };
            }
        });
    }
}

//export default (dbName: string , opts = { persistent: false }) =>
export default (opts = { persistent: false }) =>
    new Promise<FolderHandle>((resolve) => {
        const dbName = "entries";
        /*if (!dbName) {
      dbName = "entries";
    }*/
        const request = indexedDB.open("fileSystem");

        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore(dbName, {
                autoIncrement: true,
            }).transaction.oncomplete = (evt) => {
                db.transaction(dbName, "readwrite").objectStore(dbName).add({});
            };
        };

        request.onsuccess = () => {
            const rootFolderHandle = new FolderHandle(request.result, 1, "");
            rootFolderHandle._rootFolderHandle = rootFolderHandle;
            resolve(rootFolderHandle);
        };
    });
