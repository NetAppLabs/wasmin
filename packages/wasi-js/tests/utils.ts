import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { getOriginPrivateDirectory, FileSystemDirectoryHandle, isBun } from "@netapplabs/fs-js";
import { node } from "@netapplabs/node-fs-js";
import { memory } from "@netapplabs/fs-js";
import { constructWasiForTest, Test } from "../src/testutil";

type backendType = "fs-js" | "nfs-js" | "memory";
export let backend: backendType = "memory";
switch (process.env.TEST_WASI_USING_BACKEND) {
    case "memory":
        backend = "memory";
        break;
    case "nfs-js":
        backend = "nfs-js";
        break;
    default:
        backend = "fs-js";
        break;
}

export async function getRootHandle(backend: string): Promise<FileSystemDirectoryHandle> {
    const nfsUrl = "nfs://127.0.0.1" + path.resolve(".", "tests", "fixtures") + "/";

    switch (backend) {
        case "memory":
            return getOriginPrivateDirectory(memory);
        //case "nfs-js": return new NfsDirectoryHandle(nfsUrl);
        default: {
            let fixturesTestDir = path.resolve(path.join("tests", "fixtures"));
            let copyFixturesToTmp = true;
            if (copyFixturesToTmp) {
                let sourceDir = fixturesTestDir;
                let dstTemp = await fs.mkdtemp(path.join(os.tmpdir(), "wasmin-tests-"));
                await fs.cp(sourceDir, dstTemp, {recursive: true});
                fixturesTestDir = dstTemp;
            }
            if (isBun()) {
                const bunmod = await import("@netapplabs/bun-fs-js");
                const bun = bunmod.bun;
                return getOriginPrivateDirectory(bun, fixturesTestDir);
            } else {
                return getOriginPrivateDirectory(node, fixturesTestDir);
            }
        }
    }
}

export async function constructWasiForTestRuntimeDetection(testCase: Test) {
    if (isBun()) {
        const bunmod = await import("@netapplabs/bun-fs-js");
        const bun = bunmod.bun;
        return constructWasiForTest(testCase, bun);
    } else {
        return constructWasiForTest(testCase, node);
    }
}