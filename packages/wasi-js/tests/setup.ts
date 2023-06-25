//import { randomBytes } from "crypto";
//import { performance } from "perf_hooks";
import { File, Blob } from "web-file-polyfill";
import { WritableStream, ReadableStream } from "web-streams-polyfill";
import {
    NFileSystemDirectoryHandle,
    NFileSystemFileHandle,
    NFileSystemWritableFileStream,
    NFileSystemHandle,
    getOriginPrivateDirectory,
} from "@wasm-env/fs-js";

(() => {
    if (!globalThis.File) {
        globalThis.File = File;
        Object.setPrototypeOf(globalThis.File, File.prototype);
    }

    if (!globalThis.Blob) {
        globalThis.Blob = Blob;
        Object.setPrototypeOf(globalThis.Blob, Blob.prototype);
    }

    if (!globalThis.WritableStream) {
        // @ts-ignore
        globalThis.WritableStream = WritableStream;
    }

    if (!globalThis.ReadableStream) {
        // @ts-ignore
        globalThis.ReadableStream = ReadableStream;
    }
    if (!globalThis.TransformStream) {
        // @ts-ignore
        globalThis.TransformStream = TransformStream;
    }
    // @ts-ignore
    globalThis.FileSystemDirectoryHandle = NFileSystemDirectoryHandle;
    // @ts-ignore
    globalThis.FileSystemFileHandle = NFileSystemFileHandle;
    // @ts-ignore
    globalThis.FileSystemHandle = NFileSystemHandle;
    // @ts-ignore
    globalThis.FileSystemWritableFileStream = NFileSystemWritableFileStream;
    // @ts-ignore
    globalThis.getOriginPrivateDirectory = getOriginPrivateDirectory;

    // @ts-ignore
    //globalThis.performance = performance;

    // @ts-ignore
    if (!globalThis.crypto) {
        // @ts-ignore
        globalThis.crypto = {};
        //globalThis.crypto.getRandomValues = randomBytes;
    }
})();
