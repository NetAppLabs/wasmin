import { app } from "@azure/functions";

let af = await import('@azure/functions');
let fs = require('fs')

import { nfs } from "@wasmin/nfs-js";
import { s3 } from "@wasmin/s3-fs-js";

import { getDirectoryHandleByURL, RegisterProvider, FileSystemDirectoryHandle } from "@wasmin/fs-js";
// import * as fs from 'node:fs';
import { InvocationContext, HttpRequest, HttpResponseInit, LogHookContext, PreInvocationContext } from '@azure/functions';

// @ts-ignore
RegisterProvider("nfs", nfs);

// @ts-ignore
RegisterProvider("s3", s3);

interface RequestBody {
    nfsPath?: string;
    resolution?: string;
}

export async function resizeImages(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let nfsPath: string | undefined;
    let resolution: string | undefined;

    if (request.method == "POST") {
        try {
            const body = await request.json() as RequestBody;
            nfsPath = body?.nfsPath;
            resolution = body?.resolution;
        } catch (error) {
            return {
                status: 400,
                jsonBody: { error: "Invalid JSON in request body"}
            }
        }
        if (!nfsPath) {
            return {
                status: 400,
                jsonBody: { error: "nfsPath is required"}
            }
        }

        try {
            const rootfs = await getDirectoryHandleByURL(nfsPath);
            for await (const [name, handle] of rootfs.entries()){
                if ( handle.kind == "directory"){
                    console.log('directory');
                }else if ( handle.kind == "file" ){
                    console.log('file')
                    const file: File = await handle.getFile()
                    console.log(file.name)
                    const regex = /\.\w+$/;
                    const match = file.name.match(regex)
                    if (match) {
                        console.log(match[0].substring(1));
                    }

                    // let fs = require('fs'),

                    // reader = fs.createReadStream('file');

                    // // Read and display the file data on console
                    // reader.on('data', function (chunk) {
                    //     console.log(chunk.toString());
                    // });
                    // fs.createReadStream(nfsPath, )
                }
                else{
                    console.log("why here")
                }
            }
            return {
                status: 200,
                jsonBody: { message: "Files duplicated" }
            } 
        }
        catch (err: any) {
            return {
                status: 400,
                jsonBody: { error: "nfs error"}
            }
        }
    }
    return {
        status: 400,
        jsonBody: { error: "Invalid rest command"}
    }
}



app.http('resizeImage', {
    methods: ['POST'],
    authLevel: 'function',
    handler: resizeImages
});

