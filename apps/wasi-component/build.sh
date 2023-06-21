#!/bin/bash

rustc foo.rs --target wasm32-wasi

wasm-tools component new foo.wasm --adapt wasi_snapshot_preview1.wasm -o component.wasm

# Inspect the generated `component.wasm`
wasm-tools validate component.wasm --features component-model
wasm-tools component wit component.wasm

#jco transpile component.wasm -o component --wasi-shim
#jco transpile component.wasm -o component --map="@wasm-env/wasip2/*"
#cd component
#echo '{"type":"module"}' > package.json
#npm install @bytecodealliance/preview2-shim