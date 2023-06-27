import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";

import { getOriginPrivateDirectory, FileSystemDirectoryHandle, memory } from "@wasm-env/fs-js";
import { node } from "../src/index.js";

import { TestsFileSystemHandle } from "@wasm-env/fs-js";

let root: FileSystemDirectoryHandle;
const testFolderPath = "./testfolder";

const getNodeRoot = async () => {
    root = await getOriginPrivateDirectory(node, testFolderPath);
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

TestsFileSystemHandle("node", getNodeRoot, beforeAllFunc, afterAllFunc);
