#!/bin/bash
set -ex

wat2wasm preview1-sockets.wat
wasm-tools component new preview1-sockets.wasm --adapt wasi_snapshot_preview1=wasi_snapshot_preview1.command_sockets.wasm -o component.wasm

# Inspect the generated `component.wasm`
wasm-tools validate component.wasm --features component-model
wasm-tools component wit component.wasm

JCO="$HOME/Development/netapp/wasm/jco/src/jco.js"
#jco transpile component.wasm -o component -I --no-wasi-shim
$JCO transpile component.wasm -o component-worker -I --no-wasi-shim
$JCO transpile component.wasm --async-mode -o component-jspi -I --no-wasi-shim

# bug in jco to add Network, TerminalOutput, TerminalInput imports to resources
sed -i .bak "s/let exports0;/let exports0;\nconst \{ Network \} = imports\[\"wasi:sockets\/instance-network\"\];\nconst \{ TerminalInput \} = imports\[\"wasi:cli\/terminal-stdin\"\];\nconst \{ TerminalOutput \} = imports\[\"wasi:cli\/terminal-stdout\"\];/g" component-worker/component.js
rm component-worker/component.js.bak

# bug in jco to add Network, TerminalOutput, TerminalInput imports to resources
sed -i .bak "s/let exports0;/let exports0;\nconst \{ Network \} = imports\[\"wasi:sockets\/instance-network\"\];\nconst \{ TerminalInput \} = imports\[\"wasi:cli\/terminal-stdin\"\];\nconst \{ TerminalOutput \} = imports\[\"wasi:cli\/terminal-stdout\"\];/g" component-jspi/component.js
# todo: fix issue with instanceof:
sed -i .bak "s/ret instanceof Pollable/true/g" component-jspi/component.js
rm component-jspi/component.js.bak

npx tsc -p .
