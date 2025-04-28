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

import { expect } from "https://deno.land/x/expect/mod.ts";

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  it as test,
} from "https://deno.land/std@0.220.1/testing/bdd.ts";

// @ts-ignore
globalThis.beforeAll = beforeAll;
// @ts-ignore
globalThis.beforeEach = beforeEach;
// @ts-ignore
globalThis.afterAll = afterAll;
// @ts-ignore
globalThis.describe = describe;
// @ts-ignore
globalThis.expect = expect;
// @ts-ignore
globalThis.test = test;

import {
  FileSystemDirectoryHandle,
  getOriginPrivateDirectory,
} from "npm:@netapplabs/fs-js";
import { denofh } from "../src/mod.ts";

import { TestsFileSystemHandleImportTestDefinitions } from "npm:@netapplabs/fs-js";

let root: FileSystemDirectoryHandle;
const testFolderPath1 = "./testfolder1";
const testFolderPath2 = "./testfolder2";

const getDenoRoot = async () => {
  root = await getOriginPrivateDirectory(denofh, testFolderPath1, false);
  return root;
};

const getDenoRootWrapped = async () => {
  root = await getOriginPrivateDirectory(denofh, testFolderPath2, true);
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

TestsFileSystemHandleImportTestDefinitions(
  "deno",
  test,
  describe,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  getDenoRoot,
  beforeAllFunc1,
  afterAllFunc1,
);
TestsFileSystemHandleImportTestDefinitions(
  "deno",
  test,
  describe,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  getDenoRoot,
  beforeAllFunc1,
  afterAllFunc1,
);
