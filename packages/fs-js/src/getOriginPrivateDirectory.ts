import { NFileSystemDirectoryHandle } from "./FileSystemDirectoryHandle";

export async function getOriginPrivateDirectory(
  driver: any,
  path = ""
): Promise<NFileSystemDirectoryHandle> {
  return new NFileSystemDirectoryHandle(await driver(path));
}
