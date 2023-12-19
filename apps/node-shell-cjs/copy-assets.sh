#!/bin/bash


LOCAL_REPO="$(pwd)/assets"

LOCAL_PKG="${LOCAL_REPO}/@wasmin/node-shell"

mkdir -p ${LOCAL_PKG}

cp -r ../node-shell/dist/* ${LOCAL_PKG}/
cp ${LOCAL_PKG}/wasmComponentWorkerThreadNode.js ${LOCAL_PKG}/wasmComponentWorkerThreadNode.mjs

cat <<EOF > ${LOCAL_PKG}/package.json
{
  "name": "@wasmin/node-shell",
  "type": "module",
  "main": "./index.js"
}
EOF
