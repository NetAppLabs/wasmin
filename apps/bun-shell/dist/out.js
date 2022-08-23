var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/bun-utilities/index.mjs
var bun_utilities_exports = {};
__export(bun_utilities_exports, {
  default: () => bun_utilities_default
});
import { readdir, unlink } from "fs/promises";
import { join as join2 } from "path";
var isMusl, nativeBindingPath, nativeBinding, loadError, bun_utilities_default;
var init_bun_utilities = __esm({
  async "node_modules/bun-utilities/index.mjs"() {
    if (typeof __require === "undefined") {
      const { createRequire } = await import("node:module");
      globalThis.require = createRequire(import.meta.url);
    }
    isMusl = async () => {
      const { readFileSync, existsSync } = await import("fs");
      if (!process.report || typeof process.report.getReport !== "function") {
        try {
          if (existsSync("./bun-utilities.conf.txt")) {
            if (readFileSync("./bun-utilities.conf.txt").includes("musl"))
              return true;
            else
              return false;
          } else
            return readFileSync("/usr/bin/ldd", "utf8").includes("musl");
        } catch (e) {
          return true;
        }
      } else {
        if (existsSync("./bun-utilities.conf.txt")) {
          if (readFileSync("./bun-utilities.conf.txt").includes("musl"))
            return true;
          else
            return false;
        } else {
          const { glibcVersionRuntime } = process.report.getReport().header;
          return !glibcVersionRuntime;
        }
      }
    };
    nativeBindingPath = null;
    nativeBinding = null;
    loadError = null;
    bun_utilities_default = async () => {
      if (nativeBinding)
        return nativeBinding;
      const urlPathName = new URL(".", import.meta.url).pathname;
      const __dirname = process.platform === "win32" ? urlPathName.slice(1) : urlPathName;
      switch (process.platform) {
        case "android":
          switch (process.arch) {
            case "arm64":
              try {
                nativeBindingPath = "./bindings/bun-utilities.android-arm64.node";
                nativeBinding = __require(nativeBindingPath);
              } catch (e) {
                loadError = e;
              }
              break;
            case "arm":
              try {
                nativeBindingPath = "./bindings/bun-utilities.android-arm-eabi.node";
                nativeBinding = __require(nativeBindingPath);
              } catch (e) {
                loadError = e;
              }
              break;
            default:
              throw new Error(`Unsupported architecture on Android ${arch}`);
          }
          break;
        case "win32":
          switch (process.arch) {
            case "x64":
              try {
                nativeBindingPath = "./bindings/bun-utilities.win32-x64-msvc.node";
                nativeBinding = __require(nativeBindingPath);
              } catch (e) {
                loadError = e;
              }
              break;
            case "ia32":
              try {
                nativeBindingPath = "./bindings/bun-utilities.win32-ia32-msvc.node";
                nativeBinding = __require(nativeBindingPath);
              } catch (e) {
                loadError = e;
              }
              break;
            case "arm64":
              try {
                nativeBindingPath = "./bindings/bun-utilities.win32-arm64-msvc.node";
                nativeBinding = __require(nativeBindingPath);
              } catch (e) {
                loadError = e;
              }
              break;
            default:
              throw new Error(`Unsupported architecture on Windows: ${process.arch}`);
          }
          break;
        case "darwin":
          switch (process.arch) {
            case "x64":
              try {
                nativeBindingPath = "./bindings/bun-utilities.darwin-x64.node";
                nativeBinding = __require(nativeBindingPath);
              } catch (e) {
                loadError = e;
              }
              break;
            case "arm64":
              try {
                nativeBindingPath = "./bindings/bun-utilities.darwin-arm64.node";
                nativeBinding = __require(nativeBindingPath);
              } catch (e) {
                loadError = e;
              }
              break;
            default:
              throw new Error(`Unsupported architecture on macOS: ${process.arch}`);
          }
          break;
        case "freebsd":
          if (process.arch !== "x64") {
            throw new Error(`Unsupported architecture on FreeBSD: ${process.arch}`);
          }
          try {
            nativeBindingPath = "./bindings/bun-utilities.freebsd-x64.node";
            nativeBinding = __require(nativeBindingPath);
          } catch (e) {
            loadError = e;
          }
          break;
        case "linux":
          switch (process.arch) {
            case "x64":
              if (await isMusl()) {
                try {
                  nativeBindingPath = "./bindings/bun-utilities.linux-x64-musl.node";
                  nativeBinding = __require(nativeBindingPath);
                } catch (e) {
                  loadError = e;
                }
              } else {
                try {
                  nativeBindingPath = "./bindings/bun-utilities.linux-x64-gnu.node";
                  nativeBinding = __require(nativeBindingPath);
                } catch (e) {
                  loadError = e;
                }
              }
              break;
            case "arm64":
              if (await isMusl()) {
                try {
                  nativeBindingPath = "./bindings/bun-utilities.linux-arm64-musl.node";
                  nativeBinding = __require(nativeBindingPath);
                } catch (e) {
                  loadError = e;
                }
              } else {
                try {
                  nativeBindingPath = "./bindings/bun-utilities.linux-arm64-gnu.node";
                  nativeBinding = __require(nativeBindingPath);
                } catch (e) {
                  loadError = e;
                }
              }
              break;
            case "arm":
              try {
                nativeBindingPath = "./bindings/bun-utilities.linux-arm-gnueabihf.node";
                nativeBinding = __require(nativeBindingPath);
              } catch (e) {
                loadError = e;
              }
              break;
            default:
              throw new Error(`Unsupported architecture on Linux: ${process.arch}`);
          }
          break;
        default:
          throw new Error(`Unsupported OS: ${process.platform}, architecture: ${process.arch}`);
      }
      if (!nativeBinding) {
        if (loadError) {
          throw loadError;
        }
        throw new Error(`Failed to load native binding`);
      }
      for (const bindings2 of await readdir(join2(__dirname, "bindings"))) {
        if (bindings2 === nativeBindingPath.split("/")[2])
          continue;
        if (bindings2.endsWith(".node"))
          unlink(join2(__dirname, "bindings", bindings2));
      }
      return nativeBinding;
    };
  }
});

// ../../node_modules/bun/node_modules/isarray/index.js
var require_isarray = __commonJS({
  "../../node_modules/bun/node_modules/isarray/index.js"(exports, module) {
    module.exports = Array.isArray || function(arr) {
      return Object.prototype.toString.call(arr) == "[object Array]";
    };
  }
});

// ../../node_modules/core-util-is/lib/util.js
var require_util2 = __commonJS({
  "../../node_modules/core-util-is/lib/util.js"(exports) {
    function isArray(arg) {
      if (Array.isArray) {
        return Array.isArray(arg);
      }
      return objectToString(arg) === "[object Array]";
    }
    exports.isArray = isArray;
    function isBoolean2(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean2;
    function isNull2(arg) {
      return arg === null;
    }
    exports.isNull = isNull2;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    function isObject2(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject2;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    function isError(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = __require("buffer").Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// ../../node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "../../node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// ../../node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "../../node_modules/inherits/inherits.js"(exports, module) {
    try {
      util = __require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module.exports = util.inherits;
    } catch (e) {
      module.exports = require_inherits_browser();
    }
    var util;
  }
});

// ../../node_modules/string_decoder/index.js
var require_string_decoder = __commonJS({
  "../../node_modules/string_decoder/index.js"(exports) {
    var Buffer2 = __require("buffer").Buffer;
    var isBufferEncoding = Buffer2.isEncoding || function(encoding) {
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function assertEncoding(encoding) {
      if (encoding && !isBufferEncoding(encoding)) {
        throw new Error("Unknown encoding: " + encoding);
      }
    }
    var StringDecoder = exports.StringDecoder = function(encoding) {
      this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, "");
      assertEncoding(encoding);
      switch (this.encoding) {
        case "utf8":
          this.surrogateSize = 3;
          break;
        case "ucs2":
        case "utf16le":
          this.surrogateSize = 2;
          this.detectIncompleteChar = utf16DetectIncompleteChar;
          break;
        case "base64":
          this.surrogateSize = 3;
          this.detectIncompleteChar = base64DetectIncompleteChar;
          break;
        default:
          this.write = passThroughWrite;
          return;
      }
      this.charBuffer = new Buffer2(6);
      this.charReceived = 0;
      this.charLength = 0;
    };
    StringDecoder.prototype.write = function(buffer) {
      var charStr = "";
      while (this.charLength) {
        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
        buffer.copy(this.charBuffer, this.charReceived, 0, available);
        this.charReceived += available;
        if (this.charReceived < this.charLength) {
          return "";
        }
        buffer = buffer.slice(available, buffer.length);
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 55296 && charCode <= 56319) {
          this.charLength += this.surrogateSize;
          charStr = "";
          continue;
        }
        this.charReceived = this.charLength = 0;
        if (buffer.length === 0) {
          return charStr;
        }
        break;
      }
      this.detectIncompleteChar(buffer);
      var end = buffer.length;
      if (this.charLength) {
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
        end -= this.charReceived;
      }
      charStr += buffer.toString(this.encoding, 0, end);
      var end = charStr.length - 1;
      var charCode = charStr.charCodeAt(end);
      if (charCode >= 55296 && charCode <= 56319) {
        var size = this.surrogateSize;
        this.charLength += size;
        this.charReceived += size;
        this.charBuffer.copy(this.charBuffer, size, 0, size);
        buffer.copy(this.charBuffer, 0, 0, size);
        return charStr.substring(0, end);
      }
      return charStr;
    };
    StringDecoder.prototype.detectIncompleteChar = function(buffer) {
      var i2 = buffer.length >= 3 ? 3 : buffer.length;
      for (; i2 > 0; i2--) {
        var c = buffer[buffer.length - i2];
        if (i2 == 1 && c >> 5 == 6) {
          this.charLength = 2;
          break;
        }
        if (i2 <= 2 && c >> 4 == 14) {
          this.charLength = 3;
          break;
        }
        if (i2 <= 3 && c >> 3 == 30) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i2;
    };
    StringDecoder.prototype.end = function(buffer) {
      var res = "";
      if (buffer && buffer.length)
        res = this.write(buffer);
      if (this.charReceived) {
        var cr = this.charReceived;
        var buf = this.charBuffer;
        var enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }
      return res;
    };
    function passThroughWrite(buffer) {
      return buffer.toString(this.encoding);
    }
    function utf16DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 2;
      this.charLength = this.charReceived ? 2 : 0;
    }
    function base64DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 3;
      this.charLength = this.charReceived ? 3 : 0;
    }
  }
});

// ../../node_modules/bun/node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "../../node_modules/bun/node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
    module.exports = Readable2;
    var isArray = require_isarray();
    var Buffer2 = __require("buffer").Buffer;
    Readable2.ReadableState = ReadableState;
    var EE = __require("events").EventEmitter;
    if (!EE.listenerCount)
      EE.listenerCount = function(emitter, type2) {
        return emitter.listeners(type2).length;
      };
    var Stream = __require("stream");
    var util = require_util2();
    util.inherits = require_inherits();
    var StringDecoder;
    util.inherits(Readable2, Stream);
    function ReadableState(options, stream) {
      options = options || {};
      var hwm = options.highWaterMark;
      this.highWaterMark = hwm || hwm === 0 ? hwm : 16 * 1024;
      this.highWaterMark = ~~this.highWaterMark;
      this.buffer = [];
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = false;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.calledRead = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.objectMode = !!options.objectMode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.ranOut = false;
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder)
          StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable2(options) {
      if (!(this instanceof Readable2))
        return new Readable2(options);
      this._readableState = new ReadableState(options, this);
      this.readable = true;
      Stream.call(this);
    }
    Readable2.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      if (typeof chunk === "string" && !state.objectMode) {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = new Buffer2(chunk, encoding);
          encoding = "";
        }
      }
      return readableAddChunk(this, state, chunk, encoding, false);
    };
    Readable2.prototype.unshift = function(chunk) {
      var state = this._readableState;
      return readableAddChunk(this, state, chunk, "", true);
    };
    function readableAddChunk(stream, state, chunk, encoding, addToFront) {
      var er = chunkInvalid(state, chunk);
      if (er) {
        stream.emit("error", er);
      } else if (chunk === null || chunk === void 0) {
        state.reading = false;
        if (!state.ended)
          onEofChunk(stream, state);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (state.ended && !addToFront) {
          var e = new Error("stream.push() after EOF");
          stream.emit("error", e);
        } else if (state.endEmitted && addToFront) {
          var e = new Error("stream.unshift() after end event");
          stream.emit("error", e);
        } else {
          if (state.decoder && !addToFront && !encoding)
            chunk = state.decoder.write(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) {
            state.buffer.unshift(chunk);
          } else {
            state.reading = false;
            state.buffer.push(chunk);
          }
          if (state.needReadable)
            emitReadable(stream);
          maybeReadMore(stream, state);
        }
      } else if (!addToFront) {
        state.reading = false;
      }
      return needMoreData(state);
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable2.prototype.setEncoding = function(enc) {
      if (!StringDecoder)
        StringDecoder = require_string_decoder().StringDecoder;
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
    };
    var MAX_HWM = 8388608;
    function roundUpToNextPowerOf2(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        for (var p = 1; p < 32; p <<= 1)
          n |= n >> p;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return n === 0 ? 0 : 1;
      if (n === null || isNaN(n)) {
        if (state.flowing && state.buffer.length)
          return state.buffer[0].length;
        else
          return state.length;
      }
      if (n <= 0)
        return 0;
      if (n > state.highWaterMark)
        state.highWaterMark = roundUpToNextPowerOf2(n);
      if (n > state.length) {
        if (!state.ended) {
          state.needReadable = true;
          return 0;
        } else
          return state.length;
      }
      return n;
    }
    Readable2.prototype.read = function(n) {
      var state = this._readableState;
      state.calledRead = true;
      var nOrig = n;
      var ret;
      if (typeof n !== "number" || n > 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        ret = null;
        if (state.length > 0 && state.decoder) {
          ret = fromList(n, state);
          state.length -= ret.length;
        }
        if (state.length === 0)
          endReadable(this);
        return ret;
      }
      var doRead = state.needReadable;
      if (state.length - n <= state.highWaterMark)
        doRead = true;
      if (state.ended || state.reading)
        doRead = false;
      if (doRead) {
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
      }
      if (doRead && !state.reading)
        n = howMuchToRead(nOrig, state);
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      }
      state.length -= n;
      if (state.length === 0 && !state.ended)
        state.needReadable = true;
      if (state.ended && !state.endEmitted && state.length === 0)
        endReadable(this);
      return ret;
    };
    function chunkInvalid(state, chunk) {
      var er = null;
      if (!Buffer2.isBuffer(chunk) && "string" !== typeof chunk && chunk !== null && chunk !== void 0 && !state.objectMode) {
        er = new TypeError("Invalid non-string/buffer chunk");
      }
      return er;
    }
    function onEofChunk(stream, state) {
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.length > 0)
        emitReadable(stream);
      else
        endReadable(stream);
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = false;
      if (state.emittedReadable)
        return;
      state.emittedReadable = true;
      if (state.sync)
        process.nextTick(function() {
          emitReadable_(stream);
        });
      else
        emitReadable_(stream);
    }
    function emitReadable_(stream) {
      stream.emit("readable");
    }
    function maybeReadMore(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(function() {
          maybeReadMore_(stream, state);
        });
      }
    }
    function maybeReadMore_(stream, state) {
      var len = state.length;
      while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
        stream.read(0);
        if (len === state.length)
          break;
        else
          len = state.length;
      }
      state.readingMore = false;
    }
    Readable2.prototype._read = function(n) {
      this.emit("error", new Error("not implemented"));
    };
    Readable2.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : cleanup;
      if (state.endEmitted)
        process.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable) {
        if (readable !== src)
          return;
        cleanup();
      }
      function onend() {
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      function cleanup() {
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", cleanup);
        if (!dest._writableState || dest._writableState.needDrain)
          ondrain();
      }
      function onerror(er) {
        unpipe();
        dest.removeListener("error", onerror);
        if (EE.listenerCount(dest, "error") === 0)
          dest.emit("error", er);
      }
      if (!dest._events || !dest._events.error)
        dest.on("error", onerror);
      else if (isArray(dest._events.error))
        dest._events.error.unshift(onerror);
      else
        dest._events.error = [onerror, dest._events.error];
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        this.on("readable", pipeOnReadable);
        state.flowing = true;
        process.nextTick(function() {
          flow(src);
        });
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var dest = this;
        var state = src._readableState;
        state.awaitDrain--;
        if (state.awaitDrain === 0)
          flow(src);
      };
    }
    function flow(src) {
      var state = src._readableState;
      var chunk;
      state.awaitDrain = 0;
      function write(dest, i2, list) {
        var written = dest.write(chunk);
        if (false === written) {
          state.awaitDrain++;
        }
      }
      while (state.pipesCount && null !== (chunk = src.read())) {
        if (state.pipesCount === 1)
          write(state.pipes, 0, null);
        else
          forEach(state.pipes, write);
        src.emit("data", chunk);
        if (state.awaitDrain > 0)
          return;
      }
      if (state.pipesCount === 0) {
        state.flowing = false;
        if (EE.listenerCount(src, "data") > 0)
          emitDataEvents(src);
        return;
      }
      state.ranOut = true;
    }
    function pipeOnReadable() {
      if (this._readableState.ranOut) {
        this._readableState.ranOut = false;
        flow(this);
      }
    }
    Readable2.prototype.unpipe = function(dest) {
      var state = this._readableState;
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        this.removeListener("readable", pipeOnReadable);
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        this.removeListener("readable", pipeOnReadable);
        state.flowing = false;
        for (var i2 = 0; i2 < len; i2++)
          dests[i2].emit("unpipe", this);
        return this;
      }
      var i2 = indexOf(state.pipes, dest);
      if (i2 === -1)
        return this;
      state.pipes.splice(i2, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this);
      return this;
    };
    Readable2.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data" && !this._readableState.flowing)
        emitDataEvents(this);
      if (ev === "readable" && this.readable) {
        var state = this._readableState;
        if (!state.readableListening) {
          state.readableListening = true;
          state.emittedReadable = false;
          state.needReadable = true;
          if (!state.reading) {
            this.read(0);
          } else if (state.length) {
            emitReadable(this, state);
          }
        }
      }
      return res;
    };
    Readable2.prototype.addListener = Readable2.prototype.on;
    Readable2.prototype.resume = function() {
      emitDataEvents(this);
      this.read(0);
      this.emit("resume");
    };
    Readable2.prototype.pause = function() {
      emitDataEvents(this, true);
      this.emit("pause");
    };
    function emitDataEvents(stream, startPaused) {
      var state = stream._readableState;
      if (state.flowing) {
        throw new Error("Cannot switch to old mode now.");
      }
      var paused = startPaused || false;
      var readable = false;
      stream.readable = true;
      stream.pipe = Stream.prototype.pipe;
      stream.on = stream.addListener = Stream.prototype.on;
      stream.on("readable", function() {
        readable = true;
        var c;
        while (!paused && null !== (c = stream.read()))
          stream.emit("data", c);
        if (c === null) {
          readable = false;
          stream._readableState.needReadable = true;
        }
      });
      stream.pause = function() {
        paused = true;
        this.emit("pause");
      };
      stream.resume = function() {
        paused = false;
        if (readable)
          process.nextTick(function() {
            stream.emit("readable");
          });
        else
          this.read(0);
        this.emit("resume");
      };
      stream.emit("readable");
    }
    Readable2.prototype.wrap = function(stream) {
      var state = this._readableState;
      var paused = false;
      var self2 = this;
      stream.on("end", function() {
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            self2.push(chunk);
        }
        self2.push(null);
      });
      stream.on("data", function(chunk) {
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = self2.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i2 in stream) {
        if (typeof stream[i2] === "function" && typeof this[i2] === "undefined") {
          this[i2] = function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i2);
        }
      }
      var events = ["error", "close", "destroy", "pause", "resume"];
      forEach(events, function(ev) {
        stream.on(ev, self2.emit.bind(self2, ev));
      });
      self2._read = function(n) {
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return self2;
    };
    Readable2._fromList = fromList;
    function fromList(n, state) {
      var list = state.buffer;
      var length = state.length;
      var stringMode = !!state.decoder;
      var objectMode = !!state.objectMode;
      var ret;
      if (list.length === 0)
        return null;
      if (length === 0)
        ret = null;
      else if (objectMode)
        ret = list.shift();
      else if (!n || n >= length) {
        if (stringMode)
          ret = list.join("");
        else
          ret = Buffer2.concat(list, length);
        list.length = 0;
      } else {
        if (n < list[0].length) {
          var buf = list[0];
          ret = buf.slice(0, n);
          list[0] = buf.slice(n);
        } else if (n === list[0].length) {
          ret = list.shift();
        } else {
          if (stringMode)
            ret = "";
          else
            ret = new Buffer2(n);
          var c = 0;
          for (var i2 = 0, l = list.length; i2 < l && c < n; i2++) {
            var buf = list[0];
            var cpy = Math.min(n - c, buf.length);
            if (stringMode)
              ret += buf.slice(0, cpy);
            else
              buf.copy(ret, c, 0, cpy);
            if (cpy < buf.length)
              list[0] = buf.slice(cpy);
            else
              list.shift();
            c += cpy;
          }
        }
      }
      return ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0)
        throw new Error("endReadable called on non-empty stream");
      if (!state.endEmitted && state.calledRead) {
        state.ended = true;
        process.nextTick(function() {
          if (!state.endEmitted && state.length === 0) {
            state.endEmitted = true;
            stream.readable = false;
            stream.emit("end");
          }
        });
      }
    }
    function forEach(xs, f) {
      for (var i2 = 0, l = xs.length; i2 < l; i2++) {
        f(xs[i2], i2);
      }
    }
    function indexOf(xs, x) {
      for (var i2 = 0, l = xs.length; i2 < l; i2++) {
        if (xs[i2] === x)
          return i2;
      }
      return -1;
    }
  }
});

// ../../node_modules/bun/node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "../../node_modules/bun/node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
    module.exports = Duplex;
    var objectKeys = Object.keys || function(obj) {
      var keys = [];
      for (var key in obj)
        keys.push(key);
      return keys;
    };
    var util = require_util2();
    util.inherits = require_inherits();
    var Readable2 = require_stream_readable();
    var Writable2 = require_stream_writable();
    util.inherits(Duplex, Readable2);
    forEach(objectKeys(Writable2.prototype), function(method) {
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable2.prototype[method];
    });
    function Duplex(options) {
      if (!(this instanceof Duplex))
        return new Duplex(options);
      Readable2.call(this, options);
      Writable2.call(this, options);
      if (options && options.readable === false)
        this.readable = false;
      if (options && options.writable === false)
        this.writable = false;
      this.allowHalfOpen = true;
      if (options && options.allowHalfOpen === false)
        this.allowHalfOpen = false;
      this.once("end", onend);
    }
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended)
        return;
      process.nextTick(this.end.bind(this));
    }
    function forEach(xs, f) {
      for (var i2 = 0, l = xs.length; i2 < l; i2++) {
        f(xs[i2], i2);
      }
    }
  }
});

// ../../node_modules/bun/node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "../../node_modules/bun/node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
    module.exports = Writable2;
    var Buffer2 = __require("buffer").Buffer;
    Writable2.WritableState = WritableState;
    var util = require_util2();
    util.inherits = require_inherits();
    var Stream = __require("stream");
    util.inherits(Writable2, Stream);
    function WriteReq(chunk, encoding, cb) {
      this.chunk = chunk;
      this.encoding = encoding;
      this.callback = cb;
    }
    function WritableState(options, stream) {
      options = options || {};
      var hwm = options.highWaterMark;
      this.highWaterMark = hwm || hwm === 0 ? hwm : 16 * 1024;
      this.objectMode = !!options.objectMode;
      this.highWaterMark = ~~this.highWaterMark;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.buffer = [];
      this.errorEmitted = false;
    }
    function Writable2(options) {
      var Duplex = require_stream_duplex();
      if (!(this instanceof Writable2) && !(this instanceof Duplex))
        return new Writable2(options);
      this._writableState = new WritableState(options, this);
      this.writable = true;
      Stream.call(this);
    }
    Writable2.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe. Not readable."));
    };
    function writeAfterEnd(stream, state, cb) {
      var er = new Error("write after end");
      stream.emit("error", er);
      process.nextTick(function() {
        cb(er);
      });
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = true;
      if (!Buffer2.isBuffer(chunk) && "string" !== typeof chunk && chunk !== null && chunk !== void 0 && !state.objectMode) {
        var er = new TypeError("Invalid non-string/buffer chunk");
        stream.emit("error", er);
        process.nextTick(function() {
          cb(er);
        });
        valid = false;
      }
      return valid;
    }
    Writable2.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (Buffer2.isBuffer(chunk))
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = function() {
        };
      if (state.ended)
        writeAfterEnd(this, state, cb);
      else if (validChunk(this, state, chunk, cb))
        ret = writeOrBuffer(this, state, chunk, encoding, cb);
      return ret;
    };
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = new Buffer2(chunk, encoding);
      }
      return chunk;
    }
    function writeOrBuffer(stream, state, chunk, encoding, cb) {
      chunk = decodeChunk(state, chunk, encoding);
      if (Buffer2.isBuffer(chunk))
        encoding = "buffer";
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing)
        state.buffer.push(new WriteReq(chunk, encoding, cb));
      else
        doWrite(stream, state, len, chunk, encoding, cb);
      return ret;
    }
    function doWrite(stream, state, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream, state, sync, er, cb) {
      if (sync)
        process.nextTick(function() {
          cb(er);
        });
      else
        cb(er);
      stream._writableState.errorEmitted = true;
      stream.emit("error", er);
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      onwriteStateUpdate(state);
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(stream, state);
        if (!finished && !state.bufferProcessing && state.buffer.length)
          clearBuffer(stream, state);
        if (sync) {
          process.nextTick(function() {
            afterWrite(stream, state, finished, cb);
          });
        } else {
          afterWrite(stream, state, finished, cb);
        }
      }
    }
    function afterWrite(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain(stream, state);
      cb();
      if (finished)
        finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = true;
      for (var c = 0; c < state.buffer.length; c++) {
        var entry = state.buffer[c];
        var chunk = entry.chunk;
        var encoding = entry.encoding;
        var cb = entry.callback;
        var len = state.objectMode ? 1 : chunk.length;
        doWrite(stream, state, len, chunk, encoding, cb);
        if (state.writing) {
          c++;
          break;
        }
      }
      state.bufferProcessing = false;
      if (c < state.buffer.length)
        state.buffer = state.buffer.slice(c);
      else
        state.buffer.length = 0;
    }
    Writable2.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("not implemented"));
    };
    Writable2.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (typeof chunk !== "undefined" && chunk !== null)
        this.write(chunk, encoding);
      if (!state.ending && !state.finished)
        endWritable(this, state, cb);
    };
    function needFinish(stream, state) {
      return state.ending && state.length === 0 && !state.finished && !state.writing;
    }
    function finishMaybe(stream, state) {
      var need = needFinish(stream, state);
      if (need) {
        state.finished = true;
        stream.emit("finish");
      }
      return need;
    }
    function endWritable(stream, state, cb) {
      state.ending = true;
      finishMaybe(stream, state);
      if (cb) {
        if (state.finished)
          process.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
    }
  }
});

// ../../node_modules/bun/node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "../../node_modules/bun/node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
    module.exports = Transform;
    var Duplex = require_stream_duplex();
    var util = require_util2();
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function TransformState(options, stream) {
      this.afterTransform = function(er, data) {
        return afterTransform(stream, er, data);
      };
      this.needTransform = false;
      this.transforming = false;
      this.writecb = null;
      this.writechunk = null;
    }
    function afterTransform(stream, er, data) {
      var ts = stream._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb)
        return stream.emit("error", new Error("no writecb in Transform class"));
      ts.writechunk = null;
      ts.writecb = null;
      if (data !== null && data !== void 0)
        stream.push(data);
      if (cb)
        cb(er);
      var rs = stream._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        stream._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform))
        return new Transform(options);
      Duplex.call(this, options);
      var ts = this._transformState = new TransformState(options, this);
      var stream = this;
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      this.once("finish", function() {
        if ("function" === typeof this._flush)
          this._flush(function(er) {
            done(stream, er);
          });
        else
          done(stream);
      });
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    function done(stream, er) {
      if (er)
        return stream.emit("error", er);
      var ws = stream._writableState;
      var rs = stream._readableState;
      var ts = stream._transformState;
      if (ws.length)
        throw new Error("calling transform done when ws.length != 0");
      if (ts.transforming)
        throw new Error("calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// ../../node_modules/bun/node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "../../node_modules/bun/node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
    module.exports = PassThrough;
    var Transform = require_stream_transform();
    var util = require_util2();
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough))
        return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// ../../node_modules/bun/node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "../../node_modules/bun/node_modules/readable-stream/readable.js"(exports, module) {
    var Stream = __require("stream");
    exports = module.exports = require_stream_readable();
    exports.Stream = Stream;
    exports.Readable = exports;
    exports.Writable = require_stream_writable();
    exports.Duplex = require_stream_duplex();
    exports.Transform = require_stream_transform();
    exports.PassThrough = require_stream_passthrough();
    if (!process.browser && process.env.READABLE_STREAM === "disable") {
      module.exports = __require("stream");
    }
  }
});

// ../../node_modules/bun/lib/bun.js
var require_bun = __commonJS({
  "../../node_modules/bun/lib/bun.js"(exports, module) {
    var stream = require_readable();
    var BunWrapper = function BunWrapper2(options) {
      options = options || {};
      if (Array.isArray(options)) {
        options = { streams: options };
      }
      options.objectMode = true;
      stream.Duplex.call(this, options);
      var self2 = this;
      this._streams = (options.streams || []).slice();
      if (this._streams.length === 0) {
        this._streams.push(new stream.PassThrough({ objectMode: true }));
      }
      this._bubbleErrors = typeof options.bubbleErrors === "undefined" || !!options.bubbleErrors;
      if (this._bubbleErrors) {
        for (var i2 = 0; i2 < this._streams.length; ++i2) {
          this._streams[i2].on("error", function(e) {
            return self2.emit("error", e);
          });
        }
      }
      for (var i2 = 0; i2 < this._streams.length - 1; ++i2) {
        this._streams[i2].pipe(this._streams[i2 + 1]);
      }
      this._first = this._streams[0];
      this._last = this._streams[this._streams.length - 1];
      this._last.on("data", function(e) {
        if (!self2.push(e)) {
          self2._last.pause();
        }
      });
      this._last.on("end", function() {
        self2.push(null);
      });
      this._first.on("finish", function() {
        self2.end();
      });
      this.on("finish", function() {
        self2._first.end();
      });
    };
    BunWrapper.prototype = Object.create(stream.Duplex.prototype, { constructor: { value: BunWrapper } });
    BunWrapper.prototype._write = function _write(input, encoding, done) {
      this._first.write(input, done);
    };
    BunWrapper.prototype._read = function _read(n) {
      this._last.resume();
    };
    var bun = module.exports = function bun2(options, streams) {
      if (Array.isArray(options)) {
        var tmp = streams;
        streams = options;
        options = tmp;
      }
      options = options || {};
      options.streams = options.streams || streams;
      return new BunWrapper(options);
    };
    bun.BunWrapper = BunWrapper;
  }
});

// ../../packages/wasi-js/dist/type-desc.js
var getDataView = (() => {
  const cache = /* @__PURE__ */ new WeakMap();
  return (buf) => {
    let dataView = cache.get(buf);
    if (!dataView) {
      dataView = new DataView(buf);
      cache.set(buf, dataView);
    }
    return dataView;
  };
})();
function std(name, size) {
  const get = DataView.prototype[`get${name}`];
  const set2 = DataView.prototype[`set${name}`];
  return {
    size,
    align: size,
    get(buf, ptr) {
      return get.call(getDataView(buf), ptr, true);
    },
    set(buf, ptr, value) {
      return set2.call(getDataView(buf), ptr, value, true);
    }
  };
}
var string = (() => {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();
  return {
    get(buf, ptr, len) {
      return textDecoder.decode(new Uint8Array(buf, ptr, len));
    },
    set(buf, ptr, value, len) {
      if (len) {
        const { read } = textEncoder.encodeInto(value, new Uint8Array(buf, ptr, len));
        if (read < value.length) {
          throw new Error(`Insufficient space.`);
        }
      } else {
        const src = textEncoder.encode(value);
        len = src.byteLength;
        const dst = new Uint8Array(buf, ptr, len);
        dst.set(src);
      }
    }
  };
})();
function alignTo(ptr, align) {
  const mismatch = ptr % align;
  if (mismatch) {
    ptr += align - mismatch;
  }
  return ptr;
}
function struct(desc) {
  class Ctor {
    _buf;
    _ptr;
    constructor(_buf, _ptr) {
      this._buf = _buf;
      this._ptr = _ptr;
    }
  }
  let offset = 0;
  let structAlign = 0;
  for (const name in desc) {
    const type2 = desc[name];
    const fieldAlign = type2.align;
    structAlign = Math.max(structAlign, fieldAlign);
    offset = alignTo(offset, fieldAlign);
    const fieldOffset = offset;
    Object.defineProperty(Ctor.prototype, name, {
      get() {
        return type2.get(this._buf, this._ptr + fieldOffset);
      },
      set(value) {
        type2.set(this._buf, this._ptr + fieldOffset, value);
      }
    });
    offset += type2.size;
  }
  offset = alignTo(offset, structAlign);
  return {
    size: offset,
    align: structAlign,
    get(buf, ptr) {
      return new Ctor(buf, ptr);
    },
    set(buf, ptr, value) {
      Object.assign(new Ctor(buf, ptr), value);
    }
  };
}
function taggedUnion({ tag: tagDesc, data: dataDesc }) {
  let unionSize = 0;
  let unionAlign = 0;
  for (const key in dataDesc) {
    const { size, align } = dataDesc[key];
    unionSize = Math.max(unionSize, size);
    unionAlign = Math.max(unionAlign, align);
  }
  unionSize = alignTo(unionSize, unionAlign);
  const unionOffset = alignTo(tagDesc.size, unionAlign);
  const totalAlign = Math.max(tagDesc.align, unionAlign);
  const totalSize = alignTo(unionOffset + unionSize, totalAlign);
  return {
    size: totalSize,
    align: totalAlign,
    get(buf, ptr) {
      const tag = tagDesc.get(buf, ptr);
      return {
        tag,
        data: dataDesc[tag].get(buf, ptr + unionOffset)
      };
    },
    set(buf, ptr, value) {
      tagDesc.set(buf, ptr, value.tag);
      dataDesc[value.tag].set(buf, ptr + unionOffset, value.data);
    }
  };
}
function enumer(base) {
  return base;
}
var int8_t = std("Int8", 1);
var uint8_t = std("Uint8", 1);
var int16_t = std("Int16", 2);
var uint16_t = std("Uint16", 2);
var int32_t = std("Int32", 4);
var uint32_t = std("Uint32", 4);
var int64_t = std("bigint64", 8);
var uint64_t = std("BigUint64", 8);
var size_t = uint32_t;

// ../../packages/wasi-js/dist/constants.js
var E;
(function(E2) {
  E2[E2["SUCCESS"] = 0] = "SUCCESS";
  E2[E2["TOO_BIG"] = 1] = "TOO_BIG";
  E2[E2["ACCES"] = 2] = "ACCES";
  E2[E2["ADDR_IN_USE"] = 3] = "ADDR_IN_USE";
  E2[E2["ADDR_NOT_AVAIL"] = 4] = "ADDR_NOT_AVAIL";
  E2[E2["AF_NO_SUPPORT"] = 5] = "AF_NO_SUPPORT";
  E2[E2["AGAIN"] = 6] = "AGAIN";
  E2[E2["ALREADY"] = 7] = "ALREADY";
  E2[E2["BADF"] = 8] = "BADF";
  E2[E2["BAG_MSG"] = 9] = "BAG_MSG";
  E2[E2["BUSY"] = 10] = "BUSY";
  E2[E2["CANCELED"] = 11] = "CANCELED";
  E2[E2["CHILD"] = 12] = "CHILD";
  E2[E2["CONN_ABORTED"] = 13] = "CONN_ABORTED";
  E2[E2["CONN_REFUSED"] = 14] = "CONN_REFUSED";
  E2[E2["CONN_RESET"] = 15] = "CONN_RESET";
  E2[E2["DEADLK"] = 16] = "DEADLK";
  E2[E2["DEST_ADDR_REQ"] = 17] = "DEST_ADDR_REQ";
  E2[E2["DOMAIN"] = 18] = "DOMAIN";
  E2[E2["D_QUOT"] = 19] = "D_QUOT";
  E2[E2["EXIST"] = 20] = "EXIST";
  E2[E2["FAULT"] = 21] = "FAULT";
  E2[E2["F_BIG"] = 22] = "F_BIG";
  E2[E2["HOST_UNREACH"] = 23] = "HOST_UNREACH";
  E2[E2["ID_RM"] = 24] = "ID_RM";
  E2[E2["IL_SEQ"] = 25] = "IL_SEQ";
  E2[E2["IN_PROGRESS"] = 26] = "IN_PROGRESS";
  E2[E2["INTR"] = 27] = "INTR";
  E2[E2["INVAL"] = 28] = "INVAL";
  E2[E2["IO"] = 29] = "IO";
  E2[E2["IS_CONN"] = 30] = "IS_CONN";
  E2[E2["ISDIR"] = 31] = "ISDIR";
  E2[E2["LOOP"] = 32] = "LOOP";
  E2[E2["M_FILE"] = 33] = "M_FILE";
  E2[E2["M_LINK"] = 34] = "M_LINK";
  E2[E2["MSG_SIZE"] = 35] = "MSG_SIZE";
  E2[E2["MULTIHOP"] = 36] = "MULTIHOP";
  E2[E2["NAME_TOO_LONG"] = 37] = "NAME_TOO_LONG";
  E2[E2["NET_DOWN"] = 38] = "NET_DOWN";
  E2[E2["NET_RESET"] = 39] = "NET_RESET";
  E2[E2["NET_UNREACH"] = 40] = "NET_UNREACH";
  E2[E2["N_FILE"] = 41] = "N_FILE";
  E2[E2["NO_BUF_S"] = 42] = "NO_BUF_S";
  E2[E2["NO_DEV"] = 43] = "NO_DEV";
  E2[E2["NOENT"] = 44] = "NOENT";
  E2[E2["NO_EXEC"] = 45] = "NO_EXEC";
  E2[E2["NO_LOCK"] = 46] = "NO_LOCK";
  E2[E2["NO_LINK"] = 47] = "NO_LINK";
  E2[E2["NO_MEM"] = 48] = "NO_MEM";
  E2[E2["NO_MSG"] = 49] = "NO_MSG";
  E2[E2["NO_PROTO_OPT"] = 50] = "NO_PROTO_OPT";
  E2[E2["NO_SPACE"] = 51] = "NO_SPACE";
  E2[E2["NOSYS"] = 52] = "NOSYS";
  E2[E2["NOT_CONN"] = 53] = "NOT_CONN";
  E2[E2["NOTDIR"] = 54] = "NOTDIR";
  E2[E2["NOTEMPTY"] = 55] = "NOTEMPTY";
  E2[E2["NOTCAPABLE"] = 76] = "NOTCAPABLE";
})(E || (E = {}));
var fd_t = uint32_t;

// ../../packages/wasi-js/dist/errors.js
var SystemError = class extends Error {
  code;
  ignore;
  constructor(code, ignore = false) {
    super(`E${E[code]}`);
    this.code = code;
    this.ignore = ignore;
  }
};

// ../../packages/fs-js/dist/fs-js.es.js
var __create2 = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf2 = Object.getPrototypeOf;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS2 = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps2 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames2(from))
      if (!__hasOwnProp2.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var require_lib = __commonJS2({
  "../../node_modules/protocols/lib/index.js"(exports, module) {
    "use strict";
    module.exports = function protocols(input, first) {
      if (first === true) {
        first = 0;
      }
      var index = input.indexOf("://"), splits = input.substring(0, index).split("+").filter(Boolean);
      if (typeof first === "number") {
        return splits[first];
      }
      return splits;
    };
  }
});
var require_lib2 = __commonJS2({
  "../../node_modules/is-ssh/lib/index.js"(exports, module) {
    "use strict";
    var protocols = require_lib();
    function isSsh(input) {
      if (Array.isArray(input)) {
        return input.indexOf("ssh") !== -1 || input.indexOf("rsync") !== -1;
      }
      if (typeof input !== "string") {
        return false;
      }
      var prots = protocols(input);
      input = input.substring(input.indexOf("://") + 3);
      if (isSsh(prots)) {
        return true;
      }
      var urlPortPattern = new RegExp(".([a-zA-Z\\d]+):(\\d+)/");
      return !input.match(urlPortPattern) && input.indexOf("@") < input.indexOf(":");
    }
    module.exports = isSsh;
  }
});
var require_strict_uri_encode = __commonJS2({
  "../../node_modules/strict-uri-encode/index.js"(exports, module) {
    "use strict";
    module.exports = (str2) => encodeURIComponent(str2).replace(/[!'()*]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
  }
});
var require_decode_uri_component = __commonJS2({
  "../../node_modules/decode-uri-component/index.js"(exports, module) {
    "use strict";
    var token = "%[a-f0-9]{2}";
    var singleMatcher = new RegExp(token, "gi");
    var multiMatcher = new RegExp("(" + token + ")+", "gi");
    function decodeComponents(components, split) {
      try {
        return decodeURIComponent(components.join(""));
      } catch (err) {
      }
      if (components.length === 1) {
        return components;
      }
      split = split || 1;
      var left = components.slice(0, split);
      var right = components.slice(split);
      return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
    }
    function decode(input) {
      try {
        return decodeURIComponent(input);
      } catch (err) {
        var tokens = input.match(singleMatcher);
        for (var i2 = 1; i2 < tokens.length; i2++) {
          input = decodeComponents(tokens, i2).join("");
          tokens = input.match(singleMatcher);
        }
        return input;
      }
    }
    function customDecodeURIComponent(input) {
      var replaceMap = {
        "%FE%FF": "\uFFFD\uFFFD",
        "%FF%FE": "\uFFFD\uFFFD"
      };
      var match = multiMatcher.exec(input);
      while (match) {
        try {
          replaceMap[match[0]] = decodeURIComponent(match[0]);
        } catch (err) {
          var result = decode(match[0]);
          if (result !== match[0]) {
            replaceMap[match[0]] = result;
          }
        }
        match = multiMatcher.exec(input);
      }
      replaceMap["%C2"] = "\uFFFD";
      var entries = Object.keys(replaceMap);
      for (var i2 = 0; i2 < entries.length; i2++) {
        var key = entries[i2];
        input = input.replace(new RegExp(key, "g"), replaceMap[key]);
      }
      return input;
    }
    module.exports = function(encodedURI) {
      if (typeof encodedURI !== "string") {
        throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
      }
      try {
        encodedURI = encodedURI.replace(/\+/g, " ");
        return decodeURIComponent(encodedURI);
      } catch (err) {
        return customDecodeURIComponent(encodedURI);
      }
    };
  }
});
var require_split_on_first = __commonJS2({
  "../../node_modules/split-on-first/index.js"(exports, module) {
    "use strict";
    module.exports = (string2, separator) => {
      if (!(typeof string2 === "string" && typeof separator === "string")) {
        throw new TypeError("Expected the arguments to be of type `string`");
      }
      if (separator === "") {
        return [string2];
      }
      const separatorIndex = string2.indexOf(separator);
      if (separatorIndex === -1) {
        return [string2];
      }
      return [
        string2.slice(0, separatorIndex),
        string2.slice(separatorIndex + separator.length)
      ];
    };
  }
});
var require_filter_obj = __commonJS2({
  "../../node_modules/filter-obj/index.js"(exports, module) {
    "use strict";
    module.exports = function(obj, predicate) {
      var ret = {};
      var keys = Object.keys(obj);
      var isArr = Array.isArray(predicate);
      for (var i2 = 0; i2 < keys.length; i2++) {
        var key = keys[i2];
        var val = obj[key];
        if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
          ret[key] = val;
        }
      }
      return ret;
    };
  }
});
var require_query_string = __commonJS2({
  "../../node_modules/query-string/index.js"(exports) {
    "use strict";
    var strictUriEncode = require_strict_uri_encode();
    var decodeComponent = require_decode_uri_component();
    var splitOnFirst = require_split_on_first();
    var filterObject = require_filter_obj();
    var isNullOrUndefined = (value) => value === null || value === void 0;
    function encoderForArrayFormat(options) {
      switch (options.arrayFormat) {
        case "index":
          return (key) => (result, value) => {
            const index = result.length;
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), "[", index, "]"].join("")];
            }
            return [
              ...result,
              [encode(key, options), "[", encode(index, options), "]=", encode(value, options)].join("")
            ];
          };
        case "bracket":
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), "[]"].join("")];
            }
            return [...result, [encode(key, options), "[]=", encode(value, options)].join("")];
          };
        case "comma":
        case "separator":
          return (key) => (result, value) => {
            if (value === null || value === void 0 || value.length === 0) {
              return result;
            }
            if (result.length === 0) {
              return [[encode(key, options), "=", encode(value, options)].join("")];
            }
            return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
          };
        default:
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, encode(key, options)];
            }
            return [...result, [encode(key, options), "=", encode(value, options)].join("")];
          };
      }
    }
    function parserForArrayFormat(options) {
      let result;
      switch (options.arrayFormat) {
        case "index":
          return (key, value, accumulator) => {
            result = /\[(\d*)\]$/.exec(key);
            key = key.replace(/\[\d*\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = {};
            }
            accumulator[key][result[1]] = value;
          };
        case "bracket":
          return (key, value, accumulator) => {
            result = /(\[\])$/.exec(key);
            key = key.replace(/\[\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = [value];
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
        case "comma":
        case "separator":
          return (key, value, accumulator) => {
            const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
            const isEncodedArray = typeof value === "string" && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
            value = isEncodedArray ? decode(value, options) : value;
            const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
            accumulator[key] = newValue;
          };
        default:
          return (key, value, accumulator) => {
            if (accumulator[key] === void 0) {
              accumulator[key] = value;
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
      }
    }
    function validateArrayFormatSeparator(value) {
      if (typeof value !== "string" || value.length !== 1) {
        throw new TypeError("arrayFormatSeparator must be single character string");
      }
    }
    function encode(value, options) {
      if (options.encode) {
        return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
      }
      return value;
    }
    function decode(value, options) {
      if (options.decode) {
        return decodeComponent(value);
      }
      return value;
    }
    function keysSorter(input) {
      if (Array.isArray(input)) {
        return input.sort();
      }
      if (typeof input === "object") {
        return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
      }
      return input;
    }
    function removeHash(input) {
      const hashStart = input.indexOf("#");
      if (hashStart !== -1) {
        input = input.slice(0, hashStart);
      }
      return input;
    }
    function getHash(url) {
      let hash = "";
      const hashStart = url.indexOf("#");
      if (hashStart !== -1) {
        hash = url.slice(hashStart);
      }
      return hash;
    }
    function extract(input) {
      input = removeHash(input);
      const queryStart = input.indexOf("?");
      if (queryStart === -1) {
        return "";
      }
      return input.slice(queryStart + 1);
    }
    function parseValue(value, options) {
      if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
        value = Number(value);
      } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
        value = value.toLowerCase() === "true";
      }
      return value;
    }
    function parse(query, options) {
      options = Object.assign({
        decode: true,
        sort: true,
        arrayFormat: "none",
        arrayFormatSeparator: ",",
        parseNumbers: false,
        parseBooleans: false
      }, options);
      validateArrayFormatSeparator(options.arrayFormatSeparator);
      const formatter = parserForArrayFormat(options);
      const ret = /* @__PURE__ */ Object.create(null);
      if (typeof query !== "string") {
        return ret;
      }
      query = query.trim().replace(/^[?#&]/, "");
      if (!query) {
        return ret;
      }
      for (const param of query.split("&")) {
        if (param === "") {
          continue;
        }
        let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, " ") : param, "=");
        value = value === void 0 ? null : ["comma", "separator"].includes(options.arrayFormat) ? value : decode(value, options);
        formatter(decode(key, options), value, ret);
      }
      for (const key of Object.keys(ret)) {
        const value = ret[key];
        if (typeof value === "object" && value !== null) {
          for (const k of Object.keys(value)) {
            value[k] = parseValue(value[k], options);
          }
        } else {
          ret[key] = parseValue(value, options);
        }
      }
      if (options.sort === false) {
        return ret;
      }
      return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
        const value = ret[key];
        if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
          result[key] = keysSorter(value);
        } else {
          result[key] = value;
        }
        return result;
      }, /* @__PURE__ */ Object.create(null));
    }
    exports.extract = extract;
    exports.parse = parse;
    exports.stringify = (object, options) => {
      if (!object) {
        return "";
      }
      options = Object.assign({
        encode: true,
        strict: true,
        arrayFormat: "none",
        arrayFormatSeparator: ","
      }, options);
      validateArrayFormatSeparator(options.arrayFormatSeparator);
      const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
      const formatter = encoderForArrayFormat(options);
      const objectCopy = {};
      for (const key of Object.keys(object)) {
        if (!shouldFilter(key)) {
          objectCopy[key] = object[key];
        }
      }
      const keys = Object.keys(objectCopy);
      if (options.sort !== false) {
        keys.sort(options.sort);
      }
      return keys.map((key) => {
        const value = object[key];
        if (value === void 0) {
          return "";
        }
        if (value === null) {
          return encode(key, options);
        }
        if (Array.isArray(value)) {
          return value.reduce(formatter(key), []).join("&");
        }
        return encode(key, options) + "=" + encode(value, options);
      }).filter((x) => x.length > 0).join("&");
    };
    exports.parseUrl = (url, options) => {
      options = Object.assign({
        decode: true
      }, options);
      const [url_, hash] = splitOnFirst(url, "#");
      return Object.assign({
        url: url_.split("?")[0] || "",
        query: parse(extract(url), options)
      }, options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {});
    };
    exports.stringifyUrl = (object, options) => {
      options = Object.assign({
        encode: true,
        strict: true
      }, options);
      const url = removeHash(object.url).split("?")[0] || "";
      const queryFromUrl = exports.extract(object.url);
      const parsedQueryFromUrl = exports.parse(queryFromUrl, { sort: false });
      const query = Object.assign(parsedQueryFromUrl, object.query);
      let queryString = exports.stringify(query, options);
      if (queryString) {
        queryString = `?${queryString}`;
      }
      let hash = getHash(object.url);
      if (object.fragmentIdentifier) {
        hash = `#${encode(object.fragmentIdentifier, options)}`;
      }
      return `${url}${queryString}${hash}`;
    };
    exports.pick = (input, filter, options) => {
      options = Object.assign({
        parseFragmentIdentifier: true
      }, options);
      const { url, query, fragmentIdentifier } = exports.parseUrl(input, options);
      return exports.stringifyUrl({
        url,
        query: filterObject(query, filter),
        fragmentIdentifier
      }, options);
    };
    exports.exclude = (input, filter, options) => {
      const exclusionFilter = Array.isArray(filter) ? (key) => !filter.includes(key) : (key, value) => !filter(key, value);
      return exports.pick(input, exclusionFilter, options);
    };
  }
});
var require_lib3 = __commonJS2({
  "../../node_modules/parse-path/lib/index.js"(exports, module) {
    "use strict";
    var protocols = require_lib();
    var isSsh = require_lib2();
    var qs = require_query_string();
    function parsePath(url) {
      url = (url || "").trim();
      var output = {
        protocols: protocols(url),
        protocol: null,
        port: null,
        resource: "",
        user: "",
        pathname: "",
        hash: "",
        search: "",
        href: url,
        query: /* @__PURE__ */ Object.create(null)
      }, protocolIndex = url.indexOf("://"), resourceIndex = -1, splits = null, parts = null;
      if (url.startsWith(".")) {
        if (url.startsWith("./")) {
          url = url.substring(2);
        }
        output.pathname = url;
        output.protocol = "file";
      }
      var firstChar = url.charAt(1);
      if (!output.protocol) {
        output.protocol = output.protocols[0];
        if (!output.protocol) {
          if (isSsh(url)) {
            output.protocol = "ssh";
          } else if (firstChar === "/" || firstChar === "~") {
            url = url.substring(2);
            output.protocol = "file";
          } else {
            output.protocol = "file";
          }
        }
      }
      if (protocolIndex !== -1) {
        url = url.substring(protocolIndex + 3);
      }
      parts = url.split(/\/|\\/);
      if (output.protocol !== "file") {
        output.resource = parts.shift();
      } else {
        output.resource = "";
      }
      splits = output.resource.split("@");
      if (splits.length === 2) {
        output.user = splits[0];
        output.resource = splits[1];
      }
      splits = output.resource.split(":");
      if (splits.length === 2) {
        output.resource = splits[0];
        if (splits[1]) {
          output.port = Number(splits[1]);
          if (isNaN(output.port)) {
            output.port = null;
            parts.unshift(splits[1]);
          }
        } else {
          output.port = null;
        }
      }
      parts = parts.filter(Boolean);
      if (output.protocol === "file") {
        output.pathname = output.href;
      } else {
        output.pathname = output.pathname || (output.protocol !== "file" || output.href[0] === "/" ? "/" : "") + parts.join("/");
      }
      splits = output.pathname.split("#");
      if (splits.length === 2) {
        output.pathname = splits[0];
        output.hash = splits[1];
      }
      splits = output.pathname.split("?");
      if (splits.length === 2) {
        output.pathname = splits[0];
        output.search = splits[1];
      }
      output.query = qs.parse(output.search);
      output.href = output.href.replace(/\/$/, "");
      output.pathname = output.pathname.replace(/\/$/, "");
      return output;
    }
    module.exports = parsePath;
  }
});
var require_punycode = __commonJS2({
  "../../node_modules/url/node_modules/punycode/punycode.js"(exports, module) {
    (function(root) {
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = typeof module == "object" && module && !module.nodeType && module;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
        root = freeGlobal;
      }
      var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
      function error(type2) {
        throw RangeError(errors[type2]);
      }
      function map2(array, fn) {
        var length = array.length;
        var result = [];
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      function mapDomain(string2, fn) {
        var parts = string2.split("@");
        var result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string2 = parts[1];
        }
        string2 = string2.replace(regexSeparators, ".");
        var labels = string2.split(".");
        var encoded = map2(labels, fn).join(".");
        return result + encoded;
      }
      function ucs2decode(string2) {
        var output = [], counter = 0, length = string2.length, value, extra;
        while (counter < length) {
          value = string2.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            extra = string2.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      function ucs2encode(array) {
        return map2(array, function(value) {
          var output = "";
          if (value > 65535) {
            value -= 65536;
            output += stringFromCharCode(value >>> 10 & 1023 | 55296);
            value = 56320 | value & 1023;
          }
          output += stringFromCharCode(value);
          return output;
        }).join("");
      }
      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }
      function digitToBasic(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }
      function adapt(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }
      function decode(input) {
        var output = [], inputLength = input.length, out, i2 = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, baseMinusT;
        basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          for (oldi = i2, w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i2) / w)) {
              error("overflow");
            }
            i2 += digit * w;
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w *= baseMinusT;
          }
          out = output.length + 1;
          bias = adapt(i2 - oldi, out, oldi == 0);
          if (floor(i2 / out) > maxInt - n) {
            error("overflow");
          }
          n += floor(i2 / out);
          i2 %= out;
          output.splice(i2++, 0, n);
        }
        return ucs2encode(output);
      }
      function encode(input) {
        var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
        input = ucs2decode(input);
        inputLength = input.length;
        n = initialN;
        delta = 0;
        bias = initialBias;
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        handledCPCount = basicLength = output.length;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          for (m = maxInt, j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < n && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue == n) {
              for (q = delta, k = base; ; k += base) {
                t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                if (q < t) {
                  break;
                }
                qMinusT = q - t;
                baseMinusT = base - t;
                output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      }
      function toUnicode(input) {
        return mapDomain(input, function(string2) {
          return regexPunycode.test(string2) ? decode(string2.slice(4).toLowerCase()) : string2;
        });
      }
      function toASCII(input) {
        return mapDomain(input, function(string2) {
          return regexNonASCII.test(string2) ? "xn--" + encode(string2) : string2;
        });
      }
      punycode = {
        "version": "1.3.2",
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define("punycode", function() {
          return punycode;
        });
      } else if (freeExports && freeModule) {
        if (module.exports == freeExports) {
          freeModule.exports = punycode;
        } else {
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else {
        root.punycode = punycode;
      }
    })(exports);
  }
});
var require_util = __commonJS2({
  "../../node_modules/url/util.js"(exports, module) {
    "use strict";
    module.exports = {
      isString: function(arg) {
        return typeof arg === "string";
      },
      isObject: function(arg) {
        return typeof arg === "object" && arg !== null;
      },
      isNull: function(arg) {
        return arg === null;
      },
      isNullOrUndefined: function(arg) {
        return arg == null;
      }
    };
  }
});
var require_decode = __commonJS2({
  "../../node_modules/querystring/decode.js"(exports, module) {
    "use strict";
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    module.exports = function(qs, sep, eq, options) {
      sep = sep || "&";
      eq = eq || "=";
      var obj = {};
      if (typeof qs !== "string" || qs.length === 0) {
        return obj;
      }
      var regexp = /\+/g;
      qs = qs.split(sep);
      var maxKeys = 1e3;
      if (options && typeof options.maxKeys === "number") {
        maxKeys = options.maxKeys;
      }
      var len = qs.length;
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
      for (var i2 = 0; i2 < len; ++i2) {
        var x = qs[i2].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = "";
        }
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
      return obj;
    };
  }
});
var require_encode = __commonJS2({
  "../../node_modules/querystring/encode.js"(exports, module) {
    "use strict";
    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case "string":
          return v;
        case "boolean":
          return v ? "true" : "false";
        case "number":
          return isFinite(v) ? v : "";
        default:
          return "";
      }
    };
    module.exports = function(obj, sep, eq, name) {
      sep = sep || "&";
      eq = eq || "=";
      if (obj === null) {
        obj = void 0;
      }
      if (typeof obj === "object") {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
      }
      if (!name)
        return "";
      return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
    };
  }
});
var require_querystring = __commonJS2({
  "../../node_modules/querystring/index.js"(exports) {
    "use strict";
    exports.decode = exports.parse = require_decode();
    exports.encode = exports.stringify = require_encode();
  }
});
var require_url = __commonJS2({
  "../../node_modules/url/url.js"(exports) {
    "use strict";
    var punycode = require_punycode();
    var util = require_util();
    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;
    exports.Url = Url;
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }
    var protocolPattern = /^([a-z0-9.+-]+:)/i;
    var portPattern = /:[0-9]*$/;
    var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
    var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
    var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
    var autoEscape = ["'"].concat(unwise);
    var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
    var hostEndingChars = ["/", "?", "#"];
    var hostnameMaxLen = 255;
    var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
    var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
    var unsafeProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var hostlessProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var slashedProtocol = {
      "http": true,
      "https": true,
      "ftp": true,
      "gopher": true,
      "file": true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    var querystring = require_querystring();
    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && util.isObject(url) && url instanceof Url)
        return url;
      var u = new Url();
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }
    Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
      if (!util.isString(url)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }
      var queryIndex = url.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url.indexOf("#") ? "?" : "#", uSplit = url.split(splitter), slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, "/");
      url = uSplit.join(splitter);
      var rest = url;
      rest = rest.trim();
      if (!slashesDenoteHost && url.split("#").length === 1) {
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = "";
            this.query = {};
          }
          return this;
        }
      }
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (var i2 = 0; i2 < hostEndingChars.length; i2++) {
          var hec = rest.indexOf(hostEndingChars[i2]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }
        hostEnd = -1;
        for (var i2 = 0; i2 < nonHostChars.length; i2++) {
          var hec = rest.indexOf(nonHostChars[i2]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        if (hostEnd === -1)
          hostEnd = rest.length;
        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost();
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i2 = 0, l = hostparts.length; i2 < l; i2++) {
            var part = hostparts[i2];
            if (!part)
              continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i2);
                var notHost = hostparts.slice(i2 + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = "/" + notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        } else {
          this.hostname = this.hostname.toLowerCase();
        }
        if (!ipv6Hostname) {
          this.hostname = punycode.toASCII(this.hostname);
        }
        var p = this.port ? ":" + this.port : "";
        var h = this.hostname || "";
        this.host = h + p;
        this.href += this.host;
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== "/") {
            rest = "/" + rest;
          }
        }
      }
      if (!unsafeProtocol[lowerProto]) {
        for (var i2 = 0, l = autoEscape.length; i2 < l; i2++) {
          var ae = autoEscape[i2];
          if (rest.indexOf(ae) === -1)
            continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        this.search = "";
        this.query = {};
      }
      if (rest)
        this.pathname = rest;
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "/";
      }
      if (this.pathname || this.search) {
        var p = this.pathname || "";
        var s = this.search || "";
        this.path = p + s;
      }
      this.href = this.format();
      return this;
    };
    function urlFormat(obj) {
      if (util.isString(obj))
        obj = urlParse(obj);
      if (!(obj instanceof Url))
        return Url.prototype.format.call(obj);
      return obj.format();
    }
    Url.prototype.format = function() {
      var auth = this.auth || "";
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
      }
      var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
        if (this.port) {
          host += ":" + this.port;
        }
      }
      if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }
      var search = this.search || query && "?" + query || "";
      if (protocol && protocol.substr(-1) !== ":")
        protocol += ":";
      if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname.charAt(0) !== "/")
          pathname = "/" + pathname;
      } else if (!host) {
        host = "";
      }
      if (hash && hash.charAt(0) !== "#")
        hash = "#" + hash;
      if (search && search.charAt(0) !== "?")
        search = "?" + search;
      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace("#", "%23");
      return protocol + host + pathname + search + hash;
    };
    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }
    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };
    function urlResolveObject(source, relative) {
      if (!source)
        return relative;
      return urlParse(source, false, true).resolveObject(relative);
    }
    Url.prototype.resolveObject = function(relative) {
      if (util.isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }
      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }
      result.hash = relative.hash;
      if (relative.href === "") {
        result.href = result.format();
        return result;
      }
      if (relative.slashes && !relative.protocol) {
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== "protocol")
            result[rkey] = relative[rkey];
        }
        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
          result.path = result.pathname = "/";
        }
        result.href = result.format();
        return result;
      }
      if (relative.protocol && relative.protocol !== result.protocol) {
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }
        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || "").split("/");
          while (relPath.length && !(relative.host = relPath.shift()))
            ;
          if (!relative.host)
            relative.host = "";
          if (!relative.hostname)
            relative.hostname = "";
          if (relPath[0] !== "")
            relPath.unshift("");
          if (relPath.length < 2)
            relPath.unshift("");
          result.pathname = relPath.join("/");
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || "";
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        if (result.pathname || result.search) {
          var p = result.pathname || "";
          var s = result.search || "";
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }
      var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
      if (psychotic) {
        result.hostname = "";
        result.port = null;
        if (result.host) {
          if (srcPath[0] === "")
            srcPath[0] = result.host;
          else
            srcPath.unshift(result.host);
        }
        result.host = "";
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === "")
              relPath[0] = relative.host;
            else
              relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
      }
      if (isRelAbs) {
        result.host = relative.host || relative.host === "" ? relative.host : result.host;
        result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
      } else if (relPath.length) {
        if (!srcPath)
          srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!util.isNullOrUndefined(relative.search)) {
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.href = result.format();
        return result;
      }
      if (!srcPath.length) {
        result.pathname = null;
        if (result.search) {
          result.path = "/" + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
      var up = 0;
      for (var i2 = srcPath.length; i2 >= 0; i2--) {
        last = srcPath[i2];
        if (last === ".") {
          srcPath.splice(i2, 1);
        } else if (last === "..") {
          srcPath.splice(i2, 1);
          up++;
        } else if (up) {
          srcPath.splice(i2, 1);
          up--;
        }
      }
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift("..");
        }
      }
      if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
        srcPath.unshift("");
      }
      if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
        srcPath.push("");
      }
      var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      mustEndAbs = mustEndAbs || result.host && srcPath.length;
      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift("");
      }
      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join("/");
      }
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };
    Url.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host)
        this.hostname = host;
    };
  }
});
var require_normalize_url = __commonJS2({
  "../../node_modules/normalize-url/index.js"(exports, module) {
    "use strict";
    var URLParser = typeof URL === "undefined" ? require_url().URL : URL;
    var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
    var DATA_URL_DEFAULT_CHARSET = "us-ascii";
    var testParameter = (name, filters) => {
      return filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
    };
    var normalizeDataURL = (urlString, { stripHash }) => {
      const parts = urlString.match(/^data:([^,]*?),([^#]*?)(?:#(.*))?$/);
      if (!parts) {
        throw new Error(`Invalid URL: ${urlString}`);
      }
      const mediaType = parts[1].split(";");
      const body = parts[2];
      const hash = stripHash ? "" : parts[3];
      let base64 = false;
      if (mediaType[mediaType.length - 1] === "base64") {
        mediaType.pop();
        base64 = true;
      }
      const mimeType = (mediaType.shift() || "").toLowerCase();
      const attributes = mediaType.map((attribute) => {
        let [key, value = ""] = attribute.split("=").map((string2) => string2.trim());
        if (key === "charset") {
          value = value.toLowerCase();
          if (value === DATA_URL_DEFAULT_CHARSET) {
            return "";
          }
        }
        return `${key}${value ? `=${value}` : ""}`;
      }).filter(Boolean);
      const normalizedMediaType = [
        ...attributes
      ];
      if (base64) {
        normalizedMediaType.push("base64");
      }
      if (normalizedMediaType.length !== 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
        normalizedMediaType.unshift(mimeType);
      }
      return `data:${normalizedMediaType.join(";")},${base64 ? body.trim() : body}${hash ? `#${hash}` : ""}`;
    };
    var normalizeUrl = (urlString, options) => {
      options = {
        defaultProtocol: "http:",
        normalizeProtocol: true,
        forceHttp: false,
        forceHttps: false,
        stripAuthentication: true,
        stripHash: false,
        stripWWW: true,
        removeQueryParameters: [/^utm_\w+/i],
        removeTrailingSlash: true,
        removeDirectoryIndex: false,
        sortQueryParameters: true,
        ...options
      };
      if (Reflect.has(options, "normalizeHttps")) {
        throw new Error("options.normalizeHttps is renamed to options.forceHttp");
      }
      if (Reflect.has(options, "normalizeHttp")) {
        throw new Error("options.normalizeHttp is renamed to options.forceHttps");
      }
      if (Reflect.has(options, "stripFragment")) {
        throw new Error("options.stripFragment is renamed to options.stripHash");
      }
      urlString = urlString.trim();
      if (/^data:/i.test(urlString)) {
        return normalizeDataURL(urlString, options);
      }
      const hasRelativeProtocol = urlString.startsWith("//");
      const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
      if (!isRelativeUrl) {
        urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
      }
      const urlObj = new URLParser(urlString);
      if (options.forceHttp && options.forceHttps) {
        throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
      }
      if (options.forceHttp && urlObj.protocol === "https:") {
        urlObj.protocol = "http:";
      }
      if (options.forceHttps && urlObj.protocol === "http:") {
        urlObj.protocol = "https:";
      }
      if (options.stripAuthentication) {
        urlObj.username = "";
        urlObj.password = "";
      }
      if (options.stripHash) {
        urlObj.hash = "";
      }
      if (urlObj.pathname) {
        urlObj.pathname = urlObj.pathname.replace(/((?!:).|^)\/{2,}/g, (_, p1) => {
          if (/^(?!\/)/g.test(p1)) {
            return `${p1}/`;
          }
          return "/";
        });
      }
      if (urlObj.pathname) {
        urlObj.pathname = decodeURI(urlObj.pathname);
      }
      if (options.removeDirectoryIndex === true) {
        options.removeDirectoryIndex = [/^index\.[a-z]+$/];
      }
      if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
        let pathComponents = urlObj.pathname.split("/");
        const lastComponent = pathComponents[pathComponents.length - 1];
        if (testParameter(lastComponent, options.removeDirectoryIndex)) {
          pathComponents = pathComponents.slice(0, pathComponents.length - 1);
          urlObj.pathname = pathComponents.slice(1).join("/") + "/";
        }
      }
      if (urlObj.hostname) {
        urlObj.hostname = urlObj.hostname.replace(/\.$/, "");
        if (options.stripWWW && /^www\.([a-z\-\d]{2,63})\.([a-z.]{2,5})$/.test(urlObj.hostname)) {
          urlObj.hostname = urlObj.hostname.replace(/^www\./, "");
        }
      }
      if (Array.isArray(options.removeQueryParameters)) {
        for (const key of [...urlObj.searchParams.keys()]) {
          if (testParameter(key, options.removeQueryParameters)) {
            urlObj.searchParams.delete(key);
          }
        }
      }
      if (options.sortQueryParameters) {
        urlObj.searchParams.sort();
      }
      if (options.removeTrailingSlash) {
        urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
      }
      urlString = urlObj.toString();
      if ((options.removeTrailingSlash || urlObj.pathname === "/") && urlObj.hash === "") {
        urlString = urlString.replace(/\/$/, "");
      }
      if (hasRelativeProtocol && !options.normalizeProtocol) {
        urlString = urlString.replace(/^http:\/\//, "//");
      }
      if (options.stripProtocol) {
        urlString = urlString.replace(/^(?:https?:)?\/\//, "");
      }
      return urlString;
    };
    module.exports = normalizeUrl;
    module.exports.default = normalizeUrl;
  }
});
var require_lib4 = __commonJS2({
  "../../node_modules/parse-url/lib/index.js"(exports, module) {
    "use strict";
    var parsePath = require_lib3();
    var normalizeUrl = require_normalize_url();
    function parseUrl2(url, normalize = false) {
      if (typeof url !== "string" || !url.trim()) {
        throw new Error("Invalid url.");
      }
      if (normalize) {
        if (typeof normalize !== "object") {
          normalize = {
            stripHash: false
          };
        }
        url = normalizeUrl(url, normalize);
      }
      const parsed = parsePath(url);
      return parsed;
    }
    module.exports = parseUrl2;
  }
});
var require_requires_port = __commonJS2({
  "../../node_modules/requires-port/index.js"(exports, module) {
    "use strict";
    module.exports = function required(port, protocol) {
      protocol = protocol.split(":")[0];
      port = +port;
      if (!port)
        return false;
      switch (protocol) {
        case "http":
        case "ws":
          return port !== 80;
        case "https":
        case "wss":
          return port !== 443;
        case "ftp":
          return port !== 21;
        case "gopher":
          return port !== 70;
        case "file":
          return false;
      }
      return port !== 0;
    };
  }
});
var require_querystringify = __commonJS2({
  "../../node_modules/querystringify/index.js"(exports) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var undef;
    function decode(input) {
      try {
        return decodeURIComponent(input.replace(/\+/g, " "));
      } catch (e) {
        return null;
      }
    }
    function encode(input) {
      try {
        return encodeURIComponent(input);
      } catch (e) {
        return null;
      }
    }
    function querystring(query) {
      var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
      while (part = parser.exec(query)) {
        var key = decode(part[1]), value = decode(part[2]);
        if (key === null || value === null || key in result)
          continue;
        result[key] = value;
      }
      return result;
    }
    function querystringify(obj, prefix) {
      prefix = prefix || "";
      var pairs2 = [], value, key;
      if (typeof prefix !== "string")
        prefix = "?";
      for (key in obj) {
        if (has.call(obj, key)) {
          value = obj[key];
          if (!value && (value === null || value === undef || isNaN(value))) {
            value = "";
          }
          key = encode(key);
          value = encode(value);
          if (key === null || value === null)
            continue;
          pairs2.push(key + "=" + value);
        }
      }
      return pairs2.length ? prefix + pairs2.join("&") : "";
    }
    exports.stringify = querystringify;
    exports.parse = querystring;
  }
});
var require_url_parse = __commonJS2({
  "../../node_modules/url-parse/index.js"(exports, module) {
    "use strict";
    var required = require_requires_port();
    var qs = require_querystringify();
    var controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
    var CRHTLF = /[\n\r\t]/g;
    var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
    var port = /:\d+$/;
    var protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i;
    var windowsDriveLetter = /^[a-zA-Z]:/;
    function trimLeft(str2) {
      return (str2 ? str2 : "").toString().replace(controlOrWhitespace, "");
    }
    var rules = [
      ["#", "hash"],
      ["?", "query"],
      function sanitize(address, url) {
        return isSpecial(url.protocol) ? address.replace(/\\/g, "/") : address;
      },
      ["/", "pathname"],
      ["@", "auth", 1],
      [NaN, "host", void 0, 1, 1],
      [/:(\d*)$/, "port", void 0, 1],
      [NaN, "hostname", void 0, 1, 1]
    ];
    var ignore = { hash: 1, query: 1 };
    function lolcation(loc) {
      var globalVar;
      if (typeof window !== "undefined")
        globalVar = window;
      else if (typeof global !== "undefined")
        globalVar = global;
      else if (typeof self !== "undefined")
        globalVar = self;
      else
        globalVar = {};
      var location = globalVar.location || {};
      loc = loc || location;
      var finaldestination = {}, type2 = typeof loc, key;
      if (loc.protocol === "blob:") {
        finaldestination = new Url(unescape(loc.pathname), {});
      } else if (type2 === "string") {
        finaldestination = new Url(loc, {});
        for (key in ignore)
          delete finaldestination[key];
      } else if (type2 === "object") {
        for (key in loc) {
          if (key in ignore)
            continue;
          finaldestination[key] = loc[key];
        }
        if (finaldestination.slashes === void 0) {
          finaldestination.slashes = slashes.test(loc.href);
        }
      }
      return finaldestination;
    }
    function isSpecial(scheme) {
      return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
    }
    function extractProtocol(address, location) {
      address = trimLeft(address);
      address = address.replace(CRHTLF, "");
      location = location || {};
      var match = protocolre.exec(address);
      var protocol = match[1] ? match[1].toLowerCase() : "";
      var forwardSlashes = !!match[2];
      var otherSlashes = !!match[3];
      var slashesCount = 0;
      var rest;
      if (forwardSlashes) {
        if (otherSlashes) {
          rest = match[2] + match[3] + match[4];
          slashesCount = match[2].length + match[3].length;
        } else {
          rest = match[2] + match[4];
          slashesCount = match[2].length;
        }
      } else {
        if (otherSlashes) {
          rest = match[3] + match[4];
          slashesCount = match[3].length;
        } else {
          rest = match[4];
        }
      }
      if (protocol === "file:") {
        if (slashesCount >= 2) {
          rest = rest.slice(2);
        }
      } else if (isSpecial(protocol)) {
        rest = match[4];
      } else if (protocol) {
        if (forwardSlashes) {
          rest = rest.slice(2);
        }
      } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
        rest = match[4];
      }
      return {
        protocol,
        slashes: forwardSlashes || isSpecial(protocol),
        slashesCount,
        rest
      };
    }
    function resolve(relative, base) {
      if (relative === "")
        return base;
      var path = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i2 = path.length, last = path[i2 - 1], unshift = false, up = 0;
      while (i2--) {
        if (path[i2] === ".") {
          path.splice(i2, 1);
        } else if (path[i2] === "..") {
          path.splice(i2, 1);
          up++;
        } else if (up) {
          if (i2 === 0)
            unshift = true;
          path.splice(i2, 1);
          up--;
        }
      }
      if (unshift)
        path.unshift("");
      if (last === "." || last === "..")
        path.push("");
      return path.join("/");
    }
    function Url(address, location, parser) {
      address = trimLeft(address);
      address = address.replace(CRHTLF, "");
      if (!(this instanceof Url)) {
        return new Url(address, location, parser);
      }
      var relative, extracted, parse, instruction, index, key, instructions = rules.slice(), type2 = typeof location, url = this, i2 = 0;
      if (type2 !== "object" && type2 !== "string") {
        parser = location;
        location = null;
      }
      if (parser && typeof parser !== "function")
        parser = qs.parse;
      location = lolcation(location);
      extracted = extractProtocol(address || "", location);
      relative = !extracted.protocol && !extracted.slashes;
      url.slashes = extracted.slashes || relative && location.slashes;
      url.protocol = extracted.protocol || location.protocol || "";
      address = extracted.rest;
      if (extracted.protocol === "file:" && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
        instructions[3] = [/(.*)/, "pathname"];
      }
      for (; i2 < instructions.length; i2++) {
        instruction = instructions[i2];
        if (typeof instruction === "function") {
          address = instruction(address, url);
          continue;
        }
        parse = instruction[0];
        key = instruction[1];
        if (parse !== parse) {
          url[key] = address;
        } else if (typeof parse === "string") {
          index = parse === "@" ? address.lastIndexOf(parse) : address.indexOf(parse);
          if (~index) {
            if (typeof instruction[2] === "number") {
              url[key] = address.slice(0, index);
              address = address.slice(index + instruction[2]);
            } else {
              url[key] = address.slice(index);
              address = address.slice(0, index);
            }
          }
        } else if (index = parse.exec(address)) {
          url[key] = index[1];
          address = address.slice(0, index.index);
        }
        url[key] = url[key] || (relative && instruction[3] ? location[key] || "" : "");
        if (instruction[4])
          url[key] = url[key].toLowerCase();
      }
      if (parser)
        url.query = parser(url.query);
      if (relative && location.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location.pathname !== "")) {
        url.pathname = resolve(url.pathname, location.pathname);
      }
      if (url.pathname.charAt(0) !== "/" && isSpecial(url.protocol)) {
        url.pathname = "/" + url.pathname;
      }
      if (!required(url.port, url.protocol)) {
        url.host = url.hostname;
        url.port = "";
      }
      url.username = url.password = "";
      if (url.auth) {
        index = url.auth.indexOf(":");
        if (~index) {
          url.username = url.auth.slice(0, index);
          url.username = encodeURIComponent(decodeURIComponent(url.username));
          url.password = url.auth.slice(index + 1);
          url.password = encodeURIComponent(decodeURIComponent(url.password));
        } else {
          url.username = encodeURIComponent(decodeURIComponent(url.auth));
        }
        url.auth = url.password ? url.username + ":" + url.password : url.username;
      }
      url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
      url.href = url.toString();
    }
    function set2(part, value, fn) {
      var url = this;
      switch (part) {
        case "query":
          if (typeof value === "string" && value.length) {
            value = (fn || qs.parse)(value);
          }
          url[part] = value;
          break;
        case "port":
          url[part] = value;
          if (!required(value, url.protocol)) {
            url.host = url.hostname;
            url[part] = "";
          } else if (value) {
            url.host = url.hostname + ":" + value;
          }
          break;
        case "hostname":
          url[part] = value;
          if (url.port)
            value += ":" + url.port;
          url.host = value;
          break;
        case "host":
          url[part] = value;
          if (port.test(value)) {
            value = value.split(":");
            url.port = value.pop();
            url.hostname = value.join(":");
          } else {
            url.hostname = value;
            url.port = "";
          }
          break;
        case "protocol":
          url.protocol = value.toLowerCase();
          url.slashes = !fn;
          break;
        case "pathname":
        case "hash":
          if (value) {
            var char = part === "pathname" ? "/" : "#";
            url[part] = value.charAt(0) !== char ? char + value : value;
          } else {
            url[part] = value;
          }
          break;
        case "username":
        case "password":
          url[part] = encodeURIComponent(value);
          break;
        case "auth":
          var index = value.indexOf(":");
          if (~index) {
            url.username = value.slice(0, index);
            url.username = encodeURIComponent(decodeURIComponent(url.username));
            url.password = value.slice(index + 1);
            url.password = encodeURIComponent(decodeURIComponent(url.password));
          } else {
            url.username = encodeURIComponent(decodeURIComponent(value));
          }
      }
      for (var i2 = 0; i2 < rules.length; i2++) {
        var ins = rules[i2];
        if (ins[4])
          url[ins[1]] = url[ins[1]].toLowerCase();
      }
      url.auth = url.password ? url.username + ":" + url.password : url.username;
      url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
      url.href = url.toString();
      return url;
    }
    function toString2(stringify) {
      if (!stringify || typeof stringify !== "function")
        stringify = qs.stringify;
      var query, url = this, host = url.host, protocol = url.protocol;
      if (protocol && protocol.charAt(protocol.length - 1) !== ":")
        protocol += ":";
      var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? "//" : "");
      if (url.username) {
        result += url.username;
        if (url.password)
          result += ":" + url.password;
        result += "@";
      } else if (url.password) {
        result += ":" + url.password;
        result += "@";
      } else if (url.protocol !== "file:" && isSpecial(url.protocol) && !host && url.pathname !== "/") {
        result += "@";
      }
      if (host[host.length - 1] === ":" || port.test(url.hostname) && !url.port) {
        host += ":";
      }
      result += host + url.pathname;
      query = typeof url.query === "object" ? stringify(url.query) : url.query;
      if (query)
        result += query.charAt(0) !== "?" ? "?" + query : query;
      if (url.hash)
        result += url.hash;
      return result;
    }
    Url.prototype = { set: set2, toString: toString2 };
    Url.extractProtocol = extractProtocol;
    Url.location = lolcation;
    Url.trimLeft = trimLeft;
    Url.qs = qs;
    module.exports = Url;
  }
});
var FileSystemHandlePermissionRead = "read";
var FileSystemHandlePermissionReadWrite = "readwrite";
var FS_DEBUG = false;
var NFileSystemHandle = class {
  constructor(adapter) {
    this.adapter = adapter;
    this.kind = adapter.kind;
    this.name = adapter.name;
    this.isDirectory = false;
    this.isFile = false;
  }
  isFile;
  isDirectory;
  name;
  kind;
  fsDebug(message, ...optionalParams) {
    if (FS_DEBUG) {
      console.debug(message, optionalParams);
    }
  }
  async queryPermission(descriptor) {
    if (this.adapter.queryPermission) {
      return this.adapter.queryPermission(descriptor);
    } else {
      if (descriptor) {
        if (descriptor.mode === FileSystemHandlePermissionRead) {
          return "granted";
        } else if (descriptor.mode == FileSystemHandlePermissionReadWrite) {
          const dynAdapter = this.adapter;
          if (dynAdapter.writable) {
            return dynAdapter.writable ? "granted" : "denied";
          } else {
            return "denied";
          }
        } else {
          throw new TypeError(`Mode ${descriptor.mode} must be 'read' or 'readwrite'`);
        }
      }
    }
    return "granted";
  }
  async requestPermission(descriptor) {
    if (!descriptor) {
      descriptor = {
        mode: FileSystemHandlePermissionRead
      };
    }
    if (this.adapter.requestPermission) {
      return this.adapter.requestPermission(descriptor);
    } else {
      if (descriptor.mode === FileSystemHandlePermissionRead) {
        return "granted";
      } else if (descriptor.mode == FileSystemHandlePermissionReadWrite) {
        const dynAdapter = this.adapter;
        if (dynAdapter.writable) {
          return dynAdapter.writable ? "granted" : "denied";
        } else {
          return "denied";
        }
      } else {
        throw new TypeError(`Mode ${descriptor.mode} must be 'read' or 'readwrite'`);
      }
    }
  }
  async isSameEntry(other) {
    if (this === other)
      return true;
    if (other instanceof NFileSystemHandle) {
      if (typeof other !== "object" || this.kind !== other.kind || !other.adapter) {
        return false;
      }
      return this.adapter.isSameEntry(other.adapter);
    } else {
      return this.adapter.isSameEntry(other);
    }
  }
  get [Symbol.toStringTag]() {
    return "FileSystemHandle";
  }
};
var FileSystemWritableFileStream = class extends WritableStream {
  constructor(...args) {
    super(...args);
    Object.setPrototypeOf(this, FileSystemWritableFileStream.prototype);
  }
  _closed = false;
  async close() {
    this._closed = true;
    const w = this.getWriter();
    await w.close();
    w.releaseLock();
    return;
  }
  async seek(position) {
    return this.write({ type: "seek", position });
  }
  async truncate(size) {
    return this.write({ type: "truncate", size });
  }
  async write(data) {
    if (this._closed) {
      return Promise.reject(new TypeError("Cannot write to a CLOSED writable stream"));
    }
    const writer = this.getWriter();
    const p = writer.write(data);
    writer.releaseLock();
    return p;
  }
  get [Symbol.toStringTag]() {
    return "FileSystemWritableFileStream";
  }
};
var NFileSystemFileHandle = class extends NFileSystemHandle {
  constructor(adapter) {
    super(adapter);
    this.isFile = true;
    this.isDirectory = false;
  }
  isFile;
  isDirectory;
  kind = "file";
  async createWritable(options = {}) {
    const thisAdapter = this.getAdapterFileSystemFileHandle();
    if (thisAdapter.createWritable) {
      return new FileSystemWritableFileStream(await thisAdapter.createWritable(options));
    } else if (thisAdapter.createAccessHandle) {
      const accessHandle = await thisAdapter.createAccessHandle();
      const writer = accessHandle.writable.getWriter();
      return writer;
    }
    throw new Error("createWritable not supported");
  }
  getFile() {
    return Promise.resolve(this.getAdapterFileSystemFileHandle().getFile());
  }
  get [Symbol.toStringTag]() {
    return "FileSystemFileHandle";
  }
  getAdapterFileSystemFileHandle() {
    return this.adapter;
  }
};
var import_parse_url = __toESM2(require_lib4(), 1);
var InvalidStateError = class extends Error {
  constructor() {
    super("seeking position failed.");
    this.name = "InvalidStateError";
  }
};
var NotFoundError = class extends Error {
  constructor() {
    super("A requested file or directory could not be found at the time an operation was processed.");
    this.name = "NotFoundError";
  }
};
var TypeMismatchError = class extends Error {
  constructor() {
    super("The path supplied exists, but was not an entry of requested type.");
    this.name = "TypeMismatchError";
  }
};
var InvalidModificationError = class extends Error {
  constructor() {
    super("The object can not be modified in this way.");
    this.name = "InvalidModificationError";
  }
};
var SyntaxError = class extends Error {
  constructor(m) {
    super(`Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. ${m}`);
    this.name = "SyntaxError";
  }
};
var NotAllowedError = class extends Error {
  constructor() {
    super("The request is not allowed by the user agent or the platform in the current context.");
    this.name = "NotAllowedError";
  }
};
globalThis.FSJS_UTIL_DEBUG = false;
function utilDebug(message, ...optionalParams) {
  if (globalThis.FSJS_UTIL_DEBUG) {
    console.debug(message, optionalParams);
  }
}
function join(parentPath, childName, includeTrailingSlash = false) {
  let path;
  if (parentPath == "") {
    path = childName;
  } else {
    path = parentPath + childName;
  }
  if (includeTrailingSlash) {
    path = `${path}/`;
  }
  return path;
}
function substituteSecretValue(secretKey, secretStore) {
  utilDebug(`substituteSecretValue: secretKey: ${secretKey}`);
  utilDebug("substituteSecretValue: secretStore: ", secretStore);
  if (secretKey.startsWith("${")) {
    const secretKeyPath = secretKey.replace("${", "").replace("}", "");
    utilDebug(`substituteSecretValue: secretKeyPath: ${secretKeyPath}`);
    const secretKeyReplaced = resolveObjectPath(secretKeyPath, secretStore);
    utilDebug("substituteSecretValue: secretKeyReplaced: ", secretKeyReplaced);
    return secretKeyReplaced;
  }
  return secretKey;
}
function resolveObjectPath(path, obj, separator = ".") {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}
async function openFileHandle(parentHandle, subPath) {
  const h = await openHandle(parentHandle, subPath, true);
  return h;
}
async function openDirectoryHandle(parentHandle, subPath) {
  const h = await openHandle(parentHandle, subPath, false);
  return h;
}
async function openHandle(parentHandle, subPath, expectingFile) {
  utilDebug(`openHandle: subPath: "${subPath}"`);
  const paths = subPath.split("/");
  utilDebug("openHandle: paths:", paths);
  let dirHandle = parentHandle;
  const pathLength = paths.length;
  for (let i2 = 0; i2 < pathLength; i2++) {
    const pathPart = paths[i2];
    utilDebug(`openHandle: pathPart ${pathPart}`);
    if (pathPart != "") {
      let is_last = false;
      if (i2 == pathLength - 1) {
        is_last = true;
      }
      if (is_last) {
        if (expectingFile) {
          utilDebug(`openHandle: expectingFile: ${expectingFile} before getFileHandle pathPart: ${pathPart}`);
          const fileHandle = await dirHandle.getFileHandle(pathPart);
          return fileHandle;
        } else {
          utilDebug(`openHandle: expectingFile: ${expectingFile} before getDirectoryHandle pathPart: ${pathPart}`);
          const retDirHandle = await dirHandle.getDirectoryHandle(pathPart);
          return retDirHandle;
        }
      } else {
        utilDebug(`openHandle: before getDirectoryHandle pathPart: ${pathPart}`);
        dirHandle = await dirHandle.getDirectoryHandle(pathPart);
      }
    }
  }
  throw new NotFoundError();
}
var DefaultSink = class {
  constructor(fileHandle) {
    this.fileHandle = fileHandle;
    this.size = 0;
    this.position = 0;
    this.locked = false;
  }
  _closed = false;
  fileHandle;
  size;
  position;
  locked;
  async seek(position) {
    return this.write({ type: "seek", position });
  }
  async truncate(size) {
    return this.write({ type: "truncate", size });
  }
  async abort(_reason) {
    return;
  }
  get [Symbol.toStringTag]() {
    return "DefaultSink";
  }
};
var import_url_parse = __toESM2(require_url_parse(), 1);
var GITHUB_DEBUG = false;
function githubDebug(message, ...optionalParams) {
  if (GITHUB_DEBUG) {
    console.debug(message, optionalParams);
  }
}
var Sink = class extends DefaultSink {
  constructor(fileHandle) {
    super(fileHandle);
    this.fileHandle = fileHandle;
    this.file = fileHandle.file;
    this.size = fileHandle.file.size;
    this.position = 0;
  }
  fileHandle;
  file;
  size;
  position;
  async abort() {
    await this.close();
  }
  async write(chunk) {
    const repoName = this.fileHandle.config.repoName;
    let file = this.file;
    if (typeof chunk === "object") {
      if (chunk.type === "write") {
        githubDebug("is object write");
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          this.position = chunk.position;
          if (this.size < chunk.position) {
            this.file = new File([this.file, new ArrayBuffer(chunk.position - this.size)], this.file.name, this.file);
          }
        }
        if (!("data" in chunk)) {
          throw new SyntaxError("write requires a data argument");
        }
        chunk = chunk.data;
      } else if (chunk.type === "seek") {
        githubDebug("is object seek");
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          if (this.size < chunk.position) {
            throw new InvalidStateError();
          }
          this.position = chunk.position;
          return;
        } else {
          throw new SyntaxError("seek requires a position argument");
        }
      } else if (chunk.type === "truncate") {
        githubDebug("is object truncate");
        if (Number.isInteger(chunk.size) && chunk.size >= 0) {
          file = chunk.size < this.size ? new File([file.slice(0, chunk.size)], file.name, file) : new File([file, new Uint8Array(chunk.size - this.size)], file.name);
          this.size = file.size;
          if (this.position > file.size) {
            this.position = file.size;
          }
          this.file = file;
          return;
        } else {
          throw new SyntaxError("truncate requires a size argument");
        }
      }
    }
    chunk = new Blob([chunk]);
    let blob = this.file;
    const head = blob.slice(0, this.position);
    const tail = blob.slice(this.position + chunk.size);
    let padding = this.position - head.size;
    if (padding < 0) {
      padding = 0;
    }
    blob = new File([head, new Uint8Array(padding), chunk, tail], blob.name);
    this.size = blob.size;
    this.position += chunk.size;
    const path = this.fileHandle.path;
    const body = await blob.arrayBuffer();
    const abody = new Uint8Array(body);
    this.file = blob;
  }
  async close() {
    if (this.fileHandle.deleted)
      throw new NotFoundError();
    this.fileHandle.file = this.file;
    this.file = this.position = this.size = null;
  }
};
var GithubFile = class {
  constructor(config, blobUrl, path, fileName, fileBits, size, lastModified, options) {
    this.config = config;
    this.blobUrl = blobUrl;
    this.size = size;
    this.type = "File";
    this.webkitRelativePath = fileName;
    this.name = fileName;
    this.path = path;
    this.lastModified = lastModified;
  }
  config;
  blobUrl;
  lastModified;
  name;
  path;
  webkitRelativePath;
  type;
  size;
  start;
  end;
  contentType;
  async arrayBuffer(...args) {
    const url = this.blobUrl;
    try {
      const response = await this.config.fetchBlob(url);
      githubDebug("response: ", response);
      const json2 = await response.json();
      const base64data = json2.content;
      githubDebug("base64data:", base64data);
      const bString = atob(base64data);
      const len = bString.length;
      const buffer = new Uint8Array(len);
      for (let i2 = 0; i2 < len; i2++) {
        buffer[i2] = bString.charCodeAt(i2);
      }
      const start = this.start || 0;
      const end = this.end || this.size;
      const ret = buffer.slice(start, end);
      return ret;
    } catch (error) {
      console.error("arrayBuffer cached error: ", error);
    }
    return new ArrayBuffer(0);
  }
  slice(start, end, contentType) {
    const file = new GithubFile(this.config, this.blobUrl, this.path, this.name, [], this.size, this.lastModified);
    file.start = start;
    file.end = end;
    file.contentType = contentType;
    return file;
  }
  stream() {
    throw new Error("stream method not implemented.");
  }
  async text() {
    const ab = await this.arrayBuffer();
    const b = Buffer.from(ab);
    const str2 = b.toString("utf8");
    return str2;
  }
};
var GithubFileHandle = class {
  constructor(config, blobUrl, path = "", name = "", file = new File([], name), writable = true) {
    this.config = config;
    this.blobUrl = blobUrl;
    this.file = file;
    this.name = name;
    this.path = path;
    this.deleted = false;
    this.writable = writable;
    this.readable = true;
  }
  config;
  blobUrl;
  deleted;
  file;
  name;
  readable;
  writable;
  path;
  kind = "file";
  async getFile() {
    if (this.deleted)
      throw new NotFoundError();
    return this.file;
  }
  async createWritable() {
    if (!this.writable)
      throw new NotAllowedError();
    if (this.deleted)
      throw new NotFoundError();
    return new Sink(this);
  }
  async isSameEntry(other) {
    return this === other;
  }
  destroy() {
    throw new Error("unimplemented");
  }
};
var GithubConfig = class {
  constructor(owner, repoName, ref, user, password) {
    this.owner = owner;
    this.repoName = repoName;
    this.ref = ref;
    this.user = user;
    this.password = password;
  }
  owner;
  repoName;
  ref;
  user;
  password;
  async fetch(url) {
    const githubUser = this.user;
    const githubPassword = this.password;
    const authString = `${githubUser}:${githubPassword}`;
    githubDebug(`authString: ${authString}`);
    const credentials = btoa(authString);
    const authorization = `Basic ${credentials}`;
    githubDebug(`authorization: ${authorization}`);
    const headers = {
      Accept: "application/vnd.github.v3+json",
      Authorization: authorization
    };
    githubDebug(`performing request: ${url}`);
    githubDebug("headers:", headers);
    const options = { headers };
    const data = await fetch(url, options);
    return data;
  }
  async fetchRepoEntries(path) {
    const owner = this.owner;
    const repo = this.repoName;
    let ref = this.ref;
    githubDebug(`ref before ${ref}`);
    if (ref == void 0) {
      ref = await this.fetchRepoDefaultBranch();
      this.ref = ref;
      githubDebug(`ref after ${ref}`);
    }
    const filePath = encodeFilePath(path).replace(/^\//, ":");
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}${filePath}`;
    githubDebug(`fetchRepoEntries: url: ${url}`);
    return this.fetch(url);
  }
  async fetchBlob(blobUrl) {
    return this.fetch(blobUrl);
  }
  async fetchRepoInfo(path) {
    const owner = this.owner;
    const repo = this.repoName;
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    return this.fetch(repoUrl);
  }
  async fetchRepoDefaultBranch() {
    const repo = this.repoName;
    const response = await this.fetchRepoInfo(repo);
    const data = await response.json();
    const default_branch = data["default_branch"];
    githubDebug(`repo: ${repo} default_branch: ${default_branch}`);
    return default_branch;
  }
  async fetchRepoList(username) {
    const githubUrl = "https://api.github.com/user/repos?per_page=100";
    return this.fetch(githubUrl);
  }
};
function parseGithubUrl(githubUrl, secretStore) {
  let newurl = githubUrl;
  const urlParsed = (0, import_url_parse.default)(githubUrl, true);
  let githubUser = urlParsed.query["username"] || "";
  if (githubUser == "") {
    newurl = newurl + "?username=${github.username}";
  }
  githubUser = substituteSecretValue(githubUser, secretStore);
  let githubToken = urlParsed.query["token"] || "";
  if (githubUser == "") {
    newurl = newurl + "&token=${github.token}";
  }
  githubToken = substituteSecretValue(githubToken, secretStore);
  const ref = urlParsed.query["ref"] || void 0;
  const pathName = urlParsed.pathname;
  const hostname = urlParsed.hostname;
  githubDebug("githubUrl: " + githubUrl);
  githubDebug("urlParsed.toString(): " + urlParsed.toString());
  githubDebug("hostname: " + hostname);
  githubDebug("pathname: " + pathName);
  const owner = hostname;
  let repo = pathName;
  if (repo.startsWith("/")) {
    repo = repo.replace("/", "");
  }
  const githubPassword = githubToken;
  const gConfig = new GithubConfig(owner, repo, ref, githubUser, githubPassword);
  return { gitHubConfig: gConfig, newUrl: newurl };
}
var encodeFilePath = (filePath) => {
  if (filePath != "") {
    filePath = `/${filePath}`;
  }
  return filePath.split("/").map((segment) => encodeURIComponent(segment)).join("/");
};
var GithubFolderHandle = class {
  constructor(config, path, name, writable = true) {
    this.config = config;
    this.name = name;
    this.path = path;
    this.deleted = false;
    this._entries = {};
    this.writable = writable;
    this.readable = true;
  }
  config;
  _entries;
  name;
  deleted;
  readable;
  writable;
  kind = "directory";
  path = "";
  async queryPermission(_options) {
    return "granted";
  }
  async requestPermission(_options) {
    return "granted";
  }
  async populateEntries() {
    try {
      let data = await this.config.fetchRepoEntries(this.path);
      githubDebug("data: ", data);
      data = await data.json();
      githubDebug("datajson: ", data);
      for (const item of data.tree || []) {
        const itemPath = item.path;
        const itemMode = item.mode;
        const itemType = item.type;
        const itemSize = item.size;
        const itemSha = item.sha;
        const itemUrl = item.url;
        const entryName = itemPath;
        const path = join(this.path, entryName);
        const writeable = false;
        if (itemType == "blob") {
          const file = new GithubFile(this.config, itemUrl, path, entryName, [], itemSize, 0);
          this._entries[entryName] = new GithubFileHandle(this.config, itemUrl, path, entryName, file, writeable);
        } else if (itemType == "tree") {
          this._entries[entryName] = new GithubFolderHandle(this.config, path, entryName, writeable);
        }
      }
    } catch (error) {
      console.error("populateEntries cached error: ", error);
    }
  }
  async *entries() {
    await this.populateEntries();
    if (this.deleted)
      throw new NotFoundError();
    yield* Object.entries(this._entries);
  }
  isSameEntry(other) {
    return this === other;
  }
  async getDirectoryHandle(name, options = {}) {
    if (this.deleted)
      throw new NotFoundError();
    const entry = this._entries[name];
    if (entry) {
      if (entry instanceof GithubFileHandle) {
        throw new TypeMismatchError();
      } else {
        return entry;
      }
    } else {
      if (options.create) {
        throw new Error("create not supported");
      } else {
        console.error(`NotFoundError for name: ${name} options: ${options}`);
        throw new NotFoundError();
      }
    }
  }
  async getFileHandle(name, options) {
    const entry = this._entries[name];
    const isFile = entry instanceof GithubFileHandle;
    let do_create = false;
    if (options) {
      if (options.create) {
        do_create = options.create;
      }
    }
    if (entry && isFile)
      return entry;
    if (entry && !isFile) {
      githubDebug(`TypeMismatchError for name: ${name} options: ${options}`);
      throw new TypeMismatchError();
    }
    if (!entry && !do_create) {
      console.error(`NotFoundError for name: ${name} options: ${options}`);
      throw new NotFoundError();
    }
    if (!entry && do_create) {
      throw new Error("create not supported");
    }
  }
  async removeEntry(name, opts) {
    const entry = this._entries[name];
    if (!entry)
      throw new NotFoundError();
    entry.destroy(opts.recursive);
    delete this._entries[name];
  }
  destroy(recursive) {
    for (const x of Object.values(this._entries)) {
      if (!recursive)
        throw new InvalidModificationError();
      x.destroy(recursive);
    }
    this._entries = {};
    this.deleted = true;
  }
};
var GithubRepoHandle = class extends GithubFolderHandle {
  constructor(githubUrl, secretStore) {
    const { gitHubConfig: config, newUrl } = parseGithubUrl(githubUrl, secretStore);
    const name = config.repoName;
    super(config, "", name);
    this.url = newUrl;
    this.config = config;
  }
  url;
  config;
};
var GithubRepoListHandle = class {
  constructor(githubUrl, secretStore) {
    const { gitHubConfig: config, newUrl } = parseGithubUrl(githubUrl, secretStore);
    const owner = config.owner;
    const name = `github-${owner}`;
    this.name = name;
    this.url = newUrl;
    this.config = config;
    this.deleted = false;
    this.writable = false;
    this.readable = true;
    this._entries = {};
    this.secretStore = secretStore;
  }
  url;
  config;
  _entries;
  name;
  deleted;
  readable;
  writable;
  kind = "directory";
  path = "";
  secretStore;
  async queryPermission(_options) {
    return "granted";
  }
  async requestPermission(_options) {
    return "granted";
  }
  async populateEntries() {
    try {
      const owner = this.config.owner;
      let data = await this.config.fetchRepoList(owner);
      githubDebug("data: ", data);
      data = await data.json();
      githubDebug("datajson: ", data);
      for (const item of data || []) {
        const itemName = item.name;
        const itemFullName = item.fullName;
        const urlParsed = (0, import_url_parse.default)(this.url, true);
        urlParsed.set("pathname", `/${itemName}`);
        const repoGithubUrl = urlParsed.toString();
        githubDebug(`repoGithubUrl: ${repoGithubUrl}`);
        this._entries[itemName] = new GithubRepoHandle(repoGithubUrl, this.secretStore);
      }
    } catch (error) {
      console.error("populateEntries cached error: ", error);
    }
  }
  async *entries() {
    await this.populateEntries();
    if (this.deleted)
      throw new NotFoundError();
    yield* Object.entries(this._entries);
  }
  isSameEntry(other) {
    return this === other;
  }
  async getDirectoryHandle(name, options = {}) {
    if (this.deleted)
      throw new NotFoundError();
    const entry = this._entries[name];
    if (entry) {
      if (entry instanceof GithubFileHandle) {
        throw new TypeMismatchError();
      } else {
        return entry;
      }
    } else {
      if (options.create) {
        throw new Error("create not supported");
      } else {
        console.error(`NotFoundError for name: ${name} options: ${options}`);
        throw new NotFoundError();
      }
    }
  }
  async getFileHandle(_name, _opts) {
    throw new TypeMismatchError();
  }
  async removeEntry(name, opts) {
    throw new Error("remove not supported");
  }
  destroy(recursive) {
    throw new Error("destroy not supported");
  }
};
function GetRepoHandle(githubUrl, secretStore) {
  const { gitHubConfig: config, newUrl } = parseGithubUrl(githubUrl, secretStore);
  const repoName = config.repoName;
  githubDebug(`reponame: ${repoName}`);
  if (repoName != "") {
    const h = new GithubRepoHandle(newUrl, secretStore);
    return h;
  } else {
    const h = new GithubRepoListHandle(newUrl, secretStore);
    return h;
  }
}
var github_default = (githubUrl, secretStore) => GetRepoHandle(githubUrl, secretStore);
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence))
    return sequence;
  else if (isNothing(sequence))
    return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string2, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string2;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark)
    return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$1;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
    pos: position - lineStart + head.length
  };
}
function padStart(string2, max) {
  return common.repeat(" ", max - string2.length) + string2;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer)
    return null;
  if (!options.maxLength)
    options.maxLength = 79;
  if (typeof options.indent !== "number")
    options.indent = 1;
  if (typeof options.linesBefore !== "number")
    options.linesBefore = 3;
  if (typeof options.linesAfter !== "number")
    options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0)
    foundLineNo = lineStarts.length - 1;
  var result = "", i2, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i2 = 1; i2 <= options.linesBefore; i2++) {
    if (foundLineNo - i2 < 0)
      break;
    line = getLine(mark.buffer, lineStarts[foundLineNo - i2], lineEnds[foundLineNo - i2], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i2]), maxLineLength);
    result = common.repeat(" ", options.indent) + padStart((mark.line - i2 + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i2 = 1; i2 <= options.linesAfter; i2++) {
    if (foundLineNo + i2 >= lineEnds.length)
      break;
    line = getLine(mark.buffer, lineStarts[foundLineNo + i2], lineEnds[foundLineNo + i2], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i2]), maxLineLength);
    result += common.repeat(" ", options.indent) + padStart((mark.line + i2 + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit)
      implicit = implicit.concat(definition.implicit);
    if (definition.explicit)
      explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type$1.loadKind && type$1.loadKind !== "scalar") {
      throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type$1.multi) {
      throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var seq = new type("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var map = new type("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [
    str,
    seq,
    map
  ]
});
function resolveYamlNull(data) {
  if (data === null)
    return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function resolveYamlBoolean(data) {
  if (data === null)
    return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new type("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null)
    return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max)
    return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max)
      return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (ch !== "0" && ch !== "1")
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isHexCode(data.charCodeAt(index)))
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isOctCode(data.charCodeAt(index)))
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_")
    return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_")
      continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_")
    return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-")
      sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0")
    return 0;
  if (ch === "0") {
    if (value[1] === "b")
      return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x")
      return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o")
      return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
var int = new type("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var YAML_FLOAT_PATTERN = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function resolveYamlFloat(data) {
  if (data === null)
    return false;
  if (!YAML_FLOAT_PATTERN.test(data) || data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
var YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function resolveYamlTimestamp(data) {
  if (data === null)
    return false;
  if (YAML_DATE_REGEXP.exec(data) !== null)
    return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
    return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null)
    match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null)
    throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-")
      delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta)
    date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new type("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null)
    return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64)
      continue;
    if (code < 0)
      return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new type("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null)
    return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]")
      return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey)
          pairHasKey = true;
        else
          return false;
      }
    }
    if (!pairHasKey)
      return false;
    if (objectKeys.indexOf(pairKey) === -1)
      objectKeys.push(pairKey);
    else
      return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null)
    return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]")
      return false;
    keys = Object.keys(pair);
    if (keys.length !== 1)
      return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null)
    return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null)
    return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null)
        return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
var i;
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    if (keyNode === "__proto__") {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1)
    return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1)
    return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33)
    return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38)
    return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42)
    return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch))
        break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0)
      readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null)
    return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string2, handle, length;
  string2 = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string2.length) + string2;
}
var QUOTING_TYPE_SINGLE = 1;
var QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string2, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string2.length;
  while (position < length) {
    next = string2.indexOf("\n", position);
    if (next === -1) {
      line = string2.slice(position);
      position = length;
    } else {
      line = string2.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n")
      result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (inblock ? cIsNsCharOrWhitespace : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar;
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string2, pos) {
  var first = string2.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string2.length) {
    second = string2.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string2) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string2);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string2, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i2;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string2, 0)) && isPlainSafeLast(codePointAt(string2, string2.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i2 = 0; i2 < string2.length; char >= 65536 ? i2 += 2 : i2++) {
      char = codePointAt(string2, i2);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i2 = 0; i2 < string2.length; char >= 65536 ? i2 += 2 : i2++) {
      char = codePointAt(string2, i2);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || i2 - previousLineBreak - 1 > lineWidth && string2[previousLineBreak + 1] !== " ";
          previousLineBreak = i2;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i2 - previousLineBreak - 1 > lineWidth && string2[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string2)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string2)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string2, level, iskey, inblock) {
  state.dump = function() {
    if (string2.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string2) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string2)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string2 + '"' : "'" + string2 + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string22) {
      return testImplicitResolving(state, string22);
    }
    switch (chooseScalarStyle(string2, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
      case STYLE_PLAIN:
        return string2;
      case STYLE_SINGLE:
        return "'" + string2.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string2, state.indent) + dropEndingNewline(indentString(string2, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string2, state.indent) + dropEndingNewline(indentString(foldString(string2, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string2) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  }();
}
function blockHeader(string2, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string2) ? String(indentPerLevel) : "";
  var clip = string2[string2.length - 1] === "\n";
  var keep = clip && (string2[string2.length - 2] === "\n" || string2 === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string2) {
  return string2[string2.length - 1] === "\n" ? string2.slice(0, -1) : string2;
}
function foldString(string2, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = function() {
    var nextLF = string2.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string2.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string2.slice(0, nextLF), width);
  }();
  var prevMoreIndented = string2[0] === "\n" || string2[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string2)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ")
    return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string2) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i2 = 0; i2 < string2.length; char >= 65536 ? i2 += 2 : i2++) {
    char = codePointAt(string2, i2);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string2[i2];
      if (char >= 65536)
        result += string2[i2 + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "")
        _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "")
      pairBuffer += ", ";
    if (state.condenseFlow)
      pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024)
      pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid)
        return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(state.tag[0] === "!" ? state.tag.slice(1) : state.tag).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs)
    getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true))
    return state.dump + "\n";
  return "";
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var Type = type;
var Schema = schema;
var FAILSAFE_SCHEMA = failsafe;
var JSON_SCHEMA = json;
var CORE_SCHEMA = core;
var DEFAULT_SCHEMA = _default;
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var YAMLException = exception;
var types = {
  binary,
  float,
  map,
  null: _null,
  pairs,
  set,
  timestamp,
  bool,
  int,
  merge,
  omap,
  seq,
  str
};
var safeLoad = renamed("safeLoad", "load");
var safeLoadAll = renamed("safeLoadAll", "loadAll");
var safeDump = renamed("safeDump", "dump");
var jsYaml = {
  Type,
  Schema,
  FAILSAFE_SCHEMA,
  JSON_SCHEMA,
  CORE_SCHEMA,
  DEFAULT_SCHEMA,
  load,
  loadAll,
  dump,
  YAMLException,
  types,
  safeLoad,
  safeLoadAll,
  safeDump
};
var js_yaml_default = jsYaml;
var INDEXEDDB_DEBUG = false;
function indexedDBDebug(message, ...optionalParams) {
  if (INDEXEDDB_DEBUG) {
    console.debug(message, optionalParams);
  }
}
var Sink2 = class extends DefaultSink {
  constructor(fileHandle, file) {
    super(fileHandle);
    this.fileHandle = fileHandle;
    const db = fileHandle._db;
    const id = fileHandle._id;
    this.db = db;
    this.id = id;
    const size = file.size;
    this.size = size;
    this.position = 0;
    this.file = file;
  }
  db;
  id;
  fileHandle;
  size;
  position;
  file;
  async write(chunk) {
    if (typeof chunk === "object") {
      if (chunk.type === "write") {
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          if (this.size < chunk.position) {
            this.file = new File([this.file, new ArrayBuffer(chunk.position - this.size)], this.file.name, this.file);
          }
          this.position = chunk.position;
        }
        if (!("data" in chunk)) {
          throw new DOMException("write requires a data argument");
        }
        chunk = chunk.data;
      } else if (chunk.type === "seek") {
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          if (this.size < chunk.position) {
            throw new InvalidStateError();
          }
          this.position = chunk.position;
          return;
        } else {
          throw new SyntaxError("write requires a data argument");
        }
      } else if (chunk.type === "truncate") {
        if (Number.isInteger(chunk.size) && chunk.size >= 0) {
          let file = this.file;
          file = chunk.size < this.size ? new File([file.slice(0, chunk.size)], file.name, file) : new File([file, new Uint8Array(chunk.size - this.size)], file.name, file);
          this.size = file.size;
          if (this.position > file.size) {
            this.position = file.size;
          }
          this.file = file;
          return;
        } else {
          throw new SyntaxError("truncate requires a size argument");
        }
      }
    }
    chunk = new Blob([chunk]);
    let blob = this.file;
    const head = blob.slice(0, this.position);
    const tail = blob.slice(this.position + chunk.size);
    let padding = this.position - head.size;
    if (padding < 0) {
      padding = 0;
    }
    blob = new File([head, new Uint8Array(padding), chunk, tail], blob.name);
    this.size = blob.size;
    this.position += chunk.size;
    this.file = blob;
  }
  async close() {
    return new Promise((resolve, reject) => {
      const [tx, table] = store(this.db);
      const tableKeyValue = table.get(this.id);
      tableKeyValue.onsuccess = (evt) => {
        if (evt) {
          tableKeyValue.result ? table.put(this.file, this.id) : reject(new NotFoundError());
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = reject;
      tx.onabort = reject;
    });
  }
  async abort() {
    indexedDBDebug("abort");
  }
};
var FileHandle = class {
  constructor(db, id, name) {
    this._db = db;
    this._id = id;
    this.name = name;
    this.kind = "file";
    this.readable = true;
    this.writable = true;
    this.path = "";
  }
  path;
  _db;
  _id;
  name;
  kind;
  readable;
  writable;
  async isSameEntry(other) {
    return this._id === other._id;
  }
  async getFile() {
    const file = await new Promise((resolve, reject) => {
      const req = store(this._db)[1].get(this._id);
      req.onsuccess = (evt) => resolve(req.result);
      req.onerror = (evt) => reject(req.error);
    });
    if (!file)
      throw new NotFoundError();
    return file;
  }
  async createWritable(opts) {
    let file = await this.getFile();
    file = opts.keepExistingData ? file : new File([], this.name);
    return new Sink2(this, file);
  }
};
function store(db) {
  const tx = db.transaction("entries", "readwrite");
  return [tx, tx.objectStore("entries")];
}
function rimraf(evt, toDelete, recursive = true) {
  const { source, result } = evt.target;
  for (const [id, isFile] of Object.values(toDelete || result)) {
    if (isFile)
      source.delete(id);
    else if (recursive) {
      source.get(id).onsuccess = rimraf;
      source.delete(id);
    } else {
      source.get(id).onsuccess = (evt2) => {
        if (Object.keys(evt2.target.result).length !== 0) {
          evt2.target.transaction.abort();
        } else {
          source.delete(id);
        }
      };
    }
  }
}
var FolderHandle = class {
  constructor(db, id, name) {
    this._db = db;
    this._id = id;
    this.kind = "directory";
    this.name = name;
    this.readable = true;
    this.writable = true;
    this.path = "";
    this._cachedEntries = {};
  }
  path;
  _db;
  _id;
  kind;
  name;
  readable;
  writable;
  _cachedEntries;
  _rootFolderHandle;
  async *entries() {
    const req = store(this._db)[1].get(this._id);
    await new Promise((rs, rj) => {
      req.onsuccess = () => rs();
      req.onerror = () => rj(req.error);
    });
    const entries = req.result;
    if (!entries)
      throw new NotFoundError();
    for (const [name, [id, isFile, isExternal]] of Object.entries(entries)) {
      if (isFile) {
        yield [name, new FileHandle(this._db, id, name)];
      } else if (isExternal) {
        const extHandle = await this.getExternalFolderHandle(name, id, isFile, isExternal);
        yield [name, extHandle];
      } else {
        const fh = new FolderHandle(this._db, id, name);
        fh._rootFolderHandle = this._rootFolderHandle;
        yield [name, fh];
      }
    }
  }
  isSameEntry(other) {
    return this._id === other._id;
  }
  async getDirectoryHandle(name, options) {
    return new Promise((resolve, reject) => {
      const table = store(this._db)[1];
      const req = table.get(this._id);
      let do_create = false;
      if (options) {
        if (options.create) {
          do_create = options.create;
        }
      }
      req.onsuccess = () => {
        const entries = req.result;
        const entry = entries[name];
        entry ? entry[1] ? reject(new TypeMismatchError()) : resolve(this.getExternalFolderHandle(name, entry[0], entry[1], entry[2])) : do_create ? table.add({}).onsuccess = (evt) => {
          const target = evt.target;
          const id = target.result;
          entries[name] = [id, false];
          table.put(entries, this._id).onsuccess = () => {
            const fh = new FolderHandle(this._db, id, name);
            fh._rootFolderHandle = this._rootFolderHandle;
            resolve(fh);
          };
        } : reject(new NotFoundError());
      };
    });
  }
  async getExternalFolderHandle(name, id, isFile, isExternal) {
    const cachedEntry = this._cachedEntries[name];
    if (cachedEntry) {
      return cachedEntry;
    } else {
      let ret;
      if (isFile) {
        throw new TypeMismatchError();
      } else if (isExternal) {
        const handeRetrieved = new Promise((resolve, reject) => {
          const req = store(this._db)[1].get(id);
          req.onsuccess = (evt) => resolve(req.result);
          req.onerror = (evt) => reject(req.error);
        });
        if (!handeRetrieved)
          throw new NotFoundError();
        let extHandleDirectoryHandle = await handeRetrieved;
        if (extHandleDirectoryHandle.adapter) {
          extHandleDirectoryHandle = extHandleDirectoryHandle.adapter;
        }
        if (extHandleDirectoryHandle.url) {
          const secStore = await this.loadSecurityStore();
          const url = extHandleDirectoryHandle.url;
          const extHandleDirectoryHandleFSDir = await getDirectoryHandleByURL(url, secStore);
          extHandleDirectoryHandle = extHandleDirectoryHandleFSDir;
        }
        const extHandle = extHandleDirectoryHandle;
        this.verifyPermission(extHandleDirectoryHandle, true);
        ret = extHandle;
      } else {
        ret = new FolderHandle(this._db, id, name);
        ret._rootFolderHandle = this._rootFolderHandle;
      }
      this._cachedEntries[name] = ret;
      return ret;
    }
  }
  async verifyPermission(fileHandle, withWrite = true) {
    const opts = {
      mode: "read"
    };
    if (withWrite) {
      opts.mode = "readwrite";
    }
    if (fileHandle.queryPermission) {
      if (await fileHandle.queryPermission(opts) === "granted") {
        return true;
      }
    } else {
      console.warn("fileHandle.queryPermission does not exist on ", fileHandle);
    }
    if (fileHandle.requestPermission) {
      if (await fileHandle.requestPermission(opts) === "granted") {
        return true;
      }
      console.warn("fileHandle.requestPermission does not exist on ", fileHandle);
    }
    return false;
  }
  async getFileHandle(name, options) {
    indexedDBDebug(`indexeddb.getFileHandle name: ${name}`);
    return new Promise((resolve, reject) => {
      const table = store(this._db)[1];
      const query = table.get(this._id);
      let do_create = false;
      if (options) {
        if (options.create) {
          do_create = options.create;
        }
      }
      query.onsuccess = () => {
        const entries = query.result;
        const entry = entries[name];
        if (entry && entry[1])
          resolve(new FileHandle(this._db, entry[0], name));
        if (entry && !entry[1])
          reject(new TypeMismatchError());
        if (!entry && !do_create)
          reject(new NotFoundError());
        if (!entry && do_create) {
          const q = table.put(new File([], name));
          q.onsuccess = () => {
            const id = q.result;
            entries[name] = [id, true];
            const query2 = table.put(entries, this._id);
            query2.onsuccess = () => {
              resolve(new FileHandle(this._db, id, name));
            };
          };
        }
      };
    });
  }
  async removeEntry(name, opts) {
    return new Promise((resolve, reject) => {
      const [tx, table] = store(this._db);
      const cwdQ = table.get(this._id);
      cwdQ.onsuccess = (evt) => {
        const cwd = cwdQ.result;
        const toDelete = { _: cwd[name] };
        const toDeleteFileOrFolderUnknown = toDelete;
        const toDeleteFileOrFolder = toDeleteFileOrFolderUnknown;
        if (!toDelete._) {
          return reject(new NotFoundError());
        }
        delete cwd[name];
        table.put(cwd, this._id);
        rimraf(evt, toDeleteFileOrFolder, !!opts.recursive);
      };
      tx.oncomplete = () => {
        delete this._cachedEntries[name];
        resolve();
      };
      tx.onerror = reject;
      tx.onabort = () => {
        reject(new InvalidModificationError());
      };
    });
  }
  async insertHandle(handle) {
    const name = handle.name;
    const create = true;
    return new Promise((resolve, reject) => {
      const table = store(this._db)[1];
      const req = table.get(this._id);
      req.onsuccess = () => {
        const entries = req.result;
        const entry = entries[name];
        entry ? entry[1] ? reject(new TypeMismatchError()) : resolve(handle) : create ? table.add(handle).onsuccess = (evt) => {
          const target = evt.target;
          const id = target.result;
          const isFile = false;
          const isExternal = true;
          entries[name] = [id, isFile, isExternal];
          table.put(entries, this._id).onsuccess = () => resolve(handle);
        } : reject(new NotFoundError());
      };
    });
  }
  async loadSecurityStore() {
    let ret = {};
    try {
      indexedDBDebug("loadSecurityStore: begin ");
      const rootHandle = await this.getRootFolderHandle();
      const keystorePath = "/var/keystore.yaml";
      indexedDBDebug("loadSecurityStore: before openFile");
      const f = await rootHandle.openFile(keystorePath);
      indexedDBDebug("loadSecurityStore: f: ", f);
      const dec = new TextDecoder();
      const yamlString = dec.decode(await f.arrayBuffer());
      indexedDBDebug(`loadSecurityStore: yamlString: ${yamlString}`);
      ret = js_yaml_default.load(yamlString);
    } catch (error) {
      console.warn("loadSecurityStore: error:", error);
    }
    return ret;
  }
  async openFile(subPath) {
    const thisAsFHandle = this;
    const fh = await openFileHandle(new NFileSystemDirectoryHandle(thisAsFHandle), subPath);
    const f = await fh.getFile();
    return f;
  }
  async getRootFolderHandle() {
    return new Promise((resolve) => {
      if (this._rootFolderHandle) {
        resolve(this._rootFolderHandle);
      } else {
        const request = indexedDB.open("fileSystem");
        request.onsuccess = () => {
          resolve(new FolderHandle(request.result, 1, ""));
        };
      }
    });
  }
};
var indexeddb_default = (opts = { persistent: false }) => new Promise((resolve) => {
  const request = indexedDB.open("fileSystem");
  request.onupgradeneeded = () => {
    const db = request.result;
    db.createObjectStore("entries", {
      autoIncrement: true
    }).transaction.oncomplete = (evt) => {
      db.transaction("entries", "readwrite").objectStore("entries").add({});
    };
  };
  request.onsuccess = () => {
    const rootFolderHandle = new FolderHandle(request.result, 1, "");
    rootFolderHandle._rootFolderHandle = rootFolderHandle;
    resolve(rootFolderHandle);
  };
});
var Sink3 = class extends DefaultSink {
  constructor(fileHandle) {
    super(fileHandle);
    this.fileHandle = fileHandle;
    this.file = fileHandle.file;
    this.size = fileHandle.file.size;
    this.position = 0;
  }
  fileHandle;
  file;
  size;
  position;
  async abort() {
    await this.close();
  }
  async write(chunk) {
    let file = this.file;
    if (typeof chunk === "object") {
      if (chunk.type === "write") {
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          this.position = chunk.position;
          if (this.size < chunk.position) {
            this.file = new File([this.file, new ArrayBuffer(chunk.position - this.size)], this.file.name, this.file);
          }
        }
        if (!("data" in chunk)) {
          throw new SyntaxError("write requires a data argument");
        }
        chunk = chunk.data;
      } else if (chunk.type === "seek") {
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          if (this.size < chunk.position) {
            throw new InvalidStateError();
          }
          this.position = chunk.position;
          return;
        } else {
          throw new SyntaxError("seek requires a position argument");
        }
      } else if (chunk.type === "truncate") {
        if (Number.isInteger(chunk.size) && chunk.size >= 0) {
          file = chunk.size < this.size ? new File([file.slice(0, chunk.size)], file.name, file) : new File([file, new Uint8Array(chunk.size - this.size)], file.name);
          this.size = file.size;
          if (this.position > file.size) {
            this.position = file.size;
          }
          this.file = file;
          return;
        } else {
          throw new SyntaxError("truncate requires a size argument");
        }
      }
    }
    chunk = new Blob([chunk]);
    let blob = this.file;
    const head = blob.slice(0, this.position);
    const tail = blob.slice(this.position + chunk.size);
    let padding = this.position - head.size;
    if (padding < 0) {
      padding = 0;
    }
    blob = new File([head, new Uint8Array(padding), chunk, tail], blob.name);
    this.size = blob.size;
    this.position += chunk.size;
    this.file = blob;
  }
  async close() {
    if (this.fileHandle.deleted)
      throw new NotFoundError();
    this.fileHandle.file = this.file;
    this.file = this.position = this.size = null;
  }
};
var FileHandle2 = class {
  constructor(name = "", file = new File([], name), writable = true) {
    this.file = file;
    this.name = name;
    this.deleted = false;
    this.writable = writable;
    this.readable = true;
  }
  deleted;
  file;
  name;
  readable;
  writable;
  path = "";
  kind = "file";
  async getFile() {
    if (this.deleted)
      throw new NotFoundError();
    return this.file;
  }
  async createWritable() {
    if (!this.writable)
      throw new NotAllowedError();
    if (this.deleted)
      throw new NotFoundError();
    return new Sink3(this);
  }
  async isSameEntry(other) {
    return this === other;
  }
  destroy() {
    this.deleted = true;
    this.file = null;
  }
};
var FolderHandle2 = class {
  constructor(name, writable = true) {
    this.name = name;
    this.deleted = false;
    this._entries = {};
    this.writable = writable;
    this.readable = true;
  }
  _entries;
  name;
  deleted;
  readable;
  writable;
  kind = "directory";
  path = "";
  async *entries() {
    if (this.deleted)
      throw new NotFoundError();
    yield* Object.entries(this._entries);
  }
  async insertHandle(handle) {
    return new Promise((resolve, _reject) => {
      const subDir = handle.name;
      const subHandle = handle;
      this._entries[subDir] = subHandle;
      const fsHandle = subHandle;
      resolve(fsHandle);
    });
  }
  isSameEntry(other) {
    return this === other;
  }
  async getDirectoryHandle(name, options = {}) {
    if (this.deleted)
      throw new NotFoundError();
    const entry = this._entries[name];
    if (entry) {
      if (entry instanceof FileHandle2) {
        throw new TypeMismatchError();
      } else {
        return entry;
      }
    } else {
      if (options.create) {
        return this._entries[name] = new FolderHandle2(name);
      } else {
        throw new NotFoundError();
      }
    }
  }
  async getFileHandle(name, options) {
    let do_create = false;
    if (options) {
      if (options.create) {
        do_create = options.create;
      }
    }
    const entry = this._entries[name];
    const isFile = entry instanceof FileHandle2;
    if (entry && isFile)
      return entry;
    if (entry && !isFile)
      throw new TypeMismatchError();
    if (!entry && !do_create)
      throw new NotFoundError();
    if (!entry && do_create) {
      return this._entries[name] = new FileHandle2(name);
    } else {
      return void 0;
    }
  }
  async removeEntry(name, opts) {
    const entry = this._entries[name];
    if (!entry)
      throw new NotFoundError();
    entry.destroy(opts.recursive);
    delete this._entries[name];
  }
  destroy(recursive) {
    for (const x of Object.values(this._entries)) {
      if (!recursive)
        throw new InvalidModificationError();
      x.destroy(recursive);
    }
    this._entries = {};
    this.deleted = true;
  }
};
var memory_default = (_path) => new FolderHandle2("");
async function getDirectoryHandleByURL(url, secretStore) {
  const pUrl = (0, import_parse_url.default)(url, false);
  const protocol = pUrl.protocol;
  if (protocol == "github") {
    const adapterHandle = github_default(url, secretStore);
    const ret = new NFileSystemDirectoryHandle(adapterHandle);
    return ret;
  } else if (protocol == "indexeddb") {
    const adapterHandle = await indexeddb_default();
    return new NFileSystemDirectoryHandle(adapterHandle);
  } else if (protocol == "memory") {
    const adapterHandle = memory_default("");
    return new NFileSystemDirectoryHandle(adapterHandle);
  }
  throw new Error(`url not handled: ${url}`);
}
var _NFileSystemDirectoryHandle = class extends NFileSystemHandle {
  constructor(adapter, secretStore) {
    super(adapter);
    this.adapter = adapter;
    this.isFile = false;
    this.isDirectory = true;
    this.secretStore = secretStore;
    this._externalHandleCache = {};
  }
  secretStore;
  _externalHandleCache;
  getFile;
  getDirectory;
  getEntries;
  isFile;
  isDirectory;
  kind = "directory";
  async getDirectoryHandle(name, options) {
    if (name === "")
      throw new TypeError(`Name can't be an empty string.`);
    if (name === "." || name === ".." || name.includes("/"))
      throw new TypeError(`Name contains invalid characters.`);
    try {
      const f = new _NFileSystemDirectoryHandle(await this.adapter.getDirectoryHandle(name, options), this.secretStore);
      return f;
    } catch (error) {
      const newName = `${name}${_NFileSystemDirectoryHandle.LINK_SUFFIX}`;
      try {
        const f = await this.getExternalHandle(newName);
        if (f.kind === "directory") {
          return f;
        } else {
          throw error;
        }
      } catch (error2) {
      }
      throw error;
    }
  }
  async *entries() {
    this.fsDebug("entries: for :", this.adapter);
    for await (const [, entry] of this.adapter.entries()) {
      const entryName = entry.name;
      if (entryName.endsWith(_NFileSystemDirectoryHandle.LINK_SUFFIX)) {
        const newEntry = await this.getExternalHandle(entryName);
        const newEntryName = newEntry.name;
        yield [
          newEntryName,
          newEntry.kind === "file" ? new NFileSystemFileHandle(newEntry) : new _NFileSystemDirectoryHandle(newEntry, this.secretStore)
        ];
      } else {
        yield [
          entryName,
          entry.kind === "file" ? new NFileSystemFileHandle(entry) : new _NFileSystemDirectoryHandle(entry, this.secretStore)
        ];
      }
    }
  }
  async *values() {
    this.fsDebug("values: for :", this.adapter);
    for await (const [, entry] of this.adapter.entries()) {
      const entryName = entry.name;
      if (entryName.endsWith(_NFileSystemDirectoryHandle.LINK_SUFFIX)) {
        const newEntry = await this.getExternalHandle(entryName);
        yield newEntry.kind === "file" ? new NFileSystemFileHandle(newEntry) : new _NFileSystemDirectoryHandle(newEntry, this.secretStore);
      } else {
        yield entry.kind === "file" ? new NFileSystemFileHandle(entry) : new _NFileSystemDirectoryHandle(entry, this.secretStore);
      }
    }
  }
  async *keys() {
    for await (const [name, _] of this.adapter.entries()) {
      if (name.endsWith(_NFileSystemDirectoryHandle.LINK_SUFFIX)) {
        const newName = name.replace(_NFileSystemDirectoryHandle.LINK_SUFFIX, "");
        yield newName;
      } else {
        yield name;
      }
    }
  }
  async getFileHandle(name, options = { create: false }) {
    if (name === "")
      throw new TypeError(`Name can't be an empty string.`);
    if (name === "." || name === ".." || name.includes("/"))
      throw new TypeError(`Name contains invalid characters.`);
    try {
      const f = new NFileSystemFileHandle(await this.adapter.getFileHandle(name, options));
      return f;
    } catch (error) {
      const newName = `${name}${_NFileSystemDirectoryHandle.LINK_SUFFIX}`;
      try {
        const f = await this.getExternalHandle(newName);
        if (f.kind === "file") {
          return f;
        } else {
          throw new TypeMismatchError();
        }
      } catch (error2) {
      }
      throw error;
    }
  }
  async removeEntry(name, options = { recursive: false }) {
    if (name === "")
      throw new TypeError(`Name can't be an empty string.`);
    if (name === "." || name === ".." || name.includes("/"))
      throw new TypeError(`Name contains invalid characters.`);
    return this.adapter.removeEntry(name, options);
  }
  async resolve(possibleDescendant) {
    if (this.adapter.resolve) {
      return this.adapter.resolve(possibleDescendant);
    } else {
      if (await possibleDescendant.isSameEntry(this)) {
        return [];
      }
      const paths = [];
      const handle = this;
      const openSet = [{ handle, path: paths }];
      while (openSet.length) {
        const currentSet = openSet.pop();
        const current = currentSet?.handle;
        const path = currentSet?.path;
        if (current && path) {
          if (current instanceof _NFileSystemDirectoryHandle) {
            const curdir = current;
            for await (const entry of curdir.values()) {
              if (await entry.isSameEntry(possibleDescendant)) {
                return [...path, entry.name];
              }
              if (entry.kind === "directory") {
                openSet.push({ handle: entry, path: [...path, entry.name] });
              }
            }
          }
        }
      }
      return null;
    }
  }
  [Symbol.asyncIterator]() {
    return this.entries();
  }
  get [Symbol.toStringTag]() {
    return "FileSystemDirectoryHandle";
  }
  async insertHandle(handle) {
    if (this.adapter.insertHandle) {
      return this.adapter.insertHandle(handle);
    } else {
      const serializedHandle = JSON.stringify(handle);
      const fileName = handle.name;
      const fileNameWithSuffix = `${fileName}${_NFileSystemDirectoryHandle.LINK_SUFFIX}`;
      const newFh = await this.adapter.getFileHandle(fileNameWithSuffix, {
        create: true
      });
      const keepExistingData = false;
      const writer = await newFh.createWritable({
        keepExistingData
      });
      const chunk = serializedHandle;
      writer.write(chunk);
      writer.close();
      return handle;
    }
  }
  async getExternalHandle(fileName) {
    let returnFh = this._externalHandleCache[fileName];
    if (returnFh) {
      return returnFh;
    } else {
      const newFh = await this.adapter.getFileHandle(fileName);
      const file = await newFh.getFile();
      const ab = await file.arrayBuffer();
      const str2 = new TextDecoder().decode(ab);
      const obj = JSON.parse(str2);
      returnFh = obj;
      let returnFhAny = returnFh;
      if (returnFhAny.adapter) {
        returnFh = returnFhAny.adapter;
        returnFhAny = returnFh;
      }
      if (returnFhAny.url) {
        const secretStore = this.secretStore;
        returnFh = await getDirectoryHandleByURL(returnFhAny.url, secretStore);
      }
      this._externalHandleCache[fileName] = returnFh;
      if (returnFh.kind === "file") {
        return returnFh;
      } else {
        return returnFh;
      }
    }
  }
};
var NFileSystemDirectoryHandle = _NFileSystemDirectoryHandle;
__publicField(NFileSystemDirectoryHandle, "LINK_SUFFIX", ".link");
async function getOriginPrivateDirectory(driver, path = "") {
  return new NFileSystemDirectoryHandle(await driver(path));
}

// ../../packages/wasi-js/dist/fileSystem.js
globalThis.WASI_FS_DEBUG = false;
function filesystemDebug(msg, ...optionalParams) {
  if (globalThis.WASI_FS_DEBUG) {
    console.debug(msg, optionalParams);
  }
}
var OpenDirectory = class {
  path;
  _handle;
  isFile;
  constructor(path, _handle, isFile = false) {
    this.path = path;
    this._handle = _handle;
    this.isFile = isFile;
  }
  _currentIter = void 0;
  asFile() {
    throw new SystemError(E.ISDIR);
  }
  asDir() {
    return this;
  }
  getEntries(start = 0) {
    filesystemDebug("[getEntries]");
    if (this._currentIter?.pos !== start) {
      this._currentIter = {
        pos: 0,
        reverted: void 0,
        iter: this._handle.values()
      };
    } else {
      start = 0;
    }
    const currentIter = this._currentIter;
    return {
      next: async () => {
        for (; start; start--) {
          await currentIter.iter.next();
        }
        const { reverted } = currentIter;
        if (reverted) {
          currentIter.reverted = void 0;
          currentIter.pos++;
          return {
            value: reverted,
            done: false
          };
        }
        const res = await currentIter.iter.next();
        if (!res.done) {
          currentIter.pos++;
        }
        return res;
      },
      revert: (handle) => {
        if (currentIter.reverted || currentIter.pos === 0) {
          throw new Error("Cannot revert a handle in the current state.");
        }
        currentIter.pos--;
        currentIter.reverted = handle;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  async getFileOrDir(path, mode, openFlags = 0) {
    filesystemDebug(`[getFileOrDir] path: ${path} mode: ${mode} openFlags: ${openFlags}`);
    const { parent, name: maybeName } = await this._resolve(path);
    if (maybeName === void 0) {
      if (mode & 2) {
        if (openFlags & (1 | 4)) {
          throw new SystemError(E.EXIST);
        }
        if (openFlags & 8) {
          throw new SystemError(E.ISDIR);
        }
        return parent;
      } else {
        throw new SystemError(E.ISDIR);
      }
    }
    const name = maybeName;
    if (openFlags & 2) {
      if (mode & 2) {
        mode = 2;
      } else {
        throw new TypeError(`Open flags ${openFlags} require a directory but mode ${mode} doesn't allow it.`);
      }
    }
    let handle;
    if (openFlags & 1) {
      if (openFlags & 4) {
        let exists = true;
        try {
          await this.openWithCreate(name, false, mode, parent);
        } catch {
          exists = false;
        }
        if (exists) {
          throw new SystemError(E.EXIST);
        }
      }
      handle = await this.openWithCreate(name, true, mode, parent);
    } else {
      handle = await this.openWithCreate(name, false, mode, parent);
    }
    if (openFlags & 8) {
      if (handle.isDirectory || handle.kind === "directory") {
        throw new SystemError(E.ISDIR);
      }
      const writable = await handle.createWritable({
        keepExistingData: false
      });
      await writable.close();
    }
    return handle;
  }
  async openWithCreate(name, create, mode, parent) {
    const parentName = parent.name;
    if (mode & 1) {
      try {
        filesystemDebug(`[openWithCreate]: trying: getFileHandle on parent: ${parentName} child: ${name} mode: ${mode}`);
        return await parent.getFileHandle(name, { create });
      } catch (err) {
        filesystemDebug("openWithCreate err: ", err);
        if (err.name === "TypeMismatchError" || err.name === "TypeError") {
          if (!(mode & 2)) {
            throw new SystemError(E.ISDIR, true);
          }
        } else if (!(mode == 3)) {
          throw new SystemError(E.NOENT);
        }
      }
    }
    try {
      filesystemDebug(`[openWithCreate]: trying: getDirectoryHandle on parent: ${parentName} child: ${name} mode: ${mode}`);
      return await parent.getDirectoryHandle(name, { create });
    } catch (err) {
      if (err.name === "TypeMismatchError") {
        throw new SystemError(E.NOTDIR, true);
      } else {
        throw err;
      }
    }
  }
  async delete(path) {
    filesystemDebug("[delete]");
    const { parent, name } = await this._resolve(path);
    if (!name) {
      throw new SystemError(E.ACCES);
    }
    await parent.removeEntry(name);
  }
  close() {
  }
  async _resolve(path) {
    filesystemDebug(`[_resolve] path: ${path}`);
    const parts = path ? path.split("/") : [];
    const resolvedParts = [];
    for (const item of parts) {
      if (item === "..") {
        if (resolvedParts.pop() === void 0) {
          throw new SystemError(E.NOTCAPABLE);
        }
      } else if (item !== ".") {
        if (item !== "") {
          resolvedParts.push(item);
        }
      }
    }
    const name = resolvedParts.pop();
    let parent = this._handle;
    for (const item of resolvedParts) {
      parent = await parent.getDirectoryHandle(item);
    }
    return {
      parent,
      name
    };
  }
};
var OpenFile = class {
  path;
  _handle;
  _fsFlags;
  isFile;
  constructor(path, _handle, _fsFlags = 0, isFile = true) {
    this.path = path;
    this._handle = _handle;
    this._fsFlags = _fsFlags;
    this.isFile = isFile;
  }
  position = 0;
  _writer = void 0;
  async getFile() {
    filesystemDebug("[getfile]");
    return this._handle.getFile();
  }
  async setSize(size) {
    filesystemDebug("[setSize]");
    const writer = await this._getWriter();
    await writer.truncate(size);
  }
  async read(len) {
    filesystemDebug(`[read] len: ${len}`);
    const file = await this.getFile();
    const slice = file.slice(this.position, this.position + len);
    const arrayBuffer = await slice.arrayBuffer();
    this.position += arrayBuffer.byteLength;
    return new Uint8Array(arrayBuffer);
  }
  async write(data) {
    filesystemDebug("[write]");
    const writer = await this._getWriter();
    if (this._fsFlags & 1) {
      const f = await this.getFile();
      this.position = f.size;
    }
    await writer.write({ type: "write", position: this.position, data });
    this.position += data.length;
  }
  async flush() {
    filesystemDebug("[flush]");
    if (!this._writer)
      return;
    await this._writer.close();
    this._writer = void 0;
  }
  asFile() {
    return this;
  }
  asDir() {
    throw new SystemError(E.NOTDIR);
  }
  close() {
    return this.flush();
  }
  setFdFlags(fdFlags) {
    this._fsFlags = fdFlags;
  }
  async _getWriter() {
    return this._writer || (this._writer = await this._handle.createWritable({
      keepExistingData: true
    }));
  }
};
var FIRST_PREOPEN_FD = 3;
var OpenFiles = class {
  constructor(preOpen) {
    filesystemDebug("[preOpen]", preOpen);
    for (const path in preOpen) {
      this._add(path, preOpen[path]);
    }
    this._firstNonPreopenFd = this._nextFd;
  }
  _files = /* @__PURE__ */ new Map();
  _nextFd = FIRST_PREOPEN_FD;
  _firstNonPreopenFd;
  getPreOpen(fd) {
    filesystemDebug(`[getpreopen fd: ${fd}]`);
    if (fd >= FIRST_PREOPEN_FD && fd < this._firstNonPreopenFd) {
      return this.get(fd);
    } else {
      throw new SystemError(E.BADF, true);
    }
  }
  async open(preOpen, path, openFlags, fsFlags) {
    filesystemDebug(`[open] path: ${path} openFlags: ${openFlags} fsFlags: ${fsFlags}`);
    let prefix = "";
    if (preOpen.path != "/") {
      prefix = preOpen.path;
    }
    return this._add(`${prefix}/${path}`, await preOpen.getFileOrDir(path, 3, openFlags), fsFlags);
  }
  get(fd) {
    filesystemDebug(`[get] fd: ${fd}`);
    const openFile = this._files.get(fd);
    if (!openFile) {
      throw new SystemError(E.BADF);
    }
    return openFile;
  }
  async renumber(from, to) {
    filesystemDebug("[renumber]");
    await this.close(to);
    this._files.set(to, this._take(from));
  }
  async close(fd) {
    filesystemDebug("[close]");
    await this._take(fd).close();
  }
  addPreopenedDir(path, handle) {
    this._nextFd = this._add(path, handle);
    this._firstNonPreopenFd = this._nextFd;
  }
  async mountHandleOnRoot(handle, subDir = handle.name) {
    return this.mountHandleOnPath(handle, "/", subDir);
  }
  async mountHandleOnPath(handle, destPath, subDir = handle.name) {
    if (subDir != handle.name) {
      handle.name = subDir;
    }
    const rootFd = FIRST_PREOPEN_FD;
    const rootDirOpenFile = this._files.get(rootFd);
    filesystemDebug(`mountHandleOnPath destPath: ${destPath} rootDirOpenFile: `, rootDirOpenFile);
    const rootDir = rootDirOpenFile?.asDir();
    filesystemDebug(`mountHandleOnPath destPath: ${destPath} rootDirOpenFile: `, rootDir);
    if (rootDir) {
      const rootDirHandle = rootDir._handle;
      filesystemDebug("mountHandleOnPath rootDirDirHandle: ", rootDirHandle);
      let dirHandleToMountOn = rootDirHandle;
      if (destPath != "/") {
        dirHandleToMountOn = await openDirectoryHandle(rootDirHandle, destPath);
      }
      if (dirHandleToMountOn.insertHandle) {
        dirHandleToMountOn.insertHandle(handle);
      } else {
        console.warn("Could not mount subdirectory on root: ", handle);
      }
    }
  }
  _add(path, handle, fsFlags) {
    filesystemDebug("[_add]", path);
    this._files.set(this._nextFd, handle.kind === "file" ? new OpenFile(path, handle, fsFlags) : new OpenDirectory(path, handle));
    return this._nextFd++;
  }
  _take(fd) {
    filesystemDebug("[_take]");
    const handle = this.get(fd);
    this._files.delete(fd);
    return handle;
  }
  findRelPath(path) {
    filesystemDebug("[findRelPath]");
    function prefixMatches(prefix, path2) {
      if (path2[0] != "/" && !prefix) {
        return true;
      }
      if (!path2.startsWith(prefix)) {
        return false;
      }
      let i2 = prefix.length;
      while (i2 > 0 && prefix[i2 - 1] == "/") {
        --i2;
      }
      const last = path2[i2];
      return last === "/" || !last;
    }
    let matchLen = 0;
    let foundPre;
    for (let i2 = this._firstNonPreopenFd - 1; i2 >= FIRST_PREOPEN_FD; --i2) {
      const pre = this.get(i2);
      let prefix = pre.path;
      if (path !== "." && !path.startsWith("./")) {
        if (prefix.startsWith("./")) {
          prefix = prefix.slice(2);
        } else if (prefix === ".") {
          prefix = prefix.slice(1);
        }
      }
      if ((!foundPre || prefix.length > matchLen) && prefixMatches(prefix, path)) {
        foundPre = pre;
        matchLen = prefix.length;
      }
    }
    if (!foundPre) {
      throw new Error(`Couldn't resolve the given path via preopened directories.`);
    }
    let computed = path.slice(matchLen);
    computed = computed.replace(/^\/+/, "");
    computed = computed || ".";
    return {
      preOpen: foundPre,
      relativePath: computed
    };
  }
};

// ../../packages/wasi-js/dist/asyncify.js
var DATA_ADDR = 16;
var DATA_START = DATA_ADDR + 8;
var DATA_END = 65536;
var ASYNCIFY_DEBUG = false;
function asyncifyDebug(msg, ...optionalParams) {
  if (ASYNCIFY_DEBUG) {
    console.debug(msg, optionalParams);
  }
}
var WRAPPED_EXPORTS = /* @__PURE__ */ new WeakMap();
var State2 = {
  None: 0,
  Unwinding: 1,
  Rewinding: 2
};
function isPromise(obj) {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
function proxyGet(obj, transform) {
  return new Proxy(obj, {
    get: (obj2, name) => transform(obj2[name])
  });
}
var Asyncify = class {
  constructor() {
    this.value = void 0;
    this.exports = null;
  }
  value;
  exports;
  getState() {
    return this.exports.asyncify_get_state();
  }
  assertNoneState() {
    const state = this.getState();
    if (state !== State2.None) {
      throw new Error(`Invalid async state ${state}, expected 0.`);
    }
  }
  wrapImportFn(fn) {
    return (...args) => {
      if (this.getState() === State2.Rewinding) {
        this.exports.asyncify_stop_rewind();
        return this.value;
      }
      this.assertNoneState();
      const value = fn(...args);
      if (!isPromise(value)) {
        return value;
      }
      this.exports.asyncify_start_unwind(DATA_ADDR);
      this.value = value;
    };
  }
  wrapModuleImports(module) {
    return proxyGet(module, (value) => {
      if (typeof value === "function") {
        return this.wrapImportFn(value);
      }
      return value;
    });
  }
  wrapImports(imports) {
    if (imports === void 0)
      return;
    return proxyGet(imports, (moduleImports = /* @__PURE__ */ Object.create(null)) => this.wrapModuleImports(moduleImports));
  }
  wrapExportFn(fn) {
    let newExport = WRAPPED_EXPORTS.get(fn);
    if (newExport !== void 0) {
      return newExport;
    }
    newExport = async (...args) => {
      this.assertNoneState();
      let result = fn(...args);
      while (this.getState() === State2.Unwinding) {
        this.exports.asyncify_stop_unwind();
        this.value = await this.value;
        this.assertNoneState();
        this.exports.asyncify_start_rewind(DATA_ADDR);
        result = fn();
      }
      this.assertNoneState();
      return result;
    };
    WRAPPED_EXPORTS.set(fn, newExport);
    return newExport;
  }
  wrapExports(exports) {
    const newExports = /* @__PURE__ */ Object.create(null);
    for (const exportName in exports) {
      let value = exports[exportName];
      if (typeof value === "function" && !exportName.startsWith("asyncify_")) {
        value = this.wrapExportFn(value);
      }
      Object.defineProperty(newExports, exportName, {
        enumerable: true,
        value
      });
    }
    WRAPPED_EXPORTS.set(exports, newExports);
    return newExports;
  }
  init(instance, imports) {
    const { exports } = instance;
    const memory = exports.memory || imports.env && imports.env.memory;
    const data_end = exports.__data_end || DATA_END;
    asyncifyDebug(`asyncify: data_end: ${data_end}`);
    new Int32Array(memory.buffer, DATA_ADDR).set([DATA_START, data_end]);
    this.exports = this.wrapExports(exports);
    Object.setPrototypeOf(instance, Instance.prototype);
  }
};
var Instance = class extends WebAssembly.Instance {
  constructor(module, imports) {
    const state = new Asyncify();
    super(module, state.wrapImports(imports));
    state.init(this, imports);
  }
  get exports() {
    return WRAPPED_EXPORTS.get(super.exports);
  }
  get originalExports() {
    return super.exports;
  }
};
Object.defineProperty(Instance.prototype, "exports", { enumerable: true });
async function instantiate(source, imports) {
  const state = new Asyncify();
  const result = await WebAssembly.instantiate(source, state.wrapImports(imports));
  state.init(result, imports);
  return result;
}

// ../../packages/wasi-js/dist/wasi.js
globalThis.WASI_DEBUG = false;
globalThis.WASI_FD_DEBUG = false;
function wasiDebug(msg, ...optionalParams) {
  if (globalThis.WASI_DEBUG) {
    console.debug(msg, optionalParams);
  }
}
function wasiError(msg, ...optionalParams) {
  if (globalThis.WASI_DEBUG) {
    console.error(msg, optionalParams);
  }
}
function wasiFdDebug(msg, ...optionalParams) {
  if (globalThis.WASI_FD_DEBUG) {
    console.debug(msg, optionalParams);
  }
}
var ExitStatus = class {
  statusCode;
  constructor(statusCode) {
    this.statusCode = statusCode;
  }
};
var preopentype_t = enumer(int8_t);
var prestat_t = struct({
  type: preopentype_t,
  nameLen: size_t
});
var iovec_t = struct({
  bufPtr: uint32_t,
  bufLen: size_t
});
var filetype_t = enumer(uint8_t);
var fdflags_t = enumer(uint16_t);
var rights_t = uint64_t;
var fdstat_t = struct({
  filetype: filetype_t,
  flags: fdflags_t,
  rightsBase: rights_t,
  rightsInheriting: rights_t
});
var dircookie_t = uint64_t;
var inode_t = uint64_t;
var dirent_t = struct({
  next: dircookie_t,
  ino: inode_t,
  nameLen: uint32_t,
  type: filetype_t
});
var device_t = uint64_t;
var linkcount_t = uint64_t;
var filesize_t = uint64_t;
var timestamp_t = uint64_t;
var filestat_t = struct({
  dev: device_t,
  ino: inode_t,
  filetype: filetype_t,
  nlink: linkcount_t,
  size: filesize_t,
  accessTime: timestamp_t,
  modTime: timestamp_t,
  changeTime: timestamp_t
});
var clockid_t = enumer(uint32_t);
var userdata_t = uint64_t;
var eventtype_t = enumer(uint8_t);
var subclockflags_t = enumer(uint16_t);
var subscription_clock_t = struct({
  id: clockid_t,
  timeout: timestamp_t,
  precision: timestamp_t,
  flags: subclockflags_t
});
var subscription_fd_readwrite_t = struct({
  fd: fd_t
});
var subscription_union_t = taggedUnion({
  tag: eventtype_t,
  data: {
    [0]: subscription_clock_t,
    [1]: subscription_fd_readwrite_t,
    [2]: subscription_fd_readwrite_t
  }
});
var subscription_t = struct({
  userdata: userdata_t,
  union: subscription_union_t
});
var event_rw_flags_t = enumer(uint16_t);
var event_fd_readwrite_t = struct({
  nbytes: filesize_t,
  flags: event_rw_flags_t
});
var event_t = struct({
  userdata: userdata_t,
  error: enumer(uint16_t),
  type: eventtype_t,
  fd_readwrite: event_fd_readwrite_t
});
var stringOut = (writeStr) => {
  const decoder = new TextDecoder();
  return {
    write: (data) => {
      writeStr(decoder.decode(data, { stream: true }));
    }
  };
};
var lineOut = (writeLn) => {
  let lineBuf = "";
  return stringOut((chunk) => {
    lineBuf += chunk;
    const lines = lineBuf.split("\n");
    lineBuf = lines.pop();
    for (const line of lines) {
      writeLn(line);
    }
  });
};
function unimplemented(msg) {
  console.error("[unimplemented] ", msg);
  throw new SystemError(E.NOSYS);
}
function parseCStringArray(cStringArray) {
  if (cStringArray == "") {
    const s = [];
    return s;
  } else {
    const s = cStringArray.split("\0");
    return s;
  }
}
var StringCollection = class {
  constructor(strings) {
    this._offsets = new Uint32Array(strings.length);
    this._buffer = "";
    for (const [i2, s] of strings.entries()) {
      this._offsets[i2] = this._buffer.length;
      this._buffer += `${s}\0`;
    }
  }
  _offsets;
  _buffer;
  sizes_get(buf, countPtr, sizePtr) {
    size_t.set(buf, countPtr, this._offsets.length);
    size_t.set(buf, sizePtr, this._buffer.length);
  }
  get(buf, offsetsPtr, ptr) {
    new Uint32Array(buf, offsetsPtr, this._offsets.length).set(this._offsets.map((offset) => ptr + offset));
    string.set(buf, ptr, this._buffer);
  }
};
var WASI = class {
  constructor({ openFiles, stdin = { read: () => new Uint8Array() }, stdout = lineOut(console.log), stderr = lineOut(console.error), args = [], env = {}, abortSignal, tty }) {
    this._openFiles = openFiles;
    this._stdIn = stdin;
    this._stdOut = stdout;
    this._stdErr = stderr;
    this._args = new StringCollection(args);
    this._env = new StringCollection(Object.entries(env).map(([key, value]) => `${key}=${value}`));
    this._abortSignal = abortSignal;
    this._tty = tty;
  }
  memory;
  _openFiles;
  _args;
  _env;
  _stdIn;
  _stdOut;
  _stdErr;
  _abortSignal;
  _tty;
  _suspendStdIn = false;
  async run(module) {
    const mod = await instantiate(module, {
      wasi_snapshot_preview1: this.getWasiImports(),
      wasi_experimental_filesystems: this.getWasiFileSystemsImports(),
      wasi_experimental_process: this.getWasiProcessImports(),
      wasi_experimental_console: this.getWasiConsoleImports()
    });
    const exports = mod.exports;
    wasiDebug("[run] exports: ", exports);
    const originalExports = mod.originalExports;
    wasiDebug("[run] originalExports: ", originalExports);
    const { _start, memory } = exports;
    if (this._tty) {
      wasiDebug("this._tty.setModuleInstance");
      this._tty.setModuleInstanceExports(exports);
    } else {
      wasiDebug("this._tty is null");
    }
    const cols = this._tty?.columns;
    const rows = this._tty?.rows;
    this.memory = memory;
    try {
      const { term_set_columns, term_set_rows } = exports;
      if (term_set_columns) {
        wasiDebug("term_set_columns", cols);
        await term_set_columns(cols);
      }
      if (term_set_rows) {
        wasiDebug("term_set_rows", rows);
        await term_set_rows(rows);
      }
      await _start();
      return 0;
    } catch (err) {
      console.error(err);
      if (err instanceof ExitStatus) {
        return err.statusCode;
      }
      throw err;
    }
  }
  async exportFunction(module) {
    const { exports } = await instantiate(module, {
      wasi_snapshot_preview1: this.getWasiImports()
    });
    return exports;
  }
  _checkAbort() {
    if (this._abortSignal?.aborted) {
      throw new SystemError(E.CANCELED);
    }
  }
  _wait(ms) {
    return new Promise((resolve, reject) => {
      const id = setTimeout(resolve, ms);
      this._abortSignal?.addEventListener("abort", () => {
        clearTimeout(id);
        reject(new SystemError(E.CANCELED));
      });
    });
  }
  _getBuffer() {
    const { memory } = this;
    if (!memory) {
      throw new Error("Memory not yet initialised.");
    }
    return memory.buffer;
  }
  _getFileStat(file, filestatPtr) {
    let size = 0n;
    let time = 0n;
    if (file) {
      size = BigInt(file.size);
      time = BigInt(file.lastModified) * 1000000n;
    }
    const fstat = {
      dev: 0n,
      ino: 0n,
      filetype: file ? 4 : 3,
      nlink: 0n,
      size,
      accessTime: time,
      modTime: time,
      changeTime: time
    };
    wasiDebug("_getFileStat: fstat: ", fstat);
    filestat_t.set(this._getBuffer(), filestatPtr, fstat);
  }
  getWasiImports() {
    const bindings2 = {
      fd_prestat_get: (fd, prestatPtr) => {
        wasiDebug("[fd_prestat_get] fd: ", fd);
        prestat_t.set(this._getBuffer(), prestatPtr, {
          type: 0,
          nameLen: this._openFiles.getPreOpen(fd).path.length
        });
      },
      fd_prestat_dir_name: (fd, pathPtr, pathLen) => {
        wasiDebug("[fd_prestat_dir_name]");
        string.set(this._getBuffer(), pathPtr, this._openFiles.getPreOpen(fd).path, pathLen);
      },
      environ_sizes_get: (countPtr, sizePtr) => {
        wasiDebug("[environ_sizes_get]");
        return this._env.sizes_get(this._getBuffer(), countPtr, sizePtr);
      },
      environ_get: (environPtr, environBufPtr) => {
        wasiDebug("[environ_get]");
        return this._env.get(this._getBuffer(), environPtr, environBufPtr);
      },
      args_sizes_get: (argcPtr, argvBufSizePtr) => {
        wasiDebug("[args_sizes_get]");
        return this._args.sizes_get(this._getBuffer(), argcPtr, argvBufSizePtr);
      },
      args_get: (argvPtr, argvBufPtr) => {
        wasiDebug("[args_get]");
        return this._args.get(this._getBuffer(), argvPtr, argvBufPtr);
      },
      proc_exit: (code) => {
        wasiDebug("[proc_exit]");
        throw new ExitStatus(code);
      },
      random_get: (bufPtr, bufLen) => {
        wasiDebug("[random_get]");
        if (globalThis.crypto) {
          globalThis.crypto.getRandomValues(new Uint8Array(this._getBuffer(), bufPtr, bufLen));
        } else {
          const webcrypto = __require("crypto").webcrypto;
          webcrypto.getRandomValues(new Uint8Array(this._getBuffer(), bufPtr, bufLen));
        }
      },
      path_open: async (dirFd, dirFlags, pathPtr, pathLen, oFlags, _fsRightsBase, _fsRightsInheriting, fsFlags, fdPtr) => {
        const path = string.get(this._getBuffer(), pathPtr, pathLen);
        wasiDebug(`[path_open dirFd: ${dirFd}, dirFlags: ${dirFlags}, path: ${path}, fsFlags: ${fsFlags} ]`);
        if (fsFlags & 4) {
          console.warn(`Asked for non-blocking mode on path ${path} with dirFd: ${dirFd} while opening the file, falling back to blocking one.`);
          fsFlags &= ~4;
        }
        if (fsFlags & 2) {
          unimplemented("path_open FdFlags.DSync");
        } else if (fsFlags & 8) {
          unimplemented("path_open FdFlags.RSync");
        } else if (fsFlags & 16) {
          unimplemented("path_open FdFlags.Sync");
        }
        const resultFd = await this._openFiles.open(this._openFiles.getPreOpen(dirFd), path, oFlags, fsFlags);
        wasiDebug(`[path_open result: dirFd: ${dirFd}, path: ${path}, resultFd: ${resultFd} ]`);
        fd_t.set(this._getBuffer(), fdPtr, resultFd);
      },
      fd_fdstat_set_flags: (fd, fsFlags) => {
        if (fsFlags & 2) {
          unimplemented("fd_fdstat_set_flags FdFlags.DSync");
        } else if (fsFlags & 8) {
          unimplemented("fd_fdstat_set_flags FdFlags.RSync");
        } else if (fsFlags & 16) {
          unimplemented("fd_fdstat_set_flags FdFlags.Sync");
        }
        const openFileOrDir = this._openFiles.get(fd);
        const openFile = openFileOrDir.asFile();
        openFile.setFdFlags(fsFlags);
      },
      fd_close: (fd) => {
        wasiDebug("[fd_close]", fd);
        return this._openFiles.close(fd);
      },
      fd_read: async (fd, iovsPtr, iovsLen, nreadPtr) => {
        wasiFdDebug(`[fd_read] fd: ${fd} iovsLen: ${iovsLen}`);
        const input = fd === 0 ? this._stdIn : this._openFiles.get(fd).asFile();
        await this._forEachIoVec(iovsPtr, iovsLen, nreadPtr, async (buf) => {
          const bufLen = buf.length;
          wasiFdDebug(`[fd_read] _forEachIoVec bufLen: ${bufLen} input: `, input);
          const chunk = await input.read(bufLen);
          buf.set(chunk);
          return chunk.length;
        });
      },
      fd_write: async (fd, iovsPtr, iovsLen, nwrittenPtr) => {
        wasiFdDebug("[fd_write]", fd, iovsPtr, iovsLen, nwrittenPtr);
        let out;
        switch (fd) {
          case 1: {
            out = this._stdOut;
            break;
          }
          case 2: {
            out = this._stdErr;
            break;
          }
          default: {
            out = this._openFiles.get(fd).asFile();
            break;
          }
        }
        await this._forEachIoVec(iovsPtr, iovsLen, nwrittenPtr, async (data) => {
          await out.write(data);
          return data.length;
        });
      },
      fd_fdstat_get: async (fd, fdstatPtr) => {
        wasiDebug("[fd_fdstat_get]", fd, fdstatPtr);
        let filetype;
        const fdflags = 0;
        let rightsBase = -1n;
        let rightsInheriting = ~(1n << 24n);
        if (fd < FIRST_PREOPEN_FD) {
          rightsBase = BigInt(1 & 2 & 8 & 16 & 64 & 128 & 256 & 2097152 & 4194304 & 8388608 & 134217728);
          rightsInheriting = BigInt(0);
          filetype = 2;
        } else if (this._openFiles.get(fd).isFile) {
          filetype = 4;
        } else {
          filetype = 3;
        }
        fdstat_t.set(this._getBuffer(), fdstatPtr, {
          filetype,
          flags: fdflags,
          rightsBase,
          rightsInheriting
        });
      },
      path_create_directory: async (dirFd, pathPtr, pathLen) => {
        wasiDebug("[path_create_directory]");
        return this._openFiles.getPreOpen(dirFd).getFileOrDir(string.get(this._getBuffer(), pathPtr, pathLen), 2, 1 | 2 | 4).then(() => {
        });
      },
      path_rename: async (_oldDirFd, _oldPathPtr, _oldPathLen, _newDirFd, _newPathPtr, _newPathLen) => {
        wasiDebug("[path_rename]");
        return unimplemented("path_rename");
      },
      path_remove_directory: (dirFd, pathPtr, pathLen) => {
        const path = string.get(this._getBuffer(), pathPtr, pathLen);
        wasiDebug(`[path_remove_directory] dirfd: ${dirFd} path: ${path}`);
        this._openFiles.getPreOpen(dirFd).delete(path);
      },
      fd_readdir: async (fd, bufPtr, bufLen, cookie, bufUsedPtr) => {
        wasiDebug("[fd_readdir]");
        const initialBufPtr = bufPtr;
        const openDir = this._openFiles.get(fd).asDir();
        const pos = Number(cookie);
        const entries = openDir.getEntries(pos);
        for await (const handle of entries) {
          this._checkAbort();
          const { name } = handle;
          const textEncoder = new TextEncoder();
          const nameAsBytes = textEncoder.encode(name);
          const nameLen = nameAsBytes.byteLength;
          const itemSize = dirent_t.size + nameLen;
          if (bufLen < itemSize) {
            entries.revert(handle);
            break;
          }
          dirent_t.set(this._getBuffer(), bufPtr, {
            next: ++cookie,
            ino: 0n,
            nameLen,
            type: handle.kind === "file" ? 4 : 3
          });
          string.set(this._getBuffer(), bufPtr + dirent_t.size, name);
          bufPtr = bufPtr + itemSize;
          bufLen -= itemSize;
        }
        size_t.set(this._getBuffer(), bufUsedPtr, bufPtr - initialBufPtr);
      },
      path_readlink: (dirFd, pathPtr, pathLen, _bufPtr, _bufLen, _bufUsedPtr) => {
        const path = string.get(this._getBuffer(), pathPtr, pathLen);
        wasiDebug(`[path_readlink: dirFd: ${dirFd} , path: ${path}]`);
        throw new SystemError(E.INVAL);
      },
      path_filestat_get: async (dirFd, flags, pathPtr, pathLen, filestatPtr) => {
        const pathString = string.get(this._getBuffer(), pathPtr, pathLen);
        wasiDebug(`[path_filestat_get] dirFd: ${dirFd} _flags: ${flags} pathString: ${pathString} filestatPtr: ${filestatPtr}`);
        const handle = await this._openFiles.getPreOpen(dirFd).getFileOrDir(pathString, 3);
        return this._getFileStat(handle.kind === "file" ? await handle.getFile() : void 0, filestatPtr);
      },
      path_filestat_set_times: async () => {
        unimplemented();
      },
      fd_seek: async (fd, offset, whence, filesizePtr) => {
        wasiDebug(`[fd_seek fd: ${fd} offset: ${offset} whence: ${whence}]`);
        if (fd < FIRST_PREOPEN_FD) {
          wasiDebug(`[fd_seek fd: ${fd} offset: ${offset} whence: ${whence}]`);
          throw new SystemError(E.NOTCAPABLE);
        } else {
          const openFile = this._openFiles.get(fd).asFile();
          let base;
          switch (whence) {
            case 0:
              base = 0;
              break;
            case 1:
              base = openFile.position;
              break;
            case 2:
              base = (await openFile.getFile()).size;
              break;
          }
          openFile.position = base + Number(offset);
          uint64_t.set(this._getBuffer(), filesizePtr, BigInt(openFile.position));
        }
      },
      fd_tell: (fd, offsetPtr) => {
        wasiDebug(`[fd_tell fd: ${fd}]`);
        uint64_t.set(this._getBuffer(), offsetPtr, BigInt(this._openFiles.get(fd).asFile().position));
      },
      fd_filestat_get: async (fd, filestatPtr) => {
        wasiDebug(`[fd_filestat_get fd: ${fd}]`);
        if (fd == 0 || fd == 1 || fd == 2) {
          filestat_t.set(this._getBuffer(), filestatPtr, {
            dev: 0n,
            ino: 0n,
            filetype: 2,
            nlink: 0n,
            size: 0n,
            accessTime: 0n,
            modTime: 0n,
            changeTime: 0n
          });
        } else {
          const openFile = this._openFiles.get(fd);
          wasiDebug(`[fd_filestat_get fd: ${fd}] openFile: `, openFile);
          const f = openFile.isFile ? await openFile.getFile() : void 0;
          wasiDebug(`[fd_filestat_get fd: ${fd}] f: `, f);
          this._getFileStat(f, filestatPtr);
        }
      },
      path_unlink_file: (dirFd, pathPtr, pathLen) => {
        const path = string.get(this._getBuffer(), pathPtr, pathLen);
        wasiDebug(`[path_unlink_file] dirfd: ${dirFd} path: ${path}`);
        this._openFiles.getPreOpen(dirFd).delete(path);
      },
      poll_oneoff: async (subscriptionPtr, eventsPtr, subscriptionsNum, eventsNumPtr) => {
        wasiDebug("[poll_oneoff]");
        if (subscriptionsNum === 0) {
          throw new RangeError("Polling requires at least one subscription");
        } else {
          wasiDebug("poll_oneoff subscriptionsNum: " + subscriptionsNum);
        }
        let eventsNum = 0;
        const addEvent = (event) => {
          Object.assign(event_t.get(this._getBuffer(), eventsPtr), event);
          eventsNum++;
          eventsPtr = eventsPtr + event_t.size;
        };
        const clockEvents = [];
        for (let i2 = 0; i2 < subscriptionsNum; i2++) {
          const { userdata, union } = subscription_t.get(this._getBuffer(), subscriptionPtr);
          subscriptionPtr = subscriptionPtr + subscription_t.size;
          switch (union.tag) {
            case 0: {
              wasiDebug("poll_oneoff EventType.Clock");
              let timeout = Number(union.data.timeout) / 1e6;
              if (union.data.flags === 1) {
                const origin = union.data.id === 0 ? Date : globalThis.performance;
                timeout -= origin.now();
              }
              clockEvents.push({
                timeout,
                extra: Number(union.data.precision) / 1e6,
                userdata
              });
              break;
            }
            case 1: {
              const fd_forread = union.data.fd;
              wasiDebug("poll_oneoff EventType.FdRead: fd: " + fd_forread);
              if (fd_forread == 0) {
                if (this._suspendStdIn == true) {
                  wasiDebug("poll_oneoff EventType.FdRead: _suspendStdIn==true");
                  wasiDebug("poll_oneoff EventType.FdRead: args: ", this._args);
                  wasiDebug("poll_oneoff EventType.FdRead: env: ", this._env);
                  await this._wait(1e3);
                } else {
                  wasiDebug("poll_oneoff EventType.FdRead: _suspendStdIn==false");
                  wasiDebug("poll_oneoff EventType.FdRead: args: ", this._args);
                  wasiDebug("poll_oneoff EventType.FdRead: env: ", this._env);
                  const nBytes = 1n;
                  addEvent({
                    userdata,
                    error: E.SUCCESS,
                    type: union.tag,
                    fd_readwrite: {
                      nbytes: nBytes,
                      flags: 0
                    }
                  });
                }
              }
              break;
            }
            case 2: {
              const fd_forwrite = union.data.fd;
              wasiDebug("poll_oneoff EventType.FdWrite: fd: " + fd_forwrite);
              break;
            }
            default: {
              addEvent({
                userdata,
                error: E.NOSYS,
                type: union.tag,
                fd_readwrite: {
                  nbytes: 0n,
                  flags: 0
                }
              });
              break;
            }
          }
        }
        if (!eventsNum) {
          clockEvents.sort((a, b) => a.timeout - b.timeout);
          const wait = clockEvents[0].timeout + clockEvents[0].extra;
          let matchingCount = clockEvents.findIndex((item) => item.timeout > wait);
          matchingCount = matchingCount === -1 ? clockEvents.length : matchingCount;
          await this._wait(clockEvents[matchingCount - 1].timeout);
          for (let i2 = 0; i2 < matchingCount; i2++) {
            addEvent({
              userdata: clockEvents[i2].userdata,
              error: E.SUCCESS,
              type: 0
            });
          }
        }
        size_t.set(this._getBuffer(), eventsNumPtr, eventsNum);
      },
      path_link: async (_oldDirFd, _oldFlags, _oldPathPtr, _oldPathLen, _newFd, _newPathPtr, _newPathLen) => {
        wasiDebug("[path_link]");
        unimplemented("path_link");
      },
      fd_datasync: (fd) => {
        wasiDebug("[fd_datasync]");
        return this._openFiles.get(fd).asFile().flush();
      },
      fd_sync: async (fd) => {
        wasiDebug("[fd_sync]");
        const openFile = this._openFiles.get(fd);
        if (openFile.isFile) {
          await openFile.flush();
        }
      },
      fd_filestat_set_size: async (fd, newSize) => {
        wasiDebug("[fd_filestat_set_size]");
        return this._openFiles.get(fd).asFile().setSize(Number(newSize));
      },
      fd_renumber: (from, to) => {
        wasiDebug("[fd_renumber]");
        return this._openFiles.renumber(from, to);
      },
      path_symlink: (_oldPath, _fd, _newPath) => {
        unimplemented("path_symlink");
      },
      clock_time_get: (id, _precision, resultPtr) => {
        const origin = id === 0 ? Date : globalThis.performance;
        timestamp_t.set(this._getBuffer(), resultPtr, BigInt(Math.round(origin.now() * 1e6)));
      },
      clock_res_get: (_id, resultPtr) => {
        timestamp_t.set(this._getBuffer(), resultPtr, 1000000n);
      },
      sched_yield: () => {
        wasiDebug("sched_yield");
        return;
      },
      fd_advise: (_fd, _offset, _len, _advice) => {
        unimplemented("fd_advise");
      },
      fd_allocate: (_fd, _offset, _len) => {
        unimplemented("fd_allocate");
      },
      fd_filestat_set_times: (_fd, _atim, _mtim, _fst_flags) => {
        unimplemented("fd_filestat_set_times");
      },
      fd_pread: (_fd, _iovsPtr, _iovsLen, _offset, _nreadPtr) => {
        unimplemented("fd_pread");
      },
      fd_pwrite: (_fd, _iovsPtr, _iovsLen, _offset, _nreadPtr) => {
        unimplemented("fd_pwrite");
      },
      sock_accept: (_fd, _fdflags, _retptr) => {
        unimplemented("sock_accept");
      }
    };
    return new Proxy(bindings2, {
      get: (target, name, receiver) => {
        const value = Reflect.get(target, name, receiver);
        if (typeof name !== "string" || typeof value !== "function") {
          return value;
        }
        return async (...args) => {
          try {
            await value(...args);
            this._checkAbort();
            return E.SUCCESS;
          } catch (err) {
            return translateError(err);
          }
        };
      }
    });
  }
  getWasiFileSystemsImports() {
    const bindings2 = {
      mount: async (source_ptr, source_len, dest_ptr, dest_len) => {
        const sourceMountURL = string.get(this._getBuffer(), source_ptr, source_len);
        const destMountPath = string.get(this._getBuffer(), dest_ptr, dest_len);
        wasiDebug("mounting source url: " + sourceMountURL);
        wasiDebug("mounting destination path: " + destMountPath);
        wasiDebug("mounting path : " + destMountPath);
        let fileSystemHandle = {};
        if (sourceMountURL.startsWith("local")) {
          if (globalThis.showDirectoryPicker) {
            fileSystemHandle = await showDirectoryPicker();
          } else {
            return new Promise((_resolve, reject) => {
              reject(E.NOSYS);
            });
          }
        } else {
          fileSystemHandle = await getDirectoryHandleByURL(sourceMountURL);
        }
        const destSubDir = fileSystemHandle.name;
        this._openFiles.mountHandleOnPath(fileSystemHandle, destMountPath, destSubDir);
        return new Promise((resolve) => {
          resolve(E.SUCCESS);
        });
      }
    };
    return new Proxy(bindings2, {
      get: (target, name, receiver) => {
        const value = Reflect.get(target, name, receiver);
        if (typeof name !== "string" || typeof value !== "function") {
          return value;
        }
        return async (...args) => {
          try {
            await value(...args);
            this._checkAbort();
            return E.SUCCESS;
          } catch (err) {
            return translateError(err);
          }
        };
      }
    });
  }
  getWasiProcessImports() {
    const bindings2 = {
      exec: async (name_ptr, name_len, argv_ptr, argv_len) => {
        const name = string.get(this._getBuffer(), name_ptr, name_len);
        wasiDebug("exec name: ", name);
        const argvString = string.get(this._getBuffer(), argv_ptr, argv_len);
        wasiDebug("exec argvString: ", argvString);
        const args = parseCStringArray(argvString);
        wasiDebug("exec args: ", args);
        const nameWasm = name + ".async.wasm";
        args.splice(0, 0, nameWasm);
        wasiDebug("exec args prepended: ", args);
        let moduleWaiting;
        const tryByPath = true;
        let tryByUrl = true;
        if (tryByPath) {
          try {
            const wasmFile = "./" + nameWasm;
            const rootFd = 3;
            const wasiFile = await this._openFiles.getPreOpen(rootFd).getFileOrDir(wasmFile, 1);
            const file = await wasiFile.getFile();
            const bufferSource = await file.arrayBuffer();
            moduleWaiting = WebAssembly.compile(bufferSource);
            tryByUrl = false;
          } catch (err) {
            console.error("wasi::exec err: ", err);
          }
        }
        if (tryByUrl) {
          const wasmUrl = "./" + nameWasm;
          wasiDebug("wasmUrl: ", wasmUrl);
          try {
            moduleWaiting = WebAssembly.compileStreaming(fetch(wasmUrl));
          } catch (err) {
            console.error("wasi::exec err: ", err);
          }
        }
        const devnull = {
          async read(len) {
            return new Promise((resolve) => {
              wasiDebug("devnull read: ", len);
              resolve(new Uint8Array([]));
            });
          },
          async write(data) {
            const textDecoder = new TextDecoder();
            const str2 = textDecoder.decode(data, { stream: true }).replaceAll("\n", "\r\n");
            wasiDebug("devnull write: ", str2);
          }
        };
        const module = await moduleWaiting;
        const devNull = devnull;
        const runInSandbox = false;
        let openFiles;
        if (runInSandbox) {
          const preOpens = {};
          const memfs = await getOriginPrivateDirectory(memory_default);
          preOpens["/"] = memfs;
          openFiles = new OpenFiles(preOpens);
        } else {
          openFiles = this._openFiles;
        }
        const oldStdin = this._stdIn;
        const oldStdOut = this._stdOut;
        const oldStderr = this._stdErr;
        const abortSignal = this._abortSignal;
        const oldTtyRawMode = this._tty?.rawMode || false;
        const env = {};
        env["RUST_BACKTRACE"] = "1";
        env["RUST_LOG"] = "wasi=trace";
        const tty = this._tty;
        this._suspendStdIn = true;
        this._stdIn = devNull;
        this._stdErr = devNull;
        this._stdOut = devNull;
        if (this._tty) {
          this._tty.rawMode = false;
        }
        const exitCode = 0;
        return new Promise((resolve, reject) => {
          const w = new WASI({
            abortSignal,
            openFiles,
            stdin: oldStdin,
            stdout: oldStdOut,
            stderr: oldStderr,
            args,
            env,
            tty
          });
          w.run(module).then((exitCode2) => {
            if (exitCode2 !== 0) {
              wasiDebug(`exec:run exit code: ${exitCode2}`);
            }
            resolve(exitCode2);
          }).catch((err) => {
            wasiDebug(`exec:run:catch exitCode: ${exitCode} err: ${err}`);
            resolve(exitCode);
          }).finally(() => {
            wasiDebug(`exec:run:finally exitCode: ${exitCode}`);
            this._stdIn = oldStdin;
            this._stdErr = oldStderr;
            this._stdOut = oldStdOut;
            this._suspendStdIn = false;
            if (this._tty) {
              this._tty.rawMode = oldTtyRawMode;
            }
          });
        });
      }
    };
    return new Proxy(bindings2, {
      get: (target, name, receiver) => {
        const value = Reflect.get(target, name, receiver);
        if (typeof name !== "string" || typeof value !== "function") {
          return value;
        }
        return async (...args) => {
          try {
            await value(...args);
            this._checkAbort();
            return E.SUCCESS;
          } catch (err) {
            return translateError(err);
          }
        };
      }
    });
  }
  getWasiConsoleImports() {
    const bindings2 = {
      term_set_raw_mode: (rawMode) => {
        wasiDebug(`term_set_raw_mode mode: ${rawMode}`);
        if (rawMode == 1) {
          if (this._tty) {
            this._tty.rawMode = true;
          }
        } else if (rawMode == 0) {
          if (this._tty) {
            this._tty.rawMode = false;
          }
        }
        return 0;
      },
      term_get_raw_mode: () => {
        if (this._tty) {
          if (this._tty.rawMode) {
            return 1;
          }
        }
        return 0;
      }
    };
    return new Proxy(bindings2, {
      get: (target, name, receiver) => {
        const value = Reflect.get(target, name, receiver);
        if (typeof name !== "string" || typeof value !== "function") {
          return value;
        }
        return async (...args) => {
          try {
            await value(...args);
            this._checkAbort();
            return E.SUCCESS;
          } catch (err) {
            return translateError(err);
          }
        };
      }
    });
  }
  async _forEachIoVec(iovsPtr, iovsLen, handledPtr, cb) {
    let totalHandled = 0;
    for (let i2 = 0; i2 < iovsLen; i2++) {
      const iovec = iovec_t.get(this._getBuffer(), iovsPtr);
      wasiDebug(`iovec.bufLen ${iovec.bufLen}`);
      const buf = new Uint8Array(this._getBuffer(), iovec.bufPtr, iovec.bufLen);
      const handled = await cb(buf);
      this._checkAbort();
      totalHandled += handled;
      if (handled < iovec.bufLen) {
        break;
      }
      iovsPtr = iovsPtr + iovec_t.size;
    }
    size_t.set(this._getBuffer(), handledPtr, totalHandled);
  }
};
function translateError(err) {
  if (err instanceof SystemError) {
    if (!err.ignore) {
      const msg = err.message;
      wasiError(`translateError: SystemError ${msg}`);
      wasiError(err);
    }
    return err.code;
  }
  if (err instanceof Error) {
    let code;
    switch (err.name) {
      case "NotFoundError":
        code = E.NOENT;
        break;
      case "NotAllowedError":
      case "DataCloneError":
      case "SecurityError":
        code = E.ACCES;
        break;
      case "InvalidModificationError":
        code = E.NOTEMPTY;
        break;
      case "AbortError":
        code = E.CANCELED;
        break;
    }
    if (code) {
      wasiError(`translateError: code: ${code}`);
      return code;
    }
  } else if (err instanceof TypeError || err instanceof RangeError) {
    const msg = err.message;
    wasiError(`translateError: TypeError||RangeError:  ${msg}`);
    return E.INVAL;
  }
  wasiError(`translateError: Uknownerror: `);
  return E.INVAL;
}

// ../../packages/wasi-js/dist/tty.js
var TTY_DEBUG = false;
function ttyDebug(msg, ...optionalParams) {
  if (TTY_DEBUG) {
    console.debug(msg, optionalParams);
  }
}
var TTY = class {
  constructor(columns, rows, rawMode, modeListener) {
    this.columns = columns;
    this.rows = rows;
    this._rawMode = rawMode;
    this._modeListener = modeListener;
  }
  columns;
  rows;
  _rawMode;
  _modeListener;
  moduleInstanceExports;
  set rawMode(rawMode) {
    if (this._modeListener) {
      this._modeListener(rawMode);
    }
    this._rawMode = rawMode;
  }
  get rawMode() {
    return this._rawMode;
  }
  setModuleInstanceExports(modInst) {
    this.moduleInstanceExports = modInst;
  }
  async setColumns(columns) {
    this.columns = columns;
    if (this.moduleInstanceExports) {
      ttyDebug("setColumns moduleInstance:", this.moduleInstanceExports);
      const { term_set_columns } = this.moduleInstanceExports;
      if (term_set_columns) {
        ttyDebug("term_set_columns", columns);
      } else {
        ttyDebug("term_set_columns does not exist");
      }
    } else {
      ttyDebug("setColumns moduleInstance is null");
    }
  }
  async setRows(rows) {
    this.rows = rows;
    if (this.moduleInstanceExports) {
      const { term_set_rows } = this.moduleInstanceExports;
      if (term_set_rows) {
        ttyDebug("term_set_rows", rows);
      }
    }
  }
};

// src/index.ts
import { default as fs } from "node:fs";

// node_modules/bun-utilities/spawn.mjs
var bindings = await (await init_bun_utilities().then(() => bun_utilities_exports)).default();
var exec = bindings.exec;
var spawn = bindings.spawn;
var execAndDontWait = bindings.execAndDontWait;
var spawnAndDontWait = bindings.spawnAndDontWait;

// src/std-polyfill.js
import EventEmitter from "node:events";
var Readable = class extends EventEmitter {
  fromWeb(rs) {
    this.rs = rs;
    this.begin();
    this.td = new TextDecoder("utf-8");
  }
  isRaw = true;
  async begin() {
    const reader = this.rs.getReader();
    let done = false;
    do {
      const res = await reader.read();
      done = res.done;
      console.log("EventEmitter::begin ", res);
      this.emit("data", res);
    } while (!done);
    this.emit("end");
  }
};
var webRSToNodeRS = async (rs) => {
  const nodeStream = new Readable();
  nodeStream.fromWeb(rs);
  return nodeStream;
};
process.stdin = await webRSToNodeRS(Bun.stdin.stream());
var Writable = class {
  fromWeb(ws) {
  }
  async write(data) {
    if (this.ongoing) {
      await thiss.ongoing;
    }
    delete this.ongoing;
  }
  end(data) {
    if (data) {
      this.writer.write(data);
    }
    this.writer.close();
  }
};
var webWSToNodeWS = async (ws) => {
  const nodeStream = new Writable();
  nodeStream.fromWeb(ws);
  return nodeStream;
};
process.stdout = await webWSToNodeWS(Bun.stdout.stream());

// src/index.ts
var import_bun = __toESM(require_bun());
var DEBUG_MODE = false;
var runFunc = async () => {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();
  console.log(import_bun.Bun.stdin.stream(), import_bun.Bun.stdout.stream(), import_bun.Bun.stderr.stream());
  const modeListener = function(rawMode2) {
    console.log("modeListener");
    if (rawMode2) {
      console.log(`modeListener::rawMode ${rawMode2}`);
      exec(["stty", "raw"]);
    } else {
      console.log(`modeListener::rawMode ${rawMode2}`);
      exec(["stty", "-raw"]);
    }
  };
  const stdin = {
    async read(_num) {
      const isRawMode = tty.rawMode;
      let mychar = "";
      try {
        await new Promise((resolve) => {
          process.stdin.once("data", function(chunk) {
            const s = chunk;
            if (DEBUG_MODE) {
              console.debug(`read from stdin: "${s}" `);
            }
            console.debug(`read from stdin: "${s}" `, s);
            mychar = s;
            return resolve();
          });
        });
      } finally {
        if (DEBUG_MODE) {
          console.log("stdin::read finally");
        }
      }
      if (isRawMode) {
        return textEncoder.encode(mychar);
      } else {
        return textEncoder.encode(mychar);
      }
    }
  };
  const stdout = {
    write(data) {
      console.log("stdout:write:", data);
      fs.writeFileSync(1, data, "utf-8");
    }
  };
  let stderr = {
    write(data) {
      console.log("stderr:write:", data);
      fs.writeFileSync(2, data, "utf-8");
    }
  };
  if (DEBUG_MODE) {
    stderr = {
      write(data) {
        console.error(textDecoder.decode(data, { stream: true }));
      }
    };
  }
  const preOpens = {};
  let nodePath = process.env.NODE_ROOT_DIR;
  if (!nodePath || nodePath == "") {
    nodePath = process.cwd();
  }
  const rootfs = await getOriginPrivateDirectory(memory_default);
  const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const secretStore = {
    aws: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    github: {
      token: GITHUB_TOKEN,
      username: GITHUB_USERNAME
    }
  };
  rootfs.secretStore = secretStore;
  const rootDir = "/";
  const init_pwd = "/";
  preOpens[rootDir] = rootfs;
  const abortController = new AbortController();
  const openFiles = new OpenFiles(preOpens);
  const args = [];
  let shellBinary = "./nu.async.wasm";
  const binaryFromEnv = process.env.NODE_SHELL_BINARY;
  if (binaryFromEnv && binaryFromEnv != " ") {
    shellBinary = binaryFromEnv;
  }
  const buf = fs.readFileSync(shellBinary);
  const mod = await WebAssembly.compile(buf);
  const cols = 80;
  const rows = 24;
  const rawMode = true;
  const tty = new TTY(cols, rows, rawMode, modeListener);
  try {
    const statusCode = await new WASI({
      abortSignal: abortController.signal,
      openFiles,
      stdin,
      stdout,
      stderr,
      args,
      env: {
        PWD: init_pwd,
        TERM: "xterm-256color",
        COLORTERM: "truecolor",
        LC_CTYPE: "UTF-8",
        COMMAND_MODE: "unix2003",
        FORCE_COLOR: "true",
        PROMPT_INDICATOR: " > "
      },
      tty
    }).run(mod);
    if (statusCode !== 0) {
      console.log(`Exit code: ${statusCode}`);
    }
  } catch (err) {
    console.log(err.message);
  } finally {
    console.log("finally");
    process.exit(0);
  }
};
await runFunc();
/*! https://mths.be/punycode v1.3.2 by @mathias */
/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
