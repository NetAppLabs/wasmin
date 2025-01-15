import { startShell } from "@wasmin/shell";
import { bun } from "@wasmin/bun-fs-js";
import { setWorkerOverrideUrl } from '@netapplabs/wasi-js';

export async function main() {
    await startShell(bun);
}