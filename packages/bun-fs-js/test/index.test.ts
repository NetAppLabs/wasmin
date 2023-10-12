import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { test, describe, beforeAll, beforeEach, expect, afterAll } from "vitest";

globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;
globalThis.afterAll = afterAll;
globalThis.describe = describe;
globalThis.expect = expect;
globalThis.test = test;

import { getOriginPrivateDirectory, FileSystemDirectoryHandle, memory } from "@wasmin/fs-js";
import { bun } from "../src/index.js";

import { TestsFileSystemHandle } from "@wasmin/fs-js";

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
