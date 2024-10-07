//import { app, trigger, InvocationContext } from "@azure/functions";

//import { app, trigger } from "@azure/functions";
import { app } from "@azure/functions";
// @ts-ignore
import compile from 'wat-compiler'

import { WASI, OpenFiles } from "@wasmin/wasi-js";
import { nfs } from "@wasmin/nfs-js";
import { getDirectoryHandleByURL, RegisterProvider, FileSystemDirectoryHandle } from "@wasmin/fs-js";
import * as fs from 'node:fs';

// @ts-ignore
RegisterProvider("nfs", nfs);

const wasmWat = `
(module
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory $mem 1)
    (export "memory" (memory $mem))

    (data (i32.const 8) "hello world\n")

    (func $main
        (i32.store (i32.const 0) (i32.const 8))
        (i32.store (i32.const 4) (i32.const 12))

        (call $fd_write
            (i32.const 1)
            (i32.const 0)
            (i32.const 1)
            (i32.const 20)
        )
        drop
    )
    (export "_start" (func $main))
)`

type FileOperationMessage = {
    filePath: string,
    operation: string,
    volumeUrl: string,
    rawMessage: string,
}

const isNode = typeof process !== "undefined" && process.versions && process.versions.node;

export async function fetchCompile(url: URL) {
    if (isNode) {
        let _fs = await import("fs/promises");
        return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
}

app.storageQueue('storageQueueTrigger', {
    queueName: 'queue1',
    connection: 'AzureWebJobsStorage',
    handler: async (queueItem, context) => {

        //const buffer = compile('(func (export "answer") (result i32) (i32.const 42))')
        //const wasmBuf = compile(wasmWat);
        const wasmUrl = new URL("./handler-copier.wasm", import.meta.url);
        const wasmBuf = fs.readFileSync(wasmUrl);
        //const wasmBuf = WebAssembly.compile(new Uint8Array(fs.readFileSync('./handler-copier.wasm')))
        //const wasmBuf = await fetchCompile(wasmUrl);
        //const mod = new WebAssembly.Module(buffer)
        //const instance = new WebAssembly.Instance(mod)
        //console.log(instance.exports.answer()) // => 42
        const foper = queueItem as FileOperationMessage;

        const filePath = foper.filePath;
        const volumeUrl = foper.volumeUrl;

        const rootDir = "/"
        const preOpens: Record<string, FileSystemDirectoryHandle> = {};

        context.log('Storage queue function processed work item:', queueItem);
        context.log('Storage queue function filePath:', filePath);
        context.log('Storage queue function volumeUrl:', volumeUrl);

        let functionArgs = [filePath];
        try {
            const rootfs = await getDirectoryHandleByURL(volumeUrl);
            preOpens[rootDir] = rootfs;
            const openFiles = new OpenFiles(preOpens);
    
            const wasi = new WASI({
                //abortSignal: abortController.signal,
                openFiles: openFiles,
                //stdin: stdin,
                //stdout: stdout,
                //stderr: stderr,
                args: functionArgs,
                //env: newEnv,
                //tty: tty,
                //name: wasmBinaryFromArgs,
                //componentMode: componentMode,
            });
            const statusCode = await wasi.run(wasmBuf);
            //if (statusCode !== 0) {
                console.log(`wasm Exit code: ${statusCode}`);
            //}
        } catch (err: any) {
            console.log(err);
        }

        /*
        context.log('Storage queue function processed work item:', queueItem);
        context.log('expirationTime =', context.triggerMetadata.expirationTime);
        context.log('insertionTime =', context.triggerMetadata.insertionTime);
        context.log('nextVisibleTime =', context.triggerMetadata.nextVisibleTime);
        context.log('id =', context.triggerMetadata.id);
        context.log('popReceipt =', context.triggerMetadata.popReceipt);
        context.log('dequeueCount =', context.triggerMetadata.dequeueCount);
        */
    },
});

/*
app.timer('timerTrigger1', {
    schedule: '0-59 * * * * *',
    handler: (myTimer, context) => {
        context.log('Timer function processed request.');
    },
});
*/

/*
app.timer('timerTrigger1', {
    schedule: '0,10,20,30,40,50 * * * * *',
    handler: async(myTimer, context) => {
        context.log('Timer function processed request.');
        const connStr = "UseDevelopmentStorage=true";
        const queueServiceClient = QueueServiceClient.fromConnectionString(connStr);
        const queueName = "queue1"
        try {
            const queueClient = queueServiceClient.getQueueClient(queueName);
            const createQueueResponse = await queueClient.createIfNotExists();
            console.log(
              `Created queue ${queueName} successfully, service assigned request Id: ${createQueueResponse.requestId}`
            );
        } catch (err: any) {
            console.log(
                `Queue ${queueName} already exists`
              );
        }
        const queueClient = queueServiceClient.getQueueClient(queueName);
        // Send a message into the queue using the sendMessage method.
        const sendMessageResponse = await queueClient.sendMessage("Hello From Timer Trigger!");
        console.log(
          `Sent message successfully, service assigned message Id: ${sendMessageResponse.messageId}, service assigned request Id: ${sendMessageResponse.requestId}`
        );
    },
});
*/

