import { startNodeShell } from "./node.js";
export { getSecretStore, getRootFS } from "./node.js";
import { FileSystemDirectoryHandle } from "@wasm-env/fs-js";

export async function startShell(rootfs?: FileSystemDirectoryHandle, env?: Record<string, string>) {
    await startNodeShell(rootfs, env);
}
