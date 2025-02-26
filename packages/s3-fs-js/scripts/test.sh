#!/bin/bash

set -e

TEST_TARGET="test-ava"
if [ -n "${1}" ]; then
  TEST_TARGET="${1}"
fi

export S3_URL="s3://localhost:9000/bucket?accessKeyId=test&secretAccessKey=test&insecure=true&byterange=false"
TESTRUN="testrun-$RANDOM"
S3_TEST_DIR="/tmp/s3-fs-js-$TESTRUN"
S3_TEST_SERVER_LOG="/tmp/s3fakeserver-$TESTRUN.log"

mkdir -p ${S3_TEST_DIR}

if [[ "${TEST_TARGET}" == *"ava"* ]]; then
    ./scripts/setup-s3-test-dir.sh ${S3_TEST_DIR} $(id -u) $(id -g)
fi
cd ./s3fakeserver
go build
./s3fakeserver ${S3_TEST_DIR} &> $S3_TEST_SERVER_LOG &
GO_S3_PID=$!
cd ..

function kill_go_s3() {
    EXITCODE=$?
	echo "Stopping go-s3"
	kill $GO_S3_PID
    if [ $EXITCODE -ne 0 ]; then
        cat $S3_TEST_SERVER_LOG
    fi
}

trap kill_go_s3 EXIT

echo "Test using ${TEST_TARGET} and S3 via s3fakeserver on directory ${S3_TEST_DIR} writing server log to $S3_TEST_SERVER_LOG"
yarn ${TEST_TARGET}
