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
  const module0 = compileCore('nfs_rs.core.wasm');
  const module1 = compileCore('nfs_rs.core2.wasm');
  const module2 = compileCore('nfs_rs.core3.wasm');
  const module3 = compileCore('nfs_rs.core4.wasm');
  
  const { getEnvironment } = imports['wasi:cli-base/environment'];
  const { exit } = imports['wasi:cli-base/exit'];
  const { getDirectories } = imports['wasi:cli-base/preopens'];
  const { getStderr } = imports['wasi:cli-base/stderr'];
  const { getStdin } = imports['wasi:cli-base/stdin'];
  const { getStdout } = imports['wasi:cli-base/stdout'];
  const { now, subscribe } = imports['wasi:clocks/monotonic-clock'];
  const { now: now$1 } = imports['wasi:clocks/wall-clock'];
  const { appendViaStream, dropDescriptor, getType, readViaStream, stat, writeViaStream } = imports['wasi:filesystem/filesystem'];
  const { blockingRead, blockingWrite, dropInputStream, dropOutputStream, subscribeToInputStream, subscribeToOutputStream, write } = imports['wasi:io/streams'];
  const { dropPollable, pollOneoff } = imports['wasi:poll/poll'];
  const { getRandomBytes } = imports['wasi:random/random'];
  const { dropResolveAddressStream, resolveAddresses, resolveNextAddress } = imports['wasi:sockets/ip-name-lookup'];
  const { dropTcpSocket, finishConnect, remoteAddress, startConnect } = imports['wasi:sockets/tcp'];
  const { createTcpSocket } = imports['wasi:sockets/tcp-create-socket'];
  let exports0;
  
  function lowering0(arg0) {
    dropTcpSocket(arg0 >>> 0);
  }
  
  function lowering1(arg0) {
    dropResolveAddressStream(arg0 >>> 0);
  }
  let exports1;
  
  function lowering2() {
    const ret = now();
    return toUint64(ret);
  }
  
  function lowering3(arg0) {
    const ret = subscribeToOutputStream(arg0 >>> 0);
    return toUint32(ret);
  }
  
  function lowering4(arg0) {
    const ret = subscribeToInputStream(arg0 >>> 0);
    return toUint32(ret);
  }
  
  function lowering5(arg0, arg1) {
    const bool0 = arg1;
    const ret = subscribe(BigInt.asUintN(64, arg0), bool0 == 0 ? false : (bool0 == 1 ? true : throwInvalidBool()));
    return toUint32(ret);
  }
  
  function lowering6(arg0) {
    dropPollable(arg0 >>> 0);
  }
  
  function lowering7(arg0) {
    dropDescriptor(arg0 >>> 0);
  }
  
  function lowering8(arg0) {
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
  
  function lowering9() {
    const ret = getStderr();
    return toUint32(ret);
  }
  
  function lowering10() {
    const ret = getStdin();
    return toUint32(ret);
  }
  
  function lowering11() {
    const ret = getStdout();
    return toUint32(ret);
  }
  
  function lowering12(arg0) {
    dropInputStream(arg0 >>> 0);
  }
  
  function lowering13(arg0) {
    dropOutputStream(arg0 >>> 0);
  }
  let exports2;
  let memory0;
  
  function lowering14(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
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
  
  function lowering15(arg0, arg1) {
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
  
  function lowering16(arg0, arg1) {
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
  let realloc0;
  
  function lowering17(arg0, arg1, arg2) {
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
        dataView(memory0).setInt8(arg2 + 12, tuple0_1 ? 1 : 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        const { } = e;
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function lowering18(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: blockingWrite(arg0 >>> 0, result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        dataView(memory0).setBigInt64(arg3 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const { } = e;
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function lowering19(arg0, arg1) {
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
  
  function lowering20(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    let variant2;
    switch (arg3) {
      case 0: {
        variant2 = null;
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
  
  function lowering21(arg0, arg1) {
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
  let realloc1;
  
  function lowering22(arg0) {
    const ret = getDirectories();
    const vec2 = ret;
    const len2 = vec2.length;
    const result2 = realloc1(0, 0, 4, len2 * 12);
    for (let i = 0; i < vec2.length; i++) {
      const e = vec2[i];
      const base = result2 + i * 12;const [tuple0_0, tuple0_1] = e;
      dataView(memory0).setInt32(base + 0, toUint32(tuple0_0), true);
      const ptr1 = utf8Encode(tuple0_1, realloc1, memory0);
      const len1 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 8, len1, true);
      dataView(memory0).setInt32(base + 4, ptr1, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len2, true);
    dataView(memory0).setInt32(arg0 + 0, result2, true);
  }
  
  function lowering23(arg0) {
    const ret = now$1();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function lowering24(arg0, arg1, arg2) {
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
  
  function lowering25(arg0, arg1, arg2) {
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
  
  function lowering26(arg0, arg1) {
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
  
  function lowering27(arg0, arg1) {
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
  
  function lowering28(arg0, arg1) {
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
        const {device: v0_0, inode: v0_1, type: v0_2, linkCount: v0_3, size: v0_4, dataAccessTimestamp: v0_5, dataModificationTimestamp: v0_6, statusChangeTimestamp: v0_7 } = e;
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(v0_0), true);
        dataView(memory0).setBigInt64(arg1 + 16, toUint64(v0_1), true);
        const val1 = v0_2;
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
            if ((v0_2) instanceof Error) {
              console.error(v0_2);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of descriptor-type`);
          }
        }
        dataView(memory0).setInt8(arg1 + 24, enum1, true);
        dataView(memory0).setBigInt64(arg1 + 32, toUint64(v0_3), true);
        dataView(memory0).setBigInt64(arg1 + 40, toUint64(v0_4), true);
        const {seconds: v2_0, nanoseconds: v2_1 } = v0_5;
        dataView(memory0).setBigInt64(arg1 + 48, toUint64(v2_0), true);
        dataView(memory0).setInt32(arg1 + 56, toUint32(v2_1), true);
        const {seconds: v3_0, nanoseconds: v3_1 } = v0_6;
        dataView(memory0).setBigInt64(arg1 + 64, toUint64(v3_0), true);
        dataView(memory0).setInt32(arg1 + 72, toUint32(v3_1), true);
        const {seconds: v4_0, nanoseconds: v4_1 } = v0_7;
        dataView(memory0).setBigInt64(arg1 + 80, toUint64(v4_0), true);
        dataView(memory0).setInt32(arg1 + 88, toUint32(v4_1), true);
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
  
  function lowering29(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: write(arg0 >>> 0, result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        dataView(memory0).setBigInt64(arg3 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const { } = e;
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function lowering30(arg0, arg1, arg2) {
    const ptr0 = arg0;
    const len0 = arg1;
    const result0 = new Uint32Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 4));
    const ret = pollOneoff(result0);
    const val1 = ret;
    const len1 = val1.byteLength;
    const ptr1 = realloc1(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    dataView(memory0).setInt32(arg2 + 4, len1, true);
    dataView(memory0).setInt32(arg2 + 0, ptr1, true);
  }
  
  function lowering31(arg0, arg1) {
    const ret = getRandomBytes(BigInt.asUintN(64, arg0));
    const val0 = ret;
    const len0 = val0.byteLength;
    const ptr0 = realloc1(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    dataView(memory0).setInt32(arg1 + 4, len0, true);
    dataView(memory0).setInt32(arg1 + 0, ptr0, true);
  }
  
  function lowering32(arg0) {
    const ret = getEnvironment();
    const vec3 = ret;
    const len3 = vec3.length;
    const result3 = realloc1(0, 0, 4, len3 * 16);
    for (let i = 0; i < vec3.length; i++) {
      const e = vec3[i];
      const base = result3 + i * 16;const [tuple0_0, tuple0_1] = e;
      const ptr1 = utf8Encode(tuple0_0, realloc1, memory0);
      const len1 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 4, len1, true);
      dataView(memory0).setInt32(base + 0, ptr1, true);
      const ptr2 = utf8Encode(tuple0_1, realloc1, memory0);
      const len2 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 12, len2, true);
      dataView(memory0).setInt32(base + 8, ptr2, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len3, true);
    dataView(memory0).setInt32(arg0 + 0, result3, true);
  }
  let exports3;
  let postReturn0;
  let postReturn1;
  let postReturn2;
  let postReturn3;
  let postReturn4;
  let postReturn5;
  let postReturn6;
  let postReturn7;
  let postReturn8;
  let postReturn9;
  let postReturn10;
  let postReturn11;
  let postReturn12;
  let postReturn13;
  let postReturn14;
  let postReturn15;
  let postReturn16;
  let postReturn17;
  let postReturn18;
  let postReturn19;
  let postReturn20;
  let postReturn21;
  let postReturn22;
  let postReturn23;
  let postReturn24;
  let postReturn25;
  let postReturn26;
  let postReturn27;
  let postReturn28;
  let postReturn29;
  let postReturn30;
  let postReturn31;
  let postReturn32;
  let postReturn33;
  let postReturn34;
  let postReturn35;
  let postReturn36;
  let postReturn37;
  let postReturn38;
  let postReturn39;
  let postReturn40;
  let postReturn41;
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    'wasi:io/streams': {
      'blocking-read': exports0['3'],
      'blocking-write': exports0['4'],
    },
    'wasi:sockets/ip-name-lookup': {
      'drop-resolve-address-stream': lowering1,
      'resolve-addresses': exports0['6'],
      'resolve-next-address': exports0['7'],
    },
    'wasi:sockets/tcp': {
      'drop-tcp-socket': lowering0,
      'finish-connect': exports0['1'],
      'remote-address': exports0['2'],
      'start-connect': exports0['0'],
    },
    'wasi:sockets/tcp-create-socket': {
      'create-tcp-socket': exports0['5'],
    },
    wasi_snapshot_preview1: {
      clock_time_get: exports0['21'],
      environ_get: exports0['24'],
      environ_sizes_get: exports0['25'],
      fd_write: exports0['22'],
      poll_oneoff: exports0['23'],
      proc_exit: exports0['26'],
      random_get: exports0['20'],
    },
  }));
  ({ exports: exports2 } = await instantiateCore(await module1, {
    __main_module__: {
      cabi_realloc: exports1.cabi_realloc,
    },
    env: {
      memory: exports1.memory,
    },
    'wasi:cli-base/environment': {
      'get-environment': exports0['19'],
    },
    'wasi:cli-base/exit': {
      exit: lowering8,
    },
    'wasi:cli-base/preopens': {
      'get-directories': exports0['8'],
    },
    'wasi:cli-base/stderr': {
      'get-stderr': lowering9,
    },
    'wasi:cli-base/stdin': {
      'get-stdin': lowering10,
    },
    'wasi:cli-base/stdout': {
      'get-stdout': lowering11,
    },
    'wasi:clocks/monotonic-clock': {
      now: lowering2,
      subscribe: lowering5,
    },
    'wasi:clocks/wall-clock': {
      now: exports0['9'],
    },
    'wasi:filesystem/filesystem': {
      'append-via-stream': exports0['12'],
      'drop-descriptor': lowering7,
      'get-type': exports0['13'],
      'read-via-stream': exports0['10'],
      stat: exports0['14'],
      'write-via-stream': exports0['11'],
    },
    'wasi:io/streams': {
      'blocking-write': exports0['16'],
      'drop-input-stream': lowering12,
      'drop-output-stream': lowering13,
      'subscribe-to-input-stream': lowering4,
      'subscribe-to-output-stream': lowering3,
      write: exports0['15'],
    },
    'wasi:poll/poll': {
      'drop-pollable': lowering6,
      'poll-oneoff': exports0['17'],
    },
    'wasi:random/random': {
      'get-random-bytes': exports0['18'],
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports1.cabi_realloc;
  realloc1 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': lowering14,
      '1': lowering15,
      '10': lowering24,
      '11': lowering25,
      '12': lowering26,
      '13': lowering27,
      '14': lowering28,
      '15': lowering29,
      '16': lowering18,
      '17': lowering30,
      '18': lowering31,
      '19': lowering32,
      '2': lowering16,
      '20': exports2.random_get,
      '21': exports2.clock_time_get,
      '22': exports2.fd_write,
      '23': exports2.poll_oneoff,
      '24': exports2.environ_get,
      '25': exports2.environ_sizes_get,
      '26': exports2.proc_exit,
      '3': lowering17,
      '4': lowering18,
      '5': lowering19,
      '6': lowering20,
      '7': lowering21,
      '8': lowering22,
      '9': lowering23,
    },
  }));
  postReturn0 = exports1['cabi_post_component:nfs-rs/nfs#parse-url-and-mount'];
  postReturn1 = exports1['cabi_post_component:nfs-rs/nfs#null'];
  postReturn2 = exports1['cabi_post_component:nfs-rs/nfs#access'];
  postReturn3 = exports1['cabi_post_component:nfs-rs/nfs#access-path'];
  postReturn4 = exports1['cabi_post_component:nfs-rs/nfs#close'];
  postReturn5 = exports1['cabi_post_component:nfs-rs/nfs#commit'];
  postReturn6 = exports1['cabi_post_component:nfs-rs/nfs#commit-path'];
  postReturn7 = exports1['cabi_post_component:nfs-rs/nfs#create'];
  postReturn8 = exports1['cabi_post_component:nfs-rs/nfs#create-path'];
  postReturn9 = exports1['cabi_post_component:nfs-rs/nfs#delegpurge'];
  postReturn10 = exports1['cabi_post_component:nfs-rs/nfs#delegreturn'];
  postReturn11 = exports1['cabi_post_component:nfs-rs/nfs#getattr'];
  postReturn12 = exports1['cabi_post_component:nfs-rs/nfs#getattr-path'];
  postReturn13 = exports1['cabi_post_component:nfs-rs/nfs#setattr'];
  postReturn14 = exports1['cabi_post_component:nfs-rs/nfs#setattr-path'];
  postReturn15 = exports1['cabi_post_component:nfs-rs/nfs#getfh'];
  postReturn16 = exports1['cabi_post_component:nfs-rs/nfs#link'];
  postReturn17 = exports1['cabi_post_component:nfs-rs/nfs#link-path'];
  postReturn18 = exports1['cabi_post_component:nfs-rs/nfs#symlink'];
  postReturn19 = exports1['cabi_post_component:nfs-rs/nfs#symlink-path'];
  postReturn20 = exports1['cabi_post_component:nfs-rs/nfs#readlink'];
  postReturn21 = exports1['cabi_post_component:nfs-rs/nfs#readlink-path'];
  postReturn22 = exports1['cabi_post_component:nfs-rs/nfs#lookup'];
  postReturn23 = exports1['cabi_post_component:nfs-rs/nfs#pathconf'];
  postReturn24 = exports1['cabi_post_component:nfs-rs/nfs#pathconf-path'];
  postReturn25 = exports1['cabi_post_component:nfs-rs/nfs#read'];
  postReturn26 = exports1['cabi_post_component:nfs-rs/nfs#read-path'];
  postReturn27 = exports1['cabi_post_component:nfs-rs/nfs#write'];
  postReturn28 = exports1['cabi_post_component:nfs-rs/nfs#write-path'];
  postReturn29 = exports1['cabi_post_component:nfs-rs/nfs#readdir'];
  postReturn30 = exports1['cabi_post_component:nfs-rs/nfs#readdir-path'];
  postReturn31 = exports1['cabi_post_component:nfs-rs/nfs#readdirplus'];
  postReturn32 = exports1['cabi_post_component:nfs-rs/nfs#readdirplus-path'];
  postReturn33 = exports1['cabi_post_component:nfs-rs/nfs#mkdir'];
  postReturn34 = exports1['cabi_post_component:nfs-rs/nfs#mkdir-path'];
  postReturn35 = exports1['cabi_post_component:nfs-rs/nfs#remove'];
  postReturn36 = exports1['cabi_post_component:nfs-rs/nfs#remove-path'];
  postReturn37 = exports1['cabi_post_component:nfs-rs/nfs#rmdir'];
  postReturn38 = exports1['cabi_post_component:nfs-rs/nfs#rmdir-path'];
  postReturn39 = exports1['cabi_post_component:nfs-rs/nfs#rename'];
  postReturn40 = exports1['cabi_post_component:nfs-rs/nfs#rename-path'];
  postReturn41 = exports1['cabi_post_component:nfs-rs/nfs#umount'];
  
  function parseUrlAndMount(arg0) {
    const ptr0 = utf8Encode(arg0, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#parse-url-and-mount'](ptr0, len0);
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: dataView(memory0).getInt32(ret + 4, true) >>> 0
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 12, true);
        const len2 = dataView(memory0).getInt32(ret + 16, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn0(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function _null(arg0) {
    const ret = exports1['component:nfs-rs/nfs#null'](toUint32(arg0));
    let variant2;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant2= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant0;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant0 = null;
            break;
          }
          case 1: {
            variant0 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr1 = dataView(memory0).getInt32(ret + 12, true);
        const len1 = dataView(memory0).getInt32(ret + 16, true);
        const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
        variant2= {
          tag: 'err',
          val: {
            nfsErrorCode: variant0,
            message: result1,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn1(ret);
    if (variant2.tag === 'err') {
      throw new ComponentError(variant2.val);
    }
    return variant2.val;
  }
  
  function access(arg0, arg1, arg2) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ret = exports1['component:nfs-rs/nfs#access'](toUint32(arg0), ptr0, len0, toUint32(arg2));
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: dataView(memory0).getInt32(ret + 4, true) >>> 0
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 12, true);
        const len2 = dataView(memory0).getInt32(ret + 16, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn2(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function accessPath(arg0, arg1, arg2) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#access-path'](toUint32(arg0), ptr0, len0, toUint32(arg2));
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: dataView(memory0).getInt32(ret + 4, true) >>> 0
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 12, true);
        const len2 = dataView(memory0).getInt32(ret + 16, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn3(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function close(arg0, arg1, arg2) {
    const ret = exports1['component:nfs-rs/nfs#close'](toUint32(arg0), toUint32(arg1), toUint64(arg2));
    let variant2;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant2= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant0;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant0 = null;
            break;
          }
          case 1: {
            variant0 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr1 = dataView(memory0).getInt32(ret + 12, true);
        const len1 = dataView(memory0).getInt32(ret + 16, true);
        const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
        variant2= {
          tag: 'err',
          val: {
            nfsErrorCode: variant0,
            message: result1,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn4(ret);
    if (variant2.tag === 'err') {
      throw new ComponentError(variant2.val);
    }
    return variant2.val;
  }
  
  function commit(arg0, arg1, arg2, arg3) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ret = exports1['component:nfs-rs/nfs#commit'](toUint32(arg0), ptr0, len0, toUint64(arg2), toUint32(arg3));
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 12, true);
        const len2 = dataView(memory0).getInt32(ret + 16, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn5(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function commitPath(arg0, arg1, arg2, arg3) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#commit-path'](toUint32(arg0), ptr0, len0, toUint64(arg2), toUint32(arg3));
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 12, true);
        const len2 = dataView(memory0).getInt32(ret + 16, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn6(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function create(arg0, arg1, arg2, arg3) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ptr1 = utf8Encode(arg2, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#create'](toUint32(arg0), ptr0, len0, ptr1, len1, toUint32(arg3));
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr2 = dataView(memory0).getInt32(ret + 4, true);
        const len2 = dataView(memory0).getInt32(ret + 8, true);
        const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
        variant5= {
          tag: 'ok',
          val: result2
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = null;
            break;
          }
          case 1: {
            variant3 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr4 = dataView(memory0).getInt32(ret + 12, true);
        const len4 = dataView(memory0).getInt32(ret + 16, true);
        const result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
        variant5= {
          tag: 'err',
          val: {
            nfsErrorCode: variant3,
            message: result4,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn7(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  }
  
  function createPath(arg0, arg1, arg2) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#create-path'](toUint32(arg0), ptr0, len0, toUint32(arg2));
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr1 = dataView(memory0).getInt32(ret + 4, true);
        const len1 = dataView(memory0).getInt32(ret + 8, true);
        const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
        variant4= {
          tag: 'ok',
          val: result1
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn8(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function delegpurge(arg0, arg1) {
    const ret = exports1['component:nfs-rs/nfs#delegpurge'](toUint32(arg0), toUint64(arg1));
    let variant2;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant2= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant0;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant0 = null;
            break;
          }
          case 1: {
            variant0 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr1 = dataView(memory0).getInt32(ret + 12, true);
        const len1 = dataView(memory0).getInt32(ret + 16, true);
        const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
        variant2= {
          tag: 'err',
          val: {
            nfsErrorCode: variant0,
            message: result1,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn9(ret);
    if (variant2.tag === 'err') {
      throw new ComponentError(variant2.val);
    }
    return variant2.val;
  }
  
  function delegreturn(arg0, arg1) {
    const ret = exports1['component:nfs-rs/nfs#delegreturn'](toUint32(arg0), toUint64(arg1));
    let variant2;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant2= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant0;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant0 = null;
            break;
          }
          case 1: {
            variant0 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr1 = dataView(memory0).getInt32(ret + 12, true);
        const len1 = dataView(memory0).getInt32(ret + 16, true);
        const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
        variant2= {
          tag: 'err',
          val: {
            nfsErrorCode: variant0,
            message: result1,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn10(ret);
    if (variant2.tag === 'err') {
      throw new ComponentError(variant2.val);
    }
    return variant2.val;
  }
  
  function getattr(arg0, arg1) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ret = exports1['component:nfs-rs/nfs#getattr'](toUint32(arg0), ptr0, len0);
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: {
            attrType: dataView(memory0).getInt32(ret + 8, true) >>> 0,
            fileMode: dataView(memory0).getInt32(ret + 12, true) >>> 0,
            nlink: dataView(memory0).getInt32(ret + 16, true) >>> 0,
            uid: dataView(memory0).getInt32(ret + 20, true) >>> 0,
            gid: dataView(memory0).getInt32(ret + 24, true) >>> 0,
            filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 32, true)),
            used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 40, true)),
            specData: [dataView(memory0).getInt32(ret + 48, true) >>> 0, dataView(memory0).getInt32(ret + 52, true) >>> 0],
            fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 64, true)),
            atime: {
              seconds: dataView(memory0).getInt32(ret + 72, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 76, true) >>> 0,
            },
            mtime: {
              seconds: dataView(memory0).getInt32(ret + 80, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 84, true) >>> 0,
            },
            ctime: {
              seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
            },
          }
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 16, true);
        const len2 = dataView(memory0).getInt32(ret + 20, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn11(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function getattrPath(arg0, arg1) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#getattr-path'](toUint32(arg0), ptr0, len0);
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: {
            attrType: dataView(memory0).getInt32(ret + 8, true) >>> 0,
            fileMode: dataView(memory0).getInt32(ret + 12, true) >>> 0,
            nlink: dataView(memory0).getInt32(ret + 16, true) >>> 0,
            uid: dataView(memory0).getInt32(ret + 20, true) >>> 0,
            gid: dataView(memory0).getInt32(ret + 24, true) >>> 0,
            filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 32, true)),
            used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 40, true)),
            specData: [dataView(memory0).getInt32(ret + 48, true) >>> 0, dataView(memory0).getInt32(ret + 52, true) >>> 0],
            fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 64, true)),
            atime: {
              seconds: dataView(memory0).getInt32(ret + 72, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 76, true) >>> 0,
            },
            mtime: {
              seconds: dataView(memory0).getInt32(ret + 80, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 84, true) >>> 0,
            },
            ctime: {
              seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
            },
          }
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 16, true);
        const len2 = dataView(memory0).getInt32(ret + 20, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn12(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function setattr(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    const ptr0 = realloc0(0, 0, 8, 88);
    dataView(memory0).setInt32(ptr0 + 0, toUint32(arg0), true);
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    dataView(memory0).setInt32(ptr0 + 8, len1, true);
    dataView(memory0).setInt32(ptr0 + 4, ptr1, true);
    const variant3 = arg2;
    if (variant3 === null || variant3=== undefined) {
      dataView(memory0).setInt8(ptr0 + 12, 0, true);
    } else {
      const e = variant3;
      dataView(memory0).setInt8(ptr0 + 12, 1, true);
      const {seconds: v2_0, nseconds: v2_1 } = e;
      dataView(memory0).setInt32(ptr0 + 16, toUint32(v2_0), true);
      dataView(memory0).setInt32(ptr0 + 20, toUint32(v2_1), true);
    }
    const variant4 = arg3;
    if (variant4 === null || variant4=== undefined) {
      dataView(memory0).setInt8(ptr0 + 24, 0, true);
    } else {
      const e = variant4;
      dataView(memory0).setInt8(ptr0 + 24, 1, true);
      dataView(memory0).setInt32(ptr0 + 28, toUint32(e), true);
    }
    const variant5 = arg4;
    if (variant5 === null || variant5=== undefined) {
      dataView(memory0).setInt8(ptr0 + 32, 0, true);
    } else {
      const e = variant5;
      dataView(memory0).setInt8(ptr0 + 32, 1, true);
      dataView(memory0).setInt32(ptr0 + 36, toUint32(e), true);
    }
    const variant6 = arg5;
    if (variant6 === null || variant6=== undefined) {
      dataView(memory0).setInt8(ptr0 + 40, 0, true);
    } else {
      const e = variant6;
      dataView(memory0).setInt8(ptr0 + 40, 1, true);
      dataView(memory0).setInt32(ptr0 + 44, toUint32(e), true);
    }
    const variant7 = arg6;
    if (variant7 === null || variant7=== undefined) {
      dataView(memory0).setInt8(ptr0 + 48, 0, true);
    } else {
      const e = variant7;
      dataView(memory0).setInt8(ptr0 + 48, 1, true);
      dataView(memory0).setBigInt64(ptr0 + 56, toUint64(e), true);
    }
    const variant9 = arg7;
    if (variant9 === null || variant9=== undefined) {
      dataView(memory0).setInt8(ptr0 + 64, 0, true);
    } else {
      const e = variant9;
      dataView(memory0).setInt8(ptr0 + 64, 1, true);
      const {seconds: v8_0, nseconds: v8_1 } = e;
      dataView(memory0).setInt32(ptr0 + 68, toUint32(v8_0), true);
      dataView(memory0).setInt32(ptr0 + 72, toUint32(v8_1), true);
    }
    const variant11 = arg8;
    if (variant11 === null || variant11=== undefined) {
      dataView(memory0).setInt8(ptr0 + 76, 0, true);
    } else {
      const e = variant11;
      dataView(memory0).setInt8(ptr0 + 76, 1, true);
      const {seconds: v10_0, nseconds: v10_1 } = e;
      dataView(memory0).setInt32(ptr0 + 80, toUint32(v10_0), true);
      dataView(memory0).setInt32(ptr0 + 84, toUint32(v10_1), true);
    }
    const ret = exports1['component:nfs-rs/nfs#setattr'](ptr0);
    let variant14;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant14= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant12;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant12 = null;
            break;
          }
          case 1: {
            variant12 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr13 = dataView(memory0).getInt32(ret + 12, true);
        const len13 = dataView(memory0).getInt32(ret + 16, true);
        const result13 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr13, len13));
        variant14= {
          tag: 'err',
          val: {
            nfsErrorCode: variant12,
            message: result13,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn13(ret);
    if (variant14.tag === 'err') {
      throw new ComponentError(variant14.val);
    }
    return variant14.val;
  }
  
  function setattrPath(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    const ptr0 = realloc0(0, 0, 8, 80);
    dataView(memory0).setInt32(ptr0 + 0, toUint32(arg0), true);
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    dataView(memory0).setInt32(ptr0 + 8, len1, true);
    dataView(memory0).setInt32(ptr0 + 4, ptr1, true);
    dataView(memory0).setInt8(ptr0 + 12, arg2 ? 1 : 0, true);
    const variant2 = arg3;
    if (variant2 === null || variant2=== undefined) {
      dataView(memory0).setInt8(ptr0 + 16, 0, true);
    } else {
      const e = variant2;
      dataView(memory0).setInt8(ptr0 + 16, 1, true);
      dataView(memory0).setInt32(ptr0 + 20, toUint32(e), true);
    }
    const variant3 = arg4;
    if (variant3 === null || variant3=== undefined) {
      dataView(memory0).setInt8(ptr0 + 24, 0, true);
    } else {
      const e = variant3;
      dataView(memory0).setInt8(ptr0 + 24, 1, true);
      dataView(memory0).setInt32(ptr0 + 28, toUint32(e), true);
    }
    const variant4 = arg5;
    if (variant4 === null || variant4=== undefined) {
      dataView(memory0).setInt8(ptr0 + 32, 0, true);
    } else {
      const e = variant4;
      dataView(memory0).setInt8(ptr0 + 32, 1, true);
      dataView(memory0).setInt32(ptr0 + 36, toUint32(e), true);
    }
    const variant5 = arg6;
    if (variant5 === null || variant5=== undefined) {
      dataView(memory0).setInt8(ptr0 + 40, 0, true);
    } else {
      const e = variant5;
      dataView(memory0).setInt8(ptr0 + 40, 1, true);
      dataView(memory0).setBigInt64(ptr0 + 48, toUint64(e), true);
    }
    const variant7 = arg7;
    if (variant7 === null || variant7=== undefined) {
      dataView(memory0).setInt8(ptr0 + 56, 0, true);
    } else {
      const e = variant7;
      dataView(memory0).setInt8(ptr0 + 56, 1, true);
      const {seconds: v6_0, nseconds: v6_1 } = e;
      dataView(memory0).setInt32(ptr0 + 60, toUint32(v6_0), true);
      dataView(memory0).setInt32(ptr0 + 64, toUint32(v6_1), true);
    }
    const variant9 = arg8;
    if (variant9 === null || variant9=== undefined) {
      dataView(memory0).setInt8(ptr0 + 68, 0, true);
    } else {
      const e = variant9;
      dataView(memory0).setInt8(ptr0 + 68, 1, true);
      const {seconds: v8_0, nseconds: v8_1 } = e;
      dataView(memory0).setInt32(ptr0 + 72, toUint32(v8_0), true);
      dataView(memory0).setInt32(ptr0 + 76, toUint32(v8_1), true);
    }
    const ret = exports1['component:nfs-rs/nfs#setattr-path'](ptr0);
    let variant12;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant12= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant10;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant10 = null;
            break;
          }
          case 1: {
            variant10 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr11 = dataView(memory0).getInt32(ret + 12, true);
        const len11 = dataView(memory0).getInt32(ret + 16, true);
        const result11 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr11, len11));
        variant12= {
          tag: 'err',
          val: {
            nfsErrorCode: variant10,
            message: result11,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn14(ret);
    if (variant12.tag === 'err') {
      throw new ComponentError(variant12.val);
    }
    return variant12.val;
  }
  
  function getfh(arg0) {
    const ret = exports1['component:nfs-rs/nfs#getfh'](toUint32(arg0));
    let variant2;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant2= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant0;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant0 = null;
            break;
          }
          case 1: {
            variant0 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr1 = dataView(memory0).getInt32(ret + 12, true);
        const len1 = dataView(memory0).getInt32(ret + 16, true);
        const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
        variant2= {
          tag: 'err',
          val: {
            nfsErrorCode: variant0,
            message: result1,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn15(ret);
    if (variant2.tag === 'err') {
      throw new ComponentError(variant2.val);
    }
    return variant2.val;
  }
  
  function link(arg0, arg1, arg2, arg3) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const val1 = arg2;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ptr2 = utf8Encode(arg3, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#link'](toUint32(arg0), ptr0, len0, ptr1, len1, ptr2, len2);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: {
            attrType: dataView(memory0).getInt32(ret + 8, true) >>> 0,
            fileMode: dataView(memory0).getInt32(ret + 12, true) >>> 0,
            nlink: dataView(memory0).getInt32(ret + 16, true) >>> 0,
            uid: dataView(memory0).getInt32(ret + 20, true) >>> 0,
            gid: dataView(memory0).getInt32(ret + 24, true) >>> 0,
            filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 32, true)),
            used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 40, true)),
            specData: [dataView(memory0).getInt32(ret + 48, true) >>> 0, dataView(memory0).getInt32(ret + 52, true) >>> 0],
            fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 64, true)),
            atime: {
              seconds: dataView(memory0).getInt32(ret + 72, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 76, true) >>> 0,
            },
            mtime: {
              seconds: dataView(memory0).getInt32(ret + 80, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 84, true) >>> 0,
            },
            ctime: {
              seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
            },
          }
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant3 = null;
            break;
          }
          case 1: {
            variant3 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr4 = dataView(memory0).getInt32(ret + 16, true);
        const len4 = dataView(memory0).getInt32(ret + 20, true);
        const result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
        variant5= {
          tag: 'err',
          val: {
            nfsErrorCode: variant3,
            message: result4,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn16(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  }
  
  function linkPath(arg0, arg1, arg2) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ptr1 = utf8Encode(arg2, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#link-path'](toUint32(arg0), ptr0, len0, ptr1, len1);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant4= {
          tag: 'ok',
          val: {
            attrType: dataView(memory0).getInt32(ret + 8, true) >>> 0,
            fileMode: dataView(memory0).getInt32(ret + 12, true) >>> 0,
            nlink: dataView(memory0).getInt32(ret + 16, true) >>> 0,
            uid: dataView(memory0).getInt32(ret + 20, true) >>> 0,
            gid: dataView(memory0).getInt32(ret + 24, true) >>> 0,
            filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 32, true)),
            used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 40, true)),
            specData: [dataView(memory0).getInt32(ret + 48, true) >>> 0, dataView(memory0).getInt32(ret + 52, true) >>> 0],
            fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 64, true)),
            atime: {
              seconds: dataView(memory0).getInt32(ret + 72, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 76, true) >>> 0,
            },
            mtime: {
              seconds: dataView(memory0).getInt32(ret + 80, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 84, true) >>> 0,
            },
            ctime: {
              seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
              nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
            },
          }
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 16, true);
        const len3 = dataView(memory0).getInt32(ret + 20, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn17(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function symlink(arg0, arg1, arg2, arg3) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const val1 = arg2;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ptr2 = utf8Encode(arg3, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#symlink'](toUint32(arg0), ptr0, len0, ptr1, len1, ptr2, len2);
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr3 = dataView(memory0).getInt32(ret + 4, true);
        const len3 = dataView(memory0).getInt32(ret + 8, true);
        const result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
        variant6= {
          tag: 'ok',
          val: result3
        };
        break;
      }
      case 1: {
        let variant4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant4 = null;
            break;
          }
          case 1: {
            variant4 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr5 = dataView(memory0).getInt32(ret + 12, true);
        const len5 = dataView(memory0).getInt32(ret + 16, true);
        const result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
        variant6= {
          tag: 'err',
          val: {
            nfsErrorCode: variant4,
            message: result5,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn18(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  }
  
  function symlinkPath(arg0, arg1, arg2) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ptr1 = utf8Encode(arg2, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#symlink-path'](toUint32(arg0), ptr0, len0, ptr1, len1);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr2 = dataView(memory0).getInt32(ret + 4, true);
        const len2 = dataView(memory0).getInt32(ret + 8, true);
        const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
        variant5= {
          tag: 'ok',
          val: result2
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = null;
            break;
          }
          case 1: {
            variant3 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr4 = dataView(memory0).getInt32(ret + 12, true);
        const len4 = dataView(memory0).getInt32(ret + 16, true);
        const result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
        variant5= {
          tag: 'err',
          val: {
            nfsErrorCode: variant3,
            message: result4,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn19(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  }
  
  function readlink(arg0, arg1) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ret = exports1['component:nfs-rs/nfs#readlink'](toUint32(arg0), ptr0, len0);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr1 = dataView(memory0).getInt32(ret + 4, true);
        const len1 = dataView(memory0).getInt32(ret + 8, true);
        const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
        variant4= {
          tag: 'ok',
          val: result1
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn20(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function readlinkPath(arg0, arg1) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#readlink-path'](toUint32(arg0), ptr0, len0);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr1 = dataView(memory0).getInt32(ret + 4, true);
        const len1 = dataView(memory0).getInt32(ret + 8, true);
        const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
        variant4= {
          tag: 'ok',
          val: result1
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn21(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function lookup(arg0, arg1) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#lookup'](toUint32(arg0), ptr0, len0);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr1 = dataView(memory0).getInt32(ret + 4, true);
        const len1 = dataView(memory0).getInt32(ret + 8, true);
        const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
        variant4= {
          tag: 'ok',
          val: result1
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn22(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function pathconf(arg0, arg1) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ret = exports1['component:nfs-rs/nfs#pathconf'](toUint32(arg0), ptr0, len0);
    let variant8;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = {
              attrType: dataView(memory0).getInt32(ret + 16, true) >>> 0,
              fileMode: dataView(memory0).getInt32(ret + 20, true) >>> 0,
              nlink: dataView(memory0).getInt32(ret + 24, true) >>> 0,
              uid: dataView(memory0).getInt32(ret + 28, true) >>> 0,
              gid: dataView(memory0).getInt32(ret + 32, true) >>> 0,
              filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 40, true)),
              used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
              specData: [dataView(memory0).getInt32(ret + 56, true) >>> 0, dataView(memory0).getInt32(ret + 60, true) >>> 0],
              fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 64, true)),
              fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
              atime: {
                seconds: dataView(memory0).getInt32(ret + 80, true) >>> 0,
                nseconds: dataView(memory0).getInt32(ret + 84, true) >>> 0,
              },
              mtime: {
                seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
              },
              ctime: {
                seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
              },
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const bool2 = dataView(memory0).getUint8(ret + 112, true);
        const bool3 = dataView(memory0).getUint8(ret + 113, true);
        const bool4 = dataView(memory0).getUint8(ret + 114, true);
        const bool5 = dataView(memory0).getUint8(ret + 115, true);
        variant8= {
          tag: 'ok',
          val: {
            attr: variant1,
            linkmax: dataView(memory0).getInt32(ret + 104, true) >>> 0,
            nameMax: dataView(memory0).getInt32(ret + 108, true) >>> 0,
            noTrunc: bool2 == 0 ? false : (bool2 == 1 ? true : throwInvalidBool()),
            chownRestricted: bool3 == 0 ? false : (bool3 == 1 ? true : throwInvalidBool()),
            caseInsensitive: bool4 == 0 ? false : (bool4 == 1 ? true : throwInvalidBool()),
            casePreserving: bool5 == 0 ? false : (bool5 == 1 ? true : throwInvalidBool()),
          }
        };
        break;
      }
      case 1: {
        let variant6;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant6 = null;
            break;
          }
          case 1: {
            variant6 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr7 = dataView(memory0).getInt32(ret + 16, true);
        const len7 = dataView(memory0).getInt32(ret + 20, true);
        const result7 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr7, len7));
        variant8= {
          tag: 'err',
          val: {
            nfsErrorCode: variant6,
            message: result7,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn23(ret);
    if (variant8.tag === 'err') {
      throw new ComponentError(variant8.val);
    }
    return variant8.val;
  }
  
  function pathconfPath(arg0, arg1) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#pathconf-path'](toUint32(arg0), ptr0, len0);
    let variant8;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = {
              attrType: dataView(memory0).getInt32(ret + 16, true) >>> 0,
              fileMode: dataView(memory0).getInt32(ret + 20, true) >>> 0,
              nlink: dataView(memory0).getInt32(ret + 24, true) >>> 0,
              uid: dataView(memory0).getInt32(ret + 28, true) >>> 0,
              gid: dataView(memory0).getInt32(ret + 32, true) >>> 0,
              filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 40, true)),
              used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
              specData: [dataView(memory0).getInt32(ret + 56, true) >>> 0, dataView(memory0).getInt32(ret + 60, true) >>> 0],
              fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 64, true)),
              fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
              atime: {
                seconds: dataView(memory0).getInt32(ret + 80, true) >>> 0,
                nseconds: dataView(memory0).getInt32(ret + 84, true) >>> 0,
              },
              mtime: {
                seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
              },
              ctime: {
                seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
              },
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const bool2 = dataView(memory0).getUint8(ret + 112, true);
        const bool3 = dataView(memory0).getUint8(ret + 113, true);
        const bool4 = dataView(memory0).getUint8(ret + 114, true);
        const bool5 = dataView(memory0).getUint8(ret + 115, true);
        variant8= {
          tag: 'ok',
          val: {
            attr: variant1,
            linkmax: dataView(memory0).getInt32(ret + 104, true) >>> 0,
            nameMax: dataView(memory0).getInt32(ret + 108, true) >>> 0,
            noTrunc: bool2 == 0 ? false : (bool2 == 1 ? true : throwInvalidBool()),
            chownRestricted: bool3 == 0 ? false : (bool3 == 1 ? true : throwInvalidBool()),
            caseInsensitive: bool4 == 0 ? false : (bool4 == 1 ? true : throwInvalidBool()),
            casePreserving: bool5 == 0 ? false : (bool5 == 1 ? true : throwInvalidBool()),
          }
        };
        break;
      }
      case 1: {
        let variant6;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant6 = null;
            break;
          }
          case 1: {
            variant6 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr7 = dataView(memory0).getInt32(ret + 16, true);
        const len7 = dataView(memory0).getInt32(ret + 20, true);
        const result7 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr7, len7));
        variant8= {
          tag: 'err',
          val: {
            nfsErrorCode: variant6,
            message: result7,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn24(ret);
    if (variant8.tag === 'err') {
      throw new ComponentError(variant8.val);
    }
    return variant8.val;
  }
  
  function read(arg0, arg1, arg2, arg3) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ret = exports1['component:nfs-rs/nfs#read'](toUint32(arg0), ptr0, len0, toUint64(arg2), toUint32(arg3));
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr1 = dataView(memory0).getInt32(ret + 4, true);
        const len1 = dataView(memory0).getInt32(ret + 8, true);
        const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
        variant4= {
          tag: 'ok',
          val: result1
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn25(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function readPath(arg0, arg1, arg2, arg3) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#read-path'](toUint32(arg0), ptr0, len0, toUint64(arg2), toUint32(arg3));
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr1 = dataView(memory0).getInt32(ret + 4, true);
        const len1 = dataView(memory0).getInt32(ret + 8, true);
        const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
        variant4= {
          tag: 'ok',
          val: result1
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn26(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function write$1(arg0, arg1, arg2, arg3) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const val1 = arg3;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#write'](toUint32(arg0), ptr0, len0, toUint64(arg2), ptr1, len1);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant4= {
          tag: 'ok',
          val: dataView(memory0).getInt32(ret + 4, true) >>> 0
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn27(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function writePath(arg0, arg1, arg2, arg3) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const val1 = arg3;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#write-path'](toUint32(arg0), ptr0, len0, toUint64(arg2), ptr1, len1);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant4= {
          tag: 'ok',
          val: dataView(memory0).getInt32(ret + 4, true) >>> 0
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn28(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function readdir(arg0, arg1) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ret = exports1['component:nfs-rs/nfs#readdir'](toUint32(arg0), ptr0, len0);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const len2 = dataView(memory0).getInt32(ret + 8, true);
        const base2 = dataView(memory0).getInt32(ret + 4, true);
        const result2 = [];
        for (let i = 0; i < len2; i++) {
          const base = base2 + i * 24;
          const ptr1 = dataView(memory0).getInt32(base + 8, true);
          const len1 = dataView(memory0).getInt32(base + 12, true);
          const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
          result2.push({
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
            fileName: result1,
            cookie: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 16, true)),
          });
        }
        variant5= {
          tag: 'ok',
          val: result2
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = null;
            break;
          }
          case 1: {
            variant3 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr4 = dataView(memory0).getInt32(ret + 12, true);
        const len4 = dataView(memory0).getInt32(ret + 16, true);
        const result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
        variant5= {
          tag: 'err',
          val: {
            nfsErrorCode: variant3,
            message: result4,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn29(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  }
  
  function readdirPath(arg0, arg1) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#readdir-path'](toUint32(arg0), ptr0, len0);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const len2 = dataView(memory0).getInt32(ret + 8, true);
        const base2 = dataView(memory0).getInt32(ret + 4, true);
        const result2 = [];
        for (let i = 0; i < len2; i++) {
          const base = base2 + i * 24;
          const ptr1 = dataView(memory0).getInt32(base + 8, true);
          const len1 = dataView(memory0).getInt32(base + 12, true);
          const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
          result2.push({
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
            fileName: result1,
            cookie: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 16, true)),
          });
        }
        variant5= {
          tag: 'ok',
          val: result2
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = null;
            break;
          }
          case 1: {
            variant3 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr4 = dataView(memory0).getInt32(ret + 12, true);
        const len4 = dataView(memory0).getInt32(ret + 16, true);
        const result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
        variant5= {
          tag: 'err',
          val: {
            nfsErrorCode: variant3,
            message: result4,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn30(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  }
  
  function readdirplus(arg0, arg1) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ret = exports1['component:nfs-rs/nfs#readdirplus'](toUint32(arg0), ptr0, len0);
    let variant7;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const len4 = dataView(memory0).getInt32(ret + 8, true);
        const base4 = dataView(memory0).getInt32(ret + 4, true);
        const result4 = [];
        for (let i = 0; i < len4; i++) {
          const base = base4 + i * 128;
          const ptr1 = dataView(memory0).getInt32(base + 8, true);
          const len1 = dataView(memory0).getInt32(base + 12, true);
          const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
          let variant2;
          switch (dataView(memory0).getUint8(base + 24, true)) {
            case 0: {
              variant2 = null;
              break;
            }
            case 1: {
              variant2 = {
                attrType: dataView(memory0).getInt32(base + 32, true) >>> 0,
                fileMode: dataView(memory0).getInt32(base + 36, true) >>> 0,
                nlink: dataView(memory0).getInt32(base + 40, true) >>> 0,
                uid: dataView(memory0).getInt32(base + 44, true) >>> 0,
                gid: dataView(memory0).getInt32(base + 48, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 56, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 64, true)),
                specData: [dataView(memory0).getInt32(base + 72, true) >>> 0, dataView(memory0).getInt32(base + 76, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 80, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 88, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(base + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(base + 100, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(base + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(base + 108, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(base + 112, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(base + 116, true) >>> 0,
                },
              };
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          const ptr3 = dataView(memory0).getInt32(base + 120, true);
          const len3 = dataView(memory0).getInt32(base + 124, true);
          const result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
          result4.push({
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
            fileName: result1,
            cookie: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 16, true)),
            attr: variant2,
            handle: result3,
          });
        }
        variant7= {
          tag: 'ok',
          val: result4
        };
        break;
      }
      case 1: {
        let variant5;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant5 = null;
            break;
          }
          case 1: {
            variant5 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr6 = dataView(memory0).getInt32(ret + 12, true);
        const len6 = dataView(memory0).getInt32(ret + 16, true);
        const result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
        variant7= {
          tag: 'err',
          val: {
            nfsErrorCode: variant5,
            message: result6,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn31(ret);
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  }
  
  function readdirplusPath(arg0, arg1) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#readdirplus-path'](toUint32(arg0), ptr0, len0);
    let variant7;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const len4 = dataView(memory0).getInt32(ret + 8, true);
        const base4 = dataView(memory0).getInt32(ret + 4, true);
        const result4 = [];
        for (let i = 0; i < len4; i++) {
          const base = base4 + i * 128;
          const ptr1 = dataView(memory0).getInt32(base + 8, true);
          const len1 = dataView(memory0).getInt32(base + 12, true);
          const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
          let variant2;
          switch (dataView(memory0).getUint8(base + 24, true)) {
            case 0: {
              variant2 = null;
              break;
            }
            case 1: {
              variant2 = {
                attrType: dataView(memory0).getInt32(base + 32, true) >>> 0,
                fileMode: dataView(memory0).getInt32(base + 36, true) >>> 0,
                nlink: dataView(memory0).getInt32(base + 40, true) >>> 0,
                uid: dataView(memory0).getInt32(base + 44, true) >>> 0,
                gid: dataView(memory0).getInt32(base + 48, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 56, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 64, true)),
                specData: [dataView(memory0).getInt32(base + 72, true) >>> 0, dataView(memory0).getInt32(base + 76, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 80, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 88, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(base + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(base + 100, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(base + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(base + 108, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(base + 112, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(base + 116, true) >>> 0,
                },
              };
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          const ptr3 = dataView(memory0).getInt32(base + 120, true);
          const len3 = dataView(memory0).getInt32(base + 124, true);
          const result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
          result4.push({
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
            fileName: result1,
            cookie: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 16, true)),
            attr: variant2,
            handle: result3,
          });
        }
        variant7= {
          tag: 'ok',
          val: result4
        };
        break;
      }
      case 1: {
        let variant5;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant5 = null;
            break;
          }
          case 1: {
            variant5 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr6 = dataView(memory0).getInt32(ret + 12, true);
        const len6 = dataView(memory0).getInt32(ret + 16, true);
        const result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
        variant7= {
          tag: 'err',
          val: {
            nfsErrorCode: variant5,
            message: result6,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn32(ret);
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  }
  
  function mkdir(arg0, arg1, arg2, arg3) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ptr1 = utf8Encode(arg2, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#mkdir'](toUint32(arg0), ptr0, len0, ptr1, len1, toUint32(arg3));
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr2 = dataView(memory0).getInt32(ret + 4, true);
        const len2 = dataView(memory0).getInt32(ret + 8, true);
        const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
        variant5= {
          tag: 'ok',
          val: result2
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = null;
            break;
          }
          case 1: {
            variant3 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr4 = dataView(memory0).getInt32(ret + 12, true);
        const len4 = dataView(memory0).getInt32(ret + 16, true);
        const result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
        variant5= {
          tag: 'err',
          val: {
            nfsErrorCode: variant3,
            message: result4,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn33(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  }
  
  function mkdirPath(arg0, arg1, arg2) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#mkdir-path'](toUint32(arg0), ptr0, len0, toUint32(arg2));
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr1 = dataView(memory0).getInt32(ret + 4, true);
        const len1 = dataView(memory0).getInt32(ret + 8, true);
        const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
        variant4= {
          tag: 'ok',
          val: result1
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn34(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function remove(arg0, arg1, arg2) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ptr1 = utf8Encode(arg2, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#remove'](toUint32(arg0), ptr0, len0, ptr1, len1);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant4= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn35(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function removePath(arg0, arg1) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#remove-path'](toUint32(arg0), ptr0, len0);
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 12, true);
        const len2 = dataView(memory0).getInt32(ret + 16, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn36(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function rmdir(arg0, arg1, arg2) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ptr1 = utf8Encode(arg2, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#rmdir'](toUint32(arg0), ptr0, len0, ptr1, len1);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant4= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn37(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function rmdirPath(arg0, arg1) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#rmdir-path'](toUint32(arg0), ptr0, len0);
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant1;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant1 = null;
            break;
          }
          case 1: {
            variant1 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr2 = dataView(memory0).getInt32(ret + 12, true);
        const len2 = dataView(memory0).getInt32(ret + 16, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
        variant3= {
          tag: 'err',
          val: {
            nfsErrorCode: variant1,
            message: result2,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn38(ret);
    if (variant3.tag === 'err') {
      throw new ComponentError(variant3.val);
    }
    return variant3.val;
  }
  
  function rename(arg0, arg1, arg2, arg3, arg4) {
    const val0 = arg1;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    const ptr1 = utf8Encode(arg2, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const val2 = arg3;
    const len2 = val2.byteLength;
    const ptr2 = realloc0(0, 0, 1, len2 * 1);
    const src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    const ptr3 = utf8Encode(arg4, realloc0, memory0);
    const len3 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#rename'](toUint32(arg0), ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant6= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant4 = null;
            break;
          }
          case 1: {
            variant4 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr5 = dataView(memory0).getInt32(ret + 12, true);
        const len5 = dataView(memory0).getInt32(ret + 16, true);
        const result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
        variant6= {
          tag: 'err',
          val: {
            nfsErrorCode: variant4,
            message: result5,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn39(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  }
  
  function renamePath(arg0, arg1, arg2) {
    const ptr0 = utf8Encode(arg1, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ptr1 = utf8Encode(arg2, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#rename-path'](toUint32(arg0), ptr0, len0, ptr1, len1);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant4= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant2 = null;
            break;
          }
          case 1: {
            variant2 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr3 = dataView(memory0).getInt32(ret + 12, true);
        const len3 = dataView(memory0).getInt32(ret + 16, true);
        const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant4= {
          tag: 'err',
          val: {
            nfsErrorCode: variant2,
            message: result3,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn40(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  }
  
  function umount(arg0) {
    const ret = exports1['component:nfs-rs/nfs#umount'](toUint32(arg0));
    let variant2;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant2= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant0;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant0 = null;
            break;
          }
          case 1: {
            variant0 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr1 = dataView(memory0).getInt32(ret + 12, true);
        const len1 = dataView(memory0).getInt32(ret + 16, true);
        const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
        variant2= {
          tag: 'err',
          val: {
            nfsErrorCode: variant0,
            message: result1,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn41(ret);
    if (variant2.tag === 'err') {
      throw new ComponentError(variant2.val);
    }
    return variant2.val;
  }
  const nfs = {
    access: access,
    accessPath: accessPath,
    close: close,
    commit: commit,
    commitPath: commitPath,
    create: create,
    createPath: createPath,
    delegpurge: delegpurge,
    delegreturn: delegreturn,
    getattr: getattr,
    getattrPath: getattrPath,
    getfh: getfh,
    link: link,
    linkPath: linkPath,
    lookup: lookup,
    mkdir: mkdir,
    mkdirPath: mkdirPath,
    'null': _null,
    parseUrlAndMount: parseUrlAndMount,
    pathconf: pathconf,
    pathconfPath: pathconfPath,
    read: read,
    readPath: readPath,
    readdir: readdir,
    readdirPath: readdirPath,
    readdirplus: readdirplus,
    readdirplusPath: readdirplusPath,
    readlink: readlink,
    readlinkPath: readlinkPath,
    remove: remove,
    removePath: removePath,
    rename: rename,
    renamePath: renamePath,
    rmdir: rmdir,
    rmdirPath: rmdirPath,
    setattr: setattr,
    setattrPath: setattrPath,
    symlink: symlink,
    symlinkPath: symlinkPath,
    umount: umount,
    write: write$1,
    writePath: writePath,
    
  };
  
  return { nfs, 'component:nfs-rs/nfs': nfs };
}
