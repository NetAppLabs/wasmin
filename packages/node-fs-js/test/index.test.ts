import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";

import { getOriginPrivateDirectory, FileSystemDirectoryHandle, memory } from "@wasm-env/fs-js";
import { node } from "../src/index.js";

import { TestsFileSystemHandle } from "@wasm-env/fs-js";

let root: FileSystemDirectoryHandle;
const testFolderPath1 = "./testfolder1";
const testFolderPath2 = "./testfolder2";

const getNodeRoot = async () => {
    root = await getOriginPrivateDirectory(node, testFolderPath1, false);
    return root;
};

const getNodeRootWrapped = async () => {
    root = await getOriginPrivateDirectory(node, testFolderPath2, true);
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
    }};

const afterAllFunc1 = async () => {
    await rm(testFolderPath1, { force: true, recursive: true });
};

const afterAllFunc2 = async () => {
    await rm(testFolderPath2, { force: true, recursive: true });
};

TestsFileSystemHandle("node", getNodeRoot, beforeAllFunc1, afterAllFunc1);
TestsFileSystemHandle("node", getNodeRootWrapped, beforeAllFunc2, afterAllFunc2);
