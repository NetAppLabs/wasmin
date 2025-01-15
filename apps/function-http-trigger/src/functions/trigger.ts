import { app } from "@azure/functions";
import sharp from 'sharp';

let af = await import('@azure/functions');

import { nfs } from "@netapplabs/nfs-js";
import { s3 } from "@wasmin/s3-fs-js";

import { getDirectoryHandleByURL, RegisterProvider, FileSystemDirectoryHandle } from "@netapplabs/fs-js";
// import * as fs from 'node:fs';
import { InvocationContext, HttpRequest, HttpResponseInit } from '@azure/functions';

// @ts-ignore
RegisterProvider("nfs", nfs);

// @ts-ignore
RegisterProvider("s3", s3);

interface RequestBody {
    nfsPath?: string;
    operation?: string;
    resolution?: string;
//    rotation?: string;
}

async function resizeImage(arrayBuffer: ArrayBuffer, width: number, height: number, fileType: string): Promise<ArrayBuffer>{
    
    const buffer = Buffer.from(arrayBuffer);
    let resizedBuffer: Buffer

    try{
        if (fileType != 'GIF'){
            resizedBuffer  = await sharp(buffer).resize(width, height, {fit: 'inside'}).toBuffer();
        }else {
            resizedBuffer  = await sharp(buffer, {animated: true}).resize(width, height, {fit: 'inside'}).toBuffer();
        }
        
        console.log(resizedBuffer)

        const resizedArrayBuffer = resizedBuffer.buffer.slice(resizedBuffer.byteOffset, resizedBuffer.byteOffset + resizedBuffer.byteLength);
        console.log(resizedArrayBuffer)

        return resizedArrayBuffer;
    } catch (err) {
        console.error('Error resizing image: ', err);
        throw err;
    }
}

// async function rotateImage(arrayBuffer: ArrayBuffer, rotation: number,fileType: string): Promise<ArrayBuffer>{
    
//     const buffer = Buffer.from(arrayBuffer);
//     let resizedBuffer: Buffer

//     try{
//         if (fileType != 'GIF'){
//             resizedBuffer  = await sharp(buffer).rotate(rotation).toBuffer();
//         }else {
//             resizedBuffer  = await sharp(buffer, {animated: true}).rotate(rotation).toBuffer();
//         }
        
//         console.log(resizedBuffer)

//         const resizedArrayBuffer = resizedBuffer.buffer.slice(resizedBuffer.byteOffset, resizedBuffer.byteOffset + resizedBuffer.byteLength);
//         console.log(resizedArrayBuffer)

//         return resizedArrayBuffer;
//     } catch (err) {
//         console.error('Error resizing image: ', err);
//         throw err;
//     }
    
// }

// async function greyscaleImage(arrayBuffer: ArrayBuffer, fileType: string): Promise<ArrayBuffer>{
    
//     const buffer = Buffer.from(arrayBuffer);
//     let resizedBuffer: Buffer

//     try{
//         if (fileType != 'GIF'){
//             resizedBuffer  = await sharp(buffer).greyscale().toBuffer();
//         }else {
//             resizedBuffer  = await sharp(buffer, {animated: true}).greyscale().toBuffer();
//         }
        
//         console.log(resizedBuffer)

//         const resizedArrayBuffer = resizedBuffer.buffer.slice(resizedBuffer.byteOffset, resizedBuffer.byteOffset + resizedBuffer.byteLength);
//         console.log(resizedArrayBuffer)

//         return resizedArrayBuffer;
//     } catch (err) {
//         console.error('Error resizing image: ', err);
//         throw err;
//     }
    
// }

async function processDirectory(directory: FileSystemDirectoryHandle, width: number, height: number ) : Promise<void> {
    let directoryList: FileSystemDirectoryHandle[] = []
    const fileTypeRegex = /\.\w+$/;
    for await (const [name, handle] of directory.entries()){
        if ( handle.kind == "directory"){
            console.log(handle.kind, name)
            directoryList.push(handle)
        }else if ( handle.kind == "file" ){
            console.log(handle.kind, name)
            const file: File = await handle.getFile()
            const filename: string = file.name
            const resizedFileNamePattern = /resized/i;
            
            const filetypeEnding = filename.match(fileTypeRegex)
            console.log(filetypeEnding)
            console.log(resizedFileNamePattern.test(filename))
            if (!resizedFileNamePattern.test(filename) && filetypeEnding) {
                const fileType = filetypeEnding[0].substring(1).toUpperCase();

                const supportedImageTypes: string[] = ['JPEG', 'PNG', 'WEBP', 'AVIF', 'TIFF', 'GIF', 'DZI', 'LIBVIPS']
                console.log(fileType)
                if ( supportedImageTypes.includes(fileType)){

                    // support different functions
                    try {
                        console.log(`inside try loop ${fileType} and ${filename}`)
                        const imageArrayBuffer  = await file.arrayBuffer()
                        const resizedArrayBuffer = await resizeImage(imageArrayBuffer, width, height, fileType);

                        if (resizedArrayBuffer != undefined){
                            console.log('Image resized successfully');
                            const fileEnding =  filetypeEnding[0].substring(0)
                            const newFileName =  filename.replace(fileEnding, '') + '-resized' + width + 'x' + height + fileEnding
                            console.log(newFileName)
                            let myFileHandle = await directory.getFileHandle(newFileName,  {create: true});
                            let fileWriter = await myFileHandle.createWritable({keepExistingData: false});
                            await fileWriter.write(resizedArrayBuffer);
                            await fileWriter.close();

                            console.log('Close fileWriter')
                        }
                        else{
                            console.log('Buffer not processed');

                        }

                    } catch (error) {               // how should images which fail the resize be handled
                        console.error(`Error resizing image: ${file.name}`, error);
                    }
                } else {
                    console.log(`Filetype: ${fileType} not supported`)
                }
            }
        }
    }
    for (const [name, directory] of directoryList.entries()){
        const success = processDirectory(directory, width, height)
    }
}



export async function resizeImages(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let nfsPath: string | undefined;
    let resolution: string | undefined;
    let width: number;
    let height: number;

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
        if (!nfsPath || !resolution) {
            return {
                status: 400,
                jsonBody: { error: "nfsPath and resolution is required"}
            }
        }

        try {
            const [widthStr, heightStr] = resolution?.split('x');

                width = parseInt(widthStr, 10);
                height = parseInt(heightStr, 10);
            const rootfs = await getDirectoryHandleByURL(nfsPath);
            
            const error = await processDirectory(rootfs, width, height)
            
            return {
                status: 200,
                jsonBody: { message: "Files successfully duplicated" }
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



app.http('function-http-trigger', {
    methods: ['POST'],
    authLevel: 'function',
    handler: resizeImages
});

