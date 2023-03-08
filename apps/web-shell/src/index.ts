import "xterm/css/xterm.css";

import { Terminal, IDisposable, ITerminalOptions, IWindowOptions } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebglAddon } from "xterm-addon-webgl";
import { WASI, OpenFiles, TTY, TextDecoderWrapper } from "@wasm-env/wasi-js";
import { s3 } from "@wasm-env/s3-fs-js";
import { github } from "@wasm-env/github-fs-js";

// @ts-ignore
import LocalEchoController from "local-echo";

import { getOriginPrivateDirectory, indexeddb, NFileSystemDirectoryHandle, RegisterProvider } from "@wasm-env/fs-js";

const DEBUG_MODE = false;
const REGISTER_GITHUB = true;
const REGISTER_S3 = true;

let isSafari = navigator.userAgent.indexOf("Safari") > -1;
const isChrome = navigator.userAgent.indexOf("Chrome") > -1;

if (isChrome && isSafari) {
    isSafari = false;
}

function isHttps() {
    return document.location.protocol == "https:";
}

console.log(navigator.userAgent);
console.log(`isSafari: ${isSafari}`);
console.log(`isChrome: ${isChrome}`);

if (REGISTER_S3) {
    // @ts-ignore
    RegisterProvider("s3", s3);
}
if (REGISTER_GITHUB) {
    // @ts-ignore
    RegisterProvider("github", github);
}

(async () => {
    const options: ITerminalOptions = {
        cursorBlink: true,
        cursorStyle: "block",
    };
    const windowOptions: IWindowOptions = {};
    windowOptions.getCellSizePixels = true;
    windowOptions.getWinSizeChars = true;
    windowOptions.setWinLines = true;
    windowOptions.getWinSizePixels = true;
    windowOptions.pushTitle = true;
    windowOptions.popTitle = true;
    options.windowOptions = windowOptions;

    const term = new Terminal(options);
    // converts \n to \r\n
    //term.setOption("convertEol", true);

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    const localEcho = new LocalEchoController();
    term.loadAddon(localEcho);

    //const modes: IModes{
    //  await writeSync(page, '\\x1b[?1h');
    //};
    //term.modes = modes;

    // see https://github.com/xtermjs/xterm.js/blob/master/test/api/Terminal.api.ts
    /*
  it('applicationCursorKeysMode', async () => {
    await openTerminal(page);
    await writeSync(page, '\\x1b[?1h');
    assert.strictEqual(await page.evaluate(`window.term.modes.applicationCursorKeysMode`), true);
    await writeSync(page, '\\x1b[?1l');
    assert.strictEqual(await page.evaluate(`window.term.modes.applicationCursorKeysMode`), false);
  });
  it('applicationKeypadMode', async () => {
    await openTerminal(page);
    await writeSync(page, '\\x1b[?66h');
    assert.strictEqual(await page.evaluate(`window.term.modes.applicationKeypadMode`), true);
    await writeSync(page, '\\x1b[?66l');
    assert.strictEqual(await page.evaluate(`window.term.modes.applicationKeypadMode`), false);
  });
  */

    //term.write('\x1B[?1h');
    //term.write('\x1B[?1l');
    //term.write('\x1B[?6h');
    //term.write("\x1B[38;5;251m;")
    //term.write("helo");
    //term.write("\x9B?47h"); //CSI ? 47 h

    if (DEBUG_MODE) {
        console.debug("unicode.activeVersion: ", term.unicode.activeVersion);
    }
    /*
  const cupHook = term.parser.registerCsiHandler({ final: "H" }, (params) => {
    //console.log('cursor got repositioned absolutely by CUP', params);
    //return false;   // also probe for other handlers
    // 0 defaults to 1
    params = params.map((p) => p || 1);
    // fill up to 2 params with default value
    while (params.length < 2) params.push(1);
    // ignore excessive params
    params = params.slice(0, 2);
    // do some work
    if (DEBUG_MODE) {
      console.debug("cursor got repositioned absolutely by CUP");
      console.debug({ row: params[0], col: params[1] });
    }
    return false; // also probe for other handlers
  });
  */
    /*
  // handling CSI ? 2 5 l - hide cursor
  const csiHideCursorHook = term.parser.registerCsiHandler(
    { final: "l" },
    (params) => {
      if (DEBUG_MODE) {
        console.debug("got csiHideCursorHook");
      }

      params = params.map((p) => p || 1);
      // fill up to 2 params with default value
      while (params.length < 2) params.push(1);
      // ignore excessive params
      params = params.slice(0, 2);
      // do some work
      if (DEBUG_MODE) {
        console.debug({ row: params[0], col: params[1] });
      }
      return false; // also probe for other handlers
    }
  );
  */
    /*
  // handling CSI ? 2 5 h - show cursor
  const csiShowCursorHook = term.parser.registerCsiHandler(
    { final: "h" },
    (params) => {
      if (DEBUG_MODE) {
        console.debug("got csiShowCursorHook");
      }
      params = params.map((p) => p || 1);
      // fill up to 2 params with default value
      while (params.length < 2) params.push(1);
      // ignore excessive params
      params = params.slice(0, 2);
      // do some work
      if (DEBUG_MODE) {
        console.debug({ row: params[0], col: params[1] });
      }
      return false; // also probe for other handlers
    }
  );
  */

    term.open(document.body);
    if (!isSafari) {
        term.loadAddon(new WebglAddon());
    }
    fitAddon.fit();

    const ANSI_GRAY = "\x1B[38;5;251m";
    const ANSI_BLUE = "\x1B[34;1m";
    const ANSI_RESET = "\x1B[0m";

    function writeIndented(s: string) {
        term.write(
            s
                .trimStart()
                .replace(/\n +/g, "\r\n")
                .replace(/https:\S+/g, ANSI_BLUE + "$&" + ANSI_RESET)
                .replace(/^#.*$/gm, ANSI_GRAY + "$&" + ANSI_RESET)
        );
    }

    writeIndented(`
    #
    # Welcome to a shell powered by Nushell, WebAssembly, WASI, Asyncify and File System Access API!
    # Github repo with the source code: https://github.com/NetAppLabs/wasm-env
    #

  `);

    const module = WebAssembly.compileStreaming(fetch("./nu.async.wasm"));

    writeIndented(`
    # Right now you have / mounted to a persisted per browser (indexeddb) filesystem:
    / > df
    ╭───┬────────────┬────────┬─────────╮
    │ # │ filesystem │ device │ mounted │
    ├───┼────────────┼────────┼─────────┤
    │ 0 │ wasi       │ /      │         │
    ╰───┴────────────┴────────┴─────────╯

    # To mount a other filesystems, use commands like:
    #
    $ mount local://                For mounting a local filesystem from browser (Chrome only)
    $ mount s3://bucketname/        For mounting an S3 bucket
    $ mount github://username       For mounting repos from GitHub
    # 

    # To view a list of other commands, use
    $ help commands

  `);

    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoderWrapper();

    const stdin = {
        async read(num: number) {
            if (DEBUG_MODE) {
                console.log(`read: num: ${num}`);
            }
            let charOrLine = "";
            const isRawMode = tty.rawMode;
            let onData: IDisposable | undefined;
            if (isRawMode) {
                // in rawmode we read each character directly from term
                const readPromise = new Promise<void>((resolve, _reject) => {
                    onData = term.onData((s) => {
                        if (DEBUG_MODE) {
                            console.debug("rawMode: stdin::read: ", s);
                        }
                        charOrLine = s;
                        return resolve();
                    });
                });
                await readPromise;
            } else {
                // in normal/canonical mode we read each line from localecho
                let input = await localEcho.read("");
                input = input + "\r\n";
                charOrLine = input;
            }
            if (onData) {
                onData.dispose();
            }
            return textEncoder.encode(charOrLine);
        },
    };

    const stdoutWriteFunc = function (data: Uint8Array) {
        const isRawMode = tty.rawMode;
        if (isRawMode) {
            const str = textDecoder.decode(data);
            localEcho.print(str);
        } else {
            const str = textDecoder.decode(data);
            localEcho.print(str);
        }
    };

    const stdout = {
        write: stdoutWriteFunc,
    };

    let stderr = {
        write: stdoutWriteFunc,
    };

    if (DEBUG_MODE) {
        stderr = {
            write(data: Uint8Array) {
                console.error(textDecoder.decode(data, { stream: true }));
            },
        };
    }

    const modeListener = function (rawMode: boolean): void {
        if (DEBUG_MODE) {
            console.debug(`debug: setting rawMode: ${rawMode}`);
        }
    };

    let useOPFS = false;
    if (isSafari) {
        // Safari has not support for FileSystemFileHandle.createWritable , so disabling it for now
        useOPFS = false;
    } else {
        if (isHttps()) {
            //OPFS getDirectory is only available in secure contexts
            if (navigator.storage.getDirectory !== undefined) {
                useOPFS = true;
            }
        }
    }

    // Request persistent storage
    if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`Request for persisting storage granted: ${isPersisted}`);
    }

    // Check if our storage has been marked as persistent
    if (navigator.storage != undefined && navigator.storage.persist != undefined) {
        const isPersisted = await navigator.storage.persisted();
        console.log(`Persisted storage already granted: ${isPersisted}`);
    }

    const preOpens: Record<string, FileSystemDirectoryHandle> = {};
    let rootfs: FileSystemDirectoryHandle;
    if (useOPFS) {
        // Use OPFS by default (Chrome)
        console.log("Using browser OPFS storage as root");
        const root = await navigator.storage.getDirectory();
        rootfs = new NFileSystemDirectoryHandle(root);
    } else {
        // Fall back on indexeddb if OPFS is not available
        console.log("Using indexeddb storage as root");
        rootfs = await getOriginPrivateDirectory(indexeddb);
    }

    const rootDir = "/";
    //const init_pwd = "/home/user";
    const init_pwd = "/";
    preOpens[rootDir] = rootfs;
    const abortController = new AbortController();
    const openFiles = new OpenFiles(preOpens);

    const args: string[] = [];

    // If we want to enable CTRL+C on the main shell process
    const abortControllerActive = true;

    const ctrlCHandler = term.onData((s) => {
        if (s === "\x03") {
            term.write("^C");
            console.log("ctrlCHandler activated");
            if (abortControllerActive) {
                console.log("abortController.abort");
                abortController.abort();
            }
        }
    });
    term.focus();
    const cols = term.cols;
    const rows = term.rows;
    const rawMode = false;
    const tty = new TTY(cols, rows, rawMode, modeListener);
    onresize = async () => {
        console.log("onresize before fit");
        fitAddon.fit();
        const cols = term.cols;
        const rows = term.rows;
        console.log(`onresize after fit cols: ${cols} , rows: ${rows}`);
        tty.columns = cols;
        tty.rows = rows;
        await tty.reload();
    };
    try {
        const statusCode = await new WASI({
            abortSignal: abortController.signal,
            openFiles: openFiles,
            stdin: stdin,
            stdout: stdout,
            stderr: stderr,
            args: args,
            env: {
                //RUST_BACKTRACE: "1",
                //RUST_LOG: "wasi=trace",
                PWD: init_pwd,
                TERM: "xterm-256color",
                COLORTERM: "truecolor",
                LC_CTYPE: "UTF-8",
                COMMAND_MODE: "unix2003",
                //FORCE_HYPERLINK: "true",
                FORCE_COLOR: "true",
                PROMPT_INDICATOR: " > ",
            },
            tty: tty,
        }).run(await module);
        if (statusCode !== 0) {
            term.writeln(`Exit code: ${statusCode}`);
        }
    } catch (err: any) {
        term.writeln(err.message);
    } finally {
        ctrlCHandler.dispose();
    }
})();
