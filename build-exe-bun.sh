#!/bin/bash
set -e

cd apps/bun-shell
yarn build
cd ../..

cp ./apps/bun-shell/app.js ./apps/bun-shell/dist/app.js 

cp ./apps/bun-shell/dist/wasmComponentWorkerThread.js ./apps/bun-shell/dist/wasmComponentWorkerThread.wjs
cp ./apps/bun-shell/dist/wasmCoreWorkerThread.js ./apps/bun-shell/dist/wasmCoreWorkerThread.wjs 
cp ./apps/bun-shell/dist/wasiWorkerThread.js ./apps/bun-shell/dist/wasiWorkerThread.wjs 

bun build ./apps/bun-shell/dist/app.js --compile --loader .wjs:file --outfile=wasmin-bun

mv ./apps/bun-shell/dist/wasmin-bun .
