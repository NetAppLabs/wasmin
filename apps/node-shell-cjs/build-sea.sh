#!/bin/bash
set -e

yarn build-sea

EXE_NAME="wasmin-node"
rm ${EXE_NAME} || true

node --experimental-sea-config sea-config.json
NODE_PATH=$(command -v node)
echo "Copying node from ${NODE_PATH}"

cp ${NODE_PATH} ${EXE_NAME}

chmod ug+w ${EXE_NAME}
if [ `uname -s` == "Darwin" ]; then
	codesign --remove-signature ${EXE_NAME}
fi

if [ `uname -s` == "Darwin" ]; then
    npx postject ${EXE_NAME} NODE_SEA_BLOB sea-prep.blob \
        --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
        --macho-segment-name NODE_SEA
else
    npx postject ${EXE_NAME} NODE_SEA_BLOB sea-prep.blob \
        --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
fi

if [ `uname -s` == "Darwin" ]; then
    codesign --sign - ${EXE_NAME}
fi
