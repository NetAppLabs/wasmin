import { startShell } from "@wasmin/shell";
//import { RegisterProvider } from "@netapplabs/fs-js";
//import { s3 } from "@wasmin/s3-fs-js";

// File class was added as experimental in node v19.2
//import { File } from "node:buffer";

//RegisterProvider("s3", s3);

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}

export async function main() {
	await startShell();
}

(async () => {
    await main();
})();