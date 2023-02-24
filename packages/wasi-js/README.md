# wasi-js

This is a [WASI](https://wasi.dev) implementation for JavaScript/TypeScript environments (browser/node etc.).

This repository is fork of [kobakazu0429/wasi](https://github.com/kobakazu0429/wasi)

-   which in turn is a fork of [GoogleChromeLabs/wasi-fs-access](https://github.com/GoogleChromeLabs/wasi-fs-access.git).

## What

Provides a WASI implenmentation that can be used like:

```
    const module = WebAssembly.compileStreaming(fetch("https://example.com/module.wasm"));
    const statusCode = await new WASI({
      abortSignal: abortController.signal,
      openFiles: openFiles,
      stdin: stdin,
      stdout: stdout,
      stderr: stderr,
      args: args,
      env: {
        MYENV: "1",
      },
    }).run(await module);
    if (statusCode !== 0) {
      console.log(`Ran with exit code: ${statusCode}`);
    }
  } catch (err: any) {
    console.error(err.message);
  } finally {
    console.debug("finally");
  }
```

## How

It provides [WASI](https://wasi.dev) Implementation that proxies any filesystem requests to a Virtual filesystem.
This allows apps built in languages like C, C++, Rust and others to be compiled to WebAssembly and work as usual within a browser sandbox, accessing and manipulating files in a "real world".

Since WASI APIs are synchronous by nature, but Web APIs are traditionally asynchronous to avoid blocking the main thread, Asyncify is used to bridge the two types of APIs together. Asyncify is a feature created as part of [Emscripten](https://emscripten.org/) and later extended to work with arbitrary WebAssembly files with the help of a [custom JavaScript wrapper](https://github.com/GoogleChromeLabs/asyncify).

Note that some commands in this implementation might not work due to either limitations of the WASI itself, limitations of the File System Access API (such as an [absent support for symlinks](https://github.com/WICG/file-system-access/issues/113)), or simply due to hardcoded assumptions about the target system in the used coreutils codebase itself. Most of those limitations can be easily worked around or will be naturally fixed as both APIs develop over time.
