export function instantiate(getCoreModule, imports, instantiateCore = WebAssembly.instantiate) {
  
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
  
  const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
  let _fs;
  async function fetchCompile (url) {
    if (isNode) {
      _fs = _fs || await import('node:fs/promises');
      return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
  }
  
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
    let buf = utf8Encoder.encode(s);
    let ptr = realloc(0, 0, 1, buf.length);
    new Uint8Array(memory.buffer).set(buf, ptr);
    utf8EncodedLen = buf.length;
    return ptr;
  }
  
  
  if (!getCoreModule) getCoreModule = (name) => fetchCompile(new URL(`./${name}`, import.meta.url));
  const module0 = getCoreModule('nfs_rs.core.wasm');
  const module1 = getCoreModule('nfs_rs.core2.wasm');
  const module2 = getCoreModule('nfs_rs.core3.wasm');
  const module3 = getCoreModule('nfs_rs.core4.wasm');
  
  const { getEnvironment } = imports['wasi:cli/environment'];
  const { exit } = imports['wasi:cli/exit'];
  const { getStderr } = imports['wasi:cli/stderr'];
  const { getStdin } = imports['wasi:cli/stdin'];
  const { getStdout } = imports['wasi:cli/stdout'];
  const { now, subscribeDuration, subscribeInstant } = imports['wasi:clocks/monotonic-clock'];
  const { now: now$1 } = imports['wasi:clocks/wall-clock'];
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
  let gen = (function* init () {
    let exports0;
    const handleTable4 = [T_FLAG, 0];
    const captureTable4= new Map();
    let captureCnt4 = 0;
    handleTables[4] = handleTable4;
    
    function trampoline8() {
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
    
    function trampoline9() {
      const ret = now();
      return toUint64(ret);
    }
    
    const handleTable0 = [T_FLAG, 0];
    const captureTable0= new Map();
    let captureCnt0 = 0;
    handleTables[0] = handleTable0;
    
    function trampoline14(arg0) {
      const ret = subscribeDuration(BigInt.asUintN(64, arg0));
      if (!(ret instanceof Pollable)) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable0, rep);
      }
      return handle0;
    }
    
    
    function trampoline15(arg0) {
      const ret = subscribeInstant(BigInt.asUintN(64, arg0));
      if (!(ret instanceof Pollable)) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle0 = ret[symbolRscHandle];
      if (!handle0) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle0 = rscTableCreateOwn(handleTable0, rep);
      }
      return handle0;
    }
    
    const handleTable3 = [T_FLAG, 0];
    const captureTable3= new Map();
    let captureCnt3 = 0;
    handleTables[3] = handleTable3;
    
    function trampoline16(arg0) {
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
        rsc[symbolRscHandle] = undefined;
      }
      curResourceBorrows = [];
      if (!(ret instanceof Pollable)) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle3 = ret[symbolRscHandle];
      if (!handle3) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle3 = rscTableCreateOwn(handleTable0, rep);
      }
      return handle3;
    }
    
    const handleTable2 = [T_FLAG, 0];
    const captureTable2= new Map();
    let captureCnt2 = 0;
    handleTables[2] = handleTable2;
    
    function trampoline17(arg0) {
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
        rsc[symbolRscHandle] = undefined;
      }
      curResourceBorrows = [];
      if (!(ret instanceof Pollable)) {
        throw new TypeError('Resource error: Not a valid "Pollable" resource.');
      }
      var handle3 = ret[symbolRscHandle];
      if (!handle3) {
        const rep = ret[symbolRscRep] || ++captureCnt0;
        captureTable0.set(rep, ret);
        handle3 = rscTableCreateOwn(handleTable0, rep);
      }
      return handle3;
    }
    
    
    function trampoline19() {
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
    
    
    function trampoline20(arg0) {
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
    
    
    function trampoline21() {
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
    
    
    function trampoline22() {
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
    
    let exports2;
    let memory0;
    let realloc0;
    let realloc1;
    const handleTable5 = [T_FLAG, 0];
    const captureTable5= new Map();
    let captureCnt5 = 0;
    handleTables[5] = handleTable5;
    
    function trampoline23(arg0, arg1) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline24(arg0, arg1, arg2, arg3) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    function trampoline25(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline26(arg0, arg1) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline27(arg0, arg1) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline28(arg0, arg1, arg2) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    const handleTable1 = [T_FLAG, 0];
    const captureTable1= new Map();
    let captureCnt1 = 0;
    handleTables[1] = handleTable1;
    
    function trampoline29(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable1[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable1.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Error$1.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = rsc0.toDebugString();
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = undefined;
      }
      curResourceBorrows = [];
      var ptr3 = utf8Encode(ret, realloc0, memory0);
      var len3 = utf8EncodedLen;
      dataView(memory0).setInt32(arg1 + 4, len3, true);
      dataView(memory0).setInt32(arg1 + 0, ptr3, true);
    }
    
    
    function trampoline30(arg0, arg1, arg2) {
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
        rsc[symbolRscHandle] = undefined;
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
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable1, rep);
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
    
    
    function trampoline31(arg0, arg1) {
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
        rsc[symbolRscHandle] = undefined;
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
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable1, rep);
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
    
    
    function trampoline32(arg0, arg1, arg2, arg3) {
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
        rsc[symbolRscHandle] = undefined;
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
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable1, rep);
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
    
    
    function trampoline33(arg0, arg1) {
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
    
    function trampoline34(arg0) {
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
    
    
    function trampoline35(arg0) {
      const ret = now$1();
      var {seconds: v0_0, nanoseconds: v0_1 } = ret;
      dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
      dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
    }
    
    
    function trampoline36(arg0, arg1, arg2) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline37(arg0, arg1, arg2) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline38(arg0, arg1) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline39(arg0, arg1) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline40(arg0, arg1) {
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline41(arg0, arg1) {
      var handle1 = arg0;
      var rep2 = handleTable1[(handle1 << 1) + 1] & ~T_FLAG;
      var rsc0 = captureTable1.get(rep2);
      if (!rsc0) {
        rsc0 = Object.create(Error$1.prototype);
        Object.defineProperty(rsc0, symbolRscHandle, { writable: true, value: handle1});
        Object.defineProperty(rsc0, symbolRscRep, { writable: true, value: rep2});
      }
      curResourceBorrows.push(rsc0);
      const ret = filesystemErrorCode(rsc0);
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = undefined;
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
        ret = { tag: 'ok', val: rsc0.checkWrite()};
      } catch (e) {
        ret = { tag: 'err', val: getErrorPayload(e) };
      }
      for (const rsc of curResourceBorrows) {
        rsc[symbolRscHandle] = undefined;
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
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable1, rep);
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
    
    
    function trampoline43(arg0, arg1, arg2, arg3) {
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
        rsc[symbolRscHandle] = undefined;
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
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable1, rep);
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
    
    
    function trampoline44(arg0, arg1, arg2, arg3) {
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
        rsc[symbolRscHandle] = undefined;
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
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle4 = rscTableCreateOwn(handleTable1, rep);
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
    
    
    function trampoline45(arg0, arg1) {
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
        rsc[symbolRscHandle] = undefined;
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
                const rep = e[symbolRscRep] || ++captureCnt1;
                captureTable1.set(rep, e);
                handle3 = rscTableCreateOwn(handleTable1, rep);
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
    
    
    function trampoline46(arg0, arg1, arg2) {
      var len3 = arg1;
      var base3 = arg0;
      var result3 = [];
      for (let i = 0; i < len3; i++) {
        const base = base3 + i * 4;
        var handle1 = dataView(memory0).getInt32(base + 0, true);
        var rep2 = handleTable0[(handle1 << 1) + 1] & ~T_FLAG;
        var rsc0 = captureTable0.get(rep2);
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
        rsc[symbolRscHandle] = undefined;
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
    
    
    function trampoline47(arg0, arg1) {
      const ret = getRandomBytes(BigInt.asUintN(64, arg0));
      var val0 = ret;
      var len0 = val0.byteLength;
      var ptr0 = realloc1(0, 0, 1, len0 * 1);
      var src0 = new Uint8Array(val0.buffer || val0, val0.byteOffset, len0 * 1);
      (new Uint8Array(memory0.buffer, ptr0, len0 * 1)).set(src0);
      dataView(memory0).setInt32(arg1 + 4, len0, true);
      dataView(memory0).setInt32(arg1 + 0, ptr0, true);
    }
    
    
    function trampoline48(arg0) {
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
    const handleTable8 = [T_FLAG, 0];
    const finalizationRegistry8 = finalizationRegistryCreate((handle) => {
      const { rep } = rscTableRemove(handleTable8, handle);
      exports0['33'](rep);
    });
    
    handleTables[8] = handleTable8;
    const trampoline0 = rscTableCreateOwn.bind(null, handleTable8);
    function trampoline1(handle) {
      const handleEntry = rscTableRemove(handleTable8, handle);
      if (handleEntry.own) {
        
        exports0['33'](handleEntry.rep);
      }
    }
    function trampoline2(handle) {
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
    function trampoline3(handle) {
      const handleEntry = rscTableRemove(handleTable1, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable1.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable1.delete(handleEntry.rep);
        } else if (Error$1[symbolCabiDispose]) {
          Error$1[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline4(handle) {
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
    function trampoline5(handle) {
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
    function trampoline6(handle) {
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
    function trampoline7(handle) {
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
    function trampoline10(handle) {
      const handleEntry = rscTableRemove(handleTable1, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable1.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable1.delete(handleEntry.rep);
        } else if (Error$1[symbolCabiDispose]) {
          Error$1[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    function trampoline11(handle) {
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
    function trampoline12(handle) {
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
    function trampoline13(handle) {
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
    function trampoline18(handle) {
      const handleEntry = rscTableRemove(handleTable0, handle);
      if (handleEntry.own) {
        
        const rsc = captureTable0.get(handleEntry.rep);
        if (rsc) {
          if (rsc[symbolDispose]) rsc[symbolDispose]();
          captureTable0.delete(handleEntry.rep);
        } else if (Pollable[symbolCabiDispose]) {
          Pollable[symbolCabiDispose](handleEntry.rep);
        }
      }
    }
    Promise.all([module0, module1, module2, module3]).catch(() => {});
    ({ exports: exports0 } = yield instantiateCore(yield module2));
    ({ exports: exports1 } = yield instantiateCore(yield module0, {
      '[export]component:nfs-rs/nfs': {
        '[resource-drop]nfs-mount': trampoline1,
        '[resource-new]nfs-mount': trampoline0,
      },
      'wasi:io/error@0.2.0': {
        '[method]error.to-debug-string': exports0['6'],
        '[resource-drop]error': trampoline3,
      },
      'wasi:io/streams@0.2.0': {
        '[method]input-stream.blocking-read': exports0['7'],
        '[method]output-stream.blocking-write-and-flush': exports0['9'],
        '[method]output-stream.check-write': exports0['8'],
        '[resource-drop]input-stream': trampoline6,
        '[resource-drop]output-stream': trampoline5,
      },
      'wasi:sockets/instance-network@0.2.0': {
        'instance-network': trampoline8,
      },
      'wasi:sockets/ip-name-lookup@0.2.0': {
        '[method]resolve-address-stream.resolve-next-address': exports0['0'],
        '[resource-drop]resolve-address-stream': trampoline2,
        'resolve-addresses': exports0['1'],
      },
      'wasi:sockets/network@0.2.0': {
        '[resource-drop]network': trampoline4,
      },
      'wasi:sockets/tcp-create-socket@0.2.0': {
        'create-tcp-socket': exports0['10'],
      },
      'wasi:sockets/tcp@0.2.0': {
        '[method]tcp-socket.finish-connect': exports0['3'],
        '[method]tcp-socket.remote-address': exports0['4'],
        '[method]tcp-socket.shutdown': exports0['5'],
        '[method]tcp-socket.start-connect': exports0['2'],
        '[resource-drop]tcp-socket': trampoline7,
      },
      wasi_snapshot_preview1: {
        clock_time_get: exports0['27'],
        environ_get: exports0['30'],
        environ_sizes_get: exports0['31'],
        fd_write: exports0['28'],
        poll_oneoff: exports0['29'],
        proc_exit: exports0['32'],
        random_get: exports0['26'],
      },
    }));
    ({ exports: exports2 } = yield instantiateCore(yield module1, {
      __main_module__: {
        cabi_realloc: exports1.cabi_realloc,
      },
      env: {
        memory: exports1.memory,
      },
      'wasi:cli/environment@0.2.0': {
        'get-environment': exports0['25'],
      },
      'wasi:cli/exit@0.2.0': {
        exit: trampoline20,
      },
      'wasi:cli/stderr@0.2.0': {
        'get-stderr': trampoline19,
      },
      'wasi:cli/stdin@0.2.0': {
        'get-stdin': trampoline21,
      },
      'wasi:cli/stdout@0.2.0': {
        'get-stdout': trampoline22,
      },
      'wasi:clocks/monotonic-clock@0.2.0': {
        now: trampoline9,
        'subscribe-duration': trampoline14,
        'subscribe-instant': trampoline15,
      },
      'wasi:clocks/wall-clock@0.2.0': {
        now: exports0['12'],
      },
      'wasi:filesystem/preopens@0.2.0': {
        'get-directories': exports0['11'],
      },
      'wasi:filesystem/types@0.2.0': {
        '[method]descriptor.append-via-stream': exports0['15'],
        '[method]descriptor.get-type': exports0['16'],
        '[method]descriptor.read-via-stream': exports0['13'],
        '[method]descriptor.stat': exports0['17'],
        '[method]descriptor.write-via-stream': exports0['14'],
        '[resource-drop]descriptor': trampoline13,
        'filesystem-error-code': exports0['18'],
      },
      'wasi:io/error@0.2.0': {
        '[resource-drop]error': trampoline10,
      },
      'wasi:io/poll@0.2.0': {
        '[resource-drop]pollable': trampoline18,
        poll: exports0['23'],
      },
      'wasi:io/streams@0.2.0': {
        '[method]input-stream.subscribe': trampoline17,
        '[method]output-stream.blocking-flush': exports0['22'],
        '[method]output-stream.blocking-write-and-flush': exports0['21'],
        '[method]output-stream.check-write': exports0['19'],
        '[method]output-stream.subscribe': trampoline16,
        '[method]output-stream.write': exports0['20'],
        '[resource-drop]input-stream': trampoline11,
        '[resource-drop]output-stream': trampoline12,
      },
      'wasi:random/random@0.2.0': {
        'get-random-bytes': exports0['24'],
      },
    }));
    memory0 = exports1.memory;
    realloc0 = exports1.cabi_realloc;
    realloc1 = exports2.cabi_import_realloc;
    ({ exports: exports3 } = yield instantiateCore(yield module3, {
      '': {
        $imports: exports0.$imports,
        '0': trampoline23,
        '1': trampoline24,
        '10': trampoline33,
        '11': trampoline34,
        '12': trampoline35,
        '13': trampoline36,
        '14': trampoline37,
        '15': trampoline38,
        '16': trampoline39,
        '17': trampoline40,
        '18': trampoline41,
        '19': trampoline42,
        '2': trampoline25,
        '20': trampoline43,
        '21': trampoline44,
        '22': trampoline45,
        '23': trampoline46,
        '24': trampoline47,
        '25': trampoline48,
        '26': exports2.random_get,
        '27': exports2.clock_time_get,
        '28': exports2.fd_write,
        '29': exports2.poll_oneoff,
        '3': trampoline26,
        '30': exports2.environ_get,
        '31': exports2.environ_sizes_get,
        '32': exports2.proc_exit,
        '33': exports1['component:nfs-rs/nfs#[dtor]nfs-mount'],
        '4': trampoline27,
        '5': trampoline28,
        '6': trampoline29,
        '7': trampoline30,
        '8': trampoline31,
        '9': trampoline32,
      },
    }));
    postReturn0 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.access'];
    postReturn1 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.create'];
    postReturn2 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.getattr'];
    postReturn3 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.read'];
    postReturn4 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.readdir'];
    postReturn5 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.readdirplus'];
    postReturn6 = exports1['cabi_post_component:nfs-rs/nfs#[method]nfs-mount.readdirplus-path'];
    let nfsMethodNfsMountNullOp;
    
    class NfsMount{
      constructor () {
        throw new Error('"NfsMount" resource does not define a constructor');
      }
    }
    
    NfsMount.prototype.nullOp = function nullOp() {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      const ret = nfsMethodNfsMountNullOp(handle0);
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
          var ptr3 = dataView(memory0).getInt32(ret + 12, true);
          var len3 = dataView(memory0).getInt32(ret + 16, true);
          var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
      const retVal = variant4;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountAccess;
    
    NfsMount.prototype.access = function access(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      const ret = nfsMethodNfsMountAccess(handle0, ptr2, len2, toUint32(arg2));
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
          var ptr4 = dataView(memory0).getInt32(ret + 12, true);
          var len4 = dataView(memory0).getInt32(ret + 16, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountAccessPath;
    
    NfsMount.prototype.accessPath = function accessPath(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountAccessPath(handle0, ptr2, len2, toUint32(arg2));
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
          var ptr4 = dataView(memory0).getInt32(ret + 12, true);
          var len4 = dataView(memory0).getInt32(ret + 16, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountClose;
    
    NfsMount.prototype.close = function close(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      const ret = nfsMethodNfsMountClose(handle0, toUint32(arg1), toUint64(arg2));
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
          var ptr3 = dataView(memory0).getInt32(ret + 12, true);
          var len3 = dataView(memory0).getInt32(ret + 16, true);
          var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
      const retVal = variant4;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountCommit;
    
    NfsMount.prototype.commit = function commit(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      const ret = nfsMethodNfsMountCommit(handle0, ptr2, len2, toUint64(arg2), toUint32(arg3));
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
          var ptr4 = dataView(memory0).getInt32(ret + 12, true);
          var len4 = dataView(memory0).getInt32(ret + 16, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountCommitPath;
    
    NfsMount.prototype.commitPath = function commitPath(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountCommitPath(handle0, ptr2, len2, toUint64(arg2), toUint32(arg3));
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
          var ptr4 = dataView(memory0).getInt32(ret + 12, true);
          var len4 = dataView(memory0).getInt32(ret + 16, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountCreate;
    
    NfsMount.prototype.create = function create(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      const ret = nfsMethodNfsMountCreate(handle0, ptr2, len2, ptr3, len3, toUint32(arg3));
      let variant8;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr4 = dataView(memory0).getInt32(ret + 8, true);
          var len4 = dataView(memory0).getInt32(ret + 12, true);
          var result4 = new Uint8Array(memory0.buffer.slice(ptr4, ptr4 + len4 * 1));
          let variant5;
          switch (dataView(memory0).getUint8(ret + 16, true)) {
            case 0: {
              variant5 = undefined;
              break;
            }
            case 1: {
              variant5 = {
                attrType: dataView(memory0).getInt32(ret + 24, true) >>> 0,
                fileMode: dataView(memory0).getInt32(ret + 28, true) >>> 0,
                nlink: dataView(memory0).getInt32(ret + 32, true) >>> 0,
                uid: dataView(memory0).getInt32(ret + 36, true) >>> 0,
                gid: dataView(memory0).getInt32(ret + 40, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
                specData: [dataView(memory0).getInt32(ret + 64, true) >>> 0, dataView(memory0).getInt32(ret + 68, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 80, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(ret + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 108, true) >>> 0,
                },
              };
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          variant8= {
            tag: 'ok',
            val: {
              obj: result4,
              attr: variant5,
            }
          };
          break;
        }
        case 1: {
          let variant6;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant6 = undefined;
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
          var ptr7 = dataView(memory0).getInt32(ret + 16, true);
          var len7 = dataView(memory0).getInt32(ret + 20, true);
          var result7 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr7, len7));
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
      const retVal = variant8;
      postReturn1(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountCreatePath;
    
    NfsMount.prototype.createPath = function createPath(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountCreatePath(handle0, ptr2, len2, toUint32(arg2));
      let variant7;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr3 = dataView(memory0).getInt32(ret + 8, true);
          var len3 = dataView(memory0).getInt32(ret + 12, true);
          var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
          let variant4;
          switch (dataView(memory0).getUint8(ret + 16, true)) {
            case 0: {
              variant4 = undefined;
              break;
            }
            case 1: {
              variant4 = {
                attrType: dataView(memory0).getInt32(ret + 24, true) >>> 0,
                fileMode: dataView(memory0).getInt32(ret + 28, true) >>> 0,
                nlink: dataView(memory0).getInt32(ret + 32, true) >>> 0,
                uid: dataView(memory0).getInt32(ret + 36, true) >>> 0,
                gid: dataView(memory0).getInt32(ret + 40, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
                specData: [dataView(memory0).getInt32(ret + 64, true) >>> 0, dataView(memory0).getInt32(ret + 68, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 80, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(ret + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 108, true) >>> 0,
                },
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
              obj: result3,
              attr: variant4,
            }
          };
          break;
        }
        case 1: {
          let variant5;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant5 = undefined;
              break;
            }
            case 1: {
              variant5 = dataView(memory0).getInt32(ret + 12, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr6 = dataView(memory0).getInt32(ret + 16, true);
          var len6 = dataView(memory0).getInt32(ret + 20, true);
          var result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
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
      const retVal = variant7;
      postReturn1(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountDelegpurge;
    
    NfsMount.prototype.delegpurge = function delegpurge(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      const ret = nfsMethodNfsMountDelegpurge(handle0, toUint64(arg1));
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
          var ptr3 = dataView(memory0).getInt32(ret + 12, true);
          var len3 = dataView(memory0).getInt32(ret + 16, true);
          var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
      const retVal = variant4;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountDelegreturn;
    
    NfsMount.prototype.delegreturn = function delegreturn(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      const ret = nfsMethodNfsMountDelegreturn(handle0, toUint64(arg1));
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
          var ptr3 = dataView(memory0).getInt32(ret + 12, true);
          var len3 = dataView(memory0).getInt32(ret + 16, true);
          var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
      const retVal = variant4;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountGetattr;
    
    NfsMount.prototype.getattr = function getattr(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      const ret = nfsMethodNfsMountGetattr(handle0, ptr2, len2);
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
          var ptr4 = dataView(memory0).getInt32(ret + 16, true);
          var len4 = dataView(memory0).getInt32(ret + 20, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn2(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountGetattrPath;
    
    NfsMount.prototype.getattrPath = function getattrPath(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountGetattrPath(handle0, ptr2, len2);
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
          var ptr4 = dataView(memory0).getInt32(ret + 16, true);
          var len4 = dataView(memory0).getInt32(ret + 20, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn2(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountSetattr;
    
    NfsMount.prototype.setattr = function setattr(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
      var ptr0 = realloc0(0, 0, 8, 88);
      var handle2 = this[symbolRscHandle];
      if (!handle2 || (handleTable8[(handle2 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle1 = handleTable8[(handle2 << 1) + 1] & ~T_FLAG;
      dataView(memory0).setInt32(ptr0 + 0, handle1, true);
      var val3 = arg1;
      var len3 = val3.byteLength;
      var ptr3 = realloc0(0, 0, 1, len3 * 1);
      var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
      (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
      dataView(memory0).setInt32(ptr0 + 8, len3, true);
      dataView(memory0).setInt32(ptr0 + 4, ptr3, true);
      var variant5 = arg2;
      if (variant5 === null || variant5=== undefined) {
        dataView(memory0).setInt8(ptr0 + 12, 0, true);
      } else {
        const e = variant5;
        dataView(memory0).setInt8(ptr0 + 12, 1, true);
        var {seconds: v4_0, nseconds: v4_1 } = e;
        dataView(memory0).setInt32(ptr0 + 16, toUint32(v4_0), true);
        dataView(memory0).setInt32(ptr0 + 20, toUint32(v4_1), true);
      }
      var variant6 = arg3;
      if (variant6 === null || variant6=== undefined) {
        dataView(memory0).setInt8(ptr0 + 24, 0, true);
      } else {
        const e = variant6;
        dataView(memory0).setInt8(ptr0 + 24, 1, true);
        dataView(memory0).setInt32(ptr0 + 28, toUint32(e), true);
      }
      var variant7 = arg4;
      if (variant7 === null || variant7=== undefined) {
        dataView(memory0).setInt8(ptr0 + 32, 0, true);
      } else {
        const e = variant7;
        dataView(memory0).setInt8(ptr0 + 32, 1, true);
        dataView(memory0).setInt32(ptr0 + 36, toUint32(e), true);
      }
      var variant8 = arg5;
      if (variant8 === null || variant8=== undefined) {
        dataView(memory0).setInt8(ptr0 + 40, 0, true);
      } else {
        const e = variant8;
        dataView(memory0).setInt8(ptr0 + 40, 1, true);
        dataView(memory0).setInt32(ptr0 + 44, toUint32(e), true);
      }
      var variant9 = arg6;
      if (variant9 === null || variant9=== undefined) {
        dataView(memory0).setInt8(ptr0 + 48, 0, true);
      } else {
        const e = variant9;
        dataView(memory0).setInt8(ptr0 + 48, 1, true);
        dataView(memory0).setBigInt64(ptr0 + 56, toUint64(e), true);
      }
      var variant11 = arg7;
      if (variant11 === null || variant11=== undefined) {
        dataView(memory0).setInt8(ptr0 + 64, 0, true);
      } else {
        const e = variant11;
        dataView(memory0).setInt8(ptr0 + 64, 1, true);
        var {seconds: v10_0, nseconds: v10_1 } = e;
        dataView(memory0).setInt32(ptr0 + 68, toUint32(v10_0), true);
        dataView(memory0).setInt32(ptr0 + 72, toUint32(v10_1), true);
      }
      var variant13 = arg8;
      if (variant13 === null || variant13=== undefined) {
        dataView(memory0).setInt8(ptr0 + 76, 0, true);
      } else {
        const e = variant13;
        dataView(memory0).setInt8(ptr0 + 76, 1, true);
        var {seconds: v12_0, nseconds: v12_1 } = e;
        dataView(memory0).setInt32(ptr0 + 80, toUint32(v12_0), true);
        dataView(memory0).setInt32(ptr0 + 84, toUint32(v12_1), true);
      }
      const ret = nfsMethodNfsMountSetattr(ptr0);
      let variant16;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant16= {
            tag: 'ok',
            val: undefined
          };
          break;
        }
        case 1: {
          let variant14;
          switch (dataView(memory0).getUint8(ret + 4, true)) {
            case 0: {
              variant14 = undefined;
              break;
            }
            case 1: {
              variant14 = dataView(memory0).getInt32(ret + 8, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr15 = dataView(memory0).getInt32(ret + 12, true);
          var len15 = dataView(memory0).getInt32(ret + 16, true);
          var result15 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr15, len15));
          variant16= {
            tag: 'err',
            val: {
              nfsErrorCode: variant14,
              message: result15,
            }
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      const retVal = variant16;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountSetattrPath;
    
    NfsMount.prototype.setattrPath = function setattrPath(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
      var ptr0 = realloc0(0, 0, 8, 80);
      var handle2 = this[symbolRscHandle];
      if (!handle2 || (handleTable8[(handle2 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle1 = handleTable8[(handle2 << 1) + 1] & ~T_FLAG;
      dataView(memory0).setInt32(ptr0 + 0, handle1, true);
      var ptr3 = utf8Encode(arg1, realloc0, memory0);
      var len3 = utf8EncodedLen;
      dataView(memory0).setInt32(ptr0 + 8, len3, true);
      dataView(memory0).setInt32(ptr0 + 4, ptr3, true);
      dataView(memory0).setInt8(ptr0 + 12, arg2 ? 1 : 0, true);
      var variant4 = arg3;
      if (variant4 === null || variant4=== undefined) {
        dataView(memory0).setInt8(ptr0 + 16, 0, true);
      } else {
        const e = variant4;
        dataView(memory0).setInt8(ptr0 + 16, 1, true);
        dataView(memory0).setInt32(ptr0 + 20, toUint32(e), true);
      }
      var variant5 = arg4;
      if (variant5 === null || variant5=== undefined) {
        dataView(memory0).setInt8(ptr0 + 24, 0, true);
      } else {
        const e = variant5;
        dataView(memory0).setInt8(ptr0 + 24, 1, true);
        dataView(memory0).setInt32(ptr0 + 28, toUint32(e), true);
      }
      var variant6 = arg5;
      if (variant6 === null || variant6=== undefined) {
        dataView(memory0).setInt8(ptr0 + 32, 0, true);
      } else {
        const e = variant6;
        dataView(memory0).setInt8(ptr0 + 32, 1, true);
        dataView(memory0).setInt32(ptr0 + 36, toUint32(e), true);
      }
      var variant7 = arg6;
      if (variant7 === null || variant7=== undefined) {
        dataView(memory0).setInt8(ptr0 + 40, 0, true);
      } else {
        const e = variant7;
        dataView(memory0).setInt8(ptr0 + 40, 1, true);
        dataView(memory0).setBigInt64(ptr0 + 48, toUint64(e), true);
      }
      var variant9 = arg7;
      if (variant9 === null || variant9=== undefined) {
        dataView(memory0).setInt8(ptr0 + 56, 0, true);
      } else {
        const e = variant9;
        dataView(memory0).setInt8(ptr0 + 56, 1, true);
        var {seconds: v8_0, nseconds: v8_1 } = e;
        dataView(memory0).setInt32(ptr0 + 60, toUint32(v8_0), true);
        dataView(memory0).setInt32(ptr0 + 64, toUint32(v8_1), true);
      }
      var variant11 = arg8;
      if (variant11 === null || variant11=== undefined) {
        dataView(memory0).setInt8(ptr0 + 68, 0, true);
      } else {
        const e = variant11;
        dataView(memory0).setInt8(ptr0 + 68, 1, true);
        var {seconds: v10_0, nseconds: v10_1 } = e;
        dataView(memory0).setInt32(ptr0 + 72, toUint32(v10_0), true);
        dataView(memory0).setInt32(ptr0 + 76, toUint32(v10_1), true);
      }
      const ret = nfsMethodNfsMountSetattrPath(ptr0);
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
              variant12 = undefined;
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
          var ptr13 = dataView(memory0).getInt32(ret + 12, true);
          var len13 = dataView(memory0).getInt32(ret + 16, true);
          var result13 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr13, len13));
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
      const retVal = variant14;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountGetfh;
    
    NfsMount.prototype.getfh = function getfh() {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      const ret = nfsMethodNfsMountGetfh(handle0);
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
          var ptr3 = dataView(memory0).getInt32(ret + 12, true);
          var len3 = dataView(memory0).getInt32(ret + 16, true);
          var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
      const retVal = variant4;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountLink;
    
    NfsMount.prototype.link = function link(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      var val3 = arg2;
      var len3 = val3.byteLength;
      var ptr3 = realloc0(0, 0, 1, len3 * 1);
      var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
      (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
      var ptr4 = utf8Encode(arg3, realloc0, memory0);
      var len4 = utf8EncodedLen;
      const ret = nfsMethodNfsMountLink(handle0, ptr2, len2, ptr3, len3, ptr4, len4);
      let variant7;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant7= {
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
          let variant5;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant5 = undefined;
              break;
            }
            case 1: {
              variant5 = dataView(memory0).getInt32(ret + 12, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr6 = dataView(memory0).getInt32(ret + 16, true);
          var len6 = dataView(memory0).getInt32(ret + 20, true);
          var result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
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
      const retVal = variant7;
      postReturn2(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountLinkPath;
    
    NfsMount.prototype.linkPath = function linkPath(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      const ret = nfsMethodNfsMountLinkPath(handle0, ptr2, len2, ptr3, len3);
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
          var ptr5 = dataView(memory0).getInt32(ret + 16, true);
          var len5 = dataView(memory0).getInt32(ret + 20, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn2(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountSymlink;
    
    NfsMount.prototype.symlink = function symlink(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      var val3 = arg2;
      var len3 = val3.byteLength;
      var ptr3 = realloc0(0, 0, 1, len3 * 1);
      var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
      (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
      var ptr4 = utf8Encode(arg3, realloc0, memory0);
      var len4 = utf8EncodedLen;
      const ret = nfsMethodNfsMountSymlink(handle0, ptr2, len2, ptr3, len3, ptr4, len4);
      let variant9;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr5 = dataView(memory0).getInt32(ret + 8, true);
          var len5 = dataView(memory0).getInt32(ret + 12, true);
          var result5 = new Uint8Array(memory0.buffer.slice(ptr5, ptr5 + len5 * 1));
          let variant6;
          switch (dataView(memory0).getUint8(ret + 16, true)) {
            case 0: {
              variant6 = undefined;
              break;
            }
            case 1: {
              variant6 = {
                attrType: dataView(memory0).getInt32(ret + 24, true) >>> 0,
                fileMode: dataView(memory0).getInt32(ret + 28, true) >>> 0,
                nlink: dataView(memory0).getInt32(ret + 32, true) >>> 0,
                uid: dataView(memory0).getInt32(ret + 36, true) >>> 0,
                gid: dataView(memory0).getInt32(ret + 40, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
                specData: [dataView(memory0).getInt32(ret + 64, true) >>> 0, dataView(memory0).getInt32(ret + 68, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 80, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(ret + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 108, true) >>> 0,
                },
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
              obj: result5,
              attr: variant6,
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
          var ptr8 = dataView(memory0).getInt32(ret + 16, true);
          var len8 = dataView(memory0).getInt32(ret + 20, true);
          var result8 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr8, len8));
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
      const retVal = variant9;
      postReturn1(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountSymlinkPath;
    
    NfsMount.prototype.symlinkPath = function symlinkPath(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      const ret = nfsMethodNfsMountSymlinkPath(handle0, ptr2, len2, ptr3, len3);
      let variant8;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr4 = dataView(memory0).getInt32(ret + 8, true);
          var len4 = dataView(memory0).getInt32(ret + 12, true);
          var result4 = new Uint8Array(memory0.buffer.slice(ptr4, ptr4 + len4 * 1));
          let variant5;
          switch (dataView(memory0).getUint8(ret + 16, true)) {
            case 0: {
              variant5 = undefined;
              break;
            }
            case 1: {
              variant5 = {
                attrType: dataView(memory0).getInt32(ret + 24, true) >>> 0,
                fileMode: dataView(memory0).getInt32(ret + 28, true) >>> 0,
                nlink: dataView(memory0).getInt32(ret + 32, true) >>> 0,
                uid: dataView(memory0).getInt32(ret + 36, true) >>> 0,
                gid: dataView(memory0).getInt32(ret + 40, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
                specData: [dataView(memory0).getInt32(ret + 64, true) >>> 0, dataView(memory0).getInt32(ret + 68, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 80, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(ret + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 108, true) >>> 0,
                },
              };
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          variant8= {
            tag: 'ok',
            val: {
              obj: result4,
              attr: variant5,
            }
          };
          break;
        }
        case 1: {
          let variant6;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant6 = undefined;
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
          var ptr7 = dataView(memory0).getInt32(ret + 16, true);
          var len7 = dataView(memory0).getInt32(ret + 20, true);
          var result7 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr7, len7));
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
      const retVal = variant8;
      postReturn1(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountReadlink;
    
    NfsMount.prototype.readlink = function readlink(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      const ret = nfsMethodNfsMountReadlink(handle0, ptr2, len2);
      let variant6;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr3 = dataView(memory0).getInt32(ret + 4, true);
          var len3 = dataView(memory0).getInt32(ret + 8, true);
          var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn3(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountReadlinkPath;
    
    NfsMount.prototype.readlinkPath = function readlinkPath(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountReadlinkPath(handle0, ptr2, len2);
      let variant6;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr3 = dataView(memory0).getInt32(ret + 4, true);
          var len3 = dataView(memory0).getInt32(ret + 8, true);
          var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn3(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountLookup;
    
    NfsMount.prototype.lookup = function lookup(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      const ret = nfsMethodNfsMountLookup(handle0, ptr2, len2, ptr3, len3);
      let variant8;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr4 = dataView(memory0).getInt32(ret + 8, true);
          var len4 = dataView(memory0).getInt32(ret + 12, true);
          var result4 = new Uint8Array(memory0.buffer.slice(ptr4, ptr4 + len4 * 1));
          let variant5;
          switch (dataView(memory0).getUint8(ret + 16, true)) {
            case 0: {
              variant5 = undefined;
              break;
            }
            case 1: {
              variant5 = {
                attrType: dataView(memory0).getInt32(ret + 24, true) >>> 0,
                fileMode: dataView(memory0).getInt32(ret + 28, true) >>> 0,
                nlink: dataView(memory0).getInt32(ret + 32, true) >>> 0,
                uid: dataView(memory0).getInt32(ret + 36, true) >>> 0,
                gid: dataView(memory0).getInt32(ret + 40, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
                specData: [dataView(memory0).getInt32(ret + 64, true) >>> 0, dataView(memory0).getInt32(ret + 68, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 80, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(ret + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 108, true) >>> 0,
                },
              };
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          variant8= {
            tag: 'ok',
            val: {
              obj: result4,
              attr: variant5,
            }
          };
          break;
        }
        case 1: {
          let variant6;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant6 = undefined;
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
          var ptr7 = dataView(memory0).getInt32(ret + 16, true);
          var len7 = dataView(memory0).getInt32(ret + 20, true);
          var result7 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr7, len7));
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
      const retVal = variant8;
      postReturn1(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountLookupPath;
    
    NfsMount.prototype.lookupPath = function lookupPath(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountLookupPath(handle0, ptr2, len2);
      let variant7;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr3 = dataView(memory0).getInt32(ret + 8, true);
          var len3 = dataView(memory0).getInt32(ret + 12, true);
          var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
          let variant4;
          switch (dataView(memory0).getUint8(ret + 16, true)) {
            case 0: {
              variant4 = undefined;
              break;
            }
            case 1: {
              variant4 = {
                attrType: dataView(memory0).getInt32(ret + 24, true) >>> 0,
                fileMode: dataView(memory0).getInt32(ret + 28, true) >>> 0,
                nlink: dataView(memory0).getInt32(ret + 32, true) >>> 0,
                uid: dataView(memory0).getInt32(ret + 36, true) >>> 0,
                gid: dataView(memory0).getInt32(ret + 40, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
                specData: [dataView(memory0).getInt32(ret + 64, true) >>> 0, dataView(memory0).getInt32(ret + 68, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 80, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(ret + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 108, true) >>> 0,
                },
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
              obj: result3,
              attr: variant4,
            }
          };
          break;
        }
        case 1: {
          let variant5;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant5 = undefined;
              break;
            }
            case 1: {
              variant5 = dataView(memory0).getInt32(ret + 12, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr6 = dataView(memory0).getInt32(ret + 16, true);
          var len6 = dataView(memory0).getInt32(ret + 20, true);
          var result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
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
      const retVal = variant7;
      postReturn1(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountPathconf;
    
    NfsMount.prototype.pathconf = function pathconf(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      const ret = nfsMethodNfsMountPathconf(handle0, ptr2, len2);
      let variant10;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          let variant3;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant3 = undefined;
              break;
            }
            case 1: {
              variant3 = {
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
          var bool4 = dataView(memory0).getUint8(ret + 112, true);
          var bool5 = dataView(memory0).getUint8(ret + 113, true);
          var bool6 = dataView(memory0).getUint8(ret + 114, true);
          var bool7 = dataView(memory0).getUint8(ret + 115, true);
          variant10= {
            tag: 'ok',
            val: {
              attr: variant3,
              linkmax: dataView(memory0).getInt32(ret + 104, true) >>> 0,
              nameMax: dataView(memory0).getInt32(ret + 108, true) >>> 0,
              noTrunc: bool4 == 0 ? false : (bool4 == 1 ? true : throwInvalidBool()),
              chownRestricted: bool5 == 0 ? false : (bool5 == 1 ? true : throwInvalidBool()),
              caseInsensitive: bool6 == 0 ? false : (bool6 == 1 ? true : throwInvalidBool()),
              casePreserving: bool7 == 0 ? false : (bool7 == 1 ? true : throwInvalidBool()),
            }
          };
          break;
        }
        case 1: {
          let variant8;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant8 = undefined;
              break;
            }
            case 1: {
              variant8 = dataView(memory0).getInt32(ret + 12, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr9 = dataView(memory0).getInt32(ret + 16, true);
          var len9 = dataView(memory0).getInt32(ret + 20, true);
          var result9 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr9, len9));
          variant10= {
            tag: 'err',
            val: {
              nfsErrorCode: variant8,
              message: result9,
            }
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      const retVal = variant10;
      postReturn2(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountPathconfPath;
    
    NfsMount.prototype.pathconfPath = function pathconfPath(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountPathconfPath(handle0, ptr2, len2);
      let variant10;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          let variant3;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant3 = undefined;
              break;
            }
            case 1: {
              variant3 = {
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
          var bool4 = dataView(memory0).getUint8(ret + 112, true);
          var bool5 = dataView(memory0).getUint8(ret + 113, true);
          var bool6 = dataView(memory0).getUint8(ret + 114, true);
          var bool7 = dataView(memory0).getUint8(ret + 115, true);
          variant10= {
            tag: 'ok',
            val: {
              attr: variant3,
              linkmax: dataView(memory0).getInt32(ret + 104, true) >>> 0,
              nameMax: dataView(memory0).getInt32(ret + 108, true) >>> 0,
              noTrunc: bool4 == 0 ? false : (bool4 == 1 ? true : throwInvalidBool()),
              chownRestricted: bool5 == 0 ? false : (bool5 == 1 ? true : throwInvalidBool()),
              caseInsensitive: bool6 == 0 ? false : (bool6 == 1 ? true : throwInvalidBool()),
              casePreserving: bool7 == 0 ? false : (bool7 == 1 ? true : throwInvalidBool()),
            }
          };
          break;
        }
        case 1: {
          let variant8;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant8 = undefined;
              break;
            }
            case 1: {
              variant8 = dataView(memory0).getInt32(ret + 12, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr9 = dataView(memory0).getInt32(ret + 16, true);
          var len9 = dataView(memory0).getInt32(ret + 20, true);
          var result9 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr9, len9));
          variant10= {
            tag: 'err',
            val: {
              nfsErrorCode: variant8,
              message: result9,
            }
          };
          break;
        }
        default: {
          throw new TypeError('invalid variant discriminant for expected');
        }
      }
      const retVal = variant10;
      postReturn2(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountRead;
    
    NfsMount.prototype.read = function read(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      const ret = nfsMethodNfsMountRead(handle0, ptr2, len2, toUint64(arg2), toUint32(arg3));
      let variant6;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr3 = dataView(memory0).getInt32(ret + 4, true);
          var len3 = dataView(memory0).getInt32(ret + 8, true);
          var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn3(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountReadPath;
    
    NfsMount.prototype.readPath = function readPath(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountReadPath(handle0, ptr2, len2, toUint64(arg2), toUint32(arg3));
      let variant6;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr3 = dataView(memory0).getInt32(ret + 4, true);
          var len3 = dataView(memory0).getInt32(ret + 8, true);
          var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn3(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountWrite;
    
    NfsMount.prototype.write = function write(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      var val3 = arg3;
      var len3 = val3.byteLength;
      var ptr3 = realloc0(0, 0, 1, len3 * 1);
      var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
      (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
      const ret = nfsMethodNfsMountWrite(handle0, ptr2, len2, toUint64(arg2), ptr3, len3);
      let variant6;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant6= {
            tag: 'ok',
            val: dataView(memory0).getInt32(ret + 4, true) >>> 0
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountWritePath;
    
    NfsMount.prototype.writePath = function writePath(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      var val3 = arg3;
      var len3 = val3.byteLength;
      var ptr3 = realloc0(0, 0, 1, len3 * 1);
      var src3 = new Uint8Array(val3.buffer || val3, val3.byteOffset, len3 * 1);
      (new Uint8Array(memory0.buffer, ptr3, len3 * 1)).set(src3);
      const ret = nfsMethodNfsMountWritePath(handle0, ptr2, len2, toUint64(arg2), ptr3, len3);
      let variant6;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          variant6= {
            tag: 'ok',
            val: dataView(memory0).getInt32(ret + 4, true) >>> 0
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountReaddir;
    
    NfsMount.prototype.readdir = function readdir(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      const ret = nfsMethodNfsMountReaddir(handle0, ptr2, len2);
      let variant7;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var len4 = dataView(memory0).getInt32(ret + 8, true);
          var base4 = dataView(memory0).getInt32(ret + 4, true);
          var result4 = [];
          for (let i = 0; i < len4; i++) {
            const base = base4 + i * 16;
            var ptr3 = dataView(memory0).getInt32(base + 8, true);
            var len3 = dataView(memory0).getInt32(base + 12, true);
            var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
            result4.push({
              fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
              fileName: result3,
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
          var ptr6 = dataView(memory0).getInt32(ret + 12, true);
          var len6 = dataView(memory0).getInt32(ret + 16, true);
          var result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
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
      const retVal = variant7;
      postReturn4(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountReaddirPath;
    
    NfsMount.prototype.readdirPath = function readdirPath(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountReaddirPath(handle0, ptr2, len2);
      let variant7;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var len4 = dataView(memory0).getInt32(ret + 8, true);
          var base4 = dataView(memory0).getInt32(ret + 4, true);
          var result4 = [];
          for (let i = 0; i < len4; i++) {
            const base = base4 + i * 16;
            var ptr3 = dataView(memory0).getInt32(base + 8, true);
            var len3 = dataView(memory0).getInt32(base + 12, true);
            var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
            result4.push({
              fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
              fileName: result3,
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
          var ptr6 = dataView(memory0).getInt32(ret + 12, true);
          var len6 = dataView(memory0).getInt32(ret + 16, true);
          var result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
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
      const retVal = variant7;
      postReturn4(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountReaddirplus;
    
    NfsMount.prototype.readdirplus = function readdirplus(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      const ret = nfsMethodNfsMountReaddirplus(handle0, ptr2, len2);
      let variant9;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var len6 = dataView(memory0).getInt32(ret + 8, true);
          var base6 = dataView(memory0).getInt32(ret + 4, true);
          var result6 = [];
          for (let i = 0; i < len6; i++) {
            const base = base6 + i * 120;
            var ptr3 = dataView(memory0).getInt32(base + 8, true);
            var len3 = dataView(memory0).getInt32(base + 12, true);
            var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
            let variant4;
            switch (dataView(memory0).getUint8(base + 16, true)) {
              case 0: {
                variant4 = undefined;
                break;
              }
              case 1: {
                variant4 = {
                  attrType: dataView(memory0).getInt32(base + 24, true) >>> 0,
                  fileMode: dataView(memory0).getInt32(base + 28, true) >>> 0,
                  nlink: dataView(memory0).getInt32(base + 32, true) >>> 0,
                  uid: dataView(memory0).getInt32(base + 36, true) >>> 0,
                  gid: dataView(memory0).getInt32(base + 40, true) >>> 0,
                  filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 48, true)),
                  used: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 56, true)),
                  specData: [dataView(memory0).getInt32(base + 64, true) >>> 0, dataView(memory0).getInt32(base + 68, true) >>> 0],
                  fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 72, true)),
                  fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 80, true)),
                  atime: {
                    seconds: dataView(memory0).getInt32(base + 88, true) >>> 0,
                    nseconds: dataView(memory0).getInt32(base + 92, true) >>> 0,
                  },
                  mtime: {
                    seconds: dataView(memory0).getInt32(base + 96, true) >>> 0,
                    nseconds: dataView(memory0).getInt32(base + 100, true) >>> 0,
                  },
                  ctime: {
                    seconds: dataView(memory0).getInt32(base + 104, true) >>> 0,
                    nseconds: dataView(memory0).getInt32(base + 108, true) >>> 0,
                  },
                };
                break;
              }
              default: {
                throw new TypeError('invalid variant discriminant for option');
              }
            }
            var ptr5 = dataView(memory0).getInt32(base + 112, true);
            var len5 = dataView(memory0).getInt32(base + 116, true);
            var result5 = new Uint8Array(memory0.buffer.slice(ptr5, ptr5 + len5 * 1));
            result6.push({
              fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
              fileName: result3,
              attr: variant4,
              handle: result5,
            });
          }
          variant9= {
            tag: 'ok',
            val: result6
          };
          break;
        }
        case 1: {
          let variant7;
          switch (dataView(memory0).getUint8(ret + 4, true)) {
            case 0: {
              variant7 = undefined;
              break;
            }
            case 1: {
              variant7 = dataView(memory0).getInt32(ret + 8, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr8 = dataView(memory0).getInt32(ret + 12, true);
          var len8 = dataView(memory0).getInt32(ret + 16, true);
          var result8 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr8, len8));
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
      const retVal = variant9;
      postReturn5(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountReaddirplusPath;
    
    NfsMount.prototype.readdirplusPath = function readdirplusPath(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountReaddirplusPath(handle0, ptr2, len2);
      let variant9;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var len6 = dataView(memory0).getInt32(ret + 8, true);
          var base6 = dataView(memory0).getInt32(ret + 4, true);
          var result6 = [];
          for (let i = 0; i < len6; i++) {
            const base = base6 + i * 120;
            var ptr3 = dataView(memory0).getInt32(base + 8, true);
            var len3 = dataView(memory0).getInt32(base + 12, true);
            var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
            let variant4;
            switch (dataView(memory0).getUint8(base + 16, true)) {
              case 0: {
                variant4 = undefined;
                break;
              }
              case 1: {
                variant4 = {
                  attrType: dataView(memory0).getInt32(base + 24, true) >>> 0,
                  fileMode: dataView(memory0).getInt32(base + 28, true) >>> 0,
                  nlink: dataView(memory0).getInt32(base + 32, true) >>> 0,
                  uid: dataView(memory0).getInt32(base + 36, true) >>> 0,
                  gid: dataView(memory0).getInt32(base + 40, true) >>> 0,
                  filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 48, true)),
                  used: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 56, true)),
                  specData: [dataView(memory0).getInt32(base + 64, true) >>> 0, dataView(memory0).getInt32(base + 68, true) >>> 0],
                  fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 72, true)),
                  fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 80, true)),
                  atime: {
                    seconds: dataView(memory0).getInt32(base + 88, true) >>> 0,
                    nseconds: dataView(memory0).getInt32(base + 92, true) >>> 0,
                  },
                  mtime: {
                    seconds: dataView(memory0).getInt32(base + 96, true) >>> 0,
                    nseconds: dataView(memory0).getInt32(base + 100, true) >>> 0,
                  },
                  ctime: {
                    seconds: dataView(memory0).getInt32(base + 104, true) >>> 0,
                    nseconds: dataView(memory0).getInt32(base + 108, true) >>> 0,
                  },
                };
                break;
              }
              default: {
                throw new TypeError('invalid variant discriminant for option');
              }
            }
            var ptr5 = dataView(memory0).getInt32(base + 112, true);
            var len5 = dataView(memory0).getInt32(base + 116, true);
            var result5 = new Uint8Array(memory0.buffer.slice(ptr5, ptr5 + len5 * 1));
            result6.push({
              fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(base + 0, true)),
              fileName: result3,
              attr: variant4,
              handle: result5,
            });
          }
          variant9= {
            tag: 'ok',
            val: result6
          };
          break;
        }
        case 1: {
          let variant7;
          switch (dataView(memory0).getUint8(ret + 4, true)) {
            case 0: {
              variant7 = undefined;
              break;
            }
            case 1: {
              variant7 = dataView(memory0).getInt32(ret + 8, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr8 = dataView(memory0).getInt32(ret + 12, true);
          var len8 = dataView(memory0).getInt32(ret + 16, true);
          var result8 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr8, len8));
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
      const retVal = variant9;
      postReturn6(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountMkdir;
    
    NfsMount.prototype.mkdir = function mkdir(arg1, arg2, arg3) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      const ret = nfsMethodNfsMountMkdir(handle0, ptr2, len2, ptr3, len3, toUint32(arg3));
      let variant8;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr4 = dataView(memory0).getInt32(ret + 8, true);
          var len4 = dataView(memory0).getInt32(ret + 12, true);
          var result4 = new Uint8Array(memory0.buffer.slice(ptr4, ptr4 + len4 * 1));
          let variant5;
          switch (dataView(memory0).getUint8(ret + 16, true)) {
            case 0: {
              variant5 = undefined;
              break;
            }
            case 1: {
              variant5 = {
                attrType: dataView(memory0).getInt32(ret + 24, true) >>> 0,
                fileMode: dataView(memory0).getInt32(ret + 28, true) >>> 0,
                nlink: dataView(memory0).getInt32(ret + 32, true) >>> 0,
                uid: dataView(memory0).getInt32(ret + 36, true) >>> 0,
                gid: dataView(memory0).getInt32(ret + 40, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
                specData: [dataView(memory0).getInt32(ret + 64, true) >>> 0, dataView(memory0).getInt32(ret + 68, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 80, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(ret + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 108, true) >>> 0,
                },
              };
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          variant8= {
            tag: 'ok',
            val: {
              obj: result4,
              attr: variant5,
            }
          };
          break;
        }
        case 1: {
          let variant6;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant6 = undefined;
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
          var ptr7 = dataView(memory0).getInt32(ret + 16, true);
          var len7 = dataView(memory0).getInt32(ret + 20, true);
          var result7 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr7, len7));
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
      const retVal = variant8;
      postReturn1(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountMkdirPath;
    
    NfsMount.prototype.mkdirPath = function mkdirPath(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountMkdirPath(handle0, ptr2, len2, toUint32(arg2));
      let variant7;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var ptr3 = dataView(memory0).getInt32(ret + 8, true);
          var len3 = dataView(memory0).getInt32(ret + 12, true);
          var result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
          let variant4;
          switch (dataView(memory0).getUint8(ret + 16, true)) {
            case 0: {
              variant4 = undefined;
              break;
            }
            case 1: {
              variant4 = {
                attrType: dataView(memory0).getInt32(ret + 24, true) >>> 0,
                fileMode: dataView(memory0).getInt32(ret + 28, true) >>> 0,
                nlink: dataView(memory0).getInt32(ret + 32, true) >>> 0,
                uid: dataView(memory0).getInt32(ret + 36, true) >>> 0,
                gid: dataView(memory0).getInt32(ret + 40, true) >>> 0,
                filesize: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 48, true)),
                used: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 56, true)),
                specData: [dataView(memory0).getInt32(ret + 64, true) >>> 0, dataView(memory0).getInt32(ret + 68, true) >>> 0],
                fsid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 72, true)),
                fileid: BigInt.asUintN(64, dataView(memory0).getBigInt64(ret + 80, true)),
                atime: {
                  seconds: dataView(memory0).getInt32(ret + 88, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 92, true) >>> 0,
                },
                mtime: {
                  seconds: dataView(memory0).getInt32(ret + 96, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 100, true) >>> 0,
                },
                ctime: {
                  seconds: dataView(memory0).getInt32(ret + 104, true) >>> 0,
                  nseconds: dataView(memory0).getInt32(ret + 108, true) >>> 0,
                },
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
              obj: result3,
              attr: variant4,
            }
          };
          break;
        }
        case 1: {
          let variant5;
          switch (dataView(memory0).getUint8(ret + 8, true)) {
            case 0: {
              variant5 = undefined;
              break;
            }
            case 1: {
              variant5 = dataView(memory0).getInt32(ret + 12, true);
              break;
            }
            default: {
              throw new TypeError('invalid variant discriminant for option');
            }
          }
          var ptr6 = dataView(memory0).getInt32(ret + 16, true);
          var len6 = dataView(memory0).getInt32(ret + 20, true);
          var result6 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr6, len6));
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
      const retVal = variant7;
      postReturn1(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountRemove;
    
    NfsMount.prototype.remove = function remove(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      const ret = nfsMethodNfsMountRemove(handle0, ptr2, len2, ptr3, len3);
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountRemovePath;
    
    NfsMount.prototype.removePath = function removePath(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountRemovePath(handle0, ptr2, len2);
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
          var ptr4 = dataView(memory0).getInt32(ret + 12, true);
          var len4 = dataView(memory0).getInt32(ret + 16, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountRmdir;
    
    NfsMount.prototype.rmdir = function rmdir(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      const ret = nfsMethodNfsMountRmdir(handle0, ptr2, len2, ptr3, len3);
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountRmdirPath;
    
    NfsMount.prototype.rmdirPath = function rmdirPath(arg1) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      const ret = nfsMethodNfsMountRmdirPath(handle0, ptr2, len2);
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
          var ptr4 = dataView(memory0).getInt32(ret + 12, true);
          var len4 = dataView(memory0).getInt32(ret + 16, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountRename;
    
    NfsMount.prototype.rename = function rename(arg1, arg2, arg3, arg4) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var val2 = arg1;
      var len2 = val2.byteLength;
      var ptr2 = realloc0(0, 0, 1, len2 * 1);
      var src2 = new Uint8Array(val2.buffer || val2, val2.byteOffset, len2 * 1);
      (new Uint8Array(memory0.buffer, ptr2, len2 * 1)).set(src2);
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      var val4 = arg3;
      var len4 = val4.byteLength;
      var ptr4 = realloc0(0, 0, 1, len4 * 1);
      var src4 = new Uint8Array(val4.buffer || val4, val4.byteOffset, len4 * 1);
      (new Uint8Array(memory0.buffer, ptr4, len4 * 1)).set(src4);
      var ptr5 = utf8Encode(arg4, realloc0, memory0);
      var len5 = utf8EncodedLen;
      const ret = nfsMethodNfsMountRename(handle0, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
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
          var ptr7 = dataView(memory0).getInt32(ret + 12, true);
          var len7 = dataView(memory0).getInt32(ret + 16, true);
          var result7 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr7, len7));
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
      const retVal = variant8;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountRenamePath;
    
    NfsMount.prototype.renamePath = function renamePath(arg1, arg2) {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      var ptr2 = utf8Encode(arg1, realloc0, memory0);
      var len2 = utf8EncodedLen;
      var ptr3 = utf8Encode(arg2, realloc0, memory0);
      var len3 = utf8EncodedLen;
      const ret = nfsMethodNfsMountRenamePath(handle0, ptr2, len2, ptr3, len3);
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
          var ptr5 = dataView(memory0).getInt32(ret + 12, true);
          var len5 = dataView(memory0).getInt32(ret + 16, true);
          var result5 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr5, len5));
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
      const retVal = variant6;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountUmount;
    
    NfsMount.prototype.umount = function umount() {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      const ret = nfsMethodNfsMountUmount(handle0);
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
          var ptr3 = dataView(memory0).getInt32(ret + 12, true);
          var len3 = dataView(memory0).getInt32(ret + 16, true);
          var result3 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr3, len3));
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
      const retVal = variant4;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsMethodNfsMountVersion;
    
    NfsMount.prototype.version = function version() {
      var handle1 = this[symbolRscHandle];
      if (!handle1 || (handleTable8[(handle1 << 1) + 1] & T_FLAG) === 0) {
        throw new TypeError('Resource error: Not a valid "NfsMount" resource.');
      }
      var handle0 = handleTable8[(handle1 << 1) + 1] & ~T_FLAG;
      const ret = nfsMethodNfsMountVersion(handle0);
      let variant5;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          let enum2;
          switch (dataView(memory0).getUint8(ret + 4, true)) {
            case 0: {
              enum2 = 'nfs-v3';
              break;
            }
            case 1: {
              enum2 = 'nfs-v4';
              break;
            }
            case 2: {
              enum2 = 'nfs-v4p1';
              break;
            }
            default: {
              throw new TypeError('invalid discriminant specified for NfsVersion');
            }
          }
          variant5= {
            tag: 'ok',
            val: enum2
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
          var ptr4 = dataView(memory0).getInt32(ret + 12, true);
          var len4 = dataView(memory0).getInt32(ret + 16, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    };
    let nfsParseUrlAndMount;
    
    function parseUrlAndMount(arg0) {
      var ptr0 = utf8Encode(arg0, realloc0, memory0);
      var len0 = utf8EncodedLen;
      const ret = nfsParseUrlAndMount(ptr0, len0);
      let variant5;
      switch (dataView(memory0).getUint8(ret + 0, true)) {
        case 0: {
          var handle2 = dataView(memory0).getInt32(ret + 4, true);
          var rsc1 = new.target === NfsMount ? this : Object.create(NfsMount.prototype);
          Object.defineProperty(rsc1, symbolRscHandle, { writable: true, value: handle2});
          finalizationRegistry8.register(rsc1, handle2, rsc1);
          Object.defineProperty(rsc1, symbolDispose, { writable: true, value: function () {
            finalizationRegistry8.unregister(rsc1);
            rscTableRemove(handleTable8, handle2);
            rsc1[symbolDispose] = emptyFunc;
            rsc1[symbolRscHandle] = undefined;
            exports0['33'](handleTable8[(handle2 << 1) + 1] & ~T_FLAG);
          }});
          variant5= {
            tag: 'ok',
            val: rsc1
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
          var ptr4 = dataView(memory0).getInt32(ret + 12, true);
          var len4 = dataView(memory0).getInt32(ret + 16, true);
          var result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
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
      const retVal = variant5;
      postReturn0(ret);
      if (typeof retVal === 'object' && retVal.tag === 'err') {
        throw new ComponentError(retVal.val);
      }
      return retVal.val;
    }
    nfsMethodNfsMountNullOp = exports1['component:nfs-rs/nfs#[method]nfs-mount.null-op'];
    nfsMethodNfsMountAccess = exports1['component:nfs-rs/nfs#[method]nfs-mount.access'];
    nfsMethodNfsMountAccessPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.access-path'];
    nfsMethodNfsMountClose = exports1['component:nfs-rs/nfs#[method]nfs-mount.close'];
    nfsMethodNfsMountCommit = exports1['component:nfs-rs/nfs#[method]nfs-mount.commit'];
    nfsMethodNfsMountCommitPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.commit-path'];
    nfsMethodNfsMountCreate = exports1['component:nfs-rs/nfs#[method]nfs-mount.create'];
    nfsMethodNfsMountCreatePath = exports1['component:nfs-rs/nfs#[method]nfs-mount.create-path'];
    nfsMethodNfsMountDelegpurge = exports1['component:nfs-rs/nfs#[method]nfs-mount.delegpurge'];
    nfsMethodNfsMountDelegreturn = exports1['component:nfs-rs/nfs#[method]nfs-mount.delegreturn'];
    nfsMethodNfsMountGetattr = exports1['component:nfs-rs/nfs#[method]nfs-mount.getattr'];
    nfsMethodNfsMountGetattrPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.getattr-path'];
    nfsMethodNfsMountSetattr = exports1['component:nfs-rs/nfs#[method]nfs-mount.setattr'];
    nfsMethodNfsMountSetattrPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.setattr-path'];
    nfsMethodNfsMountGetfh = exports1['component:nfs-rs/nfs#[method]nfs-mount.getfh'];
    nfsMethodNfsMountLink = exports1['component:nfs-rs/nfs#[method]nfs-mount.link'];
    nfsMethodNfsMountLinkPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.link-path'];
    nfsMethodNfsMountSymlink = exports1['component:nfs-rs/nfs#[method]nfs-mount.symlink'];
    nfsMethodNfsMountSymlinkPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.symlink-path'];
    nfsMethodNfsMountReadlink = exports1['component:nfs-rs/nfs#[method]nfs-mount.readlink'];
    nfsMethodNfsMountReadlinkPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.readlink-path'];
    nfsMethodNfsMountLookup = exports1['component:nfs-rs/nfs#[method]nfs-mount.lookup'];
    nfsMethodNfsMountLookupPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.lookup-path'];
    nfsMethodNfsMountPathconf = exports1['component:nfs-rs/nfs#[method]nfs-mount.pathconf'];
    nfsMethodNfsMountPathconfPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.pathconf-path'];
    nfsMethodNfsMountRead = exports1['component:nfs-rs/nfs#[method]nfs-mount.read'];
    nfsMethodNfsMountReadPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.read-path'];
    nfsMethodNfsMountWrite = exports1['component:nfs-rs/nfs#[method]nfs-mount.write'];
    nfsMethodNfsMountWritePath = exports1['component:nfs-rs/nfs#[method]nfs-mount.write-path'];
    nfsMethodNfsMountReaddir = exports1['component:nfs-rs/nfs#[method]nfs-mount.readdir'];
    nfsMethodNfsMountReaddirPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.readdir-path'];
    nfsMethodNfsMountReaddirplus = exports1['component:nfs-rs/nfs#[method]nfs-mount.readdirplus'];
    nfsMethodNfsMountReaddirplusPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.readdirplus-path'];
    nfsMethodNfsMountMkdir = exports1['component:nfs-rs/nfs#[method]nfs-mount.mkdir'];
    nfsMethodNfsMountMkdirPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.mkdir-path'];
    nfsMethodNfsMountRemove = exports1['component:nfs-rs/nfs#[method]nfs-mount.remove'];
    nfsMethodNfsMountRemovePath = exports1['component:nfs-rs/nfs#[method]nfs-mount.remove-path'];
    nfsMethodNfsMountRmdir = exports1['component:nfs-rs/nfs#[method]nfs-mount.rmdir'];
    nfsMethodNfsMountRmdirPath = exports1['component:nfs-rs/nfs#[method]nfs-mount.rmdir-path'];
    nfsMethodNfsMountRename = exports1['component:nfs-rs/nfs#[method]nfs-mount.rename'];
    nfsMethodNfsMountRenamePath = exports1['component:nfs-rs/nfs#[method]nfs-mount.rename-path'];
    nfsMethodNfsMountUmount = exports1['component:nfs-rs/nfs#[method]nfs-mount.umount'];
    nfsMethodNfsMountVersion = exports1['component:nfs-rs/nfs#[method]nfs-mount.version'];
    nfsParseUrlAndMount = exports1['component:nfs-rs/nfs#parse-url-and-mount'];
    const nfs = {
      NfsMount: NfsMount,
      parseUrlAndMount: parseUrlAndMount,
      
    };
    
    return { nfs, 'component:nfs-rs/nfs': nfs,  };
  })();
  let promise, resolve, reject;
  function runNext (value) {
    try {
      let done;
      do {
        ({ value, done } = gen.next(value));
      } while (!(value instanceof Promise) && !done);
      if (done) {
        if (resolve) return resolve(value);
        else return value;
      }
      if (!promise) promise = new Promise((_resolve, _reject) => (resolve = _resolve, reject = _reject));
      value.then(nextVal => done ? resolve() : runNext(nextVal), reject);
    }
    catch (e) {
      if (reject) reject(e);
      else throw e;
    }
  }
  const maybeSyncReturn = runNext(null);
  return promise || maybeSyncReturn;
}
