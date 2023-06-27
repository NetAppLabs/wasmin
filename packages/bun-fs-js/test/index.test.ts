import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { test, describe, beforeAll, beforeEach, expect, afterAll } from 'bun:test';

globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;
globalThis.afterAll = afterAll;
globalThis.describe = describe;
globalThis.expect = expect;
globalThis.test = test;

import { getOriginPrivateDirectory, FileSystemDirectoryHandle, memory } from "@wasm-env/fs-js";
import { bun } from "../src/index.js";

import { TestsFileSystemHandle } from "@wasm-env/fs-js";

let root: FileSystemDirectoryHandle;
const testFolderPath = "./testfolder";

const getBunRoot = async () => {
    root = await getOriginPrivateDirectory(bun, testFolderPath);
    return root;
};

const beforeAllFunc = async () => {
    if (!existsSync(testFolderPath)) {
        await mkdir(testFolderPath);
    }
};

const afterAllFunc = async () => {
    await rm(testFolderPath, { force: true, recursive: true });
};

TestsFileSystemHandle("bun", getBunRoot, beforeAllFunc, afterAllFunc);
