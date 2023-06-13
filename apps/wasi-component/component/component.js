import { exit as lowering3Callee } from '@wasm-env/wasi-js/wasi_snapshot_preview2/exit';
import { dropInputStream as lowering4Callee, dropOutputStream as lowering5Callee, write as lowering10Callee, blockingWrite as lowering11Callee } from '@wasm-env/wasi-js/wasi_snapshot_preview2/streams';
import { getStdio as lowering6Callee, getDirectories as lowering7Callee } from '@wasm-env/wasi-js/wasi_snapshot_preview2/preopens';
import { writeViaStream as lowering0Callee, appendViaStream as lowering1Callee, dropDescriptor as lowering2Callee, getType as lowering8Callee } from '@wasm-env/wasi-js/wasi_snapshot_preview2/filesystem';
import { getEnvironment as lowering9Callee } from '@wasm-env/wasi-js/wasi_snapshot_preview2/environment';

//import { instantiateWithAsyncDetection } from '@wasm-env/wasi-js/desyncify.js'
import { WASI, copyBuffer } from '@wasm-env/wasi-js';

const base64Compile = str => WebAssembly.compile(typeof Buffer !== 'undefined' ? Buffer.from(str, 'base64') : Uint8Array.from(atob(str), b => b.charCodeAt(0)));

class ComponentError extends Error {
  constructor (value) {
    const enumerable = typeof value !== 'string';
    super(enumerable ? `${String(value)} (see error.payload)` : value);
    Object.defineProperty(this, 'payload', { value, enumerable });
  }
}

let dv = new DataView(new ArrayBuffer());
const dataView = mem => dv.buffer === mem.buffer ? dv : dv = new DataView(mem.buffer);

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
let _fs;
async function fetchCompile (url) {
  if (isNode) {
    _fs = _fs || await import('fs/promises');
    return WebAssembly.compile(await _fs.readFile(url));
  }
  return fetch(url).then(WebAssembly.compileStreaming);
}

function getErrorPayload(e) {
  if (hasOwnProperty.call(e, 'payload')) return e.payload;
  if (hasOwnProperty.call(e, 'message')) return String(e.message);
  return String(e);
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

async function fetchBuffer(url) {
  if (isNode) {
    _fs = _fs || await import('fs/promises');
    return await _fs.readFile(url);
  }
  return fetch(url);
}


const toUint64 = val => BigInt.asUintN(64, val);

function toString(val) {
  if (typeof val === 'symbol') throw new TypeError('symbols cannot be converted to strings');
  return String(val);
}

function toUint32(val) {
  return val >>> 0;
}

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

function lowering0(arg0, arg1) {
  const ret = lowering0Callee(arg0 >>> 0, BigInt.asUintN(64, arg1));
  return toUint32(ret);
}

function lowering1(arg0) {
  const ret = lowering1Callee(arg0 >>> 0);
  return toUint32(ret);
}

function lowering2(arg0) {
  lowering2Callee(arg0 >>> 0);
}

function lowering3(arg0) {
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
  lowering3Callee(variant0);
}

function lowering4(arg0) {
  lowering4Callee(arg0 >>> 0);
}

function lowering5(arg0) {
  lowering5Callee(arg0 >>> 0);
}
let exported;
let memory0;

function lowering6(arg0) {
  const ret = lowering6Callee();
  const {stdin: v0_0, stdout: v0_1, stderr: v0_2 } = ret;
  dataView(memory0).setInt32(arg0 + 0, toUint32(v0_0), true);
  dataView(memory0).setInt32(arg0 + 4, toUint32(v0_1), true);
  dataView(memory0).setInt32(arg0 + 8, toUint32(v0_2), true);
}
let realloc0;

function lowering7(arg0) {
  const ret = lowering7Callee();
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

function lowering8(arg0, arg1) {
  let ret;
  try {
    ret = { tag: 'ok', val: lowering8Callee(arg0 >>> 0) };
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  const variant2 = ret;
  switch (variant2.tag) {
    case 'ok': {
      const e = variant2.val;
      dataView(memory0).setInt8(arg1 + 0, 0, true);
      const val0 = toString(e);
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
          throw new TypeError(`"${val0}" is not one of the cases of descriptor-type`);
        }
      }
      dataView(memory0).setInt8(arg1 + 1, enum0, true);
      break;
    }
    case 'err': {
      const e = variant2.val;
      dataView(memory0).setInt8(arg1 + 0, 1, true);
      const val1 = toString(e);
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

function lowering9(arg0) {
  const ret = lowering9Callee();
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

function lowering10(arg0, arg1, arg2, arg3) {
  const ptr0 = arg1;
  const len0 = arg2;
  const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
  let ret;
  try {
    ret = { tag: 'ok', val: lowering10Callee(arg0 >>> 0, result0) };
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

function lowering11(arg0, arg1, arg2, arg3) {
  const ptr0 = arg1;
  const len0 = arg2;
  const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
  let ret;
  try {
    ret = { tag: 'ok', val: lowering11Callee(arg0 >>> 0, result0) };
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

async function run() {
  const ret = await exported.run();
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
      throw new TypeError(`invalid variant discriminant for expected: ${ret}`);
    }
  }
  if (variant0.tag === 'err') {
    throw new ComponentError(variant0.val);
  }
  // (async() => lowering3(ret))(); // invoke `lowering3(ret)` asynchronously here? (lowering3 == exit) ... shouldn't exit be invoked implicitly?
  return variant0.val;
}

export { run }

const initBufferFromString = (str) => Buffer.from(str, 'base64')

let wasi = new WASI({});

async function instantiateCore(wasmModOrBufferSource, imports) {
  let inst = await wasi.instantiateSingle(wasmModOrBufferSource, imports);
  return {instance: inst};
}

const $init = (async() => {
  //({ exports: exported } = await wasi.instantiateMultiModule(async () => {
    //const module0 = fetchCompile(new URL('./component.core.wasm', import.meta.url));
    const module0 = await fetchBuffer(new URL('./component.core.wasm', import.meta.url));
    //const module1 = fetchCompile(new URL('./component.core2.wasm', import.meta.url));
    const module1 = await fetchBuffer(new URL('./component.core2.wasm', import.meta.url));
    //const module2 = base64Compile('AGFzbQEAAAABIwZgAX8AYAJ/fwBgBH9/f38AYAR/f39/AX9gAn9/AX9gAX8AAwsKAAABAAICAwQEBQQFAXABCgoHNAsBMAAAATEAAQEyAAIBMwADATQABAE1AAUBNgAGATcABwE4AAgBOQAJCCRpbXBvcnRzAQAKfQoJACAAQQARAAALCQAgAEEBEQAACwsAIAAgAUECEQEACwkAIABBAxEAAAsPACAAIAEgAiADQQQRAgALDwAgACABIAIgA0EFEQIACw8AIAAgASACIANBBhEDAAsLACAAIAFBBxEEAAsLACAAIAFBCBEEAAsJACAAQQkRBQALAC0JcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBDXdpdC1jb21wb25lbnQFMC43LjEAhAMEbmFtZQATEndpdC1jb21wb25lbnQ6c2hpbQHnAgoAG2luZGlyZWN0LXByZW9wZW5zLWdldC1zdGRpbwEhaW5kaXJlY3QtcHJlb3BlbnMtZ2V0LWRpcmVjdG9yaWVzAhxpbmRpcmVjdC1maWxlc3lzdGVtLWdldC10eXBlAyRpbmRpcmVjdC1lbnZpcm9ubWVudC1nZXQtZW52aXJvbm1lbnQEFmluZGlyZWN0LXN0cmVhbXMtd3JpdGUFH2luZGlyZWN0LXN0cmVhbXMtYmxvY2tpbmctd3JpdGUGJWFkYXB0LXdhc2lfc25hcHNob3RfcHJldmlldzEtZmRfd3JpdGUHKGFkYXB0LXdhc2lfc25hcHNob3RfcHJldmlldzEtZW52aXJvbl9nZXQILmFkYXB0LXdhc2lfc25hcHNob3RfcHJldmlldzEtZW52aXJvbl9zaXplc19nZXQJJmFkYXB0LXdhc2lfc25hcHNob3RfcHJldmlldzEtcHJvY19leGl0');
    const module2 = initBufferFromString('AGFzbQEAAAABIwZgAX8AYAJ/fwBgBH9/f38AYAR/f39/AX9gAn9/AX9gAX8AAwsKAAABAAICAwQEBQQFAXABCgoHNAsBMAAAATEAAQEyAAIBMwADATQABAE1AAUBNgAGATcABwE4AAgBOQAJCCRpbXBvcnRzAQAKfQoJACAAQQARAAALCQAgAEEBEQAACwsAIAAgAUECEQEACwkAIABBAxEAAAsPACAAIAEgAiADQQQRAgALDwAgACABIAIgA0EFEQIACw8AIAAgASACIANBBhEDAAsLACAAIAFBBxEEAAsLACAAIAFBCBEEAAsJACAAQQkRBQALAC0JcHJvZHVjZXJzAQxwcm9jZXNzZWQtYnkBDXdpdC1jb21wb25lbnQFMC43LjEAhAMEbmFtZQATEndpdC1jb21wb25lbnQ6c2hpbQHnAgoAG2luZGlyZWN0LXByZW9wZW5zLWdldC1zdGRpbwEhaW5kaXJlY3QtcHJlb3BlbnMtZ2V0LWRpcmVjdG9yaWVzAhxpbmRpcmVjdC1maWxlc3lzdGVtLWdldC10eXBlAyRpbmRpcmVjdC1lbnZpcm9ubWVudC1nZXQtZW52aXJvbm1lbnQEFmluZGlyZWN0LXN0cmVhbXMtd3JpdGUFH2luZGlyZWN0LXN0cmVhbXMtYmxvY2tpbmctd3JpdGUGJWFkYXB0LXdhc2lfc25hcHNob3RfcHJldmlldzEtZmRfd3JpdGUHKGFkYXB0LXdhc2lfc25hcHNob3RfcHJldmlldzEtZW52aXJvbl9nZXQILmFkYXB0LXdhc2lfc25hcHNob3RfcHJldmlldzEtZW52aXJvbl9zaXplc19nZXQJJmFkYXB0LXdhc2lfc25hcHNob3RfcHJldmlldzEtcHJvY19leGl0');
    //const module3 = base64Compile('AGFzbQEAAAABIwZgAX8AYAJ/fwBgBH9/f38AYAR/f39/AX9gAn9/AX9gAX8AAkILAAEwAAAAATEAAAABMgABAAEzAAAAATQAAgABNQACAAE2AAMAATcABAABOAAEAAE5AAUACCRpbXBvcnRzAXABCgoJEAEAQQALCgABAgMEBQYHCAkALQlwcm9kdWNlcnMBDHByb2Nlc3NlZC1ieQENd2l0LWNvbXBvbmVudAUwLjcuMQAcBG5hbWUAFRR3aXQtY29tcG9uZW50OmZpeHVwcw');
    const module3 = initBufferFromString('AGFzbQEAAAABIwZgAX8AYAJ/fwBgBH9/f38AYAR/f39/AX9gAn9/AX9gAX8AAkILAAEwAAAAATEAAAABMgABAAEzAAAAATQAAgABNQACAAE2AAMAATcABAABOAAEAAE5AAUACCRpbXBvcnRzAXABCgoJEAEAQQALCgABAgMEBQYHCAkALQlwcm9kdWNlcnMBDHByb2Nlc3NlZC1ieQENd2l0LWNvbXBvbmVudAUwLjcuMQAcBG5hbWUAFRR3aXQtY29tcG9uZW50OmZpeHVwcw');
    Promise.all([module0, module1, module2, module3]).catch(() => {});
    const instance0Imports = undefined;
    const { instance: instance0 } = await instantiateCore(await module2, instance0Imports);
    const exports0 = instance0.exports;
    const instance1Imports = {
      wasi_snapshot_preview1: {
        environ_get: exports0['7'],
        environ_sizes_get: exports0['8'],
        fd_write: exports0['6'],
        proc_exit: exports0['9'],
      },
    };
    const { instance: instance1 } = await instantiateCore(await module0, instance1Imports);
    const exports1 = instance1.exports;
    let exports1MemoryBuffer = await exports1.memory;
    let exports1Memory = exports1MemoryBuffer;
  
    const instance2Imports = {
      __main_module__: {
        _start: exports1._start,
      },
      env: {
        memory: exports1MemoryBuffer,
      },
      environment: {
        'get-environment': exports0['3'],
      },
      exit: {
        exit: lowering3,
      },
      filesystem: {
        'append-via-stream': lowering1,
        'drop-descriptor': lowering2,
        'get-type': exports0['2'],
        'write-via-stream': lowering0,
      },
      preopens: {
        'get-directories': exports0['1'],
        'get-stdio': exports0['0'],
      },
      streams: {
        'blocking-write': exports0['5'],
        'drop-input-stream': lowering4,
        'drop-output-stream': lowering5,
        write: exports0['4'],
      },
    };
    const { instance: instance2 } = await instantiateCore(await module1, instance2Imports);
    const exports2 = instance2.exports;
    memory0 = await exports1.memory;
    realloc0 = exports2.cabi_import_realloc;

    //let instance3ImportsTableReference = exports0.$imports;
    let instance3ImportsTableReference = "module0.exports.$imports";

    const instance3Imports = {
      '': {
        $imports: instance3ImportsTableReference,
        '0': lowering6,
        '1': lowering7,
        '2': lowering8,
        '3': lowering9,
        '4': lowering10,
        '5': lowering11,
        '6': exports2.fd_write,
        '7': exports2.environ_get,
        '8': exports2.environ_sizes_get,
        '9': exports2.proc_exit,
      },
    };
    const { instance: instance3 } = await instantiateCore(await module3, instance3Imports);
    /*return {
      instanceSource: module1,
      instanceImport: instance2Imports,
      instances: [instance0, instance1, instance2, instance3],
      imports: [instance0Imports, instance1Imports, instance2Imports, instance3Imports],
    };
  //}));
  */

  exported = exports1;

})();

await $init;
