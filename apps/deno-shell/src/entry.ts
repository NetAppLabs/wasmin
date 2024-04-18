import { startShell } from "@wasmin/shell";
import { deno as denofs } from "@wasmin/deno-fs-js";
import { setWorkerOverrideUrl } from '@wasmin/wasi-js';

export async function main() {

    setWorkerOverrideUrl('./wasmComponentWorkerThread.js', import.meta.resolve("./wasmComponentWorkerThread.js"));
    setWorkerOverrideUrl('./wasmCoreWorkerThread.js', import.meta.resolve("./wasmCoreWorkerThread.js"));
    setWorkerOverrideUrl('./wasiWorkerThread.js', import.meta.resolve("./wasiWorkerThread.js"));

    await startShell(denofs);
}
