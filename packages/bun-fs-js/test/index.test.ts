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

import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { test, describe, beforeAll, beforeEach, expect, afterAll } from "vitest";

// @ts-ignore
globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;
// @ts-ignore
globalThis.afterAll = afterAll;
// noinspection JSConstantReassignment
globalThis.describe = describe;
// @ts-ignore
globalThis.expect = expect;
// @ts-ignore
// noinspection JSConstantReassignment
globalThis.test = test;

import { getOriginPrivateDirectory, FileSystemDirectoryHandle, memory } from "@netapplabs/fs-js";
import { bun } from "../src/index.js";

import { TestsFileSystemHandle } from "@netapplabs/fs-js";

let root: FileSystemDirectoryHandle;
const testFolderPath1 = "./testfolder1";
const testFolderPath2 = "./testfolder2";

const getBunRoot = async () => {
    root = await getOriginPrivateDirectory(bun, testFolderPath1, false);
    return root;
};

const getBunRootWrapped = async () => {
    root = await getOriginPrivateDirectory(bun, testFolderPath2, true);
    return root;
};

const beforeAllFunc1 = async () => {
    if (!existsSync(testFolderPath1)) {
        await mkdir(testFolderPath1);
    }
};

const beforeAllFunc2 = async () => {
    if (!existsSync(testFolderPath2)) {
        await mkdir(testFolderPath2);
    }
};

const afterAllFunc1 = async () => {
    await rm(testFolderPath1, { force: true, recursive: true });
};

const afterAllFunc2 = async () => {
    await rm(testFolderPath2, { force: true, recursive: true });
};

TestsFileSystemHandle("bun", getBunRoot, beforeAllFunc1, afterAllFunc1);
TestsFileSystemHandle("bun", getBunRootWrapped, beforeAllFunc2, afterAllFunc2);
