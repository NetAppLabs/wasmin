import { TestsFileSystemHandle, getOriginPrivateDirectory } from "@wasmin/fs-js";
import { wasiFilesystemNfs } from "../component/index.js";

// Needed specifically for bun:
import { test, describe, beforeAll, beforeEach, expect, afterAll } from "vitest";
globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;
globalThis.afterAll = afterAll;
globalThis.describe = describe;
globalThis.expect = expect;
globalThis.test = test;

const testNonWrappedURL =
    "nfs://localhost/tmp/nfs-js-test-non-wrapped?uid=502&gid=20&nfsport=20995&mountport=20995&auto-traverse-mounts=0";
const testWrappedURL =
    "nfs://localhost/tmp/nfs-js-test-wrapped?uid=502&gid=20&nfsport=20945&mountport=20945&auto-traverse-mounts=0";

const getNfsRoot = async () => {
    return getOriginPrivateDirectory(wasiFilesystemNfs, testNonWrappedURL, false);
};

const getNfsRootWrapped = async () => {
    return getOriginPrivateDirectory(wasiFilesystemNfs, testWrappedURL, true);
};

TestsFileSystemHandle("nfs", getNfsRoot);
TestsFileSystemHandle("nfs", getNfsRootWrapped);
