import { getOriginPrivateDirectory } from "@wasm-env/fs-js";
import { NfsDirectoryHandle } from "../component/index.js";
import { TestsFileSystemHandle } from "@wasm-env/fs-js";

// Needed specifically for bun:
import { test, describe, beforeAll, beforeEach, expect, afterAll } from "vitest";
globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;
globalThis.afterAll = afterAll;
globalThis.describe = describe;
globalThis.expect = expect;
globalThis.test = test;

const testNonWrappedURL = "nfs://localhost/tmp/nfs-rs-component-test-non-wrapped?uid=502&gid=20&nfsport=20490&mountport=20490&auto-traverse-mounts=0";
const testWrappedURL = "nfs://localhost/tmp/nfs-rs-component-test-wrapped?uid=502&gid=20&nfsport=20940&mountport=20940&auto-traverse-mounts=0";
const driver = (url: string) => new NfsDirectoryHandle(url);

const getComponentRoot = async () => {
    return getOriginPrivateDirectory(driver, testNonWrappedURL, false);
};

const getComponentRootWrapped = async () => {
    return getOriginPrivateDirectory(driver, testWrappedURL, true);
};


TestsFileSystemHandle("component", getComponentRoot);
TestsFileSystemHandle("component", getComponentRootWrapped);
