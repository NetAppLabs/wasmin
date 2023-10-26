import { startNodeShell } from "./node.js";
export { getSecretStore, getRootFS } from "./node.js";

export async function startShell(rootfsDriver?: any, env?: Record<string, string>) {
    await startNodeShell(rootfsDriver, env);
}
