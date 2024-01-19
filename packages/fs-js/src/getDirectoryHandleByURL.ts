import { NFileSystemDirectoryHandle } from "./NFileSystemDirectoryHandle.js";
import parseUrl from "parse-url";
import indexeddb from "./adapters/indexeddb.js";
import memory from "./adapters/memory.js";
import { FileSystemDirectoryHandle } from "./index.js";

type providerFunc = (
    url: string,
    ...optionalParams: any[]
) => FileSystemDirectoryHandle | Promise<FileSystemDirectoryHandle>;
const providersRegistry: Record<string, providerFunc> = {};

export function RegisterProvider(prefix: string, provFunc: providerFunc) {
    providersRegistry[prefix] = provFunc;
}

export async function getDirectoryHandleByURL(
    url: string,
    secretStore?: any,
    wrapped = true
): Promise<FileSystemDirectoryHandle> {
    //@ts-ignore
    RegisterProvider("memory", memory);
    //@ts-ignore
    RegisterProvider("indexeddb", indexeddb);

    const pUrl = parseUrl(url, false);
    const protocol = pUrl.protocol;
    const provFunc = providersRegistry[protocol];

    if (provFunc) {
        const adapterHandle = await provFunc(url, secretStore);
        if (url.startsWith("nfs:")) {
            const urlParts = url.split("/");
            let lastPath = urlParts[urlParts.length-1];
            if (lastPath.includes("?")) {
                let lastPaths = lastPath.split("?");
                lastPath = lastPaths[lastPaths.length-1];
            }
            // @ts-ignore
            adapterHandle.name = lastPath;
            // @ts-ignore
            adapterHandle.url = url;
        }
        if (wrapped) {
            return new NFileSystemDirectoryHandle(adapterHandle);
        } else {
            return adapterHandle;
        }
    } else {
        throw new Error(`url not handled: ${url}`);
    }
}
