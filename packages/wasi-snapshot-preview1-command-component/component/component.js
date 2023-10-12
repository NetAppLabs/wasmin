function clampGuest(i, min, max) {
  if (i < min || i > max) throw new TypeError(`must be between ${min} and ${max}`);
  return i;
}

class ComponentError extends Error {
  constructor (value) {
    const enumerable = typeof value !== 'string';
    super(enumerable ? `${String(value)} (see error.payload)` : value);
    Object.defineProperty(this, 'payload', { value, enumerable });
  }
}

let dv = new DataView(new ArrayBuffer());
const dataView = mem => dv.buffer === mem.buffer ? dv : dv = new DataView(mem.buffer);

function getErrorPayload(e) {
  if (e && hasOwnProperty.call(e, 'payload')) return e.payload;
  return e;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

function throwInvalidBool() {
  throw new TypeError('invalid variant discriminant for bool');
}

const toUint64 = val => BigInt.asUintN(64, val);

function toUint16(val) {
  val >>>= 0;
  val %= 2 ** 16;
  return val;
}

function toUint32(val) {
  return val >>> 0;
}

function toUint8(val) {
  val >>>= 0;
  val %= 2 ** 8;
  return val;
}

const utf8Decoder = new TextDecoder();

const utf8Encoder = new TextEncoder();

let utf8EncodedLen = 0;
function utf8Encode(s, realloc, memory) {
  if (typeof s !== 'string') throw new TypeError('expected a string');
  if (s.length === 0) {
    utf8EncodedLen = 0;
    return 1;
  }
  let allocLen = 0;
  let ptr = 0;
  let writtenTotal = 0;
  while (s.length > 0) {
    ptr = realloc(ptr, allocLen, 1, allocLen + s.length);
    allocLen += s.length;
    const { read, written } = utf8Encoder.encodeInto(
    s,
    new Uint8Array(memory.buffer, ptr + writtenTotal, allocLen - writtenTotal),
    );
    writtenTotal += written;
    s = s.slice(read);
  }
  if (allocLen > writtenTotal)
  ptr = realloc(ptr, allocLen, 1, writtenTotal);
  utf8EncodedLen = writtenTotal;
  return ptr;
}

export async function instantiate(compileCore, imports, instantiateCore = WebAssembly.instantiate) {
  const module0 = compileCore('component.core.wasm');
  const module1 = compileCore('component.core2.wasm');
  const module2 = compileCore('component.core3.wasm');
  const module3 = compileCore('component.core4.wasm');
  
  const { getArguments, getEnvironment } = imports['wasi:cli/environment'];
  const { exit } = imports['wasi:cli/exit'];
  const { getStderr } = imports['wasi:cli/stderr'];
  const { getStdin } = imports['wasi:cli/stdin'];
  const { getStdout } = imports['wasi:cli/stdout'];
  const { dropTerminalInput } = imports['wasi:cli/terminal-input'];
  const { dropTerminalOutput } = imports['wasi:cli/terminal-output'];
  const { getTerminalStderr } = imports['wasi:cli/terminal-stderr'];
  const { getTerminalStdin } = imports['wasi:cli/terminal-stdin'];
  const { getTerminalStdout } = imports['wasi:cli/terminal-stdout'];
  const { now, resolution, subscribe } = imports['wasi:clocks/monotonic-clock'];
  const { now: now$1, resolution: resolution$1 } = imports['wasi:clocks/wall-clock'];
  const { getDirectories } = imports['wasi:filesystem/preopens'];
  const { advise, appendViaStream, createDirectoryAt, dropDescriptor, dropDirectoryEntryStream, getFlags, getType, linkAt, metadataHash, metadataHashAt, openAt, read, readDirectory, readDirectoryEntry, readViaStream, readlinkAt, removeDirectoryAt, renameAt, setSize, setTimes, setTimesAt, stat, statAt, symlinkAt, sync, syncData, unlinkFileAt, write, writeViaStream } = imports['wasi:filesystem/types'];
  const { blockingFlush, blockingRead, blockingWriteAndFlush, checkWrite, dropInputStream, dropOutputStream, read: read$1, subscribeToInputStream, subscribeToOutputStream, write: write$1 } = imports['wasi:io/streams'];
  const { dropPollable, pollOneoff } = imports['wasi:poll/poll'];
  const { getRandomBytes } = imports['wasi:random/random'];
  const { instanceNetwork } = imports['wasi:sockets/instance-network'];
  const { resolveAddresses, resolveNextAddress } = imports['wasi:sockets/ip-name-lookup'];
  const { accept, dropTcpSocket, finishBind, finishConnect, finishListen, localAddress, remoteAddress, shutdown, startBind, startConnect, startListen } = imports['wasi:sockets/tcp'];
  const { createTcpSocket } = imports['wasi:sockets/tcp-create-socket'];
  const { dropUdpSocket, finishBind: finishBind$1, finishConnect: finishConnect$1, localAddress: localAddress$1, receive, remoteAddress: remoteAddress$1, send, startBind: startBind$1, startConnect: startConnect$1 } = imports['wasi:sockets/udp'];
  const { createUdpSocket } = imports['wasi:sockets/udp-create-socket'];
  let exports0;
  let exports1;
  
  function trampoline0() {
    const ret = instanceNetwork();
    return toUint32(ret);
  }
  
  function trampoline1(arg0) {
    dropDirectoryEntryStream(arg0 >>> 0);
  }
  
  function trampoline2(arg0, arg1) {
    const bool0 = arg1;
    const ret = subscribe(BigInt.asUintN(64, arg0), bool0 == 0 ? false : (bool0 == 1 ? true : throwInvalidBool()));
    return toUint32(ret);
  }
  
  function trampoline3(arg0) {
    const ret = subscribeToOutputStream(arg0 >>> 0);
    return toUint32(ret);
  }
  
  function trampoline4(arg0) {
    dropPollable(arg0 >>> 0);
  }
  
  function trampoline5(arg0) {
    const ret = subscribeToInputStream(arg0 >>> 0);
    return toUint32(ret);
  }
  
  function trampoline6() {
    const ret = resolution();
    return toUint64(ret);
  }
  
  function trampoline7() {
    const ret = now();
    return toUint64(ret);
  }
  
  function trampoline8(arg0) {
    let variant0;
    switch (arg0) {
      case 0: {
        variant0= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        variant0= {
          tag: 'err',
          val: undefined
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    exit(variant0);
  }
  
  function trampoline9() {
    const ret = getStdin();
    return toUint32(ret);
  }
  
  function trampoline10(arg0) {
    dropTcpSocket(arg0 >>> 0);
  }
  
  function trampoline11(arg0) {
    dropDescriptor(arg0 >>> 0);
  }
  
  function trampoline12() {
    const ret = getStdout();
    return toUint32(ret);
  }
  
  function trampoline13() {
    const ret = getStderr();
    return toUint32(ret);
  }
  
  function trampoline14(arg0) {
    dropTerminalInput(arg0 >>> 0);
  }
  
  function trampoline15(arg0) {
    dropTerminalOutput(arg0 >>> 0);
  }
  
  function trampoline16(arg0) {
    dropInputStream(arg0 >>> 0);
  }
  
  function trampoline17(arg0) {
    dropOutputStream(arg0 >>> 0);
  }
  
  function trampoline18(arg0) {
    dropUdpSocket(arg0 >>> 0);
  }
  let exports2;
  
  function trampoline19(arg0) {
    const ret = getDirectories();
    const vec2 = ret;
    const len2 = vec2.length;
    const result2 = realloc0(0, 0, 4, len2 * 12);
    for (let i = 0; i < vec2.length; i++) {
      const e = vec2[i];
      const base = result2 + i * 12;const [tuple0_0, tuple0_1] = e;
      dataView(memory0).setInt32(base + 0, toUint32(tuple0_0), true);
      const ptr1 = utf8Encode(tuple0_1, realloc0, memory0);
      const len1 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 8, len1, true);
      dataView(memory0).setInt32(base + 4, ptr1, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len2, true);
    dataView(memory0).setInt32(arg0 + 0, result2, true);
  }
  let memory0;
  let realloc0;
  
  function trampoline20(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    let variant0;
    switch (arg2) {
      case 0: {
        variant0= {
          tag: 'ipv4',
          val: {
            port: clampGuest(arg3, 0, 65535),
            address: [clampGuest(arg4, 0, 255), clampGuest(arg5, 0, 255), clampGuest(arg6, 0, 255), clampGuest(arg7, 0, 255)],
          }
        };
        break;
      }
      case 1: {
        variant0= {
          tag: 'ipv6',
          val: {
            port: clampGuest(arg3, 0, 65535),
            flowInfo: arg4 >>> 0,
            address: [clampGuest(arg5, 0, 65535), clampGuest(arg6, 0, 65535), clampGuest(arg7, 0, 65535), clampGuest(arg8, 0, 65535), clampGuest(arg9, 0, 65535), clampGuest(arg10, 0, 65535), clampGuest(arg11, 0, 65535), clampGuest(arg12, 0, 65535)],
            scopeId: arg13 >>> 0,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for IpSocketAddress');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: startBind(arg0 >>> 0, arg1 >>> 0, variant0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg14 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline21(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: finishBind(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'unknown': {
            enum0 = 0;
            break;
          }
          case 'access-denied': {
            enum0 = 1;
            break;
          }
          case 'not-supported': {
            enum0 = 2;
            break;
          }
          case 'out-of-memory': {
            enum0 = 3;
            break;
          }
          case 'timeout': {
            enum0 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum0 = 5;
            break;
          }
          case 'not-in-progress': {
            enum0 = 6;
            break;
          }
          case 'would-block': {
            enum0 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum0 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum0 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum0 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum0 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum0 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum0 = 13;
            break;
          }
          case 'already-attached': {
            enum0 = 14;
            break;
          }
          case 'already-bound': {
            enum0 = 15;
            break;
          }
          case 'already-connected': {
            enum0 = 16;
            break;
          }
          case 'not-bound': {
            enum0 = 17;
            break;
          }
          case 'not-connected': {
            enum0 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum0 = 19;
            break;
          }
          case 'address-in-use': {
            enum0 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum0 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum0 = 22;
            break;
          }
          case 'already-listening': {
            enum0 = 23;
            break;
          }
          case 'not-listening': {
            enum0 = 24;
            break;
          }
          case 'connection-refused': {
            enum0 = 25;
            break;
          }
          case 'connection-reset': {
            enum0 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum0 = 27;
            break;
          }
          case 'invalid-name': {
            enum0 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum0 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum0 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum0 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline22(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    let variant0;
    switch (arg2) {
      case 0: {
        variant0= {
          tag: 'ipv4',
          val: {
            port: clampGuest(arg3, 0, 65535),
            address: [clampGuest(arg4, 0, 255), clampGuest(arg5, 0, 255), clampGuest(arg6, 0, 255), clampGuest(arg7, 0, 255)],
          }
        };
        break;
      }
      case 1: {
        variant0= {
          tag: 'ipv6',
          val: {
            port: clampGuest(arg3, 0, 65535),
            flowInfo: arg4 >>> 0,
            address: [clampGuest(arg5, 0, 65535), clampGuest(arg6, 0, 65535), clampGuest(arg7, 0, 65535), clampGuest(arg8, 0, 65535), clampGuest(arg9, 0, 65535), clampGuest(arg10, 0, 65535), clampGuest(arg11, 0, 65535), clampGuest(arg12, 0, 65535)],
            scopeId: arg13 >>> 0,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for IpSocketAddress');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: startConnect(arg0 >>> 0, arg1 >>> 0, variant0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg14 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline23(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: finishConnect(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const [tuple0_0, tuple0_1] = e;
        dataView(memory0).setInt32(arg1 + 4, toUint32(tuple0_0), true);
        dataView(memory0).setInt32(arg1 + 8, toUint32(tuple0_1), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline24(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: startListen(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'unknown': {
            enum0 = 0;
            break;
          }
          case 'access-denied': {
            enum0 = 1;
            break;
          }
          case 'not-supported': {
            enum0 = 2;
            break;
          }
          case 'out-of-memory': {
            enum0 = 3;
            break;
          }
          case 'timeout': {
            enum0 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum0 = 5;
            break;
          }
          case 'not-in-progress': {
            enum0 = 6;
            break;
          }
          case 'would-block': {
            enum0 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum0 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum0 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum0 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum0 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum0 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum0 = 13;
            break;
          }
          case 'already-attached': {
            enum0 = 14;
            break;
          }
          case 'already-bound': {
            enum0 = 15;
            break;
          }
          case 'already-connected': {
            enum0 = 16;
            break;
          }
          case 'not-bound': {
            enum0 = 17;
            break;
          }
          case 'not-connected': {
            enum0 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum0 = 19;
            break;
          }
          case 'address-in-use': {
            enum0 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum0 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum0 = 22;
            break;
          }
          case 'already-listening': {
            enum0 = 23;
            break;
          }
          case 'not-listening': {
            enum0 = 24;
            break;
          }
          case 'connection-refused': {
            enum0 = 25;
            break;
          }
          case 'connection-reset': {
            enum0 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum0 = 27;
            break;
          }
          case 'invalid-name': {
            enum0 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum0 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum0 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum0 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline25(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: finishListen(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'unknown': {
            enum0 = 0;
            break;
          }
          case 'access-denied': {
            enum0 = 1;
            break;
          }
          case 'not-supported': {
            enum0 = 2;
            break;
          }
          case 'out-of-memory': {
            enum0 = 3;
            break;
          }
          case 'timeout': {
            enum0 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum0 = 5;
            break;
          }
          case 'not-in-progress': {
            enum0 = 6;
            break;
          }
          case 'would-block': {
            enum0 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum0 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum0 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum0 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum0 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum0 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum0 = 13;
            break;
          }
          case 'already-attached': {
            enum0 = 14;
            break;
          }
          case 'already-bound': {
            enum0 = 15;
            break;
          }
          case 'already-connected': {
            enum0 = 16;
            break;
          }
          case 'not-bound': {
            enum0 = 17;
            break;
          }
          case 'not-connected': {
            enum0 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum0 = 19;
            break;
          }
          case 'address-in-use': {
            enum0 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum0 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum0 = 22;
            break;
          }
          case 'already-listening': {
            enum0 = 23;
            break;
          }
          case 'not-listening': {
            enum0 = 24;
            break;
          }
          case 'connection-refused': {
            enum0 = 25;
            break;
          }
          case 'connection-reset': {
            enum0 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum0 = 27;
            break;
          }
          case 'invalid-name': {
            enum0 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum0 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum0 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum0 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline26(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: accept(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const [tuple0_0, tuple0_1, tuple0_2] = e;
        dataView(memory0).setInt32(arg1 + 4, toUint32(tuple0_0), true);
        dataView(memory0).setInt32(arg1 + 8, toUint32(tuple0_1), true);
        dataView(memory0).setInt32(arg1 + 12, toUint32(tuple0_2), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline27(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: localAddress(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant4 = e;
        switch (variant4.tag) {
          case 'ipv4': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            const {port: v0_0, address: v0_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v0_0), true);
            const [tuple1_0, tuple1_1, tuple1_2, tuple1_3] = v0_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple1_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple1_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple1_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple1_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            const {port: v2_0, flowInfo: v2_1, address: v2_2, scopeId: v2_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v2_1), true);
            const [tuple3_0, tuple3_1, tuple3_2, tuple3_3, tuple3_4, tuple3_5, tuple3_6, tuple3_7] = v2_2;
            dataView(memory0).setInt16(arg1 + 16, toUint16(tuple3_0), true);
            dataView(memory0).setInt16(arg1 + 18, toUint16(tuple3_1), true);
            dataView(memory0).setInt16(arg1 + 20, toUint16(tuple3_2), true);
            dataView(memory0).setInt16(arg1 + 22, toUint16(tuple3_3), true);
            dataView(memory0).setInt16(arg1 + 24, toUint16(tuple3_4), true);
            dataView(memory0).setInt16(arg1 + 26, toUint16(tuple3_5), true);
            dataView(memory0).setInt16(arg1 + 28, toUint16(tuple3_6), true);
            dataView(memory0).setInt16(arg1 + 30, toUint16(tuple3_7), true);
            dataView(memory0).setInt32(arg1 + 32, toUint32(v2_3), true);
            break;
          }
          default: {
            throw new TypeError('invalid variant specified for IpSocketAddress');
          }
        }
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val5 = e;
        let enum5;
        switch (val5) {
          case 'unknown': {
            enum5 = 0;
            break;
          }
          case 'access-denied': {
            enum5 = 1;
            break;
          }
          case 'not-supported': {
            enum5 = 2;
            break;
          }
          case 'out-of-memory': {
            enum5 = 3;
            break;
          }
          case 'timeout': {
            enum5 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum5 = 5;
            break;
          }
          case 'not-in-progress': {
            enum5 = 6;
            break;
          }
          case 'would-block': {
            enum5 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum5 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum5 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum5 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum5 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum5 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum5 = 13;
            break;
          }
          case 'already-attached': {
            enum5 = 14;
            break;
          }
          case 'already-bound': {
            enum5 = 15;
            break;
          }
          case 'already-connected': {
            enum5 = 16;
            break;
          }
          case 'not-bound': {
            enum5 = 17;
            break;
          }
          case 'not-connected': {
            enum5 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum5 = 19;
            break;
          }
          case 'address-in-use': {
            enum5 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum5 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum5 = 22;
            break;
          }
          case 'already-listening': {
            enum5 = 23;
            break;
          }
          case 'not-listening': {
            enum5 = 24;
            break;
          }
          case 'connection-refused': {
            enum5 = 25;
            break;
          }
          case 'connection-reset': {
            enum5 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum5 = 27;
            break;
          }
          case 'invalid-name': {
            enum5 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum5 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum5 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum5 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val5}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline28(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: remoteAddress(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant4 = e;
        switch (variant4.tag) {
          case 'ipv4': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            const {port: v0_0, address: v0_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v0_0), true);
            const [tuple1_0, tuple1_1, tuple1_2, tuple1_3] = v0_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple1_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple1_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple1_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple1_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            const {port: v2_0, flowInfo: v2_1, address: v2_2, scopeId: v2_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v2_1), true);
            const [tuple3_0, tuple3_1, tuple3_2, tuple3_3, tuple3_4, tuple3_5, tuple3_6, tuple3_7] = v2_2;
            dataView(memory0).setInt16(arg1 + 16, toUint16(tuple3_0), true);
            dataView(memory0).setInt16(arg1 + 18, toUint16(tuple3_1), true);
            dataView(memory0).setInt16(arg1 + 20, toUint16(tuple3_2), true);
            dataView(memory0).setInt16(arg1 + 22, toUint16(tuple3_3), true);
            dataView(memory0).setInt16(arg1 + 24, toUint16(tuple3_4), true);
            dataView(memory0).setInt16(arg1 + 26, toUint16(tuple3_5), true);
            dataView(memory0).setInt16(arg1 + 28, toUint16(tuple3_6), true);
            dataView(memory0).setInt16(arg1 + 30, toUint16(tuple3_7), true);
            dataView(memory0).setInt32(arg1 + 32, toUint32(v2_3), true);
            break;
          }
          default: {
            throw new TypeError('invalid variant specified for IpSocketAddress');
          }
        }
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val5 = e;
        let enum5;
        switch (val5) {
          case 'unknown': {
            enum5 = 0;
            break;
          }
          case 'access-denied': {
            enum5 = 1;
            break;
          }
          case 'not-supported': {
            enum5 = 2;
            break;
          }
          case 'out-of-memory': {
            enum5 = 3;
            break;
          }
          case 'timeout': {
            enum5 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum5 = 5;
            break;
          }
          case 'not-in-progress': {
            enum5 = 6;
            break;
          }
          case 'would-block': {
            enum5 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum5 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum5 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum5 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum5 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum5 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum5 = 13;
            break;
          }
          case 'already-attached': {
            enum5 = 14;
            break;
          }
          case 'already-bound': {
            enum5 = 15;
            break;
          }
          case 'already-connected': {
            enum5 = 16;
            break;
          }
          case 'not-bound': {
            enum5 = 17;
            break;
          }
          case 'not-connected': {
            enum5 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum5 = 19;
            break;
          }
          case 'address-in-use': {
            enum5 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum5 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum5 = 22;
            break;
          }
          case 'already-listening': {
            enum5 = 23;
            break;
          }
          case 'not-listening': {
            enum5 = 24;
            break;
          }
          case 'connection-refused': {
            enum5 = 25;
            break;
          }
          case 'connection-reset': {
            enum5 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum5 = 27;
            break;
          }
          case 'invalid-name': {
            enum5 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum5 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum5 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum5 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val5}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline29(arg0, arg1, arg2) {
    let enum0;
    switch (arg1) {
      case 0: {
        enum0 = 'receive';
        break;
      }
      case 1: {
        enum0 = 'send';
        break;
      }
      case 2: {
        enum0 = 'both';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for ShutdownType');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: shutdown(arg0 >>> 0, enum0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg2 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline30(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    let variant0;
    switch (arg2) {
      case 0: {
        variant0= {
          tag: 'ipv4',
          val: {
            port: clampGuest(arg3, 0, 65535),
            address: [clampGuest(arg4, 0, 255), clampGuest(arg5, 0, 255), clampGuest(arg6, 0, 255), clampGuest(arg7, 0, 255)],
          }
        };
        break;
      }
      case 1: {
        variant0= {
          tag: 'ipv6',
          val: {
            port: clampGuest(arg3, 0, 65535),
            flowInfo: arg4 >>> 0,
            address: [clampGuest(arg5, 0, 65535), clampGuest(arg6, 0, 65535), clampGuest(arg7, 0, 65535), clampGuest(arg8, 0, 65535), clampGuest(arg9, 0, 65535), clampGuest(arg10, 0, 65535), clampGuest(arg11, 0, 65535), clampGuest(arg12, 0, 65535)],
            scopeId: arg13 >>> 0,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for IpSocketAddress');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: startBind$1(arg0 >>> 0, arg1 >>> 0, variant0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg14 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline31(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: finishBind$1(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'unknown': {
            enum0 = 0;
            break;
          }
          case 'access-denied': {
            enum0 = 1;
            break;
          }
          case 'not-supported': {
            enum0 = 2;
            break;
          }
          case 'out-of-memory': {
            enum0 = 3;
            break;
          }
          case 'timeout': {
            enum0 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum0 = 5;
            break;
          }
          case 'not-in-progress': {
            enum0 = 6;
            break;
          }
          case 'would-block': {
            enum0 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum0 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum0 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum0 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum0 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum0 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum0 = 13;
            break;
          }
          case 'already-attached': {
            enum0 = 14;
            break;
          }
          case 'already-bound': {
            enum0 = 15;
            break;
          }
          case 'already-connected': {
            enum0 = 16;
            break;
          }
          case 'not-bound': {
            enum0 = 17;
            break;
          }
          case 'not-connected': {
            enum0 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum0 = 19;
            break;
          }
          case 'address-in-use': {
            enum0 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum0 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum0 = 22;
            break;
          }
          case 'already-listening': {
            enum0 = 23;
            break;
          }
          case 'not-listening': {
            enum0 = 24;
            break;
          }
          case 'connection-refused': {
            enum0 = 25;
            break;
          }
          case 'connection-reset': {
            enum0 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum0 = 27;
            break;
          }
          case 'invalid-name': {
            enum0 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum0 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum0 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum0 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline32(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    let variant0;
    switch (arg2) {
      case 0: {
        variant0= {
          tag: 'ipv4',
          val: {
            port: clampGuest(arg3, 0, 65535),
            address: [clampGuest(arg4, 0, 255), clampGuest(arg5, 0, 255), clampGuest(arg6, 0, 255), clampGuest(arg7, 0, 255)],
          }
        };
        break;
      }
      case 1: {
        variant0= {
          tag: 'ipv6',
          val: {
            port: clampGuest(arg3, 0, 65535),
            flowInfo: arg4 >>> 0,
            address: [clampGuest(arg5, 0, 65535), clampGuest(arg6, 0, 65535), clampGuest(arg7, 0, 65535), clampGuest(arg8, 0, 65535), clampGuest(arg9, 0, 65535), clampGuest(arg10, 0, 65535), clampGuest(arg11, 0, 65535), clampGuest(arg12, 0, 65535)],
            scopeId: arg13 >>> 0,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for IpSocketAddress');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: startConnect$1(arg0 >>> 0, arg1 >>> 0, variant0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg14 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline33(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: finishConnect$1(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'unknown': {
            enum0 = 0;
            break;
          }
          case 'access-denied': {
            enum0 = 1;
            break;
          }
          case 'not-supported': {
            enum0 = 2;
            break;
          }
          case 'out-of-memory': {
            enum0 = 3;
            break;
          }
          case 'timeout': {
            enum0 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum0 = 5;
            break;
          }
          case 'not-in-progress': {
            enum0 = 6;
            break;
          }
          case 'would-block': {
            enum0 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum0 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum0 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum0 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum0 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum0 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum0 = 13;
            break;
          }
          case 'already-attached': {
            enum0 = 14;
            break;
          }
          case 'already-bound': {
            enum0 = 15;
            break;
          }
          case 'already-connected': {
            enum0 = 16;
            break;
          }
          case 'not-bound': {
            enum0 = 17;
            break;
          }
          case 'not-connected': {
            enum0 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum0 = 19;
            break;
          }
          case 'address-in-use': {
            enum0 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum0 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum0 = 22;
            break;
          }
          case 'already-listening': {
            enum0 = 23;
            break;
          }
          case 'not-listening': {
            enum0 = 24;
            break;
          }
          case 'connection-refused': {
            enum0 = 25;
            break;
          }
          case 'connection-reset': {
            enum0 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum0 = 27;
            break;
          }
          case 'invalid-name': {
            enum0 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum0 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum0 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum0 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline34(arg0, arg1, arg2) {
    let ret;
    try {
      ret = { tag: 'ok', val: receive(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant9 = ret;
    switch (variant9.tag) {
      case 'ok': {
        const e = variant9.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        const vec7 = e;
        const len7 = vec7.length;
        const result7 = realloc0(0, 0, 4, len7 * 40);
        for (let i = 0; i < vec7.length; i++) {
          const e = vec7[i];
          const base = result7 + i * 40;const {data: v0_0, remoteAddress: v0_1 } = e;
          const val1 = v0_0;
          const len1 = val1.byteLength;
          const ptr1 = realloc0(0, 0, 1, len1 * 1);
          const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
          (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
          dataView(memory0).setInt32(base + 4, len1, true);
          dataView(memory0).setInt32(base + 0, ptr1, true);
          const variant6 = v0_1;
          switch (variant6.tag) {
            case 'ipv4': {
              const e = variant6.val;
              dataView(memory0).setInt8(base + 8, 0, true);
              const {port: v2_0, address: v2_1 } = e;
              dataView(memory0).setInt16(base + 12, toUint16(v2_0), true);
              const [tuple3_0, tuple3_1, tuple3_2, tuple3_3] = v2_1;
              dataView(memory0).setInt8(base + 14, toUint8(tuple3_0), true);
              dataView(memory0).setInt8(base + 15, toUint8(tuple3_1), true);
              dataView(memory0).setInt8(base + 16, toUint8(tuple3_2), true);
              dataView(memory0).setInt8(base + 17, toUint8(tuple3_3), true);
              break;
            }
            case 'ipv6': {
              const e = variant6.val;
              dataView(memory0).setInt8(base + 8, 1, true);
              const {port: v4_0, flowInfo: v4_1, address: v4_2, scopeId: v4_3 } = e;
              dataView(memory0).setInt16(base + 12, toUint16(v4_0), true);
              dataView(memory0).setInt32(base + 16, toUint32(v4_1), true);
              const [tuple5_0, tuple5_1, tuple5_2, tuple5_3, tuple5_4, tuple5_5, tuple5_6, tuple5_7] = v4_2;
              dataView(memory0).setInt16(base + 20, toUint16(tuple5_0), true);
              dataView(memory0).setInt16(base + 22, toUint16(tuple5_1), true);
              dataView(memory0).setInt16(base + 24, toUint16(tuple5_2), true);
              dataView(memory0).setInt16(base + 26, toUint16(tuple5_3), true);
              dataView(memory0).setInt16(base + 28, toUint16(tuple5_4), true);
              dataView(memory0).setInt16(base + 30, toUint16(tuple5_5), true);
              dataView(memory0).setInt16(base + 32, toUint16(tuple5_6), true);
              dataView(memory0).setInt16(base + 34, toUint16(tuple5_7), true);
              dataView(memory0).setInt32(base + 36, toUint32(v4_3), true);
              break;
            }
            default: {
              throw new TypeError('invalid variant specified for IpSocketAddress');
            }
          }
        }
        dataView(memory0).setInt32(arg2 + 8, len7, true);
        dataView(memory0).setInt32(arg2 + 4, result7, true);
        break;
      }
      case 'err': {
        const e = variant9.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        const val8 = e;
        let enum8;
        switch (val8) {
          case 'unknown': {
            enum8 = 0;
            break;
          }
          case 'access-denied': {
            enum8 = 1;
            break;
          }
          case 'not-supported': {
            enum8 = 2;
            break;
          }
          case 'out-of-memory': {
            enum8 = 3;
            break;
          }
          case 'timeout': {
            enum8 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum8 = 5;
            break;
          }
          case 'not-in-progress': {
            enum8 = 6;
            break;
          }
          case 'would-block': {
            enum8 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum8 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum8 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum8 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum8 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum8 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum8 = 13;
            break;
          }
          case 'already-attached': {
            enum8 = 14;
            break;
          }
          case 'already-bound': {
            enum8 = 15;
            break;
          }
          case 'already-connected': {
            enum8 = 16;
            break;
          }
          case 'not-bound': {
            enum8 = 17;
            break;
          }
          case 'not-connected': {
            enum8 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum8 = 19;
            break;
          }
          case 'address-in-use': {
            enum8 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum8 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum8 = 22;
            break;
          }
          case 'already-listening': {
            enum8 = 23;
            break;
          }
          case 'not-listening': {
            enum8 = 24;
            break;
          }
          case 'connection-refused': {
            enum8 = 25;
            break;
          }
          case 'connection-reset': {
            enum8 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum8 = 27;
            break;
          }
          case 'invalid-name': {
            enum8 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum8 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum8 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum8 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val8}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg2 + 4, enum8, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline35(arg0, arg1, arg2, arg3) {
    const len2 = arg2;
    const base2 = arg1;
    const result2 = [];
    for (let i = 0; i < len2; i++) {
      const base = base2 + i * 40;
      const ptr0 = dataView(memory0).getInt32(base + 0, true);
      const len0 = dataView(memory0).getInt32(base + 4, true);
      const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
      let variant1;
      switch (dataView(memory0).getUint8(base + 8, true)) {
        case 0: {
          variant1= {
            tag: 'ipv4',
            val: {
              port: clampGuest(dataView(memory0).getUint16(base + 12, true), 0, 65535),
              address: [clampGuest(dataView(memory0).getUint8(base + 14, true), 0, 255), clampGuest(dataView(memory0).getUint8(base + 15, true), 0, 255), clampGuest(dataView(memory0).getUint8(base + 16, true), 0, 255), clampGuest(dataView(memory0).getUint8(base + 17, true), 0, 255)],
            }
          };
          break;
        }
        case 1: {
          variant1= {
            tag: 'ipv6',
            val: {
              port: clampGuest(dataView(memory0).getUint16(base + 12, true), 0, 65535),
              flowInfo: dataView(memory0).getInt32(base + 16, true) >>> 0,
              address: [clampGuest(dataView(memory0).getUint16(base + 20, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 22, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 24, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 26, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 28, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 30, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 32, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 34, true), 0, 65535)],
              scopeId: dataView(memory0).getInt32(base + 36, true) >>> 0,
            }
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for IpSocketAddress');
        }
      }
      result2.push({
        data: result0,
        remoteAddress: variant1,
      });
    }
    let ret;
    try {
      ret = { tag: 'ok', val: send(arg0 >>> 0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        dataView(memory0).setBigInt64(arg3 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const val3 = e;
        let enum3;
        switch (val3) {
          case 'unknown': {
            enum3 = 0;
            break;
          }
          case 'access-denied': {
            enum3 = 1;
            break;
          }
          case 'not-supported': {
            enum3 = 2;
            break;
          }
          case 'out-of-memory': {
            enum3 = 3;
            break;
          }
          case 'timeout': {
            enum3 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum3 = 5;
            break;
          }
          case 'not-in-progress': {
            enum3 = 6;
            break;
          }
          case 'would-block': {
            enum3 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum3 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum3 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum3 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum3 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum3 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum3 = 13;
            break;
          }
          case 'already-attached': {
            enum3 = 14;
            break;
          }
          case 'already-bound': {
            enum3 = 15;
            break;
          }
          case 'already-connected': {
            enum3 = 16;
            break;
          }
          case 'not-bound': {
            enum3 = 17;
            break;
          }
          case 'not-connected': {
            enum3 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum3 = 19;
            break;
          }
          case 'address-in-use': {
            enum3 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum3 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum3 = 22;
            break;
          }
          case 'already-listening': {
            enum3 = 23;
            break;
          }
          case 'not-listening': {
            enum3 = 24;
            break;
          }
          case 'connection-refused': {
            enum3 = 25;
            break;
          }
          case 'connection-reset': {
            enum3 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum3 = 27;
            break;
          }
          case 'invalid-name': {
            enum3 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum3 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum3 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum3 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val3}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg3 + 8, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline36(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: localAddress$1(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant4 = e;
        switch (variant4.tag) {
          case 'ipv4': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            const {port: v0_0, address: v0_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v0_0), true);
            const [tuple1_0, tuple1_1, tuple1_2, tuple1_3] = v0_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple1_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple1_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple1_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple1_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            const {port: v2_0, flowInfo: v2_1, address: v2_2, scopeId: v2_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v2_1), true);
            const [tuple3_0, tuple3_1, tuple3_2, tuple3_3, tuple3_4, tuple3_5, tuple3_6, tuple3_7] = v2_2;
            dataView(memory0).setInt16(arg1 + 16, toUint16(tuple3_0), true);
            dataView(memory0).setInt16(arg1 + 18, toUint16(tuple3_1), true);
            dataView(memory0).setInt16(arg1 + 20, toUint16(tuple3_2), true);
            dataView(memory0).setInt16(arg1 + 22, toUint16(tuple3_3), true);
            dataView(memory0).setInt16(arg1 + 24, toUint16(tuple3_4), true);
            dataView(memory0).setInt16(arg1 + 26, toUint16(tuple3_5), true);
            dataView(memory0).setInt16(arg1 + 28, toUint16(tuple3_6), true);
            dataView(memory0).setInt16(arg1 + 30, toUint16(tuple3_7), true);
            dataView(memory0).setInt32(arg1 + 32, toUint32(v2_3), true);
            break;
          }
          default: {
            throw new TypeError('invalid variant specified for IpSocketAddress');
          }
        }
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val5 = e;
        let enum5;
        switch (val5) {
          case 'unknown': {
            enum5 = 0;
            break;
          }
          case 'access-denied': {
            enum5 = 1;
            break;
          }
          case 'not-supported': {
            enum5 = 2;
            break;
          }
          case 'out-of-memory': {
            enum5 = 3;
            break;
          }
          case 'timeout': {
            enum5 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum5 = 5;
            break;
          }
          case 'not-in-progress': {
            enum5 = 6;
            break;
          }
          case 'would-block': {
            enum5 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum5 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum5 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum5 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum5 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum5 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum5 = 13;
            break;
          }
          case 'already-attached': {
            enum5 = 14;
            break;
          }
          case 'already-bound': {
            enum5 = 15;
            break;
          }
          case 'already-connected': {
            enum5 = 16;
            break;
          }
          case 'not-bound': {
            enum5 = 17;
            break;
          }
          case 'not-connected': {
            enum5 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum5 = 19;
            break;
          }
          case 'address-in-use': {
            enum5 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum5 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum5 = 22;
            break;
          }
          case 'already-listening': {
            enum5 = 23;
            break;
          }
          case 'not-listening': {
            enum5 = 24;
            break;
          }
          case 'connection-refused': {
            enum5 = 25;
            break;
          }
          case 'connection-reset': {
            enum5 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum5 = 27;
            break;
          }
          case 'invalid-name': {
            enum5 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum5 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum5 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum5 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val5}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline37(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: remoteAddress$1(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant4 = e;
        switch (variant4.tag) {
          case 'ipv4': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            const {port: v0_0, address: v0_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v0_0), true);
            const [tuple1_0, tuple1_1, tuple1_2, tuple1_3] = v0_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple1_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple1_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple1_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple1_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            const {port: v2_0, flowInfo: v2_1, address: v2_2, scopeId: v2_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v2_1), true);
            const [tuple3_0, tuple3_1, tuple3_2, tuple3_3, tuple3_4, tuple3_5, tuple3_6, tuple3_7] = v2_2;
            dataView(memory0).setInt16(arg1 + 16, toUint16(tuple3_0), true);
            dataView(memory0).setInt16(arg1 + 18, toUint16(tuple3_1), true);
            dataView(memory0).setInt16(arg1 + 20, toUint16(tuple3_2), true);
            dataView(memory0).setInt16(arg1 + 22, toUint16(tuple3_3), true);
            dataView(memory0).setInt16(arg1 + 24, toUint16(tuple3_4), true);
            dataView(memory0).setInt16(arg1 + 26, toUint16(tuple3_5), true);
            dataView(memory0).setInt16(arg1 + 28, toUint16(tuple3_6), true);
            dataView(memory0).setInt16(arg1 + 30, toUint16(tuple3_7), true);
            dataView(memory0).setInt32(arg1 + 32, toUint32(v2_3), true);
            break;
          }
          default: {
            throw new TypeError('invalid variant specified for IpSocketAddress');
          }
        }
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val5 = e;
        let enum5;
        switch (val5) {
          case 'unknown': {
            enum5 = 0;
            break;
          }
          case 'access-denied': {
            enum5 = 1;
            break;
          }
          case 'not-supported': {
            enum5 = 2;
            break;
          }
          case 'out-of-memory': {
            enum5 = 3;
            break;
          }
          case 'timeout': {
            enum5 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum5 = 5;
            break;
          }
          case 'not-in-progress': {
            enum5 = 6;
            break;
          }
          case 'would-block': {
            enum5 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum5 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum5 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum5 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum5 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum5 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum5 = 13;
            break;
          }
          case 'already-attached': {
            enum5 = 14;
            break;
          }
          case 'already-bound': {
            enum5 = 15;
            break;
          }
          case 'already-connected': {
            enum5 = 16;
            break;
          }
          case 'not-bound': {
            enum5 = 17;
            break;
          }
          case 'not-connected': {
            enum5 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum5 = 19;
            break;
          }
          case 'address-in-use': {
            enum5 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum5 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum5 = 22;
            break;
          }
          case 'already-listening': {
            enum5 = 23;
            break;
          }
          case 'not-listening': {
            enum5 = 24;
            break;
          }
          case 'connection-refused': {
            enum5 = 25;
            break;
          }
          case 'connection-reset': {
            enum5 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum5 = 27;
            break;
          }
          case 'invalid-name': {
            enum5 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum5 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum5 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum5 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val5}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline38(arg0, arg1, arg2) {
    let ret;
    try {
      ret = { tag: 'ok', val: readViaStream(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        dataView(memory0).setInt32(arg2 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'access': {
            enum0 = 0;
            break;
          }
          case 'would-block': {
            enum0 = 1;
            break;
          }
          case 'already': {
            enum0 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum0 = 3;
            break;
          }
          case 'busy': {
            enum0 = 4;
            break;
          }
          case 'deadlock': {
            enum0 = 5;
            break;
          }
          case 'quota': {
            enum0 = 6;
            break;
          }
          case 'exist': {
            enum0 = 7;
            break;
          }
          case 'file-too-large': {
            enum0 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum0 = 9;
            break;
          }
          case 'in-progress': {
            enum0 = 10;
            break;
          }
          case 'interrupted': {
            enum0 = 11;
            break;
          }
          case 'invalid': {
            enum0 = 12;
            break;
          }
          case 'io': {
            enum0 = 13;
            break;
          }
          case 'is-directory': {
            enum0 = 14;
            break;
          }
          case 'loop': {
            enum0 = 15;
            break;
          }
          case 'too-many-links': {
            enum0 = 16;
            break;
          }
          case 'message-size': {
            enum0 = 17;
            break;
          }
          case 'name-too-long': {
            enum0 = 18;
            break;
          }
          case 'no-device': {
            enum0 = 19;
            break;
          }
          case 'no-entry': {
            enum0 = 20;
            break;
          }
          case 'no-lock': {
            enum0 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum0 = 22;
            break;
          }
          case 'insufficient-space': {
            enum0 = 23;
            break;
          }
          case 'not-directory': {
            enum0 = 24;
            break;
          }
          case 'not-empty': {
            enum0 = 25;
            break;
          }
          case 'not-recoverable': {
            enum0 = 26;
            break;
          }
          case 'unsupported': {
            enum0 = 27;
            break;
          }
          case 'no-tty': {
            enum0 = 28;
            break;
          }
          case 'no-such-device': {
            enum0 = 29;
            break;
          }
          case 'overflow': {
            enum0 = 30;
            break;
          }
          case 'not-permitted': {
            enum0 = 31;
            break;
          }
          case 'pipe': {
            enum0 = 32;
            break;
          }
          case 'read-only': {
            enum0 = 33;
            break;
          }
          case 'invalid-seek': {
            enum0 = 34;
            break;
          }
          case 'text-file-busy': {
            enum0 = 35;
            break;
          }
          case 'cross-device': {
            enum0 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg2 + 4, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline39(arg0, arg1, arg2) {
    let ret;
    try {
      ret = { tag: 'ok', val: writeViaStream(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        dataView(memory0).setInt32(arg2 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'access': {
            enum0 = 0;
            break;
          }
          case 'would-block': {
            enum0 = 1;
            break;
          }
          case 'already': {
            enum0 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum0 = 3;
            break;
          }
          case 'busy': {
            enum0 = 4;
            break;
          }
          case 'deadlock': {
            enum0 = 5;
            break;
          }
          case 'quota': {
            enum0 = 6;
            break;
          }
          case 'exist': {
            enum0 = 7;
            break;
          }
          case 'file-too-large': {
            enum0 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum0 = 9;
            break;
          }
          case 'in-progress': {
            enum0 = 10;
            break;
          }
          case 'interrupted': {
            enum0 = 11;
            break;
          }
          case 'invalid': {
            enum0 = 12;
            break;
          }
          case 'io': {
            enum0 = 13;
            break;
          }
          case 'is-directory': {
            enum0 = 14;
            break;
          }
          case 'loop': {
            enum0 = 15;
            break;
          }
          case 'too-many-links': {
            enum0 = 16;
            break;
          }
          case 'message-size': {
            enum0 = 17;
            break;
          }
          case 'name-too-long': {
            enum0 = 18;
            break;
          }
          case 'no-device': {
            enum0 = 19;
            break;
          }
          case 'no-entry': {
            enum0 = 20;
            break;
          }
          case 'no-lock': {
            enum0 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum0 = 22;
            break;
          }
          case 'insufficient-space': {
            enum0 = 23;
            break;
          }
          case 'not-directory': {
            enum0 = 24;
            break;
          }
          case 'not-empty': {
            enum0 = 25;
            break;
          }
          case 'not-recoverable': {
            enum0 = 26;
            break;
          }
          case 'unsupported': {
            enum0 = 27;
            break;
          }
          case 'no-tty': {
            enum0 = 28;
            break;
          }
          case 'no-such-device': {
            enum0 = 29;
            break;
          }
          case 'overflow': {
            enum0 = 30;
            break;
          }
          case 'not-permitted': {
            enum0 = 31;
            break;
          }
          case 'pipe': {
            enum0 = 32;
            break;
          }
          case 'read-only': {
            enum0 = 33;
            break;
          }
          case 'invalid-seek': {
            enum0 = 34;
            break;
          }
          case 'text-file-busy': {
            enum0 = 35;
            break;
          }
          case 'cross-device': {
            enum0 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg2 + 4, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline40(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: appendViaStream(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setInt32(arg1 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'access': {
            enum0 = 0;
            break;
          }
          case 'would-block': {
            enum0 = 1;
            break;
          }
          case 'already': {
            enum0 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum0 = 3;
            break;
          }
          case 'busy': {
            enum0 = 4;
            break;
          }
          case 'deadlock': {
            enum0 = 5;
            break;
          }
          case 'quota': {
            enum0 = 6;
            break;
          }
          case 'exist': {
            enum0 = 7;
            break;
          }
          case 'file-too-large': {
            enum0 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum0 = 9;
            break;
          }
          case 'in-progress': {
            enum0 = 10;
            break;
          }
          case 'interrupted': {
            enum0 = 11;
            break;
          }
          case 'invalid': {
            enum0 = 12;
            break;
          }
          case 'io': {
            enum0 = 13;
            break;
          }
          case 'is-directory': {
            enum0 = 14;
            break;
          }
          case 'loop': {
            enum0 = 15;
            break;
          }
          case 'too-many-links': {
            enum0 = 16;
            break;
          }
          case 'message-size': {
            enum0 = 17;
            break;
          }
          case 'name-too-long': {
            enum0 = 18;
            break;
          }
          case 'no-device': {
            enum0 = 19;
            break;
          }
          case 'no-entry': {
            enum0 = 20;
            break;
          }
          case 'no-lock': {
            enum0 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum0 = 22;
            break;
          }
          case 'insufficient-space': {
            enum0 = 23;
            break;
          }
          case 'not-directory': {
            enum0 = 24;
            break;
          }
          case 'not-empty': {
            enum0 = 25;
            break;
          }
          case 'not-recoverable': {
            enum0 = 26;
            break;
          }
          case 'unsupported': {
            enum0 = 27;
            break;
          }
          case 'no-tty': {
            enum0 = 28;
            break;
          }
          case 'no-such-device': {
            enum0 = 29;
            break;
          }
          case 'overflow': {
            enum0 = 30;
            break;
          }
          case 'not-permitted': {
            enum0 = 31;
            break;
          }
          case 'pipe': {
            enum0 = 32;
            break;
          }
          case 'read-only': {
            enum0 = 33;
            break;
          }
          case 'invalid-seek': {
            enum0 = 34;
            break;
          }
          case 'text-file-busy': {
            enum0 = 35;
            break;
          }
          case 'cross-device': {
            enum0 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline41(arg0, arg1, arg2, arg3, arg4) {
    let enum0;
    switch (arg3) {
      case 0: {
        enum0 = 'normal';
        break;
      }
      case 1: {
        enum0 = 'sequential';
        break;
      }
      case 2: {
        enum0 = 'random';
        break;
      }
      case 3: {
        enum0 = 'will-need';
        break;
      }
      case 4: {
        enum0 = 'dont-need';
        break;
      }
      case 5: {
        enum0 = 'no-reuse';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for Advice');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: advise(arg0 >>> 0, BigInt.asUintN(64, arg1), BigInt.asUintN(64, arg2), enum0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'access': {
            enum1 = 0;
            break;
          }
          case 'would-block': {
            enum1 = 1;
            break;
          }
          case 'already': {
            enum1 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum1 = 3;
            break;
          }
          case 'busy': {
            enum1 = 4;
            break;
          }
          case 'deadlock': {
            enum1 = 5;
            break;
          }
          case 'quota': {
            enum1 = 6;
            break;
          }
          case 'exist': {
            enum1 = 7;
            break;
          }
          case 'file-too-large': {
            enum1 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum1 = 9;
            break;
          }
          case 'in-progress': {
            enum1 = 10;
            break;
          }
          case 'interrupted': {
            enum1 = 11;
            break;
          }
          case 'invalid': {
            enum1 = 12;
            break;
          }
          case 'io': {
            enum1 = 13;
            break;
          }
          case 'is-directory': {
            enum1 = 14;
            break;
          }
          case 'loop': {
            enum1 = 15;
            break;
          }
          case 'too-many-links': {
            enum1 = 16;
            break;
          }
          case 'message-size': {
            enum1 = 17;
            break;
          }
          case 'name-too-long': {
            enum1 = 18;
            break;
          }
          case 'no-device': {
            enum1 = 19;
            break;
          }
          case 'no-entry': {
            enum1 = 20;
            break;
          }
          case 'no-lock': {
            enum1 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum1 = 22;
            break;
          }
          case 'insufficient-space': {
            enum1 = 23;
            break;
          }
          case 'not-directory': {
            enum1 = 24;
            break;
          }
          case 'not-empty': {
            enum1 = 25;
            break;
          }
          case 'not-recoverable': {
            enum1 = 26;
            break;
          }
          case 'unsupported': {
            enum1 = 27;
            break;
          }
          case 'no-tty': {
            enum1 = 28;
            break;
          }
          case 'no-such-device': {
            enum1 = 29;
            break;
          }
          case 'overflow': {
            enum1 = 30;
            break;
          }
          case 'not-permitted': {
            enum1 = 31;
            break;
          }
          case 'pipe': {
            enum1 = 32;
            break;
          }
          case 'read-only': {
            enum1 = 33;
            break;
          }
          case 'invalid-seek': {
            enum1 = 34;
            break;
          }
          case 'text-file-busy': {
            enum1 = 35;
            break;
          }
          case 'cross-device': {
            enum1 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg4 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline42(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: syncData(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'access': {
            enum0 = 0;
            break;
          }
          case 'would-block': {
            enum0 = 1;
            break;
          }
          case 'already': {
            enum0 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum0 = 3;
            break;
          }
          case 'busy': {
            enum0 = 4;
            break;
          }
          case 'deadlock': {
            enum0 = 5;
            break;
          }
          case 'quota': {
            enum0 = 6;
            break;
          }
          case 'exist': {
            enum0 = 7;
            break;
          }
          case 'file-too-large': {
            enum0 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum0 = 9;
            break;
          }
          case 'in-progress': {
            enum0 = 10;
            break;
          }
          case 'interrupted': {
            enum0 = 11;
            break;
          }
          case 'invalid': {
            enum0 = 12;
            break;
          }
          case 'io': {
            enum0 = 13;
            break;
          }
          case 'is-directory': {
            enum0 = 14;
            break;
          }
          case 'loop': {
            enum0 = 15;
            break;
          }
          case 'too-many-links': {
            enum0 = 16;
            break;
          }
          case 'message-size': {
            enum0 = 17;
            break;
          }
          case 'name-too-long': {
            enum0 = 18;
            break;
          }
          case 'no-device': {
            enum0 = 19;
            break;
          }
          case 'no-entry': {
            enum0 = 20;
            break;
          }
          case 'no-lock': {
            enum0 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum0 = 22;
            break;
          }
          case 'insufficient-space': {
            enum0 = 23;
            break;
          }
          case 'not-directory': {
            enum0 = 24;
            break;
          }
          case 'not-empty': {
            enum0 = 25;
            break;
          }
          case 'not-recoverable': {
            enum0 = 26;
            break;
          }
          case 'unsupported': {
            enum0 = 27;
            break;
          }
          case 'no-tty': {
            enum0 = 28;
            break;
          }
          case 'no-such-device': {
            enum0 = 29;
            break;
          }
          case 'overflow': {
            enum0 = 30;
            break;
          }
          case 'not-permitted': {
            enum0 = 31;
            break;
          }
          case 'pipe': {
            enum0 = 32;
            break;
          }
          case 'read-only': {
            enum0 = 33;
            break;
          }
          case 'invalid-seek': {
            enum0 = 34;
            break;
          }
          case 'text-file-busy': {
            enum0 = 35;
            break;
          }
          case 'cross-device': {
            enum0 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline43(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: getFlags(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        let flags0 = 0;
        if (typeof e === 'object' && e !== null) {
          flags0 = Boolean(e.read) << 0 | Boolean(e.write) << 1 | Boolean(e.fileIntegritySync) << 2 | Boolean(e.dataIntegritySync) << 3 | Boolean(e.requestedWriteSync) << 4 | Boolean(e.mutateDirectory) << 5;
        } else if (e !== null && e!== undefined) {
          throw new TypeError('only an object, undefined or null can be converted to flags');
        }
        dataView(memory0).setInt8(arg1 + 1, flags0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'access': {
            enum1 = 0;
            break;
          }
          case 'would-block': {
            enum1 = 1;
            break;
          }
          case 'already': {
            enum1 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum1 = 3;
            break;
          }
          case 'busy': {
            enum1 = 4;
            break;
          }
          case 'deadlock': {
            enum1 = 5;
            break;
          }
          case 'quota': {
            enum1 = 6;
            break;
          }
          case 'exist': {
            enum1 = 7;
            break;
          }
          case 'file-too-large': {
            enum1 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum1 = 9;
            break;
          }
          case 'in-progress': {
            enum1 = 10;
            break;
          }
          case 'interrupted': {
            enum1 = 11;
            break;
          }
          case 'invalid': {
            enum1 = 12;
            break;
          }
          case 'io': {
            enum1 = 13;
            break;
          }
          case 'is-directory': {
            enum1 = 14;
            break;
          }
          case 'loop': {
            enum1 = 15;
            break;
          }
          case 'too-many-links': {
            enum1 = 16;
            break;
          }
          case 'message-size': {
            enum1 = 17;
            break;
          }
          case 'name-too-long': {
            enum1 = 18;
            break;
          }
          case 'no-device': {
            enum1 = 19;
            break;
          }
          case 'no-entry': {
            enum1 = 20;
            break;
          }
          case 'no-lock': {
            enum1 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum1 = 22;
            break;
          }
          case 'insufficient-space': {
            enum1 = 23;
            break;
          }
          case 'not-directory': {
            enum1 = 24;
            break;
          }
          case 'not-empty': {
            enum1 = 25;
            break;
          }
          case 'not-recoverable': {
            enum1 = 26;
            break;
          }
          case 'unsupported': {
            enum1 = 27;
            break;
          }
          case 'no-tty': {
            enum1 = 28;
            break;
          }
          case 'no-such-device': {
            enum1 = 29;
            break;
          }
          case 'overflow': {
            enum1 = 30;
            break;
          }
          case 'not-permitted': {
            enum1 = 31;
            break;
          }
          case 'pipe': {
            enum1 = 32;
            break;
          }
          case 'read-only': {
            enum1 = 33;
            break;
          }
          case 'invalid-seek': {
            enum1 = 34;
            break;
          }
          case 'text-file-busy': {
            enum1 = 35;
            break;
          }
          case 'cross-device': {
            enum1 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline44(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: getType(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'unknown': {
            enum0 = 0;
            break;
          }
          case 'block-device': {
            enum0 = 1;
            break;
          }
          case 'character-device': {
            enum0 = 2;
            break;
          }
          case 'directory': {
            enum0 = 3;
            break;
          }
          case 'fifo': {
            enum0 = 4;
            break;
          }
          case 'symbolic-link': {
            enum0 = 5;
            break;
          }
          case 'regular-file': {
            enum0 = 6;
            break;
          }
          case 'socket': {
            enum0 = 7;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of descriptor-type`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'access': {
            enum1 = 0;
            break;
          }
          case 'would-block': {
            enum1 = 1;
            break;
          }
          case 'already': {
            enum1 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum1 = 3;
            break;
          }
          case 'busy': {
            enum1 = 4;
            break;
          }
          case 'deadlock': {
            enum1 = 5;
            break;
          }
          case 'quota': {
            enum1 = 6;
            break;
          }
          case 'exist': {
            enum1 = 7;
            break;
          }
          case 'file-too-large': {
            enum1 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum1 = 9;
            break;
          }
          case 'in-progress': {
            enum1 = 10;
            break;
          }
          case 'interrupted': {
            enum1 = 11;
            break;
          }
          case 'invalid': {
            enum1 = 12;
            break;
          }
          case 'io': {
            enum1 = 13;
            break;
          }
          case 'is-directory': {
            enum1 = 14;
            break;
          }
          case 'loop': {
            enum1 = 15;
            break;
          }
          case 'too-many-links': {
            enum1 = 16;
            break;
          }
          case 'message-size': {
            enum1 = 17;
            break;
          }
          case 'name-too-long': {
            enum1 = 18;
            break;
          }
          case 'no-device': {
            enum1 = 19;
            break;
          }
          case 'no-entry': {
            enum1 = 20;
            break;
          }
          case 'no-lock': {
            enum1 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum1 = 22;
            break;
          }
          case 'insufficient-space': {
            enum1 = 23;
            break;
          }
          case 'not-directory': {
            enum1 = 24;
            break;
          }
          case 'not-empty': {
            enum1 = 25;
            break;
          }
          case 'not-recoverable': {
            enum1 = 26;
            break;
          }
          case 'unsupported': {
            enum1 = 27;
            break;
          }
          case 'no-tty': {
            enum1 = 28;
            break;
          }
          case 'no-such-device': {
            enum1 = 29;
            break;
          }
          case 'overflow': {
            enum1 = 30;
            break;
          }
          case 'not-permitted': {
            enum1 = 31;
            break;
          }
          case 'pipe': {
            enum1 = 32;
            break;
          }
          case 'read-only': {
            enum1 = 33;
            break;
          }
          case 'invalid-seek': {
            enum1 = 34;
            break;
          }
          case 'text-file-busy': {
            enum1 = 35;
            break;
          }
          case 'cross-device': {
            enum1 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline45(arg0, arg1, arg2) {
    let ret;
    try {
      ret = { tag: 'ok', val: setSize(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'access': {
            enum0 = 0;
            break;
          }
          case 'would-block': {
            enum0 = 1;
            break;
          }
          case 'already': {
            enum0 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum0 = 3;
            break;
          }
          case 'busy': {
            enum0 = 4;
            break;
          }
          case 'deadlock': {
            enum0 = 5;
            break;
          }
          case 'quota': {
            enum0 = 6;
            break;
          }
          case 'exist': {
            enum0 = 7;
            break;
          }
          case 'file-too-large': {
            enum0 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum0 = 9;
            break;
          }
          case 'in-progress': {
            enum0 = 10;
            break;
          }
          case 'interrupted': {
            enum0 = 11;
            break;
          }
          case 'invalid': {
            enum0 = 12;
            break;
          }
          case 'io': {
            enum0 = 13;
            break;
          }
          case 'is-directory': {
            enum0 = 14;
            break;
          }
          case 'loop': {
            enum0 = 15;
            break;
          }
          case 'too-many-links': {
            enum0 = 16;
            break;
          }
          case 'message-size': {
            enum0 = 17;
            break;
          }
          case 'name-too-long': {
            enum0 = 18;
            break;
          }
          case 'no-device': {
            enum0 = 19;
            break;
          }
          case 'no-entry': {
            enum0 = 20;
            break;
          }
          case 'no-lock': {
            enum0 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum0 = 22;
            break;
          }
          case 'insufficient-space': {
            enum0 = 23;
            break;
          }
          case 'not-directory': {
            enum0 = 24;
            break;
          }
          case 'not-empty': {
            enum0 = 25;
            break;
          }
          case 'not-recoverable': {
            enum0 = 26;
            break;
          }
          case 'unsupported': {
            enum0 = 27;
            break;
          }
          case 'no-tty': {
            enum0 = 28;
            break;
          }
          case 'no-such-device': {
            enum0 = 29;
            break;
          }
          case 'overflow': {
            enum0 = 30;
            break;
          }
          case 'not-permitted': {
            enum0 = 31;
            break;
          }
          case 'pipe': {
            enum0 = 32;
            break;
          }
          case 'read-only': {
            enum0 = 33;
            break;
          }
          case 'invalid-seek': {
            enum0 = 34;
            break;
          }
          case 'text-file-busy': {
            enum0 = 35;
            break;
          }
          case 'cross-device': {
            enum0 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg2 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline46(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    let variant0;
    switch (arg1) {
      case 0: {
        variant0= {
          tag: 'no-change',
        };
        break;
      }
      case 1: {
        variant0= {
          tag: 'now',
        };
        break;
      }
      case 2: {
        variant0= {
          tag: 'timestamp',
          val: {
            seconds: BigInt.asUintN(64, arg2),
            nanoseconds: arg3 >>> 0,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for NewTimestamp');
      }
    }
    let variant1;
    switch (arg4) {
      case 0: {
        variant1= {
          tag: 'no-change',
        };
        break;
      }
      case 1: {
        variant1= {
          tag: 'now',
        };
        break;
      }
      case 2: {
        variant1= {
          tag: 'timestamp',
          val: {
            seconds: BigInt.asUintN(64, arg5),
            nanoseconds: arg6 >>> 0,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for NewTimestamp');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: setTimes(arg0 >>> 0, variant0, variant1) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg7 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg7 + 0, 1, true);
        const val2 = e;
        let enum2;
        switch (val2) {
          case 'access': {
            enum2 = 0;
            break;
          }
          case 'would-block': {
            enum2 = 1;
            break;
          }
          case 'already': {
            enum2 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum2 = 3;
            break;
          }
          case 'busy': {
            enum2 = 4;
            break;
          }
          case 'deadlock': {
            enum2 = 5;
            break;
          }
          case 'quota': {
            enum2 = 6;
            break;
          }
          case 'exist': {
            enum2 = 7;
            break;
          }
          case 'file-too-large': {
            enum2 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum2 = 9;
            break;
          }
          case 'in-progress': {
            enum2 = 10;
            break;
          }
          case 'interrupted': {
            enum2 = 11;
            break;
          }
          case 'invalid': {
            enum2 = 12;
            break;
          }
          case 'io': {
            enum2 = 13;
            break;
          }
          case 'is-directory': {
            enum2 = 14;
            break;
          }
          case 'loop': {
            enum2 = 15;
            break;
          }
          case 'too-many-links': {
            enum2 = 16;
            break;
          }
          case 'message-size': {
            enum2 = 17;
            break;
          }
          case 'name-too-long': {
            enum2 = 18;
            break;
          }
          case 'no-device': {
            enum2 = 19;
            break;
          }
          case 'no-entry': {
            enum2 = 20;
            break;
          }
          case 'no-lock': {
            enum2 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum2 = 22;
            break;
          }
          case 'insufficient-space': {
            enum2 = 23;
            break;
          }
          case 'not-directory': {
            enum2 = 24;
            break;
          }
          case 'not-empty': {
            enum2 = 25;
            break;
          }
          case 'not-recoverable': {
            enum2 = 26;
            break;
          }
          case 'unsupported': {
            enum2 = 27;
            break;
          }
          case 'no-tty': {
            enum2 = 28;
            break;
          }
          case 'no-such-device': {
            enum2 = 29;
            break;
          }
          case 'overflow': {
            enum2 = 30;
            break;
          }
          case 'not-permitted': {
            enum2 = 31;
            break;
          }
          case 'pipe': {
            enum2 = 32;
            break;
          }
          case 'read-only': {
            enum2 = 33;
            break;
          }
          case 'invalid-seek': {
            enum2 = 34;
            break;
          }
          case 'text-file-busy': {
            enum2 = 35;
            break;
          }
          case 'cross-device': {
            enum2 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg7 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline47(arg0, arg1, arg2, arg3) {
    let ret;
    try {
      ret = { tag: 'ok', val: read(arg0 >>> 0, BigInt.asUintN(64, arg1), BigInt.asUintN(64, arg2)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        const [tuple0_0, tuple0_1] = e;
        const val1 = tuple0_0;
        const len1 = val1.byteLength;
        const ptr1 = realloc0(0, 0, 1, len1 * 1);
        const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
        (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
        dataView(memory0).setInt32(arg3 + 8, len1, true);
        dataView(memory0).setInt32(arg3 + 4, ptr1, true);
        dataView(memory0).setInt8(arg3 + 12, tuple0_1 ? 1 : 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const val2 = e;
        let enum2;
        switch (val2) {
          case 'access': {
            enum2 = 0;
            break;
          }
          case 'would-block': {
            enum2 = 1;
            break;
          }
          case 'already': {
            enum2 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum2 = 3;
            break;
          }
          case 'busy': {
            enum2 = 4;
            break;
          }
          case 'deadlock': {
            enum2 = 5;
            break;
          }
          case 'quota': {
            enum2 = 6;
            break;
          }
          case 'exist': {
            enum2 = 7;
            break;
          }
          case 'file-too-large': {
            enum2 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum2 = 9;
            break;
          }
          case 'in-progress': {
            enum2 = 10;
            break;
          }
          case 'interrupted': {
            enum2 = 11;
            break;
          }
          case 'invalid': {
            enum2 = 12;
            break;
          }
          case 'io': {
            enum2 = 13;
            break;
          }
          case 'is-directory': {
            enum2 = 14;
            break;
          }
          case 'loop': {
            enum2 = 15;
            break;
          }
          case 'too-many-links': {
            enum2 = 16;
            break;
          }
          case 'message-size': {
            enum2 = 17;
            break;
          }
          case 'name-too-long': {
            enum2 = 18;
            break;
          }
          case 'no-device': {
            enum2 = 19;
            break;
          }
          case 'no-entry': {
            enum2 = 20;
            break;
          }
          case 'no-lock': {
            enum2 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum2 = 22;
            break;
          }
          case 'insufficient-space': {
            enum2 = 23;
            break;
          }
          case 'not-directory': {
            enum2 = 24;
            break;
          }
          case 'not-empty': {
            enum2 = 25;
            break;
          }
          case 'not-recoverable': {
            enum2 = 26;
            break;
          }
          case 'unsupported': {
            enum2 = 27;
            break;
          }
          case 'no-tty': {
            enum2 = 28;
            break;
          }
          case 'no-such-device': {
            enum2 = 29;
            break;
          }
          case 'overflow': {
            enum2 = 30;
            break;
          }
          case 'not-permitted': {
            enum2 = 31;
            break;
          }
          case 'pipe': {
            enum2 = 32;
            break;
          }
          case 'read-only': {
            enum2 = 33;
            break;
          }
          case 'invalid-seek': {
            enum2 = 34;
            break;
          }
          case 'text-file-busy': {
            enum2 = 35;
            break;
          }
          case 'cross-device': {
            enum2 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg3 + 4, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline48(arg0, arg1, arg2, arg3, arg4) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: write(arg0 >>> 0, result0, BigInt.asUintN(64, arg3)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        dataView(memory0).setBigInt64(arg4 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'access': {
            enum1 = 0;
            break;
          }
          case 'would-block': {
            enum1 = 1;
            break;
          }
          case 'already': {
            enum1 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum1 = 3;
            break;
          }
          case 'busy': {
            enum1 = 4;
            break;
          }
          case 'deadlock': {
            enum1 = 5;
            break;
          }
          case 'quota': {
            enum1 = 6;
            break;
          }
          case 'exist': {
            enum1 = 7;
            break;
          }
          case 'file-too-large': {
            enum1 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum1 = 9;
            break;
          }
          case 'in-progress': {
            enum1 = 10;
            break;
          }
          case 'interrupted': {
            enum1 = 11;
            break;
          }
          case 'invalid': {
            enum1 = 12;
            break;
          }
          case 'io': {
            enum1 = 13;
            break;
          }
          case 'is-directory': {
            enum1 = 14;
            break;
          }
          case 'loop': {
            enum1 = 15;
            break;
          }
          case 'too-many-links': {
            enum1 = 16;
            break;
          }
          case 'message-size': {
            enum1 = 17;
            break;
          }
          case 'name-too-long': {
            enum1 = 18;
            break;
          }
          case 'no-device': {
            enum1 = 19;
            break;
          }
          case 'no-entry': {
            enum1 = 20;
            break;
          }
          case 'no-lock': {
            enum1 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum1 = 22;
            break;
          }
          case 'insufficient-space': {
            enum1 = 23;
            break;
          }
          case 'not-directory': {
            enum1 = 24;
            break;
          }
          case 'not-empty': {
            enum1 = 25;
            break;
          }
          case 'not-recoverable': {
            enum1 = 26;
            break;
          }
          case 'unsupported': {
            enum1 = 27;
            break;
          }
          case 'no-tty': {
            enum1 = 28;
            break;
          }
          case 'no-such-device': {
            enum1 = 29;
            break;
          }
          case 'overflow': {
            enum1 = 30;
            break;
          }
          case 'not-permitted': {
            enum1 = 31;
            break;
          }
          case 'pipe': {
            enum1 = 32;
            break;
          }
          case 'read-only': {
            enum1 = 33;
            break;
          }
          case 'invalid-seek': {
            enum1 = 34;
            break;
          }
          case 'text-file-busy': {
            enum1 = 35;
            break;
          }
          case 'cross-device': {
            enum1 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg4 + 8, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline49(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: readDirectory(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setInt32(arg1 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'access': {
            enum0 = 0;
            break;
          }
          case 'would-block': {
            enum0 = 1;
            break;
          }
          case 'already': {
            enum0 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum0 = 3;
            break;
          }
          case 'busy': {
            enum0 = 4;
            break;
          }
          case 'deadlock': {
            enum0 = 5;
            break;
          }
          case 'quota': {
            enum0 = 6;
            break;
          }
          case 'exist': {
            enum0 = 7;
            break;
          }
          case 'file-too-large': {
            enum0 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum0 = 9;
            break;
          }
          case 'in-progress': {
            enum0 = 10;
            break;
          }
          case 'interrupted': {
            enum0 = 11;
            break;
          }
          case 'invalid': {
            enum0 = 12;
            break;
          }
          case 'io': {
            enum0 = 13;
            break;
          }
          case 'is-directory': {
            enum0 = 14;
            break;
          }
          case 'loop': {
            enum0 = 15;
            break;
          }
          case 'too-many-links': {
            enum0 = 16;
            break;
          }
          case 'message-size': {
            enum0 = 17;
            break;
          }
          case 'name-too-long': {
            enum0 = 18;
            break;
          }
          case 'no-device': {
            enum0 = 19;
            break;
          }
          case 'no-entry': {
            enum0 = 20;
            break;
          }
          case 'no-lock': {
            enum0 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum0 = 22;
            break;
          }
          case 'insufficient-space': {
            enum0 = 23;
            break;
          }
          case 'not-directory': {
            enum0 = 24;
            break;
          }
          case 'not-empty': {
            enum0 = 25;
            break;
          }
          case 'not-recoverable': {
            enum0 = 26;
            break;
          }
          case 'unsupported': {
            enum0 = 27;
            break;
          }
          case 'no-tty': {
            enum0 = 28;
            break;
          }
          case 'no-such-device': {
            enum0 = 29;
            break;
          }
          case 'overflow': {
            enum0 = 30;
            break;
          }
          case 'not-permitted': {
            enum0 = 31;
            break;
          }
          case 'pipe': {
            enum0 = 32;
            break;
          }
          case 'read-only': {
            enum0 = 33;
            break;
          }
          case 'invalid-seek': {
            enum0 = 34;
            break;
          }
          case 'text-file-busy': {
            enum0 = 35;
            break;
          }
          case 'cross-device': {
            enum0 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline50(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: sync(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'access': {
            enum0 = 0;
            break;
          }
          case 'would-block': {
            enum0 = 1;
            break;
          }
          case 'already': {
            enum0 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum0 = 3;
            break;
          }
          case 'busy': {
            enum0 = 4;
            break;
          }
          case 'deadlock': {
            enum0 = 5;
            break;
          }
          case 'quota': {
            enum0 = 6;
            break;
          }
          case 'exist': {
            enum0 = 7;
            break;
          }
          case 'file-too-large': {
            enum0 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum0 = 9;
            break;
          }
          case 'in-progress': {
            enum0 = 10;
            break;
          }
          case 'interrupted': {
            enum0 = 11;
            break;
          }
          case 'invalid': {
            enum0 = 12;
            break;
          }
          case 'io': {
            enum0 = 13;
            break;
          }
          case 'is-directory': {
            enum0 = 14;
            break;
          }
          case 'loop': {
            enum0 = 15;
            break;
          }
          case 'too-many-links': {
            enum0 = 16;
            break;
          }
          case 'message-size': {
            enum0 = 17;
            break;
          }
          case 'name-too-long': {
            enum0 = 18;
            break;
          }
          case 'no-device': {
            enum0 = 19;
            break;
          }
          case 'no-entry': {
            enum0 = 20;
            break;
          }
          case 'no-lock': {
            enum0 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum0 = 22;
            break;
          }
          case 'insufficient-space': {
            enum0 = 23;
            break;
          }
          case 'not-directory': {
            enum0 = 24;
            break;
          }
          case 'not-empty': {
            enum0 = 25;
            break;
          }
          case 'not-recoverable': {
            enum0 = 26;
            break;
          }
          case 'unsupported': {
            enum0 = 27;
            break;
          }
          case 'no-tty': {
            enum0 = 28;
            break;
          }
          case 'no-such-device': {
            enum0 = 29;
            break;
          }
          case 'overflow': {
            enum0 = 30;
            break;
          }
          case 'not-permitted': {
            enum0 = 31;
            break;
          }
          case 'pipe': {
            enum0 = 32;
            break;
          }
          case 'read-only': {
            enum0 = 33;
            break;
          }
          case 'invalid-seek': {
            enum0 = 34;
            break;
          }
          case 'text-file-busy': {
            enum0 = 35;
            break;
          }
          case 'cross-device': {
            enum0 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline51(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    let ret;
    try {
      ret = { tag: 'ok', val: createDirectoryAt(arg0 >>> 0, result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'access': {
            enum1 = 0;
            break;
          }
          case 'would-block': {
            enum1 = 1;
            break;
          }
          case 'already': {
            enum1 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum1 = 3;
            break;
          }
          case 'busy': {
            enum1 = 4;
            break;
          }
          case 'deadlock': {
            enum1 = 5;
            break;
          }
          case 'quota': {
            enum1 = 6;
            break;
          }
          case 'exist': {
            enum1 = 7;
            break;
          }
          case 'file-too-large': {
            enum1 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum1 = 9;
            break;
          }
          case 'in-progress': {
            enum1 = 10;
            break;
          }
          case 'interrupted': {
            enum1 = 11;
            break;
          }
          case 'invalid': {
            enum1 = 12;
            break;
          }
          case 'io': {
            enum1 = 13;
            break;
          }
          case 'is-directory': {
            enum1 = 14;
            break;
          }
          case 'loop': {
            enum1 = 15;
            break;
          }
          case 'too-many-links': {
            enum1 = 16;
            break;
          }
          case 'message-size': {
            enum1 = 17;
            break;
          }
          case 'name-too-long': {
            enum1 = 18;
            break;
          }
          case 'no-device': {
            enum1 = 19;
            break;
          }
          case 'no-entry': {
            enum1 = 20;
            break;
          }
          case 'no-lock': {
            enum1 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum1 = 22;
            break;
          }
          case 'insufficient-space': {
            enum1 = 23;
            break;
          }
          case 'not-directory': {
            enum1 = 24;
            break;
          }
          case 'not-empty': {
            enum1 = 25;
            break;
          }
          case 'not-recoverable': {
            enum1 = 26;
            break;
          }
          case 'unsupported': {
            enum1 = 27;
            break;
          }
          case 'no-tty': {
            enum1 = 28;
            break;
          }
          case 'no-such-device': {
            enum1 = 29;
            break;
          }
          case 'overflow': {
            enum1 = 30;
            break;
          }
          case 'not-permitted': {
            enum1 = 31;
            break;
          }
          case 'pipe': {
            enum1 = 32;
            break;
          }
          case 'read-only': {
            enum1 = 33;
            break;
          }
          case 'invalid-seek': {
            enum1 = 34;
            break;
          }
          case 'text-file-busy': {
            enum1 = 35;
            break;
          }
          case 'cross-device': {
            enum1 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg3 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline52(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: stat(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const {type: v0_0, linkCount: v0_1, size: v0_2, dataAccessTimestamp: v0_3, dataModificationTimestamp: v0_4, statusChangeTimestamp: v0_5 } = e;
        const val1 = v0_0;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'block-device': {
            enum1 = 1;
            break;
          }
          case 'character-device': {
            enum1 = 2;
            break;
          }
          case 'directory': {
            enum1 = 3;
            break;
          }
          case 'fifo': {
            enum1 = 4;
            break;
          }
          case 'symbolic-link': {
            enum1 = 5;
            break;
          }
          case 'regular-file': {
            enum1 = 6;
            break;
          }
          case 'socket': {
            enum1 = 7;
            break;
          }
          default: {
            if ((v0_0) instanceof Error) {
              console.error(v0_0);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of descriptor-type`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum1, true);
        dataView(memory0).setBigInt64(arg1 + 16, toUint64(v0_1), true);
        dataView(memory0).setBigInt64(arg1 + 24, toUint64(v0_2), true);
        const {seconds: v2_0, nanoseconds: v2_1 } = v0_3;
        dataView(memory0).setBigInt64(arg1 + 32, toUint64(v2_0), true);
        dataView(memory0).setInt32(arg1 + 40, toUint32(v2_1), true);
        const {seconds: v3_0, nanoseconds: v3_1 } = v0_4;
        dataView(memory0).setBigInt64(arg1 + 48, toUint64(v3_0), true);
        dataView(memory0).setInt32(arg1 + 56, toUint32(v3_1), true);
        const {seconds: v4_0, nanoseconds: v4_1 } = v0_5;
        dataView(memory0).setBigInt64(arg1 + 64, toUint64(v4_0), true);
        dataView(memory0).setInt32(arg1 + 72, toUint32(v4_1), true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val5 = e;
        let enum5;
        switch (val5) {
          case 'access': {
            enum5 = 0;
            break;
          }
          case 'would-block': {
            enum5 = 1;
            break;
          }
          case 'already': {
            enum5 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum5 = 3;
            break;
          }
          case 'busy': {
            enum5 = 4;
            break;
          }
          case 'deadlock': {
            enum5 = 5;
            break;
          }
          case 'quota': {
            enum5 = 6;
            break;
          }
          case 'exist': {
            enum5 = 7;
            break;
          }
          case 'file-too-large': {
            enum5 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum5 = 9;
            break;
          }
          case 'in-progress': {
            enum5 = 10;
            break;
          }
          case 'interrupted': {
            enum5 = 11;
            break;
          }
          case 'invalid': {
            enum5 = 12;
            break;
          }
          case 'io': {
            enum5 = 13;
            break;
          }
          case 'is-directory': {
            enum5 = 14;
            break;
          }
          case 'loop': {
            enum5 = 15;
            break;
          }
          case 'too-many-links': {
            enum5 = 16;
            break;
          }
          case 'message-size': {
            enum5 = 17;
            break;
          }
          case 'name-too-long': {
            enum5 = 18;
            break;
          }
          case 'no-device': {
            enum5 = 19;
            break;
          }
          case 'no-entry': {
            enum5 = 20;
            break;
          }
          case 'no-lock': {
            enum5 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum5 = 22;
            break;
          }
          case 'insufficient-space': {
            enum5 = 23;
            break;
          }
          case 'not-directory': {
            enum5 = 24;
            break;
          }
          case 'not-empty': {
            enum5 = 25;
            break;
          }
          case 'not-recoverable': {
            enum5 = 26;
            break;
          }
          case 'unsupported': {
            enum5 = 27;
            break;
          }
          case 'no-tty': {
            enum5 = 28;
            break;
          }
          case 'no-such-device': {
            enum5 = 29;
            break;
          }
          case 'overflow': {
            enum5 = 30;
            break;
          }
          case 'not-permitted': {
            enum5 = 31;
            break;
          }
          case 'pipe': {
            enum5 = 32;
            break;
          }
          case 'read-only': {
            enum5 = 33;
            break;
          }
          case 'invalid-seek': {
            enum5 = 34;
            break;
          }
          case 'text-file-busy': {
            enum5 = 35;
            break;
          }
          case 'cross-device': {
            enum5 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val5}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline53(arg0, arg1, arg2, arg3, arg4) {
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags0 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr1 = arg2;
    const len1 = arg3;
    const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
    let ret;
    try {
      ret = { tag: 'ok', val: statAt(arg0 >>> 0, flags0, result1) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        const {type: v2_0, linkCount: v2_1, size: v2_2, dataAccessTimestamp: v2_3, dataModificationTimestamp: v2_4, statusChangeTimestamp: v2_5 } = e;
        const val3 = v2_0;
        let enum3;
        switch (val3) {
          case 'unknown': {
            enum3 = 0;
            break;
          }
          case 'block-device': {
            enum3 = 1;
            break;
          }
          case 'character-device': {
            enum3 = 2;
            break;
          }
          case 'directory': {
            enum3 = 3;
            break;
          }
          case 'fifo': {
            enum3 = 4;
            break;
          }
          case 'symbolic-link': {
            enum3 = 5;
            break;
          }
          case 'regular-file': {
            enum3 = 6;
            break;
          }
          case 'socket': {
            enum3 = 7;
            break;
          }
          default: {
            if ((v2_0) instanceof Error) {
              console.error(v2_0);
            }
            
            throw new TypeError(`"${val3}" is not one of the cases of descriptor-type`);
          }
        }
        dataView(memory0).setInt8(arg4 + 8, enum3, true);
        dataView(memory0).setBigInt64(arg4 + 16, toUint64(v2_1), true);
        dataView(memory0).setBigInt64(arg4 + 24, toUint64(v2_2), true);
        const {seconds: v4_0, nanoseconds: v4_1 } = v2_3;
        dataView(memory0).setBigInt64(arg4 + 32, toUint64(v4_0), true);
        dataView(memory0).setInt32(arg4 + 40, toUint32(v4_1), true);
        const {seconds: v5_0, nanoseconds: v5_1 } = v2_4;
        dataView(memory0).setBigInt64(arg4 + 48, toUint64(v5_0), true);
        dataView(memory0).setInt32(arg4 + 56, toUint32(v5_1), true);
        const {seconds: v6_0, nanoseconds: v6_1 } = v2_5;
        dataView(memory0).setBigInt64(arg4 + 64, toUint64(v6_0), true);
        dataView(memory0).setInt32(arg4 + 72, toUint32(v6_1), true);
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        const val7 = e;
        let enum7;
        switch (val7) {
          case 'access': {
            enum7 = 0;
            break;
          }
          case 'would-block': {
            enum7 = 1;
            break;
          }
          case 'already': {
            enum7 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum7 = 3;
            break;
          }
          case 'busy': {
            enum7 = 4;
            break;
          }
          case 'deadlock': {
            enum7 = 5;
            break;
          }
          case 'quota': {
            enum7 = 6;
            break;
          }
          case 'exist': {
            enum7 = 7;
            break;
          }
          case 'file-too-large': {
            enum7 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum7 = 9;
            break;
          }
          case 'in-progress': {
            enum7 = 10;
            break;
          }
          case 'interrupted': {
            enum7 = 11;
            break;
          }
          case 'invalid': {
            enum7 = 12;
            break;
          }
          case 'io': {
            enum7 = 13;
            break;
          }
          case 'is-directory': {
            enum7 = 14;
            break;
          }
          case 'loop': {
            enum7 = 15;
            break;
          }
          case 'too-many-links': {
            enum7 = 16;
            break;
          }
          case 'message-size': {
            enum7 = 17;
            break;
          }
          case 'name-too-long': {
            enum7 = 18;
            break;
          }
          case 'no-device': {
            enum7 = 19;
            break;
          }
          case 'no-entry': {
            enum7 = 20;
            break;
          }
          case 'no-lock': {
            enum7 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum7 = 22;
            break;
          }
          case 'insufficient-space': {
            enum7 = 23;
            break;
          }
          case 'not-directory': {
            enum7 = 24;
            break;
          }
          case 'not-empty': {
            enum7 = 25;
            break;
          }
          case 'not-recoverable': {
            enum7 = 26;
            break;
          }
          case 'unsupported': {
            enum7 = 27;
            break;
          }
          case 'no-tty': {
            enum7 = 28;
            break;
          }
          case 'no-such-device': {
            enum7 = 29;
            break;
          }
          case 'overflow': {
            enum7 = 30;
            break;
          }
          case 'not-permitted': {
            enum7 = 31;
            break;
          }
          case 'pipe': {
            enum7 = 32;
            break;
          }
          case 'read-only': {
            enum7 = 33;
            break;
          }
          case 'invalid-seek': {
            enum7 = 34;
            break;
          }
          case 'text-file-busy': {
            enum7 = 35;
            break;
          }
          case 'cross-device': {
            enum7 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val7}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg4 + 8, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline54(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags0 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr1 = arg2;
    const len1 = arg3;
    const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
    let variant2;
    switch (arg4) {
      case 0: {
        variant2= {
          tag: 'no-change',
        };
        break;
      }
      case 1: {
        variant2= {
          tag: 'now',
        };
        break;
      }
      case 2: {
        variant2= {
          tag: 'timestamp',
          val: {
            seconds: BigInt.asUintN(64, arg5),
            nanoseconds: arg6 >>> 0,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for NewTimestamp');
      }
    }
    let variant3;
    switch (arg7) {
      case 0: {
        variant3= {
          tag: 'no-change',
        };
        break;
      }
      case 1: {
        variant3= {
          tag: 'now',
        };
        break;
      }
      case 2: {
        variant3= {
          tag: 'timestamp',
          val: {
            seconds: BigInt.asUintN(64, arg8),
            nanoseconds: arg9 >>> 0,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for NewTimestamp');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: setTimesAt(arg0 >>> 0, flags0, result1, variant2, variant3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg10 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg10 + 0, 1, true);
        const val4 = e;
        let enum4;
        switch (val4) {
          case 'access': {
            enum4 = 0;
            break;
          }
          case 'would-block': {
            enum4 = 1;
            break;
          }
          case 'already': {
            enum4 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum4 = 3;
            break;
          }
          case 'busy': {
            enum4 = 4;
            break;
          }
          case 'deadlock': {
            enum4 = 5;
            break;
          }
          case 'quota': {
            enum4 = 6;
            break;
          }
          case 'exist': {
            enum4 = 7;
            break;
          }
          case 'file-too-large': {
            enum4 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum4 = 9;
            break;
          }
          case 'in-progress': {
            enum4 = 10;
            break;
          }
          case 'interrupted': {
            enum4 = 11;
            break;
          }
          case 'invalid': {
            enum4 = 12;
            break;
          }
          case 'io': {
            enum4 = 13;
            break;
          }
          case 'is-directory': {
            enum4 = 14;
            break;
          }
          case 'loop': {
            enum4 = 15;
            break;
          }
          case 'too-many-links': {
            enum4 = 16;
            break;
          }
          case 'message-size': {
            enum4 = 17;
            break;
          }
          case 'name-too-long': {
            enum4 = 18;
            break;
          }
          case 'no-device': {
            enum4 = 19;
            break;
          }
          case 'no-entry': {
            enum4 = 20;
            break;
          }
          case 'no-lock': {
            enum4 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum4 = 22;
            break;
          }
          case 'insufficient-space': {
            enum4 = 23;
            break;
          }
          case 'not-directory': {
            enum4 = 24;
            break;
          }
          case 'not-empty': {
            enum4 = 25;
            break;
          }
          case 'not-recoverable': {
            enum4 = 26;
            break;
          }
          case 'unsupported': {
            enum4 = 27;
            break;
          }
          case 'no-tty': {
            enum4 = 28;
            break;
          }
          case 'no-such-device': {
            enum4 = 29;
            break;
          }
          case 'overflow': {
            enum4 = 30;
            break;
          }
          case 'not-permitted': {
            enum4 = 31;
            break;
          }
          case 'pipe': {
            enum4 = 32;
            break;
          }
          case 'read-only': {
            enum4 = 33;
            break;
          }
          case 'invalid-seek': {
            enum4 = 34;
            break;
          }
          case 'text-file-busy': {
            enum4 = 35;
            break;
          }
          case 'cross-device': {
            enum4 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val4}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg10 + 1, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline55(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags0 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr1 = arg2;
    const len1 = arg3;
    const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
    const ptr2 = arg5;
    const len2 = arg6;
    const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: linkAt(arg0 >>> 0, flags0, result1, arg4 >>> 0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg7 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg7 + 0, 1, true);
        const val3 = e;
        let enum3;
        switch (val3) {
          case 'access': {
            enum3 = 0;
            break;
          }
          case 'would-block': {
            enum3 = 1;
            break;
          }
          case 'already': {
            enum3 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum3 = 3;
            break;
          }
          case 'busy': {
            enum3 = 4;
            break;
          }
          case 'deadlock': {
            enum3 = 5;
            break;
          }
          case 'quota': {
            enum3 = 6;
            break;
          }
          case 'exist': {
            enum3 = 7;
            break;
          }
          case 'file-too-large': {
            enum3 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum3 = 9;
            break;
          }
          case 'in-progress': {
            enum3 = 10;
            break;
          }
          case 'interrupted': {
            enum3 = 11;
            break;
          }
          case 'invalid': {
            enum3 = 12;
            break;
          }
          case 'io': {
            enum3 = 13;
            break;
          }
          case 'is-directory': {
            enum3 = 14;
            break;
          }
          case 'loop': {
            enum3 = 15;
            break;
          }
          case 'too-many-links': {
            enum3 = 16;
            break;
          }
          case 'message-size': {
            enum3 = 17;
            break;
          }
          case 'name-too-long': {
            enum3 = 18;
            break;
          }
          case 'no-device': {
            enum3 = 19;
            break;
          }
          case 'no-entry': {
            enum3 = 20;
            break;
          }
          case 'no-lock': {
            enum3 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum3 = 22;
            break;
          }
          case 'insufficient-space': {
            enum3 = 23;
            break;
          }
          case 'not-directory': {
            enum3 = 24;
            break;
          }
          case 'not-empty': {
            enum3 = 25;
            break;
          }
          case 'not-recoverable': {
            enum3 = 26;
            break;
          }
          case 'unsupported': {
            enum3 = 27;
            break;
          }
          case 'no-tty': {
            enum3 = 28;
            break;
          }
          case 'no-such-device': {
            enum3 = 29;
            break;
          }
          case 'overflow': {
            enum3 = 30;
            break;
          }
          case 'not-permitted': {
            enum3 = 31;
            break;
          }
          case 'pipe': {
            enum3 = 32;
            break;
          }
          case 'read-only': {
            enum3 = 33;
            break;
          }
          case 'invalid-seek': {
            enum3 = 34;
            break;
          }
          case 'text-file-busy': {
            enum3 = 35;
            break;
          }
          case 'cross-device': {
            enum3 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val3}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg7 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline56(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags0 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr1 = arg2;
    const len1 = arg3;
    const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
    if ((arg4 & 4294967280) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags2 = {
      create: Boolean(arg4 & 1),
      directory: Boolean(arg4 & 2),
      exclusive: Boolean(arg4 & 4),
      truncate: Boolean(arg4 & 8),
    };
    if ((arg5 & 4294967232) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags3 = {
      read: Boolean(arg5 & 1),
      write: Boolean(arg5 & 2),
      fileIntegritySync: Boolean(arg5 & 4),
      dataIntegritySync: Boolean(arg5 & 8),
      requestedWriteSync: Boolean(arg5 & 16),
      mutateDirectory: Boolean(arg5 & 32),
    };
    if ((arg6 & 4294967288) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags4 = {
      readable: Boolean(arg6 & 1),
      writable: Boolean(arg6 & 2),
      executable: Boolean(arg6 & 4),
    };
    let ret;
    try {
      ret = { tag: 'ok', val: openAt(arg0 >>> 0, flags0, result1, flags2, flags3, flags4) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg7 + 0, 0, true);
        dataView(memory0).setInt32(arg7 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg7 + 0, 1, true);
        const val5 = e;
        let enum5;
        switch (val5) {
          case 'access': {
            enum5 = 0;
            break;
          }
          case 'would-block': {
            enum5 = 1;
            break;
          }
          case 'already': {
            enum5 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum5 = 3;
            break;
          }
          case 'busy': {
            enum5 = 4;
            break;
          }
          case 'deadlock': {
            enum5 = 5;
            break;
          }
          case 'quota': {
            enum5 = 6;
            break;
          }
          case 'exist': {
            enum5 = 7;
            break;
          }
          case 'file-too-large': {
            enum5 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum5 = 9;
            break;
          }
          case 'in-progress': {
            enum5 = 10;
            break;
          }
          case 'interrupted': {
            enum5 = 11;
            break;
          }
          case 'invalid': {
            enum5 = 12;
            break;
          }
          case 'io': {
            enum5 = 13;
            break;
          }
          case 'is-directory': {
            enum5 = 14;
            break;
          }
          case 'loop': {
            enum5 = 15;
            break;
          }
          case 'too-many-links': {
            enum5 = 16;
            break;
          }
          case 'message-size': {
            enum5 = 17;
            break;
          }
          case 'name-too-long': {
            enum5 = 18;
            break;
          }
          case 'no-device': {
            enum5 = 19;
            break;
          }
          case 'no-entry': {
            enum5 = 20;
            break;
          }
          case 'no-lock': {
            enum5 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum5 = 22;
            break;
          }
          case 'insufficient-space': {
            enum5 = 23;
            break;
          }
          case 'not-directory': {
            enum5 = 24;
            break;
          }
          case 'not-empty': {
            enum5 = 25;
            break;
          }
          case 'not-recoverable': {
            enum5 = 26;
            break;
          }
          case 'unsupported': {
            enum5 = 27;
            break;
          }
          case 'no-tty': {
            enum5 = 28;
            break;
          }
          case 'no-such-device': {
            enum5 = 29;
            break;
          }
          case 'overflow': {
            enum5 = 30;
            break;
          }
          case 'not-permitted': {
            enum5 = 31;
            break;
          }
          case 'pipe': {
            enum5 = 32;
            break;
          }
          case 'read-only': {
            enum5 = 33;
            break;
          }
          case 'invalid-seek': {
            enum5 = 34;
            break;
          }
          case 'text-file-busy': {
            enum5 = 35;
            break;
          }
          case 'cross-device': {
            enum5 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val5}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg7 + 4, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline57(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    let ret;
    try {
      ret = { tag: 'ok', val: readlinkAt(arg0 >>> 0, result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        const ptr1 = utf8Encode(e, realloc0, memory0);
        const len1 = utf8EncodedLen;
        dataView(memory0).setInt32(arg3 + 8, len1, true);
        dataView(memory0).setInt32(arg3 + 4, ptr1, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const val2 = e;
        let enum2;
        switch (val2) {
          case 'access': {
            enum2 = 0;
            break;
          }
          case 'would-block': {
            enum2 = 1;
            break;
          }
          case 'already': {
            enum2 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum2 = 3;
            break;
          }
          case 'busy': {
            enum2 = 4;
            break;
          }
          case 'deadlock': {
            enum2 = 5;
            break;
          }
          case 'quota': {
            enum2 = 6;
            break;
          }
          case 'exist': {
            enum2 = 7;
            break;
          }
          case 'file-too-large': {
            enum2 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum2 = 9;
            break;
          }
          case 'in-progress': {
            enum2 = 10;
            break;
          }
          case 'interrupted': {
            enum2 = 11;
            break;
          }
          case 'invalid': {
            enum2 = 12;
            break;
          }
          case 'io': {
            enum2 = 13;
            break;
          }
          case 'is-directory': {
            enum2 = 14;
            break;
          }
          case 'loop': {
            enum2 = 15;
            break;
          }
          case 'too-many-links': {
            enum2 = 16;
            break;
          }
          case 'message-size': {
            enum2 = 17;
            break;
          }
          case 'name-too-long': {
            enum2 = 18;
            break;
          }
          case 'no-device': {
            enum2 = 19;
            break;
          }
          case 'no-entry': {
            enum2 = 20;
            break;
          }
          case 'no-lock': {
            enum2 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum2 = 22;
            break;
          }
          case 'insufficient-space': {
            enum2 = 23;
            break;
          }
          case 'not-directory': {
            enum2 = 24;
            break;
          }
          case 'not-empty': {
            enum2 = 25;
            break;
          }
          case 'not-recoverable': {
            enum2 = 26;
            break;
          }
          case 'unsupported': {
            enum2 = 27;
            break;
          }
          case 'no-tty': {
            enum2 = 28;
            break;
          }
          case 'no-such-device': {
            enum2 = 29;
            break;
          }
          case 'overflow': {
            enum2 = 30;
            break;
          }
          case 'not-permitted': {
            enum2 = 31;
            break;
          }
          case 'pipe': {
            enum2 = 32;
            break;
          }
          case 'read-only': {
            enum2 = 33;
            break;
          }
          case 'invalid-seek': {
            enum2 = 34;
            break;
          }
          case 'text-file-busy': {
            enum2 = 35;
            break;
          }
          case 'cross-device': {
            enum2 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg3 + 4, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline58(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    let ret;
    try {
      ret = { tag: 'ok', val: removeDirectoryAt(arg0 >>> 0, result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'access': {
            enum1 = 0;
            break;
          }
          case 'would-block': {
            enum1 = 1;
            break;
          }
          case 'already': {
            enum1 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum1 = 3;
            break;
          }
          case 'busy': {
            enum1 = 4;
            break;
          }
          case 'deadlock': {
            enum1 = 5;
            break;
          }
          case 'quota': {
            enum1 = 6;
            break;
          }
          case 'exist': {
            enum1 = 7;
            break;
          }
          case 'file-too-large': {
            enum1 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum1 = 9;
            break;
          }
          case 'in-progress': {
            enum1 = 10;
            break;
          }
          case 'interrupted': {
            enum1 = 11;
            break;
          }
          case 'invalid': {
            enum1 = 12;
            break;
          }
          case 'io': {
            enum1 = 13;
            break;
          }
          case 'is-directory': {
            enum1 = 14;
            break;
          }
          case 'loop': {
            enum1 = 15;
            break;
          }
          case 'too-many-links': {
            enum1 = 16;
            break;
          }
          case 'message-size': {
            enum1 = 17;
            break;
          }
          case 'name-too-long': {
            enum1 = 18;
            break;
          }
          case 'no-device': {
            enum1 = 19;
            break;
          }
          case 'no-entry': {
            enum1 = 20;
            break;
          }
          case 'no-lock': {
            enum1 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum1 = 22;
            break;
          }
          case 'insufficient-space': {
            enum1 = 23;
            break;
          }
          case 'not-directory': {
            enum1 = 24;
            break;
          }
          case 'not-empty': {
            enum1 = 25;
            break;
          }
          case 'not-recoverable': {
            enum1 = 26;
            break;
          }
          case 'unsupported': {
            enum1 = 27;
            break;
          }
          case 'no-tty': {
            enum1 = 28;
            break;
          }
          case 'no-such-device': {
            enum1 = 29;
            break;
          }
          case 'overflow': {
            enum1 = 30;
            break;
          }
          case 'not-permitted': {
            enum1 = 31;
            break;
          }
          case 'pipe': {
            enum1 = 32;
            break;
          }
          case 'read-only': {
            enum1 = 33;
            break;
          }
          case 'invalid-seek': {
            enum1 = 34;
            break;
          }
          case 'text-file-busy': {
            enum1 = 35;
            break;
          }
          case 'cross-device': {
            enum1 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg3 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline59(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    const ptr1 = arg4;
    const len1 = arg5;
    const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
    let ret;
    try {
      ret = { tag: 'ok', val: renameAt(arg0 >>> 0, result0, arg3 >>> 0, result1) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg6 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg6 + 0, 1, true);
        const val2 = e;
        let enum2;
        switch (val2) {
          case 'access': {
            enum2 = 0;
            break;
          }
          case 'would-block': {
            enum2 = 1;
            break;
          }
          case 'already': {
            enum2 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum2 = 3;
            break;
          }
          case 'busy': {
            enum2 = 4;
            break;
          }
          case 'deadlock': {
            enum2 = 5;
            break;
          }
          case 'quota': {
            enum2 = 6;
            break;
          }
          case 'exist': {
            enum2 = 7;
            break;
          }
          case 'file-too-large': {
            enum2 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum2 = 9;
            break;
          }
          case 'in-progress': {
            enum2 = 10;
            break;
          }
          case 'interrupted': {
            enum2 = 11;
            break;
          }
          case 'invalid': {
            enum2 = 12;
            break;
          }
          case 'io': {
            enum2 = 13;
            break;
          }
          case 'is-directory': {
            enum2 = 14;
            break;
          }
          case 'loop': {
            enum2 = 15;
            break;
          }
          case 'too-many-links': {
            enum2 = 16;
            break;
          }
          case 'message-size': {
            enum2 = 17;
            break;
          }
          case 'name-too-long': {
            enum2 = 18;
            break;
          }
          case 'no-device': {
            enum2 = 19;
            break;
          }
          case 'no-entry': {
            enum2 = 20;
            break;
          }
          case 'no-lock': {
            enum2 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum2 = 22;
            break;
          }
          case 'insufficient-space': {
            enum2 = 23;
            break;
          }
          case 'not-directory': {
            enum2 = 24;
            break;
          }
          case 'not-empty': {
            enum2 = 25;
            break;
          }
          case 'not-recoverable': {
            enum2 = 26;
            break;
          }
          case 'unsupported': {
            enum2 = 27;
            break;
          }
          case 'no-tty': {
            enum2 = 28;
            break;
          }
          case 'no-such-device': {
            enum2 = 29;
            break;
          }
          case 'overflow': {
            enum2 = 30;
            break;
          }
          case 'not-permitted': {
            enum2 = 31;
            break;
          }
          case 'pipe': {
            enum2 = 32;
            break;
          }
          case 'read-only': {
            enum2 = 33;
            break;
          }
          case 'invalid-seek': {
            enum2 = 34;
            break;
          }
          case 'text-file-busy': {
            enum2 = 35;
            break;
          }
          case 'cross-device': {
            enum2 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg6 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline60(arg0, arg1, arg2, arg3, arg4, arg5) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    const ptr1 = arg3;
    const len1 = arg4;
    const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
    let ret;
    try {
      ret = { tag: 'ok', val: symlinkAt(arg0 >>> 0, result0, result1) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg5 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg5 + 0, 1, true);
        const val2 = e;
        let enum2;
        switch (val2) {
          case 'access': {
            enum2 = 0;
            break;
          }
          case 'would-block': {
            enum2 = 1;
            break;
          }
          case 'already': {
            enum2 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum2 = 3;
            break;
          }
          case 'busy': {
            enum2 = 4;
            break;
          }
          case 'deadlock': {
            enum2 = 5;
            break;
          }
          case 'quota': {
            enum2 = 6;
            break;
          }
          case 'exist': {
            enum2 = 7;
            break;
          }
          case 'file-too-large': {
            enum2 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum2 = 9;
            break;
          }
          case 'in-progress': {
            enum2 = 10;
            break;
          }
          case 'interrupted': {
            enum2 = 11;
            break;
          }
          case 'invalid': {
            enum2 = 12;
            break;
          }
          case 'io': {
            enum2 = 13;
            break;
          }
          case 'is-directory': {
            enum2 = 14;
            break;
          }
          case 'loop': {
            enum2 = 15;
            break;
          }
          case 'too-many-links': {
            enum2 = 16;
            break;
          }
          case 'message-size': {
            enum2 = 17;
            break;
          }
          case 'name-too-long': {
            enum2 = 18;
            break;
          }
          case 'no-device': {
            enum2 = 19;
            break;
          }
          case 'no-entry': {
            enum2 = 20;
            break;
          }
          case 'no-lock': {
            enum2 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum2 = 22;
            break;
          }
          case 'insufficient-space': {
            enum2 = 23;
            break;
          }
          case 'not-directory': {
            enum2 = 24;
            break;
          }
          case 'not-empty': {
            enum2 = 25;
            break;
          }
          case 'not-recoverable': {
            enum2 = 26;
            break;
          }
          case 'unsupported': {
            enum2 = 27;
            break;
          }
          case 'no-tty': {
            enum2 = 28;
            break;
          }
          case 'no-such-device': {
            enum2 = 29;
            break;
          }
          case 'overflow': {
            enum2 = 30;
            break;
          }
          case 'not-permitted': {
            enum2 = 31;
            break;
          }
          case 'pipe': {
            enum2 = 32;
            break;
          }
          case 'read-only': {
            enum2 = 33;
            break;
          }
          case 'invalid-seek': {
            enum2 = 34;
            break;
          }
          case 'text-file-busy': {
            enum2 = 35;
            break;
          }
          case 'cross-device': {
            enum2 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg5 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline61(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    let ret;
    try {
      ret = { tag: 'ok', val: unlinkFileAt(arg0 >>> 0, result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'access': {
            enum1 = 0;
            break;
          }
          case 'would-block': {
            enum1 = 1;
            break;
          }
          case 'already': {
            enum1 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum1 = 3;
            break;
          }
          case 'busy': {
            enum1 = 4;
            break;
          }
          case 'deadlock': {
            enum1 = 5;
            break;
          }
          case 'quota': {
            enum1 = 6;
            break;
          }
          case 'exist': {
            enum1 = 7;
            break;
          }
          case 'file-too-large': {
            enum1 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum1 = 9;
            break;
          }
          case 'in-progress': {
            enum1 = 10;
            break;
          }
          case 'interrupted': {
            enum1 = 11;
            break;
          }
          case 'invalid': {
            enum1 = 12;
            break;
          }
          case 'io': {
            enum1 = 13;
            break;
          }
          case 'is-directory': {
            enum1 = 14;
            break;
          }
          case 'loop': {
            enum1 = 15;
            break;
          }
          case 'too-many-links': {
            enum1 = 16;
            break;
          }
          case 'message-size': {
            enum1 = 17;
            break;
          }
          case 'name-too-long': {
            enum1 = 18;
            break;
          }
          case 'no-device': {
            enum1 = 19;
            break;
          }
          case 'no-entry': {
            enum1 = 20;
            break;
          }
          case 'no-lock': {
            enum1 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum1 = 22;
            break;
          }
          case 'insufficient-space': {
            enum1 = 23;
            break;
          }
          case 'not-directory': {
            enum1 = 24;
            break;
          }
          case 'not-empty': {
            enum1 = 25;
            break;
          }
          case 'not-recoverable': {
            enum1 = 26;
            break;
          }
          case 'unsupported': {
            enum1 = 27;
            break;
          }
          case 'no-tty': {
            enum1 = 28;
            break;
          }
          case 'no-such-device': {
            enum1 = 29;
            break;
          }
          case 'overflow': {
            enum1 = 30;
            break;
          }
          case 'not-permitted': {
            enum1 = 31;
            break;
          }
          case 'pipe': {
            enum1 = 32;
            break;
          }
          case 'read-only': {
            enum1 = 33;
            break;
          }
          case 'invalid-seek': {
            enum1 = 34;
            break;
          }
          case 'text-file-busy': {
            enum1 = 35;
            break;
          }
          case 'cross-device': {
            enum1 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg3 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline62(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: readDirectoryEntry(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant3 = e;
        if (variant3 === null || variant3=== undefined) {
          dataView(memory0).setInt8(arg1 + 4, 0, true);
        } else {
          const e = variant3;
          dataView(memory0).setInt8(arg1 + 4, 1, true);
          const {type: v0_0, name: v0_1 } = e;
          const val1 = v0_0;
          let enum1;
          switch (val1) {
            case 'unknown': {
              enum1 = 0;
              break;
            }
            case 'block-device': {
              enum1 = 1;
              break;
            }
            case 'character-device': {
              enum1 = 2;
              break;
            }
            case 'directory': {
              enum1 = 3;
              break;
            }
            case 'fifo': {
              enum1 = 4;
              break;
            }
            case 'symbolic-link': {
              enum1 = 5;
              break;
            }
            case 'regular-file': {
              enum1 = 6;
              break;
            }
            case 'socket': {
              enum1 = 7;
              break;
            }
            default: {
              if ((v0_0) instanceof Error) {
                console.error(v0_0);
              }
              
              throw new TypeError(`"${val1}" is not one of the cases of descriptor-type`);
            }
          }
          dataView(memory0).setInt8(arg1 + 8, enum1, true);
          const ptr2 = utf8Encode(v0_1, realloc0, memory0);
          const len2 = utf8EncodedLen;
          dataView(memory0).setInt32(arg1 + 16, len2, true);
          dataView(memory0).setInt32(arg1 + 12, ptr2, true);
        }
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val4 = e;
        let enum4;
        switch (val4) {
          case 'access': {
            enum4 = 0;
            break;
          }
          case 'would-block': {
            enum4 = 1;
            break;
          }
          case 'already': {
            enum4 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum4 = 3;
            break;
          }
          case 'busy': {
            enum4 = 4;
            break;
          }
          case 'deadlock': {
            enum4 = 5;
            break;
          }
          case 'quota': {
            enum4 = 6;
            break;
          }
          case 'exist': {
            enum4 = 7;
            break;
          }
          case 'file-too-large': {
            enum4 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum4 = 9;
            break;
          }
          case 'in-progress': {
            enum4 = 10;
            break;
          }
          case 'interrupted': {
            enum4 = 11;
            break;
          }
          case 'invalid': {
            enum4 = 12;
            break;
          }
          case 'io': {
            enum4 = 13;
            break;
          }
          case 'is-directory': {
            enum4 = 14;
            break;
          }
          case 'loop': {
            enum4 = 15;
            break;
          }
          case 'too-many-links': {
            enum4 = 16;
            break;
          }
          case 'message-size': {
            enum4 = 17;
            break;
          }
          case 'name-too-long': {
            enum4 = 18;
            break;
          }
          case 'no-device': {
            enum4 = 19;
            break;
          }
          case 'no-entry': {
            enum4 = 20;
            break;
          }
          case 'no-lock': {
            enum4 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum4 = 22;
            break;
          }
          case 'insufficient-space': {
            enum4 = 23;
            break;
          }
          case 'not-directory': {
            enum4 = 24;
            break;
          }
          case 'not-empty': {
            enum4 = 25;
            break;
          }
          case 'not-recoverable': {
            enum4 = 26;
            break;
          }
          case 'unsupported': {
            enum4 = 27;
            break;
          }
          case 'no-tty': {
            enum4 = 28;
            break;
          }
          case 'no-such-device': {
            enum4 = 29;
            break;
          }
          case 'overflow': {
            enum4 = 30;
            break;
          }
          case 'not-permitted': {
            enum4 = 31;
            break;
          }
          case 'pipe': {
            enum4 = 32;
            break;
          }
          case 'read-only': {
            enum4 = 33;
            break;
          }
          case 'invalid-seek': {
            enum4 = 34;
            break;
          }
          case 'text-file-busy': {
            enum4 = 35;
            break;
          }
          case 'cross-device': {
            enum4 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val4}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline63(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: metadataHash(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const {lower: v0_0, upper: v0_1 } = e;
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(v0_0), true);
        dataView(memory0).setBigInt64(arg1 + 16, toUint64(v0_1), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'access': {
            enum1 = 0;
            break;
          }
          case 'would-block': {
            enum1 = 1;
            break;
          }
          case 'already': {
            enum1 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum1 = 3;
            break;
          }
          case 'busy': {
            enum1 = 4;
            break;
          }
          case 'deadlock': {
            enum1 = 5;
            break;
          }
          case 'quota': {
            enum1 = 6;
            break;
          }
          case 'exist': {
            enum1 = 7;
            break;
          }
          case 'file-too-large': {
            enum1 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum1 = 9;
            break;
          }
          case 'in-progress': {
            enum1 = 10;
            break;
          }
          case 'interrupted': {
            enum1 = 11;
            break;
          }
          case 'invalid': {
            enum1 = 12;
            break;
          }
          case 'io': {
            enum1 = 13;
            break;
          }
          case 'is-directory': {
            enum1 = 14;
            break;
          }
          case 'loop': {
            enum1 = 15;
            break;
          }
          case 'too-many-links': {
            enum1 = 16;
            break;
          }
          case 'message-size': {
            enum1 = 17;
            break;
          }
          case 'name-too-long': {
            enum1 = 18;
            break;
          }
          case 'no-device': {
            enum1 = 19;
            break;
          }
          case 'no-entry': {
            enum1 = 20;
            break;
          }
          case 'no-lock': {
            enum1 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum1 = 22;
            break;
          }
          case 'insufficient-space': {
            enum1 = 23;
            break;
          }
          case 'not-directory': {
            enum1 = 24;
            break;
          }
          case 'not-empty': {
            enum1 = 25;
            break;
          }
          case 'not-recoverable': {
            enum1 = 26;
            break;
          }
          case 'unsupported': {
            enum1 = 27;
            break;
          }
          case 'no-tty': {
            enum1 = 28;
            break;
          }
          case 'no-such-device': {
            enum1 = 29;
            break;
          }
          case 'overflow': {
            enum1 = 30;
            break;
          }
          case 'not-permitted': {
            enum1 = 31;
            break;
          }
          case 'pipe': {
            enum1 = 32;
            break;
          }
          case 'read-only': {
            enum1 = 33;
            break;
          }
          case 'invalid-seek': {
            enum1 = 34;
            break;
          }
          case 'text-file-busy': {
            enum1 = 35;
            break;
          }
          case 'cross-device': {
            enum1 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline64(arg0, arg1, arg2, arg3, arg4) {
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags0 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr1 = arg2;
    const len1 = arg3;
    const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
    let ret;
    try {
      ret = { tag: 'ok', val: metadataHashAt(arg0 >>> 0, flags0, result1) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        const {lower: v2_0, upper: v2_1 } = e;
        dataView(memory0).setBigInt64(arg4 + 8, toUint64(v2_0), true);
        dataView(memory0).setBigInt64(arg4 + 16, toUint64(v2_1), true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        const val3 = e;
        let enum3;
        switch (val3) {
          case 'access': {
            enum3 = 0;
            break;
          }
          case 'would-block': {
            enum3 = 1;
            break;
          }
          case 'already': {
            enum3 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum3 = 3;
            break;
          }
          case 'busy': {
            enum3 = 4;
            break;
          }
          case 'deadlock': {
            enum3 = 5;
            break;
          }
          case 'quota': {
            enum3 = 6;
            break;
          }
          case 'exist': {
            enum3 = 7;
            break;
          }
          case 'file-too-large': {
            enum3 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum3 = 9;
            break;
          }
          case 'in-progress': {
            enum3 = 10;
            break;
          }
          case 'interrupted': {
            enum3 = 11;
            break;
          }
          case 'invalid': {
            enum3 = 12;
            break;
          }
          case 'io': {
            enum3 = 13;
            break;
          }
          case 'is-directory': {
            enum3 = 14;
            break;
          }
          case 'loop': {
            enum3 = 15;
            break;
          }
          case 'too-many-links': {
            enum3 = 16;
            break;
          }
          case 'message-size': {
            enum3 = 17;
            break;
          }
          case 'name-too-long': {
            enum3 = 18;
            break;
          }
          case 'no-device': {
            enum3 = 19;
            break;
          }
          case 'no-entry': {
            enum3 = 20;
            break;
          }
          case 'no-lock': {
            enum3 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum3 = 22;
            break;
          }
          case 'insufficient-space': {
            enum3 = 23;
            break;
          }
          case 'not-directory': {
            enum3 = 24;
            break;
          }
          case 'not-empty': {
            enum3 = 25;
            break;
          }
          case 'not-recoverable': {
            enum3 = 26;
            break;
          }
          case 'unsupported': {
            enum3 = 27;
            break;
          }
          case 'no-tty': {
            enum3 = 28;
            break;
          }
          case 'no-such-device': {
            enum3 = 29;
            break;
          }
          case 'overflow': {
            enum3 = 30;
            break;
          }
          case 'not-permitted': {
            enum3 = 31;
            break;
          }
          case 'pipe': {
            enum3 = 32;
            break;
          }
          case 'read-only': {
            enum3 = 33;
            break;
          }
          case 'invalid-seek': {
            enum3 = 34;
            break;
          }
          case 'text-file-busy': {
            enum3 = 35;
            break;
          }
          case 'cross-device': {
            enum3 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val3}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg4 + 8, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline65(arg0, arg1) {
    const ret = getRandomBytes(BigInt.asUintN(64, arg0));
    const val0 = ret;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    dataView(memory0).setInt32(arg1 + 4, len0, true);
    dataView(memory0).setInt32(arg1 + 0, ptr0, true);
  }
  
  function trampoline66(arg0, arg1) {
    let enum0;
    switch (arg0) {
      case 0: {
        enum0 = 'ipv4';
        break;
      }
      case 1: {
        enum0 = 'ipv6';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for IpAddressFamily');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: createUdpSocket(enum0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setInt32(arg1 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline67(arg0, arg1) {
    let enum0;
    switch (arg0) {
      case 0: {
        enum0 = 'ipv4';
        break;
      }
      case 1: {
        enum0 = 'ipv6';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for IpAddressFamily');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: createTcpSocket(enum0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setInt32(arg1 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'unknown': {
            enum1 = 0;
            break;
          }
          case 'access-denied': {
            enum1 = 1;
            break;
          }
          case 'not-supported': {
            enum1 = 2;
            break;
          }
          case 'out-of-memory': {
            enum1 = 3;
            break;
          }
          case 'timeout': {
            enum1 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum1 = 5;
            break;
          }
          case 'not-in-progress': {
            enum1 = 6;
            break;
          }
          case 'would-block': {
            enum1 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum1 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum1 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum1 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum1 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum1 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum1 = 13;
            break;
          }
          case 'already-attached': {
            enum1 = 14;
            break;
          }
          case 'already-bound': {
            enum1 = 15;
            break;
          }
          case 'already-connected': {
            enum1 = 16;
            break;
          }
          case 'not-bound': {
            enum1 = 17;
            break;
          }
          case 'not-connected': {
            enum1 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum1 = 19;
            break;
          }
          case 'address-in-use': {
            enum1 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum1 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum1 = 22;
            break;
          }
          case 'already-listening': {
            enum1 = 23;
            break;
          }
          case 'not-listening': {
            enum1 = 24;
            break;
          }
          case 'connection-refused': {
            enum1 = 25;
            break;
          }
          case 'connection-reset': {
            enum1 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum1 = 27;
            break;
          }
          case 'invalid-name': {
            enum1 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum1 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum1 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum1 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline68(arg0) {
    const ret = now$1();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function trampoline69(arg0) {
    const ret = resolution$1();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function trampoline70(arg0, arg1, arg2) {
    let ret;
    try {
      ret = { tag: 'ok', val: read$1(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        const [tuple0_0, tuple0_1] = e;
        const val1 = tuple0_0;
        const len1 = val1.byteLength;
        const ptr1 = realloc0(0, 0, 1, len1 * 1);
        const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
        (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
        dataView(memory0).setInt32(arg2 + 8, len1, true);
        dataView(memory0).setInt32(arg2 + 4, ptr1, true);
        const val2 = tuple0_1;
        let enum2;
        switch (val2) {
          case 'open': {
            enum2 = 0;
            break;
          }
          case 'ended': {
            enum2 = 1;
            break;
          }
          default: {
            if ((tuple0_1) instanceof Error) {
              console.error(tuple0_1);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of stream-status`);
          }
        }
        dataView(memory0).setInt8(arg2 + 12, enum2, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline71(arg0, arg1, arg2) {
    let ret;
    try {
      ret = { tag: 'ok', val: blockingRead(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        const [tuple0_0, tuple0_1] = e;
        const val1 = tuple0_0;
        const len1 = val1.byteLength;
        const ptr1 = realloc0(0, 0, 1, len1 * 1);
        const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
        (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
        dataView(memory0).setInt32(arg2 + 8, len1, true);
        dataView(memory0).setInt32(arg2 + 4, ptr1, true);
        const val2 = tuple0_1;
        let enum2;
        switch (val2) {
          case 'open': {
            enum2 = 0;
            break;
          }
          case 'ended': {
            enum2 = 1;
            break;
          }
          default: {
            if ((tuple0_1) instanceof Error) {
              console.error(tuple0_1);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of stream-status`);
          }
        }
        dataView(memory0).setInt8(arg2 + 12, enum2, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline72(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: checkWrite(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'last-operation-failed': {
            enum0 = 0;
            break;
          }
          case 'closed': {
            enum0 = 1;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of write-error`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline73(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: write$1(arg0 >>> 0, result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'last-operation-failed': {
            enum1 = 0;
            break;
          }
          case 'closed': {
            enum1 = 1;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of write-error`);
          }
        }
        dataView(memory0).setInt8(arg3 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline74(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: blockingWriteAndFlush(arg0 >>> 0, result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const val1 = e;
        let enum1;
        switch (val1) {
          case 'last-operation-failed': {
            enum1 = 0;
            break;
          }
          case 'closed': {
            enum1 = 1;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of write-error`);
          }
        }
        dataView(memory0).setInt8(arg3 + 1, enum1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline75(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: blockingFlush(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val0 = e;
        let enum0;
        switch (val0) {
          case 'last-operation-failed': {
            enum0 = 0;
            break;
          }
          case 'closed': {
            enum0 = 1;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val0}" is not one of the cases of write-error`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum0, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline76(arg0, arg1, arg2) {
    const ptr0 = arg0;
    const len0 = arg1;
    const result0 = new Uint32Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 4));
    const ret = pollOneoff(result0);
    const vec1 = ret;
    const len1 = vec1.length;
    const result1 = realloc0(0, 0, 1, len1 * 1);
    for (let i = 0; i < vec1.length; i++) {
      const e = vec1[i];
      const base = result1 + i * 1;dataView(memory0).setInt8(base + 0, e ? 1 : 0, true);
    }
    dataView(memory0).setInt32(arg2 + 4, len1, true);
    dataView(memory0).setInt32(arg2 + 0, result1, true);
  }
  
  function trampoline77(arg0) {
    const ret = getEnvironment();
    const vec3 = ret;
    const len3 = vec3.length;
    const result3 = realloc0(0, 0, 4, len3 * 16);
    for (let i = 0; i < vec3.length; i++) {
      const e = vec3[i];
      const base = result3 + i * 16;const [tuple0_0, tuple0_1] = e;
      const ptr1 = utf8Encode(tuple0_0, realloc0, memory0);
      const len1 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 4, len1, true);
      dataView(memory0).setInt32(base + 0, ptr1, true);
      const ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
      const len2 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 12, len2, true);
      dataView(memory0).setInt32(base + 8, ptr2, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len3, true);
    dataView(memory0).setInt32(arg0 + 0, result3, true);
  }
  
  function trampoline78(arg0) {
    const ret = getArguments();
    const vec1 = ret;
    const len1 = vec1.length;
    const result1 = realloc0(0, 0, 4, len1 * 8);
    for (let i = 0; i < vec1.length; i++) {
      const e = vec1[i];
      const base = result1 + i * 8;const ptr0 = utf8Encode(e, realloc0, memory0);
      const len0 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 4, len0, true);
      dataView(memory0).setInt32(base + 0, ptr0, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len1, true);
    dataView(memory0).setInt32(arg0 + 0, result1, true);
  }
  
  function trampoline79(arg0) {
    const ret = getTerminalStdin();
    const variant0 = ret;
    if (variant0 === null || variant0=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant0;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      dataView(memory0).setInt32(arg0 + 4, toUint32(e), true);
    }
  }
  
  function trampoline80(arg0) {
    const ret = getTerminalStdout();
    const variant0 = ret;
    if (variant0 === null || variant0=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant0;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      dataView(memory0).setInt32(arg0 + 4, toUint32(e), true);
    }
  }
  
  function trampoline81(arg0) {
    const ret = getTerminalStderr();
    const variant0 = ret;
    if (variant0 === null || variant0=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant0;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      dataView(memory0).setInt32(arg0 + 4, toUint32(e), true);
    }
  }
  
  function trampoline82(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    let variant2;
    switch (arg3) {
      case 0: {
        variant2 = undefined;
        break;
      }
      case 1: {
        let enum1;
        switch (arg4) {
          case 0: {
            enum1 = 'ipv4';
            break;
          }
          case 1: {
            enum1 = 'ipv6';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for IpAddressFamily');
          }
        }
        variant2 = enum1;
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for option');
      }
    }
    const bool3 = arg5;
    let ret;
    try {
      ret = { tag: 'ok', val: resolveAddresses(arg0 >>> 0, result0, variant2, bool3 == 0 ? false : (bool3 == 1 ? true : throwInvalidBool())) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg6 + 0, 0, true);
        dataView(memory0).setInt32(arg6 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg6 + 0, 1, true);
        const val4 = e;
        let enum4;
        switch (val4) {
          case 'unknown': {
            enum4 = 0;
            break;
          }
          case 'access-denied': {
            enum4 = 1;
            break;
          }
          case 'not-supported': {
            enum4 = 2;
            break;
          }
          case 'out-of-memory': {
            enum4 = 3;
            break;
          }
          case 'timeout': {
            enum4 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum4 = 5;
            break;
          }
          case 'not-in-progress': {
            enum4 = 6;
            break;
          }
          case 'would-block': {
            enum4 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum4 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum4 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum4 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum4 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum4 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum4 = 13;
            break;
          }
          case 'already-attached': {
            enum4 = 14;
            break;
          }
          case 'already-bound': {
            enum4 = 15;
            break;
          }
          case 'already-connected': {
            enum4 = 16;
            break;
          }
          case 'not-bound': {
            enum4 = 17;
            break;
          }
          case 'not-connected': {
            enum4 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum4 = 19;
            break;
          }
          case 'address-in-use': {
            enum4 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum4 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum4 = 22;
            break;
          }
          case 'already-listening': {
            enum4 = 23;
            break;
          }
          case 'not-listening': {
            enum4 = 24;
            break;
          }
          case 'connection-refused': {
            enum4 = 25;
            break;
          }
          case 'connection-reset': {
            enum4 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum4 = 27;
            break;
          }
          case 'invalid-name': {
            enum4 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum4 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum4 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum4 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val4}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg6 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline83(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: resolveNextAddress(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant3 = e;
        if (variant3 === null || variant3=== undefined) {
          dataView(memory0).setInt8(arg1 + 2, 0, true);
        } else {
          const e = variant3;
          dataView(memory0).setInt8(arg1 + 2, 1, true);
          const variant2 = e;
          switch (variant2.tag) {
            case 'ipv4': {
              const e = variant2.val;
              dataView(memory0).setInt8(arg1 + 4, 0, true);
              const [tuple0_0, tuple0_1, tuple0_2, tuple0_3] = e;
              dataView(memory0).setInt8(arg1 + 6, toUint8(tuple0_0), true);
              dataView(memory0).setInt8(arg1 + 7, toUint8(tuple0_1), true);
              dataView(memory0).setInt8(arg1 + 8, toUint8(tuple0_2), true);
              dataView(memory0).setInt8(arg1 + 9, toUint8(tuple0_3), true);
              break;
            }
            case 'ipv6': {
              const e = variant2.val;
              dataView(memory0).setInt8(arg1 + 4, 1, true);
              const [tuple1_0, tuple1_1, tuple1_2, tuple1_3, tuple1_4, tuple1_5, tuple1_6, tuple1_7] = e;
              dataView(memory0).setInt16(arg1 + 6, toUint16(tuple1_0), true);
              dataView(memory0).setInt16(arg1 + 8, toUint16(tuple1_1), true);
              dataView(memory0).setInt16(arg1 + 10, toUint16(tuple1_2), true);
              dataView(memory0).setInt16(arg1 + 12, toUint16(tuple1_3), true);
              dataView(memory0).setInt16(arg1 + 14, toUint16(tuple1_4), true);
              dataView(memory0).setInt16(arg1 + 16, toUint16(tuple1_5), true);
              dataView(memory0).setInt16(arg1 + 18, toUint16(tuple1_6), true);
              dataView(memory0).setInt16(arg1 + 20, toUint16(tuple1_7), true);
              break;
            }
            default: {
              throw new TypeError('invalid variant specified for IpAddress');
            }
          }
        }
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val4 = e;
        let enum4;
        switch (val4) {
          case 'unknown': {
            enum4 = 0;
            break;
          }
          case 'access-denied': {
            enum4 = 1;
            break;
          }
          case 'not-supported': {
            enum4 = 2;
            break;
          }
          case 'out-of-memory': {
            enum4 = 3;
            break;
          }
          case 'timeout': {
            enum4 = 4;
            break;
          }
          case 'concurrency-conflict': {
            enum4 = 5;
            break;
          }
          case 'not-in-progress': {
            enum4 = 6;
            break;
          }
          case 'would-block': {
            enum4 = 7;
            break;
          }
          case 'address-family-not-supported': {
            enum4 = 8;
            break;
          }
          case 'address-family-mismatch': {
            enum4 = 9;
            break;
          }
          case 'invalid-remote-address': {
            enum4 = 10;
            break;
          }
          case 'ipv4-only-operation': {
            enum4 = 11;
            break;
          }
          case 'ipv6-only-operation': {
            enum4 = 12;
            break;
          }
          case 'new-socket-limit': {
            enum4 = 13;
            break;
          }
          case 'already-attached': {
            enum4 = 14;
            break;
          }
          case 'already-bound': {
            enum4 = 15;
            break;
          }
          case 'already-connected': {
            enum4 = 16;
            break;
          }
          case 'not-bound': {
            enum4 = 17;
            break;
          }
          case 'not-connected': {
            enum4 = 18;
            break;
          }
          case 'address-not-bindable': {
            enum4 = 19;
            break;
          }
          case 'address-in-use': {
            enum4 = 20;
            break;
          }
          case 'ephemeral-ports-exhausted': {
            enum4 = 21;
            break;
          }
          case 'remote-unreachable': {
            enum4 = 22;
            break;
          }
          case 'already-listening': {
            enum4 = 23;
            break;
          }
          case 'not-listening': {
            enum4 = 24;
            break;
          }
          case 'connection-refused': {
            enum4 = 25;
            break;
          }
          case 'connection-reset': {
            enum4 = 26;
            break;
          }
          case 'datagram-too-large': {
            enum4 = 27;
            break;
          }
          case 'invalid-name': {
            enum4 = 28;
            break;
          }
          case 'name-unresolvable': {
            enum4 = 29;
            break;
          }
          case 'temporary-resolver-failure': {
            enum4 = 30;
            break;
          }
          case 'permanent-resolver-failure': {
            enum4 = 31;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val4}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 2, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  let exports3;
  const instanceFlags0 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
  const instanceFlags1 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    wasi_snapshot_preview1: {
      args_get: exports0['65'],
      args_sizes_get: exports0['66'],
      clock_res_get: exports0['69'],
      clock_time_get: exports0['70'],
      environ_get: exports0['67'],
      environ_sizes_get: exports0['68'],
      fd_advise: exports0['71'],
      fd_allocate: exports0['72'],
      fd_close: exports0['73'],
      fd_datasync: exports0['74'],
      fd_fdstat_get: exports0['75'],
      fd_fdstat_set_flags: exports0['76'],
      fd_fdstat_set_rights: exports0['77'],
      fd_filestat_get: exports0['78'],
      fd_filestat_set_size: exports0['79'],
      fd_filestat_set_times: exports0['80'],
      fd_pread: exports0['81'],
      fd_prestat_dir_name: exports0['83'],
      fd_prestat_get: exports0['82'],
      fd_pwrite: exports0['84'],
      fd_read: exports0['85'],
      fd_readdir: exports0['86'],
      fd_renumber: exports0['87'],
      fd_seek: exports0['88'],
      fd_sync: exports0['89'],
      fd_tell: exports0['90'],
      fd_write: exports0['91'],
      path_create_directory: exports0['92'],
      path_filestat_get: exports0['93'],
      path_filestat_set_times: exports0['94'],
      path_link: exports0['95'],
      path_open: exports0['96'],
      path_readlink: exports0['97'],
      path_remove_directory: exports0['98'],
      path_rename: exports0['99'],
      path_symlink: exports0['100'],
      path_unlink_file: exports0['101'],
      poll_oneoff: exports0['102'],
      proc_exit: exports0['103'],
      proc_raise: exports0['104'],
      random_get: exports0['106'],
      sched_yield: exports0['105'],
      sock_accept: exports0['107'],
      sock_bind: exports0['117'],
      sock_connect: exports0['119'],
      sock_getaddrinfo: exports0['111'],
      sock_getlocaladdr: exports0['112'],
      sock_getpeeraddr: exports0['113'],
      sock_getsockopt: exports0['116'],
      sock_listen: exports0['118'],
      sock_open: exports0['114'],
      sock_recv: exports0['108'],
      sock_recv_from: exports0['120'],
      sock_send: exports0['109'],
      sock_send_to: exports0['121'],
      sock_setsockopt: exports0['115'],
      sock_shutdown: exports0['110'],
    },
  }));
  ({ exports: exports2 } = await instantiateCore(await module1, {
    __main_module__: {
      _start: exports1._start,
    },
    env: {
      memory: exports1.memory,
    },
    'wasi:cli/environment': {
      'get-arguments': exports0['59'],
      'get-environment': exports0['58'],
    },
    'wasi:cli/exit': {
      exit: trampoline8,
    },
    'wasi:cli/stderr': {
      'get-stderr': trampoline13,
    },
    'wasi:cli/stdin': {
      'get-stdin': trampoline9,
    },
    'wasi:cli/stdout': {
      'get-stdout': trampoline12,
    },
    'wasi:cli/terminal-input': {
      'drop-terminal-input': trampoline14,
    },
    'wasi:cli/terminal-output': {
      'drop-terminal-output': trampoline15,
    },
    'wasi:cli/terminal-stderr': {
      'get-terminal-stderr': exports0['62'],
    },
    'wasi:cli/terminal-stdin': {
      'get-terminal-stdin': exports0['60'],
    },
    'wasi:cli/terminal-stdout': {
      'get-terminal-stdout': exports0['61'],
    },
    'wasi:clocks/monotonic-clock': {
      now: trampoline7,
      resolution: trampoline6,
      subscribe: trampoline2,
    },
    'wasi:clocks/wall-clock': {
      now: exports0['49'],
      resolution: exports0['50'],
    },
    'wasi:filesystem/preopens': {
      'get-directories': exports0['0'],
    },
    'wasi:filesystem/types': {
      advise: exports0['22'],
      'append-via-stream': exports0['21'],
      'create-directory-at': exports0['32'],
      'drop-descriptor': trampoline11,
      'drop-directory-entry-stream': trampoline1,
      'get-flags': exports0['24'],
      'get-type': exports0['25'],
      'link-at': exports0['36'],
      'metadata-hash': exports0['44'],
      'metadata-hash-at': exports0['45'],
      'open-at': exports0['37'],
      read: exports0['28'],
      'read-directory': exports0['30'],
      'read-directory-entry': exports0['43'],
      'read-via-stream': exports0['19'],
      'readlink-at': exports0['38'],
      'remove-directory-at': exports0['39'],
      'rename-at': exports0['40'],
      'set-size': exports0['26'],
      'set-times': exports0['27'],
      'set-times-at': exports0['35'],
      stat: exports0['33'],
      'stat-at': exports0['34'],
      'symlink-at': exports0['41'],
      sync: exports0['31'],
      'sync-data': exports0['23'],
      'unlink-file-at': exports0['42'],
      write: exports0['29'],
      'write-via-stream': exports0['20'],
    },
    'wasi:io/streams': {
      'blocking-flush': exports0['56'],
      'blocking-read': exports0['52'],
      'blocking-write-and-flush': exports0['55'],
      'check-write': exports0['53'],
      'drop-input-stream': trampoline16,
      'drop-output-stream': trampoline17,
      read: exports0['51'],
      'subscribe-to-input-stream': trampoline5,
      'subscribe-to-output-stream': trampoline3,
      write: exports0['54'],
    },
    'wasi:poll/poll': {
      'drop-pollable': trampoline4,
      'poll-oneoff': exports0['57'],
    },
    'wasi:random/random': {
      'get-random-bytes': exports0['46'],
    },
    'wasi:sockets/instance-network': {
      'instance-network': trampoline0,
    },
    'wasi:sockets/ip-name-lookup': {
      'resolve-addresses': exports0['63'],
      'resolve-next-address': exports0['64'],
    },
    'wasi:sockets/tcp': {
      accept: exports0['7'],
      'drop-tcp-socket': trampoline10,
      'finish-bind': exports0['2'],
      'finish-connect': exports0['4'],
      'finish-listen': exports0['6'],
      'local-address': exports0['8'],
      'remote-address': exports0['9'],
      shutdown: exports0['10'],
      'start-bind': exports0['1'],
      'start-connect': exports0['3'],
      'start-listen': exports0['5'],
    },
    'wasi:sockets/tcp-create-socket': {
      'create-tcp-socket': exports0['48'],
    },
    'wasi:sockets/udp': {
      'drop-udp-socket': trampoline18,
      'finish-bind': exports0['12'],
      'finish-connect': exports0['14'],
      'local-address': exports0['17'],
      receive: exports0['15'],
      'remote-address': exports0['18'],
      send: exports0['16'],
      'start-bind': exports0['11'],
      'start-connect': exports0['13'],
    },
    'wasi:sockets/udp-create-socket': {
      'create-udp-socket': exports0['47'],
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': trampoline19,
      '1': trampoline20,
      '10': trampoline29,
      '100': exports2.path_symlink,
      '101': exports2.path_unlink_file,
      '102': exports2.poll_oneoff,
      '103': exports2.proc_exit,
      '104': exports2.proc_raise,
      '105': exports2.sched_yield,
      '106': exports2.random_get,
      '107': exports2.sock_accept,
      '108': exports2.sock_recv,
      '109': exports2.sock_send,
      '11': trampoline30,
      '110': exports2.sock_shutdown,
      '111': exports2.sock_getaddrinfo,
      '112': exports2.sock_getlocaladdr,
      '113': exports2.sock_getpeeraddr,
      '114': exports2.sock_open,
      '115': exports2.sock_getsockopt,
      '116': exports2.sock_getsockopt,
      '117': exports2.sock_bind,
      '118': exports2.sock_listen,
      '119': exports2.sock_connect,
      '12': trampoline31,
      '120': exports2.sock_recv_from,
      '121': exports2.sock_send_to,
      '13': trampoline32,
      '14': trampoline33,
      '15': trampoline34,
      '16': trampoline35,
      '17': trampoline36,
      '18': trampoline37,
      '19': trampoline38,
      '2': trampoline21,
      '20': trampoline39,
      '21': trampoline40,
      '22': trampoline41,
      '23': trampoline42,
      '24': trampoline43,
      '25': trampoline44,
      '26': trampoline45,
      '27': trampoline46,
      '28': trampoline47,
      '29': trampoline48,
      '3': trampoline22,
      '30': trampoline49,
      '31': trampoline50,
      '32': trampoline51,
      '33': trampoline52,
      '34': trampoline53,
      '35': trampoline54,
      '36': trampoline55,
      '37': trampoline56,
      '38': trampoline57,
      '39': trampoline58,
      '4': trampoline23,
      '40': trampoline59,
      '41': trampoline60,
      '42': trampoline61,
      '43': trampoline62,
      '44': trampoline63,
      '45': trampoline64,
      '46': trampoline65,
      '47': trampoline66,
      '48': trampoline67,
      '49': trampoline68,
      '5': trampoline24,
      '50': trampoline69,
      '51': trampoline70,
      '52': trampoline71,
      '53': trampoline72,
      '54': trampoline73,
      '55': trampoline74,
      '56': trampoline75,
      '57': trampoline76,
      '58': trampoline77,
      '59': trampoline78,
      '6': trampoline25,
      '60': trampoline79,
      '61': trampoline80,
      '62': trampoline81,
      '63': trampoline82,
      '64': trampoline83,
      '65': exports2.args_get,
      '66': exports2.args_sizes_get,
      '67': exports2.environ_get,
      '68': exports2.environ_sizes_get,
      '69': exports2.clock_res_get,
      '7': trampoline26,
      '70': exports2.clock_time_get,
      '71': exports2.fd_advise,
      '72': exports2.fd_allocate,
      '73': exports2.fd_close,
      '74': exports2.fd_datasync,
      '75': exports2.fd_fdstat_get,
      '76': exports2.fd_fdstat_set_flags,
      '77': exports2.fd_fdstat_set_rights,
      '78': exports2.fd_filestat_get,
      '79': exports2.fd_filestat_set_size,
      '8': trampoline27,
      '80': exports2.fd_filestat_set_times,
      '81': exports2.fd_pread,
      '82': exports2.fd_prestat_get,
      '83': exports2.fd_prestat_dir_name,
      '84': exports2.fd_pwrite,
      '85': exports2.fd_read,
      '86': exports2.fd_readdir,
      '87': exports2.fd_renumber,
      '88': exports2.fd_seek,
      '89': exports2.fd_sync,
      '9': trampoline28,
      '90': exports2.fd_tell,
      '91': exports2.fd_write,
      '92': exports2.path_create_directory,
      '93': exports2.path_filestat_get,
      '94': exports2.path_filestat_set_times,
      '95': exports2.path_link,
      '96': exports2.path_open,
      '97': exports2.path_readlink,
      '98': exports2.path_remove_directory,
      '99': exports2.path_rename,
    },
  }));
  
  function run() {
    const ret = exports2['wasi:cli/run#run']();
    let variant0;
    switch (ret) {
      case 0: {
        variant0= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        variant0= {
          tag: 'err',
          val: undefined
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant0.tag === 'err') {
      throw new ComponentError(variant0.val);
    }
    return variant0.val;
  }
  const run$1 = {
    run: run,
    
  };
  
  return { run: run$1, 'wasi:cli/run': run$1 };
}
