
// TODO better solve this via
// https://github.com/oven-sh/bun/discussions/7846
// https://github.com/oven-sh/bun/pull/13421
// https://github.com/oven-sh/bun/pull/13421
//import "./icon.png" with { type: "file" };
//import { embeddedFiles } from "bun";
//
//console.log(embeddedFiles[0].name); // `icon-${hash}.png`

// see https://github.com/oven-sh/bun/issues/13552
// https://github.com/sfcompute/cli/tree/bephrem/sf-buy-ink

import { embeddedFiles } from "bun";

import { main } from "./entry.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { setWorkerOverrideUrl } from '@wasmin/wasi-js';

// @ts-ignore
import worker1 from "./wasmComponentWorkerThread.js" with { type: "file" };
import worker2 from "./wasmCoreWorkerThread.js" with { type: "file" };
import worker3 from "./wasiWorkerThread.js" with { type: "file" };

// @ts-ignore
import wasm2 from "./component.core2-00000000.wasm";
import wasm3 from "./component.core3-00000000.wasm";
import wasm4 from "./component.core4-00000000.wasm";

import nfs_wasm1 from "./nfs_rs.core-00000000.wasm";
import nfs_wasm2 from "./nfs_rs.core2-00000000.wasm";
import nfs_wasm3 from "./nfs_rs.core3-00000000.wasm";
import nfs_wasm4 from "./nfs_rs.core4-00000000.wasm";

import nu_shell_wasm from "./nu.async-00000000.wasm";

//const timeStamp = new Date().valueOf();
//const runTmpDir = `/tmp/wasmin-bun-tmp-${timeStamp}`;

globalThis.SHELL_DEBUG = false;
const runTmpDir = "/tmp/wasmin-tmp";

function debugMessage(...args) {
    if (globalThis.SHELL_DEBUG) {
        console.debug(...args);
    }
}

(async () => {
    debugMessage("wasm2:", wasm2);
    debugMessage("wasm3:", wasm3);
    debugMessage("wasm4:", wasm4);

    debugMessage("nfs_wasm1:", nfs_wasm1);
    debugMessage("nfs_wasm2:", nfs_wasm2);
    debugMessage("nfs_wasm3:", nfs_wasm3);
    debugMessage("nfs_wasm4:", nfs_wasm4);

    debugMessage("worker1:", worker1);
    debugMessage("worker2:", worker2);
    debugMessage("worker3:", worker3);

    debugMessage("nu_shell_wasm:", nu_shell_wasm);


    if (!fs.existsSync(runTmpDir)){
        fs.mkdirSync(runTmpDir, { recursive: true });
    }
    
    const newWorker1TmpFileUrl = await copyFileToTmp(worker1);
    const newWorker2TmpFileUrl = await copyFileToTmp(worker2);
    const newWorker3TmpFileUrl = await copyFileToTmp(worker3);

    await copyFileToTmp(wasm2);
    await copyFileToTmp(wasm3);
    await copyFileToTmp(wasm4);

    await copyFileToTmp(nfs_wasm1);
    await copyFileToTmp(nfs_wasm2);
    await copyFileToTmp(nfs_wasm3);
    await copyFileToTmp(nfs_wasm4);

    await copyFileToTmp(nu_shell_wasm);


    setWorkerOverrideUrl('./wasmComponentWorkerThread.js', newWorker1TmpFileUrl);
    debugMessage("setWorkerOverrideUrl('./wasmComponentWorkerThread.js'): ", newWorker1TmpFileUrl);
    setWorkerOverrideUrl('./wasmCoreWorkerThread.js', newWorker2TmpFileUrl);
    debugMessage("setWorkerOverrideUrl('./wasmCoreWorkerThread.js'): ", newWorker2TmpFileUrl);
    setWorkerOverrideUrl('./wasiWorkerThread.js', newWorker3TmpFileUrl);
    debugMessage("setWorkerOverrideUrl('./wasiWorkerThread.js'): ", newWorker3TmpFileUrl);

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
