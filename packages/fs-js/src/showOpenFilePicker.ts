import { fromInput } from "./util";
import type { NFileSystemDirectoryHandle } from "./FileSystemDirectoryHandle";

interface Options {
  multiple: boolean;
  excludeAcceptAllOption: boolean;
  accepts: any[];
  _preferPolyfill: boolean;
}

export async function showOpenFilePicker(
  options: Partial<Options> = {}
): Promise<NFileSystemDirectoryHandle> {
  const opts: Partial<Options> = { accepts: [], ...options };

  const input = document.createElement("input");
  input.type = "file";
  input.multiple = !!opts.multiple;
  input.accept = (opts.accepts || [])
    .map((e) => [
      ...((e as any).extensions || []).map((e: any) => "." + e),
      ...((e as any).mimeTypes || []),
    ])
    .flat()
    .join(",");

  return new Promise((resolve) => {
    input.onchange = () => resolve(fromInput(input));
    input.click();
  });
}
