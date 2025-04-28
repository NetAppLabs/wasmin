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

set -x

rm wasi_snapshot_preview1.command.wasm
rm wasi_snapshot_preview1.reactor.wasm

#rm wasi_preview1_component_adapter.command.wasm
#rm wasi_preview1_component_adapter.reactor.wasm

#wget https://github.com/bytecodealliance/wasmtime/releases/download/dev/wasi_snapshot_preview1.command.wasm
#wget https://github.com/bytecodealliance/wasmtime/releases/download/dev/wasi_snapshot_preview1.reactor.wasm

cp ../../../wasi-preview1-component-adapter/wasi_snapshot_preview1.reactor.wasm .
cp ../../../wasi-preview1-component-adapter/wasi_snapshot_preview1.command.wasm .
cp ../../../wasi-preview1-component-adapter/wasi_snapshot_preview1.command_sockets.wasm .
cp ../../../wasi-preview1-component-adapter/wasi_snapshot_preview1.command_ext.wasm .
