
import { test, describe, beforeAll, beforeEach, expect, afterAll } from 'vitest';

globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;
globalThis.afterAll = afterAll;
globalThis.describe = describe;
globalThis.expect = expect;
globalThis.test = test;

import { getOriginPrivateDirectory, memory } from "../src";
import { TestsFileSystemHandle } from "../src";

const getMemoryRoot = async () => {
    const root = await getOriginPrivateDirectory(memory, "", false);
    return root;
};

const getMemoryRootWrapped = async () => {
    const root = await getOriginPrivateDirectory(memory, "", true);
    return root;
};

TestsFileSystemHandle("memory", getMemoryRoot);
TestsFileSystemHandle("memory", getMemoryRootWrapped);
