import { MemoryFolderHandle as MemoryFolderHandle, MemoryFileHandle as MemoryFileHandle } from "./adapters/memory.js";
import { NFileSystemDirectoryHandle } from "./NFileSystemDirectoryHandle.js";
import { FileSystemDirectoryHandle } from "./index.js";

export const config = {
    writable: WritableStream,
};

export async function fromInput(input: HTMLInputElement): Promise<NFileSystemDirectoryHandle> {
    const files = Array.from(input.files!) as any[];
    const rootName = files[0].webkitRelativePath.split("/", 1)[0];
    const root = new MemoryFolderHandle(rootName, false);
    files.forEach((file) => {
        const path = file.webkitRelativePath.split("/");
        path.shift();
        const name = path.pop();
        const dir = path.reduce((dir: any, path: any) => {
            if (!dir._entries[path]) dir._entries[path] = new MemoryFolderHandle(path, false);
            return dir._entries[path];
        }, root);
        dir._entries[name!] = new MemoryFileHandle(file.name, file, false);
    });
    const adapterHandle = root as unknown as FileSystemDirectoryHandle;
    return new NFileSystemDirectoryHandle(adapterHandle);
}

export function PreNameCheck(name: string) {
    if (name === "") throw new TypeError(`Name can't be an empty string.`);
    if (name === "." || name === ".." || name.includes("/")) throw new TypeError(`Name contains invalid characters.`);
}

export interface FsURL {
    hash: string;
    host: string;
    hostname: string;
    href: string;
    readonly origin: string;
    password: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
    readonly searchParams: URLSearchParams;
    username: string;
    toString(): string;
    toJSON(): string;
}


export function parseUrl(urlString: string): FsURL {
    let u = new URL(urlString);
    return u;
}

export function urlToString(url: FsURL) {
    let stringUrl = url.toString();
    return stringUrl;
}