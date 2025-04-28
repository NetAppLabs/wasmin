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
