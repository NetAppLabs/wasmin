import { randomBytes } from "crypto";
//import { performance } from "perf_hooks";
import { File, Blob } from "web-file-polyfill";
import { WritableStream, ReadableStream } from "web-streams-polyfill";
import {
    NFileSystemDirectoryHandle,
    NFileSystemFileHandle,
    FileSystemWritableFileStream,
    NFileSystemHandle,
    getOriginPrivateDirectory,
} from "@wasm-env/fs-js";

(() => {
    globalThis.File = File;
    Object.setPrototypeOf(globalThis.File, File.prototype);

    globalThis.Blob = Blob;
    Object.setPrototypeOf(globalThis.Blob, Blob.prototype);

    // @ts-ignore
    globalThis.WritableStream = WritableStream;

    // @ts-ignore
    globalThis.ReadableStream = ReadableStream;
    // @ts-ignore
    globalThis.TransformStream = TransformStream;

    // @ts-ignore
    globalThis.FileSystemDirectoryHandle = NFileSystemDirectoryHandle;
    // @ts-ignore
    globalThis.FileSystemFileHandle = NFileSystemFileHandle;
    // @ts-ignore
    globalThis.FileSystemHandle = NFileSystemHandle;
    // @ts-ignore
    globalThis.FileSystemWritableFileStream = FileSystemWritableFileStream;
    // @ts-ignore
    globalThis.getOriginPrivateDirectory = getOriginPrivateDirectory;

    // @ts-ignore
    globalThis.performance = performance;

    // @ts-ignore
    globalThis.crypto = {};
    globalThis.crypto.getRandomValues = randomBytes;
})();
