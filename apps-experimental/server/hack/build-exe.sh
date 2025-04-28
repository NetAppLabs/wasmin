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


mkdir -p exe || true

pkg -t node18-macos-x64 dist/server.cjs.js -o exe/server-macos-x86 -c pkg.json
#pkg -t node18-win-x64 dist/server.cjs.js -o exe/server-win-x86
#pkg -t node18-linuxstatic-x64 dist/server.cjs.js -o exe/server-linux-x86

#pkg -t node19-macos-x64 dist/server.cjs.js -o exe/server-macos-x86
