// Some older Firefox versions need this polyfill for WriteableStream
//import { WritableStream } from "web-streams-polyfill";

export class FileSystemWritableFileStream extends WritableStream {
  constructor(...args: any[]) {
    super(...args);
    console.log("Constructor FileSystemWritableFileStream with args: ", ...args);

    // Stupid Safari hack to extend native classes
    // https://bugs.webkit.org/show_bug.cgi?id=226201
    Object.setPrototypeOf(this, FileSystemWritableFileStream.prototype);
  }

  private _closed = false;

  wrapPromise(label: string, promise: Promise<any>) {
    const timeout = 1000;
    // Log promise creation.
    console.log(`Start (${label})`);
    return new Promise((resolve, reject) => {
      // Set up timeout handler to reject.
      const timeoutHandler = setTimeout(() => {
        reject(new Error(`Timeout (${label}, ${timeout})`));
      }, timeout);
      Promise.resolve(promise).catch((e) => {
        console.log(`e (${e})`);
        clearTimeout(timeoutHandler);
      }).then(resolve, reject);

      // Promisify value (in case it's a primitive). Once it resolves,
      // log it, clear the timeout, and pass the results out of the function.
      Promise.resolve(promise).finally(() => {
        console.log(`End (${label})`);
        clearTimeout(timeoutHandler);
      }).then(resolve, reject);
    });
  }  

  async close(): Promise<void> {
    console.log("FileSystemWritableFileStream: close start");
    this._closed = true;
    const w = this.getWriter();
    console.log("FileSystemWritableFileStream: w: ", w);
    // TODO inspect this on bun
    try{
     //console.trace();
      const closePromise = w.close();
      const p = this.wrapPromise("FileSystemWritableFileStream closePromise:", closePromise);
      await p;
    } catch (err: any) {
      if (err instanceof Error){
        const eerr = err as Error;
        console.log("FileSystemWritableFileStream close err: ", err);
        console.log(eerr.stack);
      }
    }
    console.log("FileSystemWritableFileStream: w.close()");
    w.releaseLock();
    console.log("FileSystemWritableFileStream: close end");
    return;
  }

  async seek(position: number): Promise<void> {
    console.log("FileSystemWritableFileStream: seek");
    return this.write({ type: "seek", position });
  }

  async truncate(size: number): Promise<void> {
    console.log("FileSystemWritableFileStream: truncate");
    return this.write({ type: "truncate", size });
  }

  async write(data: FileSystemWriteChunkType): Promise<void> {
    console.log("FileSystemWritableFileStream: write start");
    if (this._closed) {
      return Promise.reject(
        new TypeError("Cannot write to a CLOSED writable stream")
      );
    }

    const writer = this.getWriter();
    await writer.write(data);
    writer.releaseLock();
    console.log("FileSystemWritableFileStream: write end");
  }

  get [Symbol.toStringTag]() {
    return "FileSystemWritableFileStream";
  }
}
