#!/bin/bash
set -e

#deno run apps/node-shell/dist/index.js -h
#
#deno compile -o ./wasmin-deno --no-npm apps/node-shell/dist/index.js 

cd apps/deno-shell

rm -rf dist
mkdir -p src/embed/static
cp dir.ts src/embed/static
yarn build
deno task build-embeds

TARGET=$1
if [ -n "$TARGET" ]; then
    deno task compile-$TARGET
    cd ../..
    mv apps/deno-shell/wasmin-deno ./wasmin-deno-$TARGET
else
    deno task compile
    cd ../..
    mv apps/deno-shell/wasmin-deno ./wasmin-deno
fi
