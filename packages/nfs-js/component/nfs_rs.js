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

const resourceHandleSymbol = Symbol('resource');

const symbolDispose = Symbol.dispose || Symbol.for('dispose');

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
  
  const { getEnvironment } = imports['wasi:cli/environment'];
  const { exit } = imports['wasi:cli/exit'];
  const { getStderr } = imports['wasi:cli/stderr'];
  const { getStdin } = imports['wasi:cli/stdin'];
  const { getStdout } = imports['wasi:cli/stdout'];
  const { now, subscribeDuration, subscribeInstant } = imports['wasi:clocks/monotonic-clock'];
  const { now: now$1 } = imports['wasi:clocks/wall-clock'];
  const { getDirectories } = imports['wasi:filesystem/preopens'];
  const { Descriptor, filesystemErrorCode } = imports['wasi:filesystem/types'];
  const { Pollable, poll } = imports['wasi:io/poll'];
  const { InputStream, OutputStream } = imports['wasi:io/streams'];
  const { getRandomBytes } = imports['wasi:random/random'];
  const { Network, instanceNetwork } = imports['wasi:sockets/instance-network'];
  const { ResolveAddressStream, resolveAddresses } = imports['wasi:sockets/ip-name-lookup'];
  const { TcpSocket } = imports['wasi:sockets/tcp'];
  const { createTcpSocket } = imports['wasi:sockets/tcp-create-socket'];
  let exports0;
  
  function trampoline6() {
    const ret = instanceNetwork();
    if (!(ret instanceof Network)) {
      throw new Error('Not a valid "Network" resource.');
    }
    const handle0 = handleCnt4++;
    handleTable4.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  let exports1;
  
  function trampoline8() {
    const ret = now();
    return toUint64(ret);
  }
  
  function trampoline10(arg0) {
    const ret = subscribeDuration(BigInt.asUintN(64, arg0));
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle0 = handleCnt0++;
    handleTable0.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline11(arg0) {
    const ret = subscribeInstant(BigInt.asUintN(64, arg0));
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle0 = handleCnt0++;
    handleTable0.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline12(arg0) {
    const handle1 = arg0;
    const rsc0 = handleTable3.get(handle1).rep;
    const ret = OutputStream.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle2 = handleCnt0++;
    handleTable0.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline13(arg0) {
    const handle1 = arg0;
    const rsc0 = handleTable2.get(handle1).rep;
    const ret = InputStream.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle2 = handleCnt0++;
    handleTable0.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline15() {
    const ret = getStderr();
    if (!(ret instanceof OutputStream)) {
      throw new Error('Not a valid "OutputStream" resource.');
    }
    const handle0 = handleCnt3++;
    handleTable3.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline16(arg0) {
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
  
  function trampoline17() {
    const ret = getStdin();
    if (!(ret instanceof InputStream)) {
      throw new Error('Not a valid "InputStream" resource.');
    }
    const handle0 = handleCnt2++;
    handleTable2.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline18() {
    const ret = getStdout();
    if (!(ret instanceof OutputStream)) {
      throw new Error('Not a valid "OutputStream" resource.');
    }
    const handle0 = handleCnt3++;
    handleTable3.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  let exports2;
  
  function trampoline19(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    const handle3 = arg1;
    const rsc2 = handleTable4.get(handle3).rep;
    let variant4;
    switch (arg2) {
      case 0: {
        variant4= {
          tag: 'ipv4',
          val: {
            port: clampGuest(arg3, 0, 65535),
            address: [clampGuest(arg4, 0, 255), clampGuest(arg5, 0, 255), clampGuest(arg6, 0, 255), clampGuest(arg7, 0, 255)],
          }
        };
        break;
      }
      case 1: {
        variant4= {
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
      ret = { tag: 'ok', val: TcpSocket.prototype.startConnect.call(rsc0, rsc2, variant4) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
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
          case 'invalid-argument': {
            enum5 = 3;
            break;
          }
          case 'out-of-memory': {
            enum5 = 4;
            break;
          }
          case 'timeout': {
            enum5 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum5 = 6;
            break;
          }
          case 'not-in-progress': {
            enum5 = 7;
            break;
          }
          case 'would-block': {
            enum5 = 8;
            break;
          }
          case 'invalid-state': {
            enum5 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum5 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum5 = 11;
            break;
          }
          case 'address-in-use': {
            enum5 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum5 = 13;
            break;
          }
          case 'connection-refused': {
            enum5 = 14;
            break;
          }
          case 'connection-reset': {
            enum5 = 15;
            break;
          }
          case 'connection-aborted': {
            enum5 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum5 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum5 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum5 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum5 = 20;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val5}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg14 + 1, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  let memory0;
  
  function trampoline20(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.finishConnect.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const [tuple2_0, tuple2_1] = e;
        if (!(tuple2_0 instanceof InputStream)) {
          throw new Error('Not a valid "InputStream" resource.');
        }
        const handle3 = handleCnt2++;
        handleTable2.set(handle3, { rep: tuple2_0, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle3, true);
        if (!(tuple2_1 instanceof OutputStream)) {
          throw new Error('Not a valid "OutputStream" resource.');
        }
        const handle4 = handleCnt3++;
        handleTable3.set(handle4, { rep: tuple2_1, own: true });
        dataView(memory0).setInt32(arg1 + 8, handle4, true);
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
          case 'invalid-argument': {
            enum5 = 3;
            break;
          }
          case 'out-of-memory': {
            enum5 = 4;
            break;
          }
          case 'timeout': {
            enum5 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum5 = 6;
            break;
          }
          case 'not-in-progress': {
            enum5 = 7;
            break;
          }
          case 'would-block': {
            enum5 = 8;
            break;
          }
          case 'invalid-state': {
            enum5 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum5 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum5 = 11;
            break;
          }
          case 'address-in-use': {
            enum5 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum5 = 13;
            break;
          }
          case 'connection-refused': {
            enum5 = 14;
            break;
          }
          case 'connection-reset': {
            enum5 = 15;
            break;
          }
          case 'connection-aborted': {
            enum5 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum5 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum5 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum5 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum5 = 20;
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
  
  function trampoline21(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.remoteAddress.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant6 = e;
        switch (variant6.tag) {
          case 'ipv4': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            const {port: v2_0, address: v2_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            const [tuple3_0, tuple3_1, tuple3_2, tuple3_3] = v2_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple3_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple3_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple3_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple3_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            const {port: v4_0, flowInfo: v4_1, address: v4_2, scopeId: v4_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v4_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v4_1), true);
            const [tuple5_0, tuple5_1, tuple5_2, tuple5_3, tuple5_4, tuple5_5, tuple5_6, tuple5_7] = v4_2;
            dataView(memory0).setInt16(arg1 + 16, toUint16(tuple5_0), true);
            dataView(memory0).setInt16(arg1 + 18, toUint16(tuple5_1), true);
            dataView(memory0).setInt16(arg1 + 20, toUint16(tuple5_2), true);
            dataView(memory0).setInt16(arg1 + 22, toUint16(tuple5_3), true);
            dataView(memory0).setInt16(arg1 + 24, toUint16(tuple5_4), true);
            dataView(memory0).setInt16(arg1 + 26, toUint16(tuple5_5), true);
            dataView(memory0).setInt16(arg1 + 28, toUint16(tuple5_6), true);
            dataView(memory0).setInt16(arg1 + 30, toUint16(tuple5_7), true);
            dataView(memory0).setInt32(arg1 + 32, toUint32(v4_3), true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant ${JSON.stringify(variant6.tag)} specified for IpSocketAddress`);
          }
        }
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val7 = e;
        let enum7;
        switch (val7) {
          case 'unknown': {
            enum7 = 0;
            break;
          }
          case 'access-denied': {
            enum7 = 1;
            break;
          }
          case 'not-supported': {
            enum7 = 2;
            break;
          }
          case 'invalid-argument': {
            enum7 = 3;
            break;
          }
          case 'out-of-memory': {
            enum7 = 4;
            break;
          }
          case 'timeout': {
            enum7 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum7 = 6;
            break;
          }
          case 'not-in-progress': {
            enum7 = 7;
            break;
          }
          case 'would-block': {
            enum7 = 8;
            break;
          }
          case 'invalid-state': {
            enum7 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum7 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum7 = 11;
            break;
          }
          case 'address-in-use': {
            enum7 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum7 = 13;
            break;
          }
          case 'connection-refused': {
            enum7 = 14;
            break;
          }
          case 'connection-reset': {
            enum7 = 15;
            break;
          }
          case 'connection-aborted': {
            enum7 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum7 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum7 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum7 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum7 = 20;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val7}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline22(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let enum2;
    switch (arg1) {
      case 0: {
        enum2 = 'receive';
        break;
      }
      case 1: {
        enum2 = 'send';
        break;
      }
      case 2: {
        enum2 = 'both';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for ShutdownType');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.shutdown.call(rsc0, enum2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
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
          case 'invalid-argument': {
            enum3 = 3;
            break;
          }
          case 'out-of-memory': {
            enum3 = 4;
            break;
          }
          case 'timeout': {
            enum3 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum3 = 6;
            break;
          }
          case 'not-in-progress': {
            enum3 = 7;
            break;
          }
          case 'would-block': {
            enum3 = 8;
            break;
          }
          case 'invalid-state': {
            enum3 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum3 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum3 = 11;
            break;
          }
          case 'address-in-use': {
            enum3 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum3 = 13;
            break;
          }
          case 'connection-refused': {
            enum3 = 14;
            break;
          }
          case 'connection-reset': {
            enum3 = 15;
            break;
          }
          case 'connection-aborted': {
            enum3 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum3 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum3 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum3 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum3 = 20;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val3}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg2 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline23(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable2.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: InputStream.prototype.blockingRead.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        const val2 = e;
        const len2 = val2.byteLength;
        const ptr2 = realloc0(0, 0, 1, len2 * 1);
        const src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
        (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
        dataView(memory0).setInt32(arg2 + 8, len2, true);
        dataView(memory0).setInt32(arg2 + 4, ptr2, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        const variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg2 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new Error('Not a valid "Error" resource.');
            }
            const handle3 = handleCnt1++;
            handleTable1.set(handle3, { rep: e, own: true });
            dataView(memory0).setInt32(arg2 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg2 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant ${JSON.stringify(variant4.tag)} specified for StreamError`);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  let realloc0;
  
  function trampoline24(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable3.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: OutputStream.prototype.blockingWriteAndFlush.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg3 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new Error('Not a valid "Error" resource.');
            }
            const handle3 = handleCnt1++;
            handleTable1.set(handle3, { rep: e, own: true });
            dataView(memory0).setInt32(arg3 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg3 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant ${JSON.stringify(variant4.tag)} specified for StreamError`);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline25(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable5.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: ResolveAddressStream.prototype.resolveNextAddress.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant5 = e;
        if (variant5 === null || variant5=== undefined) {
          dataView(memory0).setInt8(arg1 + 2, 0, true);
        } else {
          const e = variant5;
          dataView(memory0).setInt8(arg1 + 2, 1, true);
          const variant4 = e;
          switch (variant4.tag) {
            case 'ipv4': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 4, 0, true);
              const [tuple2_0, tuple2_1, tuple2_2, tuple2_3] = e;
              dataView(memory0).setInt8(arg1 + 6, toUint8(tuple2_0), true);
              dataView(memory0).setInt8(arg1 + 7, toUint8(tuple2_1), true);
              dataView(memory0).setInt8(arg1 + 8, toUint8(tuple2_2), true);
              dataView(memory0).setInt8(arg1 + 9, toUint8(tuple2_3), true);
              break;
            }
            case 'ipv6': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 4, 1, true);
              const [tuple3_0, tuple3_1, tuple3_2, tuple3_3, tuple3_4, tuple3_5, tuple3_6, tuple3_7] = e;
              dataView(memory0).setInt16(arg1 + 6, toUint16(tuple3_0), true);
              dataView(memory0).setInt16(arg1 + 8, toUint16(tuple3_1), true);
              dataView(memory0).setInt16(arg1 + 10, toUint16(tuple3_2), true);
              dataView(memory0).setInt16(arg1 + 12, toUint16(tuple3_3), true);
              dataView(memory0).setInt16(arg1 + 14, toUint16(tuple3_4), true);
              dataView(memory0).setInt16(arg1 + 16, toUint16(tuple3_5), true);
              dataView(memory0).setInt16(arg1 + 18, toUint16(tuple3_6), true);
              dataView(memory0).setInt16(arg1 + 20, toUint16(tuple3_7), true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant ${JSON.stringify(variant4.tag)} specified for IpAddress`);
            }
          }
        }
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val6 = e;
        let enum6;
        switch (val6) {
          case 'unknown': {
            enum6 = 0;
            break;
          }
          case 'access-denied': {
            enum6 = 1;
            break;
          }
          case 'not-supported': {
            enum6 = 2;
            break;
          }
          case 'invalid-argument': {
            enum6 = 3;
            break;
          }
          case 'out-of-memory': {
            enum6 = 4;
            break;
          }
          case 'timeout': {
            enum6 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum6 = 6;
            break;
          }
          case 'not-in-progress': {
            enum6 = 7;
            break;
          }
          case 'would-block': {
            enum6 = 8;
            break;
          }
          case 'invalid-state': {
            enum6 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum6 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum6 = 11;
            break;
          }
          case 'address-in-use': {
            enum6 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum6 = 13;
            break;
          }
          case 'connection-refused': {
            enum6 = 14;
            break;
          }
          case 'connection-reset': {
            enum6 = 15;
            break;
          }
          case 'connection-aborted': {
            enum6 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum6 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum6 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum6 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum6 = 20;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val6}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 2, enum6, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline26(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable4.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: resolveAddresses(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        if (!(e instanceof ResolveAddressStream)) {
          throw new Error('Not a valid "ResolveAddressStream" resource.');
        }
        const handle3 = handleCnt5++;
        handleTable5.set(handle3, { rep: e, own: true });
        dataView(memory0).setInt32(arg3 + 4, handle3, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
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
          case 'invalid-argument': {
            enum4 = 3;
            break;
          }
          case 'out-of-memory': {
            enum4 = 4;
            break;
          }
          case 'timeout': {
            enum4 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum4 = 6;
            break;
          }
          case 'not-in-progress': {
            enum4 = 7;
            break;
          }
          case 'would-block': {
            enum4 = 8;
            break;
          }
          case 'invalid-state': {
            enum4 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum4 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum4 = 11;
            break;
          }
          case 'address-in-use': {
            enum4 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum4 = 13;
            break;
          }
          case 'connection-refused': {
            enum4 = 14;
            break;
          }
          case 'connection-reset': {
            enum4 = 15;
            break;
          }
          case 'connection-aborted': {
            enum4 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum4 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum4 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum4 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum4 = 20;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val4}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg3 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline27(arg0, arg1) {
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
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof TcpSocket)) {
          throw new Error('Not a valid "TcpSocket" resource.');
        }
        const handle1 = handleCnt6++;
        handleTable6.set(handle1, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle1, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val2 = e;
        let enum2;
        switch (val2) {
          case 'unknown': {
            enum2 = 0;
            break;
          }
          case 'access-denied': {
            enum2 = 1;
            break;
          }
          case 'not-supported': {
            enum2 = 2;
            break;
          }
          case 'invalid-argument': {
            enum2 = 3;
            break;
          }
          case 'out-of-memory': {
            enum2 = 4;
            break;
          }
          case 'timeout': {
            enum2 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum2 = 6;
            break;
          }
          case 'not-in-progress': {
            enum2 = 7;
            break;
          }
          case 'would-block': {
            enum2 = 8;
            break;
          }
          case 'invalid-state': {
            enum2 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum2 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum2 = 11;
            break;
          }
          case 'address-in-use': {
            enum2 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum2 = 13;
            break;
          }
          case 'connection-refused': {
            enum2 = 14;
            break;
          }
          case 'connection-reset': {
            enum2 = 15;
            break;
          }
          case 'connection-aborted': {
            enum2 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum2 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum2 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum2 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum2 = 20;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline28(arg0) {
    const ret = getDirectories();
    const vec3 = ret;
    const len3 = vec3.length;
    const result3 = realloc1(0, 0, 4, len3 * 12);
    for (let i = 0; i < vec3.length; i++) {
      const e = vec3[i];
      const base = result3 + i * 12;const [tuple0_0, tuple0_1] = e;
      if (!(tuple0_0 instanceof Descriptor)) {
        throw new Error('Not a valid "Descriptor" resource.');
      }
      const handle1 = handleCnt7++;
      handleTable7.set(handle1, { rep: tuple0_0, own: true });
      dataView(memory0).setInt32(base + 0, handle1, true);
      const ptr2 = utf8Encode(tuple0_1, realloc1, memory0);
      const len2 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 8, len2, true);
      dataView(memory0).setInt32(base + 4, ptr2, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len3, true);
    dataView(memory0).setInt32(arg0 + 0, result3, true);
  }
  let realloc1;
  
  function trampoline29(arg0) {
    const ret = now$1();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function trampoline30(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable7.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.readViaStream.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        if (!(e instanceof InputStream)) {
          throw new Error('Not a valid "InputStream" resource.');
        }
        const handle2 = handleCnt2++;
        handleTable2.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg2 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
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
        dataView(memory0).setInt8(arg2 + 4, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline31(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable7.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.writeViaStream.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        if (!(e instanceof OutputStream)) {
          throw new Error('Not a valid "OutputStream" resource.');
        }
        const handle2 = handleCnt3++;
        handleTable3.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg2 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
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
        dataView(memory0).setInt8(arg2 + 4, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline32(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable7.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.appendViaStream.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof OutputStream)) {
          throw new Error('Not a valid "OutputStream" resource.');
        }
        const handle2 = handleCnt3++;
        handleTable3.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
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
        dataView(memory0).setInt8(arg1 + 4, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline33(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable7.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.getType.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const val2 = e;
        let enum2;
        switch (val2) {
          case 'unknown': {
            enum2 = 0;
            break;
          }
          case 'block-device': {
            enum2 = 1;
            break;
          }
          case 'character-device': {
            enum2 = 2;
            break;
          }
          case 'directory': {
            enum2 = 3;
            break;
          }
          case 'fifo': {
            enum2 = 4;
            break;
          }
          case 'symbolic-link': {
            enum2 = 5;
            break;
          }
          case 'regular-file': {
            enum2 = 6;
            break;
          }
          case 'socket': {
            enum2 = 7;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of descriptor-type`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
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
        dataView(memory0).setInt8(arg1 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline34(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable7.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.stat.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant11 = ret;
    switch (variant11.tag) {
      case 'ok': {
        const e = variant11.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
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
        dataView(memory0).setInt8(arg1 + 8, enum3, true);
        dataView(memory0).setBigInt64(arg1 + 16, toUint64(v2_1), true);
        dataView(memory0).setBigInt64(arg1 + 24, toUint64(v2_2), true);
        const variant5 = v2_3;
        if (variant5 === null || variant5=== undefined) {
          dataView(memory0).setInt8(arg1 + 32, 0, true);
        } else {
          const e = variant5;
          dataView(memory0).setInt8(arg1 + 32, 1, true);
          const {seconds: v4_0, nanoseconds: v4_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 40, toUint64(v4_0), true);
          dataView(memory0).setInt32(arg1 + 48, toUint32(v4_1), true);
        }
        const variant7 = v2_4;
        if (variant7 === null || variant7=== undefined) {
          dataView(memory0).setInt8(arg1 + 56, 0, true);
        } else {
          const e = variant7;
          dataView(memory0).setInt8(arg1 + 56, 1, true);
          const {seconds: v6_0, nanoseconds: v6_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 64, toUint64(v6_0), true);
          dataView(memory0).setInt32(arg1 + 72, toUint32(v6_1), true);
        }
        const variant9 = v2_5;
        if (variant9 === null || variant9=== undefined) {
          dataView(memory0).setInt8(arg1 + 80, 0, true);
        } else {
          const e = variant9;
          dataView(memory0).setInt8(arg1 + 80, 1, true);
          const {seconds: v8_0, nanoseconds: v8_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 88, toUint64(v8_0), true);
          dataView(memory0).setInt32(arg1 + 96, toUint32(v8_1), true);
        }
        break;
      }
      case 'err': {
        const e = variant11.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val10 = e;
        let enum10;
        switch (val10) {
          case 'access': {
            enum10 = 0;
            break;
          }
          case 'would-block': {
            enum10 = 1;
            break;
          }
          case 'already': {
            enum10 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum10 = 3;
            break;
          }
          case 'busy': {
            enum10 = 4;
            break;
          }
          case 'deadlock': {
            enum10 = 5;
            break;
          }
          case 'quota': {
            enum10 = 6;
            break;
          }
          case 'exist': {
            enum10 = 7;
            break;
          }
          case 'file-too-large': {
            enum10 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum10 = 9;
            break;
          }
          case 'in-progress': {
            enum10 = 10;
            break;
          }
          case 'interrupted': {
            enum10 = 11;
            break;
          }
          case 'invalid': {
            enum10 = 12;
            break;
          }
          case 'io': {
            enum10 = 13;
            break;
          }
          case 'is-directory': {
            enum10 = 14;
            break;
          }
          case 'loop': {
            enum10 = 15;
            break;
          }
          case 'too-many-links': {
            enum10 = 16;
            break;
          }
          case 'message-size': {
            enum10 = 17;
            break;
          }
          case 'name-too-long': {
            enum10 = 18;
            break;
          }
          case 'no-device': {
            enum10 = 19;
            break;
          }
          case 'no-entry': {
            enum10 = 20;
            break;
          }
          case 'no-lock': {
            enum10 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum10 = 22;
            break;
          }
          case 'insufficient-space': {
            enum10 = 23;
            break;
          }
          case 'not-directory': {
            enum10 = 24;
            break;
          }
          case 'not-empty': {
            enum10 = 25;
            break;
          }
          case 'not-recoverable': {
            enum10 = 26;
            break;
          }
          case 'unsupported': {
            enum10 = 27;
            break;
          }
          case 'no-tty': {
            enum10 = 28;
            break;
          }
          case 'no-such-device': {
            enum10 = 29;
            break;
          }
          case 'overflow': {
            enum10 = 30;
            break;
          }
          case 'not-permitted': {
            enum10 = 31;
            break;
          }
          case 'pipe': {
            enum10 = 32;
            break;
          }
          case 'read-only': {
            enum10 = 33;
            break;
          }
          case 'invalid-seek': {
            enum10 = 34;
            break;
          }
          case 'text-file-busy': {
            enum10 = 35;
            break;
          }
          case 'cross-device': {
            enum10 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val10}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum10, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline35(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable1.get(handle1).rep;
    const ret = filesystemErrorCode(rsc0);
    const variant3 = ret;
    if (variant3 === null || variant3=== undefined) {
      dataView(memory0).setInt8(arg1 + 0, 0, true);
    } else {
      const e = variant3;
      dataView(memory0).setInt8(arg1 + 0, 1, true);
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
      dataView(memory0).setInt8(arg1 + 1, enum2, true);
    }
  }
  
  function trampoline36(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable3.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: OutputStream.prototype.checkWrite.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const variant3 = e;
        switch (variant3.tag) {
          case 'last-operation-failed': {
            const e = variant3.val;
            dataView(memory0).setInt8(arg1 + 8, 0, true);
            if (!(e instanceof Error$1)) {
              throw new Error('Not a valid "Error" resource.');
            }
            const handle2 = handleCnt1++;
            handleTable1.set(handle2, { rep: e, own: true });
            dataView(memory0).setInt32(arg1 + 12, handle2, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg1 + 8, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant ${JSON.stringify(variant3.tag)} specified for StreamError`);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline37(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable3.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: OutputStream.prototype.write.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        const variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg3 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new Error('Not a valid "Error" resource.');
            }
            const handle3 = handleCnt1++;
            handleTable1.set(handle3, { rep: e, own: true });
            dataView(memory0).setInt32(arg3 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg3 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant ${JSON.stringify(variant4.tag)} specified for StreamError`);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline38(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable3.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: OutputStream.prototype.blockingFlush.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const variant3 = e;
        switch (variant3.tag) {
          case 'last-operation-failed': {
            const e = variant3.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new Error('Not a valid "Error" resource.');
            }
            const handle2 = handleCnt1++;
            handleTable1.set(handle2, { rep: e, own: true });
            dataView(memory0).setInt32(arg1 + 8, handle2, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant ${JSON.stringify(variant3.tag)} specified for StreamError`);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline39(arg0, arg1, arg2) {
    const len2 = arg1;
    const base2 = arg0;
    const result2 = [];
    for (let i = 0; i < len2; i++) {
      const base = base2 + i * 4;
      const handle1 = dataView(memory0).getInt32(base + 0, true);
      const rsc0 = handleTable0.get(handle1).rep;
      result2.push(rsc0);
    }
    const ret = poll(result2);
    const val3 = ret;
    const len3 = val3.length;
    const ptr3 = realloc1(0, 0, 4, len3 * 4);
    const src3 = new Uint8Array(val3.buffer, val3.byteOffset, len3 * 4);
    (new Uint8Array(memory0.buffer, ptr3, len3 * 4)).set(src3);
    dataView(memory0).setInt32(arg2 + 4, len3, true);
    dataView(memory0).setInt32(arg2 + 0, ptr3, true);
  }
  
  function trampoline40(arg0, arg1) {
    const ret = getRandomBytes(BigInt.asUintN(64, arg0));
    const val0 = ret;
    const len0 = val0.byteLength;
    const ptr0 = realloc1(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    dataView(memory0).setInt32(arg1 + 4, len0, true);
    dataView(memory0).setInt32(arg1 + 0, ptr0, true);
  }
  
  function trampoline41(arg0) {
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
  const handleTable6= new Map();
  let handleCnt6 = 0;
  function trampoline0(handle) {
    const handleEntry = handleTable6.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable6.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable2= new Map();
  let handleCnt2 = 0;
  function trampoline1(handle) {
    const handleEntry = handleTable2.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable2.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable3= new Map();
  let handleCnt3 = 0;
  function trampoline2(handle) {
    const handleEntry = handleTable3.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable3.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable8= new Map();
  let handleCnt8 = 0;
  const finalizationRegistry8= new FinalizationRegistry(handle => {
    const handleEntry = handleTable8.get(handle);
    if (handleEntry) {
      handleTable8.delete(handle);
      
      if (handleEntry.own) {
        exports0['31'](handleEntry.rep);
      }
    }
  });
  
  function trampoline3(rep) {
    const handle = handleCnt8++;
    handleTable8.set(handle, { rep, own: true });
    return handle;
  }
  const handleTable1= new Map();
  let handleCnt1 = 0;
  function trampoline4(handle) {
    const handleEntry = handleTable1.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable1.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable5= new Map();
  let handleCnt5 = 0;
  function trampoline5(handle) {
    const handleEntry = handleTable5.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable5.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable4= new Map();
  let handleCnt4 = 0;
  function trampoline7(handle) {
    const handleEntry = handleTable4.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable4.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable7= new Map();
  let handleCnt7 = 0;
  function trampoline9(handle) {
    const handleEntry = handleTable7.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable7.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable0= new Map();
  let handleCnt0 = 0;
  function trampoline14(handle) {
    const handleEntry = handleTable0.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable0.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const instanceFlags0 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
  const instanceFlags1 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    '[export]component:nfs-rs/nfs': {
      '[resource-new]nfs-mount': trampoline3,
    },
    'wasi:io/error@0.2.0': {
      '[resource-drop]error': trampoline4,
    },
    'wasi:io/streams@0.2.0': {
      '[method]input-stream.blocking-read': exports0['4'],
      '[method]output-stream.blocking-write-and-flush': exports0['5'],
      '[resource-drop]input-stream': trampoline1,
      '[resource-drop]output-stream': trampoline2,
    },
    'wasi:sockets/instance-network@0.2.0': {
      'instance-network': trampoline6,
    },
    'wasi:sockets/ip-name-lookup@0.2.0': {
      '[method]resolve-address-stream.resolve-next-address': exports0['6'],
      '[resource-drop]resolve-address-stream': trampoline5,
      'resolve-addresses': exports0['7'],
    },
    'wasi:sockets/network@0.2.0': {
      '[resource-drop]network': trampoline7,
    },
    'wasi:sockets/tcp-create-socket@0.2.0': {
      'create-tcp-socket': exports0['8'],
    },
    'wasi:sockets/tcp@0.2.0': {
      '[method]tcp-socket.finish-connect': exports0['1'],
      '[method]tcp-socket.remote-address': exports0['2'],
      '[method]tcp-socket.shutdown': exports0['3'],
      '[method]tcp-socket.start-connect': exports0['0'],
      '[resource-drop]tcp-socket': trampoline0,
    },
    wasi_snapshot_preview1: {
      clock_time_get: exports0['25'],
      environ_get: exports0['28'],
      environ_sizes_get: exports0['29'],
      fd_write: exports0['26'],
      poll_oneoff: exports0['27'],
      proc_exit: exports0['30'],
      random_get: exports0['24'],
    },
  }));
  ({ exports: exports2 } = await instantiateCore(await module1, {
    __main_module__: {
      cabi_realloc: exports1.cabi_realloc,
    },
    env: {
      memory: exports1.memory,
    },
    'wasi:cli/environment@0.2.0': {
      'get-environment': exports0['23'],
    },
    'wasi:cli/exit@0.2.0': {
      exit: trampoline16,
    },
    'wasi:cli/stderr@0.2.0': {
      'get-stderr': trampoline15,
    },
    'wasi:cli/stdin@0.2.0': {
      'get-stdin': trampoline17,
    },
    'wasi:cli/stdout@0.2.0': {
      'get-stdout': trampoline18,
    },
    'wasi:clocks/monotonic-clock@0.2.0': {
      now: trampoline8,
      'subscribe-duration': trampoline10,
      'subscribe-instant': trampoline11,
    },
    'wasi:clocks/wall-clock@0.2.0': {
      now: exports0['10'],
    },
    'wasi:filesystem/preopens@0.2.0': {
      'get-directories': exports0['9'],
    },
    'wasi:filesystem/types@0.2.0': {
      '[method]descriptor.append-via-stream': exports0['13'],
      '[method]descriptor.get-type': exports0['14'],
      '[method]descriptor.read-via-stream': exports0['11'],
      '[method]descriptor.stat': exports0['15'],
      '[method]descriptor.write-via-stream': exports0['12'],
      '[resource-drop]descriptor': trampoline9,
      'filesystem-error-code': exports0['16'],
    },
    'wasi:io/error@0.2.0': {
      '[resource-drop]error': trampoline4,
    },
    'wasi:io/poll@0.2.0': {
      '[resource-drop]pollable': trampoline14,
      poll: exports0['21'],
    },
    'wasi:io/streams@0.2.0': {
      '[method]input-stream.subscribe': trampoline13,
      '[method]output-stream.blocking-flush': exports0['20'],
      '[method]output-stream.blocking-write-and-flush': exports0['19'],
      '[method]output-stream.check-write': exports0['17'],
      '[method]output-stream.subscribe': trampoline12,
      '[method]output-stream.write': exports0['18'],
      '[resource-drop]input-stream': trampoline1,
      '[resource-drop]output-stream': trampoline2,
    },
    'wasi:random/random@0.2.0': {
      'get-random-bytes': exports0['22'],
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports1.cabi_realloc;
  realloc1 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': trampoline19,
      '1': trampoline20,
      '10': trampoline29,
      '11': trampoline30,
      '12': trampoline31,
      '13': trampoline32,
      '14': trampoline33,
      '15': trampoline34,
      '16': trampoline35,
      '17': trampoline36,
      '18': trampoline37,
      '19': trampoline24,
      '2': trampoline21,
      '20': trampoline38,
      '21': trampoline39,
      '22': trampoline40,
      '23': trampoline41,
      '24': exports2.random_get,
      '25': exports2.clock_time_get,
      '26': exports2.fd_write,
      '27': exports2.poll_oneoff,
      '28': exports2.environ_get,
      '29': exports2.environ_sizes_get,
      '3': trampoline22,
      '30': exports2.proc_exit,
      '31': exports1['component:nfs-rs/nfs#[dtor]nfs-mount'],
      '4': trampoline23,
      '5': trampoline24,
      '6': trampoline25,
      '7': trampoline26,
      '8': trampoline27,
      '9': trampoline28,
    },
  }));
  postReturn0 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.access'];
  postReturn1 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.create'];
  postReturn2 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.getattr'];
  postReturn3 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.readdir'];
  postReturn4 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.readdirplus'];
  
  class NfsMount {}
  
  NfsMount.prototype.nullOp = function nullOp() {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.null-op'](handle0);
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
            variant1 = undefined;
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
  };
  
  NfsMount.prototype.access = function access(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.access'](handle0, ptr1, len1, toUint32(arg2));
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
            variant2 = undefined;
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
    postReturn0(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  };
  
  NfsMount.prototype.accessPath = function accessPath(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.access-path'](handle0, ptr1, len1, toUint32(arg2));
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
            variant2 = undefined;
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
    postReturn0(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  };
  
  NfsMount.prototype.close = function close(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.close'](handle0, toUint32(arg1), toUint64(arg2));
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
            variant1 = undefined;
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
  };
  
  NfsMount.prototype.commit = function commit(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.commit'](handle0, ptr1, len1, toUint64(arg2), toUint32(arg3));
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
            variant2 = undefined;
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
    postReturn0(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  };
  
  NfsMount.prototype.commitPath = function commitPath(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.commit-path'](handle0, ptr1, len1, toUint64(arg2), toUint32(arg3));
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
            variant2 = undefined;
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
    postReturn0(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  };
  
  NfsMount.prototype.create = function create(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.create'](handle0, ptr1, len1, ptr2, len2, toUint32(arg3));
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
            variant4 = undefined;
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
    postReturn1(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  NfsMount.prototype.createPath = function createPath(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.create-path'](handle0, ptr1, len1, toUint32(arg2));
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
            variant3 = undefined;
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
    postReturn1(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.delegpurge = function delegpurge(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.delegpurge'](handle0, toUint64(arg1));
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
            variant1 = undefined;
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
  };
  
  NfsMount.prototype.delegreturn = function delegreturn(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.delegreturn'](handle0, toUint64(arg1));
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
            variant1 = undefined;
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
  };
  
  NfsMount.prototype.getattr = function getattr(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.getattr'](handle0, ptr1, len1);
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
            variant2 = undefined;
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
    postReturn2(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  };
  
  NfsMount.prototype.getattrPath = function getattrPath(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.getattr-path'](handle0, ptr1, len1);
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
            variant2 = undefined;
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
    postReturn2(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  };
  
  NfsMount.prototype.setattr = function setattr(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    const ptr0 = realloc0(0, 0, 8, 88);
    const handle1 = this[resourceHandleSymbol];
    if (handle1=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle1=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    dataView(memory0).setInt32(ptr0 + 0, handle1, true);
    const val2 = arg1;
    const len2 = val2.byteLength;
    const ptr2 = realloc0(0, 0, 1, len2 * 1);
    const src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    dataView(memory0).setInt32(ptr0 + 8, len2, true);
    dataView(memory0).setInt32(ptr0 + 4, ptr2, true);
    const variant4 = arg2;
    if (variant4 === null || variant4=== undefined) {
      dataView(memory0).setInt8(ptr0 + 12, 0, true);
    } else {
      const e = variant4;
      dataView(memory0).setInt8(ptr0 + 12, 1, true);
      const {seconds: v3_0, nseconds: v3_1 } = e;
      dataView(memory0).setInt32(ptr0 + 16, toUint32(v3_0), true);
      dataView(memory0).setInt32(ptr0 + 20, toUint32(v3_1), true);
    }
    const variant5 = arg3;
    if (variant5 === null || variant5=== undefined) {
      dataView(memory0).setInt8(ptr0 + 24, 0, true);
    } else {
      const e = variant5;
      dataView(memory0).setInt8(ptr0 + 24, 1, true);
      dataView(memory0).setInt32(ptr0 + 28, toUint32(e), true);
    }
    const variant6 = arg4;
    if (variant6 === null || variant6=== undefined) {
      dataView(memory0).setInt8(ptr0 + 32, 0, true);
    } else {
      const e = variant6;
      dataView(memory0).setInt8(ptr0 + 32, 1, true);
      dataView(memory0).setInt32(ptr0 + 36, toUint32(e), true);
    }
    const variant7 = arg5;
    if (variant7 === null || variant7=== undefined) {
      dataView(memory0).setInt8(ptr0 + 40, 0, true);
    } else {
      const e = variant7;
      dataView(memory0).setInt8(ptr0 + 40, 1, true);
      dataView(memory0).setInt32(ptr0 + 44, toUint32(e), true);
    }
    const variant8 = arg6;
    if (variant8 === null || variant8=== undefined) {
      dataView(memory0).setInt8(ptr0 + 48, 0, true);
    } else {
      const e = variant8;
      dataView(memory0).setInt8(ptr0 + 48, 1, true);
      dataView(memory0).setBigInt64(ptr0 + 56, toUint64(e), true);
    }
    const variant10 = arg7;
    if (variant10 === null || variant10=== undefined) {
      dataView(memory0).setInt8(ptr0 + 64, 0, true);
    } else {
      const e = variant10;
      dataView(memory0).setInt8(ptr0 + 64, 1, true);
      const {seconds: v9_0, nseconds: v9_1 } = e;
      dataView(memory0).setInt32(ptr0 + 68, toUint32(v9_0), true);
      dataView(memory0).setInt32(ptr0 + 72, toUint32(v9_1), true);
    }
    const variant12 = arg8;
    if (variant12 === null || variant12=== undefined) {
      dataView(memory0).setInt8(ptr0 + 76, 0, true);
    } else {
      const e = variant12;
      dataView(memory0).setInt8(ptr0 + 76, 1, true);
      const {seconds: v11_0, nseconds: v11_1 } = e;
      dataView(memory0).setInt32(ptr0 + 80, toUint32(v11_0), true);
      dataView(memory0).setInt32(ptr0 + 84, toUint32(v11_1), true);
    }
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.setattr'](ptr0);
    let variant15;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant15= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant13;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant13 = undefined;
            break;
          }
          case 1: {
            variant13 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr14 = dataView(memory0).getInt32(ret + 12, true);
        const len14 = dataView(memory0).getInt32(ret + 16, true);
        const result14 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr14, len14));
        variant15= {
          tag: 'err',
          val: {
            nfsErrorCode: variant13,
            message: result14,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn0(ret);
    if (variant15.tag === 'err') {
      throw new ComponentError(variant15.val);
    }
    return variant15.val;
  };
  
  NfsMount.prototype.setattrPath = function setattrPath(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    const ptr0 = realloc0(0, 0, 8, 80);
    const handle1 = this[resourceHandleSymbol];
    if (handle1=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle1=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    dataView(memory0).setInt32(ptr0 + 0, handle1, true);
    const ptr2 = utf8Encode(arg1, realloc0, memory0);
    const len2 = utf8EncodedLen;
    dataView(memory0).setInt32(ptr0 + 8, len2, true);
    dataView(memory0).setInt32(ptr0 + 4, ptr2, true);
    dataView(memory0).setInt8(ptr0 + 12, arg2 ? 1 : 0, true);
    const variant3 = arg3;
    if (variant3 === null || variant3=== undefined) {
      dataView(memory0).setInt8(ptr0 + 16, 0, true);
    } else {
      const e = variant3;
      dataView(memory0).setInt8(ptr0 + 16, 1, true);
      dataView(memory0).setInt32(ptr0 + 20, toUint32(e), true);
    }
    const variant4 = arg4;
    if (variant4 === null || variant4=== undefined) {
      dataView(memory0).setInt8(ptr0 + 24, 0, true);
    } else {
      const e = variant4;
      dataView(memory0).setInt8(ptr0 + 24, 1, true);
      dataView(memory0).setInt32(ptr0 + 28, toUint32(e), true);
    }
    const variant5 = arg5;
    if (variant5 === null || variant5=== undefined) {
      dataView(memory0).setInt8(ptr0 + 32, 0, true);
    } else {
      const e = variant5;
      dataView(memory0).setInt8(ptr0 + 32, 1, true);
      dataView(memory0).setInt32(ptr0 + 36, toUint32(e), true);
    }
    const variant6 = arg6;
    if (variant6 === null || variant6=== undefined) {
      dataView(memory0).setInt8(ptr0 + 40, 0, true);
    } else {
      const e = variant6;
      dataView(memory0).setInt8(ptr0 + 40, 1, true);
      dataView(memory0).setBigInt64(ptr0 + 48, toUint64(e), true);
    }
    const variant8 = arg7;
    if (variant8 === null || variant8=== undefined) {
      dataView(memory0).setInt8(ptr0 + 56, 0, true);
    } else {
      const e = variant8;
      dataView(memory0).setInt8(ptr0 + 56, 1, true);
      const {seconds: v7_0, nseconds: v7_1 } = e;
      dataView(memory0).setInt32(ptr0 + 60, toUint32(v7_0), true);
      dataView(memory0).setInt32(ptr0 + 64, toUint32(v7_1), true);
    }
    const variant10 = arg8;
    if (variant10 === null || variant10=== undefined) {
      dataView(memory0).setInt8(ptr0 + 68, 0, true);
    } else {
      const e = variant10;
      dataView(memory0).setInt8(ptr0 + 68, 1, true);
      const {seconds: v9_0, nseconds: v9_1 } = e;
      dataView(memory0).setInt32(ptr0 + 72, toUint32(v9_0), true);
      dataView(memory0).setInt32(ptr0 + 76, toUint32(v9_1), true);
    }
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.setattr-path'](ptr0);
    let variant13;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant13= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant11;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant11 = undefined;
            break;
          }
          case 1: {
            variant11 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr12 = dataView(memory0).getInt32(ret + 12, true);
        const len12 = dataView(memory0).getInt32(ret + 16, true);
        const result12 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr12, len12));
        variant13= {
          tag: 'err',
          val: {
            nfsErrorCode: variant11,
            message: result12,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn0(ret);
    if (variant13.tag === 'err') {
      throw new ComponentError(variant13.val);
    }
    return variant13.val;
  };
  
  NfsMount.prototype.getfh = function getfh() {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.getfh'](handle0);
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
            variant1 = undefined;
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
  };
  
  NfsMount.prototype.link = function link(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const val2 = arg2;
    const len2 = val2.byteLength;
    const ptr2 = realloc0(0, 0, 1, len2 * 1);
    const src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    const ptr3 = utf8Encode(arg3, realloc0, memory0);
    const len3 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.link'](handle0, ptr1, len1, ptr2, len2, ptr3, len3);
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant6= {
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
        let variant4;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant4 = undefined;
            break;
          }
          case 1: {
            variant4 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr5 = dataView(memory0).getInt32(ret + 16, true);
        const len5 = dataView(memory0).getInt32(ret + 20, true);
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
    postReturn2(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  NfsMount.prototype.linkPath = function linkPath(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.link-path'](handle0, ptr1, len1, ptr2, len2);
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
            variant3 = undefined;
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
    postReturn2(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.symlink = function symlink(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const val2 = arg2;
    const len2 = val2.byteLength;
    const ptr2 = realloc0(0, 0, 1, len2 * 1);
    const src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    const ptr3 = utf8Encode(arg3, realloc0, memory0);
    const len3 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.symlink'](handle0, ptr1, len1, ptr2, len2, ptr3, len3);
    let variant7;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr4 = dataView(memory0).getInt32(ret + 4, true);
        const len4 = dataView(memory0).getInt32(ret + 8, true);
        const result4 = new Uint8Array(memory0.buffer.slice(ptr4, ptr4 + len4 * 1));
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
            variant5 = undefined;
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
    postReturn1(ret);
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  };
  
  NfsMount.prototype.symlinkPath = function symlinkPath(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.symlink-path'](handle0, ptr1, len1, ptr2, len2);
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
            variant4 = undefined;
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
    postReturn1(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  NfsMount.prototype.readlink = function readlink(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.readlink'](handle0, ptr1, len1);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr2 = dataView(memory0).getInt32(ret + 4, true);
        const len2 = dataView(memory0).getInt32(ret + 8, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
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
            variant3 = undefined;
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
    postReturn1(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.readlinkPath = function readlinkPath(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.readlink-path'](handle0, ptr1, len1);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const ptr2 = dataView(memory0).getInt32(ret + 4, true);
        const len2 = dataView(memory0).getInt32(ret + 8, true);
        const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
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
            variant3 = undefined;
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
    postReturn1(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.lookup = function lookup(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.lookup'](handle0, ptr1, len1, ptr2, len2);
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
            variant4 = undefined;
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
    postReturn1(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  NfsMount.prototype.lookupPath = function lookupPath(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.lookup-path'](handle0, ptr1, len1);
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
            variant3 = undefined;
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
    postReturn1(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.pathconf = function pathconf(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.pathconf'](handle0, ptr1, len1);
    let variant9;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant2 = undefined;
            break;
          }
          case 1: {
            variant2 = {
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
        const bool3 = dataView(memory0).getUint8(ret + 112, true);
        const bool4 = dataView(memory0).getUint8(ret + 113, true);
        const bool5 = dataView(memory0).getUint8(ret + 114, true);
        const bool6 = dataView(memory0).getUint8(ret + 115, true);
        variant9= {
          tag: 'ok',
          val: {
            attr: variant2,
            linkmax: dataView(memory0).getInt32(ret + 104, true) >>> 0,
            nameMax: dataView(memory0).getInt32(ret + 108, true) >>> 0,
            noTrunc: bool3 == 0 ? false : (bool3 == 1 ? true : throwInvalidBool()),
            chownRestricted: bool4 == 0 ? false : (bool4 == 1 ? true : throwInvalidBool()),
            caseInsensitive: bool5 == 0 ? false : (bool5 == 1 ? true : throwInvalidBool()),
            casePreserving: bool6 == 0 ? false : (bool6 == 1 ? true : throwInvalidBool()),
          }
        };
        break;
      }
      case 1: {
        let variant7;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant7 = undefined;
            break;
          }
          case 1: {
            variant7 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr8 = dataView(memory0).getInt32(ret + 16, true);
        const len8 = dataView(memory0).getInt32(ret + 20, true);
        const result8 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr8, len8));
        variant9= {
          tag: 'err',
          val: {
            nfsErrorCode: variant7,
            message: result8,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn2(ret);
    if (variant9.tag === 'err') {
      throw new ComponentError(variant9.val);
    }
    return variant9.val;
  };
  
  NfsMount.prototype.pathconfPath = function pathconfPath(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.pathconf-path'](handle0, ptr1, len1);
    let variant9;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        let variant2;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant2 = undefined;
            break;
          }
          case 1: {
            variant2 = {
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
        const bool3 = dataView(memory0).getUint8(ret + 112, true);
        const bool4 = dataView(memory0).getUint8(ret + 113, true);
        const bool5 = dataView(memory0).getUint8(ret + 114, true);
        const bool6 = dataView(memory0).getUint8(ret + 115, true);
        variant9= {
          tag: 'ok',
          val: {
            attr: variant2,
            linkmax: dataView(memory0).getInt32(ret + 104, true) >>> 0,
            nameMax: dataView(memory0).getInt32(ret + 108, true) >>> 0,
            noTrunc: bool3 == 0 ? false : (bool3 == 1 ? true : throwInvalidBool()),
            chownRestricted: bool4 == 0 ? false : (bool4 == 1 ? true : throwInvalidBool()),
            caseInsensitive: bool5 == 0 ? false : (bool5 == 1 ? true : throwInvalidBool()),
            casePreserving: bool6 == 0 ? false : (bool6 == 1 ? true : throwInvalidBool()),
          }
        };
        break;
      }
      case 1: {
        let variant7;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            variant7 = undefined;
            break;
          }
          case 1: {
            variant7 = dataView(memory0).getInt32(ret + 12, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr8 = dataView(memory0).getInt32(ret + 16, true);
        const len8 = dataView(memory0).getInt32(ret + 20, true);
        const result8 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr8, len8));
        variant9= {
          tag: 'err',
          val: {
            nfsErrorCode: variant7,
            message: result8,
          }
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn2(ret);
    if (variant9.tag === 'err') {
      throw new ComponentError(variant9.val);
    }
    return variant9.val;
  };
  
  NfsMount.prototype.read = function read(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.read'](handle0, ptr1, len1, toUint64(arg2), toUint32(arg3));
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
            variant3 = undefined;
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
    postReturn1(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.readPath = function readPath(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.read-path'](handle0, ptr1, len1, toUint64(arg2), toUint32(arg3));
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
            variant3 = undefined;
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
    postReturn1(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.write = function write(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const val2 = arg3;
    const len2 = val2.byteLength;
    const ptr2 = realloc0(0, 0, 1, len2 * 1);
    const src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.write'](handle0, ptr1, len1, toUint64(arg2), ptr2, len2);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: dataView(memory0).getInt32(ret + 4, true) >>> 0
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = undefined;
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
    postReturn0(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.writePath = function writePath(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const val2 = arg3;
    const len2 = val2.byteLength;
    const ptr2 = realloc0(0, 0, 1, len2 * 1);
    const src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.write-path'](handle0, ptr1, len1, toUint64(arg2), ptr2, len2);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: dataView(memory0).getInt32(ret + 4, true) >>> 0
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = undefined;
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
    postReturn0(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.readdir = function readdir(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.readdir'](handle0, ptr1, len1);
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const len3 = dataView(memory0).getInt32(ret + 8, true);
        const base3 = dataView(memory0).getInt32(ret + 4, true);
        const result3 = [];
        for (let i = 0; i < len3; i++) {
          const base = base3 + i * 24;
          const ptr2 = dataView(memory0).getInt32(base + 8, true);
          const len2 = dataView(memory0).getInt32(base + 12, true);
          const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
          result3.push({
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
            fileName: result2,
            cookie: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 16, true)),
          });
        }
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
            variant4 = undefined;
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
    postReturn3(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  NfsMount.prototype.readdirPath = function readdirPath(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.readdir-path'](handle0, ptr1, len1);
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const len3 = dataView(memory0).getInt32(ret + 8, true);
        const base3 = dataView(memory0).getInt32(ret + 4, true);
        const result3 = [];
        for (let i = 0; i < len3; i++) {
          const base = base3 + i * 24;
          const ptr2 = dataView(memory0).getInt32(base + 8, true);
          const len2 = dataView(memory0).getInt32(base + 12, true);
          const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
          result3.push({
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
            fileName: result2,
            cookie: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 16, true)),
          });
        }
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
            variant4 = undefined;
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
    postReturn3(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  NfsMount.prototype.readdirplus = function readdirplus(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.readdirplus'](handle0, ptr1, len1);
    let variant8;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const len5 = dataView(memory0).getInt32(ret + 8, true);
        const base5 = dataView(memory0).getInt32(ret + 4, true);
        const result5 = [];
        for (let i = 0; i < len5; i++) {
          const base = base5 + i * 128;
          const ptr2 = dataView(memory0).getInt32(base + 8, true);
          const len2 = dataView(memory0).getInt32(base + 12, true);
          const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
          let variant3;
          switch (dataView(memory0).getUint8(base + 24, true)) {
            case 0: {
              variant3 = undefined;
              break;
            }
            case 1: {
              variant3 = {
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
          const ptr4 = dataView(memory0).getInt32(base + 120, true);
          const len4 = dataView(memory0).getInt32(base + 124, true);
          const result4 = new Uint8Array(memory0.buffer.slice(ptr4, ptr4 + len4 * 1));
          result5.push({
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
            fileName: result2,
            cookie: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 16, true)),
            attr: variant3,
            handle: result4,
          });
        }
        variant8= {
          tag: 'ok',
          val: result5
        };
        break;
      }
      case 1: {
        let variant6;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant6 = undefined;
            break;
          }
          case 1: {
            variant6 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr7 = dataView(memory0).getInt32(ret + 12, true);
        const len7 = dataView(memory0).getInt32(ret + 16, true);
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
    postReturn4(ret);
    if (variant8.tag === 'err') {
      throw new ComponentError(variant8.val);
    }
    return variant8.val;
  };
  
  NfsMount.prototype.readdirplusPath = function readdirplusPath(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.readdirplus-path'](handle0, ptr1, len1);
    let variant8;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const len5 = dataView(memory0).getInt32(ret + 8, true);
        const base5 = dataView(memory0).getInt32(ret + 4, true);
        const result5 = [];
        for (let i = 0; i < len5; i++) {
          const base = base5 + i * 128;
          const ptr2 = dataView(memory0).getInt32(base + 8, true);
          const len2 = dataView(memory0).getInt32(base + 12, true);
          const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
          let variant3;
          switch (dataView(memory0).getUint8(base + 24, true)) {
            case 0: {
              variant3 = undefined;
              break;
            }
            case 1: {
              variant3 = {
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
          const ptr4 = dataView(memory0).getInt32(base + 120, true);
          const len4 = dataView(memory0).getInt32(base + 124, true);
          const result4 = new Uint8Array(memory0.buffer.slice(ptr4, ptr4 + len4 * 1));
          result5.push({
            fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
            fileName: result2,
            cookie: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 16, true)),
            attr: variant3,
            handle: result4,
          });
        }
        variant8= {
          tag: 'ok',
          val: result5
        };
        break;
      }
      case 1: {
        let variant6;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant6 = undefined;
            break;
          }
          case 1: {
            variant6 = dataView(memory0).getInt32(ret + 8, true);
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        const ptr7 = dataView(memory0).getInt32(ret + 12, true);
        const len7 = dataView(memory0).getInt32(ret + 16, true);
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
    postReturn4(ret);
    if (variant8.tag === 'err') {
      throw new ComponentError(variant8.val);
    }
    return variant8.val;
  };
  
  NfsMount.prototype.mkdir = function mkdir(arg1, arg2, arg3) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.mkdir'](handle0, ptr1, len1, ptr2, len2, toUint32(arg3));
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
            variant4 = undefined;
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
    postReturn1(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  NfsMount.prototype.mkdirPath = function mkdirPath(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.mkdir-path'](handle0, ptr1, len1, toUint32(arg2));
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
            variant3 = undefined;
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
    postReturn1(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.remove = function remove(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.remove'](handle0, ptr1, len1, ptr2, len2);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = undefined;
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
    postReturn0(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.removePath = function removePath(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.remove-path'](handle0, ptr1, len1);
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
            variant2 = undefined;
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
    postReturn0(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  };
  
  NfsMount.prototype.rmdir = function rmdir(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.rmdir'](handle0, ptr1, len1, ptr2, len2);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = undefined;
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
    postReturn0(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.rmdirPath = function rmdirPath(arg1) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.rmdir-path'](handle0, ptr1, len1);
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
            variant2 = undefined;
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
    postReturn0(ret);
    if (variant4.tag === 'err') {
      throw new ComponentError(variant4.val);
    }
    return variant4.val;
  };
  
  NfsMount.prototype.rename = function rename(arg1, arg2, arg3, arg4) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const val1 = arg1;
    const len1 = val1.byteLength;
    const ptr1 = realloc0(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const val3 = arg3;
    const len3 = val3.byteLength;
    const ptr3 = realloc0(0, 0, 1, len3 * 1);
    const src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
    (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
    const ptr4 = utf8Encode(arg4, realloc0, memory0);
    const len4 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.rename'](handle0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4);
    let variant7;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant7= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant5;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant5 = undefined;
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
    postReturn0(ret);
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  };
  
  NfsMount.prototype.renamePath = function renamePath(arg1, arg2) {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ptr1 = utf8Encode(arg1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    const ptr2 = utf8Encode(arg2, realloc0, memory0);
    const len2 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.rename-path'](handle0, ptr1, len1, ptr2, len2);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let variant3;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant3 = undefined;
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
    postReturn0(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  NfsMount.prototype.umount = function umount() {
    const handle0 = this[resourceHandleSymbol];
    if (handle0=== null) {
      throw new Error('"NfsMount" resource handle lifetime expired.');
    }
    if (handle0=== undefined) {
      throw new Error('Not a valid "NfsMount" resource.');
    }
    
    const ret = exports1['component:nfs-rs/nfs#[method]nfs-mount.umount'](handle0);
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
            variant1 = undefined;
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
  };
  
  function parseUrlAndMount(arg0) {
    const ptr0 = utf8Encode(arg0, realloc0, memory0);
    const len0 = utf8EncodedLen;
    const ret = exports1['component:nfs-rs/nfs#parse-url-and-mount'](ptr0, len0);
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        const handle2 = dataView(memory0).getInt32(ret + 4, true);
        const rsc1 = new.target === NfsMount ? this : Object.create(NfsMount.prototype);
        const rep3 = handleTable8.get(handle2).rep;
        Object.defineProperty(rsc1, resourceHandleSymbol, { writable: true, value: rep3});
        finalizationRegistry8.register(rsc1, handle2, rsc1);
        Object.defineProperty(rsc1, symbolDispose, { writable: true, value: function () {} });
        
        handleTable8.delete(handle2);
        variant6= {
          tag: 'ok',
          val: rsc1
        };
        break;
      }
      case 1: {
        let variant4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant4 = undefined;
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
    postReturn0(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  }
  const nfs = {
    NfsMount: NfsMount,
    parseUrlAndMount: parseUrlAndMount,
    
  };
  
  return { nfs, 'component:nfs-rs/nfs': nfs };
}
