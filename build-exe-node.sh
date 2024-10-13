#!/bin/bash
# see https://nodejs.org/api/single-executable-applications.html


cd apps/node-shell-cjs

./build-sea.sh

cd ../..
mv apps/node-shell-cjs/wasmin-node .