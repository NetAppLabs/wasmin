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

const toUint64 = val => BigInt.asUintN(64, BigInt(val));

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
    ptr = realloc(ptr, allocLen, 1, allocLen += s.length * 2);
    const { read, written } = utf8Encoder.encodeInto(
    s,
    new Uint8Array(memory.buffer, ptr + writtenTotal, allocLen - writtenTotal),
    );
    writtenTotal += written;
    s = s.slice(read);
  }
  utf8EncodedLen = writtenTotal;
  return ptr;
}

export async function instantiate(getCoreModule, imports, instantiateCore = WebAssembly.instantiate) {
  const module0 = getCoreModule('component.core.wasm');
  const module1 = getCoreModule('component.core2.wasm');
  const module2 = getCoreModule('component.core3.wasm');
  const module3 = getCoreModule('component.core4.wasm');
  
  const { TerminalInputExtended } = imports['wasi-ext:cli/terminal-input-extended'];
  const { TerminalOutputExtended } = imports['wasi-ext:cli/terminal-output-extended'];
  const { getTerminalStdin } = imports['wasi-ext:cli/terminal-stdin-extended'];
  const { getTerminalStdout: getTerminalStdout$1 } = imports['wasi-ext:cli/terminal-stdout-extended'];
  const { mount, mounts, unmount } = imports['wasi-ext:filesystems/mount'];
  const { Process, create } = imports['wasi-ext:process/process'];
  const { getArguments, getEnvironment } = imports['wasi:cli/environment'];
  const { exit } = imports['wasi:cli/exit'];
  const { getStderr } = imports['wasi:cli/stderr'];
  const { getStdin } = imports['wasi:cli/stdin'];
  const { getStdout } = imports['wasi:cli/stdout'];
  const { getTerminalStderr } = imports['wasi:cli/terminal-stderr'];
  const { getTerminalStdin: getTerminalStdin$1 } = imports['wasi:cli/terminal-stdin'];
  const { getTerminalStdout } = imports['wasi:cli/terminal-stdout'];
  const { now, resolution, subscribeDuration, subscribeInstant } = imports['wasi:clocks/monotonic-clock'];
  const { now: now$1, resolution: resolution$1 } = imports['wasi:clocks/wall-clock'];
  const { getDirectories } = imports['wasi:filesystem/preopens'];
  const { Descriptor, DirectoryEntryStream, filesystemErrorCode } = imports['wasi:filesystem/types'];
  const { Pollable, poll } = imports['wasi:io/poll'];
  const { InputStream, OutputStream } = imports['wasi:io/streams'];
  const { getRandomBytes } = imports['wasi:random/random'];
  const { instanceNetwork } = imports['wasi:sockets/instance-network'];
  const { ResolveAddressStream, resolveAddresses } = imports['wasi:sockets/ip-name-lookup'];
  const { TcpSocket } = imports['wasi:sockets/tcp'];
  const { createTcpSocket } = imports['wasi:sockets/tcp-create-socket'];
  const { IncomingDatagramStream, OutgoingDatagramStream, UdpSocket } = imports['wasi:sockets/udp'];
  const { createUdpSocket } = imports['wasi:sockets/udp-create-socket'];
  let exports0;
const { Network } = imports["wasi:sockets/instance-network"];
const { TerminalInput } = imports["wasi:cli/terminal-stdin"];
const { TerminalOutput } = imports["wasi:cli/terminal-stdout"];
  let exports1;
  
  function trampoline0() {
    const ret = getStderr();
    if (!(ret instanceof OutputStream)) {
      throw new Error('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleCnt3++;
    handleTable3.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline3() {
    const ret = resolution();
    return toUint64(ret);
  }
  
  function trampoline4() {
    const ret = now();
    return toUint64(ret);
  }
  
  function trampoline10(arg0) {
    const ret = subscribeDuration(BigInt.asUintN(64, arg0));
    if (!(ret instanceof Pollable)) {
      throw new Error('Resource error: Not a valid "Pollable" resource.');
    }
    var handle0 = handleCnt0++;
    handleTable0.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline11(arg0) {
    var handle1 = arg0;
    var rsc0 = handleTable12.get(handle1).rep;
    const ret = UdpSocket.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Resource error: Not a valid "Pollable" resource.');
    }
    var handle2 = handleCnt0++;
    handleTable0.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline12(arg0) {
    var handle1 = arg0;
    var rsc0 = handleTable14.get(handle1).rep;
    const ret = OutgoingDatagramStream.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Resource error: Not a valid "Pollable" resource.');
    }
    var handle2 = handleCnt0++;
    handleTable0.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline13(arg0) {
    var handle1 = arg0;
    var rsc0 = handleTable3.get(handle1).rep;
    const ret = OutputStream.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Resource error: Not a valid "Pollable" resource.');
    }
    var handle2 = handleCnt0++;
    handleTable0.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline14(arg0) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    const ret = TcpSocket.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Resource error: Not a valid "Pollable" resource.');
    }
    var handle2 = handleCnt0++;
    handleTable0.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline15(arg0) {
    var handle1 = arg0;
    var rsc0 = handleTable2.get(handle1).rep;
    const ret = InputStream.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Resource error: Not a valid "Pollable" resource.');
    }
    var handle2 = handleCnt0++;
    handleTable0.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline16(arg0) {
    const ret = subscribeInstant(BigInt.asUintN(64, arg0));
    if (!(ret instanceof Pollable)) {
      throw new Error('Resource error: Not a valid "Pollable" resource.');
    }
    var handle0 = handleCnt0++;
    handleTable0.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline18() {
    const ret = instanceNetwork();
    if (!(ret instanceof Network)) {
      throw new Error('Resource error: Not a valid "Network" resource.');
    }
    var handle0 = handleCnt11++;
    handleTable11.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline20(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    if ((arg1 & 4294967264) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    var flags2 = {
      inherit: Boolean(arg1 & 1),
      none: Boolean(arg1 & 2),
      filesystem: Boolean(arg1 & 4),
      network: Boolean(arg1 & 8),
      all: Boolean(arg1 & 16),
    };
    Process.prototype.setCapabilities.call(rsc0, flags2);
  }
  
  function trampoline21(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    var handle3 = arg1;
    var rsc2 = handleTable8.get(handle3).rep;
    handleTable8.delete(handle3);
    Process.prototype.setRoot.call(rsc0, rsc2);
  }
  
  function trampoline30(arg0) {
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
  
  function trampoline31() {
    const ret = getStdin();
    if (!(ret instanceof InputStream)) {
      throw new Error('Resource error: Not a valid "InputStream" resource.');
    }
    var handle0 = handleCnt2++;
    handleTable2.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline32() {
    const ret = getStdout();
    if (!(ret instanceof OutputStream)) {
      throw new Error('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleCnt3++;
    handleTable3.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline33(arg0) {
    var handle1 = arg0;
    var rsc0 = handleTable4.get(handle1).rep;
    const ret = TerminalInputExtended.prototype.getRawMode.call(rsc0);
    return ret ? 1 : 0;
  }
  
  function trampoline34(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable4.get(handle1).rep;
    var bool2 = arg1;
    TerminalInputExtended.prototype.setRawMode.call(rsc0, bool2 == 0 ? false : (bool2 == 1 ? true : throwInvalidBool()));
  }
  let exports2;
  
  function trampoline35(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable2.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: InputStream.prototype.read.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        var val2 = e;
        var len2 = val2.byteLength;
        var ptr2 = realloc0(0, 0, 1, len2 * 1);
        var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
        (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
        dataView(memory0).setInt32(arg2 + 8, len2, true);
        dataView(memory0).setInt32(arg2 + 4, ptr2, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg2 + 4, 0, true);
            if (!(true)) {
              throw new Error('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = handleCnt1++;
            handleTable1.set(handle3, { rep: e, own: true });
            dataView(memory0).setInt32(arg2 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg2 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  let memory0;
  let realloc0;
  
  function trampoline36(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable2.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: InputStream.prototype.blockingRead.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        var val2 = e;
        var len2 = val2.byteLength;
        var ptr2 = realloc0(0, 0, 1, len2 * 1);
        var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
        (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
        dataView(memory0).setInt32(arg2 + 8, len2, true);
        dataView(memory0).setInt32(arg2 + 4, ptr2, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg2 + 4, 0, true);
            if (!(true)) {
              throw new Error('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = handleCnt1++;
            handleTable1.set(handle3, { rep: e, own: true });
            dataView(memory0).setInt32(arg2 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg2 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline37(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable3.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: OutputStream.prototype.checkWrite.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
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
        var variant3 = e;
        switch (variant3.tag) {
          case 'last-operation-failed': {
            const e = variant3.val;
            dataView(memory0).setInt8(arg1 + 8, 0, true);
            if (!(true)) {
              throw new Error('Resource error: Not a valid "Error" resource.');
            }
            var handle2 = handleCnt1++;
            handleTable1.set(handle2, { rep: e, own: true });
            dataView(memory0).setInt32(arg1 + 12, handle2, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg1 + 8, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant3.tag)}\` (received \`${variant3}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline38(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable3.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: OutputStream.prototype.write.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg3 + 4, 0, true);
            if (!(true)) {
              throw new Error('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = handleCnt1++;
            handleTable1.set(handle3, { rep: e, own: true });
            dataView(memory0).setInt32(arg3 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg3 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline39(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable3.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: OutputStream.prototype.blockingWriteAndFlush.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg3 + 4, 0, true);
            if (!(true)) {
              throw new Error('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = handleCnt1++;
            handleTable1.set(handle3, { rep: e, own: true });
            dataView(memory0).setInt32(arg3 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg3 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline40(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable3.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: OutputStream.prototype.blockingFlush.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var variant3 = e;
        switch (variant3.tag) {
          case 'last-operation-failed': {
            const e = variant3.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            if (!(true)) {
              throw new Error('Resource error: Not a valid "Error" resource.');
            }
            var handle2 = handleCnt1++;
            handleTable1.set(handle2, { rep: e, own: true });
            dataView(memory0).setInt32(arg1 + 8, handle2, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant3.tag)}\` (received \`${variant3}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline41(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    var handle1 = arg0;
    var rsc0 = handleTable12.get(handle1).rep;
    var handle3 = arg1;
    var rsc2 = handleTable11.get(handle3).rep;
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
      ret = { tag: 'ok', val: UdpSocket.prototype.startBind.call(rsc0, rsc2, variant4) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
        var val5 = e;
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
  
  function trampoline42(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable12.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: UdpSocket.prototype.finishBind.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline43(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    var handle1 = arg0;
    var rsc0 = handleTable12.get(handle1).rep;
    let variant3;
    switch (arg1) {
      case 0: {
        variant3 = undefined;
        break;
      }
      case 1: {
        let variant2;
        switch (arg2) {
          case 0: {
            variant2= {
              tag: 'ipv4',
              val: {
                port: clampGuest(arg3, 0, 65535),
                address: [clampGuest(arg4, 0, 255), clampGuest(arg5, 0, 255), clampGuest(arg6, 0, 255), clampGuest(arg7, 0, 255)],
              }
            };
            break;
          }
          case 1: {
            variant2= {
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
        variant3 = variant2;
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for option');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: UdpSocket.prototype.stream.call(rsc0, variant3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        var [tuple4_0, tuple4_1] = e;
        if (!(tuple4_0 instanceof IncomingDatagramStream)) {
          throw new Error('Resource error: Not a valid "IncomingDatagramStream" resource.');
        }
        var handle5 = handleCnt13++;
        handleTable13.set(handle5, { rep: tuple4_0, own: true });
        dataView(memory0).setInt32(arg14 + 4, handle5, true);
        if (!(tuple4_1 instanceof OutgoingDatagramStream)) {
          throw new Error('Resource error: Not a valid "OutgoingDatagramStream" resource.');
        }
        var handle6 = handleCnt14++;
        handleTable14.set(handle6, { rep: tuple4_1, own: true });
        dataView(memory0).setInt32(arg14 + 8, handle6, true);
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
        var val7 = e;
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
        dataView(memory0).setInt8(arg14 + 4, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline44(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable12.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: UdpSocket.prototype.localAddress.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var variant6 = e;
        switch (variant6.tag) {
          case 'ipv4': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            var {port: v2_0, address: v2_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            var [tuple3_0, tuple3_1, tuple3_2, tuple3_3] = v2_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple3_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple3_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple3_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple3_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            var {port: v4_0, flowInfo: v4_1, address: v4_2, scopeId: v4_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v4_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v4_1), true);
            var [tuple5_0, tuple5_1, tuple5_2, tuple5_3, tuple5_4, tuple5_5, tuple5_6, tuple5_7] = v4_2;
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
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`IpSocketAddress\``);
          }
        }
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val7 = e;
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
  
  function trampoline45(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable12.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: UdpSocket.prototype.remoteAddress.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var variant6 = e;
        switch (variant6.tag) {
          case 'ipv4': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            var {port: v2_0, address: v2_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            var [tuple3_0, tuple3_1, tuple3_2, tuple3_3] = v2_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple3_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple3_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple3_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple3_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            var {port: v4_0, flowInfo: v4_1, address: v4_2, scopeId: v4_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v4_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v4_1), true);
            var [tuple5_0, tuple5_1, tuple5_2, tuple5_3, tuple5_4, tuple5_5, tuple5_6, tuple5_7] = v4_2;
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
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`IpSocketAddress\``);
          }
        }
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val7 = e;
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
  
  function trampoline46(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable13.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: IncomingDatagramStream.prototype.receive.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant11 = ret;
    switch (variant11.tag) {
      case 'ok': {
        const e = variant11.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        var vec9 = e;
        var len9 = vec9.length;
        var result9 = realloc0(0, 0, 4, len9 * 40);
        for (let i = 0; i < vec9.length; i++) {
          const e = vec9[i];
          const base = result9 + i * 40;var {data: v2_0, remoteAddress: v2_1 } = e;
          var val3 = v2_0;
          var len3 = val3.byteLength;
          var ptr3 = realloc0(0, 0, 1, len3 * 1);
          var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
          (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
          dataView(memory0).setInt32(base + 4, len3, true);
          dataView(memory0).setInt32(base + 0, ptr3, true);
          var variant8 = v2_1;
          switch (variant8.tag) {
            case 'ipv4': {
              const e = variant8.val;
              dataView(memory0).setInt8(base + 8, 0, true);
              var {port: v4_0, address: v4_1 } = e;
              dataView(memory0).setInt16(base + 12, toUint16(v4_0), true);
              var [tuple5_0, tuple5_1, tuple5_2, tuple5_3] = v4_1;
              dataView(memory0).setInt8(base + 14, toUint8(tuple5_0), true);
              dataView(memory0).setInt8(base + 15, toUint8(tuple5_1), true);
              dataView(memory0).setInt8(base + 16, toUint8(tuple5_2), true);
              dataView(memory0).setInt8(base + 17, toUint8(tuple5_3), true);
              break;
            }
            case 'ipv6': {
              const e = variant8.val;
              dataView(memory0).setInt8(base + 8, 1, true);
              var {port: v6_0, flowInfo: v6_1, address: v6_2, scopeId: v6_3 } = e;
              dataView(memory0).setInt16(base + 12, toUint16(v6_0), true);
              dataView(memory0).setInt32(base + 16, toUint32(v6_1), true);
              var [tuple7_0, tuple7_1, tuple7_2, tuple7_3, tuple7_4, tuple7_5, tuple7_6, tuple7_7] = v6_2;
              dataView(memory0).setInt16(base + 20, toUint16(tuple7_0), true);
              dataView(memory0).setInt16(base + 22, toUint16(tuple7_1), true);
              dataView(memory0).setInt16(base + 24, toUint16(tuple7_2), true);
              dataView(memory0).setInt16(base + 26, toUint16(tuple7_3), true);
              dataView(memory0).setInt16(base + 28, toUint16(tuple7_4), true);
              dataView(memory0).setInt16(base + 30, toUint16(tuple7_5), true);
              dataView(memory0).setInt16(base + 32, toUint16(tuple7_6), true);
              dataView(memory0).setInt16(base + 34, toUint16(tuple7_7), true);
              dataView(memory0).setInt32(base + 36, toUint32(v6_3), true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant8.tag)}\` (received \`${variant8}\`) specified for \`IpSocketAddress\``);
            }
          }
        }
        dataView(memory0).setInt32(arg2 + 8, len9, true);
        dataView(memory0).setInt32(arg2 + 4, result9, true);
        break;
      }
      case 'err': {
        const e = variant11.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var val10 = e;
        let enum10;
        switch (val10) {
          case 'unknown': {
            enum10 = 0;
            break;
          }
          case 'access-denied': {
            enum10 = 1;
            break;
          }
          case 'not-supported': {
            enum10 = 2;
            break;
          }
          case 'invalid-argument': {
            enum10 = 3;
            break;
          }
          case 'out-of-memory': {
            enum10 = 4;
            break;
          }
          case 'timeout': {
            enum10 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum10 = 6;
            break;
          }
          case 'not-in-progress': {
            enum10 = 7;
            break;
          }
          case 'would-block': {
            enum10 = 8;
            break;
          }
          case 'invalid-state': {
            enum10 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum10 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum10 = 11;
            break;
          }
          case 'address-in-use': {
            enum10 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum10 = 13;
            break;
          }
          case 'connection-refused': {
            enum10 = 14;
            break;
          }
          case 'connection-reset': {
            enum10 = 15;
            break;
          }
          case 'connection-aborted': {
            enum10 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum10 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum10 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum10 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum10 = 20;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val10}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg2 + 4, enum10, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline47(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable14.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: OutgoingDatagramStream.prototype.checkSend.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
        dataView(memory0).setInt8(arg1 + 8, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline48(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable14.get(handle1).rep;
    var len5 = arg2;
    var base5 = arg1;
    var result5 = [];
    for (let i = 0; i < len5; i++) {
      const base = base5 + i * 44;
      var ptr2 = dataView(memory0).getInt32(base + 0, true);
      var len2 = dataView(memory0).getInt32(base + 4, true);
      var result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
      let variant4;
      switch (dataView(memory0).getUint8(base + 8, true)) {
        case 0: {
          variant4 = undefined;
          break;
        }
        case 1: {
          let variant3;
          switch (dataView(memory0).getUint8(base + 12, true)) {
            case 0: {
              variant3= {
                tag: 'ipv4',
                val: {
                  port: clampGuest(dataView(memory0).getUint16(base + 16, true), 0, 65535),
                  address: [clampGuest(dataView(memory0).getUint8(base + 18, true), 0, 255), clampGuest(dataView(memory0).getUint8(base + 19, true), 0, 255), clampGuest(dataView(memory0).getUint8(base + 20, true), 0, 255), clampGuest(dataView(memory0).getUint8(base + 21, true), 0, 255)],
                }
              };
              break;
            }
            case 1: {
              variant3= {
                tag: 'ipv6',
                val: {
                  port: clampGuest(dataView(memory0).getUint16(base + 16, true), 0, 65535),
                  flowInfo: dataView(memory0).getInt32(base + 20, true) >>> 0,
                  address: [clampGuest(dataView(memory0).getUint16(base + 24, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 26, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 28, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 30, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 32, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 34, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 36, true), 0, 65535), clampGuest(dataView(memory0).getUint16(base + 38, true), 0, 65535)],
                  scopeId: dataView(memory0).getInt32(base + 40, true) >>> 0,
                }
              };
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for IpSocketAddress');
            }
          }
          variant4 = variant3;
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for option');
        }
      }
      result5.push({
        data: result2,
        remoteAddress: variant4,
      });
    }
    let ret;
    try {
      ret = { tag: 'ok', val: OutgoingDatagramStream.prototype.send.call(rsc0, result5) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        dataView(memory0).setBigInt64(arg3 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var val6 = e;
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
        dataView(memory0).setInt8(arg3 + 8, enum6, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline49(arg0) {
    const ret = getDirectories();
    var vec3 = ret;
    var len3 = vec3.length;
    var result3 = realloc0(0, 0, 4, len3 * 12);
    for (let i = 0; i < vec3.length; i++) {
      const e = vec3[i];
      const base = result3 + i * 12;var [tuple0_0, tuple0_1] = e;
      if (!(tuple0_0 instanceof Descriptor)) {
        throw new Error('Resource error: Not a valid "Descriptor" resource.');
      }
      var handle1 = handleCnt8++;
      handleTable8.set(handle1, { rep: tuple0_0, own: true });
      dataView(memory0).setInt32(base + 0, handle1, true);
      var ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 8, len2, true);
      dataView(memory0).setInt32(base + 4, ptr2, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len3, true);
    dataView(memory0).setInt32(arg0 + 0, result3, true);
  }
  
  function trampoline50(arg0) {
    const ret = now$1();
    var {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function trampoline51(arg0) {
    const ret = resolution$1();
    var {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function trampoline52(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.readViaStream.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        if (!(e instanceof InputStream)) {
          throw new Error('Resource error: Not a valid "InputStream" resource.');
        }
        var handle2 = handleCnt2++;
        handleTable2.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg2 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var val3 = e;
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
  
  function trampoline53(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.writeViaStream.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        if (!(e instanceof OutputStream)) {
          throw new Error('Resource error: Not a valid "OutputStream" resource.');
        }
        var handle2 = handleCnt3++;
        handleTable3.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg2 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var val3 = e;
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
  
  function trampoline54(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.appendViaStream.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof OutputStream)) {
          throw new Error('Resource error: Not a valid "OutputStream" resource.');
        }
        var handle2 = handleCnt3++;
        handleTable3.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
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
  
  function trampoline55(arg0, arg1, arg2, arg3, arg4) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let enum2;
    switch (arg3) {
      case 0: {
        enum2 = 'normal';
        break;
      }
      case 1: {
        enum2 = 'sequential';
        break;
      }
      case 2: {
        enum2 = 'random';
        break;
      }
      case 3: {
        enum2 = 'will-need';
        break;
      }
      case 4: {
        enum2 = 'dont-need';
        break;
      }
      case 5: {
        enum2 = 'no-reuse';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for Advice');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.advise.call(rsc0, BigInt.asUintN(64, arg1), BigInt.asUintN(64, arg2), enum2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        var val3 = e;
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
        dataView(memory0).setInt8(arg4 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline56(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.syncData.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline57(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.getFlags.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        let flags2 = 0;
        if (typeof e === 'object' && e !== null) {
          flags2 = Boolean(e.read) << 0 | Boolean(e.write) << 1 | Boolean(e.fileIntegritySync) << 2 | Boolean(e.dataIntegritySync) << 3 | Boolean(e.requestedWriteSync) << 4 | Boolean(e.mutateDirectory) << 5;
        } else if (e !== null && e!== undefined) {
          throw new TypeError('only an object, undefined or null can be converted to flags');
        }
        dataView(memory0).setInt8(arg1 + 1, flags2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
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
  
  function trampoline58(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.getType.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var val2 = e;
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
        var val3 = e;
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
  
  function trampoline59(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.setSize.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var val2 = e;
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
        dataView(memory0).setInt8(arg2 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline60(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let variant2;
    switch (arg1) {
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
    let variant3;
    switch (arg4) {
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
      ret = { tag: 'ok', val: Descriptor.prototype.setTimes.call(rsc0, variant2, variant3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg7 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg7 + 0, 1, true);
        var val4 = e;
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
        dataView(memory0).setInt8(arg7 + 1, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline61(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.read.call(rsc0, BigInt.asUintN(64, arg1), BigInt.asUintN(64, arg2)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        var [tuple2_0, tuple2_1] = e;
        var val3 = tuple2_0;
        var len3 = val3.byteLength;
        var ptr3 = realloc0(0, 0, 1, len3 * 1);
        var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
        (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
        dataView(memory0).setInt32(arg3 + 8, len3, true);
        dataView(memory0).setInt32(arg3 + 4, ptr3, true);
        dataView(memory0).setInt8(arg3 + 12, tuple2_1 ? 1 : 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var val4 = e;
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
        dataView(memory0).setInt8(arg3 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline62(arg0, arg1, arg2, arg3, arg4) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.write.call(rsc0, result2, BigInt.asUintN(64, arg3)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        dataView(memory0).setBigInt64(arg4 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        var val3 = e;
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
  
  function trampoline63(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.readDirectory.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof DirectoryEntryStream)) {
          throw new Error('Resource error: Not a valid "DirectoryEntryStream" resource.');
        }
        var handle2 = handleCnt9++;
        handleTable9.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
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
  
  function trampoline64(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.sync.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline65(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.createDirectoryAt.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var val3 = e;
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
        dataView(memory0).setInt8(arg3 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline66(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.stat.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant11 = ret;
    switch (variant11.tag) {
      case 'ok': {
        const e = variant11.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var {type: v2_0, linkCount: v2_1, size: v2_2, dataAccessTimestamp: v2_3, dataModificationTimestamp: v2_4, statusChangeTimestamp: v2_5 } = e;
        var val3 = v2_0;
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
        var variant5 = v2_3;
        if (variant5 === null || variant5=== undefined) {
          dataView(memory0).setInt8(arg1 + 32, 0, true);
        } else {
          const e = variant5;
          dataView(memory0).setInt8(arg1 + 32, 1, true);
          var {seconds: v4_0, nanoseconds: v4_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 40, toUint64(v4_0), true);
          dataView(memory0).setInt32(arg1 + 48, toUint32(v4_1), true);
        }
        var variant7 = v2_4;
        if (variant7 === null || variant7=== undefined) {
          dataView(memory0).setInt8(arg1 + 56, 0, true);
        } else {
          const e = variant7;
          dataView(memory0).setInt8(arg1 + 56, 1, true);
          var {seconds: v6_0, nanoseconds: v6_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 64, toUint64(v6_0), true);
          dataView(memory0).setInt32(arg1 + 72, toUint32(v6_1), true);
        }
        var variant9 = v2_5;
        if (variant9 === null || variant9=== undefined) {
          dataView(memory0).setInt8(arg1 + 80, 0, true);
        } else {
          const e = variant9;
          dataView(memory0).setInt8(arg1 + 80, 1, true);
          var {seconds: v8_0, nanoseconds: v8_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 88, toUint64(v8_0), true);
          dataView(memory0).setInt32(arg1 + 96, toUint32(v8_1), true);
        }
        break;
      }
      case 'err': {
        const e = variant11.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val10 = e;
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
  
  function trampoline67(arg0, arg1, arg2, arg3, arg4) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    var flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    var ptr3 = arg2;
    var len3 = arg3;
    var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.statAt.call(rsc0, flags2, result3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant13 = ret;
    switch (variant13.tag) {
      case 'ok': {
        const e = variant13.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        var {type: v4_0, linkCount: v4_1, size: v4_2, dataAccessTimestamp: v4_3, dataModificationTimestamp: v4_4, statusChangeTimestamp: v4_5 } = e;
        var val5 = v4_0;
        let enum5;
        switch (val5) {
          case 'unknown': {
            enum5 = 0;
            break;
          }
          case 'block-device': {
            enum5 = 1;
            break;
          }
          case 'character-device': {
            enum5 = 2;
            break;
          }
          case 'directory': {
            enum5 = 3;
            break;
          }
          case 'fifo': {
            enum5 = 4;
            break;
          }
          case 'symbolic-link': {
            enum5 = 5;
            break;
          }
          case 'regular-file': {
            enum5 = 6;
            break;
          }
          case 'socket': {
            enum5 = 7;
            break;
          }
          default: {
            if ((v4_0) instanceof Error) {
              console.error(v4_0);
            }
            
            throw new TypeError(`"${val5}" is not one of the cases of descriptor-type`);
          }
        }
        dataView(memory0).setInt8(arg4 + 8, enum5, true);
        dataView(memory0).setBigInt64(arg4 + 16, toUint64(v4_1), true);
        dataView(memory0).setBigInt64(arg4 + 24, toUint64(v4_2), true);
        var variant7 = v4_3;
        if (variant7 === null || variant7=== undefined) {
          dataView(memory0).setInt8(arg4 + 32, 0, true);
        } else {
          const e = variant7;
          dataView(memory0).setInt8(arg4 + 32, 1, true);
          var {seconds: v6_0, nanoseconds: v6_1 } = e;
          dataView(memory0).setBigInt64(arg4 + 40, toUint64(v6_0), true);
          dataView(memory0).setInt32(arg4 + 48, toUint32(v6_1), true);
        }
        var variant9 = v4_4;
        if (variant9 === null || variant9=== undefined) {
          dataView(memory0).setInt8(arg4 + 56, 0, true);
        } else {
          const e = variant9;
          dataView(memory0).setInt8(arg4 + 56, 1, true);
          var {seconds: v8_0, nanoseconds: v8_1 } = e;
          dataView(memory0).setBigInt64(arg4 + 64, toUint64(v8_0), true);
          dataView(memory0).setInt32(arg4 + 72, toUint32(v8_1), true);
        }
        var variant11 = v4_5;
        if (variant11 === null || variant11=== undefined) {
          dataView(memory0).setInt8(arg4 + 80, 0, true);
        } else {
          const e = variant11;
          dataView(memory0).setInt8(arg4 + 80, 1, true);
          var {seconds: v10_0, nanoseconds: v10_1 } = e;
          dataView(memory0).setBigInt64(arg4 + 88, toUint64(v10_0), true);
          dataView(memory0).setInt32(arg4 + 96, toUint32(v10_1), true);
        }
        break;
      }
      case 'err': {
        const e = variant13.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        var val12 = e;
        let enum12;
        switch (val12) {
          case 'access': {
            enum12 = 0;
            break;
          }
          case 'would-block': {
            enum12 = 1;
            break;
          }
          case 'already': {
            enum12 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum12 = 3;
            break;
          }
          case 'busy': {
            enum12 = 4;
            break;
          }
          case 'deadlock': {
            enum12 = 5;
            break;
          }
          case 'quota': {
            enum12 = 6;
            break;
          }
          case 'exist': {
            enum12 = 7;
            break;
          }
          case 'file-too-large': {
            enum12 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum12 = 9;
            break;
          }
          case 'in-progress': {
            enum12 = 10;
            break;
          }
          case 'interrupted': {
            enum12 = 11;
            break;
          }
          case 'invalid': {
            enum12 = 12;
            break;
          }
          case 'io': {
            enum12 = 13;
            break;
          }
          case 'is-directory': {
            enum12 = 14;
            break;
          }
          case 'loop': {
            enum12 = 15;
            break;
          }
          case 'too-many-links': {
            enum12 = 16;
            break;
          }
          case 'message-size': {
            enum12 = 17;
            break;
          }
          case 'name-too-long': {
            enum12 = 18;
            break;
          }
          case 'no-device': {
            enum12 = 19;
            break;
          }
          case 'no-entry': {
            enum12 = 20;
            break;
          }
          case 'no-lock': {
            enum12 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum12 = 22;
            break;
          }
          case 'insufficient-space': {
            enum12 = 23;
            break;
          }
          case 'not-directory': {
            enum12 = 24;
            break;
          }
          case 'not-empty': {
            enum12 = 25;
            break;
          }
          case 'not-recoverable': {
            enum12 = 26;
            break;
          }
          case 'unsupported': {
            enum12 = 27;
            break;
          }
          case 'no-tty': {
            enum12 = 28;
            break;
          }
          case 'no-such-device': {
            enum12 = 29;
            break;
          }
          case 'overflow': {
            enum12 = 30;
            break;
          }
          case 'not-permitted': {
            enum12 = 31;
            break;
          }
          case 'pipe': {
            enum12 = 32;
            break;
          }
          case 'read-only': {
            enum12 = 33;
            break;
          }
          case 'invalid-seek': {
            enum12 = 34;
            break;
          }
          case 'text-file-busy': {
            enum12 = 35;
            break;
          }
          case 'cross-device': {
            enum12 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val12}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg4 + 8, enum12, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline68(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    var flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    var ptr3 = arg2;
    var len3 = arg3;
    var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let variant4;
    switch (arg4) {
      case 0: {
        variant4= {
          tag: 'no-change',
        };
        break;
      }
      case 1: {
        variant4= {
          tag: 'now',
        };
        break;
      }
      case 2: {
        variant4= {
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
    let variant5;
    switch (arg7) {
      case 0: {
        variant5= {
          tag: 'no-change',
        };
        break;
      }
      case 1: {
        variant5= {
          tag: 'now',
        };
        break;
      }
      case 2: {
        variant5= {
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
      ret = { tag: 'ok', val: Descriptor.prototype.setTimesAt.call(rsc0, flags2, result3, variant4, variant5) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg10 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg10 + 0, 1, true);
        var val6 = e;
        let enum6;
        switch (val6) {
          case 'access': {
            enum6 = 0;
            break;
          }
          case 'would-block': {
            enum6 = 1;
            break;
          }
          case 'already': {
            enum6 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum6 = 3;
            break;
          }
          case 'busy': {
            enum6 = 4;
            break;
          }
          case 'deadlock': {
            enum6 = 5;
            break;
          }
          case 'quota': {
            enum6 = 6;
            break;
          }
          case 'exist': {
            enum6 = 7;
            break;
          }
          case 'file-too-large': {
            enum6 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum6 = 9;
            break;
          }
          case 'in-progress': {
            enum6 = 10;
            break;
          }
          case 'interrupted': {
            enum6 = 11;
            break;
          }
          case 'invalid': {
            enum6 = 12;
            break;
          }
          case 'io': {
            enum6 = 13;
            break;
          }
          case 'is-directory': {
            enum6 = 14;
            break;
          }
          case 'loop': {
            enum6 = 15;
            break;
          }
          case 'too-many-links': {
            enum6 = 16;
            break;
          }
          case 'message-size': {
            enum6 = 17;
            break;
          }
          case 'name-too-long': {
            enum6 = 18;
            break;
          }
          case 'no-device': {
            enum6 = 19;
            break;
          }
          case 'no-entry': {
            enum6 = 20;
            break;
          }
          case 'no-lock': {
            enum6 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum6 = 22;
            break;
          }
          case 'insufficient-space': {
            enum6 = 23;
            break;
          }
          case 'not-directory': {
            enum6 = 24;
            break;
          }
          case 'not-empty': {
            enum6 = 25;
            break;
          }
          case 'not-recoverable': {
            enum6 = 26;
            break;
          }
          case 'unsupported': {
            enum6 = 27;
            break;
          }
          case 'no-tty': {
            enum6 = 28;
            break;
          }
          case 'no-such-device': {
            enum6 = 29;
            break;
          }
          case 'overflow': {
            enum6 = 30;
            break;
          }
          case 'not-permitted': {
            enum6 = 31;
            break;
          }
          case 'pipe': {
            enum6 = 32;
            break;
          }
          case 'read-only': {
            enum6 = 33;
            break;
          }
          case 'invalid-seek': {
            enum6 = 34;
            break;
          }
          case 'text-file-busy': {
            enum6 = 35;
            break;
          }
          case 'cross-device': {
            enum6 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val6}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg10 + 1, enum6, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline69(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    var flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    var ptr3 = arg2;
    var len3 = arg3;
    var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    var handle5 = arg4;
    var rsc4 = handleTable8.get(handle5).rep;
    var ptr6 = arg5;
    var len6 = arg6;
    var result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.linkAt.call(rsc0, flags2, result3, rsc4, result6) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg7 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg7 + 0, 1, true);
        var val7 = e;
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
        dataView(memory0).setInt8(arg7 + 1, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline70(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    var flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    var ptr3 = arg2;
    var len3 = arg3;
    var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    if ((arg4 & 4294967280) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    var flags4 = {
      create: Boolean(arg4 & 1),
      directory: Boolean(arg4 & 2),
      exclusive: Boolean(arg4 & 4),
      truncate: Boolean(arg4 & 8),
    };
    if ((arg5 & 4294967232) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    var flags5 = {
      read: Boolean(arg5 & 1),
      write: Boolean(arg5 & 2),
      fileIntegritySync: Boolean(arg5 & 4),
      dataIntegritySync: Boolean(arg5 & 8),
      requestedWriteSync: Boolean(arg5 & 16),
      mutateDirectory: Boolean(arg5 & 32),
    };
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.openAt.call(rsc0, flags2, result3, flags4, flags5) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg6 + 0, 0, true);
        if (!(e instanceof Descriptor)) {
          throw new Error('Resource error: Not a valid "Descriptor" resource.');
        }
        var handle6 = handleCnt8++;
        handleTable8.set(handle6, { rep: e, own: true });
        dataView(memory0).setInt32(arg6 + 4, handle6, true);
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg6 + 0, 1, true);
        var val7 = e;
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
        dataView(memory0).setInt8(arg6 + 4, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline71(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.readlinkAt.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        var ptr3 = utf8Encode(e, realloc0, memory0);
        var len3 = utf8EncodedLen;
        dataView(memory0).setInt32(arg3 + 8, len3, true);
        dataView(memory0).setInt32(arg3 + 4, ptr3, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var val4 = e;
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
        dataView(memory0).setInt8(arg3 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline72(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.removeDirectoryAt.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var val3 = e;
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
        dataView(memory0).setInt8(arg3 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline73(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    var handle4 = arg3;
    var rsc3 = handleTable8.get(handle4).rep;
    var ptr5 = arg4;
    var len5 = arg5;
    var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.renameAt.call(rsc0, result2, rsc3, result5) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg6 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg6 + 0, 1, true);
        var val6 = e;
        let enum6;
        switch (val6) {
          case 'access': {
            enum6 = 0;
            break;
          }
          case 'would-block': {
            enum6 = 1;
            break;
          }
          case 'already': {
            enum6 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum6 = 3;
            break;
          }
          case 'busy': {
            enum6 = 4;
            break;
          }
          case 'deadlock': {
            enum6 = 5;
            break;
          }
          case 'quota': {
            enum6 = 6;
            break;
          }
          case 'exist': {
            enum6 = 7;
            break;
          }
          case 'file-too-large': {
            enum6 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum6 = 9;
            break;
          }
          case 'in-progress': {
            enum6 = 10;
            break;
          }
          case 'interrupted': {
            enum6 = 11;
            break;
          }
          case 'invalid': {
            enum6 = 12;
            break;
          }
          case 'io': {
            enum6 = 13;
            break;
          }
          case 'is-directory': {
            enum6 = 14;
            break;
          }
          case 'loop': {
            enum6 = 15;
            break;
          }
          case 'too-many-links': {
            enum6 = 16;
            break;
          }
          case 'message-size': {
            enum6 = 17;
            break;
          }
          case 'name-too-long': {
            enum6 = 18;
            break;
          }
          case 'no-device': {
            enum6 = 19;
            break;
          }
          case 'no-entry': {
            enum6 = 20;
            break;
          }
          case 'no-lock': {
            enum6 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum6 = 22;
            break;
          }
          case 'insufficient-space': {
            enum6 = 23;
            break;
          }
          case 'not-directory': {
            enum6 = 24;
            break;
          }
          case 'not-empty': {
            enum6 = 25;
            break;
          }
          case 'not-recoverable': {
            enum6 = 26;
            break;
          }
          case 'unsupported': {
            enum6 = 27;
            break;
          }
          case 'no-tty': {
            enum6 = 28;
            break;
          }
          case 'no-such-device': {
            enum6 = 29;
            break;
          }
          case 'overflow': {
            enum6 = 30;
            break;
          }
          case 'not-permitted': {
            enum6 = 31;
            break;
          }
          case 'pipe': {
            enum6 = 32;
            break;
          }
          case 'read-only': {
            enum6 = 33;
            break;
          }
          case 'invalid-seek': {
            enum6 = 34;
            break;
          }
          case 'text-file-busy': {
            enum6 = 35;
            break;
          }
          case 'cross-device': {
            enum6 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val6}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg6 + 1, enum6, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline74(arg0, arg1, arg2, arg3, arg4, arg5) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    var ptr3 = arg3;
    var len3 = arg4;
    var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.symlinkAt.call(rsc0, result2, result3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg5 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg5 + 0, 1, true);
        var val4 = e;
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
        dataView(memory0).setInt8(arg5 + 1, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline75(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.unlinkFileAt.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var val3 = e;
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
        dataView(memory0).setInt8(arg3 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline76(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.metadataHash.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var {lower: v2_0, upper: v2_1 } = e;
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(v2_0), true);
        dataView(memory0).setBigInt64(arg1 + 16, toUint64(v2_1), true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
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
        dataView(memory0).setInt8(arg1 + 8, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline77(arg0, arg1, arg2, arg3, arg4) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    var flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    var ptr3 = arg2;
    var len3 = arg3;
    var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.metadataHashAt.call(rsc0, flags2, result3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        var {lower: v4_0, upper: v4_1 } = e;
        dataView(memory0).setBigInt64(arg4 + 8, toUint64(v4_0), true);
        dataView(memory0).setBigInt64(arg4 + 16, toUint64(v4_1), true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        var val5 = e;
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
        dataView(memory0).setInt8(arg4 + 8, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline78(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable9.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: DirectoryEntryStream.prototype.readDirectoryEntry.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var variant5 = e;
        if (variant5 === null || variant5=== undefined) {
          dataView(memory0).setInt8(arg1 + 4, 0, true);
        } else {
          const e = variant5;
          dataView(memory0).setInt8(arg1 + 4, 1, true);
          var {type: v2_0, name: v2_1 } = e;
          var val3 = v2_0;
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
          var ptr4 = utf8Encode(v2_1, realloc0, memory0);
          var len4 = utf8EncodedLen;
          dataView(memory0).setInt32(arg1 + 16, len4, true);
          dataView(memory0).setInt32(arg1 + 12, ptr4, true);
        }
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val6 = e;
        let enum6;
        switch (val6) {
          case 'access': {
            enum6 = 0;
            break;
          }
          case 'would-block': {
            enum6 = 1;
            break;
          }
          case 'already': {
            enum6 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum6 = 3;
            break;
          }
          case 'busy': {
            enum6 = 4;
            break;
          }
          case 'deadlock': {
            enum6 = 5;
            break;
          }
          case 'quota': {
            enum6 = 6;
            break;
          }
          case 'exist': {
            enum6 = 7;
            break;
          }
          case 'file-too-large': {
            enum6 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum6 = 9;
            break;
          }
          case 'in-progress': {
            enum6 = 10;
            break;
          }
          case 'interrupted': {
            enum6 = 11;
            break;
          }
          case 'invalid': {
            enum6 = 12;
            break;
          }
          case 'io': {
            enum6 = 13;
            break;
          }
          case 'is-directory': {
            enum6 = 14;
            break;
          }
          case 'loop': {
            enum6 = 15;
            break;
          }
          case 'too-many-links': {
            enum6 = 16;
            break;
          }
          case 'message-size': {
            enum6 = 17;
            break;
          }
          case 'name-too-long': {
            enum6 = 18;
            break;
          }
          case 'no-device': {
            enum6 = 19;
            break;
          }
          case 'no-entry': {
            enum6 = 20;
            break;
          }
          case 'no-lock': {
            enum6 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum6 = 22;
            break;
          }
          case 'insufficient-space': {
            enum6 = 23;
            break;
          }
          case 'not-directory': {
            enum6 = 24;
            break;
          }
          case 'not-empty': {
            enum6 = 25;
            break;
          }
          case 'not-recoverable': {
            enum6 = 26;
            break;
          }
          case 'unsupported': {
            enum6 = 27;
            break;
          }
          case 'no-tty': {
            enum6 = 28;
            break;
          }
          case 'no-such-device': {
            enum6 = 29;
            break;
          }
          case 'overflow': {
            enum6 = 30;
            break;
          }
          case 'not-permitted': {
            enum6 = 31;
            break;
          }
          case 'pipe': {
            enum6 = 32;
            break;
          }
          case 'read-only': {
            enum6 = 33;
            break;
          }
          case 'invalid-seek': {
            enum6 = 34;
            break;
          }
          case 'text-file-busy': {
            enum6 = 35;
            break;
          }
          case 'cross-device': {
            enum6 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val6}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum6, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline79(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable1.get(handle1).rep;
    const ret = filesystemErrorCode(rsc0);
    var variant3 = ret;
    if (variant3 === null || variant3=== undefined) {
      dataView(memory0).setInt8(arg1 + 0, 0, true);
    } else {
      const e = variant3;
      dataView(memory0).setInt8(arg1 + 0, 1, true);
      var val2 = e;
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
  
  function trampoline80(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    var handle3 = arg1;
    var rsc2 = handleTable11.get(handle3).rep;
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
      ret = { tag: 'ok', val: TcpSocket.prototype.startBind.call(rsc0, rsc2, variant4) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
        var val5 = e;
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
  
  function trampoline81(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.finishBind.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline82(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    var handle3 = arg1;
    var rsc2 = handleTable11.get(handle3).rep;
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
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg14 + 0, 1, true);
        var val5 = e;
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
  
  function trampoline83(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.finishConnect.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var [tuple2_0, tuple2_1] = e;
        if (!(tuple2_0 instanceof InputStream)) {
          throw new Error('Resource error: Not a valid "InputStream" resource.');
        }
        var handle3 = handleCnt2++;
        handleTable2.set(handle3, { rep: tuple2_0, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle3, true);
        if (!(tuple2_1 instanceof OutputStream)) {
          throw new Error('Resource error: Not a valid "OutputStream" resource.');
        }
        var handle4 = handleCnt3++;
        handleTable3.set(handle4, { rep: tuple2_1, own: true });
        dataView(memory0).setInt32(arg1 + 8, handle4, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val5 = e;
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
  
  function trampoline84(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.startListen.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline85(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.finishListen.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline86(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.accept.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var [tuple2_0, tuple2_1, tuple2_2] = e;
        if (!(tuple2_0 instanceof TcpSocket)) {
          throw new Error('Resource error: Not a valid "TcpSocket" resource.');
        }
        var handle3 = handleCnt15++;
        handleTable15.set(handle3, { rep: tuple2_0, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle3, true);
        if (!(tuple2_1 instanceof InputStream)) {
          throw new Error('Resource error: Not a valid "InputStream" resource.');
        }
        var handle4 = handleCnt2++;
        handleTable2.set(handle4, { rep: tuple2_1, own: true });
        dataView(memory0).setInt32(arg1 + 8, handle4, true);
        if (!(tuple2_2 instanceof OutputStream)) {
          throw new Error('Resource error: Not a valid "OutputStream" resource.');
        }
        var handle5 = handleCnt3++;
        handleTable3.set(handle5, { rep: tuple2_2, own: true });
        dataView(memory0).setInt32(arg1 + 12, handle5, true);
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val6 = e;
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
        dataView(memory0).setInt8(arg1 + 4, enum6, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline87(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.localAddress.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var variant6 = e;
        switch (variant6.tag) {
          case 'ipv4': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            var {port: v2_0, address: v2_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            var [tuple3_0, tuple3_1, tuple3_2, tuple3_3] = v2_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple3_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple3_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple3_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple3_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            var {port: v4_0, flowInfo: v4_1, address: v4_2, scopeId: v4_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v4_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v4_1), true);
            var [tuple5_0, tuple5_1, tuple5_2, tuple5_3, tuple5_4, tuple5_5, tuple5_6, tuple5_7] = v4_2;
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
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`IpSocketAddress\``);
          }
        }
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val7 = e;
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
  
  function trampoline88(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.remoteAddress.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var variant6 = e;
        switch (variant6.tag) {
          case 'ipv4': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            var {port: v2_0, address: v2_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v2_0), true);
            var [tuple3_0, tuple3_1, tuple3_2, tuple3_3] = v2_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple3_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple3_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple3_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple3_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant6.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            var {port: v4_0, flowInfo: v4_1, address: v4_2, scopeId: v4_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v4_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v4_1), true);
            var [tuple5_0, tuple5_1, tuple5_2, tuple5_3, tuple5_4, tuple5_5, tuple5_6, tuple5_7] = v4_2;
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
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant6.tag)}\` (received \`${variant6}\`) specified for \`IpSocketAddress\``);
          }
        }
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val7 = e;
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
  
  function trampoline89(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable15.get(handle1).rep;
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
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var val3 = e;
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
  
  function trampoline90(arg0, arg1, arg2) {
    var len2 = arg1;
    var base2 = arg0;
    var result2 = [];
    for (let i = 0; i < len2; i++) {
      const base = base2 + i * 4;
      var handle1 = dataView(memory0).getInt32(base + 0, true);
      var rsc0 = handleTable0.get(handle1).rep;
      result2.push(rsc0);
    }
    const ret = poll(result2);
    var val3 = ret;
    var len3 = val3.length;
    var ptr3 = realloc0(0, 0, 4, len3 * 4);
    var src3 = new Uint8Array(val3.buffer, val3.byteOffset, len3 * 4);
    (new Uint8Array(memory0.buffer, ptr3, len3 * 4)).set(src3);
    dataView(memory0).setInt32(arg2 + 4, len3, true);
    dataView(memory0).setInt32(arg2 + 0, ptr3, true);
  }
  
  function trampoline91(arg0, arg1) {
    const ret = getRandomBytes(BigInt.asUintN(64, arg0));
    var val0 = ret;
    var len0 = val0.byteLength;
    var ptr0 = realloc0(0, 0, 1, len0 * 1);
    var src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    dataView(memory0).setInt32(arg1 + 4, len0, true);
    dataView(memory0).setInt32(arg1 + 0, ptr0, true);
  }
  
  function trampoline92(arg0, arg1, arg2, arg3, arg4, arg5) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    handleTable8.delete(handle1);
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    var ptr3 = arg3;
    var len3 = arg4;
    var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let ret;
    try {
      ret = { tag: 'ok', val: mount(rsc0, result2, result3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg5 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg5 + 0, 1, true);
        var val4 = e;
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
          case 'unsupported': {
            enum4 = 2;
            break;
          }
          case 'invalid': {
            enum4 = 3;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val4}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg5 + 1, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline93(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    handleTable8.delete(handle1);
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: unmount(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var val3 = e;
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
          case 'unsupported': {
            enum3 = 2;
            break;
          }
          case 'invalid': {
            enum3 = 3;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val3}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg3 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline94(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable8.get(handle1).rep;
    handleTable8.delete(handle1);
    let ret;
    try {
      ret = { tag: 'ok', val: mounts(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant9 = ret;
    switch (variant9.tag) {
      case 'ok': {
        const e = variant9.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var vec7 = e;
        var len7 = vec7.length;
        var result7 = realloc0(0, 0, 4, len7 * 24);
        for (let i = 0; i < vec7.length; i++) {
          const e = vec7[i];
          const base = result7 + i * 24;var {path: v2_0, source: v2_1, attributes: v2_2 } = e;
          var ptr3 = utf8Encode(v2_0, realloc0, memory0);
          var len3 = utf8EncodedLen;
          dataView(memory0).setInt32(base + 4, len3, true);
          dataView(memory0).setInt32(base + 0, ptr3, true);
          var ptr4 = utf8Encode(v2_1, realloc0, memory0);
          var len4 = utf8EncodedLen;
          dataView(memory0).setInt32(base + 12, len4, true);
          dataView(memory0).setInt32(base + 8, ptr4, true);
          var vec6 = v2_2;
          var len6 = vec6.length;
          var result6 = realloc0(0, 0, 4, len6 * 8);
          for (let i = 0; i < vec6.length; i++) {
            const e = vec6[i];
            const base = result6 + i * 8;var ptr5 = utf8Encode(e, realloc0, memory0);
            var len5 = utf8EncodedLen;
            dataView(memory0).setInt32(base + 4, len5, true);
            dataView(memory0).setInt32(base + 0, ptr5, true);
          }
          dataView(memory0).setInt32(base + 20, len6, true);
          dataView(memory0).setInt32(base + 16, result6, true);
        }
        dataView(memory0).setInt32(arg1 + 8, len7, true);
        dataView(memory0).setInt32(arg1 + 4, result7, true);
        break;
      }
      case 'err': {
        const e = variant9.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val8 = e;
        let enum8;
        switch (val8) {
          case 'access': {
            enum8 = 0;
            break;
          }
          case 'would-block': {
            enum8 = 1;
            break;
          }
          case 'unsupported': {
            enum8 = 2;
            break;
          }
          case 'invalid': {
            enum8 = 3;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val8}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 4, enum8, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline95(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Process.prototype.getProcessId.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
          case 'insufficient-memory': {
            enum2 = 2;
            break;
          }
          case 'unsupported': {
            enum2 = 3;
            break;
          }
          case 'invalid': {
            enum2 = 4;
            break;
          }
          case 'not-started': {
            enum2 = 5;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline96(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    var len3 = arg2;
    var base3 = arg1;
    var result3 = [];
    for (let i = 0; i < len3; i++) {
      const base = base3 + i * 8;
      var ptr2 = dataView(memory0).getInt32(base + 0, true);
      var len2 = dataView(memory0).getInt32(base + 4, true);
      var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
      result3.push(result2);
    }
    Process.prototype.setArgv.call(rsc0, result3);
  }
  
  function trampoline97(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    var len4 = arg2;
    var base4 = arg1;
    var result4 = [];
    for (let i = 0; i < len4; i++) {
      const base = base4 + i * 16;
      var ptr2 = dataView(memory0).getInt32(base + 0, true);
      var len2 = dataView(memory0).getInt32(base + 4, true);
      var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
      var ptr3 = dataView(memory0).getInt32(base + 8, true);
      var len3 = dataView(memory0).getInt32(base + 12, true);
      var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
      result4.push([result2, result3]);
    }
    Process.prototype.setEnv.call(rsc0, result4);
  }
  
  function trampoline98(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Process.prototype.getStdin.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof Descriptor)) {
          throw new Error('Resource error: Not a valid "Descriptor" resource.');
        }
        var handle2 = handleCnt8++;
        handleTable8.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
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
          case 'insufficient-memory': {
            enum3 = 2;
            break;
          }
          case 'unsupported': {
            enum3 = 3;
            break;
          }
          case 'invalid': {
            enum3 = 4;
            break;
          }
          case 'not-started': {
            enum3 = 5;
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
  
  function trampoline99(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Process.prototype.getStdout.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof Descriptor)) {
          throw new Error('Resource error: Not a valid "Descriptor" resource.');
        }
        var handle2 = handleCnt8++;
        handleTable8.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
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
          case 'insufficient-memory': {
            enum3 = 2;
            break;
          }
          case 'unsupported': {
            enum3 = 3;
            break;
          }
          case 'invalid': {
            enum3 = 4;
            break;
          }
          case 'not-started': {
            enum3 = 5;
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
  
  function trampoline100(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Process.prototype.getStderr.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof Descriptor)) {
          throw new Error('Resource error: Not a valid "Descriptor" resource.');
        }
        var handle2 = handleCnt8++;
        handleTable8.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
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
          case 'insufficient-memory': {
            enum3 = 2;
            break;
          }
          case 'unsupported': {
            enum3 = 3;
            break;
          }
          case 'invalid': {
            enum3 = 4;
            break;
          }
          case 'not-started': {
            enum3 = 5;
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
  
  function trampoline101(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Process.prototype.getProcessControl.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof Descriptor)) {
          throw new Error('Resource error: Not a valid "Descriptor" resource.');
        }
        var handle2 = handleCnt8++;
        handleTable8.set(handle2, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle2, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val3 = e;
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
          case 'insufficient-memory': {
            enum3 = 2;
            break;
          }
          case 'unsupported': {
            enum3 = 3;
            break;
          }
          case 'invalid': {
            enum3 = 4;
            break;
          }
          case 'not-started': {
            enum3 = 5;
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
  
  function trampoline102(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Process.prototype.start.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
          case 'insufficient-memory': {
            enum2 = 2;
            break;
          }
          case 'unsupported': {
            enum2 = 3;
            break;
          }
          case 'invalid': {
            enum2 = 4;
            break;
          }
          case 'not-started': {
            enum2 = 5;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline103(arg0, arg1, arg2) {
    var ptr0 = arg0;
    var len0 = arg1;
    var result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    let ret;
    try {
      ret = { tag: 'ok', val: create(result0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        if (!(e instanceof Process)) {
          throw new Error('Resource error: Not a valid "Process" resource.');
        }
        var handle1 = handleCnt10++;
        handleTable10.set(handle1, { rep: e, own: true });
        dataView(memory0).setInt32(arg2 + 4, handle1, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var val2 = e;
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
          case 'insufficient-memory': {
            enum2 = 2;
            break;
          }
          case 'unsupported': {
            enum2 = 3;
            break;
          }
          case 'invalid': {
            enum2 = 4;
            break;
          }
          case 'not-started': {
            enum2 = 5;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val2}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg2 + 4, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline104(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable16.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: ResolveAddressStream.prototype.resolveNextAddress.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var variant5 = e;
        if (variant5 === null || variant5=== undefined) {
          dataView(memory0).setInt8(arg1 + 2, 0, true);
        } else {
          const e = variant5;
          dataView(memory0).setInt8(arg1 + 2, 1, true);
          var variant4 = e;
          switch (variant4.tag) {
            case 'ipv4': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 4, 0, true);
              var [tuple2_0, tuple2_1, tuple2_2, tuple2_3] = e;
              dataView(memory0).setInt8(arg1 + 6, toUint8(tuple2_0), true);
              dataView(memory0).setInt8(arg1 + 7, toUint8(tuple2_1), true);
              dataView(memory0).setInt8(arg1 + 8, toUint8(tuple2_2), true);
              dataView(memory0).setInt8(arg1 + 9, toUint8(tuple2_3), true);
              break;
            }
            case 'ipv6': {
              const e = variant4.val;
              dataView(memory0).setInt8(arg1 + 4, 1, true);
              var [tuple3_0, tuple3_1, tuple3_2, tuple3_3, tuple3_4, tuple3_5, tuple3_6, tuple3_7] = e;
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
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant4.tag)}\` (received \`${variant4}\`) specified for \`IpAddress\``);
            }
          }
        }
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val6 = e;
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
  
  function trampoline105(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rsc0 = handleTable11.get(handle1).rep;
    var ptr2 = arg1;
    var len2 = arg2;
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: resolveAddresses(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        if (!(e instanceof ResolveAddressStream)) {
          throw new Error('Resource error: Not a valid "ResolveAddressStream" resource.');
        }
        var handle3 = handleCnt16++;
        handleTable16.set(handle3, { rep: e, own: true });
        dataView(memory0).setInt32(arg3 + 4, handle3, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var val4 = e;
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
  
  function trampoline106(arg0, arg1) {
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
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof UdpSocket)) {
          throw new Error('Resource error: Not a valid "UdpSocket" resource.');
        }
        var handle1 = handleCnt12++;
        handleTable12.set(handle1, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle1, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
  
  function trampoline107(arg0, arg1) {
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
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof TcpSocket)) {
          throw new Error('Resource error: Not a valid "TcpSocket" resource.');
        }
        var handle1 = handleCnt15++;
        handleTable15.set(handle1, { rep: e, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle1, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val2 = e;
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
  
  function trampoline108(arg0) {
    const ret = getEnvironment();
    var vec3 = ret;
    var len3 = vec3.length;
    var result3 = realloc0(0, 0, 4, len3 * 16);
    for (let i = 0; i < vec3.length; i++) {
      const e = vec3[i];
      const base = result3 + i * 16;var [tuple0_0, tuple0_1] = e;
      var ptr1 = utf8Encode(tuple0_0, realloc0, memory0);
      var len1 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 4, len1, true);
      dataView(memory0).setInt32(base + 0, ptr1, true);
      var ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 12, len2, true);
      dataView(memory0).setInt32(base + 8, ptr2, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len3, true);
    dataView(memory0).setInt32(arg0 + 0, result3, true);
  }
  
  function trampoline109(arg0) {
    const ret = getArguments();
    var vec1 = ret;
    var len1 = vec1.length;
    var result1 = realloc0(0, 0, 4, len1 * 8);
    for (let i = 0; i < vec1.length; i++) {
      const e = vec1[i];
      const base = result1 + i * 8;var ptr0 = utf8Encode(e, realloc0, memory0);
      var len0 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 4, len0, true);
      dataView(memory0).setInt32(base + 0, ptr0, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len1, true);
    dataView(memory0).setInt32(arg0 + 0, result1, true);
  }
  
  function trampoline110(arg0, arg1) {
    var handle1 = arg0;
    var rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TerminalOutputExtended.prototype.windowSize.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var {rows: v2_0, columns: v2_1 } = e;
        dataView(memory0).setInt16(arg1 + 2, toUint16(v2_0), true);
        dataView(memory0).setInt16(arg1 + 4, toUint16(v2_1), true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline111(arg0) {
    const ret = getTerminalStderr();
    var variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      if (!(e instanceof TerminalOutput)) {
        throw new Error('Resource error: Not a valid "TerminalOutput" resource.');
      }
      var handle0 = handleCnt7++;
      handleTable7.set(handle0, { rep: e, own: true });
      dataView(memory0).setInt32(arg0 + 4, handle0, true);
    }
  }
  
  function trampoline112(arg0) {
    const ret = getTerminalStdin();
    var variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      if (!(e instanceof TerminalInputExtended)) {
        throw new Error('Resource error: Not a valid "TerminalInputExtended" resource.');
      }
      var handle0 = handleCnt4++;
      handleTable4.set(handle0, { rep: e, own: true });
      dataView(memory0).setInt32(arg0 + 4, handle0, true);
    }
  }
  
  function trampoline113(arg0) {
    const ret = getTerminalStdout();
    var variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      if (!(e instanceof TerminalOutput)) {
        throw new Error('Resource error: Not a valid "TerminalOutput" resource.');
      }
      var handle0 = handleCnt7++;
      handleTable7.set(handle0, { rep: e, own: true });
      dataView(memory0).setInt32(arg0 + 4, handle0, true);
    }
  }
  
  function trampoline114(arg0) {
    const ret = getTerminalStdin$1();
    var variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      if (!(e instanceof TerminalInput)) {
        throw new Error('Resource error: Not a valid "TerminalInput" resource.');
      }
      var handle0 = handleCnt5++;
      handleTable5.set(handle0, { rep: e, own: true });
      dataView(memory0).setInt32(arg0 + 4, handle0, true);
    }
  }
  
  function trampoline115(arg0) {
    const ret = getTerminalStdout$1();
    var variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      if (!(e instanceof TerminalOutputExtended)) {
        throw new Error('Resource error: Not a valid "TerminalOutputExtended" resource.');
      }
      var handle0 = handleCnt6++;
      handleTable6.set(handle0, { rep: e, own: true });
      dataView(memory0).setInt32(arg0 + 4, handle0, true);
    }
  }
  let exports3;
  function trampoline1(handle) {
    const handleEntry = handleTable1.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable1.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
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
  function trampoline5(handle) {
    const handleEntry = handleTable9.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable9.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline6(handle) {
    const handleEntry = handleTable14.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable14.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline7(handle) {
    const handleEntry = handleTable13.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable13.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline8(handle) {
    const handleEntry = handleTable2.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable2.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline9(handle) {
    const handleEntry = handleTable8.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable8.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline17(handle) {
    const handleEntry = handleTable0.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable0.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline19(handle) {
    const handleEntry = handleTable11.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable11.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline22(handle) {
    const handleEntry = handleTable10.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable10.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline23(handle) {
    const handleEntry = handleTable16.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable16.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline24(handle) {
    const handleEntry = handleTable15.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable15.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline25(handle) {
    const handleEntry = handleTable5.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable5.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline26(handle) {
    const handleEntry = handleTable12.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable12.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline27(handle) {
    const handleEntry = handleTable7.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable7.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline28(handle) {
    const handleEntry = handleTable4.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable4.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  function trampoline29(handle) {
    const handleEntry = handleTable6.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable6.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    wasi_snapshot_preview1: {
      args_get: exports0['81'],
      args_sizes_get: exports0['82'],
      clock_res_get: exports0['85'],
      clock_time_get: exports0['86'],
      environ_get: exports0['83'],
      environ_sizes_get: exports0['84'],
      fd_advise: exports0['87'],
      fd_allocate: exports0['88'],
      fd_close: exports0['89'],
      fd_datasync: exports0['90'],
      fd_fdstat_get: exports0['91'],
      fd_fdstat_set_flags: exports0['92'],
      fd_fdstat_set_rights: exports0['93'],
      fd_filestat_get: exports0['94'],
      fd_filestat_set_size: exports0['95'],
      fd_filestat_set_times: exports0['96'],
      fd_pread: exports0['97'],
      fd_prestat_dir_name: exports0['99'],
      fd_prestat_get: exports0['98'],
      fd_pwrite: exports0['100'],
      fd_read: exports0['101'],
      fd_readdir: exports0['102'],
      fd_renumber: exports0['103'],
      fd_seek: exports0['104'],
      fd_sync: exports0['105'],
      fd_tell: exports0['106'],
      fd_write: exports0['107'],
      fs_mount: exports0['142'],
      fs_mounts: exports0['144'],
      fs_umount: exports0['143'],
      path_create_directory: exports0['108'],
      path_filestat_get: exports0['109'],
      path_filestat_set_times: exports0['110'],
      path_link: exports0['111'],
      path_open: exports0['112'],
      path_readlink: exports0['113'],
      path_remove_directory: exports0['114'],
      path_rename: exports0['115'],
      path_symlink: exports0['116'],
      path_unlink_file: exports0['117'],
      poll_oneoff: exports0['118'],
      proc_exec: exports0['145'],
      proc_exit: exports0['119'],
      proc_raise: exports0['120'],
      random_get: exports0['122'],
      sched_yield: exports0['121'],
      sock_accept: exports0['123'],
      sock_bind: exports0['133'],
      sock_connect: exports0['135'],
      sock_getaddrinfo: exports0['127'],
      sock_getlocaladdr: exports0['128'],
      sock_getpeeraddr: exports0['129'],
      sock_getsockopt: exports0['132'],
      sock_listen: exports0['134'],
      sock_open: exports0['130'],
      sock_recv: exports0['124'],
      sock_recv_from: exports0['136'],
      sock_send: exports0['125'],
      sock_send_to: exports0['137'],
      sock_setsockopt: exports0['131'],
      sock_shutdown: exports0['126'],
      term_get_columns: exports0['141'],
      term_get_raw_mode: exports0['139'],
      term_get_rows: exports0['140'],
      term_set_raw_mode: exports0['138'],
    },
  }));
  ({ exports: exports2 } = await instantiateCore(await module1, {
    __main_module__: {
      _start: exports1._start,
    },
    env: {
      memory: exports1.memory,
    },
    'wasi-ext:cli/terminal-input-extended@0.2.0': {
      '[method]terminal-input-extended.get-raw-mode': trampoline33,
      '[method]terminal-input-extended.set-raw-mode': trampoline34,
      '[resource-drop]terminal-input-extended': trampoline28,
    },
    'wasi-ext:cli/terminal-output-extended@0.2.0': {
      '[method]terminal-output-extended.window-size': exports0['75'],
      '[resource-drop]terminal-output-extended': trampoline29,
    },
    'wasi-ext:cli/terminal-stdin-extended@0.2.0': {
      'get-terminal-stdin': exports0['77'],
    },
    'wasi-ext:cli/terminal-stdout-extended@0.2.0': {
      'get-terminal-stdout': exports0['80'],
    },
    'wasi-ext:filesystems/mount@0.2.0': {
      mount: exports0['57'],
      mounts: exports0['59'],
      unmount: exports0['58'],
    },
    'wasi-ext:process/process@0.2.0': {
      '[method]process.get-process-control': exports0['66'],
      '[method]process.get-process-id': exports0['60'],
      '[method]process.get-stderr': exports0['65'],
      '[method]process.get-stdin': exports0['63'],
      '[method]process.get-stdout': exports0['64'],
      '[method]process.set-argv': exports0['61'],
      '[method]process.set-capabilities': trampoline20,
      '[method]process.set-env': exports0['62'],
      '[method]process.set-root': trampoline21,
      '[method]process.start': exports0['67'],
      '[resource-drop]process': trampoline22,
      create: exports0['68'],
    },
    'wasi:cli/environment@0.2.0': {
      'get-arguments': exports0['74'],
      'get-environment': exports0['73'],
    },
    'wasi:cli/exit@0.2.0': {
      exit: trampoline30,
    },
    'wasi:cli/stderr@0.2.0': {
      'get-stderr': trampoline0,
    },
    'wasi:cli/stdin@0.2.0': {
      'get-stdin': trampoline31,
    },
    'wasi:cli/stdout@0.2.0': {
      'get-stdout': trampoline32,
    },
    'wasi:cli/terminal-input@0.2.0': {
      '[resource-drop]terminal-input': trampoline25,
    },
    'wasi:cli/terminal-output@0.2.0': {
      '[resource-drop]terminal-output': trampoline27,
    },
    'wasi:cli/terminal-stderr@0.2.0': {
      'get-terminal-stderr': exports0['76'],
    },
    'wasi:cli/terminal-stdin@0.2.0': {
      'get-terminal-stdin': exports0['79'],
    },
    'wasi:cli/terminal-stdout@0.2.0': {
      'get-terminal-stdout': exports0['78'],
    },
    'wasi:clocks/monotonic-clock@0.2.0': {
      now: trampoline4,
      resolution: trampoline3,
      'subscribe-duration': trampoline10,
      'subscribe-instant': trampoline16,
    },
    'wasi:clocks/wall-clock@0.2.0': {
      now: exports0['15'],
      resolution: exports0['16'],
    },
    'wasi:filesystem/preopens@0.2.0': {
      'get-directories': exports0['14'],
    },
    'wasi:filesystem/types@0.2.0': {
      '[method]descriptor.advise': exports0['20'],
      '[method]descriptor.append-via-stream': exports0['19'],
      '[method]descriptor.create-directory-at': exports0['30'],
      '[method]descriptor.get-flags': exports0['22'],
      '[method]descriptor.get-type': exports0['23'],
      '[method]descriptor.link-at': exports0['34'],
      '[method]descriptor.metadata-hash': exports0['41'],
      '[method]descriptor.metadata-hash-at': exports0['42'],
      '[method]descriptor.open-at': exports0['35'],
      '[method]descriptor.read': exports0['26'],
      '[method]descriptor.read-directory': exports0['28'],
      '[method]descriptor.read-via-stream': exports0['17'],
      '[method]descriptor.readlink-at': exports0['36'],
      '[method]descriptor.remove-directory-at': exports0['37'],
      '[method]descriptor.rename-at': exports0['38'],
      '[method]descriptor.set-size': exports0['24'],
      '[method]descriptor.set-times': exports0['25'],
      '[method]descriptor.set-times-at': exports0['33'],
      '[method]descriptor.stat': exports0['31'],
      '[method]descriptor.stat-at': exports0['32'],
      '[method]descriptor.symlink-at': exports0['39'],
      '[method]descriptor.sync': exports0['29'],
      '[method]descriptor.sync-data': exports0['21'],
      '[method]descriptor.unlink-file-at': exports0['40'],
      '[method]descriptor.write': exports0['27'],
      '[method]descriptor.write-via-stream': exports0['18'],
      '[method]directory-entry-stream.read-directory-entry': exports0['43'],
      '[resource-drop]descriptor': trampoline9,
      '[resource-drop]directory-entry-stream': trampoline5,
      'filesystem-error-code': exports0['44'],
    },
    'wasi:io/error@0.2.0': {
      '[resource-drop]error': trampoline1,
    },
    'wasi:io/poll@0.2.0': {
      '[resource-drop]pollable': trampoline17,
      poll: exports0['55'],
    },
    'wasi:io/streams@0.2.0': {
      '[method]input-stream.blocking-read': exports0['1'],
      '[method]input-stream.read': exports0['0'],
      '[method]input-stream.subscribe': trampoline15,
      '[method]output-stream.blocking-flush': exports0['5'],
      '[method]output-stream.blocking-write-and-flush': exports0['4'],
      '[method]output-stream.check-write': exports0['2'],
      '[method]output-stream.subscribe': trampoline13,
      '[method]output-stream.write': exports0['3'],
      '[resource-drop]input-stream': trampoline8,
      '[resource-drop]output-stream': trampoline2,
    },
    'wasi:random/random@0.2.0': {
      'get-random-bytes': exports0['56'],
    },
    'wasi:sockets/instance-network@0.2.0': {
      'instance-network': trampoline18,
    },
    'wasi:sockets/ip-name-lookup@0.2.0': {
      '[method]resolve-address-stream.resolve-next-address': exports0['69'],
      '[resource-drop]resolve-address-stream': trampoline23,
      'resolve-addresses': exports0['70'],
    },
    'wasi:sockets/network@0.2.0': {
      '[resource-drop]network': trampoline19,
    },
    'wasi:sockets/tcp-create-socket@0.2.0': {
      'create-tcp-socket': exports0['72'],
    },
    'wasi:sockets/tcp@0.2.0': {
      '[method]tcp-socket.accept': exports0['51'],
      '[method]tcp-socket.finish-bind': exports0['46'],
      '[method]tcp-socket.finish-connect': exports0['48'],
      '[method]tcp-socket.finish-listen': exports0['50'],
      '[method]tcp-socket.local-address': exports0['52'],
      '[method]tcp-socket.remote-address': exports0['53'],
      '[method]tcp-socket.shutdown': exports0['54'],
      '[method]tcp-socket.start-bind': exports0['45'],
      '[method]tcp-socket.start-connect': exports0['47'],
      '[method]tcp-socket.start-listen': exports0['49'],
      '[method]tcp-socket.subscribe': trampoline14,
      '[resource-drop]tcp-socket': trampoline24,
    },
    'wasi:sockets/udp-create-socket@0.2.0': {
      'create-udp-socket': exports0['71'],
    },
    'wasi:sockets/udp@0.2.0': {
      '[method]incoming-datagram-stream.receive': exports0['11'],
      '[method]outgoing-datagram-stream.check-send': exports0['12'],
      '[method]outgoing-datagram-stream.send': exports0['13'],
      '[method]outgoing-datagram-stream.subscribe': trampoline12,
      '[method]udp-socket.finish-bind': exports0['7'],
      '[method]udp-socket.local-address': exports0['9'],
      '[method]udp-socket.remote-address': exports0['10'],
      '[method]udp-socket.start-bind': exports0['6'],
      '[method]udp-socket.stream': exports0['8'],
      '[method]udp-socket.subscribe': trampoline11,
      '[resource-drop]incoming-datagram-stream': trampoline7,
      '[resource-drop]outgoing-datagram-stream': trampoline6,
      '[resource-drop]udp-socket': trampoline26,
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': trampoline35,
      '1': trampoline36,
      '10': trampoline45,
      '100': exports2.fd_pwrite,
      '101': exports2.fd_read,
      '102': exports2.fd_readdir,
      '103': exports2.fd_renumber,
      '104': exports2.fd_seek,
      '105': exports2.fd_sync,
      '106': exports2.fd_tell,
      '107': exports2.fd_write,
      '108': exports2.path_create_directory,
      '109': exports2.path_filestat_get,
      '11': trampoline46,
      '110': exports2.path_filestat_set_times,
      '111': exports2.path_link,
      '112': exports2.path_open,
      '113': exports2.path_readlink,
      '114': exports2.path_remove_directory,
      '115': exports2.path_rename,
      '116': exports2.path_symlink,
      '117': exports2.path_unlink_file,
      '118': exports2.poll_oneoff,
      '119': exports2.proc_exit,
      '12': trampoline47,
      '120': exports2.proc_raise,
      '121': exports2.sched_yield,
      '122': exports2.random_get,
      '123': exports2.sock_accept,
      '124': exports2.sock_recv,
      '125': exports2.sock_send,
      '126': exports2.sock_shutdown,
      '127': exports2.sock_getaddrinfo,
      '128': exports2.sock_getlocaladdr,
      '129': exports2.sock_getpeeraddr,
      '13': trampoline48,
      '130': exports2.sock_open,
      '131': exports2.sock_setsockopt,
      '132': exports2.sock_getsockopt,
      '133': exports2.sock_bind,
      '134': exports2.sock_listen,
      '135': exports2.sock_connect,
      '136': exports2.sock_recv_from,
      '137': exports2.sock_send_to,
      '138': exports2.term_set_raw_mode,
      '139': exports2.term_get_raw_mode,
      '14': trampoline49,
      '140': exports2.term_get_rows,
      '141': exports2.term_get_columns,
      '142': exports2.fs_mount,
      '143': exports2.fs_umount,
      '144': exports2.fs_mounts,
      '145': exports2.proc_exec,
      '15': trampoline50,
      '16': trampoline51,
      '17': trampoline52,
      '18': trampoline53,
      '19': trampoline54,
      '2': trampoline37,
      '20': trampoline55,
      '21': trampoline56,
      '22': trampoline57,
      '23': trampoline58,
      '24': trampoline59,
      '25': trampoline60,
      '26': trampoline61,
      '27': trampoline62,
      '28': trampoline63,
      '29': trampoline64,
      '3': trampoline38,
      '30': trampoline65,
      '31': trampoline66,
      '32': trampoline67,
      '33': trampoline68,
      '34': trampoline69,
      '35': trampoline70,
      '36': trampoline71,
      '37': trampoline72,
      '38': trampoline73,
      '39': trampoline74,
      '4': trampoline39,
      '40': trampoline75,
      '41': trampoline76,
      '42': trampoline77,
      '43': trampoline78,
      '44': trampoline79,
      '45': trampoline80,
      '46': trampoline81,
      '47': trampoline82,
      '48': trampoline83,
      '49': trampoline84,
      '5': trampoline40,
      '50': trampoline85,
      '51': trampoline86,
      '52': trampoline87,
      '53': trampoline88,
      '54': trampoline89,
      '55': trampoline90,
      '56': trampoline91,
      '57': trampoline92,
      '58': trampoline93,
      '59': trampoline94,
      '6': trampoline41,
      '60': trampoline95,
      '61': trampoline96,
      '62': trampoline97,
      '63': trampoline98,
      '64': trampoline99,
      '65': trampoline100,
      '66': trampoline101,
      '67': trampoline102,
      '68': trampoline103,
      '69': trampoline104,
      '7': trampoline42,
      '70': trampoline105,
      '71': trampoline106,
      '72': trampoline107,
      '73': trampoline108,
      '74': trampoline109,
      '75': trampoline110,
      '76': trampoline111,
      '77': trampoline112,
      '78': trampoline113,
      '79': trampoline114,
      '8': trampoline43,
      '80': trampoline115,
      '81': exports2.args_get,
      '82': exports2.args_sizes_get,
      '83': exports2.environ_get,
      '84': exports2.environ_sizes_get,
      '85': exports2.clock_res_get,
      '86': exports2.clock_time_get,
      '87': exports2.fd_advise,
      '88': exports2.fd_allocate,
      '89': exports2.fd_close,
      '9': trampoline44,
      '90': exports2.fd_datasync,
      '91': exports2.fd_fdstat_get,
      '92': exports2.fd_fdstat_set_flags,
      '93': exports2.fd_fdstat_set_rights,
      '94': exports2.fd_filestat_get,
      '95': exports2.fd_filestat_set_size,
      '96': exports2.fd_filestat_set_times,
      '97': exports2.fd_pread,
      '98': exports2.fd_prestat_get,
      '99': exports2.fd_prestat_dir_name,
    },
  }));
  
  function run() {
    const ret = exports2['wasi:cli/run@0.2.0#run']();
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
  const handleTable0= new Map();
  let handleCnt0 = 0;
  const handleTable1= new Map();
  let handleCnt1 = 0;
  const handleTable2= new Map();
  let handleCnt2 = 0;
  const handleTable3= new Map();
  let handleCnt3 = 0;
  const handleTable4= new Map();
  let handleCnt4 = 0;
  const handleTable5= new Map();
  let handleCnt5 = 0;
  const handleTable6= new Map();
  let handleCnt6 = 0;
  const handleTable7= new Map();
  let handleCnt7 = 0;
  const handleTable8= new Map();
  let handleCnt8 = 0;
  const handleTable9= new Map();
  let handleCnt9 = 0;
  const handleTable10= new Map();
  let handleCnt10 = 0;
  const handleTable11= new Map();
  let handleCnt11 = 0;
  const handleTable12= new Map();
  let handleCnt12 = 0;
  const handleTable13= new Map();
  let handleCnt13 = 0;
  const handleTable14= new Map();
  let handleCnt14 = 0;
  const handleTable15= new Map();
  let handleCnt15 = 0;
  const handleTable16= new Map();
  let handleCnt16 = 0;
  const run0_2_0 = {
    run: run,
    
  };
  
  return { run: run0_2_0, 'wasi:cli/run@0.2.0': run0_2_0,  };
}
