import { startNodeShell } from "./node.js";
export { getSecretStore, getRootFS } from "./node.js";

export async function startShell(rootfs?: FileSystemDirectoryHandle, env?: Record<string, string>) {
    await startNodeShell(rootfs, env);
}
