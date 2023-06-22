import { translateErrorToErrorno } from "../wasiUtils.js";
import { ErrnoN } from "../wasi_snapshot_preview1/bindings.js";
import { FilesystemFilesystemNamespace as fs } from "@wasm-env/wasi-snapshot-preview2";
import { SocketsNetworkNamespace as sock } from "@wasm-env/wasi-snapshot-preview2";
type ErrorCodeFS = fs.ErrorCode;
type ErrorCodeSockets = sock.ErrorCode;

type ErrorCode = ErrorCodeFS | ErrorCodeSockets;

export function translateError(err: any) {
    const errCodeNo = translateErrorToErrorno(err);
    let errCode: ErrorCode = "invalid";
    switch (errCodeNo) {
        //case ErrnoN.SUCCESS:
        //    errCode = 'sucess';
        //case ErrnoN.E_2_BIG:
        //    errCode = 'too-big';
        case ErrnoN.ACCES:
            errCode = "access";
        case ErrnoN.ADDRINUSE:
            errCode = "address-in-use";
        case ErrnoN.ADDRNOTAVAIL:
            errCode = "invalid-remote-address";
        case ErrnoN.AFNOSUPPORT:
            errCode = "address-family-not-supported";
        case ErrnoN.AGAIN:
            errCode = "would-block";
        case ErrnoN.ALREADY:
            errCode = "concurrency-conflict";
        case ErrnoN.BADF:
            errCode = "bad-descriptor";
        //case ErrnoN.BADMSG:
        //    errCode = 'bad-message';
        case ErrnoN.BUSY:
            errCode = "busy";
        //case ErrnoN.CANCELED:
        //    errCode = 'cancelled';
        //case ErrnoN.CHILD:
        //    errCode = 'child';
        //case ErrnoN.CONNABORTED:
        //    errCode = 'connection-aborted';
        case ErrnoN.CONNREFUSED:
            errCode = "connection-refused";
        case ErrnoN.CONNRESET:
            errCode = "connection-reset";
        case ErrnoN.DEADLK:
            errCode = "deadlock";
        case ErrnoN.DESTADDRREQ:
            errCode = "invalid-remote-address";
        //case ErrnoN.DOM:
        //    errCode = 'out-of-domain-function';
        case ErrnoN.DQUOT:
            errCode = "quota";
        case ErrnoN.EXIST:
            errCode = "exist";
        //case ErrnoN.FAULT:
        //    errCode = 'fault';
        case ErrnoN.FBIG:
            errCode = "file-too-large";
        case ErrnoN.HOSTUNREACH:
            errCode = "remote-unreachable";
        //case ErrnoN.IDRM:
        //    errCode = 'id-removed';
        case ErrnoN.ILSEQ:
            errCode = "illegal-byte-sequence";
        case ErrnoN.INPROGRESS:
            errCode = "in-progress";
        case ErrnoN.INTR:
            errCode = "interrupted";
        case ErrnoN.INVAL:
            errCode = "invalid";
        case ErrnoN.IO:
            errCode = "io";
        case ErrnoN.ISCONN:
            errCode = "already-connected";
        case ErrnoN.ISDIR:
            errCode = "is-directory";
        case ErrnoN.LOOP:
            errCode = "loop";
        case ErrnoN.MFILE:
            errCode = "new-socket-limit";
        case ErrnoN.MFILE:
            errCode = "new-socket-limit";
        case ErrnoN.MLINK:
            errCode = "too-many-links";
        case ErrnoN.MSGSIZE:
            errCode = "message-size";
        //case ErrnoN.MULTIHOP:
        //    errCode = 'multi-hop';
        case ErrnoN.NAMETOOLONG:
            errCode = "name-too-long";
        case ErrnoN.NETDOWN:
            errCode = "remote-unreachable";
        case ErrnoN.NETDOWN:
            errCode = "remote-unreachable";
        case ErrnoN.NETRESET:
            errCode = "remote-unreachable";
        case ErrnoN.NETRESET:
            errCode = "remote-unreachable";
        case ErrnoN.NFILE:
            errCode = "new-socket-limit";
        case ErrnoN.NOBUFS:
            errCode = "new-socket-limit";
        case ErrnoN.NODEV:
            errCode = "no-device";
        case ErrnoN.NOENT:
            errCode = "no-entry";
        //case ErrnoN.NOEXEC:
        //    errCode = 'no-exec';
        case ErrnoN.NOLCK:
            errCode = "no-lock";
        //case ErrnoN.NOLINK:
        //    errCode = 'no-link';
        case ErrnoN.NOMEM:
            errCode = "insufficient-memory";
        //errCode = 'out-of-memory';
        //case ErrnoN.NOMSG:
        //    errCode = 'no-message';
        //case ErrnoN.NOPROTOOPT:
        //    errCode = 'protocol-unavailable';
        case ErrnoN.NOSPC:
            errCode = "insufficient-space";
        case ErrnoN.NOSYS:
            errCode = "unsupported";
        case ErrnoN.NOTCONN:
            errCode = "not-connected";
        case ErrnoN.NOTDIR:
            errCode = "not-directory";
        case ErrnoN.NOTEMPTY:
            errCode = "not-empty";
        case ErrnoN.NOTRECOVERABLE:
            errCode = "not-recoverable";
        //case ErrnoN.NOTSOCK:
        //    errCode = 'not-socket';
        case ErrnoN.NOTSUP:
            errCode = "not-supported";
        case ErrnoN.NOTTY:
            errCode = "no-tty";
        case ErrnoN.NXIO:
            errCode = "no-such-device";
        case ErrnoN.OVERFLOW:
            errCode = "overflow";
        //case ErrnoN.OWNERDEAD:
        //    errCode = 'owner-dead';
        case ErrnoN.PERM:
            errCode = "not-permitted";
        case ErrnoN.PIPE:
            errCode = "pipe";
        //case ErrnoN.PROTO:
        //    errCode = 'protocol-error';
        //case ErrnoN.PROTONOSUPPORT:
        //    errCode = 'unsupported-protocol';
        //case ErrnoN.PROTOTYPE:
        //    errCode = 'wrong-protocol';
        //case ErrnoN.RANGE:
        //    errCode = 'too-large';
        case ErrnoN.ROFS:
            errCode = "read-only";
        case ErrnoN.SPIPE:
            errCode = "invalid-seek";
        //case ErrnoN.SRCH:
        //    errCode = 'no-process';
        //case ErrnoN.STALE:
        //    errCode = 'stale';
        case ErrnoN.TIMEDOUT:
            errCode = "timeout";
        case ErrnoN.TXTBSY:
            errCode = "text-file-busy";
        case ErrnoN.XDEV:
            errCode = "cross-device";
        //case ErrnoN.NOTCAPABLE:
        //    errCode = 'not-capable';
    }
    return errCode;
}
