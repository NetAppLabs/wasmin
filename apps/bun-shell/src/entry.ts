import { startShell } from "@wasmin/shell";
import { bun } from "@wasmin/bun-fs-js";


export async function main() {
    await startShell(bun);
}