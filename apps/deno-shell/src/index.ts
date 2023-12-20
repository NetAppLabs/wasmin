import { startShell } from "@wasmin/shell";
import process from "node:process";
import { main } from "./entry.js";

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}

(async () => {
    await main();
})();
