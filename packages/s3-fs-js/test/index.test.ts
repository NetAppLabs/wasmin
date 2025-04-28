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

import { getDirectoryHandleByURL, RegisterProvider, FileSystemDirectoryHandle, memory } from "@netapplabs/fs-js";
import { s3 } from "../src/index.js";

import { TestsFileSystemHandle } from "@netapplabs/fs-js";

const s3Url = process.env.S3_URL || 's3://127.0.0.1/invalid/';
RegisterProvider("s3", s3);

let root: FileSystemDirectoryHandle;

const getS3Root = async () => {
    root = await getDirectoryHandleByURL(s3Url, false);
    return root;
};

const getS3RootWrapped = async () => {
    root = await getDirectoryHandleByURL(s3Url, true);
    return root;
};

const beforeAllFunc1 = async () => {
};

const beforeAllFunc2 = async () => {
};

const afterAllFunc1 = async () => {
};

const afterAllFunc2 = async () => {
};

TestsFileSystemHandle("s3", getS3Root, beforeAllFunc1, afterAllFunc1);
//TestsFileSystemHandle("s3", getS3RootWrapped, beforeAllFunc2, afterAllFunc2);
