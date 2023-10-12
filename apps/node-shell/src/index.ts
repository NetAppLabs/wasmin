import { startShell } from "@wasmin/shell";

// File class was added as experimental in node v19.2
import { File } from "node:buffer";

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}

(async () => {
    await startShell();
})();
