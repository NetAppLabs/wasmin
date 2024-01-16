import path from "node:path";
import { getOriginPrivateDirectory, FileSystemDirectoryHandle, isBun } from "@wasmin/fs-js";
import { node } from "@wasmin/node-fs-js";
import { memory } from "@wasmin/fs-js";
import { constructWasiForTest, Test } from "@wasmin/wasi-js";

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
            if (isBun()) {
                const bunmod = await import("@wasmin/bun-fs-js");
                const bun = bunmod.bun;
                return getOriginPrivateDirectory(bun, path.resolve(path.join("tests", "fixtures")));
            } else {
                return getOriginPrivateDirectory(node, path.resolve(path.join("tests", "fixtures")));
            }
        }
    }
}

export async function constructWasiForTestRuntimeDetection(testCase: Test) {
    if (isBun()) {
        const bunmod = await import("@wasmin/bun-fs-js");
        const bun = bunmod.bun;
        return constructWasiForTest(testCase, bun);
    } else {
        return constructWasiForTest(testCase, node);
    }
}