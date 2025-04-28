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

set -x

if ! which vitest &> /dev/null; then
    yarn test
    exit $?
fi

if [ ! -f /tmp/go-nfs/osnfs ]; then
    rm -rf /tmp/go-nfs
fi

if [ ! -d /tmp/go-nfs ]; then
    git clone https://github.com/willscott/go-nfs.git /tmp/go-nfs
    pushd /tmp/go-nfs
    go build ./example/osnfs
    popd
fi

mkdir -p /tmp/nfs-js-test-non-wrapped /tmp/nfs-js-test-wrapped

/tmp/go-nfs/osnfs /tmp/nfs-js-test-non-wrapped 20990 &> /tmp/go-nfs/osnfs-non-wrapped.log &
GO_NFS_NON_WRAPPED_PID=$!

/tmp/go-nfs/osnfs /tmp/nfs-js-test-wrapped 20940 &> /tmp/go-nfs/osnfs-wrapped.log &
GO_NFS_WRAPPED_PID=$!

function kill_go_nfs() {
    kill $GO_NFS_NON_WRAPPED_PID
    kill $GO_NFS_WRAPPED_PID
}

set -e
trap kill_go_nfs EXIT

vitest run --globals
