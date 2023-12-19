#!/bin/bash

jco transpile nfs_rs.wasm -o component -I --no-wasi-shim

npx tsc -p .
