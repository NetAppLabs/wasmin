import { NewTimestamp } from "@wasm-env/wasi-snapshot-preview2/dist/imports/filesystem-filesystem.js";
import { SystemError } from "../../errors.js";
import { translateErrorToErrorno } from "../../wasiUtils.js";
import { Advice, AdviceN, ErrnoN } from "../../wasi_snapshot_preview1/bindings.js";
import { FilesystemFilesystemNamespace as fs } from "@wasm-env/wasi-snapshot-preview2";
import { SocketsNetworkNamespace as sock } from "@wasm-env/wasi-snapshot-preview2";
import { ClocksWallClockNamespace as clockw } from "@wasm-env/wasi-snapshot-preview2";

type ErrorCodeFS = fs.ErrorCode;
type ErrorCodeSockets = sock.ErrorCode;
type Datetime = clockw.Datetime;

type ErrorCode = ErrorCodeFS | ErrorCodeSockets;

export function translateError(err: any) {
    const errCodeNo = translateErrorToErrorno(err);
    let errCode: ErrorCode = "invalid";
    switch (errCodeNo) {
        //case ErrnoN.SUCCESS:
        //    errCode = 'sucess';
        //    break;
        //case ErrnoN.E_2_BIG:
        //    errCode = 'too-big';
        //    break;
        case ErrnoN.ACCES:
            errCode = "access";
            break;
        case ErrnoN.ADDRINUSE:
            errCode = "address-in-use";
            break;
        case ErrnoN.ADDRNOTAVAIL:
            errCode = "invalid-remote-address";
            break;
        case ErrnoN.AFNOSUPPORT:
            errCode = "address-family-not-supported";
            break;
        case ErrnoN.AGAIN:
            errCode = "would-block";
            break;
        case ErrnoN.ALREADY:
            errCode = "concurrency-conflict";
            break;
        case ErrnoN.BADF:
            errCode = "bad-descriptor";
            break;
        //case ErrnoN.BADMSG:
        //    errCode = 'bad-message';
        //    break;
        case ErrnoN.BUSY:
            errCode = "busy";
            break;
        //case ErrnoN.CANCELED:
        //    errCode = 'cancelled';
        //    break;
        //case ErrnoN.CHILD:
        //    errCode = 'child';
        //    break;
        //case ErrnoN.CONNABORTED:
        //    errCode = 'connection-aborted';
        //    break;
        case ErrnoN.CONNREFUSED:
            errCode = "connection-refused";
            break;
        case ErrnoN.CONNRESET:
            errCode = "connection-reset";
            break;
        case ErrnoN.DEADLK:
            errCode = "deadlock";
            break;
        case ErrnoN.DESTADDRREQ:
            errCode = "invalid-remote-address";
            break;
        //case ErrnoN.DOM:
        //    errCode = 'out-of-domain-function';
        //    break;
        case ErrnoN.DQUOT:
            errCode = "quota";
            break;
        case ErrnoN.EXIST:
            errCode = "exist";
            break;
        //case ErrnoN.FAULT:
        //    errCode = 'fault';
        //    break;
        case ErrnoN.FBIG:
            errCode = "file-too-large";
            break;
        case ErrnoN.HOSTUNREACH:
            errCode = "remote-unreachable";
            break;
        //case ErrnoN.IDRM:
        //    errCode = 'id-removed';
        //    break;
        case ErrnoN.ILSEQ:
            errCode = "illegal-byte-sequence";
            break;
        case ErrnoN.INPROGRESS:
            errCode = "in-progress";
            break;
        case ErrnoN.INTR:
            errCode = "interrupted";
            break;
        case ErrnoN.INVAL:
            errCode = "invalid";
            break;
        case ErrnoN.IO:
            errCode = "io";
            break;
        case ErrnoN.ISCONN:
            errCode = "already-connected";
            break;
        case ErrnoN.ISDIR:
            errCode = "is-directory";
            break;
        case ErrnoN.LOOP:
            errCode = "loop";
            break;
        case ErrnoN.MFILE:
            errCode = "new-socket-limit";
            break;
        case ErrnoN.MFILE:
            errCode = "new-socket-limit";
            break;
        case ErrnoN.MLINK:
            errCode = "too-many-links";
            break;
        case ErrnoN.MSGSIZE:
            errCode = "message-size";
            break;
        //case ErrnoN.MULTIHOP:
        //    errCode = 'multi-hop';
        //    break;
        case ErrnoN.NAMETOOLONG:
            errCode = "name-too-long";
            break;
        case ErrnoN.NETDOWN:
            errCode = "remote-unreachable";
            break;
        case ErrnoN.NETDOWN:
            errCode = "remote-unreachable";
            break;
        case ErrnoN.NETRESET:
            errCode = "remote-unreachable";
            break;
        case ErrnoN.NETRESET:
            errCode = "remote-unreachable";
            break;
        case ErrnoN.NFILE:
            errCode = "new-socket-limit";
            break;
        case ErrnoN.NOBUFS:
            errCode = "new-socket-limit";
            break;
        case ErrnoN.NODEV:
            errCode = "no-device";
            break;
        case ErrnoN.NOENT:
            errCode = "no-entry";
            break;
        //case ErrnoN.NOEXEC:
        //    errCode = 'no-exec';
        //    break;
        case ErrnoN.NOLCK:
            errCode = "no-lock";
            break;
        //case ErrnoN.NOLINK:
        //    errCode = 'no-link';
        //    break;
        case ErrnoN.NOMEM:
            errCode = "insufficient-memory";
            //errCode = 'out-of-memory';
            break;
        //case ErrnoN.NOMSG:
        //    errCode = 'no-message';
        //    break;
        //case ErrnoN.NOPROTOOPT:
        //    errCode = 'protocol-unavailable';
        //    break;
        case ErrnoN.NOSPC:
            errCode = "insufficient-space";
            break;
        case ErrnoN.NOSYS:
            errCode = "unsupported";
            break;
        case ErrnoN.NOTCONN:
            errCode = "not-connected";
            break;
        case ErrnoN.NOTDIR:
            errCode = "not-directory";
            break;
        case ErrnoN.NOTEMPTY:
            errCode = "not-empty";
            break;
        case ErrnoN.NOTRECOVERABLE:
            errCode = "not-recoverable";
            break;
        //case ErrnoN.NOTSOCK:
        //    errCode = 'not-socket';
        //    break;
        case ErrnoN.NOTSUP:
            errCode = "not-supported";
            break;
        case ErrnoN.NOTTY:
            errCode = "no-tty";
            break;
        case ErrnoN.NXIO:
            errCode = "no-such-device";
            break;
        case ErrnoN.OVERFLOW:
            errCode = "overflow";
            break;
        //case ErrnoN.OWNERDEAD:
        //    errCode = 'owner-dead';
        //    break;
        case ErrnoN.PERM:
            errCode = "not-permitted";
            break;
        case ErrnoN.PIPE:
            errCode = "pipe";
            break;
        //case ErrnoN.PROTO:
        //    errCode = 'protocol-error';
        //    break;
        //case ErrnoN.PROTONOSUPPORT:
        //    errCode = 'unsupported-protocol';
        //    break;
        //case ErrnoN.PROTOTYPE:
        //    errCode = 'wrong-protocol';
        //    break;
        //case ErrnoN.RANGE:
        //    errCode = 'too-large';
        //    break;
        case ErrnoN.ROFS:
            errCode = "read-only";
            break;
        case ErrnoN.SPIPE:
            errCode = "invalid-seek";
            break;
        //case ErrnoN.SRCH:
        //    errCode = 'no-process';
        //    break;
        //case ErrnoN.STALE:
        //    errCode = 'stale';
        //    break;
        case ErrnoN.TIMEDOUT:
            errCode = "timeout";
            break;
        case ErrnoN.TXTBSY:
            errCode = "text-file-busy";
            break;
        case ErrnoN.XDEV:
            errCode = "cross-device";
            break;
        //case ErrnoN.NOTCAPABLE:
        //    errCode = 'not-capable';
        //    break;
    }
    return errCode;
}

export function adviceStringtoAdviceN(advice: fs.Advice): AdviceN {
    switch (advice) {
        case "normal":
            return AdviceN.NORMAL;
        case "sequential":
            return AdviceN.SEQUENTIAL;
        case "random":
            return AdviceN.RANDOM;
        case "will-need":
            return AdviceN.WILLNEED;
        case "dont-need":
            return AdviceN.DONTNEED;
        case "no-reuse":
            return AdviceN.NOREUSE;
    }
}

export function toDateTimeFromMs(timeMillis: number): Datetime {
    const seconds = BigInt(Math.floor(timeMillis / 1000));
    const nanoseconds = (timeMillis % 1000) * 1_000_000;
    const dt: Datetime = {
        seconds: seconds,
        nanoseconds: nanoseconds,
    };
    return dt;
}

export function toDateTimeFromNs(timeNanos: bigint): Datetime {
    const seconds = timeNanos / 1000_000_000n;
    const nanoseconds = Number(timeNanos % 1000_000_000n);
    const dt: Datetime = {
        seconds: seconds,
        nanoseconds: nanoseconds,
    };
    return dt;
}

export function toMillisFromDatetime(time: Datetime): number {
    let millis = Number(time.seconds) * 1000;
    let millisextra = time.nanoseconds / 1_000_000;

    millis = millis + millisextra;
    return millis;
}

export function toNanosFromDatetime(time: Datetime): bigint {
    let nanos = time.seconds * 1_000_000_000n;
    let nanosextra = BigInt(time.nanoseconds);
    nanos = nanos + nanosextra;

    return nanos;
}

export function toMillisFromTimestamp(timestamp: NewTimestamp): number | null {
    let timestampMillis: number | null = null;
    switch (timestamp.tag) {
        case "no-change": {
            timestampMillis = null;
            break;
        }
        case "now": {
            timestampMillis = Date.now();
            break;
        }
        case "timestamp": {
            timestampMillis = toMillisFromDatetime(timestamp.val);
            break;
        }
    }
    return null;
}

export function toNanosFromTimestamp(timestamp: NewTimestamp): bigint | null {
    let timestampMillis: bigint | null = null;
    switch (timestamp.tag) {
        case "no-change": {
            timestampMillis = null;
            break;
        }
        case "now": {
            timestampMillis = BigInt(Date.now() * 1_000_000);
            break;
        }
        case "timestamp": {
            timestampMillis = toNanosFromDatetime(timestamp.val);
            break;
        }
    }
    return timestampMillis;
}

export type ManagedResourceId = number;
export type ManagedResource = any;
export class ResourceManager {
    constructor() {}

    private _resources = new Map<ManagedResourceId, ManagedResource>();
    private _nextResourceId = 0;

    add(res: ManagedResource): ManagedResourceId {
        this._resources.set(this._nextResourceId, res);
        return this._nextResourceId++ as ManagedResourceId;
    }

    get(resId: ManagedResourceId): ManagedResource {
        const res = this._resources.get(resId);
        if (!res) {
            throw new SystemError(ErrnoN.BADF);
        }
        return res;
    }

    private _take(resId: ManagedResourceId) {
        const res = this._resources.get(resId);
        this._resources.delete(resId);
        return res;
    }

    async close(resId: ManagedResourceId) {
        const res = this._take(resId);
        const fdhandle = res as any;
        if (fdhandle.close) {
            await fdhandle.close();
        }
    }
}
