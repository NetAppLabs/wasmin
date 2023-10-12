import { startNodeShell } from "./node.js";
export { getSecretStore, getRootFS } from "./node.js";
import { FileSystemDirectoryHandle } from "@wasmin/fs-js";

export async function startShell(rootfs?: FileSystemDirectoryHandle, env?: Record<string, string>) {
    await startNodeShell(rootfs, env);
}
