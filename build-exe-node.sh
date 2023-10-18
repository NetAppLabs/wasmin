#!/bin/bash
# see https://nodejs.org/api/single-executable-applications.html
set -ex


EXE_NAME="wasmin-node"

rm ${EXE_NAME} || true

yarn build
#cp apps/node-shell/dist/index.js apps/node-shell/dist/index.mjs
node --experimental-sea-config sea-config.json
cp $(command -v node) ${EXE_NAME}
chmod ug+w ${EXE_NAME}
codesign --remove-signature ${EXE_NAME}

#npx postject ${EXE_NAME} NODE_SEA_BLOB sea-prep.blob \
#    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2


npx postject ${EXE_NAME} NODE_SEA_BLOB sea-prep.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
    --macho-segment-name NODE_SEA

codesign --sign - ${EXE_NAME}


