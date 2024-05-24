#!/bin/bash

rm -f component/wasi_filesystem.*
rm -rf component/interfaces

echo "jco being used: `which jco`"
echo "jco version: `jco --version`"
jco transpile wasi_filesystem.wasm -o component -I --no-wasi-shim

npx tsc -p .
