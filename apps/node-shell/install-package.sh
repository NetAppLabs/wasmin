#!/bin/bash


LOCAL_REPO="${HOME}/node_modules"

LOCAL_PKG="${LOCAL_REPO}/@netapplabs/node-shell"

mkdir -p ${LOCAL_PKG}

cp -r dist/* ${LOCAL_PKG}/

cat <<EOF > ${LOCAL_PKG}/package.json
{
  "name": "@netapplabs/node-shell",
  "type": "module",
  "main": "./index.js"
}
EOF
