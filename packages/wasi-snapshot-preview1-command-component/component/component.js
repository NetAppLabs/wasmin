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
  const { getTerminalStderr } = imports['wasi:cli/terminal-stderr'];
  const { getTerminalStdin } = imports['wasi:cli/terminal-stdin'];
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
  const { UdpSocket } = imports['wasi:sockets/udp'];
  const { createUdpSocket } = imports['wasi:sockets/udp-create-socket'];
  let exports0;
const { Network } = imports["wasi:sockets/instance-network"];
const { TerminalInput } = imports["wasi:cli/terminal-stdin"];
const { TerminalOutput } = imports["wasi:cli/terminal-stdout"];
  let exports1;
  
  function trampoline0() {
    const ret = resolution();
    return toUint64(ret);
  }
  
  function trampoline1() {
    const ret = now();
    return toUint64(ret);
  }
  
  function trampoline7(arg0) {
    const ret = subscribeDuration(BigInt.asUintN(64, arg0));
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle0 = handleCnt1++;
    handleTable1.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline8(arg0) {
    const ret = subscribeInstant(BigInt.asUintN(64, arg0));
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle0 = handleCnt1++;
    handleTable1.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline9(arg0) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
    const ret = TcpSocket.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle2 = handleCnt1++;
    handleTable1.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline10(arg0) {
    const handle1 = arg0;
    const rsc0 = handleTable2.get(handle1).rep;
    const ret = InputStream.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle2 = handleCnt1++;
    handleTable1.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline11(arg0) {
    const handle1 = arg0;
    const rsc0 = handleTable3.get(handle1).rep;
    const ret = OutputStream.prototype.subscribe.call(rsc0);
    if (!(ret instanceof Pollable)) {
      throw new Error('Not a valid "Pollable" resource.');
    }
    const handle2 = handleCnt1++;
    handleTable1.set(handle2, { rep: ret, own: true });
    return handle2;
  }
  
  function trampoline13() {
    const ret = instanceNetwork();
    if (!(ret instanceof Network)) {
      throw new Error('Not a valid "Network" resource.');
    }
    const handle0 = handleCnt8++;
    handleTable8.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline20() {
    const ret = getStdin();
    if (!(ret instanceof InputStream)) {
      throw new Error('Not a valid "InputStream" resource.');
    }
    const handle0 = handleCnt2++;
    handleTable2.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline21() {
    const ret = getStdout();
    if (!(ret instanceof OutputStream)) {
      throw new Error('Not a valid "OutputStream" resource.');
    }
    const handle0 = handleCnt3++;
    handleTable3.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline22() {
    const ret = getStderr();
    if (!(ret instanceof OutputStream)) {
      throw new Error('Not a valid "OutputStream" resource.');
    }
    const handle0 = handleCnt3++;
    handleTable3.set(handle0, { rep: ret, own: true });
    return handle0;
  }
  
  function trampoline23(arg0) {
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
  let exports2;
  
  function trampoline24(arg0) {
    const ret = getDirectories();
    const vec3 = ret;
    const len3 = vec3.length;
    const result3 = realloc0(0, 0, 4, len3 * 12);
    for (let i = 0; i < vec3.length; i++) {
      const e = vec3[i];
      const base = result3 + i * 12;const [tuple0_0, tuple0_1] = e;
      if (!(tuple0_0 instanceof Descriptor)) {
        throw new Error('Not a valid "Descriptor" resource.');
      }
      const handle1 = handleCnt6++;
      handleTable6.set(handle1, { rep: tuple0_0, own: true });
      dataView(memory0).setInt32(base + 0, handle1, true);
      const ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
      const len2 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 8, len2, true);
      dataView(memory0).setInt32(base + 4, ptr2, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len3, true);
    dataView(memory0).setInt32(arg0 + 0, result3, true);
  }
  let memory0;
  let realloc0;
  
  function trampoline25(arg0) {
    const ret = now$1();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function trampoline26(arg0) {
    const ret = resolution$1();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function trampoline27(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
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
  
  function trampoline28(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
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
  
  function trampoline29(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
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
  
  function trampoline30(arg0, arg1, arg2, arg3, arg4) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
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
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
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
        dataView(memory0).setInt8(arg4 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline31(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.syncData.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
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
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline32(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.getFlags.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
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
  
  function trampoline33(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
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
  
  function trampoline34(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.setSize.call(rsc0, BigInt.asUintN(64, arg1)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
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
        dataView(memory0).setInt8(arg2 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline35(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
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
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg7 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg7 + 0, 1, true);
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
        dataView(memory0).setInt8(arg7 + 1, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline36(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.read.call(rsc0, BigInt.asUintN(64, arg1), BigInt.asUintN(64, arg2)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        const [tuple2_0, tuple2_1] = e;
        const val3 = tuple2_0;
        const len3 = val3.byteLength;
        const ptr3 = realloc0(0, 0, 1, len3 * 1);
        const src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
        (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
        dataView(memory0).setInt32(arg3 + 8, len3, true);
        dataView(memory0).setInt32(arg3 + 4, ptr3, true);
        dataView(memory0).setInt8(arg3 + 12, tuple2_1 ? 1 : 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
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
        dataView(memory0).setInt8(arg3 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline37(arg0, arg1, arg2, arg3, arg4) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.write.call(rsc0, result2, BigInt.asUintN(64, arg3)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
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
  
  function trampoline38(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.readDirectory.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof DirectoryEntryStream)) {
          throw new Error('Not a valid "DirectoryEntryStream" resource.');
        }
        const handle2 = handleCnt7++;
        handleTable7.set(handle2, { rep: e, own: true });
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
  
  function trampoline39(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.sync.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant3.val;
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
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline40(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.createDirectoryAt.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
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
        dataView(memory0).setInt8(arg3 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline41(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
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
  
  function trampoline42(arg0, arg1, arg2, arg3, arg4) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr3 = arg2;
    const len3 = arg3;
    const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.statAt.call(rsc0, flags2, result3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant13 = ret;
    switch (variant13.tag) {
      case 'ok': {
        const e = variant13.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        const {type: v4_0, linkCount: v4_1, size: v4_2, dataAccessTimestamp: v4_3, dataModificationTimestamp: v4_4, statusChangeTimestamp: v4_5 } = e;
        const val5 = v4_0;
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
        const variant7 = v4_3;
        if (variant7 === null || variant7=== undefined) {
          dataView(memory0).setInt8(arg4 + 32, 0, true);
        } else {
          const e = variant7;
          dataView(memory0).setInt8(arg4 + 32, 1, true);
          const {seconds: v6_0, nanoseconds: v6_1 } = e;
          dataView(memory0).setBigInt64(arg4 + 40, toUint64(v6_0), true);
          dataView(memory0).setInt32(arg4 + 48, toUint32(v6_1), true);
        }
        const variant9 = v4_4;
        if (variant9 === null || variant9=== undefined) {
          dataView(memory0).setInt8(arg4 + 56, 0, true);
        } else {
          const e = variant9;
          dataView(memory0).setInt8(arg4 + 56, 1, true);
          const {seconds: v8_0, nanoseconds: v8_1 } = e;
          dataView(memory0).setBigInt64(arg4 + 64, toUint64(v8_0), true);
          dataView(memory0).setInt32(arg4 + 72, toUint32(v8_1), true);
        }
        const variant11 = v4_5;
        if (variant11 === null || variant11=== undefined) {
          dataView(memory0).setInt8(arg4 + 80, 0, true);
        } else {
          const e = variant11;
          dataView(memory0).setInt8(arg4 + 80, 1, true);
          const {seconds: v10_0, nanoseconds: v10_1 } = e;
          dataView(memory0).setBigInt64(arg4 + 88, toUint64(v10_0), true);
          dataView(memory0).setInt32(arg4 + 96, toUint32(v10_1), true);
        }
        break;
      }
      case 'err': {
        const e = variant13.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        const val12 = e;
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
  
  function trampoline43(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr3 = arg2;
    const len3 = arg3;
    const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
    const variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg10 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg10 + 0, 1, true);
        const val6 = e;
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
  
  function trampoline44(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr3 = arg2;
    const len3 = arg3;
    const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    const handle5 = arg4;
    const rsc4 = handleTable6.get(handle5).rep;
    const ptr6 = arg5;
    const len6 = arg6;
    const result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.linkAt.call(rsc0, flags2, result3, rsc4, result6) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg7 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg7 + 0, 1, true);
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
        dataView(memory0).setInt8(arg7 + 1, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline45(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr3 = arg2;
    const len3 = arg3;
    const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    if ((arg4 & 4294967280) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags4 = {
      create: Boolean(arg4 & 1),
      directory: Boolean(arg4 & 2),
      exclusive: Boolean(arg4 & 4),
      truncate: Boolean(arg4 & 8),
    };
    if ((arg5 & 4294967232) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags5 = {
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
    const variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg6 + 0, 0, true);
        if (!(e instanceof Descriptor)) {
          throw new Error('Not a valid "Descriptor" resource.');
        }
        const handle6 = handleCnt6++;
        handleTable6.set(handle6, { rep: e, own: true });
        dataView(memory0).setInt32(arg6 + 4, handle6, true);
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg6 + 0, 1, true);
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
        dataView(memory0).setInt8(arg6 + 4, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline46(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.readlinkAt.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        const ptr3 = utf8Encode(e, realloc0, memory0);
        const len3 = utf8EncodedLen;
        dataView(memory0).setInt32(arg3 + 8, len3, true);
        dataView(memory0).setInt32(arg3 + 4, ptr3, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
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
        dataView(memory0).setInt8(arg3 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline47(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.removeDirectoryAt.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
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
        dataView(memory0).setInt8(arg3 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline48(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    const handle4 = arg3;
    const rsc3 = handleTable6.get(handle4).rep;
    const ptr5 = arg4;
    const len5 = arg5;
    const result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.renameAt.call(rsc0, result2, rsc3, result5) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg6 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg6 + 0, 1, true);
        const val6 = e;
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
  
  function trampoline49(arg0, arg1, arg2, arg3, arg4, arg5) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    const ptr3 = arg3;
    const len3 = arg4;
    const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.symlinkAt.call(rsc0, result2, result3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg5 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg5 + 0, 1, true);
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
        dataView(memory0).setInt8(arg5 + 1, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline50(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    const ptr2 = arg1;
    const len2 = arg2;
    const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.unlinkFileAt.call(rsc0, result2) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
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
        dataView(memory0).setInt8(arg3 + 1, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline51(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.metadataHash.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant4 = ret;
    switch (variant4.tag) {
      case 'ok': {
        const e = variant4.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const {lower: v2_0, upper: v2_1 } = e;
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(v2_0), true);
        dataView(memory0).setBigInt64(arg1 + 16, toUint64(v2_1), true);
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
        dataView(memory0).setInt8(arg1 + 8, enum3, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline52(arg0, arg1, arg2, arg3, arg4) {
    const handle1 = arg0;
    const rsc0 = handleTable6.get(handle1).rep;
    if ((arg1 & 4294967294) !== 0) {
      throw new TypeError('flags have extraneous bits set');
    }
    const flags2 = {
      symlinkFollow: Boolean(arg1 & 1),
    };
    const ptr3 = arg2;
    const len3 = arg3;
    const result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let ret;
    try {
      ret = { tag: 'ok', val: Descriptor.prototype.metadataHashAt.call(rsc0, flags2, result3) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        const {lower: v4_0, upper: v4_1 } = e;
        dataView(memory0).setBigInt64(arg4 + 8, toUint64(v4_0), true);
        dataView(memory0).setBigInt64(arg4 + 16, toUint64(v4_1), true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
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
        dataView(memory0).setInt8(arg4 + 8, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline53(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable7.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: DirectoryEntryStream.prototype.readDirectoryEntry.call(rsc0) };
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
          dataView(memory0).setInt8(arg1 + 4, 0, true);
        } else {
          const e = variant5;
          dataView(memory0).setInt8(arg1 + 4, 1, true);
          const {type: v2_0, name: v2_1 } = e;
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
          const ptr4 = utf8Encode(v2_1, realloc0, memory0);
          const len4 = utf8EncodedLen;
          dataView(memory0).setInt32(arg1 + 16, len4, true);
          dataView(memory0).setInt32(arg1 + 12, ptr4, true);
        }
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        const val6 = e;
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
  
  function trampoline54(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable0.get(handle1).rep;
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
  
  function trampoline55(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable2.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: InputStream.prototype.read.call(rsc0, BigInt.asUintN(64, arg1)) };
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
            const handle3 = handleCnt0++;
            handleTable0.set(handle3, { rep: e, own: true });
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
  
  function trampoline56(arg0, arg1, arg2) {
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
            const handle3 = handleCnt0++;
            handleTable0.set(handle3, { rep: e, own: true });
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
  
  function trampoline57(arg0, arg1) {
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
            const handle2 = handleCnt0++;
            handleTable0.set(handle2, { rep: e, own: true });
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
  
  function trampoline58(arg0, arg1, arg2, arg3) {
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
            const handle3 = handleCnt0++;
            handleTable0.set(handle3, { rep: e, own: true });
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
  
  function trampoline59(arg0, arg1, arg2, arg3) {
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
            const handle3 = handleCnt0++;
            handleTable0.set(handle3, { rep: e, own: true });
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
  
  function trampoline60(arg0, arg1) {
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
            const handle2 = handleCnt0++;
            handleTable0.set(handle2, { rep: e, own: true });
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
  
  function trampoline61(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
    const handle3 = arg1;
    const rsc2 = handleTable8.get(handle3).rep;
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
  
  function trampoline62(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.finishBind.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
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
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline63(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
    const handle3 = arg1;
    const rsc2 = handleTable8.get(handle3).rep;
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
  
  function trampoline64(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
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
  
  function trampoline65(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.startListen.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
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
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline66(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.finishListen.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
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
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline67(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.accept.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const [tuple2_0, tuple2_1, tuple2_2] = e;
        if (!(tuple2_0 instanceof TcpSocket)) {
          throw new Error('Not a valid "TcpSocket" resource.');
        }
        const handle3 = handleCnt10++;
        handleTable10.set(handle3, { rep: tuple2_0, own: true });
        dataView(memory0).setInt32(arg1 + 4, handle3, true);
        if (!(tuple2_1 instanceof InputStream)) {
          throw new Error('Not a valid "InputStream" resource.');
        }
        const handle4 = handleCnt2++;
        handleTable2.set(handle4, { rep: tuple2_1, own: true });
        dataView(memory0).setInt32(arg1 + 8, handle4, true);
        if (!(tuple2_2 instanceof OutputStream)) {
          throw new Error('Not a valid "OutputStream" resource.');
        }
        const handle5 = handleCnt3++;
        handleTable3.set(handle5, { rep: tuple2_2, own: true });
        dataView(memory0).setInt32(arg1 + 12, handle5, true);
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
        dataView(memory0).setInt8(arg1 + 4, enum6, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline68(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: TcpSocket.prototype.localAddress.call(rsc0) };
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
  
  function trampoline69(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
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
  
  function trampoline70(arg0, arg1, arg2) {
    const handle1 = arg0;
    const rsc0 = handleTable10.get(handle1).rep;
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
  
  function trampoline71(arg0, arg1, arg2) {
    const len2 = arg1;
    const base2 = arg0;
    const result2 = [];
    for (let i = 0; i < len2; i++) {
      const base = base2 + i * 4;
      const handle1 = dataView(memory0).getInt32(base + 0, true);
      const rsc0 = handleTable1.get(handle1).rep;
      result2.push(rsc0);
    }
    const ret = poll(result2);
    const val3 = ret;
    const len3 = val3.length;
    const ptr3 = realloc0(0, 0, 4, len3 * 4);
    const src3 = new Uint8Array(val3.buffer, val3.byteOffset, len3 * 4);
    (new Uint8Array(memory0.buffer, ptr3, len3 * 4)).set(src3);
    dataView(memory0).setInt32(arg2 + 4, len3, true);
    dataView(memory0).setInt32(arg2 + 0, ptr3, true);
  }
  
  function trampoline72(arg0, arg1) {
    const ret = getRandomBytes(BigInt.asUintN(64, arg0));
    const val0 = ret;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    dataView(memory0).setInt32(arg1 + 4, len0, true);
    dataView(memory0).setInt32(arg1 + 0, ptr0, true);
  }
  
  function trampoline73(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    const handle1 = arg0;
    const rsc0 = handleTable9.get(handle1).rep;
    const handle3 = arg1;
    const rsc2 = handleTable8.get(handle3).rep;
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
  
  function trampoline74(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable9.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: UdpSocket.prototype.finishBind.call(rsc0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
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
        dataView(memory0).setInt8(arg1 + 1, enum2, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline75(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable9.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: UdpSocket.prototype.localAddress.call(rsc0) };
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
  
  function trampoline76(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable9.get(handle1).rep;
    let ret;
    try {
      ret = { tag: 'ok', val: UdpSocket.prototype.remoteAddress.call(rsc0) };
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
  
  function trampoline77(arg0, arg1) {
    const handle1 = arg0;
    const rsc0 = handleTable11.get(handle1).rep;
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
  
  function trampoline78(arg0, arg1, arg2, arg3) {
    const handle1 = arg0;
    const rsc0 = handleTable8.get(handle1).rep;
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
        const handle3 = handleCnt11++;
        handleTable11.set(handle3, { rep: e, own: true });
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
  
  function trampoline79(arg0, arg1) {
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
    const variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof UdpSocket)) {
          throw new Error('Not a valid "UdpSocket" resource.');
        }
        const handle1 = handleCnt9++;
        handleTable9.set(handle1, { rep: e, own: true });
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
  
  function trampoline80(arg0, arg1) {
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
        const handle1 = handleCnt10++;
        handleTable10.set(handle1, { rep: e, own: true });
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
  
  function trampoline81(arg0) {
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
  
  function trampoline82(arg0) {
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
  
  function trampoline83(arg0) {
    const ret = getTerminalStdin();
    const variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      if (!(e instanceof TerminalInput)) {
        throw new Error('Not a valid "TerminalInput" resource.');
      }
      const handle0 = handleCnt4++;
      handleTable4.set(handle0, { rep: e, own: true });
      dataView(memory0).setInt32(arg0 + 4, handle0, true);
    }
  }
  
  function trampoline84(arg0) {
    const ret = getTerminalStdout();
    const variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      if (!(e instanceof TerminalOutput)) {
        throw new Error('Not a valid "TerminalOutput" resource.');
      }
      const handle0 = handleCnt5++;
      handleTable5.set(handle0, { rep: e, own: true });
      dataView(memory0).setInt32(arg0 + 4, handle0, true);
    }
  }
  
  function trampoline85(arg0) {
    const ret = getTerminalStderr();
    const variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      if (!(e instanceof TerminalOutput)) {
        throw new Error('Not a valid "TerminalOutput" resource.');
      }
      const handle0 = handleCnt5++;
      handleTable5.set(handle0, { rep: e, own: true });
      dataView(memory0).setInt32(arg0 + 4, handle0, true);
    }
  }
  let exports3;
  const handleTable7= new Map();
  let handleCnt7 = 0;
  function trampoline2(handle) {
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
  function trampoline3(handle) {
    const handleEntry = handleTable0.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable0.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable2= new Map();
  let handleCnt2 = 0;
  function trampoline4(handle) {
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
  function trampoline5(handle) {
    const handleEntry = handleTable3.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable3.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable6= new Map();
  let handleCnt6 = 0;
  function trampoline6(handle) {
    const handleEntry = handleTable6.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable6.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable1= new Map();
  let handleCnt1 = 0;
  function trampoline12(handle) {
    const handleEntry = handleTable1.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable1.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable8= new Map();
  let handleCnt8 = 0;
  function trampoline14(handle) {
    const handleEntry = handleTable8.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable8.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable11= new Map();
  let handleCnt11 = 0;
  function trampoline15(handle) {
    const handleEntry = handleTable11.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable11.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable10= new Map();
  let handleCnt10 = 0;
  function trampoline16(handle) {
    const handleEntry = handleTable10.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable10.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable9= new Map();
  let handleCnt9 = 0;
  function trampoline17(handle) {
    const handleEntry = handleTable9.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable9.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable4= new Map();
  let handleCnt4 = 0;
  function trampoline18(handle) {
    const handleEntry = handleTable4.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable4.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const handleTable5= new Map();
  let handleCnt5 = 0;
  function trampoline19(handle) {
    const handleEntry = handleTable5.get(handle);
    if (!handleEntry) {
      throw new Error(`Resource error: Invalid handle ${handle}`);
    }
    handleTable5.delete(handle);
    if (handleEntry.own && handleEntry.rep[symbolDispose]) {
      handleEntry.rep[symbolDispose]();
    }
  }
  const instanceFlags0 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
  const instanceFlags1 = new WebAssembly.Global({ value: "i32", mutable: true }, 3);
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    wasi_snapshot_preview1: {
      args_get: exports0['62'],
      args_sizes_get: exports0['63'],
      clock_res_get: exports0['66'],
      clock_time_get: exports0['67'],
      environ_get: exports0['64'],
      environ_sizes_get: exports0['65'],
      fd_advise: exports0['68'],
      fd_allocate: exports0['69'],
      fd_close: exports0['70'],
      fd_datasync: exports0['71'],
      fd_fdstat_get: exports0['72'],
      fd_fdstat_set_flags: exports0['73'],
      fd_fdstat_set_rights: exports0['74'],
      fd_filestat_get: exports0['75'],
      fd_filestat_set_size: exports0['76'],
      fd_filestat_set_times: exports0['77'],
      fd_pread: exports0['78'],
      fd_prestat_dir_name: exports0['80'],
      fd_prestat_get: exports0['79'],
      fd_pwrite: exports0['81'],
      fd_read: exports0['82'],
      fd_readdir: exports0['83'],
      fd_renumber: exports0['84'],
      fd_seek: exports0['85'],
      fd_sync: exports0['86'],
      fd_tell: exports0['87'],
      fd_write: exports0['88'],
      path_create_directory: exports0['89'],
      path_filestat_get: exports0['90'],
      path_filestat_set_times: exports0['91'],
      path_link: exports0['92'],
      path_open: exports0['93'],
      path_readlink: exports0['94'],
      path_remove_directory: exports0['95'],
      path_rename: exports0['96'],
      path_symlink: exports0['97'],
      path_unlink_file: exports0['98'],
      poll_oneoff: exports0['99'],
      proc_exit: exports0['100'],
      proc_raise: exports0['101'],
      random_get: exports0['103'],
      sched_yield: exports0['102'],
      sock_accept: exports0['104'],
      sock_bind: exports0['114'],
      sock_connect: exports0['116'],
      sock_getaddrinfo: exports0['108'],
      sock_getlocaladdr: exports0['109'],
      sock_getpeeraddr: exports0['110'],
      sock_getsockopt: exports0['113'],
      sock_listen: exports0['115'],
      sock_open: exports0['111'],
      sock_recv: exports0['105'],
      sock_recv_from: exports0['117'],
      sock_send: exports0['106'],
      sock_send_to: exports0['118'],
      sock_setsockopt: exports0['112'],
      sock_shutdown: exports0['107'],
    },
  }));
  ({ exports: exports2 } = await instantiateCore(await module1, {
    __main_module__: {
      _start: exports1._start,
    },
    env: {
      memory: exports1.memory,
    },
    'wasi:cli/environment@0.2.0': {
      'get-arguments': exports0['58'],
      'get-environment': exports0['57'],
    },
    'wasi:cli/exit@0.2.0': {
      exit: trampoline23,
    },
    'wasi:cli/stderr@0.2.0': {
      'get-stderr': trampoline22,
    },
    'wasi:cli/stdin@0.2.0': {
      'get-stdin': trampoline20,
    },
    'wasi:cli/stdout@0.2.0': {
      'get-stdout': trampoline21,
    },
    'wasi:cli/terminal-input@0.2.0': {
      '[resource-drop]terminal-input': trampoline18,
    },
    'wasi:cli/terminal-output@0.2.0': {
      '[resource-drop]terminal-output': trampoline19,
    },
    'wasi:cli/terminal-stderr@0.2.0': {
      'get-terminal-stderr': exports0['61'],
    },
    'wasi:cli/terminal-stdin@0.2.0': {
      'get-terminal-stdin': exports0['59'],
    },
    'wasi:cli/terminal-stdout@0.2.0': {
      'get-terminal-stdout': exports0['60'],
    },
    'wasi:clocks/monotonic-clock@0.2.0': {
      now: trampoline1,
      resolution: trampoline0,
      'subscribe-duration': trampoline7,
      'subscribe-instant': trampoline8,
    },
    'wasi:clocks/wall-clock@0.2.0': {
      now: exports0['1'],
      resolution: exports0['2'],
    },
    'wasi:filesystem/preopens@0.2.0': {
      'get-directories': exports0['0'],
    },
    'wasi:filesystem/types@0.2.0': {
      '[method]descriptor.advise': exports0['6'],
      '[method]descriptor.append-via-stream': exports0['5'],
      '[method]descriptor.create-directory-at': exports0['16'],
      '[method]descriptor.get-flags': exports0['8'],
      '[method]descriptor.get-type': exports0['9'],
      '[method]descriptor.link-at': exports0['20'],
      '[method]descriptor.metadata-hash': exports0['27'],
      '[method]descriptor.metadata-hash-at': exports0['28'],
      '[method]descriptor.open-at': exports0['21'],
      '[method]descriptor.read': exports0['12'],
      '[method]descriptor.read-directory': exports0['14'],
      '[method]descriptor.read-via-stream': exports0['3'],
      '[method]descriptor.readlink-at': exports0['22'],
      '[method]descriptor.remove-directory-at': exports0['23'],
      '[method]descriptor.rename-at': exports0['24'],
      '[method]descriptor.set-size': exports0['10'],
      '[method]descriptor.set-times': exports0['11'],
      '[method]descriptor.set-times-at': exports0['19'],
      '[method]descriptor.stat': exports0['17'],
      '[method]descriptor.stat-at': exports0['18'],
      '[method]descriptor.symlink-at': exports0['25'],
      '[method]descriptor.sync': exports0['15'],
      '[method]descriptor.sync-data': exports0['7'],
      '[method]descriptor.unlink-file-at': exports0['26'],
      '[method]descriptor.write': exports0['13'],
      '[method]descriptor.write-via-stream': exports0['4'],
      '[method]directory-entry-stream.read-directory-entry': exports0['29'],
      '[resource-drop]descriptor': trampoline6,
      '[resource-drop]directory-entry-stream': trampoline2,
      'filesystem-error-code': exports0['30'],
    },
    'wasi:io/error@0.2.0': {
      '[resource-drop]error': trampoline3,
    },
    'wasi:io/poll@0.2.0': {
      '[resource-drop]pollable': trampoline12,
      poll: exports0['47'],
    },
    'wasi:io/streams@0.2.0': {
      '[method]input-stream.blocking-read': exports0['32'],
      '[method]input-stream.read': exports0['31'],
      '[method]input-stream.subscribe': trampoline10,
      '[method]output-stream.blocking-flush': exports0['36'],
      '[method]output-stream.blocking-write-and-flush': exports0['35'],
      '[method]output-stream.check-write': exports0['33'],
      '[method]output-stream.subscribe': trampoline11,
      '[method]output-stream.write': exports0['34'],
      '[resource-drop]input-stream': trampoline4,
      '[resource-drop]output-stream': trampoline5,
    },
    'wasi:random/random@0.2.0': {
      'get-random-bytes': exports0['48'],
    },
    'wasi:sockets/instance-network@0.2.0': {
      'instance-network': trampoline13,
    },
    'wasi:sockets/ip-name-lookup@0.2.0': {
      '[method]resolve-address-stream.resolve-next-address': exports0['53'],
      '[resource-drop]resolve-address-stream': trampoline15,
      'resolve-addresses': exports0['54'],
    },
    'wasi:sockets/network@0.2.0': {
      '[resource-drop]network': trampoline14,
    },
    'wasi:sockets/tcp-create-socket@0.2.0': {
      'create-tcp-socket': exports0['56'],
    },
    'wasi:sockets/tcp@0.2.0': {
      '[method]tcp-socket.accept': exports0['43'],
      '[method]tcp-socket.finish-bind': exports0['38'],
      '[method]tcp-socket.finish-connect': exports0['40'],
      '[method]tcp-socket.finish-listen': exports0['42'],
      '[method]tcp-socket.local-address': exports0['44'],
      '[method]tcp-socket.remote-address': exports0['45'],
      '[method]tcp-socket.shutdown': exports0['46'],
      '[method]tcp-socket.start-bind': exports0['37'],
      '[method]tcp-socket.start-connect': exports0['39'],
      '[method]tcp-socket.start-listen': exports0['41'],
      '[method]tcp-socket.subscribe': trampoline9,
      '[resource-drop]tcp-socket': trampoline16,
    },
    'wasi:sockets/udp-create-socket@0.2.0': {
      'create-udp-socket': exports0['55'],
    },
    'wasi:sockets/udp@0.2.0': {
      '[method]udp-socket.finish-bind': exports0['50'],
      '[method]udp-socket.local-address': exports0['51'],
      '[method]udp-socket.remote-address': exports0['52'],
      '[method]udp-socket.start-bind': exports0['49'],
      '[resource-drop]udp-socket': trampoline17,
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': trampoline24,
      '1': trampoline25,
      '10': trampoline34,
      '100': exports2.proc_exit,
      '101': exports2.proc_raise,
      '102': exports2.sched_yield,
      '103': exports2.random_get,
      '104': exports2.sock_accept,
      '105': exports2.sock_recv,
      '106': exports2.sock_send,
      '107': exports2.sock_shutdown,
      '108': exports2.sock_getaddrinfo,
      '109': exports2.sock_getlocaladdr,
      '11': trampoline35,
      '110': exports2.sock_getpeeraddr,
      '111': exports2.sock_open,
      '112': exports2.sock_setsockopt,
      '113': exports2.sock_setsockopt,
      '114': exports2.sock_bind,
      '115': exports2.sock_listen,
      '116': exports2.sock_connect,
      '117': exports2.sock_recv_from,
      '118': exports2.sock_send_to,
      '12': trampoline36,
      '13': trampoline37,
      '14': trampoline38,
      '15': trampoline39,
      '16': trampoline40,
      '17': trampoline41,
      '18': trampoline42,
      '19': trampoline43,
      '2': trampoline26,
      '20': trampoline44,
      '21': trampoline45,
      '22': trampoline46,
      '23': trampoline47,
      '24': trampoline48,
      '25': trampoline49,
      '26': trampoline50,
      '27': trampoline51,
      '28': trampoline52,
      '29': trampoline53,
      '3': trampoline27,
      '30': trampoline54,
      '31': trampoline55,
      '32': trampoline56,
      '33': trampoline57,
      '34': trampoline58,
      '35': trampoline59,
      '36': trampoline60,
      '37': trampoline61,
      '38': trampoline62,
      '39': trampoline63,
      '4': trampoline28,
      '40': trampoline64,
      '41': trampoline65,
      '42': trampoline66,
      '43': trampoline67,
      '44': trampoline68,
      '45': trampoline69,
      '46': trampoline70,
      '47': trampoline71,
      '48': trampoline72,
      '49': trampoline73,
      '5': trampoline29,
      '50': trampoline74,
      '51': trampoline75,
      '52': trampoline76,
      '53': trampoline77,
      '54': trampoline78,
      '55': trampoline79,
      '56': trampoline80,
      '57': trampoline81,
      '58': trampoline82,
      '59': trampoline83,
      '6': trampoline30,
      '60': trampoline84,
      '61': trampoline85,
      '62': exports2.args_get,
      '63': exports2.args_sizes_get,
      '64': exports2.environ_get,
      '65': exports2.environ_sizes_get,
      '66': exports2.clock_res_get,
      '67': exports2.clock_time_get,
      '68': exports2.fd_advise,
      '69': exports2.fd_allocate,
      '7': trampoline31,
      '70': exports2.fd_close,
      '71': exports2.fd_datasync,
      '72': exports2.fd_fdstat_get,
      '73': exports2.fd_fdstat_set_flags,
      '74': exports2.fd_fdstat_set_rights,
      '75': exports2.fd_filestat_get,
      '76': exports2.fd_filestat_set_size,
      '77': exports2.fd_filestat_set_times,
      '78': exports2.fd_pread,
      '79': exports2.fd_prestat_get,
      '8': trampoline32,
      '80': exports2.fd_prestat_dir_name,
      '81': exports2.fd_pwrite,
      '82': exports2.fd_read,
      '83': exports2.fd_readdir,
      '84': exports2.fd_renumber,
      '85': exports2.fd_seek,
      '86': exports2.fd_sync,
      '87': exports2.fd_tell,
      '88': exports2.fd_write,
      '89': exports2.path_create_directory,
      '9': trampoline33,
      '90': exports2.path_filestat_get,
      '91': exports2.path_filestat_set_times,
      '92': exports2.path_link,
      '93': exports2.path_open,
      '94': exports2.path_readlink,
      '95': exports2.path_remove_directory,
      '96': exports2.path_rename,
      '97': exports2.path_symlink,
      '98': exports2.path_unlink_file,
      '99': exports2.poll_oneoff,
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
  const run0_2_0 = {
    run: run,
    
  };
  
  return { run: run0_2_0, 'wasi:cli/run@0.2.0': run0_2_0 };
}
