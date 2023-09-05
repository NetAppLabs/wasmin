#!/bin/bash

if [ ! -d /tmp/go-nfs ]; then
    git clone https://github.com/willscott/go-nfs.git /tmp/go-nfs
    pushd /tmp/go-nfs
    go build ./example/osnfs
    popd
fi

mkdir -p /tmp/nfs-rs-component-test-non-wrapped /tmp/nfs-rs-component-test-wrapped

/tmp/go-nfs/osnfs /tmp/nfs-rs-component-test-non-wrapped 20490 &> /tmp/go-nfs/osnfs-non-wrapped.log &
GO_NFS_NON_WRAPPED_PID=$!

/tmp/go-nfs/osnfs /tmp/nfs-rs-component-test-wrapped 20940 &> /tmp/go-nfs/osnfs-wrapped.log &
GO_NFS_WRAPPED_PID=$!

function kill_go_nfs() {
    kill $GO_NFS_NON_WRAPPED_PID
    kill $GO_NFS_WRAPPED_PID
}

set -e
trap kill_go_nfs EXIT

bun test
