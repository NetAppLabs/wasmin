#!/bin/bash
set -x

rm wasi_snapshot_preview1.command.wasm
rm wasi_snapshot_preview1.reactor.wasm

#rm wasi_preview1_component_adapter.command.wasm
#rm wasi_preview1_component_adapter.reactor.wasm

#wget https://github.com/bytecodealliance/wasmtime/releases/download/dev/wasi_snapshot_preview1.command.wasm
#wget https://github.com/bytecodealliance/wasmtime/releases/download/dev/wasi_snapshot_preview1.reactor.wasm

cp ../../../wasi-preview1-component-adapter/wasi_snapshot_preview1.reactor.wasm .
cp ../../../wasi-preview1-component-adapter/wasi_snapshot_preview1.command.wasm .
cp ../../../wasi-preview1-component-adapter/wasi_snapshot_preview1.command_sockets.wasm .
cp ../../../wasi-preview1-component-adapter/wasi_snapshot_preview1.command_ext.wasm .
