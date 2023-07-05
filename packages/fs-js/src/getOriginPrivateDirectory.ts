import { NFileSystemDirectoryHandle } from "./NFileSystemDirectoryHandle.js";
import { FileSystemDirectoryHandle } from "./FileSystemAccess.js";

export async function getOriginPrivateDirectory(driver: any, path = "", wrapped=true): Promise<FileSystemDirectoryHandle> {
    const adapter = await driver(path);
    if (wrapped) {
        return new NFileSystemDirectoryHandle(adapter);
    } else {
        return adapter;
    }
}
