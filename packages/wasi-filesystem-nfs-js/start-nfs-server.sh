#!/bin/bash


if [ ! -d /tmp/go-nfs ]; then
    git clone https://github.com/willscott/go-nfs.git /tmp/go-nfs
    pushd /tmp/go-nfs
    go build ./example/osnfs
    popd
fi

nfs_path=" /tmp/go-nfs-server"
mkdir -p ${nfs_path}

mkdir -p ${nfs_path}/directory
touch ${nfs_path}/file || true

echo "starting nfs server on ${nfs_path}"
/tmp/go-nfs/osnfs ${nfs_path} 20490 
