#!/bin/bash

set -e

S3_TEST_DIR=$1
S3_UID=$2
S3_GID=$3
if [ -z $S3_UID ]; then
    S3_UID=nobody
fi
if [ -z $S3_GID ]; then
    S3_GID=nogroup
fi

mkdir -p ${S3_TEST_DIR}/first ${S3_TEST_DIR}/quatre
echo -n "In order to make sure that this file is exactly 123 bytes in size, I have written this text while watching its chars count." > ${S3_TEST_DIR}/annar
touch ${S3_TEST_DIR}/3 ${S3_TEST_DIR}/first/comment ${S3_TEST_DIR}/quatre/points
chmod 555 ${S3_TEST_DIR}/quatre
chmod 775 ${S3_TEST_DIR}/first
chmod 664 ${S3_TEST_DIR}/annar
chmod 444 ${S3_TEST_DIR}/3
chown -R $S3_UID:$S3_GID ${S3_TEST_DIR}
