import type { NFileSystemDirectoryHandle } from "./FileSystemDirectoryHandle";
import { fromInput } from "./util";

export async function showDirectoryPicker(): Promise<NFileSystemDirectoryHandle> {
  const input = document.createElement("input");
  input.type = "file";
  input.webkitdirectory = true;

  return new Promise((resolve) => {
    input.onchange = () => resolve(fromInput(input));
    input.click();
  });
}
