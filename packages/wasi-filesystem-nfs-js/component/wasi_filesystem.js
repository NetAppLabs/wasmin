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

let curResourceBorrows = [];

let dv = new DataView(new ArrayBuffer());
const dataView = mem => dv.buffer === mem.buffer ? dv : dv = new DataView(mem.buffer);

const emptyFunc = () => {};

function finalizationRegistryCreate (unregister) {
  if (typeof FinalizationRegistry === 'undefined') {
    return { unregister () {} };
  }
  return new FinalizationRegistry(unregister);
}

function getErrorPayload(e) {
  if (e && hasOwnProperty.call(e, 'payload')) return e.payload;
  if (e instanceof Error) throw e;
  return e;
}

const handleTables = [];

const hasOwnProperty = Object.prototype.hasOwnProperty;

const T_FLAG = 1 << 30;

function rscTableCreateOwn (table, rep) {
  const free = table[0] & ~T_FLAG;
  if (free === 0) {
    table.push(0);
    table.push(rep | T_FLAG);
    return (table.length >> 1) - 1;
  }
  table[0] = table[free << 1];
  table[free << 1] = 0;
  table[(free << 1) + 1] = rep | T_FLAG;
  return free;
}

function rscTableRemove (table, handle) {
  const scope = table[handle << 1];
  const val = table[(handle << 1) + 1];
  const own = (val & T_FLAG) !== 0;
  const rep = val & ~T_FLAG;
  if (val === 0 || (scope & T_FLAG) !== 0) throw new TypeError('Invalid handle');
  table[handle << 1] = table[0] | T_FLAG;
  table[0] = handle | T_FLAG;
  return { rep, scope, own };
}

const symbolCabiDispose = Symbol.for('cabiDispose');

const symbolRscHandle = Symbol('handle');

const symbolRscRep = Symbol.for('cabiRep');

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
  const module0 = getCoreModule('wasi_filesystem.core.wasm');
  const module1 = getCoreModule('wasi_filesystem.core2.wasm');
  const module2 = getCoreModule('wasi_filesystem.core3.wasm');
  const module3 = getCoreModule('wasi_filesystem.core4.wasm');
  
  const { getArguments, getEnvironment, initialCwd } = imports['wasi:cli/environment'];
  const { exit } = imports['wasi:cli/exit'];
  const { getStderr } = imports['wasi:cli/stderr'];
  const { getStdin } = imports['wasi:cli/stdin'];
  const { getStdout } = imports['wasi:cli/stdout'];
  const { now, subscribeDuration, subscribeInstant } = imports['wasi:clocks/monotonic-clock'];
  const { now: now$1, resolution } = imports['wasi:clocks/wall-clock'];
  const { getDirectories } = imports['wasi:filesystem/preopens'];
  const { Descriptor, filesystemErrorCode } = imports['wasi:filesystem/types'];
  const { Error: Error$1 } = imports['wasi:io/error'];
  const { Pollable, poll } = imports['wasi:io/poll'];
  const { InputStream, OutputStream } = imports['wasi:io/streams'];
  const { getRandomBytes } = imports['wasi:random/random'];
  const { instanceNetwork } = imports['wasi:sockets/instance-network'];
  const { ResolveAddressStream, resolveAddresses } = imports['wasi:sockets/ip-name-lookup'];
  const { Network } = imports['wasi:sockets/network'];
  const { TcpSocket } = imports['wasi:sockets/tcp'];
  const { createTcpSocket } = imports['wasi:sockets/tcp-create-socket'];
  let exports0;
  const handleTable2 = [T_FLAG, 0];
  const captureTable2= new Map();
  let captureCnt2 = 0;
  handleTables[2] = handleTable2;
  
  function trampoline12() {
    const ret = getStdin();
    if (!(ret instanceof InputStream)) {
      throw new TypeError('Resource error: Not a valid "InputStream" resource.');
    }
    var handle0 = ret[symbolRscHandle];
    if (!handle0) {
      const rep = ret[symbolRscRep] || ++captureCnt2;
      captureTable2.set(rep, ret);
      handle0 = rscTableCreateOwn(handleTable2, rep);
    }
    return handle0;
  }
  const handleTable3 = [T_FLAG, 0];
  const captureTable3= new Map();
  let captureCnt3 = 0;
  handleTables[3] = handleTable3;
  
  function trampoline15() {
    const ret = getStdout();
    if (!(ret instanceof OutputStream)) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = ret[symbolRscHandle];
    if (!handle0) {
      const rep = ret[symbolRscRep] || ++captureCnt3;
      captureTable3.set(rep, ret);
      handle0 = rscTableCreateOwn(handleTable3, rep);
    }
    return handle0;
  }
  
  function trampoline16() {
    const ret = getStderr();
    if (!(ret instanceof OutputStream)) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = ret[symbolRscHandle];
    if (!handle0) {
      const rep = ret[symbolRscRep] || ++captureCnt3;
      captureTable3.set(rep, ret);
      handle0 = rscTableCreateOwn(handleTable3, rep);
    }
    return handle0;
  }
  
  function trampoline21(arg0) {
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
  const handleTable4 = [T_FLAG, 0];
  const captureTable4= new Map();
  let captureCnt4 = 0;
  handleTables[4] = handleTable4;
  
  function trampoline27() {
    const ret = instanceNetwork();
    if (!(ret instanceof Network)) {
      throw new TypeError('Resource error: Not a valid "Network" resource.');
    }
    var handle0 = ret[symbolRscHandle];
    if (!handle0) {
      const rep = ret[symbolRscRep] || ++captureCnt4;
      captureTable4.set(rep, ret);
      handle0 = rscTableCreateOwn(handleTable4, rep);
    }
    return handle0;
  }
  let exports1;
  
  function trampoline28() {
    const ret = now();
    return toUint64(ret);
  }
  const handleTable1 = [T_FLAG, 0];
  const captureTable1= new Map();
  let captureCnt1 = 0;
  handleTables[1] = handleTable1;
  
  function trampoline30(arg0) {
    const ret = subscribeDuration(BigInt.asUintN(64, arg0));
    if (!(ret instanceof Pollable)) {
      throw new TypeError('Resource error: Not a valid "Pollable" resource.');
    }
    var handle0 = ret[symbolRscHandle];
    if (!handle0) {
      const rep = ret[symbolRscRep] || ++captureCnt1;
      captureTable1.set(rep, ret);
      handle0 = rscTableCreateOwn(handleTable1, rep);
    }
    return handle0;
  }
  
  function trampoline31(arg0) {
    const ret = subscribeInstant(BigInt.asUintN(64, arg0));
    if (!(ret instanceof Pollable)) {
      throw new TypeError('Resource error: Not a valid "Pollable" resource.');
    }
    var handle0 = ret[symbolRscHandle];
    if (!handle0) {
      const rep = ret[symbolRscRep] || ++captureCnt1;
      captureTable1.set(rep, ret);
      handle0 = rscTableCreateOwn(handleTable1, rep);
    }
    return handle0;
  }
  
  function trampoline32(arg0) {
    var handle1 = arg0;
    var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable3.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(OutputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    const ret = rsc0.subscribe();
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    if (!(ret instanceof Pollable)) {
      throw new TypeError('Resource error: Not a valid "Pollable" resource.');
    }
    var handle3 = ret[symbolRscHandle];
    if (!handle3) {
      const rep = ret[symbolRscRep] || ++captureCnt1;
      captureTable1.set(rep, ret);
      handle3 = rscTableCreateOwn(handleTable1, rep);
    }
    return handle3;
  }
  
  function trampoline33(arg0) {
    var handle1 = arg0;
    var rep2 = handleTable2[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable2.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(InputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    const ret = rsc0.subscribe();
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    if (!(ret instanceof Pollable)) {
      throw new TypeError('Resource error: Not a valid "Pollable" resource.');
    }
    var handle3 = ret[symbolRscHandle];
    if (!handle3) {
      const rep = ret[symbolRscRep] || ++captureCnt1;
      captureTable1.set(rep, ret);
      handle3 = rscTableCreateOwn(handleTable1, rep);
    }
    return handle3;
  }
  let exports2;
  let memory0;
  let realloc0;
  let realloc1;
  const handleTable0 = [T_FLAG, 0];
  const captureTable0= new Map();
  let captureCnt0 = 0;
  handleTables[0] = handleTable0;
  
  function trampoline35(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable2[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable2.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(InputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.read(BigInt.asUintN(64, arg1))};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        var val3 = e;
        var len3 = val3.byteLength;
        var ptr3 = realloc0(0, 0, 1, len3 * 1);
        var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
        (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
        dataView(memory0).setInt32(arg2 + 8, len3, true);
        dataView(memory0).setInt32(arg2 + 4, ptr3, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var variant5 = e;
        switch (variant5.tag) {
          case 'last-operation-failed': {
            const e = variant5.val;
            dataView(memory0).setInt8(arg2 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle4 = e[symbolRscHandle];
            if (!handle4) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle4 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg2 + 8, handle4, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg2 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline36(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable2[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable2.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(InputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.blockingRead(BigInt.asUintN(64, arg1))};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        var val3 = e;
        var len3 = val3.byteLength;
        var ptr3 = realloc0(0, 0, 1, len3 * 1);
        var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
        (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
        dataView(memory0).setInt32(arg2 + 8, len3, true);
        dataView(memory0).setInt32(arg2 + 4, ptr3, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var variant5 = e;
        switch (variant5.tag) {
          case 'last-operation-failed': {
            const e = variant5.val;
            dataView(memory0).setInt8(arg2 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle4 = e[symbolRscHandle];
            if (!handle4) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle4 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg2 + 8, handle4, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg2 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline37(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable2[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable2.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(InputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.skip(BigInt.asUintN(64, arg1))};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        dataView(memory0).setBigInt64(arg2 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg2 + 8, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = e[symbolRscHandle];
            if (!handle3) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle3 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg2 + 12, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg2 + 8, 1, true);
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
  
  function trampoline38(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable2[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable2.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(InputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.blockingSkip(BigInt.asUintN(64, arg1))};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        dataView(memory0).setBigInt64(arg2 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg2 + 8, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = e[symbolRscHandle];
            if (!handle3) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle3 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg2 + 12, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg2 + 8, 1, true);
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
  
  function trampoline39(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable3.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(OutputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.checkWrite()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        dataView(memory0).setBigInt64(arg1 + 8, toUint64(e), true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 8, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = e[symbolRscHandle];
            if (!handle3) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle3 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg1 + 12, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg1 + 8, 1, true);
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
  
  function trampoline40(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable3.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(OutputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    var ptr3 = arg1;
    var len3 = arg2;
    var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.write(result3)};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var variant5 = e;
        switch (variant5.tag) {
          case 'last-operation-failed': {
            const e = variant5.val;
            dataView(memory0).setInt8(arg3 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle4 = e[symbolRscHandle];
            if (!handle4) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle4 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg3 + 8, handle4, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg3 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline41(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable3.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(OutputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    var ptr3 = arg1;
    var len3 = arg2;
    var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.blockingWriteAndFlush(result3)};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
        var variant5 = e;
        switch (variant5.tag) {
          case 'last-operation-failed': {
            const e = variant5.val;
            dataView(memory0).setInt8(arg3 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle4 = e[symbolRscHandle];
            if (!handle4) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle4 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg3 + 8, handle4, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg3 + 4, 1, true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`StreamError\``);
          }
        }
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline42(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable3.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(OutputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.flush()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = e[symbolRscHandle];
            if (!handle3) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle3 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg1 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg1 + 4, 1, true);
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
  
  function trampoline43(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable3.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(OutputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.blockingFlush()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var variant4 = e;
        switch (variant4.tag) {
          case 'last-operation-failed': {
            const e = variant4.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = e[symbolRscHandle];
            if (!handle3) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle3 = rscTableCreateOwn(handleTable0, rep);
            }
            dataView(memory0).setInt32(arg1 + 8, handle3, true);
            break;
          }
          case 'closed': {
            dataView(memory0).setInt8(arg1 + 4, 1, true);
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
  
  function trampoline44(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable3.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(OutputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.writeZeroes(BigInt.asUintN(64, arg1))};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
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
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = e[symbolRscHandle];
            if (!handle3) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle3 = rscTableCreateOwn(handleTable0, rep);
            }
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
  
  function trampoline45(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable3[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable3.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(OutputStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.blockingWriteZeroesAndFlush(BigInt.asUintN(64, arg1))};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
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
            if (!(e instanceof Error$1)) {
              throw new TypeError('Resource error: Not a valid "Error" resource.');
            }
            var handle3 = e[symbolRscHandle];
            if (!handle3) {
              const rep = e[symbolRscRep] || ++captureCnt0;
              captureTable0.set(rep, e);
              handle3 = rscTableCreateOwn(handleTable0, rep);
            }
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
  
  function trampoline46(arg0) {
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
  
  function trampoline47(arg0) {
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
  
  function trampoline48(arg0) {
    const ret = initialCwd();
    var variant1 = ret;
    if (variant1 === null || variant1=== undefined) {
      dataView(memory0).setInt8(arg0 + 0, 0, true);
    } else {
      const e = variant1;
      dataView(memory0).setInt8(arg0 + 0, 1, true);
      var ptr0 = utf8Encode(e, realloc0, memory0);
      var len0 = utf8EncodedLen;
      dataView(memory0).setInt32(arg0 + 8, len0, true);
      dataView(memory0).setInt32(arg0 + 4, ptr0, true);
    }
  }
  
  function trampoline49(arg0) {
    const ret = now$1();
    var {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  
  function trampoline50(arg0) {
    const ret = resolution();
    var {seconds: v0_0, nanoseconds: v0_1 } = ret;
    dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
    dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
  }
  const handleTable5 = [T_FLAG, 0];
  const captureTable5= new Map();
  let captureCnt5 = 0;
  handleTables[5] = handleTable5;
  
  function trampoline51(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable5[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable5.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(ResolveAddressStream.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.resolveNextAddress()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var variant6 = e;
        if (variant6 === null || variant6=== undefined) {
          dataView(memory0).setInt8(arg1 + 2, 0, true);
        } else {
          const e = variant6;
          dataView(memory0).setInt8(arg1 + 2, 1, true);
          var variant5 = e;
          switch (variant5.tag) {
            case 'ipv4': {
              const e = variant5.val;
              dataView(memory0).setInt8(arg1 + 4, 0, true);
              var [tuple3_0, tuple3_1, tuple3_2, tuple3_3] = e;
              dataView(memory0).setInt8(arg1 + 6, toUint8(tuple3_0), true);
              dataView(memory0).setInt8(arg1 + 7, toUint8(tuple3_1), true);
              dataView(memory0).setInt8(arg1 + 8, toUint8(tuple3_2), true);
              dataView(memory0).setInt8(arg1 + 9, toUint8(tuple3_3), true);
              break;
            }
            case 'ipv6': {
              const e = variant5.val;
              dataView(memory0).setInt8(arg1 + 4, 1, true);
              var [tuple4_0, tuple4_1, tuple4_2, tuple4_3, tuple4_4, tuple4_5, tuple4_6, tuple4_7] = e;
              dataView(memory0).setInt16(arg1 + 6, toUint16(tuple4_0), true);
              dataView(memory0).setInt16(arg1 + 8, toUint16(tuple4_1), true);
              dataView(memory0).setInt16(arg1 + 10, toUint16(tuple4_2), true);
              dataView(memory0).setInt16(arg1 + 12, toUint16(tuple4_3), true);
              dataView(memory0).setInt16(arg1 + 14, toUint16(tuple4_4), true);
              dataView(memory0).setInt16(arg1 + 16, toUint16(tuple4_5), true);
              dataView(memory0).setInt16(arg1 + 18, toUint16(tuple4_6), true);
              dataView(memory0).setInt16(arg1 + 20, toUint16(tuple4_7), true);
              break;
            }
            default: {
              throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`IpAddress\``);
            }
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
        dataView(memory0).setInt8(arg1 + 2, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline52(arg0, arg1, arg2, arg3) {
    var handle1 = arg0;
    var rep2 = handleTable4[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable4.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(Network.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    var ptr3 = arg1;
    var len3 = arg2;
    var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
    let ret;
    try {
      ret = { tag: 'ok', val: resolveAddresses(rsc0, result3)};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant6 = ret;
    switch (variant6.tag) {
      case 'ok': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg3 + 0, 0, true);
        if (!(e instanceof ResolveAddressStream)) {
          throw new TypeError('Resource error: Not a valid "ResolveAddressStream" resource.');
        }
        var handle4 = e[symbolRscHandle];
        if (!handle4) {
          const rep = e[symbolRscRep] || ++captureCnt5;
          captureTable5.set(rep, e);
          handle4 = rscTableCreateOwn(handleTable5, rep);
        }
        dataView(memory0).setInt32(arg3 + 4, handle4, true);
        break;
      }
      case 'err': {
        const e = variant6.val;
        dataView(memory0).setInt8(arg3 + 0, 1, true);
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
        dataView(memory0).setInt8(arg3 + 4, enum5, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  const handleTable6 = [T_FLAG, 0];
  const captureTable6= new Map();
  let captureCnt6 = 0;
  handleTables[6] = handleTable6;
  
  function trampoline53(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
    var handle1 = arg0;
    var rep2 = handleTable6[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable6.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(TcpSocket.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    var handle4 = arg1;
    var rep5 = handleTable4[(handle4 << 1) + 1] & ~T_FLAG;
    var rsc3 = captureTable4.get(rep5);
    if (!rsc3) {
      rsc3 = Object.create(Network.prototype);
      Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
      Object.defineProperty(rsc3, symbolRscRep, { writable: true, value: rep5});
    }
    curResourceBorrows.push(rsc3);
    let variant6;
    switch (arg2) {
      case 0: {
        variant6= {
          tag: 'ipv4',
          val: {
            port: clampGuest(arg3, 0, 65535),
            address: [clampGuest(arg4, 0, 255), clampGuest(arg5, 0, 255), clampGuest(arg6, 0, 255), clampGuest(arg7, 0, 255)],
          }
        };
        break;
      }
      case 1: {
        variant6= {
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
      ret = { tag: 'ok', val: rsc0.startConnect(rsc3, variant6)};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant8 = ret;
    switch (variant8.tag) {
      case 'ok': {
        const e = variant8.val;
        dataView(memory0).setInt8(arg14 + 0, 0, true);
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
        dataView(memory0).setInt8(arg14 + 1, enum7, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline54(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable6[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable6.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(TcpSocket.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.finishConnect()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant7 = ret;
    switch (variant7.tag) {
      case 'ok': {
        const e = variant7.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var [tuple3_0, tuple3_1] = e;
        if (!(tuple3_0 instanceof InputStream)) {
          throw new TypeError('Resource error: Not a valid "InputStream" resource.');
        }
        var handle4 = tuple3_0[symbolRscHandle];
        if (!handle4) {
          const rep = tuple3_0[symbolRscRep] || ++captureCnt2;
          captureTable2.set(rep, tuple3_0);
          handle4 = rscTableCreateOwn(handleTable2, rep);
        }
        dataView(memory0).setInt32(arg1 + 4, handle4, true);
        if (!(tuple3_1 instanceof OutputStream)) {
          throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
        }
        var handle5 = tuple3_1[symbolRscHandle];
        if (!handle5) {
          const rep = tuple3_1[symbolRscRep] || ++captureCnt3;
          captureTable3.set(rep, tuple3_1);
          handle5 = rscTableCreateOwn(handleTable3, rep);
        }
        dataView(memory0).setInt32(arg1 + 8, handle5, true);
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
  
  function trampoline55(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable6[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable6.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(TcpSocket.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.remoteAddress()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant9 = ret;
    switch (variant9.tag) {
      case 'ok': {
        const e = variant9.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var variant7 = e;
        switch (variant7.tag) {
          case 'ipv4': {
            const e = variant7.val;
            dataView(memory0).setInt8(arg1 + 4, 0, true);
            var {port: v3_0, address: v3_1 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v3_0), true);
            var [tuple4_0, tuple4_1, tuple4_2, tuple4_3] = v3_1;
            dataView(memory0).setInt8(arg1 + 10, toUint8(tuple4_0), true);
            dataView(memory0).setInt8(arg1 + 11, toUint8(tuple4_1), true);
            dataView(memory0).setInt8(arg1 + 12, toUint8(tuple4_2), true);
            dataView(memory0).setInt8(arg1 + 13, toUint8(tuple4_3), true);
            break;
          }
          case 'ipv6': {
            const e = variant7.val;
            dataView(memory0).setInt8(arg1 + 4, 1, true);
            var {port: v5_0, flowInfo: v5_1, address: v5_2, scopeId: v5_3 } = e;
            dataView(memory0).setInt16(arg1 + 8, toUint16(v5_0), true);
            dataView(memory0).setInt32(arg1 + 12, toUint32(v5_1), true);
            var [tuple6_0, tuple6_1, tuple6_2, tuple6_3, tuple6_4, tuple6_5, tuple6_6, tuple6_7] = v5_2;
            dataView(memory0).setInt16(arg1 + 16, toUint16(tuple6_0), true);
            dataView(memory0).setInt16(arg1 + 18, toUint16(tuple6_1), true);
            dataView(memory0).setInt16(arg1 + 20, toUint16(tuple6_2), true);
            dataView(memory0).setInt16(arg1 + 22, toUint16(tuple6_3), true);
            dataView(memory0).setInt16(arg1 + 24, toUint16(tuple6_4), true);
            dataView(memory0).setInt16(arg1 + 26, toUint16(tuple6_5), true);
            dataView(memory0).setInt16(arg1 + 28, toUint16(tuple6_6), true);
            dataView(memory0).setInt16(arg1 + 30, toUint16(tuple6_7), true);
            dataView(memory0).setInt32(arg1 + 32, toUint32(v5_3), true);
            break;
          }
          default: {
            throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant7.tag)}\` (received \`${variant7}\`) specified for \`IpSocketAddress\``);
          }
        }
        break;
      }
      case 'err': {
        const e = variant9.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val8 = e;
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
          case 'invalid-argument': {
            enum8 = 3;
            break;
          }
          case 'out-of-memory': {
            enum8 = 4;
            break;
          }
          case 'timeout': {
            enum8 = 5;
            break;
          }
          case 'concurrency-conflict': {
            enum8 = 6;
            break;
          }
          case 'not-in-progress': {
            enum8 = 7;
            break;
          }
          case 'would-block': {
            enum8 = 8;
            break;
          }
          case 'invalid-state': {
            enum8 = 9;
            break;
          }
          case 'new-socket-limit': {
            enum8 = 10;
            break;
          }
          case 'address-not-bindable': {
            enum8 = 11;
            break;
          }
          case 'address-in-use': {
            enum8 = 12;
            break;
          }
          case 'remote-unreachable': {
            enum8 = 13;
            break;
          }
          case 'connection-refused': {
            enum8 = 14;
            break;
          }
          case 'connection-reset': {
            enum8 = 15;
            break;
          }
          case 'connection-aborted': {
            enum8 = 16;
            break;
          }
          case 'datagram-too-large': {
            enum8 = 17;
            break;
          }
          case 'name-unresolvable': {
            enum8 = 18;
            break;
          }
          case 'temporary-resolver-failure': {
            enum8 = 19;
            break;
          }
          case 'permanent-resolver-failure': {
            enum8 = 20;
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
  
  function trampoline56(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable6[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable6.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(TcpSocket.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let enum3;
    switch (arg1) {
      case 0: {
        enum3 = 'receive';
        break;
      }
      case 1: {
        enum3 = 'send';
        break;
      }
      case 2: {
        enum3 = 'both';
        break;
      }
      default: {
        throw new TypeError('invalid discriminant specified for ShutdownType');
      }
    }
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.shutdown(enum3)};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
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
        dataView(memory0).setInt8(arg2 + 1, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline57(arg0, arg1) {
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
      ret = { tag: 'ok', val: createTcpSocket(enum0)};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    var variant3 = ret;
    switch (variant3.tag) {
      case 'ok': {
        const e = variant3.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof TcpSocket)) {
          throw new TypeError('Resource error: Not a valid "TcpSocket" resource.');
        }
        var handle1 = e[symbolRscHandle];
        if (!handle1) {
          const rep = e[symbolRscRep] || ++captureCnt6;
          captureTable6.set(rep, e);
          handle1 = rscTableCreateOwn(handleTable6, rep);
        }
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
  const handleTable7 = [T_FLAG, 0];
  const captureTable7= new Map();
  let captureCnt7 = 0;
  handleTables[7] = handleTable7;
  
  function trampoline58(arg0) {
    const ret = getDirectories();
    var vec3 = ret;
    var len3 = vec3.length;
    var result3 = realloc1(0, 0, 4, len3 * 12);
    for (let i = 0; i < vec3.length; i++) {
      const e = vec3[i];
      const base = result3 + i * 12;var [tuple0_0, tuple0_1] = e;
      if (!(tuple0_0 instanceof Descriptor)) {
        throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
      }
      var handle1 = tuple0_0[symbolRscHandle];
      if (!handle1) {
        const rep = tuple0_0[symbolRscRep] || ++captureCnt7;
        captureTable7.set(rep, tuple0_0);
        handle1 = rscTableCreateOwn(handleTable7, rep);
      }
      dataView(memory0).setInt32(base + 0, handle1, true);
      var ptr2 = utf8Encode(tuple0_1, realloc1, memory0);
      var len2 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 8, len2, true);
      dataView(memory0).setInt32(base + 4, ptr2, true);
    }
    dataView(memory0).setInt32(arg0 + 4, len3, true);
    dataView(memory0).setInt32(arg0 + 0, result3, true);
  }
  
  function trampoline59(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable7[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable7.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(Descriptor.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.readViaStream(BigInt.asUintN(64, arg1))};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        if (!(e instanceof InputStream)) {
          throw new TypeError('Resource error: Not a valid "InputStream" resource.');
        }
        var handle3 = e[symbolRscHandle];
        if (!handle3) {
          const rep = e[symbolRscRep] || ++captureCnt2;
          captureTable2.set(rep, e);
          handle3 = rscTableCreateOwn(handleTable2, rep);
        }
        dataView(memory0).setInt32(arg2 + 4, handle3, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
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
        dataView(memory0).setInt8(arg2 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline60(arg0, arg1, arg2) {
    var handle1 = arg0;
    var rep2 = handleTable7[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable7.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(Descriptor.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.writeViaStream(BigInt.asUintN(64, arg1))};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 0, true);
        if (!(e instanceof OutputStream)) {
          throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
        }
        var handle3 = e[symbolRscHandle];
        if (!handle3) {
          const rep = e[symbolRscRep] || ++captureCnt3;
          captureTable3.set(rep, e);
          handle3 = rscTableCreateOwn(handleTable3, rep);
        }
        dataView(memory0).setInt32(arg2 + 4, handle3, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg2 + 0, 1, true);
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
        dataView(memory0).setInt8(arg2 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline61(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable7[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable7.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(Descriptor.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.appendViaStream()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        if (!(e instanceof OutputStream)) {
          throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
        }
        var handle3 = e[symbolRscHandle];
        if (!handle3) {
          const rep = e[symbolRscRep] || ++captureCnt3;
          captureTable3.set(rep, e);
          handle3 = rscTableCreateOwn(handleTable3, rep);
        }
        dataView(memory0).setInt32(arg1 + 4, handle3, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
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
        dataView(memory0).setInt8(arg1 + 4, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline62(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable7[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable7.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(Descriptor.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.getType()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant5 = ret;
    switch (variant5.tag) {
      case 'ok': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var val3 = e;
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
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val3}" is not one of the cases of descriptor-type`);
          }
        }
        dataView(memory0).setInt8(arg1 + 1, enum3, true);
        break;
      }
      case 'err': {
        const e = variant5.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
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
        dataView(memory0).setInt8(arg1 + 1, enum4, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline63(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable7[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable7.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(Descriptor.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    let ret;
    try {
      ret = { tag: 'ok', val: rsc0.stat()};
    } catch (e) {
      ret = { tag: 'err', val: getErrorPayload(e) };
    }
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant12 = ret;
    switch (variant12.tag) {
      case 'ok': {
        const e = variant12.val;
        dataView(memory0).setInt8(arg1 + 0, 0, true);
        var {type: v3_0, linkCount: v3_1, size: v3_2, dataAccessTimestamp: v3_3, dataModificationTimestamp: v3_4, statusChangeTimestamp: v3_5 } = e;
        var val4 = v3_0;
        let enum4;
        switch (val4) {
          case 'unknown': {
            enum4 = 0;
            break;
          }
          case 'block-device': {
            enum4 = 1;
            break;
          }
          case 'character-device': {
            enum4 = 2;
            break;
          }
          case 'directory': {
            enum4 = 3;
            break;
          }
          case 'fifo': {
            enum4 = 4;
            break;
          }
          case 'symbolic-link': {
            enum4 = 5;
            break;
          }
          case 'regular-file': {
            enum4 = 6;
            break;
          }
          case 'socket': {
            enum4 = 7;
            break;
          }
          default: {
            if ((v3_0) instanceof Error) {
              console.error(v3_0);
            }
            
            throw new TypeError(`"${val4}" is not one of the cases of descriptor-type`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum4, true);
        dataView(memory0).setBigInt64(arg1 + 16, toUint64(v3_1), true);
        dataView(memory0).setBigInt64(arg1 + 24, toUint64(v3_2), true);
        var variant6 = v3_3;
        if (variant6 === null || variant6=== undefined) {
          dataView(memory0).setInt8(arg1 + 32, 0, true);
        } else {
          const e = variant6;
          dataView(memory0).setInt8(arg1 + 32, 1, true);
          var {seconds: v5_0, nanoseconds: v5_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 40, toUint64(v5_0), true);
          dataView(memory0).setInt32(arg1 + 48, toUint32(v5_1), true);
        }
        var variant8 = v3_4;
        if (variant8 === null || variant8=== undefined) {
          dataView(memory0).setInt8(arg1 + 56, 0, true);
        } else {
          const e = variant8;
          dataView(memory0).setInt8(arg1 + 56, 1, true);
          var {seconds: v7_0, nanoseconds: v7_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 64, toUint64(v7_0), true);
          dataView(memory0).setInt32(arg1 + 72, toUint32(v7_1), true);
        }
        var variant10 = v3_5;
        if (variant10 === null || variant10=== undefined) {
          dataView(memory0).setInt8(arg1 + 80, 0, true);
        } else {
          const e = variant10;
          dataView(memory0).setInt8(arg1 + 80, 1, true);
          var {seconds: v9_0, nanoseconds: v9_1 } = e;
          dataView(memory0).setBigInt64(arg1 + 88, toUint64(v9_0), true);
          dataView(memory0).setInt32(arg1 + 96, toUint32(v9_1), true);
        }
        break;
      }
      case 'err': {
        const e = variant12.val;
        dataView(memory0).setInt8(arg1 + 0, 1, true);
        var val11 = e;
        let enum11;
        switch (val11) {
          case 'access': {
            enum11 = 0;
            break;
          }
          case 'would-block': {
            enum11 = 1;
            break;
          }
          case 'already': {
            enum11 = 2;
            break;
          }
          case 'bad-descriptor': {
            enum11 = 3;
            break;
          }
          case 'busy': {
            enum11 = 4;
            break;
          }
          case 'deadlock': {
            enum11 = 5;
            break;
          }
          case 'quota': {
            enum11 = 6;
            break;
          }
          case 'exist': {
            enum11 = 7;
            break;
          }
          case 'file-too-large': {
            enum11 = 8;
            break;
          }
          case 'illegal-byte-sequence': {
            enum11 = 9;
            break;
          }
          case 'in-progress': {
            enum11 = 10;
            break;
          }
          case 'interrupted': {
            enum11 = 11;
            break;
          }
          case 'invalid': {
            enum11 = 12;
            break;
          }
          case 'io': {
            enum11 = 13;
            break;
          }
          case 'is-directory': {
            enum11 = 14;
            break;
          }
          case 'loop': {
            enum11 = 15;
            break;
          }
          case 'too-many-links': {
            enum11 = 16;
            break;
          }
          case 'message-size': {
            enum11 = 17;
            break;
          }
          case 'name-too-long': {
            enum11 = 18;
            break;
          }
          case 'no-device': {
            enum11 = 19;
            break;
          }
          case 'no-entry': {
            enum11 = 20;
            break;
          }
          case 'no-lock': {
            enum11 = 21;
            break;
          }
          case 'insufficient-memory': {
            enum11 = 22;
            break;
          }
          case 'insufficient-space': {
            enum11 = 23;
            break;
          }
          case 'not-directory': {
            enum11 = 24;
            break;
          }
          case 'not-empty': {
            enum11 = 25;
            break;
          }
          case 'not-recoverable': {
            enum11 = 26;
            break;
          }
          case 'unsupported': {
            enum11 = 27;
            break;
          }
          case 'no-tty': {
            enum11 = 28;
            break;
          }
          case 'no-such-device': {
            enum11 = 29;
            break;
          }
          case 'overflow': {
            enum11 = 30;
            break;
          }
          case 'not-permitted': {
            enum11 = 31;
            break;
          }
          case 'pipe': {
            enum11 = 32;
            break;
          }
          case 'read-only': {
            enum11 = 33;
            break;
          }
          case 'invalid-seek': {
            enum11 = 34;
            break;
          }
          case 'text-file-busy': {
            enum11 = 35;
            break;
          }
          case 'cross-device': {
            enum11 = 36;
            break;
          }
          default: {
            if ((e) instanceof Error) {
              console.error(e);
            }
            
            throw new TypeError(`"${val11}" is not one of the cases of error-code`);
          }
        }
        dataView(memory0).setInt8(arg1 + 8, enum11, true);
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
  }
  
  function trampoline64(arg0, arg1) {
    var handle1 = arg0;
    var rep2 = handleTable0[(handle1 << 1) + 1] & ~T_FLAG;
    var rsc0 = captureTable0.get(rep2);
    if (!rsc0) {
      rsc0 = Object.create(Error$1.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
    }
    curResourceBorrows.push(rsc0);
    const ret = filesystemErrorCode(rsc0);
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var variant4 = ret;
    if (variant4 === null || variant4=== undefined) {
      dataView(memory0).setInt8(arg1 + 0, 0, true);
    } else {
      const e = variant4;
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
    }
  }
  
  function trampoline65(arg0, arg1, arg2) {
    var len3 = arg1;
    var base3 = arg0;
    var result3 = [];
    for (let i = 0; i < len3; i++) {
      const base = base3 + i * 4;
      var handle1 = dataView(memory0).getInt32(base + 0, true);
      var rep2 = handleTable1[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable1.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Pollable.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      result3.push(rsc0);
    }
    const ret = poll(result3);
    for (const rsc of curResourceBorrows) {
      rsc[symbolRscHandle] = null;
    }
    curResourceBorrows = [];
    var val4 = ret;
    var len4 = val4.length;
    var ptr4 = realloc1(0, 0, 4, len4 * 4);
    var src4 = new Uint8Array(val4.buffer, val4.byteOffset, len4 * 4);
    (new Uint8Array(memory0.buffer, ptr4, len4 * 4)).set(src4);
    dataView(memory0).setInt32(arg2 + 4, len4, true);
    dataView(memory0).setInt32(arg2 + 0, ptr4, true);
  }
  
  function trampoline66(arg0, arg1) {
    const ret = getRandomBytes(BigInt.asUintN(64, arg0));
    var val0 = ret;
    var len0 = val0.byteLength;
    var ptr0 = realloc1(0, 0, 1, len0 * 1);
    var src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
    (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
    dataView(memory0).setInt32(arg1 + 4, len0, true);
    dataView(memory0).setInt32(arg1 + 0, ptr0, true);
  }
  
  function trampoline67(arg0) {
    const ret = getEnvironment();
    var vec3 = ret;
    var len3 = vec3.length;
    var result3 = realloc1(0, 0, 4, len3 * 16);
    for (let i = 0; i < vec3.length; i++) {
      const e = vec3[i];
      const base = result3 + i * 16;var [tuple0_0, tuple0_1] = e;
      var ptr1 = utf8Encode(tuple0_0, realloc1, memory0);
      var len1 = utf8EncodedLen;
      dataView(memory0).setInt32(base + 4, len1, true);
      dataView(memory0).setInt32(base + 0, ptr1, true);
      var ptr2 = utf8Encode(tuple0_1, realloc1, memory0);
      var len2 = utf8EncodedLen;
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
  const handleTable12 = [T_FLAG, 0];
  const finalizationRegistry12 = finalizationRegistryCreate((handle) => {
    const { rep } = rscTableRemove(handleTable12, handle);
    exports0['49'](rep);
  });
  
  handleTables[12] = handleTable12;
  const trampoline0 = rscTableCreateOwn.bind(null, handleTable12);
  const handleTable13 = [T_FLAG, 0];
  const finalizationRegistry13 = finalizationRegistryCreate((handle) => {
    const { rep } = rscTableRemove(handleTable13, handle);
    exports0['50'](rep);
  });
  
  handleTables[13] = handleTable13;
  const trampoline1 = rscTableCreateOwn.bind(null, handleTable13);
  function trampoline2(handle) {
    return handleTable13[(handle << 1) + 1] & ~T_FLAG;
  }
  const handleTable8 = [T_FLAG, 0];
  const finalizationRegistry8 = finalizationRegistryCreate((handle) => {
    const { rep } = rscTableRemove(handleTable8, handle);
    exports0['45'](rep);
  });
  
  handleTables[8] = handleTable8;
  const trampoline3 = rscTableCreateOwn.bind(null, handleTable8);
  function trampoline4(handle) {
    return handleTable8[(handle << 1) + 1] & ~T_FLAG;
  }
  const handleTable9 = [T_FLAG, 0];
  const finalizationRegistry9 = finalizationRegistryCreate((handle) => {
    const { rep } = rscTableRemove(handleTable9, handle);
    exports0['46'](rep);
  });
  
  handleTables[9] = handleTable9;
  const trampoline5 = rscTableCreateOwn.bind(null, handleTable9);
  function trampoline6(handle) {
    return handleTable9[(handle << 1) + 1] & ~T_FLAG;
  }
  const handleTable10 = [T_FLAG, 0];
  const finalizationRegistry10 = finalizationRegistryCreate((handle) => {
    const { rep } = rscTableRemove(handleTable10, handle);
    exports0['47'](rep);
  });
  
  handleTables[10] = handleTable10;
  const trampoline7 = rscTableCreateOwn.bind(null, handleTable10);
  function trampoline8(handle) {
    return handleTable10[(handle << 1) + 1] & ~T_FLAG;
  }
  const handleTable11 = [T_FLAG, 0];
  const finalizationRegistry11 = finalizationRegistryCreate((handle) => {
    const { rep } = rscTableRemove(handleTable11, handle);
    exports0['48'](rep);
  });
  
  handleTables[11] = handleTable11;
  const trampoline9 = rscTableCreateOwn.bind(null, handleTable11);
  function trampoline10(handle) {
    return handleTable11[(handle << 1) + 1] & ~T_FLAG;
  }
  function trampoline11(handle) {
    const handleEntry = rscTableRemove(handleTable8, handle);
    if (handleEntry.own) {
      
      exports0['45'](handleEntry.rep);
    }
  }
  function trampoline13(handle) {
    const handleEntry = rscTableRemove(handleTable0, handle);
    if (handleEntry.own) {
      
      const rsc = captureTable0.get(handleEntry.rep);
      if (rsc) {
        if (rsc[symbolDispose]) rsc[symbolDispose]();
        captureTable0.delete(handleEntry.rep);
      } else if (Error$1[symbolCabiDispose]) {
        Error$1[symbolCabiDispose](handleEntry.rep);
      }
    }
  }
  function trampoline14(handle) {
    const handleEntry = rscTableRemove(handleTable2, handle);
    if (handleEntry.own) {
      
      const rsc = captureTable2.get(handleEntry.rep);
      if (rsc) {
        if (rsc[symbolDispose]) rsc[symbolDispose]();
        captureTable2.delete(handleEntry.rep);
      } else if (InputStream[symbolCabiDispose]) {
        InputStream[symbolCabiDispose](handleEntry.rep);
      }
    }
  }
  function trampoline17(handle) {
    const handleEntry = rscTableRemove(handleTable3, handle);
    if (handleEntry.own) {
      
      const rsc = captureTable3.get(handleEntry.rep);
      if (rsc) {
        if (rsc[symbolDispose]) rsc[symbolDispose]();
        captureTable3.delete(handleEntry.rep);
      } else if (OutputStream[symbolCabiDispose]) {
        OutputStream[symbolCabiDispose](handleEntry.rep);
      }
    }
  }
  function trampoline18(handle) {
    const handleEntry = rscTableRemove(handleTable9, handle);
    if (handleEntry.own) {
      
      exports0['46'](handleEntry.rep);
    }
  }
  function trampoline19(handle) {
    const handleEntry = rscTableRemove(handleTable11, handle);
    if (handleEntry.own) {
      
      exports0['48'](handleEntry.rep);
    }
  }
  function trampoline20(handle) {
    const handleEntry = rscTableRemove(handleTable10, handle);
    if (handleEntry.own) {
      
      exports0['47'](handleEntry.rep);
    }
  }
  function trampoline22(handle) {
    const handleEntry = rscTableRemove(handleTable13, handle);
    if (handleEntry.own) {
      
      exports0['50'](handleEntry.rep);
    }
  }
  function trampoline23(handle) {
    const handleEntry = rscTableRemove(handleTable12, handle);
    if (handleEntry.own) {
      
      exports0['49'](handleEntry.rep);
    }
  }
  function trampoline24(handle) {
    const handleEntry = rscTableRemove(handleTable4, handle);
    if (handleEntry.own) {
      
      const rsc = captureTable4.get(handleEntry.rep);
      if (rsc) {
        if (rsc[symbolDispose]) rsc[symbolDispose]();
        captureTable4.delete(handleEntry.rep);
      } else if (Network[symbolCabiDispose]) {
        Network[symbolCabiDispose](handleEntry.rep);
      }
    }
  }
  function trampoline25(handle) {
    const handleEntry = rscTableRemove(handleTable5, handle);
    if (handleEntry.own) {
      
      const rsc = captureTable5.get(handleEntry.rep);
      if (rsc) {
        if (rsc[symbolDispose]) rsc[symbolDispose]();
        captureTable5.delete(handleEntry.rep);
      } else if (ResolveAddressStream[symbolCabiDispose]) {
        ResolveAddressStream[symbolCabiDispose](handleEntry.rep);
      }
    }
  }
  function trampoline26(handle) {
    const handleEntry = rscTableRemove(handleTable6, handle);
    if (handleEntry.own) {
      
      const rsc = captureTable6.get(handleEntry.rep);
      if (rsc) {
        if (rsc[symbolDispose]) rsc[symbolDispose]();
        captureTable6.delete(handleEntry.rep);
      } else if (TcpSocket[symbolCabiDispose]) {
        TcpSocket[symbolCabiDispose](handleEntry.rep);
      }
    }
  }
  function trampoline29(handle) {
    const handleEntry = rscTableRemove(handleTable7, handle);
    if (handleEntry.own) {
      
      const rsc = captureTable7.get(handleEntry.rep);
      if (rsc) {
        if (rsc[symbolDispose]) rsc[symbolDispose]();
        captureTable7.delete(handleEntry.rep);
      } else if (Descriptor[symbolCabiDispose]) {
        Descriptor[symbolCabiDispose](handleEntry.rep);
      }
    }
  }
  function trampoline34(handle) {
    const handleEntry = rscTableRemove(handleTable1, handle);
    if (handleEntry.own) {
      
      const rsc = captureTable1.get(handleEntry.rep);
      if (rsc) {
        if (rsc[symbolDispose]) rsc[symbolDispose]();
        captureTable1.delete(handleEntry.rep);
      } else if (Pollable[symbolCabiDispose]) {
        Pollable[symbolCabiDispose](handleEntry.rep);
      }
    }
  }
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    '[export]wasi:filesystem/types@0.2.0': {
      '[resource-drop]descriptor': trampoline23,
      '[resource-drop]directory-entry-stream': trampoline22,
      '[resource-new]descriptor': trampoline0,
      '[resource-new]directory-entry-stream': trampoline1,
      '[resource-rep]directory-entry-stream': trampoline2,
    },
    '[export]wasi:io/error@0.2.0': {
      '[resource-drop]error': trampoline11,
      '[resource-new]error': trampoline3,
      '[resource-rep]error': trampoline4,
    },
    '[export]wasi:io/poll@0.2.0': {
      '[resource-drop]pollable': trampoline18,
      '[resource-new]pollable': trampoline5,
      '[resource-rep]pollable': trampoline6,
    },
    '[export]wasi:io/streams@0.2.0': {
      '[resource-drop]input-stream': trampoline20,
      '[resource-drop]output-stream': trampoline19,
      '[resource-new]input-stream': trampoline7,
      '[resource-new]output-stream': trampoline9,
      '[resource-rep]input-stream': trampoline8,
      '[resource-rep]output-stream': trampoline10,
    },
    'wasi:cli/environment@0.2.0': {
      'get-arguments': exports0['12'],
      'get-environment': exports0['11'],
      'initial-cwd': exports0['13'],
    },
    'wasi:cli/exit@0.2.0': {
      exit: trampoline21,
    },
    'wasi:cli/stderr@0.2.0': {
      'get-stderr': trampoline16,
    },
    'wasi:cli/stdin@0.2.0': {
      'get-stdin': trampoline12,
    },
    'wasi:cli/stdout@0.2.0': {
      'get-stdout': trampoline15,
    },
    'wasi:clocks/wall-clock@0.2.0': {
      now: exports0['14'],
      resolution: exports0['15'],
    },
    'wasi:io/error@0.2.0': {
      '[resource-drop]error': trampoline13,
    },
    'wasi:io/streams@0.2.0': {
      '[method]input-stream.blocking-read': exports0['1'],
      '[method]input-stream.blocking-skip': exports0['3'],
      '[method]input-stream.read': exports0['0'],
      '[method]input-stream.skip': exports0['2'],
      '[method]output-stream.blocking-flush': exports0['8'],
      '[method]output-stream.blocking-write-and-flush': exports0['6'],
      '[method]output-stream.blocking-write-zeroes-and-flush': exports0['10'],
      '[method]output-stream.check-write': exports0['4'],
      '[method]output-stream.flush': exports0['7'],
      '[method]output-stream.write': exports0['5'],
      '[method]output-stream.write-zeroes': exports0['9'],
      '[resource-drop]input-stream': trampoline14,
      '[resource-drop]output-stream': trampoline17,
    },
    'wasi:sockets/instance-network@0.2.0': {
      'instance-network': trampoline27,
    },
    'wasi:sockets/ip-name-lookup@0.2.0': {
      '[method]resolve-address-stream.resolve-next-address': exports0['16'],
      '[resource-drop]resolve-address-stream': trampoline25,
      'resolve-addresses': exports0['17'],
    },
    'wasi:sockets/network@0.2.0': {
      '[resource-drop]network': trampoline24,
    },
    'wasi:sockets/tcp-create-socket@0.2.0': {
      'create-tcp-socket': exports0['22'],
    },
    'wasi:sockets/tcp@0.2.0': {
      '[method]tcp-socket.finish-connect': exports0['19'],
      '[method]tcp-socket.remote-address': exports0['20'],
      '[method]tcp-socket.shutdown': exports0['21'],
      '[method]tcp-socket.start-connect': exports0['18'],
      '[resource-drop]tcp-socket': trampoline26,
    },
    wasi_snapshot_preview1: {
      clock_time_get: exports0['39'],
      environ_get: exports0['42'],
      environ_sizes_get: exports0['43'],
      fd_write: exports0['40'],
      poll_oneoff: exports0['41'],
      proc_exit: exports0['44'],
      random_get: exports0['38'],
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
      'get-environment': exports0['37'],
    },
    'wasi:cli/exit@0.2.0': {
      exit: trampoline21,
    },
    'wasi:cli/stderr@0.2.0': {
      'get-stderr': trampoline16,
    },
    'wasi:cli/stdin@0.2.0': {
      'get-stdin': trampoline12,
    },
    'wasi:cli/stdout@0.2.0': {
      'get-stdout': trampoline15,
    },
    'wasi:clocks/monotonic-clock@0.2.0': {
      now: trampoline28,
      'subscribe-duration': trampoline30,
      'subscribe-instant': trampoline31,
    },
    'wasi:clocks/wall-clock@0.2.0': {
      now: exports0['24'],
    },
    'wasi:filesystem/preopens@0.2.0': {
      'get-directories': exports0['23'],
    },
    'wasi:filesystem/types@0.2.0': {
      '[method]descriptor.append-via-stream': exports0['27'],
      '[method]descriptor.get-type': exports0['28'],
      '[method]descriptor.read-via-stream': exports0['25'],
      '[method]descriptor.stat': exports0['29'],
      '[method]descriptor.write-via-stream': exports0['26'],
      '[resource-drop]descriptor': trampoline29,
      'filesystem-error-code': exports0['30'],
    },
    'wasi:io/error@0.2.0': {
      '[resource-drop]error': trampoline13,
    },
    'wasi:io/poll@0.2.0': {
      '[resource-drop]pollable': trampoline34,
      poll: exports0['35'],
    },
    'wasi:io/streams@0.2.0': {
      '[method]input-stream.subscribe': trampoline33,
      '[method]output-stream.blocking-flush': exports0['34'],
      '[method]output-stream.blocking-write-and-flush': exports0['33'],
      '[method]output-stream.check-write': exports0['31'],
      '[method]output-stream.subscribe': trampoline32,
      '[method]output-stream.write': exports0['32'],
      '[resource-drop]input-stream': trampoline14,
      '[resource-drop]output-stream': trampoline17,
    },
    'wasi:random/random@0.2.0': {
      'get-random-bytes': exports0['36'],
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports1.cabi_realloc;
  realloc1 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': trampoline35,
      '1': trampoline36,
      '10': trampoline45,
      '11': trampoline46,
      '12': trampoline47,
      '13': trampoline48,
      '14': trampoline49,
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
      '24': trampoline49,
      '25': trampoline59,
      '26': trampoline60,
      '27': trampoline61,
      '28': trampoline62,
      '29': trampoline63,
      '3': trampoline38,
      '30': trampoline64,
      '31': trampoline39,
      '32': trampoline40,
      '33': trampoline41,
      '34': trampoline43,
      '35': trampoline65,
      '36': trampoline66,
      '37': trampoline67,
      '38': exports2.random_get,
      '39': exports2.clock_time_get,
      '4': trampoline39,
      '40': exports2.fd_write,
      '41': exports2.poll_oneoff,
      '42': exports2.environ_get,
      '43': exports2.environ_sizes_get,
      '44': exports2.proc_exit,
      '45': exports1['wasi:io/error@0.2.0#[dtor]error'],
      '46': exports1['wasi:io/poll@0.2.0#[dtor]pollable'],
      '47': exports1['wasi:io/streams@0.2.0#[dtor]input-stream'],
      '48': exports1['wasi:io/streams@0.2.0#[dtor]output-stream'],
      '49': exports1['wasi:filesystem/types@0.2.0#[dtor]descriptor'],
      '5': trampoline40,
      '50': exports1['wasi:filesystem/types@0.2.0#[dtor]directory-entry-stream'],
      '6': trampoline41,
      '7': trampoline42,
      '8': trampoline43,
      '9': trampoline44,
    },
  }));
  postReturn0 = exports1['cabi_post_wasi:cli/environment@0.2.0#get-environment'];
  postReturn1 = exports1['cabi_post_wasi:cli/environment@0.2.0#get-arguments'];
  postReturn2 = exports1['cabi_post_wasi:cli/environment@0.2.0#initial-cwd'];
  postReturn3 = exports1['cabi_post_wasi:io/error@0.2.0#[method]error.to-debug-string'];
  postReturn4 = exports1['cabi_post_wasi:io/poll@0.2.0#poll'];
  postReturn5 = exports1['cabi_post_wasi:filesystem/types@0.2.0#[method]descriptor.read'];
  postReturn6 = exports1['cabi_post_wasi:filesystem/types@0.2.0#[method]directory-entry-stream.read-directory-entry'];
  postReturn7 = exports1['cabi_post_wasi:filesystem/preopens@0.2.0#get-directories'];
  
  function getEnvironment$1() {
    const ret = exports1['wasi:cli/environment@0.2.0#get-environment']();
    var len2 = dataView(memory0).getInt32(ret + 4, true);
    var base2 = dataView(memory0).getInt32(ret + 0, true);
    var result2 = [];
    for (let i = 0; i < len2; i++) {
      const base = base2 + i * 16;
      var ptr0 = dataView(memory0).getInt32(base + 0, true);
      var len0 = dataView(memory0).getInt32(base + 4, true);
      var result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
      var ptr1 = dataView(memory0).getInt32(base + 8, true);
      var len1 = dataView(memory0).getInt32(base + 12, true);
      var result1 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr1, len1));
      result2.push([result0, result1]);
    }
    postReturn0(ret);
    return result2;
  }
  
  function getArguments$1() {
    const ret = exports1['wasi:cli/environment@0.2.0#get-arguments']();
    var len1 = dataView(memory0).getInt32(ret + 4, true);
    var base1 = dataView(memory0).getInt32(ret + 0, true);
    var result1 = [];
    for (let i = 0; i < len1; i++) {
      const base = base1 + i * 8;
      var ptr0 = dataView(memory0).getInt32(base + 0, true);
      var len0 = dataView(memory0).getInt32(base + 4, true);
      var result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
      result1.push(result0);
    }
    postReturn1(ret);
    return result1;
  }
  
  function initialCwd$1() {
    const ret = exports1['wasi:cli/environment@0.2.0#initial-cwd']();
    let variant1;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant1 = undefined;
        break;
      }
      case 1: {
        var ptr0 = dataView(memory0).getInt32(ret + 4, true);
        var len0 = dataView(memory0).getInt32(ret + 8, true);
        var result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
        variant1 = result0;
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for option');
      }
    }
    postReturn2(ret);
    return variant1;
  }
  
  function exit$1(arg0) {
    var variant0 = arg0;
    let variant0_0;
    switch (variant0.tag) {
      case 'ok': {
        const e = variant0.val;
        variant0_0 = 0;
        break;
      }
      case 'err': {
        const e = variant0.val;
        variant0_0 = 1;
        break;
      }
      default: {
        throw new TypeError('invalid variant specified for result');
      }
    }
    exports1['wasi:cli/exit@0.2.0#exit'](variant0_0);
  }
  
  class Error$2{
    constructor () {
      throw new Error('"Error$2" resource does not define a constructor');
    }
  }
  
  Error$2.prototype.toDebugString = function toDebugString() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Error" resource.');
    }
    var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/error@0.2.0#[method]error.to-debug-string'](handle0);
    var ptr2 = dataView(memory0).getInt32(ret + 0, true);
    var len2 = dataView(memory0).getInt32(ret + 4, true);
    var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
    postReturn3(ret);
    return result2;
  };
  
  class Pollable$1{
    constructor () {
      throw new Error('"Pollable$1" resource does not define a constructor');
    }
  }
  
  Pollable$1.prototype.ready = function ready() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable9[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Pollable" resource.');
    }
    var handle0 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/poll@0.2.0#[method]pollable.ready'](handle0);
    var bool2 = ret;
    return bool2 == 0 ? false : (bool2 == 1 ? true : throwInvalidBool());
  };
  
  Pollable$1.prototype.block = function block() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable9[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Pollable" resource.');
    }
    var handle0 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
    exports1['wasi:io/poll@0.2.0#[method]pollable.block'](handle0);
  };
  
  function poll$1(arg0) {
    var vec2 = arg0;
    var len2 = vec2.length;
    var result2 = realloc0(0, 0, 4, len2 * 4);
    for (let i = 0; i < vec2.length; i++) {
      const e = vec2[i];
      const base = result2 + i * 4;var handle1 = e[symbolRscHandle];
      if (!handle1 || (handleTable9[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle0 = handleTable9[(handle1 << 1) + 1] & ~T_FLAG;
      dataView(memory0).setInt32(base + 0, handle0, true);
    }
    const ret = exports1['wasi:io/poll@0.2.0#poll'](result2, len2);
    var ptr3 = dataView(memory0).getInt32(ret + 0, true);
    var len3 = dataView(memory0).getInt32(ret + 4, true);
    var result3 = new Uint32Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 4));
    postReturn4(ret);
    return result3;
  }
  
  class InputStream$1{
    constructor () {
      throw new Error('"InputStream$1" resource does not define a constructor');
    }
  }
  
  InputStream$1.prototype.read = function read(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable10[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "InputStream" resource.');
    }
    var handle0 = handleTable10[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]input-stream.read'](handle0, toUint64(arg1));
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var ptr2 = dataView(memory0).getInt32(ret + 4, true);
        var len2 = dataView(memory0).getInt32(ret + 8, true);
        var result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
        variant6= {
          tag: 'ok',
          val: result2
        };
        break;
      }
      case 1: {
        let variant5;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            var handle4 = dataView(memory0).getInt32(ret + 8, true);
            var rsc3 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
            finalizationRegistry8.register(rsc3, handle4, rsc3);
            Object.defineProperty(rsc3, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc3);
              rscTableRemove(handleTable8, handle4);
              rsc3[symbolDispose] = emptyFunc;
              rsc3[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle4 << 1) + 1] & ~T_FLAG);
            }});
            variant5= {
              tag: 'last-operation-failed',
              val: rsc3
            };
            break;
          }
          case 1: {
            variant5= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant6= {
          tag: 'err',
          val: variant5
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn5(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  InputStream$1.prototype.blockingRead = function blockingRead(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable10[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "InputStream" resource.');
    }
    var handle0 = handleTable10[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]input-stream.blocking-read'](handle0, toUint64(arg1));
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var ptr2 = dataView(memory0).getInt32(ret + 4, true);
        var len2 = dataView(memory0).getInt32(ret + 8, true);
        var result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
        variant6= {
          tag: 'ok',
          val: result2
        };
        break;
      }
      case 1: {
        let variant5;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            var handle4 = dataView(memory0).getInt32(ret + 8, true);
            var rsc3 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
            finalizationRegistry8.register(rsc3, handle4, rsc3);
            Object.defineProperty(rsc3, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc3);
              rscTableRemove(handleTable8, handle4);
              rsc3[symbolDispose] = emptyFunc;
              rsc3[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle4 << 1) + 1] & ~T_FLAG);
            }});
            variant5= {
              tag: 'last-operation-failed',
              val: rsc3
            };
            break;
          }
          case 1: {
            variant5= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant6= {
          tag: 'err',
          val: variant5
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn5(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  InputStream$1.prototype.skip = function skip(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable10[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "InputStream" resource.');
    }
    var handle0 = handleTable10[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]input-stream.skip'](handle0, toUint64(arg1));
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 8, true))
        };
        break;
      }
      case 1: {
        let variant4;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            var handle3 = dataView(memory0).getInt32(ret + 12, true);
            var rsc2 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
            finalizationRegistry8.register(rsc2, handle3, rsc2);
            Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc2);
              rscTableRemove(handleTable8, handle3);
              rsc2[symbolDispose] = emptyFunc;
              rsc2[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle3 << 1) + 1] & ~T_FLAG);
            }});
            variant4= {
              tag: 'last-operation-failed',
              val: rsc2
            };
            break;
          }
          case 1: {
            variant4= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant5= {
          tag: 'err',
          val: variant4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  InputStream$1.prototype.blockingSkip = function blockingSkip(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable10[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "InputStream" resource.');
    }
    var handle0 = handleTable10[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]input-stream.blocking-skip'](handle0, toUint64(arg1));
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 8, true))
        };
        break;
      }
      case 1: {
        let variant4;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            var handle3 = dataView(memory0).getInt32(ret + 12, true);
            var rsc2 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
            finalizationRegistry8.register(rsc2, handle3, rsc2);
            Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc2);
              rscTableRemove(handleTable8, handle3);
              rsc2[symbolDispose] = emptyFunc;
              rsc2[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle3 << 1) + 1] & ~T_FLAG);
            }});
            variant4= {
              tag: 'last-operation-failed',
              val: rsc2
            };
            break;
          }
          case 1: {
            variant4= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant5= {
          tag: 'err',
          val: variant4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  InputStream$1.prototype.subscribe = function subscribe() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable10[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "InputStream" resource.');
    }
    var handle0 = handleTable10[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]input-stream.subscribe'](handle0);
    var handle3 = ret;
    var rsc2 = new.target === Pollable$1 ? this : Object.create(Pollable$1.prototype);
    Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
    finalizationRegistry9.register(rsc2, handle3, rsc2);
    Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
      finalizationRegistry9.unregister(rsc2);
      rscTableRemove(handleTable9, handle3);
      rsc2[symbolDispose] = emptyFunc;
      rsc2[symbolRscHandle] = null;
      exports0['46'](handleTable9[(handle3 << 1) + 1] & ~T_FLAG);
    }});
    return rsc2;
  };
  
  class OutputStream$1{
    constructor () {
      throw new Error('"OutputStream$1" resource does not define a constructor');
    }
  }
  
  OutputStream$1.prototype.checkWrite = function checkWrite() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.check-write'](handle0);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 8, true))
        };
        break;
      }
      case 1: {
        let variant4;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            var handle3 = dataView(memory0).getInt32(ret + 12, true);
            var rsc2 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
            finalizationRegistry8.register(rsc2, handle3, rsc2);
            Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc2);
              rscTableRemove(handleTable8, handle3);
              rsc2[symbolDispose] = emptyFunc;
              rsc2[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle3 << 1) + 1] & ~T_FLAG);
            }});
            variant4= {
              tag: 'last-operation-failed',
              val: rsc2
            };
            break;
          }
          case 1: {
            variant4= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant5= {
          tag: 'err',
          val: variant4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  OutputStream$1.prototype.write = function write(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    var val2 = arg1;
    var len2 = val2.byteLength;
    var ptr2 = realloc0(0, 0, 1, len2 * 1);
    var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.write'](handle0, ptr2, len2);
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
        let variant5;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            var handle4 = dataView(memory0).getInt32(ret + 8, true);
            var rsc3 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
            finalizationRegistry8.register(rsc3, handle4, rsc3);
            Object.defineProperty(rsc3, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc3);
              rscTableRemove(handleTable8, handle4);
              rsc3[symbolDispose] = emptyFunc;
              rsc3[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle4 << 1) + 1] & ~T_FLAG);
            }});
            variant5= {
              tag: 'last-operation-failed',
              val: rsc3
            };
            break;
          }
          case 1: {
            variant5= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant6= {
          tag: 'err',
          val: variant5
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
  };
  
  OutputStream$1.prototype.blockingWriteAndFlush = function blockingWriteAndFlush(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    var val2 = arg1;
    var len2 = val2.byteLength;
    var ptr2 = realloc0(0, 0, 1, len2 * 1);
    var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.blocking-write-and-flush'](handle0, ptr2, len2);
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
        let variant5;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            var handle4 = dataView(memory0).getInt32(ret + 8, true);
            var rsc3 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc3, symbolRscHandle, { writable: true, value: handle4});
            finalizationRegistry8.register(rsc3, handle4, rsc3);
            Object.defineProperty(rsc3, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc3);
              rscTableRemove(handleTable8, handle4);
              rsc3[symbolDispose] = emptyFunc;
              rsc3[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle4 << 1) + 1] & ~T_FLAG);
            }});
            variant5= {
              tag: 'last-operation-failed',
              val: rsc3
            };
            break;
          }
          case 1: {
            variant5= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant6= {
          tag: 'err',
          val: variant5
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
  };
  
  OutputStream$1.prototype.flush = function flush() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.flush'](handle0);
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
        let variant4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            var handle3 = dataView(memory0).getInt32(ret + 8, true);
            var rsc2 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
            finalizationRegistry8.register(rsc2, handle3, rsc2);
            Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc2);
              rscTableRemove(handleTable8, handle3);
              rsc2[symbolDispose] = emptyFunc;
              rsc2[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle3 << 1) + 1] & ~T_FLAG);
            }});
            variant4= {
              tag: 'last-operation-failed',
              val: rsc2
            };
            break;
          }
          case 1: {
            variant4= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant5= {
          tag: 'err',
          val: variant4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  OutputStream$1.prototype.blockingFlush = function blockingFlush() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.blocking-flush'](handle0);
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
        let variant4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            var handle3 = dataView(memory0).getInt32(ret + 8, true);
            var rsc2 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
            finalizationRegistry8.register(rsc2, handle3, rsc2);
            Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc2);
              rscTableRemove(handleTable8, handle3);
              rsc2[symbolDispose] = emptyFunc;
              rsc2[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle3 << 1) + 1] & ~T_FLAG);
            }});
            variant4= {
              tag: 'last-operation-failed',
              val: rsc2
            };
            break;
          }
          case 1: {
            variant4= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant5= {
          tag: 'err',
          val: variant4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  OutputStream$1.prototype.subscribe = function subscribe() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.subscribe'](handle0);
    var handle3 = ret;
    var rsc2 = new.target === Pollable$1 ? this : Object.create(Pollable$1.prototype);
    Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
    finalizationRegistry9.register(rsc2, handle3, rsc2);
    Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
      finalizationRegistry9.unregister(rsc2);
      rscTableRemove(handleTable9, handle3);
      rsc2[symbolDispose] = emptyFunc;
      rsc2[symbolRscHandle] = null;
      exports0['46'](handleTable9[(handle3 << 1) + 1] & ~T_FLAG);
    }});
    return rsc2;
  };
  
  OutputStream$1.prototype.writeZeroes = function writeZeroes(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.write-zeroes'](handle0, toUint64(arg1));
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
        let variant4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            var handle3 = dataView(memory0).getInt32(ret + 8, true);
            var rsc2 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
            finalizationRegistry8.register(rsc2, handle3, rsc2);
            Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc2);
              rscTableRemove(handleTable8, handle3);
              rsc2[symbolDispose] = emptyFunc;
              rsc2[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle3 << 1) + 1] & ~T_FLAG);
            }});
            variant4= {
              tag: 'last-operation-failed',
              val: rsc2
            };
            break;
          }
          case 1: {
            variant4= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant5= {
          tag: 'err',
          val: variant4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  OutputStream$1.prototype.blockingWriteZeroesAndFlush = function blockingWriteZeroesAndFlush(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.blocking-write-zeroes-and-flush'](handle0, toUint64(arg1));
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
        let variant4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            var handle3 = dataView(memory0).getInt32(ret + 8, true);
            var rsc2 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
            finalizationRegistry8.register(rsc2, handle3, rsc2);
            Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc2);
              rscTableRemove(handleTable8, handle3);
              rsc2[symbolDispose] = emptyFunc;
              rsc2[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle3 << 1) + 1] & ~T_FLAG);
            }});
            variant4= {
              tag: 'last-operation-failed',
              val: rsc2
            };
            break;
          }
          case 1: {
            variant4= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant5= {
          tag: 'err',
          val: variant4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  OutputStream$1.prototype.splice = function splice(arg1, arg2) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    var handle3 = arg1[symbolRscHandle];
    if (!handle3 || (handleTable10[(handle3 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "InputStream" resource.');
    }
    var handle2 = handleTable10[(handle3 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.splice'](handle0, handle2, toUint64(arg2));
    let variant7;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant7= {
          tag: 'ok',
          val: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 8, true))
        };
        break;
      }
      case 1: {
        let variant6;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            var handle5 = dataView(memory0).getInt32(ret + 12, true);
            var rsc4 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc4, symbolRscHandle, { writable: true, value: handle5});
            finalizationRegistry8.register(rsc4, handle5, rsc4);
            Object.defineProperty(rsc4, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc4);
              rscTableRemove(handleTable8, handle5);
              rsc4[symbolDispose] = emptyFunc;
              rsc4[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle5 << 1) + 1] & ~T_FLAG);
            }});
            variant6= {
              tag: 'last-operation-failed',
              val: rsc4
            };
            break;
          }
          case 1: {
            variant6= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant7= {
          tag: 'err',
          val: variant6
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  };
  
  OutputStream$1.prototype.blockingSplice = function blockingSplice(arg1, arg2) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable11[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "OutputStream" resource.');
    }
    var handle0 = handleTable11[(handle1 << 1) + 1] & ~T_FLAG;
    var handle3 = arg1[symbolRscHandle];
    if (!handle3 || (handleTable10[(handle3 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "InputStream" resource.');
    }
    var handle2 = handleTable10[(handle3 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:io/streams@0.2.0#[method]output-stream.blocking-splice'](handle0, handle2, toUint64(arg2));
    let variant7;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant7= {
          tag: 'ok',
          val: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 8, true))
        };
        break;
      }
      case 1: {
        let variant6;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            var handle5 = dataView(memory0).getInt32(ret + 12, true);
            var rsc4 = new.target === Error$2 ? this : Object.create(Error$2.prototype);
            Object.defineProperty(rsc4, symbolRscHandle, { writable: true, value: handle5});
            finalizationRegistry8.register(rsc4, handle5, rsc4);
            Object.defineProperty(rsc4, symbolDispose, { writable: true, value: function () {
              finalizationRegistry8.unregister(rsc4);
              rscTableRemove(handleTable8, handle5);
              rsc4[symbolDispose] = emptyFunc;
              rsc4[symbolRscHandle] = null;
              exports0['45'](handleTable8[(handle5 << 1) + 1] & ~T_FLAG);
            }});
            variant6= {
              tag: 'last-operation-failed',
              val: rsc4
            };
            break;
          }
          case 1: {
            variant6= {
              tag: 'closed',
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for StreamError');
          }
        }
        variant7= {
          tag: 'err',
          val: variant6
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  };
  
  function getStdin$1() {
    const ret = exports1['wasi:cli/stdin@0.2.0#get-stdin']();
    var handle1 = ret;
    var rsc0 = new.target === InputStream$1 ? this : Object.create(InputStream$1.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    finalizationRegistry10.register(rsc0, handle1, rsc0);
    Object.defineProperty(rsc0, symbolDispose, { writable: true, value: function () {
      finalizationRegistry10.unregister(rsc0);
      rscTableRemove(handleTable10, handle1);
      rsc0[symbolDispose] = emptyFunc;
      rsc0[symbolRscHandle] = null;
      exports0['47'](handleTable10[(handle1 << 1) + 1] & ~T_FLAG);
    }});
    return rsc0;
  }
  
  function getStdout$1() {
    const ret = exports1['wasi:cli/stdout@0.2.0#get-stdout']();
    var handle1 = ret;
    var rsc0 = new.target === OutputStream$1 ? this : Object.create(OutputStream$1.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    finalizationRegistry11.register(rsc0, handle1, rsc0);
    Object.defineProperty(rsc0, symbolDispose, { writable: true, value: function () {
      finalizationRegistry11.unregister(rsc0);
      rscTableRemove(handleTable11, handle1);
      rsc0[symbolDispose] = emptyFunc;
      rsc0[symbolRscHandle] = null;
      exports0['48'](handleTable11[(handle1 << 1) + 1] & ~T_FLAG);
    }});
    return rsc0;
  }
  
  function getStderr$1() {
    const ret = exports1['wasi:cli/stderr@0.2.0#get-stderr']();
    var handle1 = ret;
    var rsc0 = new.target === OutputStream$1 ? this : Object.create(OutputStream$1.prototype);
    Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
    finalizationRegistry11.register(rsc0, handle1, rsc0);
    Object.defineProperty(rsc0, symbolDispose, { writable: true, value: function () {
      finalizationRegistry11.unregister(rsc0);
      rscTableRemove(handleTable11, handle1);
      rsc0[symbolDispose] = emptyFunc;
      rsc0[symbolRscHandle] = null;
      exports0['48'](handleTable11[(handle1 << 1) + 1] & ~T_FLAG);
    }});
    return rsc0;
  }
  
  function now$2() {
    const ret = exports1['wasi:clocks/wall-clock@0.2.0#now']();
    return {
      seconds: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 0, true)),
      nanoseconds: dataView(memory0).getInt32(ret + 8, true) >>> 0,
    };
  }
  
  function resolution$1() {
    const ret = exports1['wasi:clocks/wall-clock@0.2.0#resolution']();
    return {
      seconds: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 0, true)),
      nanoseconds: dataView(memory0).getInt32(ret + 8, true) >>> 0,
    };
  }
  
  class Descriptor$1{
    constructor () {
      throw new Error('"Descriptor$1" resource does not define a constructor');
    }
  }
  
  Descriptor$1.prototype.readViaStream = function readViaStream(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.read-via-stream'](handle0, toUint64(arg1));
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var handle3 = dataView(memory0).getInt32(ret + 4, true);
        var rsc2 = new.target === InputStream$1 ? this : Object.create(InputStream$1.prototype);
        Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
        finalizationRegistry10.register(rsc2, handle3, rsc2);
        Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
          finalizationRegistry10.unregister(rsc2);
          rscTableRemove(handleTable10, handle3);
          rsc2[symbolDispose] = emptyFunc;
          rsc2[symbolRscHandle] = null;
          exports0['47'](handleTable10[(handle3 << 1) + 1] & ~T_FLAG);
        }});
        variant5= {
          tag: 'ok',
          val: rsc2
        };
        break;
      }
      case 1: {
        let enum4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            enum4 = 'access';
            break;
          }
          case 1: {
            enum4 = 'would-block';
            break;
          }
          case 2: {
            enum4 = 'already';
            break;
          }
          case 3: {
            enum4 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum4 = 'busy';
            break;
          }
          case 5: {
            enum4 = 'deadlock';
            break;
          }
          case 6: {
            enum4 = 'quota';
            break;
          }
          case 7: {
            enum4 = 'exist';
            break;
          }
          case 8: {
            enum4 = 'file-too-large';
            break;
          }
          case 9: {
            enum4 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum4 = 'in-progress';
            break;
          }
          case 11: {
            enum4 = 'interrupted';
            break;
          }
          case 12: {
            enum4 = 'invalid';
            break;
          }
          case 13: {
            enum4 = 'io';
            break;
          }
          case 14: {
            enum4 = 'is-directory';
            break;
          }
          case 15: {
            enum4 = 'loop';
            break;
          }
          case 16: {
            enum4 = 'too-many-links';
            break;
          }
          case 17: {
            enum4 = 'message-size';
            break;
          }
          case 18: {
            enum4 = 'name-too-long';
            break;
          }
          case 19: {
            enum4 = 'no-device';
            break;
          }
          case 20: {
            enum4 = 'no-entry';
            break;
          }
          case 21: {
            enum4 = 'no-lock';
            break;
          }
          case 22: {
            enum4 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum4 = 'insufficient-space';
            break;
          }
          case 24: {
            enum4 = 'not-directory';
            break;
          }
          case 25: {
            enum4 = 'not-empty';
            break;
          }
          case 26: {
            enum4 = 'not-recoverable';
            break;
          }
          case 27: {
            enum4 = 'unsupported';
            break;
          }
          case 28: {
            enum4 = 'no-tty';
            break;
          }
          case 29: {
            enum4 = 'no-such-device';
            break;
          }
          case 30: {
            enum4 = 'overflow';
            break;
          }
          case 31: {
            enum4 = 'not-permitted';
            break;
          }
          case 32: {
            enum4 = 'pipe';
            break;
          }
          case 33: {
            enum4 = 'read-only';
            break;
          }
          case 34: {
            enum4 = 'invalid-seek';
            break;
          }
          case 35: {
            enum4 = 'text-file-busy';
            break;
          }
          case 36: {
            enum4 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant5= {
          tag: 'err',
          val: enum4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  Descriptor$1.prototype.writeViaStream = function writeViaStream(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.write-via-stream'](handle0, toUint64(arg1));
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var handle3 = dataView(memory0).getInt32(ret + 4, true);
        var rsc2 = new.target === OutputStream$1 ? this : Object.create(OutputStream$1.prototype);
        Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
        finalizationRegistry11.register(rsc2, handle3, rsc2);
        Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
          finalizationRegistry11.unregister(rsc2);
          rscTableRemove(handleTable11, handle3);
          rsc2[symbolDispose] = emptyFunc;
          rsc2[symbolRscHandle] = null;
          exports0['48'](handleTable11[(handle3 << 1) + 1] & ~T_FLAG);
        }});
        variant5= {
          tag: 'ok',
          val: rsc2
        };
        break;
      }
      case 1: {
        let enum4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            enum4 = 'access';
            break;
          }
          case 1: {
            enum4 = 'would-block';
            break;
          }
          case 2: {
            enum4 = 'already';
            break;
          }
          case 3: {
            enum4 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum4 = 'busy';
            break;
          }
          case 5: {
            enum4 = 'deadlock';
            break;
          }
          case 6: {
            enum4 = 'quota';
            break;
          }
          case 7: {
            enum4 = 'exist';
            break;
          }
          case 8: {
            enum4 = 'file-too-large';
            break;
          }
          case 9: {
            enum4 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum4 = 'in-progress';
            break;
          }
          case 11: {
            enum4 = 'interrupted';
            break;
          }
          case 12: {
            enum4 = 'invalid';
            break;
          }
          case 13: {
            enum4 = 'io';
            break;
          }
          case 14: {
            enum4 = 'is-directory';
            break;
          }
          case 15: {
            enum4 = 'loop';
            break;
          }
          case 16: {
            enum4 = 'too-many-links';
            break;
          }
          case 17: {
            enum4 = 'message-size';
            break;
          }
          case 18: {
            enum4 = 'name-too-long';
            break;
          }
          case 19: {
            enum4 = 'no-device';
            break;
          }
          case 20: {
            enum4 = 'no-entry';
            break;
          }
          case 21: {
            enum4 = 'no-lock';
            break;
          }
          case 22: {
            enum4 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum4 = 'insufficient-space';
            break;
          }
          case 24: {
            enum4 = 'not-directory';
            break;
          }
          case 25: {
            enum4 = 'not-empty';
            break;
          }
          case 26: {
            enum4 = 'not-recoverable';
            break;
          }
          case 27: {
            enum4 = 'unsupported';
            break;
          }
          case 28: {
            enum4 = 'no-tty';
            break;
          }
          case 29: {
            enum4 = 'no-such-device';
            break;
          }
          case 30: {
            enum4 = 'overflow';
            break;
          }
          case 31: {
            enum4 = 'not-permitted';
            break;
          }
          case 32: {
            enum4 = 'pipe';
            break;
          }
          case 33: {
            enum4 = 'read-only';
            break;
          }
          case 34: {
            enum4 = 'invalid-seek';
            break;
          }
          case 35: {
            enum4 = 'text-file-busy';
            break;
          }
          case 36: {
            enum4 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant5= {
          tag: 'err',
          val: enum4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  Descriptor$1.prototype.appendViaStream = function appendViaStream() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.append-via-stream'](handle0);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var handle3 = dataView(memory0).getInt32(ret + 4, true);
        var rsc2 = new.target === OutputStream$1 ? this : Object.create(OutputStream$1.prototype);
        Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
        finalizationRegistry11.register(rsc2, handle3, rsc2);
        Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
          finalizationRegistry11.unregister(rsc2);
          rscTableRemove(handleTable11, handle3);
          rsc2[symbolDispose] = emptyFunc;
          rsc2[symbolRscHandle] = null;
          exports0['48'](handleTable11[(handle3 << 1) + 1] & ~T_FLAG);
        }});
        variant5= {
          tag: 'ok',
          val: rsc2
        };
        break;
      }
      case 1: {
        let enum4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            enum4 = 'access';
            break;
          }
          case 1: {
            enum4 = 'would-block';
            break;
          }
          case 2: {
            enum4 = 'already';
            break;
          }
          case 3: {
            enum4 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum4 = 'busy';
            break;
          }
          case 5: {
            enum4 = 'deadlock';
            break;
          }
          case 6: {
            enum4 = 'quota';
            break;
          }
          case 7: {
            enum4 = 'exist';
            break;
          }
          case 8: {
            enum4 = 'file-too-large';
            break;
          }
          case 9: {
            enum4 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum4 = 'in-progress';
            break;
          }
          case 11: {
            enum4 = 'interrupted';
            break;
          }
          case 12: {
            enum4 = 'invalid';
            break;
          }
          case 13: {
            enum4 = 'io';
            break;
          }
          case 14: {
            enum4 = 'is-directory';
            break;
          }
          case 15: {
            enum4 = 'loop';
            break;
          }
          case 16: {
            enum4 = 'too-many-links';
            break;
          }
          case 17: {
            enum4 = 'message-size';
            break;
          }
          case 18: {
            enum4 = 'name-too-long';
            break;
          }
          case 19: {
            enum4 = 'no-device';
            break;
          }
          case 20: {
            enum4 = 'no-entry';
            break;
          }
          case 21: {
            enum4 = 'no-lock';
            break;
          }
          case 22: {
            enum4 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum4 = 'insufficient-space';
            break;
          }
          case 24: {
            enum4 = 'not-directory';
            break;
          }
          case 25: {
            enum4 = 'not-empty';
            break;
          }
          case 26: {
            enum4 = 'not-recoverable';
            break;
          }
          case 27: {
            enum4 = 'unsupported';
            break;
          }
          case 28: {
            enum4 = 'no-tty';
            break;
          }
          case 29: {
            enum4 = 'no-such-device';
            break;
          }
          case 30: {
            enum4 = 'overflow';
            break;
          }
          case 31: {
            enum4 = 'not-permitted';
            break;
          }
          case 32: {
            enum4 = 'pipe';
            break;
          }
          case 33: {
            enum4 = 'read-only';
            break;
          }
          case 34: {
            enum4 = 'invalid-seek';
            break;
          }
          case 35: {
            enum4 = 'text-file-busy';
            break;
          }
          case 36: {
            enum4 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant5= {
          tag: 'err',
          val: enum4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  Descriptor$1.prototype.advise = function advise(arg1, arg2, arg3) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var val2 = arg3;
    let enum2;
    switch (val2) {
      case 'normal': {
        enum2 = 0;
        break;
      }
      case 'sequential': {
        enum2 = 1;
        break;
      }
      case 'random': {
        enum2 = 2;
        break;
      }
      case 'will-need': {
        enum2 = 3;
        break;
      }
      case 'dont-need': {
        enum2 = 4;
        break;
      }
      case 'no-reuse': {
        enum2 = 5;
        break;
      }
      default: {
        if ((arg3) instanceof Error) {
          console.error(arg3);
        }
        
        throw new TypeError(`"${val2}" is not one of the cases of advice`);
      }
    }
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.advise'](handle0, toUint64(arg1), toUint64(arg2), enum2);
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
        let enum3;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum3 = 'access';
            break;
          }
          case 1: {
            enum3 = 'would-block';
            break;
          }
          case 2: {
            enum3 = 'already';
            break;
          }
          case 3: {
            enum3 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum3 = 'busy';
            break;
          }
          case 5: {
            enum3 = 'deadlock';
            break;
          }
          case 6: {
            enum3 = 'quota';
            break;
          }
          case 7: {
            enum3 = 'exist';
            break;
          }
          case 8: {
            enum3 = 'file-too-large';
            break;
          }
          case 9: {
            enum3 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum3 = 'in-progress';
            break;
          }
          case 11: {
            enum3 = 'interrupted';
            break;
          }
          case 12: {
            enum3 = 'invalid';
            break;
          }
          case 13: {
            enum3 = 'io';
            break;
          }
          case 14: {
            enum3 = 'is-directory';
            break;
          }
          case 15: {
            enum3 = 'loop';
            break;
          }
          case 16: {
            enum3 = 'too-many-links';
            break;
          }
          case 17: {
            enum3 = 'message-size';
            break;
          }
          case 18: {
            enum3 = 'name-too-long';
            break;
          }
          case 19: {
            enum3 = 'no-device';
            break;
          }
          case 20: {
            enum3 = 'no-entry';
            break;
          }
          case 21: {
            enum3 = 'no-lock';
            break;
          }
          case 22: {
            enum3 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum3 = 'insufficient-space';
            break;
          }
          case 24: {
            enum3 = 'not-directory';
            break;
          }
          case 25: {
            enum3 = 'not-empty';
            break;
          }
          case 26: {
            enum3 = 'not-recoverable';
            break;
          }
          case 27: {
            enum3 = 'unsupported';
            break;
          }
          case 28: {
            enum3 = 'no-tty';
            break;
          }
          case 29: {
            enum3 = 'no-such-device';
            break;
          }
          case 30: {
            enum3 = 'overflow';
            break;
          }
          case 31: {
            enum3 = 'not-permitted';
            break;
          }
          case 32: {
            enum3 = 'pipe';
            break;
          }
          case 33: {
            enum3 = 'read-only';
            break;
          }
          case 34: {
            enum3 = 'invalid-seek';
            break;
          }
          case 35: {
            enum3 = 'text-file-busy';
            break;
          }
          case 36: {
            enum3 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant4= {
          tag: 'err',
          val: enum3
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
  };
  
  Descriptor$1.prototype.syncData = function syncData() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.sync'](handle0);
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
        let enum2;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum2 = 'access';
            break;
          }
          case 1: {
            enum2 = 'would-block';
            break;
          }
          case 2: {
            enum2 = 'already';
            break;
          }
          case 3: {
            enum2 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum2 = 'busy';
            break;
          }
          case 5: {
            enum2 = 'deadlock';
            break;
          }
          case 6: {
            enum2 = 'quota';
            break;
          }
          case 7: {
            enum2 = 'exist';
            break;
          }
          case 8: {
            enum2 = 'file-too-large';
            break;
          }
          case 9: {
            enum2 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum2 = 'in-progress';
            break;
          }
          case 11: {
            enum2 = 'interrupted';
            break;
          }
          case 12: {
            enum2 = 'invalid';
            break;
          }
          case 13: {
            enum2 = 'io';
            break;
          }
          case 14: {
            enum2 = 'is-directory';
            break;
          }
          case 15: {
            enum2 = 'loop';
            break;
          }
          case 16: {
            enum2 = 'too-many-links';
            break;
          }
          case 17: {
            enum2 = 'message-size';
            break;
          }
          case 18: {
            enum2 = 'name-too-long';
            break;
          }
          case 19: {
            enum2 = 'no-device';
            break;
          }
          case 20: {
            enum2 = 'no-entry';
            break;
          }
          case 21: {
            enum2 = 'no-lock';
            break;
          }
          case 22: {
            enum2 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum2 = 'insufficient-space';
            break;
          }
          case 24: {
            enum2 = 'not-directory';
            break;
          }
          case 25: {
            enum2 = 'not-empty';
            break;
          }
          case 26: {
            enum2 = 'not-recoverable';
            break;
          }
          case 27: {
            enum2 = 'unsupported';
            break;
          }
          case 28: {
            enum2 = 'no-tty';
            break;
          }
          case 29: {
            enum2 = 'no-such-device';
            break;
          }
          case 30: {
            enum2 = 'overflow';
            break;
          }
          case 31: {
            enum2 = 'not-permitted';
            break;
          }
          case 32: {
            enum2 = 'pipe';
            break;
          }
          case 33: {
            enum2 = 'read-only';
            break;
          }
          case 34: {
            enum2 = 'invalid-seek';
            break;
          }
          case 35: {
            enum2 = 'text-file-busy';
            break;
          }
          case 36: {
            enum2 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant3= {
          tag: 'err',
          val: enum2
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
  };
  
  Descriptor$1.prototype.getFlags = function getFlags() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.get-flags'](handle0);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        if ((dataView(memory0).getUint8(ret + 1, true) & 4294967232) !== 0) {
          throw new TypeError('flags have extraneous bits set');
        }
        var flags2 = {
          read: Boolean(dataView(memory0).getUint8(ret + 1, true) & 1),
          write: Boolean(dataView(memory0).getUint8(ret + 1, true) & 2),
          fileIntegritySync: Boolean(dataView(memory0).getUint8(ret + 1, true) & 4),
          dataIntegritySync: Boolean(dataView(memory0).getUint8(ret + 1, true) & 8),
          requestedWriteSync: Boolean(dataView(memory0).getUint8(ret + 1, true) & 16),
          mutateDirectory: Boolean(dataView(memory0).getUint8(ret + 1, true) & 32),
        };
        variant4= {
          tag: 'ok',
          val: flags2
        };
        break;
      }
      case 1: {
        let enum3;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum3 = 'access';
            break;
          }
          case 1: {
            enum3 = 'would-block';
            break;
          }
          case 2: {
            enum3 = 'already';
            break;
          }
          case 3: {
            enum3 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum3 = 'busy';
            break;
          }
          case 5: {
            enum3 = 'deadlock';
            break;
          }
          case 6: {
            enum3 = 'quota';
            break;
          }
          case 7: {
            enum3 = 'exist';
            break;
          }
          case 8: {
            enum3 = 'file-too-large';
            break;
          }
          case 9: {
            enum3 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum3 = 'in-progress';
            break;
          }
          case 11: {
            enum3 = 'interrupted';
            break;
          }
          case 12: {
            enum3 = 'invalid';
            break;
          }
          case 13: {
            enum3 = 'io';
            break;
          }
          case 14: {
            enum3 = 'is-directory';
            break;
          }
          case 15: {
            enum3 = 'loop';
            break;
          }
          case 16: {
            enum3 = 'too-many-links';
            break;
          }
          case 17: {
            enum3 = 'message-size';
            break;
          }
          case 18: {
            enum3 = 'name-too-long';
            break;
          }
          case 19: {
            enum3 = 'no-device';
            break;
          }
          case 20: {
            enum3 = 'no-entry';
            break;
          }
          case 21: {
            enum3 = 'no-lock';
            break;
          }
          case 22: {
            enum3 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum3 = 'insufficient-space';
            break;
          }
          case 24: {
            enum3 = 'not-directory';
            break;
          }
          case 25: {
            enum3 = 'not-empty';
            break;
          }
          case 26: {
            enum3 = 'not-recoverable';
            break;
          }
          case 27: {
            enum3 = 'unsupported';
            break;
          }
          case 28: {
            enum3 = 'no-tty';
            break;
          }
          case 29: {
            enum3 = 'no-such-device';
            break;
          }
          case 30: {
            enum3 = 'overflow';
            break;
          }
          case 31: {
            enum3 = 'not-permitted';
            break;
          }
          case 32: {
            enum3 = 'pipe';
            break;
          }
          case 33: {
            enum3 = 'read-only';
            break;
          }
          case 34: {
            enum3 = 'invalid-seek';
            break;
          }
          case 35: {
            enum3 = 'text-file-busy';
            break;
          }
          case 36: {
            enum3 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant4= {
          tag: 'err',
          val: enum3
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
  };
  
  Descriptor$1.prototype.getType = function getType() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.get-type'](handle0);
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        let enum2;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum2 = 'unknown';
            break;
          }
          case 1: {
            enum2 = 'block-device';
            break;
          }
          case 2: {
            enum2 = 'character-device';
            break;
          }
          case 3: {
            enum2 = 'directory';
            break;
          }
          case 4: {
            enum2 = 'fifo';
            break;
          }
          case 5: {
            enum2 = 'symbolic-link';
            break;
          }
          case 6: {
            enum2 = 'regular-file';
            break;
          }
          case 7: {
            enum2 = 'socket';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for DescriptorType');
          }
        }
        variant4= {
          tag: 'ok',
          val: enum2
        };
        break;
      }
      case 1: {
        let enum3;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum3 = 'access';
            break;
          }
          case 1: {
            enum3 = 'would-block';
            break;
          }
          case 2: {
            enum3 = 'already';
            break;
          }
          case 3: {
            enum3 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum3 = 'busy';
            break;
          }
          case 5: {
            enum3 = 'deadlock';
            break;
          }
          case 6: {
            enum3 = 'quota';
            break;
          }
          case 7: {
            enum3 = 'exist';
            break;
          }
          case 8: {
            enum3 = 'file-too-large';
            break;
          }
          case 9: {
            enum3 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum3 = 'in-progress';
            break;
          }
          case 11: {
            enum3 = 'interrupted';
            break;
          }
          case 12: {
            enum3 = 'invalid';
            break;
          }
          case 13: {
            enum3 = 'io';
            break;
          }
          case 14: {
            enum3 = 'is-directory';
            break;
          }
          case 15: {
            enum3 = 'loop';
            break;
          }
          case 16: {
            enum3 = 'too-many-links';
            break;
          }
          case 17: {
            enum3 = 'message-size';
            break;
          }
          case 18: {
            enum3 = 'name-too-long';
            break;
          }
          case 19: {
            enum3 = 'no-device';
            break;
          }
          case 20: {
            enum3 = 'no-entry';
            break;
          }
          case 21: {
            enum3 = 'no-lock';
            break;
          }
          case 22: {
            enum3 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum3 = 'insufficient-space';
            break;
          }
          case 24: {
            enum3 = 'not-directory';
            break;
          }
          case 25: {
            enum3 = 'not-empty';
            break;
          }
          case 26: {
            enum3 = 'not-recoverable';
            break;
          }
          case 27: {
            enum3 = 'unsupported';
            break;
          }
          case 28: {
            enum3 = 'no-tty';
            break;
          }
          case 29: {
            enum3 = 'no-such-device';
            break;
          }
          case 30: {
            enum3 = 'overflow';
            break;
          }
          case 31: {
            enum3 = 'not-permitted';
            break;
          }
          case 32: {
            enum3 = 'pipe';
            break;
          }
          case 33: {
            enum3 = 'read-only';
            break;
          }
          case 34: {
            enum3 = 'invalid-seek';
            break;
          }
          case 35: {
            enum3 = 'text-file-busy';
            break;
          }
          case 36: {
            enum3 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant4= {
          tag: 'err',
          val: enum3
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
  };
  
  Descriptor$1.prototype.setSize = function setSize(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.set-size'](handle0, toUint64(arg1));
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
        let enum2;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum2 = 'access';
            break;
          }
          case 1: {
            enum2 = 'would-block';
            break;
          }
          case 2: {
            enum2 = 'already';
            break;
          }
          case 3: {
            enum2 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum2 = 'busy';
            break;
          }
          case 5: {
            enum2 = 'deadlock';
            break;
          }
          case 6: {
            enum2 = 'quota';
            break;
          }
          case 7: {
            enum2 = 'exist';
            break;
          }
          case 8: {
            enum2 = 'file-too-large';
            break;
          }
          case 9: {
            enum2 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum2 = 'in-progress';
            break;
          }
          case 11: {
            enum2 = 'interrupted';
            break;
          }
          case 12: {
            enum2 = 'invalid';
            break;
          }
          case 13: {
            enum2 = 'io';
            break;
          }
          case 14: {
            enum2 = 'is-directory';
            break;
          }
          case 15: {
            enum2 = 'loop';
            break;
          }
          case 16: {
            enum2 = 'too-many-links';
            break;
          }
          case 17: {
            enum2 = 'message-size';
            break;
          }
          case 18: {
            enum2 = 'name-too-long';
            break;
          }
          case 19: {
            enum2 = 'no-device';
            break;
          }
          case 20: {
            enum2 = 'no-entry';
            break;
          }
          case 21: {
            enum2 = 'no-lock';
            break;
          }
          case 22: {
            enum2 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum2 = 'insufficient-space';
            break;
          }
          case 24: {
            enum2 = 'not-directory';
            break;
          }
          case 25: {
            enum2 = 'not-empty';
            break;
          }
          case 26: {
            enum2 = 'not-recoverable';
            break;
          }
          case 27: {
            enum2 = 'unsupported';
            break;
          }
          case 28: {
            enum2 = 'no-tty';
            break;
          }
          case 29: {
            enum2 = 'no-such-device';
            break;
          }
          case 30: {
            enum2 = 'overflow';
            break;
          }
          case 31: {
            enum2 = 'not-permitted';
            break;
          }
          case 32: {
            enum2 = 'pipe';
            break;
          }
          case 33: {
            enum2 = 'read-only';
            break;
          }
          case 34: {
            enum2 = 'invalid-seek';
            break;
          }
          case 35: {
            enum2 = 'text-file-busy';
            break;
          }
          case 36: {
            enum2 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant3= {
          tag: 'err',
          val: enum2
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
  };
  
  Descriptor$1.prototype.setTimes = function setTimes(arg1, arg2) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var variant3 = arg1;
    let variant3_0;
    let variant3_1;
    let variant3_2;
    switch (variant3.tag) {
      case 'no-change': {
        variant3_0 = 0;
        variant3_1 = 0n;
        variant3_2 = 0;
        break;
      }
      case 'now': {
        variant3_0 = 1;
        variant3_1 = 0n;
        variant3_2 = 0;
        break;
      }
      case 'timestamp': {
        const e = variant3.val;
        var {seconds: v2_0, nanoseconds: v2_1 } = e;
        variant3_0 = 2;
        variant3_1 = toUint64(v2_0);
        variant3_2 = toUint32(v2_1);
        break;
      }
      default: {
        throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant3.tag)}\` (received \`${variant3}\`) specified for \`NewTimestamp\``);
      }
    }
    var variant5 = arg2;
    let variant5_0;
    let variant5_1;
    let variant5_2;
    switch (variant5.tag) {
      case 'no-change': {
        variant5_0 = 0;
        variant5_1 = 0n;
        variant5_2 = 0;
        break;
      }
      case 'now': {
        variant5_0 = 1;
        variant5_1 = 0n;
        variant5_2 = 0;
        break;
      }
      case 'timestamp': {
        const e = variant5.val;
        var {seconds: v4_0, nanoseconds: v4_1 } = e;
        variant5_0 = 2;
        variant5_1 = toUint64(v4_0);
        variant5_2 = toUint32(v4_1);
        break;
      }
      default: {
        throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`NewTimestamp\``);
      }
    }
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.set-times'](handle0, variant3_0, variant3_1, variant3_2, variant5_0, variant5_1, variant5_2);
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
        let enum6;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum6 = 'access';
            break;
          }
          case 1: {
            enum6 = 'would-block';
            break;
          }
          case 2: {
            enum6 = 'already';
            break;
          }
          case 3: {
            enum6 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum6 = 'busy';
            break;
          }
          case 5: {
            enum6 = 'deadlock';
            break;
          }
          case 6: {
            enum6 = 'quota';
            break;
          }
          case 7: {
            enum6 = 'exist';
            break;
          }
          case 8: {
            enum6 = 'file-too-large';
            break;
          }
          case 9: {
            enum6 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum6 = 'in-progress';
            break;
          }
          case 11: {
            enum6 = 'interrupted';
            break;
          }
          case 12: {
            enum6 = 'invalid';
            break;
          }
          case 13: {
            enum6 = 'io';
            break;
          }
          case 14: {
            enum6 = 'is-directory';
            break;
          }
          case 15: {
            enum6 = 'loop';
            break;
          }
          case 16: {
            enum6 = 'too-many-links';
            break;
          }
          case 17: {
            enum6 = 'message-size';
            break;
          }
          case 18: {
            enum6 = 'name-too-long';
            break;
          }
          case 19: {
            enum6 = 'no-device';
            break;
          }
          case 20: {
            enum6 = 'no-entry';
            break;
          }
          case 21: {
            enum6 = 'no-lock';
            break;
          }
          case 22: {
            enum6 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum6 = 'insufficient-space';
            break;
          }
          case 24: {
            enum6 = 'not-directory';
            break;
          }
          case 25: {
            enum6 = 'not-empty';
            break;
          }
          case 26: {
            enum6 = 'not-recoverable';
            break;
          }
          case 27: {
            enum6 = 'unsupported';
            break;
          }
          case 28: {
            enum6 = 'no-tty';
            break;
          }
          case 29: {
            enum6 = 'no-such-device';
            break;
          }
          case 30: {
            enum6 = 'overflow';
            break;
          }
          case 31: {
            enum6 = 'not-permitted';
            break;
          }
          case 32: {
            enum6 = 'pipe';
            break;
          }
          case 33: {
            enum6 = 'read-only';
            break;
          }
          case 34: {
            enum6 = 'invalid-seek';
            break;
          }
          case 35: {
            enum6 = 'text-file-busy';
            break;
          }
          case 36: {
            enum6 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant7= {
          tag: 'err',
          val: enum6
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  };
  
  Descriptor$1.prototype.read = function read(arg1, arg2) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.read'](handle0, toUint64(arg1), toUint64(arg2));
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var ptr2 = dataView(memory0).getInt32(ret + 4, true);
        var len2 = dataView(memory0).getInt32(ret + 8, true);
        var result2 = new Uint8Array(memory0.buffer.slice(ptr2, ptr2 + len2 * 1));
        var bool3 = dataView(memory0).getUint8(ret + 12, true);
        variant5= {
          tag: 'ok',
          val: [result2, bool3 == 0 ? false : (bool3 == 1 ? true : throwInvalidBool())]
        };
        break;
      }
      case 1: {
        let enum4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            enum4 = 'access';
            break;
          }
          case 1: {
            enum4 = 'would-block';
            break;
          }
          case 2: {
            enum4 = 'already';
            break;
          }
          case 3: {
            enum4 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum4 = 'busy';
            break;
          }
          case 5: {
            enum4 = 'deadlock';
            break;
          }
          case 6: {
            enum4 = 'quota';
            break;
          }
          case 7: {
            enum4 = 'exist';
            break;
          }
          case 8: {
            enum4 = 'file-too-large';
            break;
          }
          case 9: {
            enum4 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum4 = 'in-progress';
            break;
          }
          case 11: {
            enum4 = 'interrupted';
            break;
          }
          case 12: {
            enum4 = 'invalid';
            break;
          }
          case 13: {
            enum4 = 'io';
            break;
          }
          case 14: {
            enum4 = 'is-directory';
            break;
          }
          case 15: {
            enum4 = 'loop';
            break;
          }
          case 16: {
            enum4 = 'too-many-links';
            break;
          }
          case 17: {
            enum4 = 'message-size';
            break;
          }
          case 18: {
            enum4 = 'name-too-long';
            break;
          }
          case 19: {
            enum4 = 'no-device';
            break;
          }
          case 20: {
            enum4 = 'no-entry';
            break;
          }
          case 21: {
            enum4 = 'no-lock';
            break;
          }
          case 22: {
            enum4 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum4 = 'insufficient-space';
            break;
          }
          case 24: {
            enum4 = 'not-directory';
            break;
          }
          case 25: {
            enum4 = 'not-empty';
            break;
          }
          case 26: {
            enum4 = 'not-recoverable';
            break;
          }
          case 27: {
            enum4 = 'unsupported';
            break;
          }
          case 28: {
            enum4 = 'no-tty';
            break;
          }
          case 29: {
            enum4 = 'no-such-device';
            break;
          }
          case 30: {
            enum4 = 'overflow';
            break;
          }
          case 31: {
            enum4 = 'not-permitted';
            break;
          }
          case 32: {
            enum4 = 'pipe';
            break;
          }
          case 33: {
            enum4 = 'read-only';
            break;
          }
          case 34: {
            enum4 = 'invalid-seek';
            break;
          }
          case 35: {
            enum4 = 'text-file-busy';
            break;
          }
          case 36: {
            enum4 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant5= {
          tag: 'err',
          val: enum4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn5(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  Descriptor$1.prototype.write = function write(arg1, arg2) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var val2 = arg1;
    var len2 = val2.byteLength;
    var ptr2 = realloc0(0, 0, 1, len2 * 1);
    var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
    (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.write'](handle0, ptr2, len2, toUint64(arg2));
    let variant4;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant4= {
          tag: 'ok',
          val: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 8, true))
        };
        break;
      }
      case 1: {
        let enum3;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            enum3 = 'access';
            break;
          }
          case 1: {
            enum3 = 'would-block';
            break;
          }
          case 2: {
            enum3 = 'already';
            break;
          }
          case 3: {
            enum3 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum3 = 'busy';
            break;
          }
          case 5: {
            enum3 = 'deadlock';
            break;
          }
          case 6: {
            enum3 = 'quota';
            break;
          }
          case 7: {
            enum3 = 'exist';
            break;
          }
          case 8: {
            enum3 = 'file-too-large';
            break;
          }
          case 9: {
            enum3 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum3 = 'in-progress';
            break;
          }
          case 11: {
            enum3 = 'interrupted';
            break;
          }
          case 12: {
            enum3 = 'invalid';
            break;
          }
          case 13: {
            enum3 = 'io';
            break;
          }
          case 14: {
            enum3 = 'is-directory';
            break;
          }
          case 15: {
            enum3 = 'loop';
            break;
          }
          case 16: {
            enum3 = 'too-many-links';
            break;
          }
          case 17: {
            enum3 = 'message-size';
            break;
          }
          case 18: {
            enum3 = 'name-too-long';
            break;
          }
          case 19: {
            enum3 = 'no-device';
            break;
          }
          case 20: {
            enum3 = 'no-entry';
            break;
          }
          case 21: {
            enum3 = 'no-lock';
            break;
          }
          case 22: {
            enum3 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum3 = 'insufficient-space';
            break;
          }
          case 24: {
            enum3 = 'not-directory';
            break;
          }
          case 25: {
            enum3 = 'not-empty';
            break;
          }
          case 26: {
            enum3 = 'not-recoverable';
            break;
          }
          case 27: {
            enum3 = 'unsupported';
            break;
          }
          case 28: {
            enum3 = 'no-tty';
            break;
          }
          case 29: {
            enum3 = 'no-such-device';
            break;
          }
          case 30: {
            enum3 = 'overflow';
            break;
          }
          case 31: {
            enum3 = 'not-permitted';
            break;
          }
          case 32: {
            enum3 = 'pipe';
            break;
          }
          case 33: {
            enum3 = 'read-only';
            break;
          }
          case 34: {
            enum3 = 'invalid-seek';
            break;
          }
          case 35: {
            enum3 = 'text-file-busy';
            break;
          }
          case 36: {
            enum3 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant4= {
          tag: 'err',
          val: enum3
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
  };
  
  Descriptor$1.prototype.readDirectory = function readDirectory() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.read-directory'](handle0);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var handle3 = dataView(memory0).getInt32(ret + 4, true);
        var rsc2 = new.target === DirectoryEntryStream ? this : Object.create(DirectoryEntryStream.prototype);
        Object.defineProperty(rsc2, symbolRscHandle, { writable: true, value: handle3});
        finalizationRegistry13.register(rsc2, handle3, rsc2);
        Object.defineProperty(rsc2, symbolDispose, { writable: true, value: function () {
          finalizationRegistry13.unregister(rsc2);
          rscTableRemove(handleTable13, handle3);
          rsc2[symbolDispose] = emptyFunc;
          rsc2[symbolRscHandle] = null;
          exports0['50'](handleTable13[(handle3 << 1) + 1] & ~T_FLAG);
        }});
        variant5= {
          tag: 'ok',
          val: rsc2
        };
        break;
      }
      case 1: {
        let enum4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            enum4 = 'access';
            break;
          }
          case 1: {
            enum4 = 'would-block';
            break;
          }
          case 2: {
            enum4 = 'already';
            break;
          }
          case 3: {
            enum4 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum4 = 'busy';
            break;
          }
          case 5: {
            enum4 = 'deadlock';
            break;
          }
          case 6: {
            enum4 = 'quota';
            break;
          }
          case 7: {
            enum4 = 'exist';
            break;
          }
          case 8: {
            enum4 = 'file-too-large';
            break;
          }
          case 9: {
            enum4 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum4 = 'in-progress';
            break;
          }
          case 11: {
            enum4 = 'interrupted';
            break;
          }
          case 12: {
            enum4 = 'invalid';
            break;
          }
          case 13: {
            enum4 = 'io';
            break;
          }
          case 14: {
            enum4 = 'is-directory';
            break;
          }
          case 15: {
            enum4 = 'loop';
            break;
          }
          case 16: {
            enum4 = 'too-many-links';
            break;
          }
          case 17: {
            enum4 = 'message-size';
            break;
          }
          case 18: {
            enum4 = 'name-too-long';
            break;
          }
          case 19: {
            enum4 = 'no-device';
            break;
          }
          case 20: {
            enum4 = 'no-entry';
            break;
          }
          case 21: {
            enum4 = 'no-lock';
            break;
          }
          case 22: {
            enum4 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum4 = 'insufficient-space';
            break;
          }
          case 24: {
            enum4 = 'not-directory';
            break;
          }
          case 25: {
            enum4 = 'not-empty';
            break;
          }
          case 26: {
            enum4 = 'not-recoverable';
            break;
          }
          case 27: {
            enum4 = 'unsupported';
            break;
          }
          case 28: {
            enum4 = 'no-tty';
            break;
          }
          case 29: {
            enum4 = 'no-such-device';
            break;
          }
          case 30: {
            enum4 = 'overflow';
            break;
          }
          case 31: {
            enum4 = 'not-permitted';
            break;
          }
          case 32: {
            enum4 = 'pipe';
            break;
          }
          case 33: {
            enum4 = 'read-only';
            break;
          }
          case 34: {
            enum4 = 'invalid-seek';
            break;
          }
          case 35: {
            enum4 = 'text-file-busy';
            break;
          }
          case 36: {
            enum4 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant5= {
          tag: 'err',
          val: enum4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  Descriptor$1.prototype.sync = function sync() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.sync'](handle0);
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
        let enum2;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum2 = 'access';
            break;
          }
          case 1: {
            enum2 = 'would-block';
            break;
          }
          case 2: {
            enum2 = 'already';
            break;
          }
          case 3: {
            enum2 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum2 = 'busy';
            break;
          }
          case 5: {
            enum2 = 'deadlock';
            break;
          }
          case 6: {
            enum2 = 'quota';
            break;
          }
          case 7: {
            enum2 = 'exist';
            break;
          }
          case 8: {
            enum2 = 'file-too-large';
            break;
          }
          case 9: {
            enum2 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum2 = 'in-progress';
            break;
          }
          case 11: {
            enum2 = 'interrupted';
            break;
          }
          case 12: {
            enum2 = 'invalid';
            break;
          }
          case 13: {
            enum2 = 'io';
            break;
          }
          case 14: {
            enum2 = 'is-directory';
            break;
          }
          case 15: {
            enum2 = 'loop';
            break;
          }
          case 16: {
            enum2 = 'too-many-links';
            break;
          }
          case 17: {
            enum2 = 'message-size';
            break;
          }
          case 18: {
            enum2 = 'name-too-long';
            break;
          }
          case 19: {
            enum2 = 'no-device';
            break;
          }
          case 20: {
            enum2 = 'no-entry';
            break;
          }
          case 21: {
            enum2 = 'no-lock';
            break;
          }
          case 22: {
            enum2 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum2 = 'insufficient-space';
            break;
          }
          case 24: {
            enum2 = 'not-directory';
            break;
          }
          case 25: {
            enum2 = 'not-empty';
            break;
          }
          case 26: {
            enum2 = 'not-recoverable';
            break;
          }
          case 27: {
            enum2 = 'unsupported';
            break;
          }
          case 28: {
            enum2 = 'no-tty';
            break;
          }
          case 29: {
            enum2 = 'no-such-device';
            break;
          }
          case 30: {
            enum2 = 'overflow';
            break;
          }
          case 31: {
            enum2 = 'not-permitted';
            break;
          }
          case 32: {
            enum2 = 'pipe';
            break;
          }
          case 33: {
            enum2 = 'read-only';
            break;
          }
          case 34: {
            enum2 = 'invalid-seek';
            break;
          }
          case 35: {
            enum2 = 'text-file-busy';
            break;
          }
          case 36: {
            enum2 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant3= {
          tag: 'err',
          val: enum2
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
  };
  
  Descriptor$1.prototype.createDirectoryAt = function createDirectoryAt(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var ptr2 = utf8Encode(arg1, realloc0, memory0);
    var len2 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.create-directory-at'](handle0, ptr2, len2);
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
        let enum3;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum3 = 'access';
            break;
          }
          case 1: {
            enum3 = 'would-block';
            break;
          }
          case 2: {
            enum3 = 'already';
            break;
          }
          case 3: {
            enum3 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum3 = 'busy';
            break;
          }
          case 5: {
            enum3 = 'deadlock';
            break;
          }
          case 6: {
            enum3 = 'quota';
            break;
          }
          case 7: {
            enum3 = 'exist';
            break;
          }
          case 8: {
            enum3 = 'file-too-large';
            break;
          }
          case 9: {
            enum3 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum3 = 'in-progress';
            break;
          }
          case 11: {
            enum3 = 'interrupted';
            break;
          }
          case 12: {
            enum3 = 'invalid';
            break;
          }
          case 13: {
            enum3 = 'io';
            break;
          }
          case 14: {
            enum3 = 'is-directory';
            break;
          }
          case 15: {
            enum3 = 'loop';
            break;
          }
          case 16: {
            enum3 = 'too-many-links';
            break;
          }
          case 17: {
            enum3 = 'message-size';
            break;
          }
          case 18: {
            enum3 = 'name-too-long';
            break;
          }
          case 19: {
            enum3 = 'no-device';
            break;
          }
          case 20: {
            enum3 = 'no-entry';
            break;
          }
          case 21: {
            enum3 = 'no-lock';
            break;
          }
          case 22: {
            enum3 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum3 = 'insufficient-space';
            break;
          }
          case 24: {
            enum3 = 'not-directory';
            break;
          }
          case 25: {
            enum3 = 'not-empty';
            break;
          }
          case 26: {
            enum3 = 'not-recoverable';
            break;
          }
          case 27: {
            enum3 = 'unsupported';
            break;
          }
          case 28: {
            enum3 = 'no-tty';
            break;
          }
          case 29: {
            enum3 = 'no-such-device';
            break;
          }
          case 30: {
            enum3 = 'overflow';
            break;
          }
          case 31: {
            enum3 = 'not-permitted';
            break;
          }
          case 32: {
            enum3 = 'pipe';
            break;
          }
          case 33: {
            enum3 = 'read-only';
            break;
          }
          case 34: {
            enum3 = 'invalid-seek';
            break;
          }
          case 35: {
            enum3 = 'text-file-busy';
            break;
          }
          case 36: {
            enum3 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant4= {
          tag: 'err',
          val: enum3
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
  };
  
  Descriptor$1.prototype.stat = function stat() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.stat'](handle0);
    let variant7;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        let enum2;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            enum2 = 'unknown';
            break;
          }
          case 1: {
            enum2 = 'block-device';
            break;
          }
          case 2: {
            enum2 = 'character-device';
            break;
          }
          case 3: {
            enum2 = 'directory';
            break;
          }
          case 4: {
            enum2 = 'fifo';
            break;
          }
          case 5: {
            enum2 = 'symbolic-link';
            break;
          }
          case 6: {
            enum2 = 'regular-file';
            break;
          }
          case 7: {
            enum2 = 'socket';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for DescriptorType');
          }
        }
        let variant3;
        switch (dataView(memory0).getUint8(ret + 32, true)) {
          case 0: {
            variant3 = undefined;
            break;
          }
          case 1: {
            variant3 = {
              seconds: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 40, true)),
              nanoseconds: dataView(memory0).getInt32(ret + 48, true) >>> 0,
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        let variant4;
        switch (dataView(memory0).getUint8(ret + 56, true)) {
          case 0: {
            variant4 = undefined;
            break;
          }
          case 1: {
            variant4 = {
              seconds: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 64, true)),
              nanoseconds: dataView(memory0).getInt32(ret + 72, true) >>> 0,
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        let variant5;
        switch (dataView(memory0).getUint8(ret + 80, true)) {
          case 0: {
            variant5 = undefined;
            break;
          }
          case 1: {
            variant5 = {
              seconds: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 88, true)),
              nanoseconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        variant7= {
          tag: 'ok',
          val: {
            type: enum2,
            linkCount: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 16, true)),
            size: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 24, true)),
            dataAccessTimestamp: variant3,
            dataModificationTimestamp: variant4,
            statusChangeTimestamp: variant5,
          }
        };
        break;
      }
      case 1: {
        let enum6;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            enum6 = 'access';
            break;
          }
          case 1: {
            enum6 = 'would-block';
            break;
          }
          case 2: {
            enum6 = 'already';
            break;
          }
          case 3: {
            enum6 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum6 = 'busy';
            break;
          }
          case 5: {
            enum6 = 'deadlock';
            break;
          }
          case 6: {
            enum6 = 'quota';
            break;
          }
          case 7: {
            enum6 = 'exist';
            break;
          }
          case 8: {
            enum6 = 'file-too-large';
            break;
          }
          case 9: {
            enum6 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum6 = 'in-progress';
            break;
          }
          case 11: {
            enum6 = 'interrupted';
            break;
          }
          case 12: {
            enum6 = 'invalid';
            break;
          }
          case 13: {
            enum6 = 'io';
            break;
          }
          case 14: {
            enum6 = 'is-directory';
            break;
          }
          case 15: {
            enum6 = 'loop';
            break;
          }
          case 16: {
            enum6 = 'too-many-links';
            break;
          }
          case 17: {
            enum6 = 'message-size';
            break;
          }
          case 18: {
            enum6 = 'name-too-long';
            break;
          }
          case 19: {
            enum6 = 'no-device';
            break;
          }
          case 20: {
            enum6 = 'no-entry';
            break;
          }
          case 21: {
            enum6 = 'no-lock';
            break;
          }
          case 22: {
            enum6 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum6 = 'insufficient-space';
            break;
          }
          case 24: {
            enum6 = 'not-directory';
            break;
          }
          case 25: {
            enum6 = 'not-empty';
            break;
          }
          case 26: {
            enum6 = 'not-recoverable';
            break;
          }
          case 27: {
            enum6 = 'unsupported';
            break;
          }
          case 28: {
            enum6 = 'no-tty';
            break;
          }
          case 29: {
            enum6 = 'no-such-device';
            break;
          }
          case 30: {
            enum6 = 'overflow';
            break;
          }
          case 31: {
            enum6 = 'not-permitted';
            break;
          }
          case 32: {
            enum6 = 'pipe';
            break;
          }
          case 33: {
            enum6 = 'read-only';
            break;
          }
          case 34: {
            enum6 = 'invalid-seek';
            break;
          }
          case 35: {
            enum6 = 'text-file-busy';
            break;
          }
          case 36: {
            enum6 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant7= {
          tag: 'err',
          val: enum6
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  };
  
  Descriptor$1.prototype.statAt = function statAt(arg1, arg2) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    let flags2 = 0;
    if (typeof arg1 === 'object' && arg1 !== null) {
      flags2 = Boolean(arg1.symlinkFollow) << 0;
    } else if (arg1 !== null && arg1!== undefined) {
      throw new TypeError('only an object, undefined or null can be converted to flags');
    }
    var ptr3 = utf8Encode(arg2, realloc0, memory0);
    var len3 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.stat-at'](handle0, flags2, ptr3, len3);
    let variant9;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        let enum4;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            enum4 = 'unknown';
            break;
          }
          case 1: {
            enum4 = 'block-device';
            break;
          }
          case 2: {
            enum4 = 'character-device';
            break;
          }
          case 3: {
            enum4 = 'directory';
            break;
          }
          case 4: {
            enum4 = 'fifo';
            break;
          }
          case 5: {
            enum4 = 'symbolic-link';
            break;
          }
          case 6: {
            enum4 = 'regular-file';
            break;
          }
          case 7: {
            enum4 = 'socket';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for DescriptorType');
          }
        }
        let variant5;
        switch (dataView(memory0).getUint8(ret + 32, true)) {
          case 0: {
            variant5 = undefined;
            break;
          }
          case 1: {
            variant5 = {
              seconds: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 40, true)),
              nanoseconds: dataView(memory0).getInt32(ret + 48, true) >>> 0,
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        let variant6;
        switch (dataView(memory0).getUint8(ret + 56, true)) {
          case 0: {
            variant6 = undefined;
            break;
          }
          case 1: {
            variant6 = {
              seconds: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 64, true)),
              nanoseconds: dataView(memory0).getInt32(ret + 72, true) >>> 0,
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        let variant7;
        switch (dataView(memory0).getUint8(ret + 80, true)) {
          case 0: {
            variant7 = undefined;
            break;
          }
          case 1: {
            variant7 = {
              seconds: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 88, true)),
              nanoseconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        variant9= {
          tag: 'ok',
          val: {
            type: enum4,
            linkCount: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 16, true)),
            size: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 24, true)),
            dataAccessTimestamp: variant5,
            dataModificationTimestamp: variant6,
            statusChangeTimestamp: variant7,
          }
        };
        break;
      }
      case 1: {
        let enum8;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            enum8 = 'access';
            break;
          }
          case 1: {
            enum8 = 'would-block';
            break;
          }
          case 2: {
            enum8 = 'already';
            break;
          }
          case 3: {
            enum8 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum8 = 'busy';
            break;
          }
          case 5: {
            enum8 = 'deadlock';
            break;
          }
          case 6: {
            enum8 = 'quota';
            break;
          }
          case 7: {
            enum8 = 'exist';
            break;
          }
          case 8: {
            enum8 = 'file-too-large';
            break;
          }
          case 9: {
            enum8 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum8 = 'in-progress';
            break;
          }
          case 11: {
            enum8 = 'interrupted';
            break;
          }
          case 12: {
            enum8 = 'invalid';
            break;
          }
          case 13: {
            enum8 = 'io';
            break;
          }
          case 14: {
            enum8 = 'is-directory';
            break;
          }
          case 15: {
            enum8 = 'loop';
            break;
          }
          case 16: {
            enum8 = 'too-many-links';
            break;
          }
          case 17: {
            enum8 = 'message-size';
            break;
          }
          case 18: {
            enum8 = 'name-too-long';
            break;
          }
          case 19: {
            enum8 = 'no-device';
            break;
          }
          case 20: {
            enum8 = 'no-entry';
            break;
          }
          case 21: {
            enum8 = 'no-lock';
            break;
          }
          case 22: {
            enum8 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum8 = 'insufficient-space';
            break;
          }
          case 24: {
            enum8 = 'not-directory';
            break;
          }
          case 25: {
            enum8 = 'not-empty';
            break;
          }
          case 26: {
            enum8 = 'not-recoverable';
            break;
          }
          case 27: {
            enum8 = 'unsupported';
            break;
          }
          case 28: {
            enum8 = 'no-tty';
            break;
          }
          case 29: {
            enum8 = 'no-such-device';
            break;
          }
          case 30: {
            enum8 = 'overflow';
            break;
          }
          case 31: {
            enum8 = 'not-permitted';
            break;
          }
          case 32: {
            enum8 = 'pipe';
            break;
          }
          case 33: {
            enum8 = 'read-only';
            break;
          }
          case 34: {
            enum8 = 'invalid-seek';
            break;
          }
          case 35: {
            enum8 = 'text-file-busy';
            break;
          }
          case 36: {
            enum8 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant9= {
          tag: 'err',
          val: enum8
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant9.tag === 'err') {
      throw new ComponentError(variant9.val);
    }
    return variant9.val;
  };
  
  Descriptor$1.prototype.setTimesAt = function setTimesAt(arg1, arg2, arg3, arg4) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    let flags2 = 0;
    if (typeof arg1 === 'object' && arg1 !== null) {
      flags2 = Boolean(arg1.symlinkFollow) << 0;
    } else if (arg1 !== null && arg1!== undefined) {
      throw new TypeError('only an object, undefined or null can be converted to flags');
    }
    var ptr3 = utf8Encode(arg2, realloc0, memory0);
    var len3 = utf8EncodedLen;
    var variant5 = arg3;
    let variant5_0;
    let variant5_1;
    let variant5_2;
    switch (variant5.tag) {
      case 'no-change': {
        variant5_0 = 0;
        variant5_1 = 0n;
        variant5_2 = 0;
        break;
      }
      case 'now': {
        variant5_0 = 1;
        variant5_1 = 0n;
        variant5_2 = 0;
        break;
      }
      case 'timestamp': {
        const e = variant5.val;
        var {seconds: v4_0, nanoseconds: v4_1 } = e;
        variant5_0 = 2;
        variant5_1 = toUint64(v4_0);
        variant5_2 = toUint32(v4_1);
        break;
      }
      default: {
        throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant5.tag)}\` (received \`${variant5}\`) specified for \`NewTimestamp\``);
      }
    }
    var variant7 = arg4;
    let variant7_0;
    let variant7_1;
    let variant7_2;
    switch (variant7.tag) {
      case 'no-change': {
        variant7_0 = 0;
        variant7_1 = 0n;
        variant7_2 = 0;
        break;
      }
      case 'now': {
        variant7_0 = 1;
        variant7_1 = 0n;
        variant7_2 = 0;
        break;
      }
      case 'timestamp': {
        const e = variant7.val;
        var {seconds: v6_0, nanoseconds: v6_1 } = e;
        variant7_0 = 2;
        variant7_1 = toUint64(v6_0);
        variant7_2 = toUint32(v6_1);
        break;
      }
      default: {
        throw new TypeError(`invalid variant tag value \`${JSON.stringify(variant7.tag)}\` (received \`${variant7}\`) specified for \`NewTimestamp\``);
      }
    }
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.set-times-at'](handle0, flags2, ptr3, len3, variant5_0, variant5_1, variant5_2, variant7_0, variant7_1, variant7_2);
    let variant9;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant9= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let enum8;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum8 = 'access';
            break;
          }
          case 1: {
            enum8 = 'would-block';
            break;
          }
          case 2: {
            enum8 = 'already';
            break;
          }
          case 3: {
            enum8 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum8 = 'busy';
            break;
          }
          case 5: {
            enum8 = 'deadlock';
            break;
          }
          case 6: {
            enum8 = 'quota';
            break;
          }
          case 7: {
            enum8 = 'exist';
            break;
          }
          case 8: {
            enum8 = 'file-too-large';
            break;
          }
          case 9: {
            enum8 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum8 = 'in-progress';
            break;
          }
          case 11: {
            enum8 = 'interrupted';
            break;
          }
          case 12: {
            enum8 = 'invalid';
            break;
          }
          case 13: {
            enum8 = 'io';
            break;
          }
          case 14: {
            enum8 = 'is-directory';
            break;
          }
          case 15: {
            enum8 = 'loop';
            break;
          }
          case 16: {
            enum8 = 'too-many-links';
            break;
          }
          case 17: {
            enum8 = 'message-size';
            break;
          }
          case 18: {
            enum8 = 'name-too-long';
            break;
          }
          case 19: {
            enum8 = 'no-device';
            break;
          }
          case 20: {
            enum8 = 'no-entry';
            break;
          }
          case 21: {
            enum8 = 'no-lock';
            break;
          }
          case 22: {
            enum8 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum8 = 'insufficient-space';
            break;
          }
          case 24: {
            enum8 = 'not-directory';
            break;
          }
          case 25: {
            enum8 = 'not-empty';
            break;
          }
          case 26: {
            enum8 = 'not-recoverable';
            break;
          }
          case 27: {
            enum8 = 'unsupported';
            break;
          }
          case 28: {
            enum8 = 'no-tty';
            break;
          }
          case 29: {
            enum8 = 'no-such-device';
            break;
          }
          case 30: {
            enum8 = 'overflow';
            break;
          }
          case 31: {
            enum8 = 'not-permitted';
            break;
          }
          case 32: {
            enum8 = 'pipe';
            break;
          }
          case 33: {
            enum8 = 'read-only';
            break;
          }
          case 34: {
            enum8 = 'invalid-seek';
            break;
          }
          case 35: {
            enum8 = 'text-file-busy';
            break;
          }
          case 36: {
            enum8 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant9= {
          tag: 'err',
          val: enum8
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant9.tag === 'err') {
      throw new ComponentError(variant9.val);
    }
    return variant9.val;
  };
  
  Descriptor$1.prototype.linkAt = function linkAt(arg1, arg2, arg3, arg4) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    let flags2 = 0;
    if (typeof arg1 === 'object' && arg1 !== null) {
      flags2 = Boolean(arg1.symlinkFollow) << 0;
    } else if (arg1 !== null && arg1!== undefined) {
      throw new TypeError('only an object, undefined or null can be converted to flags');
    }
    var ptr3 = utf8Encode(arg2, realloc0, memory0);
    var len3 = utf8EncodedLen;
    var handle5 = arg3[symbolRscHandle];
    if (!handle5 || (handleTable12[(handle5 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle4 = handleTable12[(handle5 << 1) + 1] & ~T_FLAG;
    var ptr6 = utf8Encode(arg4, realloc0, memory0);
    var len6 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.link-at'](handle0, flags2, ptr3, len3, handle4, ptr6, len6);
    let variant8;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant8= {
          tag: 'ok',
          val: undefined
        };
        break;
      }
      case 1: {
        let enum7;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum7 = 'access';
            break;
          }
          case 1: {
            enum7 = 'would-block';
            break;
          }
          case 2: {
            enum7 = 'already';
            break;
          }
          case 3: {
            enum7 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum7 = 'busy';
            break;
          }
          case 5: {
            enum7 = 'deadlock';
            break;
          }
          case 6: {
            enum7 = 'quota';
            break;
          }
          case 7: {
            enum7 = 'exist';
            break;
          }
          case 8: {
            enum7 = 'file-too-large';
            break;
          }
          case 9: {
            enum7 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum7 = 'in-progress';
            break;
          }
          case 11: {
            enum7 = 'interrupted';
            break;
          }
          case 12: {
            enum7 = 'invalid';
            break;
          }
          case 13: {
            enum7 = 'io';
            break;
          }
          case 14: {
            enum7 = 'is-directory';
            break;
          }
          case 15: {
            enum7 = 'loop';
            break;
          }
          case 16: {
            enum7 = 'too-many-links';
            break;
          }
          case 17: {
            enum7 = 'message-size';
            break;
          }
          case 18: {
            enum7 = 'name-too-long';
            break;
          }
          case 19: {
            enum7 = 'no-device';
            break;
          }
          case 20: {
            enum7 = 'no-entry';
            break;
          }
          case 21: {
            enum7 = 'no-lock';
            break;
          }
          case 22: {
            enum7 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum7 = 'insufficient-space';
            break;
          }
          case 24: {
            enum7 = 'not-directory';
            break;
          }
          case 25: {
            enum7 = 'not-empty';
            break;
          }
          case 26: {
            enum7 = 'not-recoverable';
            break;
          }
          case 27: {
            enum7 = 'unsupported';
            break;
          }
          case 28: {
            enum7 = 'no-tty';
            break;
          }
          case 29: {
            enum7 = 'no-such-device';
            break;
          }
          case 30: {
            enum7 = 'overflow';
            break;
          }
          case 31: {
            enum7 = 'not-permitted';
            break;
          }
          case 32: {
            enum7 = 'pipe';
            break;
          }
          case 33: {
            enum7 = 'read-only';
            break;
          }
          case 34: {
            enum7 = 'invalid-seek';
            break;
          }
          case 35: {
            enum7 = 'text-file-busy';
            break;
          }
          case 36: {
            enum7 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant8= {
          tag: 'err',
          val: enum7
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant8.tag === 'err') {
      throw new ComponentError(variant8.val);
    }
    return variant8.val;
  };
  
  Descriptor$1.prototype.openAt = function openAt(arg1, arg2, arg3, arg4) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    let flags2 = 0;
    if (typeof arg1 === 'object' && arg1 !== null) {
      flags2 = Boolean(arg1.symlinkFollow) << 0;
    } else if (arg1 !== null && arg1!== undefined) {
      throw new TypeError('only an object, undefined or null can be converted to flags');
    }
    var ptr3 = utf8Encode(arg2, realloc0, memory0);
    var len3 = utf8EncodedLen;
    let flags4 = 0;
    if (typeof arg3 === 'object' && arg3 !== null) {
      flags4 = Boolean(arg3.create) << 0 | Boolean(arg3.directory) << 1 | Boolean(arg3.exclusive) << 2 | Boolean(arg3.truncate) << 3;
    } else if (arg3 !== null && arg3!== undefined) {
      throw new TypeError('only an object, undefined or null can be converted to flags');
    }
    let flags5 = 0;
    if (typeof arg4 === 'object' && arg4 !== null) {
      flags5 = Boolean(arg4.read) << 0 | Boolean(arg4.write) << 1 | Boolean(arg4.fileIntegritySync) << 2 | Boolean(arg4.dataIntegritySync) << 3 | Boolean(arg4.requestedWriteSync) << 4 | Boolean(arg4.mutateDirectory) << 5;
    } else if (arg4 !== null && arg4!== undefined) {
      throw new TypeError('only an object, undefined or null can be converted to flags');
    }
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.open-at'](handle0, flags2, ptr3, len3, flags4, flags5);
    let variant9;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var handle7 = dataView(memory0).getInt32(ret + 4, true);
        var rsc6 = new.target === Descriptor$1 ? this : Object.create(Descriptor$1.prototype);
        Object.defineProperty(rsc6, symbolRscHandle, { writable: true, value: handle7});
        finalizationRegistry12.register(rsc6, handle7, rsc6);
        Object.defineProperty(rsc6, symbolDispose, { writable: true, value: function () {
          finalizationRegistry12.unregister(rsc6);
          rscTableRemove(handleTable12, handle7);
          rsc6[symbolDispose] = emptyFunc;
          rsc6[symbolRscHandle] = null;
          exports0['49'](handleTable12[(handle7 << 1) + 1] & ~T_FLAG);
        }});
        variant9= {
          tag: 'ok',
          val: rsc6
        };
        break;
      }
      case 1: {
        let enum8;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            enum8 = 'access';
            break;
          }
          case 1: {
            enum8 = 'would-block';
            break;
          }
          case 2: {
            enum8 = 'already';
            break;
          }
          case 3: {
            enum8 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum8 = 'busy';
            break;
          }
          case 5: {
            enum8 = 'deadlock';
            break;
          }
          case 6: {
            enum8 = 'quota';
            break;
          }
          case 7: {
            enum8 = 'exist';
            break;
          }
          case 8: {
            enum8 = 'file-too-large';
            break;
          }
          case 9: {
            enum8 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum8 = 'in-progress';
            break;
          }
          case 11: {
            enum8 = 'interrupted';
            break;
          }
          case 12: {
            enum8 = 'invalid';
            break;
          }
          case 13: {
            enum8 = 'io';
            break;
          }
          case 14: {
            enum8 = 'is-directory';
            break;
          }
          case 15: {
            enum8 = 'loop';
            break;
          }
          case 16: {
            enum8 = 'too-many-links';
            break;
          }
          case 17: {
            enum8 = 'message-size';
            break;
          }
          case 18: {
            enum8 = 'name-too-long';
            break;
          }
          case 19: {
            enum8 = 'no-device';
            break;
          }
          case 20: {
            enum8 = 'no-entry';
            break;
          }
          case 21: {
            enum8 = 'no-lock';
            break;
          }
          case 22: {
            enum8 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum8 = 'insufficient-space';
            break;
          }
          case 24: {
            enum8 = 'not-directory';
            break;
          }
          case 25: {
            enum8 = 'not-empty';
            break;
          }
          case 26: {
            enum8 = 'not-recoverable';
            break;
          }
          case 27: {
            enum8 = 'unsupported';
            break;
          }
          case 28: {
            enum8 = 'no-tty';
            break;
          }
          case 29: {
            enum8 = 'no-such-device';
            break;
          }
          case 30: {
            enum8 = 'overflow';
            break;
          }
          case 31: {
            enum8 = 'not-permitted';
            break;
          }
          case 32: {
            enum8 = 'pipe';
            break;
          }
          case 33: {
            enum8 = 'read-only';
            break;
          }
          case 34: {
            enum8 = 'invalid-seek';
            break;
          }
          case 35: {
            enum8 = 'text-file-busy';
            break;
          }
          case 36: {
            enum8 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant9= {
          tag: 'err',
          val: enum8
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant9.tag === 'err') {
      throw new ComponentError(variant9.val);
    }
    return variant9.val;
  };
  
  Descriptor$1.prototype.readlinkAt = function readlinkAt(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var ptr2 = utf8Encode(arg1, realloc0, memory0);
    var len2 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.readlink-at'](handle0, ptr2, len2);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        var ptr3 = dataView(memory0).getInt32(ret + 4, true);
        var len3 = dataView(memory0).getInt32(ret + 8, true);
        var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
        variant5= {
          tag: 'ok',
          val: result3
        };
        break;
      }
      case 1: {
        let enum4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            enum4 = 'access';
            break;
          }
          case 1: {
            enum4 = 'would-block';
            break;
          }
          case 2: {
            enum4 = 'already';
            break;
          }
          case 3: {
            enum4 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum4 = 'busy';
            break;
          }
          case 5: {
            enum4 = 'deadlock';
            break;
          }
          case 6: {
            enum4 = 'quota';
            break;
          }
          case 7: {
            enum4 = 'exist';
            break;
          }
          case 8: {
            enum4 = 'file-too-large';
            break;
          }
          case 9: {
            enum4 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum4 = 'in-progress';
            break;
          }
          case 11: {
            enum4 = 'interrupted';
            break;
          }
          case 12: {
            enum4 = 'invalid';
            break;
          }
          case 13: {
            enum4 = 'io';
            break;
          }
          case 14: {
            enum4 = 'is-directory';
            break;
          }
          case 15: {
            enum4 = 'loop';
            break;
          }
          case 16: {
            enum4 = 'too-many-links';
            break;
          }
          case 17: {
            enum4 = 'message-size';
            break;
          }
          case 18: {
            enum4 = 'name-too-long';
            break;
          }
          case 19: {
            enum4 = 'no-device';
            break;
          }
          case 20: {
            enum4 = 'no-entry';
            break;
          }
          case 21: {
            enum4 = 'no-lock';
            break;
          }
          case 22: {
            enum4 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum4 = 'insufficient-space';
            break;
          }
          case 24: {
            enum4 = 'not-directory';
            break;
          }
          case 25: {
            enum4 = 'not-empty';
            break;
          }
          case 26: {
            enum4 = 'not-recoverable';
            break;
          }
          case 27: {
            enum4 = 'unsupported';
            break;
          }
          case 28: {
            enum4 = 'no-tty';
            break;
          }
          case 29: {
            enum4 = 'no-such-device';
            break;
          }
          case 30: {
            enum4 = 'overflow';
            break;
          }
          case 31: {
            enum4 = 'not-permitted';
            break;
          }
          case 32: {
            enum4 = 'pipe';
            break;
          }
          case 33: {
            enum4 = 'read-only';
            break;
          }
          case 34: {
            enum4 = 'invalid-seek';
            break;
          }
          case 35: {
            enum4 = 'text-file-busy';
            break;
          }
          case 36: {
            enum4 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant5= {
          tag: 'err',
          val: enum4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn5(ret);
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  Descriptor$1.prototype.removeDirectoryAt = function removeDirectoryAt(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var ptr2 = utf8Encode(arg1, realloc0, memory0);
    var len2 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.remove-directory-at'](handle0, ptr2, len2);
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
        let enum3;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum3 = 'access';
            break;
          }
          case 1: {
            enum3 = 'would-block';
            break;
          }
          case 2: {
            enum3 = 'already';
            break;
          }
          case 3: {
            enum3 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum3 = 'busy';
            break;
          }
          case 5: {
            enum3 = 'deadlock';
            break;
          }
          case 6: {
            enum3 = 'quota';
            break;
          }
          case 7: {
            enum3 = 'exist';
            break;
          }
          case 8: {
            enum3 = 'file-too-large';
            break;
          }
          case 9: {
            enum3 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum3 = 'in-progress';
            break;
          }
          case 11: {
            enum3 = 'interrupted';
            break;
          }
          case 12: {
            enum3 = 'invalid';
            break;
          }
          case 13: {
            enum3 = 'io';
            break;
          }
          case 14: {
            enum3 = 'is-directory';
            break;
          }
          case 15: {
            enum3 = 'loop';
            break;
          }
          case 16: {
            enum3 = 'too-many-links';
            break;
          }
          case 17: {
            enum3 = 'message-size';
            break;
          }
          case 18: {
            enum3 = 'name-too-long';
            break;
          }
          case 19: {
            enum3 = 'no-device';
            break;
          }
          case 20: {
            enum3 = 'no-entry';
            break;
          }
          case 21: {
            enum3 = 'no-lock';
            break;
          }
          case 22: {
            enum3 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum3 = 'insufficient-space';
            break;
          }
          case 24: {
            enum3 = 'not-directory';
            break;
          }
          case 25: {
            enum3 = 'not-empty';
            break;
          }
          case 26: {
            enum3 = 'not-recoverable';
            break;
          }
          case 27: {
            enum3 = 'unsupported';
            break;
          }
          case 28: {
            enum3 = 'no-tty';
            break;
          }
          case 29: {
            enum3 = 'no-such-device';
            break;
          }
          case 30: {
            enum3 = 'overflow';
            break;
          }
          case 31: {
            enum3 = 'not-permitted';
            break;
          }
          case 32: {
            enum3 = 'pipe';
            break;
          }
          case 33: {
            enum3 = 'read-only';
            break;
          }
          case 34: {
            enum3 = 'invalid-seek';
            break;
          }
          case 35: {
            enum3 = 'text-file-busy';
            break;
          }
          case 36: {
            enum3 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant4= {
          tag: 'err',
          val: enum3
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
  };
  
  Descriptor$1.prototype.renameAt = function renameAt(arg1, arg2, arg3) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var ptr2 = utf8Encode(arg1, realloc0, memory0);
    var len2 = utf8EncodedLen;
    var handle4 = arg2[symbolRscHandle];
    if (!handle4 || (handleTable12[(handle4 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle3 = handleTable12[(handle4 << 1) + 1] & ~T_FLAG;
    var ptr5 = utf8Encode(arg3, realloc0, memory0);
    var len5 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.rename-at'](handle0, ptr2, len2, handle3, ptr5, len5);
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
        let enum6;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum6 = 'access';
            break;
          }
          case 1: {
            enum6 = 'would-block';
            break;
          }
          case 2: {
            enum6 = 'already';
            break;
          }
          case 3: {
            enum6 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum6 = 'busy';
            break;
          }
          case 5: {
            enum6 = 'deadlock';
            break;
          }
          case 6: {
            enum6 = 'quota';
            break;
          }
          case 7: {
            enum6 = 'exist';
            break;
          }
          case 8: {
            enum6 = 'file-too-large';
            break;
          }
          case 9: {
            enum6 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum6 = 'in-progress';
            break;
          }
          case 11: {
            enum6 = 'interrupted';
            break;
          }
          case 12: {
            enum6 = 'invalid';
            break;
          }
          case 13: {
            enum6 = 'io';
            break;
          }
          case 14: {
            enum6 = 'is-directory';
            break;
          }
          case 15: {
            enum6 = 'loop';
            break;
          }
          case 16: {
            enum6 = 'too-many-links';
            break;
          }
          case 17: {
            enum6 = 'message-size';
            break;
          }
          case 18: {
            enum6 = 'name-too-long';
            break;
          }
          case 19: {
            enum6 = 'no-device';
            break;
          }
          case 20: {
            enum6 = 'no-entry';
            break;
          }
          case 21: {
            enum6 = 'no-lock';
            break;
          }
          case 22: {
            enum6 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum6 = 'insufficient-space';
            break;
          }
          case 24: {
            enum6 = 'not-directory';
            break;
          }
          case 25: {
            enum6 = 'not-empty';
            break;
          }
          case 26: {
            enum6 = 'not-recoverable';
            break;
          }
          case 27: {
            enum6 = 'unsupported';
            break;
          }
          case 28: {
            enum6 = 'no-tty';
            break;
          }
          case 29: {
            enum6 = 'no-such-device';
            break;
          }
          case 30: {
            enum6 = 'overflow';
            break;
          }
          case 31: {
            enum6 = 'not-permitted';
            break;
          }
          case 32: {
            enum6 = 'pipe';
            break;
          }
          case 33: {
            enum6 = 'read-only';
            break;
          }
          case 34: {
            enum6 = 'invalid-seek';
            break;
          }
          case 35: {
            enum6 = 'text-file-busy';
            break;
          }
          case 36: {
            enum6 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant7= {
          tag: 'err',
          val: enum6
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant7.tag === 'err') {
      throw new ComponentError(variant7.val);
    }
    return variant7.val;
  };
  
  Descriptor$1.prototype.symlinkAt = function symlinkAt(arg1, arg2) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var ptr2 = utf8Encode(arg1, realloc0, memory0);
    var len2 = utf8EncodedLen;
    var ptr3 = utf8Encode(arg2, realloc0, memory0);
    var len3 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.symlink-at'](handle0, ptr2, len2, ptr3, len3);
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
        let enum4;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum4 = 'access';
            break;
          }
          case 1: {
            enum4 = 'would-block';
            break;
          }
          case 2: {
            enum4 = 'already';
            break;
          }
          case 3: {
            enum4 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum4 = 'busy';
            break;
          }
          case 5: {
            enum4 = 'deadlock';
            break;
          }
          case 6: {
            enum4 = 'quota';
            break;
          }
          case 7: {
            enum4 = 'exist';
            break;
          }
          case 8: {
            enum4 = 'file-too-large';
            break;
          }
          case 9: {
            enum4 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum4 = 'in-progress';
            break;
          }
          case 11: {
            enum4 = 'interrupted';
            break;
          }
          case 12: {
            enum4 = 'invalid';
            break;
          }
          case 13: {
            enum4 = 'io';
            break;
          }
          case 14: {
            enum4 = 'is-directory';
            break;
          }
          case 15: {
            enum4 = 'loop';
            break;
          }
          case 16: {
            enum4 = 'too-many-links';
            break;
          }
          case 17: {
            enum4 = 'message-size';
            break;
          }
          case 18: {
            enum4 = 'name-too-long';
            break;
          }
          case 19: {
            enum4 = 'no-device';
            break;
          }
          case 20: {
            enum4 = 'no-entry';
            break;
          }
          case 21: {
            enum4 = 'no-lock';
            break;
          }
          case 22: {
            enum4 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum4 = 'insufficient-space';
            break;
          }
          case 24: {
            enum4 = 'not-directory';
            break;
          }
          case 25: {
            enum4 = 'not-empty';
            break;
          }
          case 26: {
            enum4 = 'not-recoverable';
            break;
          }
          case 27: {
            enum4 = 'unsupported';
            break;
          }
          case 28: {
            enum4 = 'no-tty';
            break;
          }
          case 29: {
            enum4 = 'no-such-device';
            break;
          }
          case 30: {
            enum4 = 'overflow';
            break;
          }
          case 31: {
            enum4 = 'not-permitted';
            break;
          }
          case 32: {
            enum4 = 'pipe';
            break;
          }
          case 33: {
            enum4 = 'read-only';
            break;
          }
          case 34: {
            enum4 = 'invalid-seek';
            break;
          }
          case 35: {
            enum4 = 'text-file-busy';
            break;
          }
          case 36: {
            enum4 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant5= {
          tag: 'err',
          val: enum4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  Descriptor$1.prototype.unlinkFileAt = function unlinkFileAt(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var ptr2 = utf8Encode(arg1, realloc0, memory0);
    var len2 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.unlink-file-at'](handle0, ptr2, len2);
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
        let enum3;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum3 = 'access';
            break;
          }
          case 1: {
            enum3 = 'would-block';
            break;
          }
          case 2: {
            enum3 = 'already';
            break;
          }
          case 3: {
            enum3 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum3 = 'busy';
            break;
          }
          case 5: {
            enum3 = 'deadlock';
            break;
          }
          case 6: {
            enum3 = 'quota';
            break;
          }
          case 7: {
            enum3 = 'exist';
            break;
          }
          case 8: {
            enum3 = 'file-too-large';
            break;
          }
          case 9: {
            enum3 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum3 = 'in-progress';
            break;
          }
          case 11: {
            enum3 = 'interrupted';
            break;
          }
          case 12: {
            enum3 = 'invalid';
            break;
          }
          case 13: {
            enum3 = 'io';
            break;
          }
          case 14: {
            enum3 = 'is-directory';
            break;
          }
          case 15: {
            enum3 = 'loop';
            break;
          }
          case 16: {
            enum3 = 'too-many-links';
            break;
          }
          case 17: {
            enum3 = 'message-size';
            break;
          }
          case 18: {
            enum3 = 'name-too-long';
            break;
          }
          case 19: {
            enum3 = 'no-device';
            break;
          }
          case 20: {
            enum3 = 'no-entry';
            break;
          }
          case 21: {
            enum3 = 'no-lock';
            break;
          }
          case 22: {
            enum3 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum3 = 'insufficient-space';
            break;
          }
          case 24: {
            enum3 = 'not-directory';
            break;
          }
          case 25: {
            enum3 = 'not-empty';
            break;
          }
          case 26: {
            enum3 = 'not-recoverable';
            break;
          }
          case 27: {
            enum3 = 'unsupported';
            break;
          }
          case 28: {
            enum3 = 'no-tty';
            break;
          }
          case 29: {
            enum3 = 'no-such-device';
            break;
          }
          case 30: {
            enum3 = 'overflow';
            break;
          }
          case 31: {
            enum3 = 'not-permitted';
            break;
          }
          case 32: {
            enum3 = 'pipe';
            break;
          }
          case 33: {
            enum3 = 'read-only';
            break;
          }
          case 34: {
            enum3 = 'invalid-seek';
            break;
          }
          case 35: {
            enum3 = 'text-file-busy';
            break;
          }
          case 36: {
            enum3 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant4= {
          tag: 'err',
          val: enum3
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
  };
  
  Descriptor$1.prototype.isSameObject = function isSameObject(arg1) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    var handle3 = arg1[symbolRscHandle];
    if (!handle3 || (handleTable12[(handle3 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle2 = handleTable12[(handle3 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.is-same-object'](handle0, handle2);
    var bool4 = ret;
    return bool4 == 0 ? false : (bool4 == 1 ? true : throwInvalidBool());
  };
  
  Descriptor$1.prototype.metadataHash = function metadataHash() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.metadata-hash'](handle0);
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3= {
          tag: 'ok',
          val: {
            lower: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 8, true)),
            upper: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 16, true)),
          }
        };
        break;
      }
      case 1: {
        let enum2;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            enum2 = 'access';
            break;
          }
          case 1: {
            enum2 = 'would-block';
            break;
          }
          case 2: {
            enum2 = 'already';
            break;
          }
          case 3: {
            enum2 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum2 = 'busy';
            break;
          }
          case 5: {
            enum2 = 'deadlock';
            break;
          }
          case 6: {
            enum2 = 'quota';
            break;
          }
          case 7: {
            enum2 = 'exist';
            break;
          }
          case 8: {
            enum2 = 'file-too-large';
            break;
          }
          case 9: {
            enum2 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum2 = 'in-progress';
            break;
          }
          case 11: {
            enum2 = 'interrupted';
            break;
          }
          case 12: {
            enum2 = 'invalid';
            break;
          }
          case 13: {
            enum2 = 'io';
            break;
          }
          case 14: {
            enum2 = 'is-directory';
            break;
          }
          case 15: {
            enum2 = 'loop';
            break;
          }
          case 16: {
            enum2 = 'too-many-links';
            break;
          }
          case 17: {
            enum2 = 'message-size';
            break;
          }
          case 18: {
            enum2 = 'name-too-long';
            break;
          }
          case 19: {
            enum2 = 'no-device';
            break;
          }
          case 20: {
            enum2 = 'no-entry';
            break;
          }
          case 21: {
            enum2 = 'no-lock';
            break;
          }
          case 22: {
            enum2 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum2 = 'insufficient-space';
            break;
          }
          case 24: {
            enum2 = 'not-directory';
            break;
          }
          case 25: {
            enum2 = 'not-empty';
            break;
          }
          case 26: {
            enum2 = 'not-recoverable';
            break;
          }
          case 27: {
            enum2 = 'unsupported';
            break;
          }
          case 28: {
            enum2 = 'no-tty';
            break;
          }
          case 29: {
            enum2 = 'no-such-device';
            break;
          }
          case 30: {
            enum2 = 'overflow';
            break;
          }
          case 31: {
            enum2 = 'not-permitted';
            break;
          }
          case 32: {
            enum2 = 'pipe';
            break;
          }
          case 33: {
            enum2 = 'read-only';
            break;
          }
          case 34: {
            enum2 = 'invalid-seek';
            break;
          }
          case 35: {
            enum2 = 'text-file-busy';
            break;
          }
          case 36: {
            enum2 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant3= {
          tag: 'err',
          val: enum2
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
  };
  
  Descriptor$1.prototype.metadataHashAt = function metadataHashAt(arg1, arg2) {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable12[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Descriptor" resource.');
    }
    var handle0 = handleTable12[(handle1 << 1) + 1] & ~T_FLAG;
    let flags2 = 0;
    if (typeof arg1 === 'object' && arg1 !== null) {
      flags2 = Boolean(arg1.symlinkFollow) << 0;
    } else if (arg1 !== null && arg1!== undefined) {
      throw new TypeError('only an object, undefined or null can be converted to flags');
    }
    var ptr3 = utf8Encode(arg2, realloc0, memory0);
    var len3 = utf8EncodedLen;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]descriptor.metadata-hash-at'](handle0, flags2, ptr3, len3);
    let variant5;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant5= {
          tag: 'ok',
          val: {
            lower: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 8, true)),
            upper: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 16, true)),
          }
        };
        break;
      }
      case 1: {
        let enum4;
        switch (dataView(memory0).getUint8(ret + 8, true)) {
          case 0: {
            enum4 = 'access';
            break;
          }
          case 1: {
            enum4 = 'would-block';
            break;
          }
          case 2: {
            enum4 = 'already';
            break;
          }
          case 3: {
            enum4 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum4 = 'busy';
            break;
          }
          case 5: {
            enum4 = 'deadlock';
            break;
          }
          case 6: {
            enum4 = 'quota';
            break;
          }
          case 7: {
            enum4 = 'exist';
            break;
          }
          case 8: {
            enum4 = 'file-too-large';
            break;
          }
          case 9: {
            enum4 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum4 = 'in-progress';
            break;
          }
          case 11: {
            enum4 = 'interrupted';
            break;
          }
          case 12: {
            enum4 = 'invalid';
            break;
          }
          case 13: {
            enum4 = 'io';
            break;
          }
          case 14: {
            enum4 = 'is-directory';
            break;
          }
          case 15: {
            enum4 = 'loop';
            break;
          }
          case 16: {
            enum4 = 'too-many-links';
            break;
          }
          case 17: {
            enum4 = 'message-size';
            break;
          }
          case 18: {
            enum4 = 'name-too-long';
            break;
          }
          case 19: {
            enum4 = 'no-device';
            break;
          }
          case 20: {
            enum4 = 'no-entry';
            break;
          }
          case 21: {
            enum4 = 'no-lock';
            break;
          }
          case 22: {
            enum4 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum4 = 'insufficient-space';
            break;
          }
          case 24: {
            enum4 = 'not-directory';
            break;
          }
          case 25: {
            enum4 = 'not-empty';
            break;
          }
          case 26: {
            enum4 = 'not-recoverable';
            break;
          }
          case 27: {
            enum4 = 'unsupported';
            break;
          }
          case 28: {
            enum4 = 'no-tty';
            break;
          }
          case 29: {
            enum4 = 'no-such-device';
            break;
          }
          case 30: {
            enum4 = 'overflow';
            break;
          }
          case 31: {
            enum4 = 'not-permitted';
            break;
          }
          case 32: {
            enum4 = 'pipe';
            break;
          }
          case 33: {
            enum4 = 'read-only';
            break;
          }
          case 34: {
            enum4 = 'invalid-seek';
            break;
          }
          case 35: {
            enum4 = 'text-file-busy';
            break;
          }
          case 36: {
            enum4 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant5= {
          tag: 'err',
          val: enum4
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    if (variant5.tag === 'err') {
      throw new ComponentError(variant5.val);
    }
    return variant5.val;
  };
  
  class DirectoryEntryStream{
    constructor () {
      throw new Error('"DirectoryEntryStream" resource does not define a constructor');
    }
  }
  
  DirectoryEntryStream.prototype.readDirectoryEntry = function readDirectoryEntry() {
    var handle1 = this[symbolRscHandle];
    if (!handle1 || (handleTable13[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "DirectoryEntryStream" resource.');
    }
    var handle0 = handleTable13[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#[method]directory-entry-stream.read-directory-entry'](handle0);
    let variant6;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        let variant4;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            variant4 = undefined;
            break;
          }
          case 1: {
            let enum2;
            switch (dataView(memory0).getUint8(ret + 8, true)) {
              case 0: {
                enum2 = 'unknown';
                break;
              }
              case 1: {
                enum2 = 'block-device';
                break;
              }
              case 2: {
                enum2 = 'character-device';
                break;
              }
              case 3: {
                enum2 = 'directory';
                break;
              }
              case 4: {
                enum2 = 'fifo';
                break;
              }
              case 5: {
                enum2 = 'symbolic-link';
                break;
              }
              case 6: {
                enum2 = 'regular-file';
                break;
              }
              case 7: {
                enum2 = 'socket';
                break;
              }
              default: {
                throw new TypeError('invalid discriminant specified for DescriptorType');
              }
            }
            var ptr3 = dataView(memory0).getInt32(ret + 12, true);
            var len3 = dataView(memory0).getInt32(ret + 16, true);
            var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
            variant4 = {
              type: enum2,
              name: result3,
            };
            break;
          }
          default: {
            throw new TypeError('invalid variant discriminant for option');
          }
        }
        variant6= {
          tag: 'ok',
          val: variant4
        };
        break;
      }
      case 1: {
        let enum5;
        switch (dataView(memory0).getUint8(ret + 4, true)) {
          case 0: {
            enum5 = 'access';
            break;
          }
          case 1: {
            enum5 = 'would-block';
            break;
          }
          case 2: {
            enum5 = 'already';
            break;
          }
          case 3: {
            enum5 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum5 = 'busy';
            break;
          }
          case 5: {
            enum5 = 'deadlock';
            break;
          }
          case 6: {
            enum5 = 'quota';
            break;
          }
          case 7: {
            enum5 = 'exist';
            break;
          }
          case 8: {
            enum5 = 'file-too-large';
            break;
          }
          case 9: {
            enum5 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum5 = 'in-progress';
            break;
          }
          case 11: {
            enum5 = 'interrupted';
            break;
          }
          case 12: {
            enum5 = 'invalid';
            break;
          }
          case 13: {
            enum5 = 'io';
            break;
          }
          case 14: {
            enum5 = 'is-directory';
            break;
          }
          case 15: {
            enum5 = 'loop';
            break;
          }
          case 16: {
            enum5 = 'too-many-links';
            break;
          }
          case 17: {
            enum5 = 'message-size';
            break;
          }
          case 18: {
            enum5 = 'name-too-long';
            break;
          }
          case 19: {
            enum5 = 'no-device';
            break;
          }
          case 20: {
            enum5 = 'no-entry';
            break;
          }
          case 21: {
            enum5 = 'no-lock';
            break;
          }
          case 22: {
            enum5 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum5 = 'insufficient-space';
            break;
          }
          case 24: {
            enum5 = 'not-directory';
            break;
          }
          case 25: {
            enum5 = 'not-empty';
            break;
          }
          case 26: {
            enum5 = 'not-recoverable';
            break;
          }
          case 27: {
            enum5 = 'unsupported';
            break;
          }
          case 28: {
            enum5 = 'no-tty';
            break;
          }
          case 29: {
            enum5 = 'no-such-device';
            break;
          }
          case 30: {
            enum5 = 'overflow';
            break;
          }
          case 31: {
            enum5 = 'not-permitted';
            break;
          }
          case 32: {
            enum5 = 'pipe';
            break;
          }
          case 33: {
            enum5 = 'read-only';
            break;
          }
          case 34: {
            enum5 = 'invalid-seek';
            break;
          }
          case 35: {
            enum5 = 'text-file-busy';
            break;
          }
          case 36: {
            enum5 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant6= {
          tag: 'err',
          val: enum5
        };
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for expected');
      }
    }
    postReturn6(ret);
    if (variant6.tag === 'err') {
      throw new ComponentError(variant6.val);
    }
    return variant6.val;
  };
  
  function filesystemErrorCode$1(arg0) {
    var handle1 = arg0[symbolRscHandle];
    if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
      throw new TypeError('Resource error: Not a valid "Error" resource.');
    }
    var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
    const ret = exports1['wasi:filesystem/types@0.2.0#filesystem-error-code'](handle0);
    let variant3;
    switch (dataView(memory0).getUint8(ret + 0, true)) {
      case 0: {
        variant3 = undefined;
        break;
      }
      case 1: {
        let enum2;
        switch (dataView(memory0).getUint8(ret + 1, true)) {
          case 0: {
            enum2 = 'access';
            break;
          }
          case 1: {
            enum2 = 'would-block';
            break;
          }
          case 2: {
            enum2 = 'already';
            break;
          }
          case 3: {
            enum2 = 'bad-descriptor';
            break;
          }
          case 4: {
            enum2 = 'busy';
            break;
          }
          case 5: {
            enum2 = 'deadlock';
            break;
          }
          case 6: {
            enum2 = 'quota';
            break;
          }
          case 7: {
            enum2 = 'exist';
            break;
          }
          case 8: {
            enum2 = 'file-too-large';
            break;
          }
          case 9: {
            enum2 = 'illegal-byte-sequence';
            break;
          }
          case 10: {
            enum2 = 'in-progress';
            break;
          }
          case 11: {
            enum2 = 'interrupted';
            break;
          }
          case 12: {
            enum2 = 'invalid';
            break;
          }
          case 13: {
            enum2 = 'io';
            break;
          }
          case 14: {
            enum2 = 'is-directory';
            break;
          }
          case 15: {
            enum2 = 'loop';
            break;
          }
          case 16: {
            enum2 = 'too-many-links';
            break;
          }
          case 17: {
            enum2 = 'message-size';
            break;
          }
          case 18: {
            enum2 = 'name-too-long';
            break;
          }
          case 19: {
            enum2 = 'no-device';
            break;
          }
          case 20: {
            enum2 = 'no-entry';
            break;
          }
          case 21: {
            enum2 = 'no-lock';
            break;
          }
          case 22: {
            enum2 = 'insufficient-memory';
            break;
          }
          case 23: {
            enum2 = 'insufficient-space';
            break;
          }
          case 24: {
            enum2 = 'not-directory';
            break;
          }
          case 25: {
            enum2 = 'not-empty';
            break;
          }
          case 26: {
            enum2 = 'not-recoverable';
            break;
          }
          case 27: {
            enum2 = 'unsupported';
            break;
          }
          case 28: {
            enum2 = 'no-tty';
            break;
          }
          case 29: {
            enum2 = 'no-such-device';
            break;
          }
          case 30: {
            enum2 = 'overflow';
            break;
          }
          case 31: {
            enum2 = 'not-permitted';
            break;
          }
          case 32: {
            enum2 = 'pipe';
            break;
          }
          case 33: {
            enum2 = 'read-only';
            break;
          }
          case 34: {
            enum2 = 'invalid-seek';
            break;
          }
          case 35: {
            enum2 = 'text-file-busy';
            break;
          }
          case 36: {
            enum2 = 'cross-device';
            break;
          }
          default: {
            throw new TypeError('invalid discriminant specified for ErrorCode');
          }
        }
        variant3 = enum2;
        break;
      }
      default: {
        throw new TypeError('invalid variant discriminant for option');
      }
    }
    return variant3;
  }
  
  function getDirectories$1() {
    const ret = exports1['wasi:filesystem/preopens@0.2.0#get-directories']();
    var len3 = dataView(memory0).getInt32(ret + 4, true);
    var base3 = dataView(memory0).getInt32(ret + 0, true);
    var result3 = [];
    for (let i = 0; i < len3; i++) {
      const base = base3 + i * 12;
      var handle1 = dataView(memory0).getInt32(base + 0, true);
      var rsc0 = new.target === Descriptor$1 ? this : Object.create(Descriptor$1.prototype);
      Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
      finalizationRegistry12.register(rsc0, handle1, rsc0);
      Object.defineProperty(rsc0, symbolDispose, { writable: true, value: function () {
        finalizationRegistry12.unregister(rsc0);
        rscTableRemove(handleTable12, handle1);
        rsc0[symbolDispose] = emptyFunc;
        rsc0[symbolRscHandle] = null;
        exports0['49'](handleTable12[(handle1 << 1) + 1] & ~T_FLAG);
      }});
      var ptr2 = dataView(memory0).getInt32(base + 4, true);
      var len2 = dataView(memory0).getInt32(base + 8, true);
      var result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
      result3.push([rsc0, result2]);
    }
    postReturn7(ret);
    return result3;
  }
  const environment020 = {
    getArguments: getArguments$1,
    getEnvironment: getEnvironment$1,
    initialCwd: initialCwd$1,
    
  };
  const exit020 = {
    exit: exit$1,
    
  };
  const stderr020 = {
    getStderr: getStderr$1,
    
  };
  const stdin020 = {
    getStdin: getStdin$1,
    
  };
  const stdout020 = {
    getStdout: getStdout$1,
    
  };
  const wallClock020 = {
    now: now$2,
    resolution: resolution$1,
    
  };
  const preopens020 = {
    getDirectories: getDirectories$1,
    
  };
  const types020 = {
    Descriptor: Descriptor$1,
    DirectoryEntryStream: DirectoryEntryStream,
    filesystemErrorCode: filesystemErrorCode$1,
    
  };
  const error020 = {
    Error: Error$2,
    
  };
  const poll020 = {
    Pollable: Pollable$1,
    poll: poll$1,
    
  };
  const streams020 = {
    InputStream: InputStream$1,
    OutputStream: OutputStream$1,
    
  };
  
  return { environment: environment020, error: error020, exit: exit020, poll: poll020, preopens: preopens020, stderr: stderr020, stdin: stdin020, stdout: stdout020, streams: streams020, types: types020, wallClock: wallClock020, 'wasi:cli/environment@0.2.0': environment020, 'wasi:cli/exit@0.2.0': exit020, 'wasi:cli/stderr@0.2.0': stderr020, 'wasi:cli/stdin@0.2.0': stdin020, 'wasi:cli/stdout@0.2.0': stdout020, 'wasi:clocks/wall-clock@0.2.0': wallClock020, 'wasi:filesystem/preopens@0.2.0': preopens020, 'wasi:filesystem/types@0.2.0': types020, 'wasi:io/error@0.2.0': error020, 'wasi:io/poll@0.2.0': poll020, 'wasi:io/streams@0.2.0': streams020,  };
}
