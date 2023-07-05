#!/bin/bash

#rustc foo.rs --target wasm32-wasi
#wasm-tools component new foo.wasm --adapt wasi_snapshot_preview1.command.wasm -o component.wasm

wat2wasm greeting.wat
wasm-tools component new greeting.wasm --adapt wasi_snapshot_preview1=wasi_snapshot_preview1.command.wasm -o component.wasm

# Inspect the generated `component.wasm`
wasm-tools validate component.wasm --features component-model
wasm-tools component wit component.wasm

jco transpile component.wasm -o component -I --no-wasi-shim
