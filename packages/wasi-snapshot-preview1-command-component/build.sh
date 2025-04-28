#!/bin/bash
# Copyright 2025 NetApp Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0

set -ex

wat2wasm preview1-ext.wat
wasm-tools component new preview1-ext.wasm --adapt wasi_snapshot_preview1=wasi_snapshot_preview1.command_ext.wasm -o component.wasm

# Inspect the generated `component.wasm`
wasm-tools validate component.wasm --features component-model
wasm-tools component wit component.wasm

JCO="$HOME/Development/netapp/wasm/jco/src/jco.js"
#jco transpile component.wasm -o component -I --no-wasi-shim
$JCO transpile component.wasm -o component-worker -I --no-wasi-shim
$JCO transpile component.wasm --async-mode -o component-jspi -I --no-wasi-shim

# bug in jco to add Network, TerminalOutput, TerminalInput imports to resources
sed -i .bak "s/let exports0;/let exports0;\nconst \{ Network \} = imports\[\"wasi:sockets\/instance-network\"\];\nconst \{ TerminalInput \} = imports\[\"wasi:cli\/terminal-stdin\"\];\nconst \{ TerminalOutput \} = imports\[\"wasi:cli\/terminal-stdout\"\];/g" component-worker/component.js
sed -i .bak 's/e instanceof Error$1/true/g' component-worker/component.js
rm component-worker/component.js.bak

# bug in jco to add Network, TerminalOutput, TerminalInput imports to resources
sed -i .bak "s/let exports0;/let exports0;\nconst \{ Network \} = imports\[\"wasi:sockets\/instance-network\"\];\nconst \{ TerminalInput \} = imports\[\"wasi:cli\/terminal-stdin\"\];\nconst \{ TerminalOutput \} = imports\[\"wasi:cli\/terminal-stdout\"\];/g" component-jspi/component.js
# todo: fix issue with instanceof:
sed -i .bak "s/ret instanceof Pollable/true/g" component-jspi/component.js
sed -i .bak 's/e instanceof Error$1/true/g' component-jspi/component.js
rm component-jspi/component.js.bak

npx tsc -p .
