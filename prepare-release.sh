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


RELEASE_BUMP="patch"

if [ -n "${1}" ]; then
    RELEASE_BUMP="${1}"
fi

# bump main project package.json
npx standard-version -r ${RELEASE_BUMP} --dry-run

CURRENT_VESRION=$(cat package.json | jq -r .version)
VERSION="${CURRENT_VERSION}-next"

RELEASE_NOTES="Change to version ${VERSION}"

# bump project pagckages package.json
cat <<EOF > .changeset/UNIQUE_ID.md
---
"@netapplabs/bun-fs-js": ${RELEASE_BUMP}
"@netapplabs/deno-fs-js": ${RELEASE_BUMP}
"@netapplabs/eslint-config-custom": ${RELEASE_BUMP}
"@netapplabs/fs-js": ${RELEASE_BUMP}
"@netapplabs/github-fs-js": ${RELEASE_BUMP}
"@netapplabs/node-fs-js": ${RELEASE_BUMP}
"@netapplabs/s3-fs-js": ${RELEASE_BUMP}
"@netapplabs/shell": ${RELEASE_BUMP}
"@netapplabs/tsconfig": ${RELEASE_BUMP}
"@netapplabs/wasi-js": ${RELEASE_BUMP}
"@netapplabs/wasi-snapshot-preview1-command-component": ${RELEASE_BUMP}
"@netapplabs/wasi-snapshot-preview2": ${RELEASE_BUMP}
"@netapplabs/wasm-promisify": ${RELEASE_BUMP}
---

${RELEASE_NOTES}

EOF

npx @changesets/cli version
