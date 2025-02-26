import { TestsFileSystemHandle, getOriginPrivateDirectory } from "@netapplabs/fs-js";
import { nfs } from "../component";


//globalThis.WASI_DEBUG = true;
// Needed specifically for bun:
import { test, describe, beforeAll, beforeEach, expect, afterAll } from "vitest";

const testNonWrappedURL =
    "nfs://localhost/tmp/nfs-js-test-non-wrapped?uid=502&gid=20&nfsport=20990&mountport=20990&auto-traverse-mounts=0";
const testWrappedURL =
    "nfs://localhost/tmp/nfs-js-test-wrapped?uid=502&gid=20&nfsport=20940&mountport=20940&auto-traverse-mounts=0";

const getNfsRoot = async () => {
    return getOriginPrivateDirectory(nfs, testNonWrappedURL, false);
};

const getNfsRootWrapped = async () => {
    return getOriginPrivateDirectory(nfs, testWrappedURL, true);
};

TestsFileSystemHandle("nfs", getNfsRoot);
TestsFileSystemHandle("nfs", getNfsRootWrapped);
