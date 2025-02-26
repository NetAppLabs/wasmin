#!/bin/bash


LOCAL_REPO="$(pwd)/assets"
rm -rf ${LOCAL_REPO}
mkdir -p ${LOCAL_REPO}

LOCAL_PKG="${LOCAL_REPO}/@netapplabs/node-shell"

mkdir -p ${LOCAL_PKG}

#cp -r ../node-shell/dist/* ${LOCAL_PKG}/
cp -r ./dist/* ${LOCAL_PKG}/

#cp ${LOCAL_PKG}/index.js ${LOCAL_PKG}/index.mjs
#cp ${LOCAL_PKG}/wasmComponentWorkerThreadNode.js ${LOCAL_PKG}/wasmComponentWorkerThreadNode.mjs

cat <<EOF > ${LOCAL_PKG}/package.json
{
  "name": "@netapplabs/node-shell",
  "type": "module",
  "main": "./index.js"
}
EOF
