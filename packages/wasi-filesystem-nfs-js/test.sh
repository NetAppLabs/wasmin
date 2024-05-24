#!/bin/bash

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

mkdir -p /tmp/wasi-nfs-js-test-non-wrapped /tmp/wasi-nfs-js-test-wrapped

/tmp/go-nfs/osnfs /tmp/wasi-nfs-js-test-non-wrapped 20995 &> /tmp/go-nfs/osnfs-wasi-non-wrapped.log &
GO_NFS_NON_WRAPPED_PID=$!

/tmp/go-nfs/osnfs /tmp/wasi-nfs-js-test-wrapped 20945 &> /tmp/go-nfs/osnfs-wasi-wrapped.log &
GO_NFS_WRAPPED_PID=$!

function kill_go_nfs() {
    kill $GO_NFS_NON_WRAPPED_PID
    kill $GO_NFS_WRAPPED_PID
}

set -e
trap kill_go_nfs EXIT

vitest run --globals
