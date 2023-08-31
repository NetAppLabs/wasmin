#!/bin/bash

jco transpile nfs_rs.wasm -o component -I --no-wasi-shim

tsc -m es2022 -t es2022 component/index.ts || true # ignore tsc exit code
