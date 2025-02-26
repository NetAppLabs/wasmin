import { startShell } from "@netapplabs/shell";
import { bun } from "@netapplabs/bun-fs-js";
import { setWorkerOverrideUrl } from '@netapplabs/wasi-js';

export async function main() {
    await startShell(bun);
}