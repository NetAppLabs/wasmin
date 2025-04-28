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

cd apps/bun-shell
rm -f dist/*.wasm
yarn build
sed_args=""
for from in `egrep -o "\./.*\.wasm" app.js `; do
   to=$(find . -name "$(echo $from | sed -e 's/\.\///g' -e 's/00000000/\*/')")
   to=$(echo $to | sed -e 's/\.\/dist\///g' -e 's/\./\\\./g')
   from=$(echo $from | sed -e 's/\.\///g' -e 's/\./\\\./g')
   sed_args="$sed_args -e 's/$from/$to/g'"
done
cat app.js | bash -c "sed $sed_args" > dist/app.js
cd ../..

bun build ./apps/bun-shell/dist/app.js --compile --asset-naming="[name].[ext]" --outfile=wasmin-bun