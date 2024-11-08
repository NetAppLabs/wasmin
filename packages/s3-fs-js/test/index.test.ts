import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";

import { getDirectoryHandleByURL, RegisterProvider, FileSystemDirectoryHandle, memory } from "@wasmin/fs-js";
import { s3 } from "../src/index.js";

import { TestsFileSystemHandle } from "@wasmin/fs-js";

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
