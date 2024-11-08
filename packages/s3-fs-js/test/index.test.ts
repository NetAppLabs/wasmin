import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";

import { getDirectoryHandleByURL, RegisterProvider, FileSystemDirectoryHandle, memory } from "@wasmin/fs-js";
import { s3 } from "../src/index.js";

import { TestsFileSystemHandle } from "@wasmin/fs-js";

RegisterProvider("s3", s3);

let root: FileSystemDirectoryHandle;
const testFolderPath1 = "./testfolder1";
const testFolderPath2 = "./testfolder2";
const s3Url = "s3://localhost:9000/bucket?accessKeyId=test&secretAccessKey=test&insecure=true";

const getS3Root = async () => {
    root = await getDirectoryHandleByURL(s3Url, false);
    return root;
};

const getS3RootWrapped = async () => {
    root = await getDirectoryHandleByURL(s3Url, true);
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

TestsFileSystemHandle("s3", getS3Root, beforeAllFunc1, afterAllFunc1);
//TestsFileSystemHandle("s3", getS3RootWrapped, beforeAllFunc2, afterAllFunc2);
