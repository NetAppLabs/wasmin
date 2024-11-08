#!/bin/bash

set -e

TEST_TARGET="test-ava"
if [ -n "${1}" ]; then
  TEST_TARGET="${1}"
fi

S3_TEST_DIR="/tmp/s3-js-testrun-$RANDOM"
mkdir -p ${S3_TEST_DIR}

./scripts/setup-s3-test-dir.sh ${S3_TEST_DIR} $(id -u) $(id -g)

cd ./s3fakeserver
go build
./s3fakeserver ${S3_TEST_DIR} &> /tmp/go-s3.log &
GO_S3_PID=$!
cd ..

function kill_go_s3() {
    EXITCODE=$?
	echo "Stopping go-nfs"
	kill $GO_S3_PID
    if [ $EXITCODE -ne 0 ]; then
        cat /tmp/go-s3.log
    fi
}

trap kill_go_s3 EXIT

echo "Test using ${TEST_TARGET} and S3 via s3fakeserver on directory ${S3_TEST_DIR}"
yarn ${TEST_TARGET}