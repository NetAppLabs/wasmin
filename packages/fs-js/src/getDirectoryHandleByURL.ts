import { NFileSystemDirectoryHandle } from "./FileSystemDirectoryHandle";
import parseUrl from "parse-url";
import indexeddb from "./adapters/indexeddb";
import memory from "./adapters/memory";

type providerFunc = (
  url: string,
  ...optionalParams: any[]
) => Promise<FileSystemDirectoryHandle>;
const providersRegistry: Record<string, providerFunc> = {};

export function RegisterProvider(prefix: string, provFunc: providerFunc) {
  providersRegistry[prefix] = provFunc;
}

export async function getDirectoryHandleByURL(
  url: string,
  secretStore?: any
): Promise<NFileSystemDirectoryHandle> {
  /*
  //@ts-ignore
  registerProvider("s3", s3);
  //@ts-ignore
  providersRegistry["github"] = github;
  */
  //@ts-ignore
  //providersRegistry["memory"] = memory;
  //@ts-ignore
  //providersRegistry["indexeddb"] = indexeddb;

  //@ts-ignore
  RegisterProvider("memory", memory);
  //@ts-ignore
  RegisterProvider("indexeddb", indexeddb);

  const pUrl = parseUrl(url, false);
  const protocol = pUrl.protocol;
  const provFunc = providersRegistry[protocol];

  if (provFunc) {
    const adapterHandle = await provFunc(url, secretStore);
    return new NFileSystemDirectoryHandle(adapterHandle);
  } else {
    throw new Error(`url not handled: ${url}`);
  }
}
