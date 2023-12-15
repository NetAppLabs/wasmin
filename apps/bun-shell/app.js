import { main } from "./entry.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { setWorkerOverrideUrl } from '@wasmin/wasi-js';

// @ts-ignore
import worker1 from "./wasmComponentWorkerThread.wjs";
import worker2 from "./wasmCoreWorkerThread.wjs";
import worker3 from "./wasiWorkerThread.wjs";

// @ts-ignore
import wasm2 from "./component.core2-d5e61b33.wasm";
import wasm3 from "./component.core3-d5291b63.wasm";
import wasm4 from "./component.core4-bb5bc228.wasm";
import wasm5 from "./component.core5-a334057e.wasm";

import nfs_wasm1 from "./nfs_rs.core-7d17e485.wasm";
import nfs_wasm2 from "./nfs_rs.core2-e2392bca.wasm";
import nfs_wasm3 from "./nfs_rs.core3-caf2841d.wasm";
import nfs_wasm4 from "./nfs_rs.core4-ea2802d5.wasm";

const runTmpDir = "/tmp/wasmin-tmp";

const BUN_APP_DEBUG = false;

function debugMessage(...args) {
    if (BUN_APP_DEBUG) {
        console.debug(...args);
    }
}

(async () => {
    debugMessage("wasm2:", wasm2);
    debugMessage("wasm3:", wasm3);
    debugMessage("wasm4:", wasm4);
    debugMessage("wasm5:", wasm5);

    debugMessage("worker1:", worker1);


    if (!fs.existsSync(runTmpDir)){
        fs.mkdirSync(runTmpDir, { recursive: true });
    }
    
    const newWorker1TmpFileUrl = await copyFileToTmp(worker1);
    const newWorker2TmpFileUrl = await copyFileToTmp(worker2);
    const newWorker3TmpFileUrl = await copyFileToTmp(worker3);

    await copyFileToTmp(wasm2);
    await copyFileToTmp(wasm3);
    await copyFileToTmp(wasm4);
    await copyFileToTmp(wasm5);

    await copyFileToTmp(nfs_wasm1);
    await copyFileToTmp(nfs_wasm2);
    await copyFileToTmp(nfs_wasm3);
    await copyFileToTmp(nfs_wasm4);


    setWorkerOverrideUrl('./wasmComponentWorkerThread.js', newWorker1TmpFileUrl);
    setWorkerOverrideUrl('./wasmCoreWorkerThread.js', newWorker2TmpFileUrl);
    setWorkerOverrideUrl('./wasiWorkerThread.js', newWorker3TmpFileUrl);

    await main();
})();


async function copyFileToTmp(compiledFilePath) {
    const bunCompiledFile = Bun.file(compiledFilePath);
    const compiledBytes = await bunCompiledFile.arrayBuffer();
    let fileName = path.basename(compiledFilePath);
    // special case for bun's suffix of wasm files:
    if (fileName.endsWith(".wasm")) {
        fileName = fileName.replace('-0000000000000000','');
    }
    const newTmpFilePath = path.join(runTmpDir, fileName);
    debugMessage("writing worker file to ", newTmpFilePath);
    await Bun.write(newTmpFilePath, compiledBytes);
    const newTmpFileUrl = `file://${newTmpFilePath}`
    return newTmpFileUrl;
}