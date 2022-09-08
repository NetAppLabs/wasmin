import {
  FolderHandle as MemoryFolderHandle,
  FileHandle as MemoryFileHandle,
} from "./adapters/memory";
import {
  FolderHandle as SandboxFolderHandle,
  FileHandle as SandboxFileHandle,
} from "./adapters/sandbox";
import { NFileSystemDirectoryHandle } from "./FileSystemDirectoryHandle";

export const config = {
  writable: WritableStream,
};

export async function fromDataTransfer(entries: any) {
  console.warn(
    "deprecated fromDataTransfer - use `dt.items[0].getAsFileSystemHandle()` instead"
  );

  const folder = new MemoryFolderHandle("", false);
  folder._entries = entries.map((entry: any) =>
    entry.isFile
      ? new SandboxFileHandle(entry, false)
      : new SandboxFolderHandle(entry, false)
  );
  const adapterHandle = folder as unknown as FileSystemDirectoryHandle;
  return new NFileSystemDirectoryHandle(adapterHandle);
}

export async function fromInput(
  input: HTMLInputElement
): Promise<NFileSystemDirectoryHandle> {
  const files = Array.from(input.files!) as any[];
  const rootName = files[0].webkitRelativePath.split("/", 1)[0];
  const root = new MemoryFolderHandle(rootName, false);
  files.forEach((file) => {
    const path = file.webkitRelativePath.split("/");
    path.shift();
    const name = path.pop();
    const dir = path.reduce((dir: any, path: any) => {
      if (!dir._entries[path])
        dir._entries[path] = new MemoryFolderHandle(path, false);
      return dir._entries[path];
    }, root);
    dir._entries[name!] = new MemoryFileHandle(file.name, file, false);
  });
  const adapterHandle = root as unknown as FileSystemDirectoryHandle;
  return new NFileSystemDirectoryHandle(adapterHandle);
}
