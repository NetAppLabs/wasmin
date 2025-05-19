import { test, describe, beforeAll, beforeEach, expect, afterAll } from "vitest";

globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;
globalThis.afterAll = afterAll;
globalThis.describe = describe;
globalThis.expect = expect;
globalThis.test = test;

import { getOriginPrivateDirectory, memory, substituteSecretValue } from "../src";
import { TestsFileSystemHandle } from "../src";

const getMemoryRoot = async () => {
    const root = await getOriginPrivateDirectory(memory, "", false);
    return root;
};

const getMemoryRootWrapped = async () => {
    const root = await getOriginPrivateDirectory(memory, "", true);
    return root;
};

test("substituteSecretValueTest", () => {
    const secrets = {
        "test": "secret",
        "test2": "secret2"
    }
    let secString = "testing ${test} is ${test2}"
    let returnString = substituteSecretValue(secString, secrets);
    expect(returnString).toBe("testing secret is secret2")
    const secrets2 = {
        "test": {
            "sub": "secret"
        }
    }
    let secString2 = "${test.sub}"
    let returnString2 = substituteSecretValue(secString2, secrets2);
    expect(returnString2).toBe("secret")
});

TestsFileSystemHandle("memory", getMemoryRoot);
TestsFileSystemHandle("memory", getMemoryRootWrapped);
