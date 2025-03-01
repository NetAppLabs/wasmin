#!/bin/bash

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
