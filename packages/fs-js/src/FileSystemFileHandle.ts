import { NFileSystemHandle } from "./FileSystemHandle";
import { FileSystemWritableFileStream } from "./FileSystemWritableFileStream";

export class NFileSystemFileHandle
  extends NFileSystemHandle
  implements FileSystemFileHandle
{
  constructor(adapter: FileSystemFileHandle) {
    super(adapter);
    this.isFile = true;
    this.isDirectory = false;
  }
  /**
   * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
   */
  isFile: true;

  /**
   * @deprecated Old property just for Chromium <=85. Use `kind` property in the new API.
   */
  isDirectory: false;

  public kind = "file" as const;

  async createWritable(
    options: { keepExistingData?: boolean } = {}
  ): Promise<FileSystemWritableFileStream> {
    const thisAdapter = this.getAdapterFileSystemFileHandle();
    if (thisAdapter.createWritable) {
      // TODO look into if FileSystemWritableFileStream is needed
      /*return new FileSystemWritableFileStream(
        await thisAdapter.createWritable(options)
      );*/
      // @ts-ignore
      return await thisAdapter.createWritable(options);
      // @ts-ignore
    } else if (thisAdapter.createAccessHandle) {
      // Specifically for Safari
      // See https://github.com/WICG/file-system-access/blob/main/AccessHandle.md
      // and https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/
      // @ts-ignore
      const accessHandle = await thisAdapter.createAccessHandle();
      const writer = accessHandle.writable.getWriter();
      return writer;
    }
    throw new Error("createWritable not supported");
  }

  getFile(): Promise<File> {
    return Promise.resolve(this.getAdapterFileSystemFileHandle().getFile());
  }

  get [Symbol.toStringTag]() {
    return "FileSystemFileHandle";
  }

  private getAdapterFileSystemFileHandle(): FileSystemFileHandle {
    return this.adapter as FileSystemFileHandle;
  }
}
