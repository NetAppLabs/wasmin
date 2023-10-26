import { instantiate } from "./nfs_rs.js";
import { WASIWorker } from "@wasmin/wasi-js";
import { NFileSystemWritableFileStream, PreNameCheck, InvalidModificationError, NotFoundError, SyntaxError, TypeMismatchError, } from "@wasmin/fs-js";
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
// XXX: elsewhere reads are getting sliced into 4k chunks but 32k chunks seem to work fine (and faster)
//      have tried larger chunks (e.g. 64k) which seem to still work but are only marginally faster so...
const MAX_READ_SIZE = process.env.WASMIN_MAX_NFS_READ_SIZE && Number(process.env.WASMIN_MAX_NFS_READ_SIZE) || 32768;
function fullNameFromReaddirplusEntry(parentName, entry) {
    const suffix = entry.attr?.attrType === AttrTypeDirectory ? "/" : "";
    return parentName + entry.fileName + suffix;
}
const isNode = typeof process !== "undefined" && process.versions && process.versions.node;
let _fs;
async function fetchCompile(url) {
    if (isNode) {
        _fs = _fs || (await import("fs/promises"));
        return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
}
async function compileCore(url) {
    url = "./" + url;
    return await fetchCompile(new URL(url, import.meta.url));
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
    _mount;
    _fhDir;
    _fh;
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
    constructor(mount, fhDir, fh, kind, fullName, name) {
        this._mount = mount;
        this._fhDir = fhDir;
        this._fh = fh;
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
                    (!anyOther._fullName || anyOther._fullName === this._fullName));
            }
        });
    }
    async queryPermission(perm) {
        return new Promise(async (resolve, reject) => {
            const mode = perm?.mode === "readwrite" ? AccessReadWrite : AccessRead;
            const ret = nfsComponent.access(this._mount, this._fh, mode);
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
                nfsComponent.setattr(this._mount, this._fh, undefined, mode, undefined, undefined, undefined, undefined, undefined);
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
    constructor(param) {
        let mount;
        let fhDir;
        let fh;
        let kind;
        let fullName;
        let name;
        if (typeof param === "string") {
            const url = param;
            mount = nfsComponent.parseUrlAndMount(url);
            fh = nfsComponent.lookupPath(mount, "/");
            fhDir = fh;
            kind = "directory";
            fullName = "/";
            name = "";
        }
        else {
            const toWrap = param;
            mount = toWrap._mount;
            fhDir = toWrap._fhDir;
            fh = toWrap._fh;
            kind = toWrap.kind;
            fullName = toWrap._fullName;
            name = toWrap.name;
        }
        super(mount, fhDir, fh, kind, fullName, name);
        this[Symbol.asyncIterator] = this.entries;
        this.kind = "directory";
        this.isFile = false;
        this.isDirectory = true;
        this.getEntries = this.values;
    }
    async stat() {
        const attr = nfsComponent.getattr(this._mount, this._fh);
        const mtime = BigInt(attr.mtime.seconds) * 1000000000n + BigInt(attr.mtime.nseconds);
        const atime = BigInt(attr.atime.seconds) * 1000000000n + BigInt(attr.atime.nseconds);
        const stats = {
            inode: attr.fileid,
            creationTime: mtime,
            modifiedTime: mtime,
            accessedTime: atime,
        };
        return stats;
    }
    async *entryHandles() {
        try {
            const entries = nfsComponent.readdirplus(this._mount, this._fh);
            for (const entry of entries) {
                if (entry.fileName !== "." && entry.fileName !== "..") {
                    const fullName = fullNameFromReaddirplusEntry(this._fullName, entry);
                    if (fullName.endsWith("/")) {
                        yield new NfsDirectoryHandle(new NfsHandle(this._mount, this._fh, entry.handle, "directory", fullName, entry.fileName));
                    }
                    else {
                        yield new NfsFileHandle(new NfsHandle(this._mount, this._fh, entry.handle, "file", fullName, entry.fileName));
                    }
                }
            }
        }
        catch (e) {
            if (e.payload?.nfsErrorCode === NFS3ERR_NOENT ||
                e.payload?.nfsErrorCode === NFS3ERR_NOTDIR ||
                e.payload?.nfsErrorCode === NFS3ERR_STALE) {
                throw new NotFoundError();
            }
            throw e;
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
    async getDirectoryHandle(name, options) {
        return new Promise(async (resolve, reject) => {
            try {
                PreNameCheck(name);
                const fh = nfsComponent.lookup(this._mount, this._fh, name);
                const attr = nfsComponent.getattr(this._mount, fh);
                if (attr.attrType !== AttrTypeDirectory) {
                    return reject(new TypeMismatchError());
                }
                return resolve(new NfsDirectoryHandle(new NfsHandle(this._mount, this._fh, fh, "directory", this._fullName + name + "/", name)));
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
                const mode = 0o775;
                const fh = nfsComponent.mkdir(this._mount, this._fh, name, mode);
                return resolve(new NfsDirectoryHandle(new NfsHandle(this._mount, this._fh, fh, "directory", this._fullName + name + "/", name)));
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
                const fh = nfsComponent.lookup(this._mount, this._fh, name);
                const attr = nfsComponent.getattr(this._mount, fh);
                if (attr.attrType === AttrTypeDirectory) {
                    return reject(new TypeMismatchError());
                }
                return resolve(new NfsFileHandle(new NfsHandle(this._mount, this._fh, fh, "file", this._fullName + name, name)));
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
                nfsComponent.create(this._mount, this._fh, name, mode); // XXX: ignore returned file handle and obtain one via lookup instead - workaround for go-nfs bug
                const fh = nfsComponent.lookup(this._mount, this._fh, name);
                return resolve(new NfsFileHandle(new NfsHandle(this._mount, this._fh, fh, "file", this._fullName + name, name)));
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
                const fh = nfsComponent.lookup(this._mount, this._fh, name);
                const attr = nfsComponent.getattr(this._mount, fh);
                if (attr.attrType === AttrTypeDirectory) {
                    this.removeDirectory(fh, this._fh, name, !!options?.recursive);
                }
                else {
                    nfsComponent.remove(this._mount, this._fh, name);
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
            const entries = nfsComponent.readdirplus(this._mount, fh);
            for (const entry of entries) {
                if (entry.fileName !== "." && entry.fileName !== "..") {
                    if (entry.attr?.attrType === AttrTypeDirectory) {
                        this.removeDirectory(entry.handle, fh, entry.fileName, recursive);
                    }
                    else {
                        nfsComponent.remove(this._mount, fh, entry.fileName);
                    }
                }
            }
        }
        nfsComponent.rmdir(this._mount, parent, name);
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
        super(toWrap._mount, toWrap._fhDir, toWrap._fh, toWrap.kind, toWrap._fullName, toWrap.name);
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
        const attr = nfsComponent.getattr(mount, fh);
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
            const chunk = nfsComponent.read(this._mount, this._fh, BigInt(pos), count);
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
            const chunk = nfsComponent.read(this._mount, this._fh, BigInt(pos), count);
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
        return new Promise(async (resolve) => resolve(this._data));
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
        this._fhTmp = nfsComponent.create(mount, this._fhDir, this._fileNameTmp, 0o664);
        this._keepExisting = !!options?.keepExistingData;
        this._valid = true;
        this._locked = false;
        this._orgSize = Number(nfsComponent.getattr(mount, fh).filesize);
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
            const contents = nfsComponent.read(this._mount, fhFrom, pos, count);
            nfsComponent.write(this._mount, fhTo, pos, contents);
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
                buffer = encoder.encode(data.toString());
            }
            else {
                const encoder = new TextEncoder();
                buffer = encoder.encode(data);
            }
            try {
                this.ensureExistingIfToBeKept();
                nfsComponent.write(this._mount, this._fhTmp, BigInt(this._position), new Uint8Array(buffer));
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
                nfsComponent.setattr(this._mount, this._fhTmp, undefined, undefined, undefined, undefined, BigInt(size), undefined, undefined);
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
                    nfsComponent.rename(this._mount, this._fhDir, this._fileNameTmp, this._fhDir, this._fileName);
                }
                else {
                    nfsComponent.remove(this._mount, this._fhDir, this._fileNameTmp);
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
                nfsComponent.remove(this._mount, this._fhDir, this._fileNameTmp);
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