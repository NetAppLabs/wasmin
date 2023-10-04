#!/bin/bash
set -x

rm wasi_snapshot_preview1.command.wasm
rm wasi_snapshot_preview1.reactor.wasm

#rm wasi_preview1_component_adapter.command.wasm
#rm wasi_preview1_component_adapter.reactor.wasm

#wget https://github.com/bytecodealliance/wasmtime/releases/download/dev/wasi_snapshot_preview1.command.wasm
#wget https://github.com/bytecodealliance/wasmtime/releases/download/dev/wasi_snapshot_preview1.reactor.wasm

cp ../../../preview2-prototyping/wasi_snapshot_preview1.command.wasm .
cp ../../../preview2-prototyping/wasi_snapshot_preview1.reactor.wasm .
cp ../../../preview2-prototyping/wasi_snapshot_preview1.experimental_sockets.wasm .
cp ../../../preview2-prototyping/wasi_snapshot_preview1.command_sockets.wasm .
