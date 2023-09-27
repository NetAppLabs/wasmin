#!/bin/bash

cp component/component.core2.wasm ../../packages/wasi-js/src/wasi_snapshot_preview2/command/
cp component/component.core3.wasm ../../packages/wasi-js/src/wasi_snapshot_preview2/command/
cp component/component.core4.wasm ../../packages/wasi-js/src/wasi_snapshot_preview2/command/
cp component/component.core4.wasm ../../packages/wasi-js/src/wasi_snapshot_preview2/command/
#cp component/component.core5.wasm ../../packages/wasi-js/src/wasi_snapshot_preview2/command/

cp component/component.js ../../packages/wasi-js/src/wasi_snapshot_preview2/command/runner.js
cp component/component.d.ts ../../packages/wasi-js/src/wasi_snapshot_preview2/command/runner.d.ts
