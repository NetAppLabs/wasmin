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
  
  let exports0;
  let exports1;
  const interface0 = imports.clocks.clocksMonotonicClock;
  const lowering0Callee = interface0.now;
  function lowering0() {
    const ret = lowering0Callee();
    return toUint64(ret);
  }
  const interface1 = imports.io.ioStreams;
  const lowering1Callee = interface1.subscribeToOutputStream;
  function lowering1(arg0) {
    const ret = lowering1Callee(arg0 >>> 0);
    return toUint32(ret);
  }
  const lowering2Callee = interface1.subscribeToInputStream;
  function lowering2(arg0) {
    const ret = lowering2Callee(arg0 >>> 0);
    return toUint32(ret);
  }
  const lowering3Callee = interface0.subscribe;
  function lowering3(arg0, arg1) {
    const bool0 = arg1;
    const ret = lowering3Callee(BigInt.asUintN(64, arg0), bool0 == 0 ? false : (bool0 == 1 ? true : throwInvalidBool()));
    return toUint32(ret);
  }
  const interface4 = imports.poll.pollPoll;
  const lowering4Callee = interface4.dropPollable;
  function lowering4(arg0) {
    lowering4Callee(arg0 >>> 0);
  }
  const interface5 = imports.filesystem.filesystemFilesystem;
  const lowering5Callee = interface5.dropDescriptor;
  function lowering5(arg0) {
    lowering5Callee(arg0 >>> 0);
  }
  const interface6 = imports['cli-base'].cliBaseExit;
  const lowering6Callee = interface6.exit;
  function lowering6(arg0) {
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
    lowering6Callee(variant0);
  }
  const interface7 = imports['cli-base'].cliBaseStderr;
  const lowering7Callee = interface7.getStderr;
  function lowering7() {
    const ret = lowering7Callee();
    return toUint32(ret);
  }
  const interface8 = imports['cli-base'].cliBaseStdin;
  const lowering8Callee = interface8.getStdin;
  function lowering8() {
    const ret = lowering8Callee();
    return toUint32(ret);
  }
  const interface9 = imports['cli-base'].cliBaseStdout;
  const lowering9Callee = interface9.getStdout;
  function lowering9() {
    const ret = lowering9Callee();
    return toUint32(ret);
  }
  const lowering10Callee = interface1.dropInputStream;
  function lowering10(arg0) {
    lowering10Callee(arg0 >>> 0);
  }
  const lowering11Callee = interface1.dropOutputStream;
  function lowering11(arg0) {
    lowering11Callee(arg0 >>> 0);
  }
  let exports2;
  let memory0;
  const interface12 = imports['nfs-rs-component'].nfsRsComponentWasiExperimentalSockets;
  const lowering12Callee = interface12.addrResolve;
  function lowering12(arg0, arg1, arg2, arg3, arg4) {
    const ptr0 = arg0;
    const len0 = arg1;
    const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
    let variant1;
    switch (arg2) {
      case 0: {
        variant1 = null;
        break;
      }
      case 1: {
        variant1 = clampGuest(arg3, 0, 65535);
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for option');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: lowering12Callee(result0, variant1) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg4 + 0, 0, true);
        dataView(memory0).setInt32(arg4 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg4 + 0, 1, true);
        dataView(memory0).setInt16(arg4 + 4, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  const lowering13Callee = interface12.addrResolveStreamNext;
  function lowering13(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering13Callee(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const variant7 = e;
        if (variant7 === null || variant7=== undefined) {
          dataView(memory0).setInt8(arg1 + 2, 0, true);
        } else {
          const e = variant7;
          dataView(memory0).setInt8(arg1 + 2, 1, true);
          const {tag: v0_0, u: v0_1 } = e;
          const val1 = v0_0;
          let enum1;
          switch (val1) {
            case 'ip4': {
              enum1 = 0;
              break;
            }
            case 'ip6': {
              enum1 = 1;
              break;
            }
            default: {
              if ((v0_0) instanceof Error) {
                console.error(v0_0);
              }
              
              throw new TypeError(`"${val1}" is not one of the cases of addr-type`);
            }
          }
          dataView(memory0).setInt8(arg1 + 4, enum1, true);
          const union6 = v0_1;
          switch (union6.tag) {
            case 0: {
              const e = union6.val;
              dataView(memory0).setInt8(arg1 + 6, 0, true);
              const {addr: v2_0, port: v2_1 } = e;
              const {n0: v3_0, n1: v3_1, h0: v3_2, h1: v3_3 } = v2_0;
              dataView(memory0).setInt8(arg1 + 8, toUint8(v3_0), true);
              dataView(memory0).setInt8(arg1 + 9, toUint8(v3_1), true);
              dataView(memory0).setInt8(arg1 + 10, toUint8(v3_2), true);
              dataView(memory0).setInt8(arg1 + 11, toUint8(v3_3), true);
              dataView(memory0).setInt16(arg1 + 12, toUint16(v2_1), true);
              
              break;
            }
            case 1: {
              const e = union6.val;
              dataView(memory0).setInt8(arg1 + 6, 1, true);
              const {addr: v4_0, port: v4_1 } = e;
              const {n0: v5_0, n1: v5_1, n2: v5_2, n3: v5_3, h0: v5_4, h1: v5_5, h2: v5_6, h3: v5_7 } = v4_0;
              dataView(memory0).setInt16(arg1 + 8, toUint16(v5_0), true);
              dataView(memory0).setInt16(arg1 + 10, toUint16(v5_1), true);
              dataView(memory0).setInt16(arg1 + 12, toUint16(v5_2), true);
              dataView(memory0).setInt16(arg1 + 14, toUint16(v5_3), true);
              dataView(memory0).setInt16(arg1 + 16, toUint16(v5_4), true);
              dataView(memory0).setInt16(arg1 + 18, toUint16(v5_5), true);
              dataView(memory0).setInt16(arg1 + 20, toUint16(v5_6), true);
              dataView(memory0).setInt16(arg1 + 22, toUint16(v5_7), true);
              dataView(memory0).setInt16(arg1 + 24, toUint16(v4_1), true);
              
              break;
            }
            default: {
              throw new TypeError('invalid union specified for AddrU');
            }
          }
        }
        break;
      }
      case 'err': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        dataView(memory0).setInt16(arg1 + 2, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  const lowering14Callee = interface12.addrResolveStreamDispose;
  function lowering14(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering14Callee(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant0 = ret;
    switch (variant0.tag) {
      case 'ok': {
        const e = variant0.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant0.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        dataView(memory0).setInt16(arg1 + 2, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  const lowering15Callee = interface12.sockOpen;
  function lowering15(arg0, arg1, arg2) {
    let enum0;
    switch (arg0) {
      case 0: {
        enum0 = 'inet4';
        break;
      }
      case 1: {
        enum0 = 'inet6';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for AddressFamily');
      }
    }
    let enum1;
    switch (arg1) {
      case 0: {
        enum1 = 'dgram';
        break;
      }
      case 1: {
        enum1 = 'strm';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for SocketType');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: lowering15Callee(enum0, enum1) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        dataView(memory0).setInt32(arg2 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        dataView(memory0).setInt16(arg2 + 4, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  const lowering16Callee = interface12.sockClose;
  function lowering16(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering16Callee(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant0 = ret;
    switch (variant0.tag) {
      case 'ok': {
        const e = variant0.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant0.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        dataView(memory0).setInt16(arg1 + 2, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  const lowering17Callee = interface12.sockConnect;
  function lowering17(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12) {
    let enum0;
    switch (arg1) {
      case 0: {
        enum0 = 'ip4';
        break;
      }
      case 1: {
        enum0 = 'ip6';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for AddrType');
      }
    }
    let union1;
    switch (arg2) {
      case 0: {
        union1= {
          tag: 0,
          val: {
            addr: {
              n0: clampGuest(arg3, 0, 255),
              n1: clampGuest(arg4, 0, 255),
              h0: clampGuest(arg5, 0, 255),
              h1: clampGuest(arg6, 0, 255),
            },
            port: clampGuest(arg7, 0, 65535),
          },
        };
        break;
      }
      case 1: {
        union1= {
          tag: 1,
          val: {
            addr: {
              n0: clampGuest(arg3, 0, 65535),
              n1: clampGuest(arg4, 0, 65535),
              n2: clampGuest(arg5, 0, 65535),
              n3: clampGuest(arg6, 0, 65535),
              h0: clampGuest(arg7, 0, 65535),
              h1: clampGuest(arg8, 0, 65535),
              h2: clampGuest(arg9, 0, 65535),
              h3: clampGuest(arg10, 0, 65535),
            },
            port: clampGuest(arg11, 0, 65535),
          },
        };
        break;
      }
      default: {
        throw new TypeError('invalid union discriminant for AddrU');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: lowering17Callee(arg0 >>> 0, {
        tag: enum0,
        u: union1,
      }) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant2 = ret;
    switch (variant2.tag) {
      case 'ok': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg12 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant2.val;
        dataView(memory0).setInt8(arg12 + 0, 1, true);
        dataView(memory0).setInt16(arg12 + 2, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  const lowering18Callee = interface12.sockAddrRemote;
  function lowering18(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering18Callee(arg0 >>> 0) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        const {tag: v0_0, u: v0_1 } = e;
        const val1 = v0_0;
        let enum1;
        switch (val1) {
          case 'ip4': {
            enum1 = 0;
            break;
          }
          case 'ip6': {
            enum1 = 1;
            break;
          }
          default: {
            if ((v0_0) instanceof Error) {
              console.error(v0_0);
            }
            
            throw new TypeError(`"${val1}" is not one of the cases of addr-type`);
          }
        }
        dataView(memory0).setInt8(arg1 + 2, enum1, true);
        const union6 = v0_1;
        switch (union6.tag) {
          case 0: {
            const e = union6.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            const {addr: v2_0, port: v2_1 } = e;
            const {n0: v3_0, n1: v3_1, h0: v3_2, h1: v3_3 } = v2_0;
            dataView(memory0).setInt8(arg1 + 6, toUint8(v3_0), true);
            dataView(memory0).setInt8(arg1 + 7, toUint8(v3_1), true);
            dataView(memory0).setInt8(arg1 + 8, toUint8(v3_2), true);
            dataView(memory0).setInt8(arg1 + 9, toUint8(v3_3), true);
            dataView(memory0).setInt16(arg1 + 10, toUint16(v2_1), true);
            
            break;
          }
          case 1: {
            const e = union6.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            const {addr: v4_0, port: v4_1 } = e;
            const {n0: v5_0, n1: v5_1, n2: v5_2, n3: v5_3, h0: v5_4, h1: v5_5, h2: v5_6, h3: v5_7 } = v4_0;
            dataView(memory0).setInt16(arg1 + 6, toUint16(v5_0), true);
            dataView(memory0).setInt16(arg1 + 8, toUint16(v5_1), true);
            dataView(memory0).setInt16(arg1 + 10, toUint16(v5_2), true);
            dataView(memory0).setInt16(arg1 + 12, toUint16(v5_3), true);
            dataView(memory0).setInt16(arg1 + 14, toUint16(v5_4), true);
            dataView(memory0).setInt16(arg1 + 16, toUint16(v5_5), true);
            dataView(memory0).setInt16(arg1 + 18, toUint16(v5_6), true);
            dataView(memory0).setInt16(arg1 + 20, toUint16(v5_7), true);
            dataView(memory0).setInt16(arg1 + 22, toUint16(v4_1), true);
            
            break;
          }
          default: {
            throw new TypeError('invalid union specified for AddrU');
          }
        }
        break;
      }
      case 'err': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        dataView(memory0).setInt16(arg1 + 2, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  let realloc0;
  const lowering19Callee = interface12.sockRecv;
  function lowering19(arg0, arg1, arg2, arg3) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering19Callee(arg0 >>> 0, arg1 >>> 0, clampGuest(arg2, 0, 65535)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        const val0 = e;
        const len0 = val0.byteLength;
        const ptr0 = realloc0(0, 0, 1, len0 * 1);
        const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
        (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
        dataView(memory0).setInt32(arg3 + 8, len0, true);
        dataView(memory0).setInt32(arg3 + 4, ptr0, true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        dataView(memory0).setInt16(arg3 + 4, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  const lowering20Callee = interface12.sockSend;
  function lowering20(arg0, arg1, arg2, arg3, arg4, arg5) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: lowering20Callee(arg0 >>> 0, result0, arg3 >>> 0, clampGuest(arg4, 0, 65535)) };
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    const variant1 = ret;
    switch (variant1.tag) {
      case 'ok': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg5 + 0, 0, true);
        dataView(memory0).setInt32(arg5 + 4, toUint32(e), true);
        break;
      }
      case 'err': {
        const e = variant1.val;
        dataView(memory0).setInt8(arg5 + 0, 1, true);
        dataView(memory0).setInt16(arg5 + 4, toUint16(e), true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  let realloc1;
  const interface21 = imports['cli-base'].cliBasePreopens;
  const lowering21Callee = interface21.getDirectories;
  function lowering21(arg0) {
    const ret = lowering21Callee();
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
  const interface22 = imports.clocks.clocksWallClock;
  const lowering22Callee = interface22.now;
  function lowering22(arg0) {
    const ret = lowering22Callee();
    const {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  const lowering23Callee = interface5.readViaStream;
  function lowering23(arg0, arg1, arg2) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering23Callee(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
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
  const lowering24Callee = interface5.writeViaStream;
  function lowering24(arg0, arg1, arg2) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering24Callee(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
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
  const lowering25Callee = interface5.appendViaStream;
  function lowering25(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering25Callee(arg0 >>> 0) };
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
  const lowering26Callee = interface5.getType;
  function lowering26(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering26Callee(arg0 >>> 0) };
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
  const lowering27Callee = interface5.stat;
  function lowering27(arg0, arg1) {
    let ret;
    try {
      ret = { tag: 'ok', val: lowering27Callee(arg0 >>> 0) };
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
  const lowering28Callee = interface1.write;
  function lowering28(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: lowering28Callee(arg0 >>> 0, result0) };
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
  const lowering29Callee = interface1.blockingWrite;
  function lowering29(arg0, arg1, arg2, arg3) {
    const ptr0 = arg1;
    const len0 = arg2;
    const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: lowering29Callee(arg0 >>> 0, result0) };
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
  const lowering30Callee = interface4.pollOneoff;
  function lowering30(arg0, arg1, arg2) {
    const ptr0 = arg0;
    const len0 = arg1;
    const result0 = new Uint32Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 4));
    const ret = lowering30Callee(result0);
    const val1 = ret;
    const len1 = val1.byteLength;
    const ptr1 = realloc1(0, 0, 1, len1 * 1);
    const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
    (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
    dataView(memory0).setInt32(arg2 + 4, len1, true);
    dataView(memory0).setInt32(arg2 + 0, ptr1, true);
  }
  const interface31 = imports.random.randomRandom;
  const lowering31Callee = interface31.getRandomBytes;
  function lowering31(arg0, arg1) {
    const ret = lowering31Callee(BigInt.asUintN(64, arg0));
    const val0 = ret;
    const len0 = val0.byteLength;
    const ptr0 = realloc1(0, 0, 1, len0 * 1);
    const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    dataView(memory0).setInt32(arg1 + 4, len0, true);
    dataView(memory0).setInt32(arg1 + 0, ptr0, true);
  }
  const interface32 = imports['cli-base'].cliBaseEnvironment;
  const lowering32Callee = interface32.getEnvironment;
  function lowering32(arg0) {
    const ret = lowering32Callee();
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
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    'component:nfs-rs-component/wasi-experimental-sockets': {
      'addr-resolve': exports0['0'],
      'addr-resolve-stream-dispose': exports0['2'],
      'addr-resolve-stream-next': exports0['1'],
      'sock-addr-remote': exports0['6'],
      'sock-close': exports0['4'],
      'sock-connect': exports0['5'],
      'sock-open': exports0['3'],
      'sock-recv': exports0['7'],
      'sock-send': exports0['8'],
    },
    wasi_snapshot_preview1: {
      clock_time_get: exports0['22'],
      environ_get: exports0['25'],
      environ_sizes_get: exports0['26'],
      fd_write: exports0['23'],
      poll_oneoff: exports0['24'],
      proc_exit: exports0['27'],
      random_get: exports0['21'],
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
      'get-environment': exports0['20'],
    },
    'wasi:cli-base/exit': {
      exit: lowering6,
    },
    'wasi:cli-base/preopens': {
      'get-directories': exports0['9'],
    },
    'wasi:cli-base/stderr': {
      'get-stderr': lowering7,
    },
    'wasi:cli-base/stdin': {
      'get-stdin': lowering8,
    },
    'wasi:cli-base/stdout': {
      'get-stdout': lowering9,
    },
    'wasi:clocks/monotonic-clock': {
      now: lowering0,
      subscribe: lowering3,
    },
    'wasi:clocks/wall-clock': {
      now: exports0['10'],
    },
    'wasi:filesystem/filesystem': {
      'append-via-stream': exports0['13'],
      'drop-descriptor': lowering5,
      'get-type': exports0['14'],
      'read-via-stream': exports0['11'],
      stat: exports0['15'],
      'write-via-stream': exports0['12'],
    },
    'wasi:io/streams': {
      'blocking-write': exports0['17'],
      'drop-input-stream': lowering10,
      'drop-output-stream': lowering11,
      'subscribe-to-input-stream': lowering2,
      'subscribe-to-output-stream': lowering1,
      write: exports0['16'],
    },
    'wasi:poll/poll': {
      'drop-pollable': lowering4,
      'poll-oneoff': exports0['18'],
    },
    'wasi:random/random': {
      'get-random-bytes': exports0['19'],
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports1.cabi_realloc;
  realloc1 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': lowering12,
      '1': lowering13,
      '10': lowering22,
      '11': lowering23,
      '12': lowering24,
      '13': lowering25,
      '14': lowering26,
      '15': lowering27,
      '16': lowering28,
      '17': lowering29,
      '18': lowering30,
      '19': lowering31,
      '2': lowering14,
      '20': lowering32,
      '21': exports2.random_get,
      '22': exports2.clock_time_get,
      '23': exports2.fd_write,
      '24': exports2.poll_oneoff,
      '25': exports2.environ_get,
      '26': exports2.environ_sizes_get,
      '27': exports2.proc_exit,
      '3': lowering15,
      '4': lowering16,
      '5': lowering17,
      '6': lowering18,
      '7': lowering19,
      '8': lowering20,
      '9': lowering21,
    },
  }));
  postReturn0 = exports1['cabi_post_component:nfs-rs-component/nfs#create'];
  postReturn1 = exports1['cabi_post_component:nfs-rs-component/nfs#create-path'];
  postReturn2 = exports1['cabi_post_component:nfs-rs-component/nfs#symlink'];
  postReturn3 = exports1['cabi_post_component:nfs-rs-component/nfs#symlink-path'];
  postReturn4 = exports1['cabi_post_component:nfs-rs-component/nfs#readlink'];
  postReturn5 = exports1['cabi_post_component:nfs-rs-component/nfs#readlink-path'];
  postReturn6 = exports1['cabi_post_component:nfs-rs-component/nfs#lookup'];
  postReturn7 = exports1['cabi_post_component:nfs-rs-component/nfs#read'];
  postReturn8 = exports1['cabi_post_component:nfs-rs-component/nfs#read-path'];
  postReturn9 = exports1['cabi_post_component:nfs-rs-component/nfs#readdir'];
  postReturn10 = exports1['cabi_post_component:nfs-rs-component/nfs#readdir-path'];
  postReturn11 = exports1['cabi_post_component:nfs-rs-component/nfs#readdirplus'];
  postReturn12 = exports1['cabi_post_component:nfs-rs-component/nfs#readdirplus-path'];
  postReturn13 = exports1['cabi_post_component:nfs-rs-component/nfs#mkdir'];
  postReturn14 = exports1['cabi_post_component:nfs-rs-component/nfs#mkdir-path'];
  const nfsRsComponentNfs = {
    parseUrlAndMount(arg0) {
      const ptr0 = utf8Encode(arg0, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#parse-url-and-mount'](ptr0, len0);
      let variant1;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant1= {
            tag: 'ok',
            val: dataView(memory0).getInt32(ret + 4, true) >>> 0
          };
          break;
        }
        case 1: {
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    null(arg0) {
      const ret = exports1['component:nfs-rs-component/nfs#null'](toUint32(arg0));
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
    },
    access(arg0, arg1, arg2) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ret = exports1['component:nfs-rs-component/nfs#access'](toUint32(arg0), ptr0, len0, toUint32(arg2));
      let variant1;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant1= {
            tag: 'ok',
            val: dataView(memory0).getInt32(ret + 4, true) >>> 0
          };
          break;
        }
        case 1: {
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    accessPath(arg0, arg1, arg2) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#access-path'](toUint32(arg0), ptr0, len0, toUint32(arg2));
      let variant1;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant1= {
            tag: 'ok',
            val: dataView(memory0).getInt32(ret + 4, true) >>> 0
          };
          break;
        }
        case 1: {
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    close(arg0, arg1, arg2) {
      const ret = exports1['component:nfs-rs-component/nfs#close'](toUint32(arg0), toUint32(arg1), toUint64(arg2));
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
    },
    commit(arg0, arg1, arg2, arg3) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ret = exports1['component:nfs-rs-component/nfs#commit'](toUint32(arg0), ptr0, len0, toUint64(arg2), toUint32(arg3));
      let variant1;
      switch (ret) {
        case 0: {
          variant1= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    commitPath(arg0, arg1, arg2, arg3) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#commit-path'](toUint32(arg0), ptr0, len0, toUint64(arg2), toUint32(arg3));
      let variant1;
      switch (ret) {
        case 0: {
          variant1= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    create(arg0, arg1, arg2, arg3) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ptr1 = utf8Encode(arg2, realloc0, memory0);
      const len1 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#create'](toUint32(arg0), ptr0, len0, ptr1, len1, toUint32(arg3));
      let variant3;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr2 = dataView(memory0).getInt32(ret + 4, true);
          const len2 = dataView(memory0).getInt32(ret + 8, true);
          const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
          variant3= {
            tag: 'ok',
            val: result2
          };
          break;
        }
        case 1: {
          variant3= {
            tag: 'err',
            val: undefined
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
    },
    createPath(arg0, arg1, arg2) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#create-path'](toUint32(arg0), ptr0, len0, toUint32(arg2));
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr1 = dataView(memory0).getInt32(ret + 4, true);
          const len1 = dataView(memory0).getInt32(ret + 8, true);
          const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
          variant2= {
            tag: 'ok',
            val: result1
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
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
    },
    delegpurge(arg0, arg1) {
      const ret = exports1['component:nfs-rs-component/nfs#delegpurge'](toUint32(arg0), toUint64(arg1));
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
    },
    delegreturn(arg0, arg1) {
      const ret = exports1['component:nfs-rs-component/nfs#delegreturn'](toUint32(arg0), toUint64(arg1));
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
    },
    getattr(arg0, arg1) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ret = exports1['component:nfs-rs-component/nfs#getattr'](toUint32(arg0), ptr0, len0);
      let variant1;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant1= {
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
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    getattrPath(arg0, arg1) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#getattr-path'](toUint32(arg0), ptr0, len0);
      let variant1;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant1= {
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
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    setattr(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
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
      const ret = exports1['component:nfs-rs-component/nfs#setattr'](ptr0);
      let variant12;
      switch (ret) {
        case 0: {
          variant12= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant12= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant12.tag === 'err') {
        throw new ComponentError(variant12.val);
      }
      return variant12.val;
    },
    setattrPath(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
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
      const ret = exports1['component:nfs-rs-component/nfs#setattr-path'](ptr0);
      let variant10;
      switch (ret) {
        case 0: {
          variant10= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant10= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant10.tag === 'err') {
        throw new ComponentError(variant10.val);
      }
      return variant10.val;
    },
    getfh(arg0) {
      const ret = exports1['component:nfs-rs-component/nfs#getfh'](toUint32(arg0));
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
    },
    link(arg0, arg1, arg2, arg3) {
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
      const ret = exports1['component:nfs-rs-component/nfs#link'](toUint32(arg0), ptr0, len0, ptr1, len1, ptr2, len2);
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
          variant3= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant3.tag === 'err') {
        throw new ComponentError(variant3.val);
      }
      return variant3.val;
    },
    linkPath(arg0, arg1, arg2) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ptr1 = utf8Encode(arg2, realloc0, memory0);
      const len1 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#link-path'](toUint32(arg0), ptr0, len0, ptr1, len1);
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant2= {
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
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    symlink(arg0, arg1, arg2, arg3) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const val1 = arg2;
      const len1 = val1.byteLength;
      const ptr1 = realloc0(0, 0, 1, len1 * 1);
      const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
      (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
      const ptr2 = utf8Encode(arg3, realloc0, memory0);
      const len2 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#symlink'](toUint32(arg0), ptr0, len0, ptr1, len1, ptr2, len2);
      let variant4;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr3 = dataView(memory0).getInt32(ret + 4, true);
          const len3 = dataView(memory0).getInt32(ret + 8, true);
          const result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
          variant4= {
            tag: 'ok',
            val: result3
          };
          break;
        }
        case 1: {
          variant4= {
            tag: 'err',
            val: undefined
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
    },
    symlinkPath(arg0, arg1, arg2) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ptr1 = utf8Encode(arg2, realloc0, memory0);
      const len1 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#symlink-path'](toUint32(arg0), ptr0, len0, ptr1, len1);
      let variant3;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr2 = dataView(memory0).getInt32(ret + 4, true);
          const len2 = dataView(memory0).getInt32(ret + 8, true);
          const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
          variant3= {
            tag: 'ok',
            val: result2
          };
          break;
        }
        case 1: {
          variant3= {
            tag: 'err',
            val: undefined
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
    },
    readlink(arg0, arg1) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ret = exports1['component:nfs-rs-component/nfs#readlink'](toUint32(arg0), ptr0, len0);
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr1 = dataView(memory0).getInt32(ret + 4, true);
          const len1 = dataView(memory0).getInt32(ret + 8, true);
          const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
          variant2= {
            tag: 'ok',
            val: result1
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
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
    },
    readlinkPath(arg0, arg1) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#readlink-path'](toUint32(arg0), ptr0, len0);
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr1 = dataView(memory0).getInt32(ret + 4, true);
          const len1 = dataView(memory0).getInt32(ret + 8, true);
          const result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
          variant2= {
            tag: 'ok',
            val: result1
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn5(ret);
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    lookup(arg0, arg1) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#lookup'](toUint32(arg0), ptr0, len0);
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr1 = dataView(memory0).getInt32(ret + 4, true);
          const len1 = dataView(memory0).getInt32(ret + 8, true);
          const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
          variant2= {
            tag: 'ok',
            val: result1
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn6(ret);
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    pathconf(arg0, arg1) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ret = exports1['component:nfs-rs-component/nfs#pathconf'](toUint32(arg0), ptr0, len0);
      let variant6;
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
          variant6= {
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
          variant6= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant6.tag === 'err') {
        throw new ComponentError(variant6.val);
      }
      return variant6.val;
    },
    pathconfPath(arg0, arg1) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#pathconf-path'](toUint32(arg0), ptr0, len0);
      let variant6;
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
          variant6= {
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
          variant6= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant6.tag === 'err') {
        throw new ComponentError(variant6.val);
      }
      return variant6.val;
    },
    read(arg0, arg1, arg2, arg3) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ret = exports1['component:nfs-rs-component/nfs#read'](toUint32(arg0), ptr0, len0, toUint64(arg2), toUint32(arg3));
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr1 = dataView(memory0).getInt32(ret + 4, true);
          const len1 = dataView(memory0).getInt32(ret + 8, true);
          const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
          variant2= {
            tag: 'ok',
            val: result1
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn7(ret);
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    readPath(arg0, arg1, arg2, arg3) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#read-path'](toUint32(arg0), ptr0, len0, toUint64(arg2), toUint32(arg3));
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr1 = dataView(memory0).getInt32(ret + 4, true);
          const len1 = dataView(memory0).getInt32(ret + 8, true);
          const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
          variant2= {
            tag: 'ok',
            val: result1
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn8(ret);
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    write(arg0, arg1, arg2, arg3) {
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
      const ret = exports1['component:nfs-rs-component/nfs#write'](toUint32(arg0), ptr0, len0, toUint64(arg2), ptr1, len1);
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant2= {
            tag: 'ok',
            val: dataView(memory0).getInt32(ret + 4, true) >>> 0
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    writePath(arg0, arg1, arg2, arg3) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const val1 = arg3;
      const len1 = val1.byteLength;
      const ptr1 = realloc0(0, 0, 1, len1 * 1);
      const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
      (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
      const ret = exports1['component:nfs-rs-component/nfs#write-path'](toUint32(arg0), ptr0, len0, toUint64(arg2), ptr1, len1);
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant2= {
            tag: 'ok',
            val: dataView(memory0).getInt32(ret + 4, true) >>> 0
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    readdir(arg0, arg1) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ret = exports1['component:nfs-rs-component/nfs#readdir'](toUint32(arg0), ptr0, len0);
      let variant3;
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
          variant3= {
            tag: 'ok',
            val: result2
          };
          break;
        }
        case 1: {
          variant3= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn9(ret);
      if (variant3.tag === 'err') {
        throw new ComponentError(variant3.val);
      }
      return variant3.val;
    },
    readdirPath(arg0, arg1) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#readdir-path'](toUint32(arg0), ptr0, len0);
      let variant3;
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
          variant3= {
            tag: 'ok',
            val: result2
          };
          break;
        }
        case 1: {
          variant3= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn10(ret);
      if (variant3.tag === 'err') {
        throw new ComponentError(variant3.val);
      }
      return variant3.val;
    },
    readdirplus(arg0, arg1) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ret = exports1['component:nfs-rs-component/nfs#readdirplus'](toUint32(arg0), ptr0, len0);
      let variant5;
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
          variant5= {
            tag: 'ok',
            val: result4
          };
          break;
        }
        case 1: {
          variant5= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn11(ret);
      if (variant5.tag === 'err') {
        throw new ComponentError(variant5.val);
      }
      return variant5.val;
    },
    readdirplusPath(arg0, arg1) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#readdirplus-path'](toUint32(arg0), ptr0, len0);
      let variant5;
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
          variant5= {
            tag: 'ok',
            val: result4
          };
          break;
        }
        case 1: {
          variant5= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn12(ret);
      if (variant5.tag === 'err') {
        throw new ComponentError(variant5.val);
      }
      return variant5.val;
    },
    mkdir(arg0, arg1, arg2, arg3) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ptr1 = utf8Encode(arg2, realloc0, memory0);
      const len1 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#mkdir'](toUint32(arg0), ptr0, len0, ptr1, len1, toUint32(arg3));
      let variant3;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr2 = dataView(memory0).getInt32(ret + 4, true);
          const len2 = dataView(memory0).getInt32(ret + 8, true);
          const result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
          variant3= {
            tag: 'ok',
            val: result2
          };
          break;
        }
        case 1: {
          variant3= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn13(ret);
      if (variant3.tag === 'err') {
        throw new ComponentError(variant3.val);
      }
      return variant3.val;
    },
    mkdirPath(arg0, arg1, arg2) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#mkdir-path'](toUint32(arg0), ptr0, len0, toUint32(arg2));
      let variant2;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          const ptr1 = dataView(memory0).getInt32(ret + 4, true);
          const len1 = dataView(memory0).getInt32(ret + 8, true);
          const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
          variant2= {
            tag: 'ok',
            val: result1
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      postReturn14(ret);
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    remove(arg0, arg1, arg2) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ptr1 = utf8Encode(arg2, realloc0, memory0);
      const len1 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#remove'](toUint32(arg0), ptr0, len0, ptr1, len1);
      let variant2;
      switch (ret) {
        case 0: {
          variant2= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    removePath(arg0, arg1) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#remove-path'](toUint32(arg0), ptr0, len0);
      let variant1;
      switch (ret) {
        case 0: {
          variant1= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    rmdir(arg0, arg1, arg2) {
      const val0 = arg1;
      const len0 = val0.byteLength;
      const ptr0 = realloc0(0, 0, 1, len0 * 1);
      const src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      const ptr1 = utf8Encode(arg2, realloc0, memory0);
      const len1 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#rmdir'](toUint32(arg0), ptr0, len0, ptr1, len1);
      let variant2;
      switch (ret) {
        case 0: {
          variant2= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    rmdirPath(arg0, arg1) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#rmdir-path'](toUint32(arg0), ptr0, len0);
      let variant1;
      switch (ret) {
        case 0: {
          variant1= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant1= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant1.tag === 'err') {
        throw new ComponentError(variant1.val);
      }
      return variant1.val;
    },
    rename(arg0, arg1, arg2, arg3, arg4) {
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
      const ret = exports1['component:nfs-rs-component/nfs#rename'](toUint32(arg0), ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
      let variant4;
      switch (ret) {
        case 0: {
          variant4= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant4= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant4.tag === 'err') {
        throw new ComponentError(variant4.val);
      }
      return variant4.val;
    },
    renamePath(arg0, arg1, arg2) {
      const ptr0 = utf8Encode(arg1, realloc0, memory0);
      const len0 = utf8EncodedLen;
      const ptr1 = utf8Encode(arg2, realloc0, memory0);
      const len1 = utf8EncodedLen;
      const ret = exports1['component:nfs-rs-component/nfs#rename-path'](toUint32(arg0), ptr0, len0, ptr1, len1);
      let variant2;
      switch (ret) {
        case 0: {
          variant2= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          variant2= {
            tag: 'err',
            val: undefined
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      if (variant2.tag === 'err') {
        throw new ComponentError(variant2.val);
      }
      return variant2.val;
    },
    umount(arg0) {
      const ret = exports1['component:nfs-rs-component/nfs#umount'](toUint32(arg0));
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
    },
    
  };
  
  return { nfs: nfsRsComponentNfs, nfsRsComponentNfs }
  ;
}
