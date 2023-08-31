import { isTypedArray } from 'util/types';
import { instantiate } from './nfs_rs';
import { WASIWorker } from '@wasm-env/wasi-js';
import { NFileSystemWritableFileStream, PreNameCheck, InvalidModificationError, NotFoundError, SyntaxError, TypeMismatchError } from '@wasm-env/fs-js';
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
function fullNameFromReaddirplusEntry(parentName, entry) {
    const suffix = (entry.attr && entry.attr.attrType === AttrTypeDirectory) ? '/' : '';
    return parentName + entry.fileName + suffix;
}
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
let _fs;
async function fetchCompile(url) {
    if (isNode) {
        _fs = _fs || await import('fs/promises');
        return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
}
async function compileCore(url) {
    url = './' + url;
    return await fetchCompile(new URL(url, import.meta.url));
}
var nfs;
const wasi = new WASIWorker({});
await wasi.createWorker()
    .then((componentImports) => instantiate(compileCore, componentImports))
    .then((instance) => nfs = instance.nfs);
export class NfsHandle {
    _mount;
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
    constructor(mount, fh, kind, fullName, name) {
        this._mount = mount;
        this._fh = fh;
        this._fullName = fullName;
        this.kind = kind;
        this.name = name;
        this.isFile = kind == 'file';
        this.isDirectory = kind == 'directory';
    }
    isSameEntry(other) {
        return new Promise(async (resolve) => {
            const anyOther = other;
            if (anyOther._mount && anyOther._mount !== this._mount) {
                resolve(false);
            }
            else {
                resolve(other.kind === this.kind && other.name === this.name && (!anyOther._fullName || anyOther._fullName === this._fullName));
            }
        });
    }
    async queryPermission(perm) {
        return new Promise(async (resolve, reject) => {
            const mode = perm?.mode === 'readwrite' ? AccessReadWrite : AccessRead;
            const ret = nfs.access(this._mount, this._fh, mode);
            if (ret !== 0) {
                resolve(ret === mode ? 'granted' : 'denied');
            }
            else {
                reject('access denied');
            }
        });
    }
    async requestPermission(perm) {
        return new Promise(async (resolve, reject) => {
            const mode = perm.mode === 'readwrite' ? AccessReadWrite : AccessRead;
            try {
                nfs.setattr(this._mount, this._fh, null, mode, null, null, null, null, null);
                resolve('granted');
            }
            catch (e) {
                if (e.payload?.nfsErrorCode === NFS3ERR_PERM || e.payload?.nfsErrorCode === NFS3ERR_ACCES) {
                    resolve('denied');
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
        var mount;
        var fh;
        var kind;
        var fullName;
        var name;
        if (typeof param === 'string') {
            const url = param;
            mount = nfs.parseUrlAndMount(url);
            fh = nfs.lookup(mount, '/');
            kind = 'directory';
            fullName = '/';
            name = '';
        }
        else {
            const toWrap = param;
            mount = toWrap._mount;
            fh = toWrap._fh;
            kind = toWrap.kind;
            fullName = toWrap._fullName;
            name = toWrap.name;
        }
        super(mount, fh, kind, fullName, name);
        this[Symbol.asyncIterator] = this.entries;
        this.kind = 'directory';
        this.isFile = false;
        this.isDirectory = true;
        this.getFile = this.getFileHandle;
        this.getDirectory = this.getDirectoryHandle;
        this.getEntries = this.values;
    }
    async *entryHandles() {
        try {
            const entries = nfs.readdirplus(this._mount, this._fh);
            for (const entry of entries) {
                if (entry.fileName !== '.' && entry.fileName !== '..') {
                    const fullName = fullNameFromReaddirplusEntry(this._fullName, entry);
                    if (fullName.endsWith('/')) {
                        yield new NfsDirectoryHandle(new NfsHandle(this._mount, entry.handle, 'directory', fullName, entry.fileName));
                    }
                    else {
                        yield new NfsFileHandle(new NfsHandle(this._mount, entry.handle, 'file', fullName, entry.fileName));
                    }
                }
            }
        }
        catch (e) {
            if (e.payload?.nfsErrorCode === NFS3ERR_NOENT || e.payload?.nfsErrorCode === NFS3ERR_NOTDIR) {
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
                const fh = nfs.lookup(this._mount, this._fullName + name);
                const attr = nfs.getattr(this._mount, fh);
                if (attr.attrType !== AttrTypeDirectory) {
                    return reject(new TypeMismatchError());
                }
                return resolve(new NfsDirectoryHandle(new NfsHandle(this._mount, fh, 'directory', this._fullName + name + '/', name)));
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
                nfs.mkdir(this._mount, this._fh, name, mode);
                const fh = nfs.lookup(this._mount, this._fullName + name);
                // console.debug(`mkdir fhx: ${fhx} fh: ${fh}`);
                return resolve(new NfsDirectoryHandle(new NfsHandle(this._mount, fh, 'directory', this._fullName + name + '/', name)));
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
                const fh = nfs.lookup(this._mount, this._fullName + name);
                const attr = nfs.getattr(this._mount, fh);
                if (attr.attrType === AttrTypeDirectory) {
                    return reject(new TypeMismatchError());
                }
                return resolve(new NfsFileHandle(new NfsHandle(this._mount, fh, 'file', this._fullName + name, name)));
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
                nfs.create(this._mount, this._fh, name, mode);
                const fh = nfs.lookup(this._mount, this._fullName + name);
                // console.debug(`create fhx: ${fhx} fh: ${fh}`);
                return resolve(new NfsFileHandle(new NfsHandle(this._mount, fh, 'file', this._fullName + name, name)));
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
                const fh = nfs.lookup(this._mount, this._fullName + name);
                const attr = nfs.getattr(this._mount, fh);
                if (attr.attrType === AttrTypeDirectory) {
                    this.removeDirectory(fh, this._fh, name, !!options?.recursive);
                }
                else {
                    nfs.remove(this._mount, this._fh, name);
                }
                return resolve();
            }
            catch (e) {
                if (e.payload?.nfsErrorCode === NFS3ERR_NOENT) {
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
            const entries = nfs.readdirplus(this._mount, fh);
            for (const entry of entries) {
                if (entry.attr && entry.attr.attrType === AttrTypeDirectory) {
                    this.removeDirectory(entry.handle, fh, entry.fileName, recursive);
                }
                else if (entry.fileName !== '.' && entry.fileName !== '..') {
                    nfs.remove(this._mount, fh, entry.fileName);
                }
            }
        }
        nfs.rmdir(this._mount, parent, name);
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
                const ret = subentry.name.substring(1).split('/');
                ret.pop();
                return ret;
            }
            if (subentry.kind === 'directory') {
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
     * @deprecated Old property just for Chromium <=85. Use `.getFileHandle()` in the new API.
     */
    getFile;
    /**
    * @deprecated Old property just for Chromium <=85. Use `.getDirectoryHandle()` in the new API.
    */
    getDirectory;
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
        super(toWrap._mount, toWrap._fh, toWrap.kind, toWrap._fullName, toWrap.name);
        this.kind = 'file';
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
                if (e.payload?.nfsErrorCode === NFS3ERR_NOENT) {
                    return reject(new NotFoundError());
                }
                return reject(e);
            }
        });
    }
    async createWritable(options) {
        return new Promise(async (resolve, reject) => {
            try {
                const sink = new NfsSink(this._mount, this._fh, this._fullName, options);
                return resolve(new NFileSystemWritableFileStream(sink));
            }
            catch (e) {
                if (e.payload?.nfsErrorCode === NFS3ERR_NOENT) {
                    return reject(new NotFoundError());
                }
                return reject(e);
            }
        });
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
        const attr = nfs.getattr(mount, fh);
        this._mount = mount;
        this._fh = fh;
        this.lastModified = attr.mtime.seconds * 1000 + attr.mtime.nseconds / 1000;
        this.name = name;
        this.webkitRelativePath = name;
        this.size = Number(attr.filesize);
        this.type = 'unknown';
    }
    arrayBuffer() {
        return new Promise(async (resolve, reject) => {
            try {
                return resolve(nfs.read(this._mount, this._fh, 0n, this.size));
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    slice(start, end, contentType) {
        const offset = start ? BigInt(start) : 0n;
        const count = (end ? end : this.size) - Number(offset);
        const buf = nfs.read(this._mount, this._fh, offset, count);
        const blob = new NfsBlob(this._mount, this._fh, buf, contentType);
        return blob;
    }
    stream() {
        var pulled = false;
        const file = this;
        return new ReadableStream({
            type: 'bytes',
            pull(controller) {
                if (!pulled) {
                    const buf = nfs.read(file._mount, file._fh, 0n, file.size);
                    controller.enqueue(buf);
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
            const decoder = new TextDecoder('utf-8');
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
        this._mount = mount;
        this._fh = fh;
        this._data = data;
        this.size = data.byteLength;
        this.type = contentType || 'unknown';
    }
    arrayBuffer() {
        return new Promise(async (resolve) => resolve(this._data));
    }
    slice(start, end, contentType) {
        const blob = new NfsBlob(this._mount, this._fh, this._data.slice(start, end), contentType);
        return blob;
    }
    stream() {
        var pulled = false;
        const data = this._data;
        return new ReadableStream({
            type: 'bytes',
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
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(buf);
        });
    }
}
export class NfsSink {
    _mount;
    _fh;
    _fhTmp;
    _fullNameTmp;
    _keepExisting;
    _valid;
    _locked;
    _orgSize;
    _newSize;
    _position;
    constructor(mount, fh, fullName, options) {
        const x = fullName.lastIndexOf('/');
        const dirPath = fullName.slice(0, x + 1);
        const fileName = fullName.slice(x + 1);
        const fullNameTmp = dirPath + '.' + fileName + '-tmp' + Date.now();
        this._mount = mount;
        this._fh = fh;
        this._fhTmp = nfs.createPath(mount, fullNameTmp, 0o664);
        this._fullNameTmp = fullNameTmp;
        this._keepExisting = !!options?.keepExistingData;
        this._valid = true;
        this._locked = false;
        this._orgSize = Number(nfs.getattr(mount, fh).filesize);
        this._newSize = this._keepExisting ? this._orgSize : 0;
        this._position = 0;
    }
    get locked() {
        return this._locked;
    }
    copyContents(fhFrom, fhTo, size) {
        const contents = nfs.read(this._mount, fhFrom, 0n, size);
        nfs.write(this._mount, fhTo, 0n, contents);
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
                return reject(new TypeError('invalid stream'));
            }
            const anyData = data;
            if (anyData.type === 'seek') {
                if (!('position' in anyData) || typeof anyData.position !== 'number') {
                    return reject(new SyntaxError('seek requires a position argument'));
                }
                await this.seek(anyData.position)
                    .then(() => resolve())
                    .catch((e) => reject(e));
                return;
            }
            if (anyData.type === 'truncate') {
                if (!('size' in anyData) || typeof anyData.size !== 'number') {
                    return reject(new SyntaxError('truncate requires a size argument'));
                }
                await this.truncate(anyData.size)
                    .then(() => resolve())
                    .catch((e) => reject(e));
                return;
            }
            var buffer;
            if (anyData.type === 'write') {
                if (!('data' in anyData)) {
                    return reject(new SyntaxError('write requires a data argument'));
                }
                if ('position' in anyData) {
                    await this.seek(anyData.position);
                }
                data = anyData.data;
            }
            if (data instanceof ArrayBuffer) {
                buffer = data;
            }
            else if (isTypedArray(data)) {
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
                nfs.write(this._mount, this._fhTmp, BigInt(this._position), buffer);
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
                return reject(new TypeError('invalid stream'));
            }
            this._position = position;
            return resolve();
        });
    }
    async truncate(size) {
        return new Promise(async (resolve, reject) => {
            if (!this._valid) {
                return reject(new TypeError('invalid stream'));
            }
            try {
                this.ensureExistingIfToBeKept();
                nfs.setattr(this._mount, this._fhTmp, null, null, null, null, BigInt(size), null, null);
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
                return reject(new TypeError('invalid stream'));
            }
            try {
                if (!this._keepExisting) { // XXX: if this._keepExisting is still set, no writes or truncates have occurred
                    this.copyContents(this._fhTmp, this._fh, this._newSize);
                    const contents = nfs.read(this._mount, this._fhTmp, 0n, this._position);
                    nfs.write(this._mount, this._fh, 0n, contents);
                    if (this._newSize < this._orgSize) {
                        nfs.setattr(this._mount, this._fh, null, null, null, null, BigInt(this._newSize), null, null);
                    }
                }
                nfs.removePath(this._mount, this._fullNameTmp);
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
                return reject(new TypeError('invalid stream'));
            }
            try {
                nfs.removePath(this._mount, this._fullNameTmp);
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
            throw new TypeError('invalid stream');
        }
        if (this.locked) {
            throw new Error('Invalid state: WritableStream is locked');
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
export default (path) => new NfsDirectoryHandle(path);
