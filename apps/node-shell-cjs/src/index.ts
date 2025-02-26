import { startShell } from "@netapplabs/shell";
import { getAsset, isSea} from 'node:sea';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { setWorkerOverrideUrl } from '@netapplabs/wasi-js';

// File class was added as experimental in node v19.2
import { File } from "node:buffer";

if (!globalThis.File) {
    // @ts-ignore
    globalThis.File = File;
}

let tmpDir = '/tmp/wasmin-tmp/';
let tmpDirUrl = `file://${tmpDir}`;

export async function copyResourcesToTmp() {
    if (isSea()) {
        let assetsIndex = getAsset("assetsIndex.json");
        let td = new TextDecoder();
        let assetsIndexJson = td.decode(assetsIndex as ArrayBuffer)
        let assetsIndexObj = JSON.parse(assetsIndexJson);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }
        for (let k in assetsIndexObj){
            let asFile = getAsset(k) as ArrayBuffer;
            const fullPath = path.join( tmpDir, k );
            let fileArr = new Uint8Array(asFile);
            fs.writeFileSync(fullPath, fileArr);
        }
        let newWorker1TmpFileUrl = `${tmpDirUrl}/wasmComponentWorkerThreadNode.js`;
        let newWorker2TmpFileUrl = `${tmpDirUrl}/wasmCoreWorkerThreadNode.js`;
        let newWorker3TmpFileUrl = `${tmpDirUrl}/wasiWorkerThreadNode.js`;
        setWorkerOverrideUrl('./wasmComponentWorkerThreadNode.js', newWorker1TmpFileUrl);
        setWorkerOverrideUrl('./wasmCoreWorkerThreadNode.js', newWorker2TmpFileUrl);
        setWorkerOverrideUrl('./wasiWorkerThreadNode.js', newWorker3TmpFileUrl);
    }
}


export async function main() {
	await startShell();
}

(async () => {
    await copyResourcesToTmp();
    await main();
})();
