// Some older Firefox versions need this polyfill for WriteableStream
//import { WritableStream } from "web-streams-polyfill";

export class FileSystemWritableFileStream extends WritableStream {
  constructor(...args: any[]) {
    super(...args);

    // Stupid Safari hack to extend native classes
    // https://bugs.webkit.org/show_bug.cgi?id=226201
    Object.setPrototypeOf(this, FileSystemWritableFileStream.prototype);
  }

  private _closed = false;

  async close(): Promise<void> {
    this._closed = true;
    const w = this.getWriter();
    await w.close();
    w.releaseLock();
    return;
  }

  async seek(position: number): Promise<void> {
    return this.write({ type: "seek", position });
  }

  async truncate(size: number): Promise<void> {
    return this.write({ type: "truncate", size });
  }

  async write(data: FileSystemWriteChunkType): Promise<void> {
    if (this._closed) {
      return Promise.reject(
        new TypeError("Cannot write to a CLOSED writable stream")
      );
    }

    const writer = this.getWriter();
    const p = writer.write(data);
    writer.releaseLock();
    return p;
  }

  get [Symbol.toStringTag]() {
    return "FileSystemWritableFileStream";
  }
}
