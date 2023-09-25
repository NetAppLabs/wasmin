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

function toUint32(val) {
  return val >>> 0;
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
  let exports0;
  let exports1;
  
  function lowering0() {
    const ret = resolution();
    return toUint64(ret);
  }
  
  function lowering1() {
    const ret = now();
    return toUint64(ret);
  }
  
  function lowering2(arg0) {
    dropDirectoryEntryStream(arg0 >>> 0);
  }
  
  function lowering3(arg0, arg1) {
    const bool0 = arg1;
    const ret = subscribe(BigInt.asUintN(64, arg0), bool0 == 0 ? false : (bool0 == 1 ? true : throwInvalidBool()));
    return toUint32(ret);
  }
  
  function lowering4(arg0) {
    const ret = subscribeToOutputStream(arg0 >>> 0);
    return toUint32(ret);
  }
  
  function lowering5(arg0) {
    const ret = subscribeToInputStream(arg0 >>> 0);
    return toUint32(ret);
  }
  
  function lowering6(arg0) {
    dropPollable(arg0 >>> 0);
  }
  
  function lowering7(arg0) {
    dropInputStream(arg0 >>> 0);
  }
  
  function lowering8(arg0) {
    dropOutputStream(arg0 >>> 0);
  }
  
  function lowering9(arg0) {
    dropDescriptor(arg0 >>> 0);
  }
  
  function lowering10() {
    const ret = getStdin();
    return toUint32(ret);
  }
  
  function lowering11(arg0) {
    dropTerminalInput(arg0 >>> 0);
  }
  
  function lowering12() {
    const ret = getStdout();
    return toUint32(ret);
  }
  
  function lowering13(arg0) {
    dropTerminalOutput(arg0 >>> 0);
  }
  
  function lowering14() {
    const ret = getStderr();
    return toUint32(ret);
  }
  
  function lowering15(arg0) {
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
  let memory0;
  let realloc0;
  
  function lowering16(arg0) {
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
  
  function lowering17(arg0) {
    const ret = now$1();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function lowering18(arg0) {
    const ret = resolution$1();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function lowering19(arg0, arg1, arg2) {
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
  
  function lowering20(arg0, arg1, arg2) {
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
  
  function lowering21(arg0, arg1) {
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
  
  function lowering22(arg0, arg1, arg2, arg3, arg4) {
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
  
  function lowering23(arg0, arg1) {
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
  
  function lowering24(arg0, arg1) {
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
  
  function lowering25(arg0, arg1) {
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
  
  function lowering26(arg0, arg1, arg2) {
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
  
  function lowering27(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
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
  
  function lowering28(arg0, arg1, arg2, arg3) {
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
  
  function lowering29(arg0, arg1, arg2, arg3, arg4) {
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
  
  function lowering30(arg0, arg1) {
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
  
  function lowering31(arg0, arg1) {
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
  
  function lowering32(arg0, arg1, arg2, arg3) {
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
  
  function lowering33(arg0, arg1) {
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
  
  function lowering34(arg0, arg1, arg2, arg3, arg4) {
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
  
  function lowering35(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
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
  
  function lowering36(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
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
  
  function lowering37(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
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
  
  function lowering38(arg0, arg1, arg2, arg3) {
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
  
  function lowering39(arg0, arg1, arg2, arg3) {
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
  
  function lowering40(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
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
  
  function lowering41(arg0, arg1, arg2, arg3, arg4, arg5) {
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
  
  function lowering42(arg0, arg1, arg2, arg3) {
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
  
  function lowering43(arg0, arg1) {
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
  
  function lowering44(arg0, arg1) {
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
  
  function lowering45(arg0, arg1, arg2, arg3, arg4) {
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
  
  function lowering46(arg0, arg1, arg2) {
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
  
  function lowering47(arg0, arg1, arg2) {
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
  
  function lowering48(arg0, arg1) {
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
  
  function lowering49(arg0, arg1, arg2, arg3) {
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
  
  function lowering50(arg0, arg1, arg2, arg3) {
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
  
  function lowering51(arg0, arg1) {
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
  
  function lowering52(arg0, arg1, arg2) {
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
  
  function lowering53(arg0, arg1) {
    const ret = getRandomBytes(BigInt.asUintN(64, arg0));
    const val0 = ret;
    const len0 = val0.byteLength;
    const ptr0 = realloc0(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    dataView(memory0).setInt32(arg1 + 4, len0, true);
    dataView(memory0).setInt32(arg1 + 0, ptr0, true);
  }
  
  function lowering54(arg0) {
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
  
  function lowering55(arg0) {
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
  
  function lowering56(arg0) {
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
  
  function lowering57(arg0) {
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
  
  function lowering58(arg0) {
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
  let exports3;
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    wasi_snapshot_preview1: {
      args_get: exports0['43'],
      args_sizes_get: exports0['44'],
      clock_res_get: exports0['47'],
      clock_time_get: exports0['48'],
      environ_get: exports0['45'],
      environ_sizes_get: exports0['46'],
      fd_advise: exports0['49'],
      fd_allocate: exports0['50'],
      fd_close: exports0['51'],
      fd_datasync: exports0['52'],
      fd_fdstat_get: exports0['53'],
      fd_fdstat_set_flags: exports0['54'],
      fd_fdstat_set_rights: exports0['55'],
      fd_filestat_get: exports0['56'],
      fd_filestat_set_size: exports0['57'],
      fd_filestat_set_times: exports0['58'],
      fd_pread: exports0['59'],
      fd_prestat_dir_name: exports0['61'],
      fd_prestat_get: exports0['60'],
      fd_pwrite: exports0['62'],
      fd_read: exports0['63'],
      fd_readdir: exports0['64'],
      fd_renumber: exports0['65'],
      fd_seek: exports0['66'],
      fd_sync: exports0['67'],
      fd_tell: exports0['68'],
      fd_write: exports0['69'],
      path_create_directory: exports0['70'],
      path_filestat_get: exports0['71'],
      path_filestat_set_times: exports0['72'],
      path_link: exports0['73'],
      path_open: exports0['74'],
      path_readlink: exports0['75'],
      path_remove_directory: exports0['76'],
      path_rename: exports0['77'],
      path_symlink: exports0['78'],
      path_unlink_file: exports0['79'],
      poll_oneoff: exports0['80'],
      proc_exit: exports0['81'],
      proc_raise: exports0['82'],
      random_get: exports0['84'],
      sched_yield: exports0['83'],
      sock_accept: exports0['85'],
      sock_recv: exports0['86'],
      sock_send: exports0['87'],
      sock_shutdown: exports0['88'],
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
      'get-arguments': exports0['39'],
      'get-environment': exports0['38'],
    },
    'wasi:cli/exit': {
      exit: lowering15,
    },
    'wasi:cli/stderr': {
      'get-stderr': lowering14,
    },
    'wasi:cli/stdin': {
      'get-stdin': lowering10,
    },
    'wasi:cli/stdout': {
      'get-stdout': lowering12,
    },
    'wasi:cli/terminal-input': {
      'drop-terminal-input': lowering11,
    },
    'wasi:cli/terminal-output': {
      'drop-terminal-output': lowering13,
    },
    'wasi:cli/terminal-stderr': {
      'get-terminal-stderr': exports0['42'],
    },
    'wasi:cli/terminal-stdin': {
      'get-terminal-stdin': exports0['40'],
    },
    'wasi:cli/terminal-stdout': {
      'get-terminal-stdout': exports0['41'],
    },
    'wasi:clocks/monotonic-clock': {
      now: lowering1,
      resolution: lowering0,
      subscribe: lowering3,
    },
    'wasi:clocks/wall-clock': {
      now: exports0['1'],
      resolution: exports0['2'],
    },
    'wasi:filesystem/preopens': {
      'get-directories': exports0['0'],
    },
    'wasi:filesystem/types': {
      advise: exports0['6'],
      'append-via-stream': exports0['5'],
      'create-directory-at': exports0['16'],
      'drop-descriptor': lowering9,
      'drop-directory-entry-stream': lowering2,
      'get-flags': exports0['8'],
      'get-type': exports0['9'],
      'link-at': exports0['20'],
      'metadata-hash': exports0['28'],
      'metadata-hash-at': exports0['29'],
      'open-at': exports0['21'],
      read: exports0['12'],
      'read-directory': exports0['14'],
      'read-directory-entry': exports0['27'],
      'read-via-stream': exports0['3'],
      'readlink-at': exports0['22'],
      'remove-directory-at': exports0['23'],
      'rename-at': exports0['24'],
      'set-size': exports0['10'],
      'set-times': exports0['11'],
      'set-times-at': exports0['19'],
      stat: exports0['17'],
      'stat-at': exports0['18'],
      'symlink-at': exports0['25'],
      sync: exports0['15'],
      'sync-data': exports0['7'],
      'unlink-file-at': exports0['26'],
      write: exports0['13'],
      'write-via-stream': exports0['4'],
    },
    'wasi:io/streams': {
      'blocking-flush': exports0['35'],
      'blocking-read': exports0['31'],
      'blocking-write-and-flush': exports0['34'],
      'check-write': exports0['32'],
      'drop-input-stream': lowering7,
      'drop-output-stream': lowering8,
      read: exports0['30'],
      'subscribe-to-input-stream': lowering5,
      'subscribe-to-output-stream': lowering4,
      write: exports0['33'],
    },
    'wasi:poll/poll': {
      'drop-pollable': lowering6,
      'poll-oneoff': exports0['36'],
    },
    'wasi:random/random': {
      'get-random-bytes': exports0['37'],
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': lowering16,
      '1': lowering17,
      '10': lowering26,
      '11': lowering27,
      '12': lowering28,
      '13': lowering29,
      '14': lowering30,
      '15': lowering31,
      '16': lowering32,
      '17': lowering33,
      '18': lowering34,
      '19': lowering35,
      '2': lowering18,
      '20': lowering36,
      '21': lowering37,
      '22': lowering38,
      '23': lowering39,
      '24': lowering40,
      '25': lowering41,
      '26': lowering42,
      '27': lowering43,
      '28': lowering44,
      '29': lowering45,
      '3': lowering19,
      '30': lowering46,
      '31': lowering47,
      '32': lowering48,
      '33': lowering49,
      '34': lowering50,
      '35': lowering51,
      '36': lowering52,
      '37': lowering53,
      '38': lowering54,
      '39': lowering55,
      '4': lowering20,
      '40': lowering56,
      '41': lowering57,
      '42': lowering58,
      '43': exports2.args_get,
      '44': exports2.args_sizes_get,
      '45': exports2.environ_get,
      '46': exports2.environ_sizes_get,
      '47': exports2.clock_res_get,
      '48': exports2.clock_time_get,
      '49': exports2.fd_advise,
      '5': lowering21,
      '50': exports2.fd_allocate,
      '51': exports2.fd_close,
      '52': exports2.fd_datasync,
      '53': exports2.fd_fdstat_get,
      '54': exports2.fd_fdstat_set_flags,
      '55': exports2.fd_fdstat_set_rights,
      '56': exports2.fd_filestat_get,
      '57': exports2.fd_filestat_set_size,
      '58': exports2.fd_filestat_set_times,
      '59': exports2.fd_pread,
      '6': lowering22,
      '60': exports2.fd_prestat_get,
      '61': exports2.fd_prestat_dir_name,
      '62': exports2.fd_pwrite,
      '63': exports2.fd_read,
      '64': exports2.fd_readdir,
      '65': exports2.fd_renumber,
      '66': exports2.fd_seek,
      '67': exports2.fd_sync,
      '68': exports2.fd_tell,
      '69': exports2.fd_write,
      '7': lowering23,
      '70': exports2.path_create_directory,
      '71': exports2.path_filestat_get,
      '72': exports2.path_filestat_set_times,
      '73': exports2.path_link,
      '74': exports2.path_open,
      '75': exports2.path_readlink,
      '76': exports2.path_remove_directory,
      '77': exports2.path_rename,
      '78': exports2.path_symlink,
      '79': exports2.path_unlink_file,
      '8': lowering24,
      '80': exports2.poll_oneoff,
      '81': exports2.proc_exit,
      '82': exports2.proc_raise,
      '83': exports2.sched_yield,
      '84': exports2.random_get,
      '85': exports2.sock_accept,
      '86': exports2.sock_recv,
      '87': exports2.sock_send,
      '88': exports2.sock_shutdown,
      '9': lowering25,
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
