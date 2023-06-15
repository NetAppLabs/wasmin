#!/bin/bash
#

#cp component/wasi_reactor.js /tmp

# https://github.com/bytecodealliance/cargo-component/commit/de4f641fd3e5dcb094fcaa73b1244ba7b2d59d44
# before component version update to 3
#cargo install --git https://github.com/bytecodealliance/cargo-component --rev de4f641fd3e5dcb094fcaa73b1244ba7b2d59d44

cargo component build

jco transpile target/wasm32-wasi/debug/wasi_reactor.wasm -o component

#cp /tmp/wasi_reactor.js component/wasi_reactor.js
#git checkout component/wasi_reactor.js

shared-wasm component/wasi_reactor.core.wasm
shared-wasm component/wasi_reactor.core2.wasm

mv component/wasi_reactor.core.shared.wasm component/wasi_reactor.core.wasm
mv component/wasi_reactor.core2.shared.wasm component/wasi_reactor.core2.wasm
