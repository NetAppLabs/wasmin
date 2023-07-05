#!/bin/bash
set -ueo pipefail

export WASI_SDK_PATH="${HOME}/Development/netapp/wasm/wasi-sdk-20.0"
#CC=${CC:=clang}
CC=${WASI_SDK_PATH}/bin/clang

for input in testsuite/*.c; do
  output="testsuite/$(basename $input .c).wasm"

  if [ "$input" -nt "$output" ]; then
    echo "Compiling $input"
    $CC "$input" -o "$output"
  fi
done
