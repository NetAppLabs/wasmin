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
sleep 1

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
