import { instantiate } from "./nfs_rs";
import { WASIWorker } from "@netapplabs/wasi-js";
import { NFileSystemWritableFileStream, PreNameCheck, InvalidModificationError, NotFoundError, SyntaxError, TypeMismatchError, } from "@netapplabs/fs-js";
import process from "node:process";
const ACCESS3_READ = 0x0001;
const ACCESS3_LOOKUP = 0x0002;
const ACCESS3_MODIFY = 0x0004;
const ACCESS3_EXTEND = 0x0008;
const ACCESS3_DELETE = 0x0010;
const ACCESS3_EXECUTE = 0x0020;
const NFS3_OK = 0;
const NFS3ERR_PERM = 1;
const NFS3ERR_NOENT = 2;
const NFS3ERR_IO = 5;
const NFS3ERR_NXIO = 6;
const NFS3ERR_ACCES = 13;
const NFS3ERR_EXIST = 17;
const NFS3ERR_XDEV = 18;
const NFS3ERR_NODEV = 19;
const NFS3ERR_NOTDIR = 20;
const NFS3ERR_ISDIR = 21;
const NFS3ERR_INVAL = 22;
const NFS3ERR_FBIG = 27;
const NFS3ERR_NOSPC = 28;
const NFS3ERR_ROFS = 30;
const NFS3ERR_MLINK = 31;
const NFS3ERR_NAMETOOLONG = 63;
const NFS3ERR_NOTEMPTY = 66;
const NFS3ERR_DQUOT = 69;
const NFS3ERR_STALE = 70;
const NFS3ERR_REMOTE = 71;
const NFS3ERR_BADHANDLE = 10001;
const NFS3ERR_NOT_SYNC = 10002;
const NFS3ERR_BAD_COOKIE = 10003;
const NFS3ERR_NOTSUPP = 10004;
const NFS3ERR_TOOSMALL = 10005;
const NFS3ERR_SERVERFAULT = 10006;
const NFS3ERR_BADTYPE = 10007;
const NFS3ERR_JUKEBOX = 10008;
const AttrTypeDirectory = 2;
const AccessRead = ACCESS3_READ | ACCESS3_LOOKUP | ACCESS3_EXECUTE;
const AccessReadWrite = AccessRead | ACCESS3_MODIFY | ACCESS3_EXTEND | ACCESS3_DELETE;
let READDIRPLUS_CACHE_LIFETIME_MS = 1000;
globalThis.NFS_JS_DEBUG = false;
export function nfsDebug(msg, ...optionalParams) {
    if (globalThis.NFS_JS_DEBUG) {
        console.log(msg, ...optionalParams);
    }
}
// XXX: elsewhere reads are getting sliced into 4k chunks but 32k chunks seem to work fine (and faster)
//      have tried larger chunks (e.g. 64k) which seem to still work but are only marginally faster so...
let MAX_READ_SIZE = 32768;
if (process !== undefined) {
    if (process.env !== undefined) {
        let max_read = process.env.WASMIN_MAX_NFS_READ_SIZE;
        if (max_read) {
            MAX_READ_SIZE = Number(max_read);
        }
    }
}
function isNumber(numVal) {
    return !isNaN(parseFloat(numVal)) && isFinite(numVal);
}
/**
 *
 * preparse url so that params on url string are read, params supported are:
 *
 * rwsize [block size for max read/write in bytes]
 * cachems [cache time-to-live for readdirplus in ms]
 *
 * @param url URL string like 'nfs://127.0.0.1/volume-1?nfsport=2049&mountport=6635&rwsize=1048576'
 */
function preParseUrlString(url) {
    const indexOfQuestion = url.indexOf("?");
    if (indexOfQuestion > 0) {
        let queryString = url.substring(indexOfQuestion + 1);
        const urlSearchParams = new URLSearchParams(queryString);
        for (const p of urlSearchParams) {
            let paramName = p[0];
            let paramVal = p[1];
            if (paramName == "rwsize") {
                if (isNumber(paramVal)) {
                    MAX_READ_SIZE = parseInt(paramVal);
                    nfsDebug(`Setting MAX_READ_SIZE: ${MAX_READ_SIZE}`);
                }
            }
            else if (paramName == "cachems") {
                if (isNumber(paramVal)) {
                    READDIRPLUS_CACHE_LIFETIME_MS = parseInt(paramVal);
                    nfsDebug(`Setting READDIRPLUS_CACHE_LIFETIME_MS: ${READDIRPLUS_CACHE_LIFETIME_MS}`);
                }
            }
        }
    }
}
function fullNameFromReaddirplusEntry(parentName, entry) {
    const suffix = entry.attr?.attrType === AttrTypeDirectory ? "/" : "";
    return parentName + entry.fileName + suffix;
}
const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
let _fs;
async function fetchCompile(url) {
    if (url.protocol === "compiled:" || url.pathname.startsWith("/$bunfs/root/")) {
        const filePaths = url.pathname.split("/");
        const fileName = filePaths[filePaths.length - 1];
        url = new URL(fileName, "file:///tmp/wasmin-tmp/");
    }
    if (isNode) {
        _fs = _fs || (await import("node:fs/promises"));
        return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
}
async function compileCore(url) {
    if (url == "nfs_rs.core.wasm") {
        const metaUrl = new URL("./nfs_rs.core.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    }
    else if (url == "nfs_rs.core2.wasm") {
        const metaUrl = new URL("./nfs_rs.core2.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    }
    else if (url == "nfs_rs.core3.wasm") {
        const metaUrl = new URL("./nfs_rs.core3.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    }
    else if (url == "nfs_rs.core4.wasm") {
        const metaUrl = new URL("./nfs_rs.core4.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    }
    else {
        throw new Error(`unsupported wasm URL: ${url}`);
    }
}
let wasi;
let nfsComponent;
let instantiation;
async function ensureInstantiation() {
    if (!instantiation) {
        instantiation = new Promise(async (resolve, reject) => {
            wasi = new WASIWorker({});
            await wasi
                .createWorker()
                .then((componentImports) => instantiate(compileCore, componentImports))
                .then((instance) => (nfsComponent = instance.nfs))
                .catch((e) => reject(e));
            resolve(wasi);
        });
    }
    await instantiation;
}
export class NfsHandle {
    _parent;
    _mount;
    _fhDir;
    _fh;
    _fileid;
    _fullName;
    kind;
    name;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isFile;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isDirectory;
    constructor(parent, fh, fileid, kind, fullName, name) {
        if (parent.parentDir) {
            const parentDir = parent.parentDir;
            this._parent = parentDir;
            this._mount = parentDir._mount;
            this._fhDir = parentDir._fh;
        }
        else if (parent.mount && parent.fhDir) {
            this._mount = parent.mount;
            this._fhDir = parent.fhDir;
        }
        else {
            throw new Error("Invalid Parent Directory File Descriptor");
        }
        this._fh = fh;
        this._fileid = fileid;
        this._fullName = fullName;
        this.kind = kind;
        this.name = name;
        this.isFile = kind == "file";
        this.isDirectory = kind == "directory";
    }
    isSameEntry(other) {
        return new Promise(async (resolve) => {
            const anyOther = other;
            if (anyOther._mount && anyOther._mount !== this._mount) {
                resolve(false);
            }
            else {
                resolve(other.kind === this.kind &&
                    other.name === this.name &&
                    (!anyOther._fileid || anyOther._fileid === this._fileid) &&
                    (!anyOther._fullName || anyOther._fullName === this._fullName));
            }
        });
    }
    async queryPermission(perm) {
        return new Promise(async (resolve, reject) => {
            const mode = perm?.mode === "readwrite" ? AccessReadWrite : AccessRead;
            const ret = this._mount.access(this._fh, mode);
            if (ret !== 0) {
                // XXX: ACCESS3_EXECUTE may be omitted for root directory access but we should still return 'granted'
                resolve(ret === mode || (this._fullName === "/" && (ret | ACCESS3_EXECUTE) === mode) ? "granted" : "denied");
            }
            else {
                reject("access denied");
            }
        });
    }
    async requestPermission(perm) {
        return new Promise(async (resolve, reject) => {
            const mode = perm.mode === "readwrite" ? AccessReadWrite : AccessRead;
            try {
                this._mount.setattr(this._fh, undefined, mode, undefined, undefined, undefined, undefined, undefined);
                resolve("granted");
            }
            catch (e) {
                if (e.payload?.nfsErrorCode === NFS3ERR_PERM || e.payload?.nfsErrorCode === NFS3ERR_ACCES) {
                    resolve("denied");
                }
                else {
                    reject(e);
                }
            }
        });
    }
    async stat() {
        if (this._parent) {
            // Using cache from readdirplus
            try {
                const objRet = await this._parent.getEntryCachedByFileHandle(this._fh);
                if (objRet !== undefined && objRet.attr !== undefined) {
                    const attr = objRet.attr;
                    const mtime = BigInt(attr.mtime.seconds) * 1000000000n + BigInt(attr.mtime.nseconds);
                    const atime = BigInt(attr.atime.seconds) * 1000000000n + BigInt(attr.atime.nseconds);
                    const stats = {
                        inode: attr.fileid,
                        size: attr.filesize,
                        creationTime: mtime,
                        modifiedTime: mtime,
                        accessedTime: atime,
                    };
                    return stats;
                }
            }
            catch (err) {
                const name = this._fullName;
                nfsDebug(`stat() err for ${name}: `, err);
            }
        }
        const attr = this._mount.getattr(this._fh);
        const mtime = BigInt(attr.mtime.seconds) * 1000000000n + BigInt(attr.mtime.nseconds);
        const atime = BigInt(attr.atime.seconds) * 1000000000n + BigInt(attr.atime.nseconds);
        const stats = {
            inode: attr.fileid,
            size: attr.filesize,
            creationTime: mtime,
            modifiedTime: mtime,
            accessedTime: atime,
        };
        return stats;
    }
}
class ReaddirplusEntryCache {
    timestamp;
    entries;
    constructor(timestamp) {
        this.timestamp = timestamp ?? 0;
    }
}
export class NfsDirectoryHandle extends NfsHandle {
    [Symbol.asyncIterator] = this.entries;
    kind;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isFile;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isDirectory;
    _readdirplusEntryCache;
    constructor(param) {
        let parent;
        let mount;
        let fhDir;
        let fh;
        let fileid;
        let kind;
        let fullName;
        let name;
        if (typeof param === "string") {
            const url = param;
            preParseUrlString(url);
            mount = nfsComponent.parseUrlAndMount(url);
            const res = mount.lookupPath("/");
            fh = res.obj;
            fhDir = fh;
            fileid = res.attr ? res.attr.fileid : mount.getattr(fh).fileid;
            kind = "directory";
            fullName = "/";
            name = "";
            parent = {
                mount: mount,
                fhDir: fhDir,
            };
        }
        else {
            const dirHandleParam = param;
            const parentToWrap = dirHandleParam._parent;
            mount = dirHandleParam._mount;
            fhDir = dirHandleParam._fhDir;
            fh = dirHandleParam._fh;
            fileid = dirHandleParam._fileid;
            kind = dirHandleParam.kind;
            fullName = dirHandleParam._fullName;
            name = dirHandleParam.name;
            parent = {
                parentDir: parentToWrap,
            };
        }
        super(parent, fh, fileid, kind, fullName, name);
        this[Symbol.asyncIterator] = this.entries;
        this.kind = "directory";
        this.isFile = false;
        this.isDirectory = true;
        this.getEntries = this.values;
        this._readdirplusEntryCache = new ReaddirplusEntryCache();
    }
    invalidateReaddirplusCache() {
        this._readdirplusEntryCache.timestamp = 0;
        this._readdirplusEntryCache.entries = undefined;
    }
    async getEntryCachedByFileHandle(fh) {
        const entries = await this.readdirplus();
        for (const entry of entries) {
            if (entry.handle == fh) {
                const objRet = {
                    obj: entry.handle,
                    attr: entry.attr,
                };
                return objRet;
            }
        }
        return undefined;
    }
    getNameNormalized(name) {
        let retName = name;
        if (name == "/") {
            retName = name;
        }
        else if (name.startsWith("/")) {
            retName = name.substring(1);
        }
        return retName;
    }
    isSameNameNormalized(name1, name2) {
        const name1Normalized = this.getNameNormalized(name1);
        const name2Normalized = this.getNameNormalized(name2);
        if (name1Normalized == name2Normalized) {
            return true;
        }
        return false;
    }
    populateReaddirCache(entries, name) {
        // attempth to add it to the cache
        const parentFh = this._fh;
        const res = this._mount.lookup(parentFh, name);
        const fh = res.obj;
        let attr = res.attr;
        if (attr == undefined) {
            attr = this._mount.getattr(fh);
        }
        const fileid = attr.fileid;
        const cachedEntry = {
            fileid: fileid,
            fileName: name,
            attr: attr,
            handle: fh,
        };
        let foundInCache = false;
        for (const entry of entries) {
            if (this.isSameNameNormalized(entry.fileName, name)) {
                entry.fileid = cachedEntry.fileid;
                entry.attr = cachedEntry.attr;
                entry.handle = cachedEntry.handle;
                foundInCache = true;
            }
        }
        if (!foundInCache) {
            entries.push(cachedEntry);
        }
        return res;
    }
    isReadDirCacheAlive() {
        const name = this._fullName;
        const now = Date.now();
        if (this._readdirplusEntryCache.entries) {
            const cacheTimeAlive = now - this._readdirplusEntryCache.timestamp;
            if (cacheTimeAlive <= READDIRPLUS_CACHE_LIFETIME_MS) {
                nfsDebug(`isReadDirCacheAlive true for ${name}`);
                return true;
            }
        }
        nfsDebug(`isReadDirCacheAlive false for ${name}`);
        return false;
    }
    async getEntryByNameTryLookupFromCache(name) {
        const entries = await this.readdirplus();
        for (const entry of entries) {
            if (this.isSameNameNormalized(entry.fileName, name)) {
                const entryHandle = entry.handle;
                if (entryHandle !== undefined && entryHandle.length > 0) {
                    const cachedRes = {
                        obj: entry.handle,
                        attr: entry.attr,
                    };
                    return { obj: cachedRes, entry: entry };
                }
                else {
                    nfsDebug(`getEntryByNameTryLookupFromCache entryHandleLength 0 for ${name}`);
                }
            }
        }
        const res = this.populateReaddirCache(entries, name);
        return { obj: res };
    }
    async readdirplus() {
        if (!this.isReadDirCacheAlive()) {
            const now = Date.now();
            this._readdirplusEntryCache.timestamp = now;
            this._readdirplusEntryCache.entries = new Promise((resolve, reject) => {
                try {
                    let name = this._fullName;
                    nfsDebug(`calling actual nfs readdirplus for dir ${name}`);
                    const entries = this._mount.readdirplus(this._fh);
                    return resolve(entries);
                }
                catch (e) {
                    if (e.payload?.nfsErrorCode === NFS3ERR_NOENT ||
                        e.payload?.nfsErrorCode === NFS3ERR_NOTDIR ||
                        e.payload?.nfsErrorCode === NFS3ERR_STALE) {
                        return reject(new NotFoundError());
                    }
                    return reject(e);
                }
            });
        }
        return this._readdirplusEntryCache.entries;
    }
    async *entryHandles() {
        const entries = await this.readdirplus();
        for (const entry of entries) {
            if (entry.fileName !== "." && entry.fileName !== "..") {
                const fullName = fullNameFromReaddirplusEntry(this._fullName, entry);
                if (fullName.endsWith("/")) {
                    let dirHandle = entry.directoryHandle;
                    if (dirHandle == undefined) {
                        dirHandle = new NfsDirectoryHandle(new NfsHandle({ parentDir: this }, entry.handle, entry.fileid, "directory", fullName, entry.fileName));
                    }
                    yield dirHandle;
                }
                else {
                    yield new NfsFileHandle(new NfsHandle({ parentDir: this }, entry.handle, entry.fileid, "file", fullName, entry.fileName));
                }
            }
        }
    }
    async *entries() {
        for await (const entry of this.entryHandles()) {
            yield [entry.name, entry];
        }
    }
    async *keys() {
        for await (const entry of this.entryHandles()) {
            yield entry.name;
        }
    }
    async *values() {
        for await (const entry of this.entryHandles()) {
            yield entry;
        }
    }
    async requestPermission(perm) {
        return super.requestPermission(perm).then((state) => {
            this.invalidateReaddirplusCache();
            return state;
        });
    }
    async getDirectoryHandleTryCached(name) {
        const thisHandle = this;
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.getEntryByNameTryLookupFromCache(name);
                const obj = res.obj;
                const fh = obj.obj;
                const attr = obj.attr || this._mount.getattr(fh);
                if (attr.attrType !== AttrTypeDirectory) {
                    return reject(new TypeMismatchError());
                }
                let dHandle;
                let readDirEntry = res.entry;
                if (readDirEntry !== undefined) {
                    dHandle = readDirEntry.directoryHandle;
                }
                if (dHandle == undefined) {
                    dHandle = new NfsDirectoryHandle(new NfsHandle({ parentDir: thisHandle }, fh, attr.fileid, "directory", this._fullName + name + "/", name));
                    if (readDirEntry) {
                        // store the directoryHandle in the cache
                        readDirEntry.directoryHandle = dHandle;
                    }
                }
                return resolve(dHandle);
            }
            catch (err) {
                return reject(new NotFoundError());
            }
        });
    }
    async getDirectoryHandle(name, options) {
        const thisHandle = this;
        return new Promise(async (resolve, reject) => {
            try {
                PreNameCheck(name);
                let handle = await this.getDirectoryHandleTryCached(name);
                resolve(handle);
            }
            catch (e) {
                if (e instanceof TypeError) {
                    return reject(e);
                }
                else if (e instanceof TypeMismatchError) {
                    return reject(e);
                }
                nfsDebug(`getDirectoryHandle name='${name}' error: `, e);
                // XXX: ignore error
            }
            if (!options?.create) {
                return reject(new NotFoundError());
            }
            try {
                const mode = 0o775;
                const res = this._mount.mkdir(this._fh, name, mode);
                this.invalidateReaddirplusCache();
                const fh = res.obj;
                const attr = res.attr || this._mount.getattr(fh);
                return resolve(new NfsDirectoryHandle(new NfsHandle({ parentDir: thisHandle }, fh, attr.fileid, "directory", this._fullName + name + "/", name)));
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    async getFileHandle(name, options) {
        return new Promise(async (resolve, reject) => {
            try {
                PreNameCheck(name);
                const res = await this.getEntryByNameTryLookupFromCache(name);
                const obj = res.obj;
                const fh = obj.obj;
                const attr = obj.attr || this._mount.getattr(fh);
                if (attr.attrType === AttrTypeDirectory) {
                    return reject(new TypeMismatchError());
                }
                return resolve(new NfsFileHandle(new NfsHandle({ parentDir: this }, fh, attr.fileid, "file", this._fullName + name, name)));
            }
            catch (e) {
                if (e instanceof TypeError) {
                    return reject(e);
                }
                // XXX: ignore error
            }
            if (!options?.create) {
                return reject(new NotFoundError());
            }
            try {
                const mode = 0o664;
                this._mount.create(this._fh, name, mode); // XXX: ignore returned file handle and obtain one via lookup instead - workaround for go-nfs bug
                this.invalidateReaddirplusCache();
                const res = this._mount.lookup(this._fh, name);
                const fh = res.obj;
                const attr = res.attr || this._mount.getattr(fh);
                return resolve(new NfsFileHandle(new NfsHandle({ parentDir: this }, fh, attr.fileid, "file", this._fullName + name, name)));
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    async removeEntry(name, options) {
        return new Promise(async (resolve, reject) => {
            try {
                PreNameCheck(name);
                const res = this._mount.lookup(this._fh, name);
                const fh = res.obj;
                const attr = res.attr || this._mount.getattr(fh);
                if (attr.attrType === AttrTypeDirectory) {
                    this.removeDirectory(fh, this._fh, name, !!options?.recursive);
                }
                else {
                    this._mount.remove(this._fh, name);
                    this.invalidateReaddirplusCache();
                }
                return resolve();
            }
            catch (e) {
                if (e.payload?.nfsErrorCode === NFS3ERR_NOENT || e.payload?.nfsErrorCode === NFS3ERR_STALE) {
                    return reject(new NotFoundError());
                }
                else if (e.payload?.nfsErrorCode === NFS3ERR_IO || e.payload?.nfsErrorCode === NFS3ERR_NOTEMPTY) {
                    return reject(new InvalidModificationError());
                }
                return reject(e);
            }
        });
    }
    removeDirectory(fh, parent, name, recursive) {
        if (recursive) {
            const entries = this._mount.readdirplus(fh);
            for (const entry of entries) {
                if (entry.fileName !== "." && entry.fileName !== "..") {
                    if (entry.attr?.attrType === AttrTypeDirectory) {
                        this.removeDirectory(entry.handle, fh, entry.fileName, recursive);
                    }
                    else {
                        this._mount.remove(fh, entry.fileName);
                        this.invalidateReaddirplusCache();
                    }
                }
            }
        }
        this._mount.rmdir(parent, name);
        this.invalidateReaddirplusCache();
    }
    async resolve(possibleDescendant) {
        return new Promise(async (resolve, reject) => {
            try {
                const anyPossibleDescendant = possibleDescendant;
                if (anyPossibleDescendant._mount && anyPossibleDescendant._mount !== this._mount) {
                    return resolve(null); // FIXME: reject instead?
                }
                const ret = await this.resolveDirectory(this.values(), possibleDescendant);
                return resolve(ret);
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    async resolveDirectory(subentries, possibleDescendant) {
        for await (const subentry of subentries) {
            if (await subentry.isSameEntry(possibleDescendant)) {
                const ret = subentry.name.substring(1).split("/");
                ret.pop();
                return ret;
            }
            if (subentry.kind === "directory") {
                const nfsEntry = subentry;
                const ret = await this.resolveDirectory(nfsEntry.values(), possibleDescendant);
                if (ret) {
                    return ret;
                }
            }
        }
        return null;
    }
    /**
     * @deprecated Old property just for Chromium <=85. Use `.keys()`, `.values()`, `.entries()`, or the directory itself as an async iterable in the new API.
     */
    getEntries;
}
export class NfsFileHandle extends NfsHandle {
    kind;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isFile;
    /**
     * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
     */
    isDirectory;
    constructor(param) {
        const toWrap = param;
        super({ parentDir: toWrap._parent }, toWrap._fh, toWrap._fileid, toWrap.kind, toWrap._fullName, toWrap.name);
        this.kind = "file";
        this.isFile = true;
        this.isDirectory = false;
    }
    async getFile() {
        return new Promise((resolve, reject) => {
            try {
                const file = new NfsFile(this._mount, this._fh, this.name);
                return resolve(file);
            }
            catch (e) {
                if (e.payload?.nfsErrorCode === NFS3ERR_NOENT || e.payload?.nfsErrorCode === NFS3ERR_STALE) {
                    return reject(new NotFoundError());
                }
                return reject(e);
            }
        });
    }
    async createWritable(options) {
        return new Promise(async (resolve, reject) => {
            try {
                const sink = new NfsSink(this._mount, this._fhDir, this._fh, this._fullName, options);
                return resolve(new NFileSystemWritableFileStream(sink));
            }
            catch (e) {
                // XXX: after changing things so as to retain directory file handle, seems we get
                //      NFS3ERR_ACCES if relevant directory has been deleted (at least from go-nfs)
                if (e.payload?.nfsErrorCode === NFS3ERR_NOENT || e.payload?.nfsErrorCode === NFS3ERR_ACCES || e.payload?.nfsErrorCode === NFS3ERR_STALE) {
                    return reject(new NotFoundError());
                }
                return reject(e);
            }
        });
    }
    async createSyncAccessHandle() {
        throw new Error("not supported"); // FIXME: add support?
    }
}
// @ts-ignore
export class NfsFile {
    prototype;
    _mount;
    _fh;
    lastModified;
    name;
    webkitRelativePath;
    size;
    type;
    constructor(mount, fh, name) {
        const attr = mount.getattr(fh);
        this.prototype = new File([], name);
        this._mount = mount;
        this._fh = fh;
        this.lastModified = attr.mtime.seconds * 1000 + Math.round(attr.mtime.nseconds / 1_000_000);
        this.name = name;
        this.webkitRelativePath = name;
        this.size = Number(attr.filesize);
        this.type = "unknown";
    }
    uint8Array(start, end) {
        let idx = 0;
        let pos = start || 0;
        let size = Math.max((end ? end : this.size) - pos, 0);
        const buf = new Uint8Array(size);
        while (size > 0) {
            const count = Math.min(size, MAX_READ_SIZE);
            const chunk = this._mount.read(this._fh, BigInt(pos), count);
            buf.set(chunk, idx);
            idx += chunk.byteLength;
            pos += count;
            size -= count;
        }
        return buf;
    }
    arrayBuffer() {
        return new Promise(async (resolve, reject) => {
            try {
                return resolve(this.uint8Array().buffer);
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    slice(start, end, contentType) {
        const buf = this.uint8Array(start, end);
        const blob = new NfsBlob(this._mount, this._fh, buf, contentType);
        return blob;
    }
    stream() {
        let pos = 0;
        let size = this.size;
        const readChunk = () => {
            const count = Math.min(size, MAX_READ_SIZE);
            const chunk = this._mount.read(this._fh, BigInt(pos), count);
            pos += count;
            size -= count;
            return chunk;
        };
        return new ReadableStream({
            type: "bytes",
            pull(controller) {
                if (size > 0) {
                    controller.enqueue(readChunk());
                }
                else {
                    controller.close();
                }
            },
        });
    }
    text() {
        return this.arrayBuffer().then((buf) => {
            const decoder = new TextDecoder("utf-8");
            return decoder.decode(buf);
        });
    }
}
// @ts-ignore
export class NfsBlob {
    prototype;
    _mount;
    _fh;
    _data;
    size;
    type;
    constructor(mount, fh, data, contentType) {
        this.prototype = new Blob();
        this._mount = mount;
        this._fh = fh;
        this._data = data;
        this.size = data.byteLength;
        this.type = contentType || "unknown";
    }
    arrayBuffer() {
        return new Promise(async (resolve) => resolve(this._data.buffer));
    }
    slice(start, end, contentType) {
        const blob = new NfsBlob(this._mount, this._fh, this._data.slice(start, end), contentType);
        return blob;
    }
    stream() {
        let pulled = false;
        const data = this._data;
        return new ReadableStream({
            type: "bytes",
            pull(controller) {
                if (!pulled) {
                    controller.enqueue(data);
                    pulled = true;
                }
                else {
                    controller.close();
                }
            },
        });
    }
    text() {
        return this.arrayBuffer().then((buf) => {
            const decoder = new TextDecoder("utf-8");
            return decoder.decode(buf);
        });
    }
}
export class NfsSink {
    _mount;
    _fhDir;
    _fh;
    _fhTmp;
    _fileName;
    _fileNameTmp;
    _keepExisting;
    _valid;
    _locked;
    _orgSize;
    _newSize;
    _position;
    constructor(mount, fhDir, fh, fullName, options) {
        this._fileName = fullName.slice(fullName.lastIndexOf("/") + 1);
        this._fileNameTmp = "." + this._fileName + "-tmp" + Date.now();
        this._mount = mount;
        this._fhDir = fhDir;
        this._fh = fh;
        this._fhTmp = mount.create(this._fhDir, this._fileNameTmp, 0o664).obj;
        this._keepExisting = !!options?.keepExistingData;
        this._valid = true;
        this._locked = false;
        this._orgSize = Number(mount.getattr(fh).filesize);
        this._newSize = this._keepExisting ? this._orgSize : 0;
        this._position = 0;
    }
    get locked() {
        return this._locked;
    }
    copyContents(fhFrom, fhTo, size) {
        let pos = 0n;
        while (size > 0) {
            const count = Math.min(size, MAX_READ_SIZE);
            const contents = this._mount.read(fhFrom, pos, count);
            this._mount.write(fhTo, pos, contents);
            pos += BigInt(count);
            size -= count;
        }
    }
    ensureExistingIfToBeKept() {
        if (this._keepExisting) {
            if (this._orgSize > 0) {
                this.copyContents(this._fh, this._fhTmp, this._orgSize);
            }
            this._keepExisting = false;
        }
    }
    async write(data) {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            const anyData = data;
            if (anyData.type === "seek") {
                if (!("position" in anyData) || typeof anyData.position !== "number") {
                    return reject(new SyntaxError("seek requires a position argument"));
                }
                await this.seek(anyData.position)
                    .then(() => resolve())
                    .catch((e) => reject(e));
                return;
            }
            if (anyData.type === "truncate") {
                if (!("size" in anyData) || typeof anyData.size !== "number") {
                    return reject(new SyntaxError("truncate requires a size argument"));
                }
                await this.truncate(anyData.size)
                    .then(() => resolve())
                    .catch((e) => reject(e));
                return;
            }
            if (anyData.type === "write") {
                if (!("data" in anyData)) {
                    return reject(new SyntaxError("write requires a data argument"));
                }
                if ("position" in anyData) {
                    await this.seek(anyData.position);
                }
                data = anyData.data;
            }
            let buffer;
            if (data instanceof ArrayBuffer) {
                buffer = data;
            }
            else if (ArrayBuffer.isView(data)) {
                buffer = data;
            }
            else if (data instanceof DataView) {
                buffer = data.buffer;
            }
            else if (data instanceof Blob) {
                buffer = await data.arrayBuffer();
            }
            else if (data instanceof String) {
                const encoder = new TextEncoder();
                buffer = encoder.encode(data.toString()).buffer;
            }
            else {
                const encoder = new TextEncoder();
                buffer = encoder.encode(data).buffer;
            }
            try {
                this.ensureExistingIfToBeKept();
                this._mount.write(this._fhTmp, BigInt(this._position), new Uint8Array(buffer));
                this._position += buffer.byteLength;
                if (this._position > this._newSize) {
                    this._newSize = this._position;
                }
                return resolve();
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    async seek(position) {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            this._position = position;
            return resolve();
        });
    }
    async truncate(size) {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            try {
                this.ensureExistingIfToBeKept();
                this._mount.setattr(this._fhTmp, undefined, undefined, undefined, undefined, BigInt(size), undefined, undefined);
                if (this._position > size) {
                    this._position = size;
                }
                this._newSize = size;
                return resolve();
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    async close() {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            try {
                if (!this._keepExisting) {
                    // XXX: if this._keepExisting is still set, no writes or truncates have occurred
                    this._mount.rename(this._fhDir, this._fileNameTmp, this._fhDir, this._fileName);
                }
                else {
                    this._mount.remove(this._fhDir, this._fileNameTmp);
                }
                this._valid = false;
                return resolve();
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    async abort(_reason) {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError("invalid stream"));
            }
            try {
                this._mount.remove(this._fhDir, this._fileNameTmp);
                this._valid = false;
                return resolve();
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    getWriter() {
        if (!this._valid) {
            throw new TypeError("invalid stream");
        }
        if (this.locked) {
            throw new Error("Invalid state: WritableStream is locked");
        }
        const fileStream = this;
        const stream = new WritableStream({
            abort(reason) {
                return fileStream.abort(reason);
            },
            close() {
                return fileStream.close();
            },
            write(chunk, _controller) {
                return fileStream.write(chunk);
            },
        });
        const writer = new WritableStreamDefaultWriter(stream);
        const anyWriter = writer;
        fileStream._locked = true;
        anyWriter._releaseLock = writer.releaseLock;
        anyWriter.releaseLock = () => {
            anyWriter._releaseLock();
            fileStream._locked = false;
        };
        return writer;
    }
}
export async function nfs(path) {
    await ensureInstantiation();
    return new NfsDirectoryHandle(path);
}
export default nfs;
//# sourceMappingURL=index.js.map