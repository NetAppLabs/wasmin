#!/bin/bash
set -ex

wat2wasm preview1-sockets.wat
wasm-tools component new preview1-sockets.wasm --adapt wasi_snapshot_preview1=wasi_snapshot_preview1.command_sockets.wasm -o component.wasm

# Inspect the generated `component.wasm`
wasm-tools validate component.wasm --features component-model
wasm-tools component wit component.wasm

jco transpile component.wasm -o component -I --no-wasi-shim