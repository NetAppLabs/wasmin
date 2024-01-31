import { FileSystemFileHandle, Statable } from "@wasmin/fs-js";
import { SystemError } from "./errors.js";
import { TextDecoderWrapper } from "./utils.js";
import { Handle, Readable, Writable } from "./wasiFileSystem.js";
import {
    Errno,
    ErrnoN,
    Filestat,
    FiletypeN,
    Iovec,
    mutptr,
    ptr,
    RightsN,
    Size,
    string,
} from "./wasi_snapshot_preview1/bindings.js";


declare let globalThis: any;
if (!globalThis.WASI_DEBUG) {
    globalThis.WASI_DEBUG = false;
}
if (!globalThis.WASI_CALL_DEBUG) {
    globalThis.WASI_CALL_DEBUG = false;
}
if (!globalThis.WASI_FD_DEBUG) {
    globalThis.WASI_FD_DEBUG = false;
}
if (!globalThis.WASI_RESOURCE_DEBUG) {
    globalThis.WASI_RESOURCE_DEBUG = false;
}

export function wasiWarn(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiResourceDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_RESOURCE_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiCallDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_CALL_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function wasiError(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_DEBUG) {
        console.error(msg, ...optionalParams);
        if (msg instanceof Error) {
            const e = msg as Error;
            console.error(e.name);
            console.error(e.message);
            console.error(e.cause);
            console.error(e.stack);
        }
    }
}

export function wasiFdDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_FD_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface In {
    read(len: number): Uint8Array | Promise<Uint8Array>;
}

export interface Out {
    write(data: Uint8Array): void | Promise<void>;
}

export const stringOut = (writeStr: (chunk: string) => void): Out => {
    const decoder = new TextDecoderWrapper();

    return {
        write: (data) => {
            writeStr(decoder.decode(data, { stream: true }));
        },
    };
};

export const lineOut = (writeLn: (chunk: string) => void): Out => {
    let lineBuf = "";

    return stringOut((chunk) => {
        lineBuf += chunk;
        const lines = lineBuf.split("\n");
        lineBuf = lines.pop()!;
        for (const line of lines) {
            writeLn(line);
        }
    });
};

export const bufferIn = (buffer: Uint8Array): In => {
    return {
        read: (len) => {
            const chunk = buffer.subarray(0, len);
            buffer = buffer.subarray(len);
            return chunk;
        },
    };
};

export async function populateFileStat(buffer: ArrayBuffer, handle: Handle, filestat_ptr: ptr<Filestat>) {
    wasiDebug("populateFileStat:");
    const isFile: boolean = (handle as any).getFile;

    let inode = 0n;
    let size = 0n;
    let ctime = 0n;
    let mtime = 0n;
    let atime = 0n;

    if ((handle as any).stat) {
        const statable = handle as unknown as Statable;
        const s = await statable.stat();
        const got_inode = s.inode;
        if (got_inode) {
            inode = got_inode;
        }
        const creationTime = s.creationTime;
        ctime = creationTime;
        mtime = s.modifiedTime;
        atime = s.accessedTime;
        size = s.size;
    } else if (isFile) {
        const fhandle = handle as unknown as FileSystemFileHandle;
        const file = await fhandle.getFile();
        size = BigInt(file.size);
        ctime = BigInt(file.lastModified) * 1_000_000n;
        mtime = ctime;
        atime = ctime;
    }

    const newFstat: Filestat = {
        dev: 0n,
        ino: inode,
        filetype: isFile ? FiletypeN.REGULAR_FILE : FiletypeN.DIRECTORY,
        nlink: 0n,
        size,
        atim: atime,
        mtim: mtime,
        ctim: ctime,
    };
    wasiDebug("populateFileStat: newFstat: ", newFstat);
    Filestat.set(buffer, filestat_ptr, newFstat);
}

function copyUint8Array(data: Uint8Array) {
    const size = data.length;
    const newBuf = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        newBuf[i] = data[i];
    }
    return newBuf;
}

export async function forEachIoVec(
    buffer: ArrayBuffer,
    iovsPtr: ptr<Iovec>,
    iovsLen: number,
    handledPtr: ptr<number>,
    cb: (buf: Uint8Array) => Promise<number>,
    checkAbort: () => void
) {
    let totalHandled = 0;
    for (let i = 0; i < iovsLen; i++) {
        const iovec = Iovec.get(buffer, iovsPtr);
        wasiDebug(`iovec.bufLen ${iovec.buf_len}`);
        const buf = new Uint8Array(buffer, iovec.buf, iovec.buf_len);
        const handled = await cb(buf);

        if (checkAbort) {
            checkAbort();
        }
        totalHandled += handled;
        if (handled < iovec.buf_len) {
            break;
        }
        iovsPtr = (iovsPtr + Iovec.size) as ptr<Iovec>;
    }
    Size.set(buffer, handledPtr, totalHandled);
}

export class ExitStatus extends Error {
    constructor(public code: number, public isExitStatus = true, public cause = undefined) {
        super(cause);
        this.name = "ExitStatus";
        this.message = "ExitStatus:" + code;
    }
}

export function isExitStatus(err: any) {
    if (err) {
        if (err instanceof ExitStatus) {
            return true;
        } else {
            if (err.isExitStatus) {
                return true;
            } else if (err.message) {
                const msg = err.message;
                if (msg.startsWith("ExitStatus:")) {
                    // This case if ExitStatus has been serialized/deserialized
                    const codes = msg.split("ExitStatus:");
                    const scode = codes[1];
                    const code = Number(scode);
                    err.code = code;
                    return true;
                }
            }
        }
    }
    return false;
}

export class CStringArray {
    constructor(strings: string[]) {
        this._offsets = new Uint32Array(strings.length);
        this._buffer = "";

        for (const [i, s] of strings.entries()) {
            this._offsets[i] = this._buffer.length;
            this._buffer += `${s}\0`;
        }
    }

    private readonly _offsets: Uint32Array;
    private readonly _buffer: string;

    sizes_get(buf: ArrayBuffer, countPtr: ptr<number>, sizePtr: ptr<number>) {
        Size.set(buf, countPtr, this._offsets.length);
        Size.set(buf, sizePtr, this._buffer.length);
    }

    //get(buf: ArrayBuffer, offsetsPtr: ptr<Uint32Array>, ptr: ptr<string>) {
    get(buf: ArrayBuffer, offsetsPtr: mutptr<mutptr<number>>, ptr: mutptr<number>) {
        new Uint32Array(buf, offsetsPtr, this._offsets.length).set(this._offsets.map((offset) => ptr + offset));
        //TODO fix:
        const sptr = ptr as unknown as ptr<string>;
        string.set(buf, sptr, this._buffer);
    }
}

export function parseCStringArray(cStringArray: string): string[] {
    if (cStringArray == "") {
        // if string is empty return empty array
        const s: string[] = [];
        return s;
    } else {
        const s: string[] = cStringArray.split("\0");
        return s;
    }
}

export function unimplemented(msg?: string) {
    console.error("[unimplemented] ", msg);
    throw new SystemError(ErrnoN.NOSYS);
}

export interface ErrorHandler {
    handleError(err: any): number;
}

export class ErrorHandlerTranslator implements ErrorHandler {
    handleError(err: any): number {
        return translateErrorToErrorno(err);
    }
}

export function translateErrorToErrorno(err: any): Errno {
    wasiError(`translateErrorToErrorno: error: `, err);

    if (isExitStatus(err)) {
        wasiError(`translateErrorToErrorno: ExitStatus: `, err);
        // forward throw ExitStatus because we want to exit out of the program loop
        throw err;
    }
    if (err instanceof SystemError) {
        // Warn about any error except the one we always expect.
        if (!err.ignore) {
            const msg = err.message;
            wasiError(`translateErrorToErrorno: SystemError ${msg}`);
            wasiError(err);
        }
        const errCode = err.code as Errno;
        return errCode;
    }
    if (err instanceof Error) {
        let code;
        switch (err.name) {
            case "NotFoundError":
                code = ErrnoN.NOENT;
                break;
            case "NotAllowedError":
            case "DataCloneError":
            case "SecurityError":
                code = ErrnoN.ACCES;
                break;
            case "InvalidModificationError":
                code = ErrnoN.NOTEMPTY;
                break;
            case "AbortError":
                code = ErrnoN.CANCELED;
                break;
        }
        if (code) {
            wasiError(`translateErrorToErrorno: code: ${code} : `, err);
            return code;
        }
    } else if (err instanceof TypeError || err instanceof RangeError) {
        const msg = err.message;
        wasiError(`translateErrorToErrorno: TypeError||RangeError: ${msg} :`, err);
        return ErrnoN.INVAL;
    }
    wasiError("translateErrorToErrorno: Uknownerror: ", err);
    return ErrnoN.INVAL;
}

export function isNodeorBunorDeno() {
    if (isDeno()) {
        return true;
    } else {
        return isNodeorBun();
    }
}

export function isNodeorBun() {
    return globalThis.process != null;
}

export function isNode() {
    // only node.js or bun has global process class
    if (!isBun()) {
        return globalThis.process != null;
    } else {
        return false;
    }
}

export function copyBuffer(src: ArrayBufferLike, dst: ArrayBufferLike) {
    const srcBytes = new Uint8Array(src);
    const size = src.byteLength;
    const view = new DataView(dst);
    for (let i = 0; i < size; i++) {
        view.setUint8(i, srcBytes[i]);
    }
}

export function isBun() {
    // only bun has global Bun
    try {
        // @ts-ignore
        return globalThis.Bun != null;
    } catch (e) {
        return false;
    }
}

export function isDeno() {
    // only deno has global Deno
    try {
        // @ts-ignore
        return globalThis.Deno != null;
    } catch (e) {
        return false;
    }
}

export const RIGHTS_ALL =
    RightsN.FD_ADVISE |
    RightsN.FD_ALLOCATE |
    RightsN.FD_DATASYNC |
    RightsN.FD_FDSTAT_SET_FLAGS |
    RightsN.FD_FILESTAT_GET |
    RightsN.FD_FILESTAT_SET_SIZE |
    RightsN.FD_FILESTAT_SET_TIMES |
    RightsN.FD_READ |
    RightsN.FD_READDIR |
    RightsN.FD_SEEK |
    RightsN.FD_SYNC |
    RightsN.FD_TELL |
    RightsN.FD_WRITE |
    RightsN.PATH_CREATE_DIRECTORY |
    RightsN.PATH_CREATE_FILE |
    RightsN.PATH_FILESTAT_GET |
    RightsN.PATH_FILESTAT_SET_SIZE |
    RightsN.PATH_FILESTAT_SET_TIMES |
    RightsN.PATH_LINK_SOURCE |
    RightsN.PATH_LINK_TARGET |
    RightsN.PATH_OPEN |
    RightsN.PATH_READLINK |
    RightsN.PATH_REMOVE_DIRECTORY |
    RightsN.PATH_RENAME_SOURCE |
    RightsN.PATH_RENAME_TARGET |
    RightsN.PATH_SYMLINK |
    RightsN.PATH_UNLINK_FILE |
    RightsN.POLL_FD_READWRITE |
    RightsN.SOCK_ACCEPT |
    RightsN.SOCK_SHUTDOWN;

export const RIGHTS_DIRECTORY_BASE =
    RightsN.PATH_CREATE_DIRECTORY |
    RightsN.PATH_CREATE_FILE |
    RightsN.PATH_FILESTAT_GET |
    RightsN.PATH_FILESTAT_SET_SIZE |
    RightsN.PATH_FILESTAT_SET_TIMES |
    RightsN.PATH_LINK_SOURCE |
    RightsN.PATH_LINK_TARGET |
    RightsN.PATH_OPEN |
    RightsN.PATH_READLINK |
    RightsN.PATH_REMOVE_DIRECTORY |
    RightsN.PATH_RENAME_SOURCE |
    RightsN.PATH_RENAME_TARGET |
    RightsN.PATH_SYMLINK |
    RightsN.PATH_UNLINK_FILE |
    RightsN.FD_READDIR;

export const RIGHTS_FILE_BASE =
    RightsN.FD_READ |
    RightsN.FD_SEEK |
    RightsN.FD_WRITE |
    RightsN.FD_FILESTAT_GET |
    RightsN.FD_ADVISE |
    RightsN.FD_ALLOCATE |
    RightsN.FD_DATASYNC |
    RightsN.FD_FDSTAT_SET_FLAGS |
    RightsN.FD_FILESTAT_SET_SIZE |
    RightsN.FD_FILESTAT_SET_TIMES |
    RightsN.FD_SYNC |
    RightsN.FD_TELL;

export const RIGHTS_DIRECTORY_INHERITING = RIGHTS_DIRECTORY_BASE | RIGHTS_FILE_BASE;

export const RIGHTS_STDIN_BASE = RightsN.FD_READ | RightsN.FD_FILESTAT_GET | RightsN.POLL_FD_READWRITE;

/*
export const RIGHTS_STDOUT_BASE =
    RightsN.FD_FDSTAT_SET_FLAGS | RightsN.FD_WRITE | RightsN.FD_FILESTAT_GET | RightsN.POLL_FD_READWRITE;
*/
/*
export const RIGHTS_STDOUT_BASE =
    RightsN.FD_DATASYNC | RightsN.FD_READ | RightsN.FD_FDSTAT_SET_FLAGS | RightsN.FD_SYNC | RightsN.FD_WRITE | RightsN.FD_ADVISE | RightsN.FD_ALLOCATE | RightsN.FD_FILESTAT_GET | RightsN.FD_FILESTAT_SET_SIZE | RightsN.FD_FILESTAT_SET_TIMES | RightsN.POLL_FD_READWRITE;
*/

//
// TODO: FD_SEEK should not really be here
// but some tests fail when it is missing
//
export const RIGHTS_STDOUT_BASE =
    RightsN.FD_ADVISE |
    RightsN.FD_ALLOCATE |
    RightsN.FD_DATASYNC |
    RightsN.FD_FDSTAT_SET_FLAGS |
    RightsN.FD_FILESTAT_GET |
    RightsN.FD_FILESTAT_SET_SIZE |
    RightsN.FD_FILESTAT_SET_TIMES |
    RightsN.FD_READ |
    RightsN.FD_READDIR |
    RightsN.FD_SEEK |
    RightsN.FD_SYNC |
    RightsN.FD_WRITE |
    RightsN.POLL_FD_READWRITE;

export const RIGHTS_CHARACTER_DEVICE_BASE = RIGHTS_STDIN_BASE | RIGHTS_STDOUT_BASE;
