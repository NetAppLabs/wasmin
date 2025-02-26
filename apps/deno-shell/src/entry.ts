import { startShell } from "@netapplabs/shell";
import { deno as denofs } from "@netapplabs/deno-fs-js";
import { setWorkerOverrideUrl } from '@netapplabs/wasi-js';

export async function main() {

    setWorkerOverrideUrl('./wasmComponentWorkerThread.js', import.meta.resolve("./wasmComponentWorkerThread.js"));
    setWorkerOverrideUrl('./wasmCoreWorkerThread.js', import.meta.resolve("./wasmCoreWorkerThread.js"));
    setWorkerOverrideUrl('./wasiWorkerThread.js', import.meta.resolve("./wasiWorkerThread.js"));

    await startShell(denofs);
}

// @ts-ignore
if (import.meta.main)  {
    (async () => {
        await main();
    })();
}
