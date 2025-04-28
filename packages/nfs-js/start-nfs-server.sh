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
