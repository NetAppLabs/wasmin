#!/bin/bash
set -x
set -e

export export RUST_LOG=wasi_common=trace

testname=$1

if [ -z "${testname}" ]; then
		echo "please give wasm test name as argument"
		exit 1
fi

if [ "${testname}" == "readdir" ]; then
		args="--env NODE_PLATFORM=win32"
fi

wasmtime run ${args} --mapdir /tmp::$(pwd)/fixtures/tmp --mapdir /sandbox::$(pwd)/fixtures/sandbox $(pwd)/wasm/$testname.wasm
