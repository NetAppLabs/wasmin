/*
 * This file was automatically generated by witx-codegen - Do not edit manually.
 */

import { TextDecoderWrapper } from "../utils.js";

// Pointer to target
export type ptr<T> = number & { _pointerTarget: T };
// Mutable pointer to target
export type mutptr<T> = ptr<T>;

// Type Definition for complex and simple types
export interface TypeDef<T> {
    size: number;
    align: number;

    get(buf: ArrayBuffer, ptr: ptr<T>): T;
    set(buf: ArrayBuffer, ptr: ptr<T>, value: T): void;
}
// Get target JS type of TypeDef
export type TargetType<D> = D extends TypeDef<infer T> ? T : never;

const getDataView = (() => {
    const cache = new WeakMap<ArrayBuffer, DataView>();

    return (buf: ArrayBuffer) => {
        let dataView = cache.get(buf);
        if (!dataView) {
            dataView = new DataView(buf);
            cache.set(buf, dataView);
        }
        return dataView;
    };
})();

// Function to get TypeDef for primitive JS types
function std<T = number>(name: string, size: number): TypeDef<T> {
    const get = (DataView.prototype as any)[`get${name}`];
    const set = (DataView.prototype as any)[`set${name}`];

    return {
        size,
        align: size,
        get(buf, ptr) {
            return get.call(getDataView(buf), ptr, true);
        },
        set(buf, ptr, value) {
            return set.call(getDataView(buf), ptr, value, true);
        },
    };
}

// Function for UTF-8 strings
export const string = (() => {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoderWrapper();

    return {
        get(buf: ArrayBuffer, ptr: ptr<string>, len: number): string {
            return textDecoder.decode(new Uint8Array(buf, ptr, len));
        },
        set(buf: ArrayBuffer, ptr: ptr<string>, value: string, len?: number | undefined) {
            if (len) {
                const { read } = textEncoder.encodeInto(value, new Uint8Array(buf, ptr, len));
                if (read! < value.length) {
                    throw new Error(`Insufficient space.`);
                }
            } else {
                // we don't know the string length beforehand
                const src = textEncoder.encode(value);
                len = src.byteLength;
                const dst = new Uint8Array(buf, ptr, len);
                dst.set(src);
            }
        },
    };
})();

function alignTo(ptr: number, align: number): number {
    const mismatch = ptr % align;
    if (mismatch) {
        ptr += align - mismatch;
    }
    return ptr;
}

// To construct TypeDef for structs
export function struct<T extends Record<string, TypeDef<any>>>(
    desc: T
): TypeDef<{ [K in keyof T]: T[K] extends TypeDef<infer F> ? F : never }> {
    class Ctor {
        constructor(protected _buf: ArrayBuffer, protected _ptr: number) {}
    }
    let offset = 0;
    let structAlign = 0;
    for (const name in desc) {
        const type = desc[name];
        const fieldAlign = type.align;
        structAlign = Math.max(structAlign, fieldAlign);
        offset = alignTo(offset, fieldAlign);
        const fieldOffset = offset;
        Object.defineProperty(Ctor.prototype, name, {
            get(this: Ctor) {
                return type.get(this._buf, (this._ptr + fieldOffset) as ptr<any>);
            },
            set(this: Ctor, value) {
                type.set(this._buf, (this._ptr + fieldOffset) as ptr<any>, value);
            },
        });
        offset += type.size;
    }
    offset = alignTo(offset, structAlign);
    return {
        size: offset,
        align: structAlign,
        get(buf, ptr) {
            return new Ctor(buf, ptr) as any;
        },
        set(buf, ptr, value) {
            Object.assign(new Ctor(buf, ptr), value);
        },
    };
}

// To construct TypeDef for taggedUnion
export function taggedUnion<E extends number, T extends Record<E, TypeDef<any>>>({
    tag: tagDesc,
    data: dataDesc,
}: {
    tag: TypeDef<E>;
    data: T;
}): TypeDef<
    {
        [K in E]: { tag: K; data: T[K] extends TypeDef<infer F> ? F : never };
    }[E]
> {
    let unionSize = 0;
    let unionAlign = 0;
    for (const key in dataDesc) {
        const { size, align } = dataDesc[key];
        unionSize = Math.max(unionSize, size);
        unionAlign = Math.max(unionAlign, align);
    }
    unionSize = alignTo(unionSize, unionAlign);
    const unionOffset = alignTo(tagDesc.size, unionAlign);
    const totalAlign = Math.max(tagDesc.align, unionAlign);
    const totalSize = alignTo(unionOffset + unionSize, totalAlign);
    return {
        size: totalSize,
        align: totalAlign,
        get(buf, ptr) {
            const tag = tagDesc.get(buf, ptr as ptr<any>);
            return {
                tag,
                data: dataDesc[tag].get(buf, (ptr + unionOffset) as ptr<any>),
            };
        },
        set(buf, ptr, value) {
            tagDesc.set(buf, ptr as ptr<any>, value.tag);
            dataDesc[value.tag].set(buf, (ptr + unionOffset) as ptr<any>, value.data);
        },
    };
}

// To construct TypeDef for enum
export function enumer<E extends number>(base: TypeDef<number>): TypeDef<E> {
    // All the properties are same as for the underlying number, this wrapper is only useful at typechecking level.
    return base as TypeDef<E>;
}

export const i8 = std("Int8", 1);
export type i8 = number;
export const u8 = std("Uint8", 1);
export type u8 = number;
export const i16 = std("Int16", 2);
export type i16 = number;
export const u16 = std("Uint16", 2);
export type u16 = number;
export const i32 = std("Int32", 4);
export type i32 = number;
export const u32 = std("Uint32", 4);
export type u32 = number;
export const usize = std("Uint32", 4);
export type usize = number;
export const i64 = std<bigint>("bigint64", 8);
export type i64 = bigint;
export const u64 = std<bigint>("BigUint64", 8);
export type u64 = bigint;

export const Handle = i32;
export type Handle = TargetType<typeof Handle>;
export const Char8 = u8;
export type Char8 = TargetType<typeof Char8>;
export const Char32 = u32;
export type Char32 = TargetType<typeof Char32>;

export type WasiStringBytesPtr = ptr<Char8>;

export type WasiMutSlice<T> = usize;
export type WasiSlice<T> = usize;

/*
 * ---------------------- Module: [wasi_experimental_sockets] ----------------------
 */

/**
 * A file descriptor handle.
 */
export const Fd = Handle;
export type Fd = TargetType<typeof Handle>;

/**
 * A file descriptor handle.
 */
export const Size = u32;
export type Size = TargetType<typeof u32>;

/**
 * Error codes returned by functions.
 * Not all of these error codes are returned by the functions provided by this
 * API; some are used in higher-level library layers, and others are provided
 * merely for alignment with POSIX.
 */
export const Errno = enumer<ErrnoN>(u16);
export type Errno = TargetType<typeof Errno>;

export const enum ErrnoN {
    /**
     * No error occurred. System call completed successfully.
     */
    SUCCESS = 0,
    /**
     * Argument list too long.
     */
    TOOBIG = 1,
    /**
     * Permission denied.
     */
    ACCESS = 2,
    /**
     * Address in use.
     */
    ADDRINUSE = 3,
    /**
     * Address not available.
     */
    ADDRNOTAVAIL = 4,
    /**
     * Address family not supported.
     */
    AFNOSUPPORT = 5,
    /**
     * Resource unavailable, or operation would block.
     */
    AGAIN = 6,
    /**
     * Connection already in progress.
     */
    ALREADY = 7,
    /**
     * Bad file descriptor.
     */
    BADF = 8,
    /**
     * Bad message.
     */
    BADMSG = 9,
    /**
     * Device or resource busy.
     */
    BUSY = 10,
    /**
     * Operation canceled.
     */
    CANCELED = 11,
    /**
     * No child processes.
     */
    CHILD = 12,
    /**
     * Connection aborted.
     */
    CONNABORTED = 13,
    /**
     * Connection refused.
     */
    CONNREFUSED = 14,
    /**
     * Connection reset.
     */
    CONNRESET = 15,
    /**
     * Resource deadlock would occur.
     */
    DEADLK = 16,
    /**
     * Destination address required.
     */
    DESTADDRREQ = 17,
    /**
     * Mathematics argument out of domain of function.
     */
    DOM = 18,
    /**
     * Reserved.
     */
    DQUOT = 19,
    /**
     * File exists.
     */
    EXIST = 20,
    /**
     * Bad address.
     */
    FAULT = 21,
    /**
     * File too large.
     */
    FBIG = 22,
    /**
     * Host is unreachable.
     */
    HOSTUNREACH = 23,
    /**
     * Identifier removed.
     */
    IDRM = 24,
    /**
     * Illegal byte sequence.
     */
    ILSEQ = 25,
    /**
     * Operation in progress.
     */
    INPROGRESS = 26,
    /**
     * Interrupted function.
     */
    INTR = 27,
    /**
     * Invalid argument.
     */
    INVAL = 28,
    /**
     * I/O error.
     */
    IO = 29,
    /**
     * Socket is connected.
     */
    ISCONN = 30,
    /**
     * Is a directory.
     */
    ISDIR = 31,
    /**
     * Too many levels of symbolic links.
     */
    LOOP = 32,
    /**
     * File descriptor value too large.
     */
    MFILE = 33,
    /**
     * Too many links.
     */
    MLINK = 34,
    /**
     * Message too large.
     */
    MSGSIZE = 35,
    /**
     * Reserved.
     */
    MULTIHOP = 36,
    /**
     * Filename too long.
     */
    NAMETOOLONG = 37,
    /**
     * Network is down.
     */
    NETDOWN = 38,
    /**
     * Connection aborted by network.
     */
    NETRESET = 39,
    /**
     * Network unreachable.
     */
    NETUNREACH = 40,
    /**
     * Too many files open in system.
     */
    NFILE = 41,
    /**
     * No buffer space available.
     */
    NOBUFS = 42,
    /**
     * No such device.
     */
    NODEV = 43,
    /**
     * No such file or directory.
     */
    NOENT = 44,
    /**
     * Executable file format error.
     */
    NOEXEC = 45,
    /**
     * No locks available.
     */
    NOLCK = 46,
    /**
     * Reserved.
     */
    NOLINK = 47,
    /**
     * Not enough space.
     */
    NOMEM = 48,
    /**
     * No message of the desired type.
     */
    NOMSG = 49,
    /**
     * Protocol not available.
     */
    NOPROTOOPT = 50,
    /**
     * No space left on device.
     */
    NOSPC = 51,
    /**
     * Function not supported.
     */
    NOSYS = 52,
    /**
     * The socket is not connected.
     */
    NOTCONN = 53,
    /**
     * Not a directory or a symbolic link to a directory.
     */
    NOTDIR = 54,
    /**
     * Directory not empty.
     */
    NOTEMPTY = 55,
    /**
     * State not recoverable.
     */
    NOTRECOVERABLE = 56,
    /**
     * Not a socket.
     */
    NOTSOCK = 57,
    /**
     * Not supported, or operation not supported on socket.
     */
    NOTSUP = 58,
    /**
     * Inappropriate I/O control operation.
     */
    NOTTY = 59,
    /**
     * No such device or address.
     */
    NXIO = 60,
    /**
     * Value too large to be stored in data type.
     */
    OVERFLOW = 61,
    /**
     * Previous owner died.
     */
    OWNERDEAD = 62,
    /**
     * Operation not permitted.
     */
    PERM = 63,
    /**
     * Broken pipe.
     */
    PIPE = 64,
    /**
     * Protocol error.
     */
    PROTO = 65,
    /**
     * Protocol not supported.
     */
    PROTONOSUPPORT = 66,
    /**
     * Protocol wrong type for socket.
     */
    PROTOTYPE = 67,
    /**
     * Result too large.
     */
    RANGE = 68,
    /**
     * Read-only file system.
     */
    ROFS = 69,
    /**
     * Invalid seek.
     */
    SPIPE = 70,
    /**
     * No such process.
     */
    SRCH = 71,
    /**
     * Reserved.
     */
    STALE = 72,
    /**
     * Connection timed out.
     */
    TIMEDOUT = 73,
    /**
     * Text file busy.
     */
    TXTBSY = 74,
    /**
     * Cross-device link.
     */
    XDEV = 75,
    /**
     * Extension: Capabilities insufficient.
     */
    NOTCAPABLE = 76,
}

export const Reuse = u8;
export type Reuse = TargetType<typeof u8>;

/**
 * Flags provided to `sock_recv`.
 */
export const Riflags = u16;
export type Riflags = TargetType<typeof u16>;

export const RiflagsN = {
    /**
     * Returns the message without removing it from the socket's receive queue.
     */
    RECV_PEEK: 1,
    /**
     * On byte-stream sockets, block until the full amount of data can be returned.
     */
    RECV_WAITALL: 2,
};

/**
 * Flags returned by `sock_recv`.
 */
export const Roflags = u16;
export type Roflags = TargetType<typeof u16>;

export const RoflagsN = {
    /**
     * Returned by `sock_recv`: Message data has been truncated.
     */
    RECV_DATA_TRUNCATED: 1,
};

/**
 * Address family
 */
export const AddressFamily = enumer<AddressFamilyN>(u8);
export type AddressFamily = TargetType<typeof AddressFamily>;

export const enum AddressFamilyN {
    /**
     * Internet version 4 addresses
     */
    INET_4 = 0,
    /**
     * Internet version 6 addresses
     */
    INET_6 = 1,
}

/**
 * Socket type
 */
export const SockType = enumer<SockTypeN>(u8);
export type SockType = TargetType<typeof SockType>;

export const enum SockTypeN {
    /**
     * The file descriptor or file refers to a datagram socket.
     */
    SOCKET_DGRAM = 0,
    /**
     * The file descriptor or file refers to a byte-stream socket.
     */
    SOCKET_STREAM = 1,
}

/**
 * IP port number
 */
export const IpPort = u16;
export type IpPort = TargetType<typeof u16>;

/**
 * Address type
 */
export const AddrType = enumer<AddrTypeN>(u8);
export type AddrType = TargetType<typeof AddrType>;

export const enum AddrTypeN {
    /**
     * IPv4 address
     */
    IP_4 = 0,
    /**
     * IPv6 address
     */
    IP_6 = 1,
}

/**
 * An IPv4 address is a 32-bit number that uniquely identifies a network interface on a machine.
 */
export const AddrIp4 = struct({
    n_0: u8,
    n_1: u8,
    h_0: u8,
    h_1: u8,
});
export type AddrIp4 = TargetType<typeof AddrIp4>;

/**
 * An IPv4 address with a port number
 */
export const AddrIp4Port = struct({
    addr: AddrIp4,
    port: IpPort,
});
export type AddrIp4Port = TargetType<typeof AddrIp4Port>;

/**
 * An IPv6 address is a 128-bit number that uniquely identifies a network interface on a machine.
 */
export const AddrIp6 = struct({
    n_0: u16,
    n_1: u16,
    n_2: u16,
    n_3: u16,
    h_0: u16,
    h_1: u16,
    h_2: u16,
    h_3: u16,
});
export type AddrIp6 = TargetType<typeof AddrIp6>;

/**
 * An IPv6 address with a port number
 */
export const AddrIp6Port = struct({
    addr: AddrIp6,
    port: IpPort,
});
export type AddrIp6Port = TargetType<typeof AddrIp6Port>;

/**
 * Union of all possible addresses type
 */
export const Addr = taggedUnion({
    tag: AddrType,
    data: {
        [AddrTypeN.IP_4]: AddrIp4Port,
        [AddrTypeN.IP_6]: AddrIp6Port,
    },
});
export type Addr = TargetType<typeof Addr>;

/**
 * Flags provided to `sock_send`. As there are currently no flags
 * defined, it must be set to zero.
 */
export const Siflags = u16;
export type Siflags = TargetType<typeof u16>;

/**
 * Which channels on a socket to shut down.
 */
export const Sdflags = u8;
export type Sdflags = TargetType<typeof u8>;

export const SdflagsN = {
    /**
     * Disables further receive operations.
     */
    RD: 1,
    /**
     * Disables further send operations.
     */
    WR: 2,
};

export interface WasiExperimentalSocketsAsync {
    /**
     * Resolves a hostname and a port to one or more IP addresses. Port is optional
     * and you can pass 0 (zero) in most cases, it is used a hint for protocol.
     *
     * Note: This is similar to `getaddrinfo` in POSIX
     *
     * When successful, the contents of the output buffer consist of a sequence of
     * IPv4 and/or IPv6 addresses. Each address entry consists of a addr_t object.
     * This function fills the output buffer as much as possible, potentially
     * truncating the last address entry. It is advisable that the buffer is
     */
    addrResolve(
        host_ptr: ptr<string>,
        host_len: usize,
        port: IpPort,
        buf: mutptr<u8>,
        buf_len: Size,
        result_ptr: mutptr<Size>
    ): Promise<Errno>;

    /**
     * Returns the local address to which the socket is bound.
     *
     * Note: This is similar to `getsockname` in POSIX
     *
     * When successful, the contents of the output buffer consist of an IP address,
     * either IP4 or IP6.
     */
    sockAddrLocal(fd: Fd, buf: mutptr<u8>, buf_len: Size): Promise<Errno>;

    /**
     * Returns the remote address to which the socket is connected to.
     *
     * Note: This is similar to `getpeername` in POSIX
     *
     * When successful, the contents of the output buffer consist of an IP address,
     * either IP4 or IP6.
     */
    sockAddrRemote(fd: Fd, buf: mutptr<u8>, buf_len: Size): Promise<Errno>;

    /**
     * Open a socket
     *
     * Note: This is similar to `socket` in POSIX using PF_INET
     */
    sockOpen(af: AddressFamily, socktype: SockType, result_ptr: mutptr<Fd>): Promise<Errno>;

    /**
     * Close a socket (this is an alias for `fd_close`)
     * Note: This is similar to `close` in POSIX.
     */
    sockClose(fd: Fd): Promise<Errno>;

    /**
     * Enable/disable address reuse on a socket
     * Note: This is similar to `setsockopt` in POSIX for SO_REUSEADDR
     */
    sockSetReuseAddr(fd: Fd, reuse: Reuse): Promise<Errno>;

    /**
     * Retrieve status of address reuse on a socket
     * Note: This is similar to `getsockopt` in POSIX for SO_REUSEADDR
     */
    sockGetReuseAddr(fd: Fd, result_ptr: mutptr<Reuse>): Promise<Errno>;

    /**
     * Enable port reuse on a socket
     * Note: This is similar to `setsockopt` in POSIX for SO_REUSEPORT
     */
    sockSetReusePort(fd: Fd, reuse: Reuse): Promise<Errno>;

    /**
     * Retrieve status of port reuse on a socket
     * Note: This is similar to `getsockopt` in POSIX for SO_REUSEPORT
     */
    sockGetReusePort(fd: Fd, result_ptr: mutptr<Reuse>): Promise<Errno>;

    /**
     * Set size of receive buffer
     * Note: This is similar to `setsockopt` in POSIX for SO_RCVBUF
     */
    sockSetRecvBufSize(fd: Fd, size: Size): Promise<Errno>;

    /**
     * Retrieve the size of the receive buffer
     * Note: This is similar to `getsockopt` in POSIX for SO_RCVBUF
     */
    sockGetRecvBufSize(fd: Fd, result_ptr: mutptr<Size>): Promise<Errno>;

    /**
     * Set size of send buffer
     * Note: This is similar to `setsockopt` in POSIX for SO_SNDBUF
     */
    sockSetSendBufSize(fd: Fd, size: Size): Promise<Errno>;

    /**
     * Retrieve the size of the send buffer
     * Note: This is similar to `getsockopt` in POSIX for SO_SNDBUF
     */
    sockGetSendBufSize(fd: Fd, result_ptr: mutptr<Size>): Promise<Errno>;

    /**
     * Bind a socket
     * Note: This is similar to `bind` in POSIX using PF_INET
     */
    sockBind(fd: Fd, addr: mutptr<Addr>): Promise<Errno>;

    /**
     * Listen for connections on a socket
     * Note: This is similar to `listen`
     */
    sockListen(fd: Fd, backlog: Size): Promise<Errno>;

    /**
     * Accept a connection on a socket
     * Note: This is similar to `accept`
     */
    sockAccept(fd: Fd, result_ptr: mutptr<Fd>): Promise<Errno>;

    /**
     * Initiate a connection on a socket to the specified address
     * Note: This is similar to `connect` in POSIX
     */
    sockConnect(fd: Fd, addr: mutptr<Addr>): Promise<Errno>;

    /**
     * Receive a message from a socket.
     * Note: This is similar to `recv` in POSIX.
     */
    sockRecv(fd: Fd, buf: mutptr<u8>, buf_len: Size, flags: Riflags, result_ptr: mutptr<Size>): Promise<Errno>;

    /**
     * Receive a message from a socket.
     *
     * The address buffer must be at least the size of addr_t.
     *
     * Note: This is similar to `recvfrom` in POSIX.
     */
    sockRecvFrom(
        fd: Fd,
        buf: mutptr<u8>,
        buf_len: Size,
        addr_buf: mutptr<u8>,
        addr_buf_len: Size,
        flags: Riflags,
        result_ptr: mutptr<Size>
    ): Promise<Errno>;

    /**
     * Send a message on a socket.
     * Note: This is similar to `send` in POSIX.
     */
    sockSend(fd: Fd, buf: mutptr<u8>, buf_len: Size, flags: Siflags, result_ptr: mutptr<Size>): Promise<Errno>;

    /**
     * Send a message on a socket.
     * Note: This is similar to `sendto` in POSIX.
     */
    sockSendTo(
        fd: Fd,
        buf: mutptr<u8>,
        buf_len: Size,
        addr: mutptr<Addr>,
        flags: Siflags,
        result_ptr: mutptr<Size>
    ): Promise<Errno>;

    /**
     * Shut down socket send and receive channels.
     * Note: This is similar to `shutdown` in POSIX.
     */
    sockShutdown(fd: Fd, how: Sdflags): Promise<Errno>;
}

export interface WasiExperimentalSocketsHandler {
    getExport(name: string): WebAssembly.ExportValue;
    handleError(err: any): number;
    checkAbort(): void;
}

export function addWasiExperimentalSocketsToImports(
    importsNS: string,
    imports: any,
    obj: WasiExperimentalSocketsAsync,
    handler: WasiExperimentalSocketsHandler
): void {
    if (!(importsNS in imports)) imports[importsNS] = {};
    imports[importsNS]["addr_resolve"] = async function (
        _host_ptr: any,
        _host_len: any,
        _port: any,
        _buf: any,
        _buf_len: any,
        _result_ptr: any
    ) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.addrResolve(_host_ptr, _host_len, _port, _buf, _buf_len, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_addr_local"] = async function (_fd: any, _buf: any, _buf_len: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockAddrLocal(_fd, _buf, _buf_len);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_addr_remote"] = async function (_fd: any, _buf: any, _buf_len: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockAddrRemote(_fd, _buf, _buf_len);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_open"] = async function (_af: any, _socktype: any, _result_ptr: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockOpen(_af, _socktype, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_close"] = async function (_fd: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockClose(_fd);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_set_reuse_addr"] = async function (_fd: any, _reuse: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockSetReuseAddr(_fd, _reuse);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_get_reuse_addr"] = async function (_fd: any, _result_ptr: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockGetReuseAddr(_fd, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_set_reuse_port"] = async function (_fd: any, _reuse: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockSetReusePort(_fd, _reuse);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_get_reuse_port"] = async function (_fd: any, _result_ptr: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockGetReusePort(_fd, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_set_recv_buf_size"] = async function (_fd: any, _size: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockSetRecvBufSize(_fd, _size);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_get_recv_buf_size"] = async function (_fd: any, _result_ptr: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockGetRecvBufSize(_fd, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_set_send_buf_size"] = async function (_fd: any, _size: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockSetSendBufSize(_fd, _size);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_get_send_buf_size"] = async function (_fd: any, _result_ptr: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockGetSendBufSize(_fd, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_bind"] = async function (_fd: any, _addr: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockBind(_fd, _addr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_listen"] = async function (_fd: any, _backlog: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockListen(_fd, _backlog);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_accept"] = async function (_fd: any, _result_ptr: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockAccept(_fd, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_connect"] = async function (_fd: any, _addr: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockConnect(_fd, _addr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_recv"] = async function (
        _fd: any,
        _buf: any,
        _buf_len: any,
        _flags: any,
        _result_ptr: any
    ) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockRecv(_fd, _buf, _buf_len, _flags, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_recv_from"] = async function (
        _fd: any,
        _buf: any,
        _buf_len: any,
        _addr_buf: any,
        _addr_buf_len: any,
        _flags: any,
        _result_ptr: any
    ) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockRecvFrom(_fd, _buf, _buf_len, _addr_buf, _addr_buf_len, _flags, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_send"] = async function (
        _fd: any,
        _buf: any,
        _buf_len: any,
        _flags: any,
        _result_ptr: any
    ) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockSend(_fd, _buf, _buf_len, _flags, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_send_to"] = async function (
        _fd: any,
        _buf: any,
        _buf_len: any,
        _addr: any,
        _flags: any,
        _result_ptr: any
    ) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockSendTo(_fd, _buf, _buf_len, _addr, _flags, _result_ptr);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
    imports[importsNS]["sock_shutdown"] = async function (_fd: any, _how: any) {
        const errorHandler2 = handler.handleError;
        try {
            const ret = await obj.sockShutdown(_fd, _how);
            handler.checkAbort();
            return ret;
        } catch (err: any) {
            return errorHandler2(err);
        }
    };
}
