// Some older Firefox versions need this polyfill for WriteableStream
//import { WritableStream } from "web-streams-polyfill";


const FILESYSTEM_WRITABLE_DEBUG = false;

export function fileSystemWritableDebug(msg?: any, ...optionalParams: any[]): void {
  if (FILESYSTEM_WRITABLE_DEBUG){
    console.debug(msg, ...optionalParams);
  }
}

const awaitTimeout = (delay: number, reason: string) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (reason === undefined ? resolve() : reject(reason)),
      delay
    )
  );

const wrapPromise = (promise: Promise<any>, delay: number, reason: string) =>
  Promise.race([promise, awaitTimeout(delay, reason)]);

export class FileSystemWritableFileStream extends WritableStream {
  constructor(...args: any[]) {
    super(...args);
    fileSystemWritableDebug("Constructor FileSystemWritableFileStream with args: ", ...args);

    // Stupid Safari hack to extend native classes
    // https://bugs.webkit.org/show_bug.cgi?id=226201
    Object.setPrototypeOf(this, FileSystemWritableFileStream.prototype);
    //this.writer = null;
  }

  private _closed = false;
  //private writer: null | WritableStreamDefaultWriter;

  async close(): Promise<void> {
    fileSystemWritableDebug("FileSystemWritableFileStream: close start");
    this._closed = true;
    const w = this.getWriter();
    fileSystemWritableDebug("FileSystemWritableFileStream: w: ", w);
    // TODO inspect this on bun
    try{
      //console.trace();
      const p = w.close();
      //const closePromise = wrapPromise(p, 1000, "didtimeout");
      const closePromise = p;
      fileSystemWritableDebug("FileSystemWritableFileStream: closePromise: ", closePromise);
      await closePromise;
    } catch (err: any) {
      if (err instanceof Error){
        const eerr = err as Error;
        fileSystemWritableDebug("FileSystemWritableFileStream close err: ", err);
        fileSystemWritableDebug(eerr.stack);
      } else {
        fileSystemWritableDebug("FileSystemWritableFileStream close unknown err: ", err);
      }
      throw err;
    }
    fileSystemWritableDebug("FileSystemWritableFileStream: w.close()");
    w.releaseLock();
    fileSystemWritableDebug("FileSystemWritableFileStream: close end");
    return;
  }

  async seek(position: number): Promise<void> {
    fileSystemWritableDebug("FileSystemWritableFileStream: seek");
    return this.write({ type: "seek", position });
  }

  async truncate(size: number): Promise<void> {
    fileSystemWritableDebug("FileSystemWritableFileStream: truncate");
    return this.write({ type: "truncate", size });
  }

  async write(data: FileSystemWriteChunkType): Promise<void> {
    fileSystemWritableDebug("FileSystemWritableFileStream: write start");
    if (this._closed) {
      return Promise.reject(
        new TypeError("Cannot write to a CLOSED writable stream")
      );
    }

    const writer = this.getWriter();
    await writer.write(data);
    writer.releaseLock();
    fileSystemWritableDebug("FileSystemWritableFileStream: write end");
  }

  /*getWriter(): WritableStreamDefaultWriter {
    if (this.writer == null ) {
      const w = super.getWriter();
      //this.writer = new CustomWritableStreamDefaultWriter(w);
      this.writer = w;
      fileSystemWritableDebug("FileSystemWritableFileStream getWriter: ", w);
    }
    return this.writer;
  }*/
  
  /*getWriter(): WritableStreamDefaultWriter {
    return super.getWriter();
  }*/

  get [Symbol.toStringTag]() {
    return "FileSystemWritableFileStream";
  }
}


class CustomWritableStreamDefaultWriter implements WritableStreamDefaultWriter {
  constructor(w: WritableStreamDefaultWriter) {
    this.w = w;
    this._closed=w.closed;
    this._desiredSize=w.desiredSize;
    this._ready=w.ready;
  }
  w: WritableStreamDefaultWriter<any>;
  private _closed: Promise<undefined>;
  public get closed(): Promise<undefined> {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: get closed");
    return this._closed;
  }
  public set closed(value: Promise<undefined>) {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: set closed");
    this._closed = value;
  }
  private _desiredSize: number | null;
  public get desiredSize(): number | null {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: get desiredSize");
    return this._desiredSize;
  }
  public set desiredSize(value: number | null) {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: set desiredSize");
    this._desiredSize = value;
  }
  private _ready: Promise<undefined>;
  public get ready(): Promise<undefined> {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: get ready");
    return this._ready;
  }
  public set ready(value: Promise<undefined>) {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: set ready");
    this._ready = value;
  }
  async abort(reason?: any): Promise<void> {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: abort");
    const p = this.w.abort(reason);
    await p;
  }
  async close(): Promise<void> {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: close");
    try {
      const p = this.w.close();
      await p;
    } catch(err: any){
      fileSystemWritableDebug("close err: ", err);
      throw err;
    }
  }
  releaseLock(): void {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: releaseLock");
    this.w.releaseLock();
  }
  async write(chunk?: any): Promise<void> {
    fileSystemWritableDebug("CustomWritableStreamDefaultWriter: close");
    const p = this.w.write(chunk);
    await p;
  }

}