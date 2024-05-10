#!/bin/bash

rm -f component/nfs_rs.*
rm -rf component/interfaces

echo "jco being used: `which jco`"
echo "jco version: `jco --version`"
jco transpile nfs_rs.wasm -o component -I --no-wasi-shim

if `git status | grep -q "modified:   component/interfaces/wasi-io-streams.d.ts"`; then
    echo "detected locally modified component/interfaces/wasi-io-streams.d.ts"
    echo "-- checking for jco transpile silliness"
    echo "--- a/packages/nfs-js/component/interfaces/wasi-io-streams.d.ts
+++ b/packages/nfs-js/component/interfaces/wasi-io-streams.d.ts
@@ -15,11 +15,6 @@ export interface StreamErrorClosed {
 import type { Pollable } from '../interfaces/wasi-io-poll.js';
 export { Pollable };
 
-export class InputStream {
-  blockingRead(len: bigint): Uint8Array;
-  subscribe(): Pollable;
-}
-
 export class OutputStream {
   checkWrite(): bigint;
   write(contents: Uint8Array): void;
@@ -27,3 +22,8 @@ export class OutputStream {
   blockingFlush(): void;
   subscribe(): Pollable;
 }
+
+export class InputStream {
+  blockingRead(len: bigint): Uint8Array;
+  subscribe(): Pollable;
+}" > silly.diff
    git diff component/interfaces/wasi-io-streams.d.ts | tail -n +3 > wasi-io-streams.diff
    if `diff -q wasi-io-streams.diff silly.diff &> /dev/null`; then
        echo "-- jco transpile silliness detected"
        echo "-- reverting component/interfaces/wasi-io-streams.d.ts"
        echo "git checkout component/interfaces/wasi-io-streams.d.ts"
        git checkout component/interfaces/wasi-io-streams.d.ts
    fi
    rm wasi-io-streams.diff silly.diff
fi

npx tsc -p .
