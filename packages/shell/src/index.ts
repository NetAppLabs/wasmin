
import { startNodeShell } from "./node";
export { getSecretStore, getRootFS } from './node';

export async function startShell(rootfs?: FileSystemDirectoryHandle, env?: Record<string,string>) {
    await startNodeShell(rootfs, env);
}

