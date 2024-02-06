#!/bin/bash

rm component/nfs_rs.*
rm -rf component/interfaces

jco transpile nfs_rs.wasm -o component -I --no-wasi-shim

cat component/nfs_rs.js | sed s/"const { instanceNetwork } ="/"const { Network, instanceNetwork } ="/g > component/nfs_rs.js~
mv component/nfs_rs.js~ component/nfs_rs.js

npx tsc -p .
