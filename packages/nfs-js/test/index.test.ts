/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestsFileSystemHandle, getOriginPrivateDirectory } from "@netapplabs/fs-js";
import { nfs } from "../component";


//globalThis.WASI_DEBUG = true;
// Needed specifically for bun:
import { test, describe, beforeAll, beforeEach, expect, afterAll } from "vitest";

const testNonWrappedURL =
    "nfs://localhost/tmp/nfs-js-test-non-wrapped?uid=502&gid=20&nfsport=20990&mountport=20990&auto-traverse-mounts=0";
const testWrappedURL =
    "nfs://localhost/tmp/nfs-js-test-wrapped?uid=502&gid=20&nfsport=20940&mountport=20940&auto-traverse-mounts=0";

const getNfsRoot = async () => {
    return getOriginPrivateDirectory(nfs, testNonWrappedURL, false);
};

const getNfsRootWrapped = async () => {
    return getOriginPrivateDirectory(nfs, testWrappedURL, true);
};

TestsFileSystemHandle("nfs", getNfsRoot);
TestsFileSystemHandle("nfs", getNfsRootWrapped);
