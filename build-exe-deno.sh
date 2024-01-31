#!/bin/bash
set -e

#deno run apps/node-shell/dist/index.js -h
#
#deno compile -o ./wasmin-deno --no-npm apps/node-shell/dist/index.js 

cd apps/deno-shell
#yarn build
deno task compile
cd ../..
mv apps/deno-shell/wasmin-deno ./wasmin-deno

