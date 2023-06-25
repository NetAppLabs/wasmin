import { NFileSystemFileHandle as MyFileSystemFileHandle } from "./NFileSystemFileHandle.js";
import type { NFileSystemDirectoryHandle } from "./NFileSystemDirectoryHandle";
import { FileHandle } from "./adapters/downloader.js";
import { FileSystemFileHandle } from "./index.js";

/**
 * @param {Object} [options]
 * @param {boolean} [options.excludeAcceptAllOption=false] Prevent user for selecting any
 * @param {Object[]} [options.accepts] Files you want to accept
 * @param {string} [options.suggestedName] the name to fall back to when using polyfill
 * @returns
 */

interface Options {
    excludeAcceptAllOption: boolean;
    accepts: any;
    suggestedName: string;
}

export async function showSaveFilePicker(
    options: Partial<Options> = { excludeAcceptAllOption: false }
): Promise<NFileSystemDirectoryHandle | MyFileSystemFileHandle> {
    const downloaderHandle = new FileHandle(options.suggestedName);
    const adapterHandle = downloaderHandle as unknown as FileSystemFileHandle;
    return new MyFileSystemFileHandle(adapterHandle);
}
