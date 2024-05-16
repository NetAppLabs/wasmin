
import staticFiles from "./embed/static/dir.ts"

import * as fsSync from "node:fs";
import {promises as fs} from "node:fs";
import path from "node:path";

function debugMessage(...args: any[]) {
    if (globalThis.SHELL_DEBUG) {
        console.debug(...args);
    }
}

const tmpDir = "/tmp/wasmin-deno-tmp";

if (!fsSync.existsSync(tmpDir)) {
    await fs.mkdir(tmpDir);
}

let fileList = staticFiles.list();
for (const fileName of fileList) {
    debugMessage(`Writing static file: ${fileName} to dir ${tmpDir}`);

    let file = await staticFiles.load(fileName);
    let fileConents = await file.bytes();
    let filePath = path.join(tmpDir, fileName);

    await fs.writeFile(filePath, fileConents);
}

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}

const mainentry = await import("../dist/entry.js");

(async () => {
    await mainentry.main();
})();
