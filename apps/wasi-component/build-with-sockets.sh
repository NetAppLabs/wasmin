#!/bin/bash
set -ex


wat2wasm greeting-with-sockets.wat
wasm-tools component new greeting-with-sockets.wasm --adapt wasi_snapshot_preview1=wasi_snapshot_preview1.command_sockets.wasm -o component.wasm
#wasm-tools component new greeting-with-sockets.wasm --adapt wasi_snapshot_preview1=wasi_snapshot_preview1.command_with_sockets.wasm,wasi_experimental_sockets=wasi_snapshot_preview1.command_with_sockets.wasm -o component.wasm

# Inspect the generated `component.wasm`
wasm-tools validate component.wasm --features component-model
wasm-tools component wit component.wasm

jco transpile component.wasm -o component -I --no-wasi-shim