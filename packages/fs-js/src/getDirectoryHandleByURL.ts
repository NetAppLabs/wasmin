import { NFileSystemDirectoryHandle } from "./FileSystemDirectoryHandle";
import parseUrl from "parse-url";
import s3 from "./adapters/s3";
import github from "./adapters/github";
import indexeddb from "./adapters/indexeddb";
import memory from "./adapters/memory";


export async function getDirectoryHandleByURLOld(
  url: string,
  secretStore?: any
): Promise<NFileSystemDirectoryHandle> {
  const pUrl = parseUrl(url, false);
  const protocol = pUrl.protocol;
  if (protocol == "s3") {
    const adapterHandle = s3(
      url,
      secretStore
    ) as unknown as FileSystemDirectoryHandle;
    return new NFileSystemDirectoryHandle(adapterHandle);
  } else if (protocol == "github") {
    const adapterHandle = github(
      url,
      secretStore
    ) as unknown as FileSystemDirectoryHandle;
    const ret = new NFileSystemDirectoryHandle(adapterHandle);
    return ret;
  } else if (protocol == "indexeddb") {
    const adapterHandle =
      (await indexeddb()) as unknown as FileSystemDirectoryHandle;
    return new NFileSystemDirectoryHandle(adapterHandle);
  } else if (protocol == "memory") {
    const adapterHandle = memory("") as unknown as FileSystemDirectoryHandle;
    return new NFileSystemDirectoryHandle(adapterHandle);
  }

  throw new Error(`url not handled: ${url}`);
}

type providerFunc = (url: string, ...optionalParams: any[]) => Promise<FileSystemDirectoryHandle>;
const providersRegistry: Record<string, providerFunc> = {};


export async function registerProvider(prefix: string, provFunc: providerFunc){
  providersRegistry[prefix] = provFunc;
}

export async function getDirectoryHandleByURL(
  url: string,
  secretStore?: any
): Promise<NFileSystemDirectoryHandle> {
  
  //@ts-ignore
  registerProvider("s3", s3);
  //@ts-ignore
  providersRegistry["github"] = github;
  //@ts-ignore
  providersRegistry["memory"] = memory;
  //@ts-ignore
  providersRegistry["indexeddb"] = indexeddb;
  
  const pUrl = parseUrl(url, false);
  const protocol = pUrl.protocol;
  const provFunc = providersRegistry[protocol];

  if(provFunc){
    const adapterHandle = await provFunc(url, secretStore);
    return new NFileSystemDirectoryHandle(adapterHandle);
  } else {
    throw new Error(`url not handled: ${url}`);
  }
}


