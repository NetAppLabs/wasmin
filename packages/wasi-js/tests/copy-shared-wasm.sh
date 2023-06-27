#!/bin/bash
#

mkdir -p shared-wasm

cp wasm/* shared-wasm

cd shared-wasm
FILES="*.wasm"
for f in $FILES
do
  echo "Processing $f file..."
  # take action on each file. $f store current file name
  shared-wasm -o ${f}
done
cd ..
