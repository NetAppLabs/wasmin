#!/bin/bash
set -ex

wat2wasm preview1-sockets.wat
wasm-tools component new preview1-sockets.wasm --adapt wasi_snapshot_preview1=wasi_snapshot_preview1.command_sockets.wasm -o component.wasm

# Inspect the generated `component.wasm`
wasm-tools validate component.wasm --features component-model
wasm-tools component wit component.wasm

jco transpile component.wasm -o component -I --no-wasi-shim


sed -i .bak "s/let exports0;/let exports0;\nconst \{ Network \} = imports\[\"wasi:sockets\/instance-network\"\];\nconst \{ TerminalInput \} = imports\[\"wasi:cli\/terminal-stdin\"\];\nconst \{ TerminalOutput \} = imports\[\"wasi:cli\/terminal-stdout\"\];/g" component/component.js
rm component/component.js.bak

npx tsc -p .
