import { NotFoundError } from "../errors";

export class FileHandle {
  constructor(public name = "unkown") {}
  public kind = "directory";

  getFile() {
    throw new NotFoundError();
  }

  async createWritable(options: any) {
    const sw = await navigator.serviceWorker.getRegistration();
    const link = document.createElement("a");
    const ts = new TransformStream();
    const sink = ts.writable;

    link.download = this.name;

    const isSafari =
      process.env.CI || process.env.NODE_ENV === "test"
        ? false
        : // @ts-ignore
          window.safari ||
          // @ts-ignore
          window.WebKitPoint;

    if (isSafari || !sw) {
      let chunks: BlobPart[] = [];
      ts.readable.pipeTo(
        new WritableStream({
          write(chunk) {
            chunks.push(new Blob([chunk]));
          },
          close() {
            const blob = new Blob(chunks, {
              type: "application/octet-stream; charset=utf-8",
            });
            chunks = [];
            link.href = URL.createObjectURL(blob);
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 10000);
          },
        })
      );
    } else {
      const { writable, readablePort } = new RemoteWritableStream();
      // Make filename RFC5987 compatible
      const fileName = encodeURIComponent(this.name)
        .replace(/['()]/g, escape)
        .replace(/\*/g, "%2A");
      const headers = {
        "content-disposition": "attachment; filename*=UTF-8''" + fileName,
        "content-type": "application/octet-stream; charset=utf-8",
        ...(options.size ? { "content-length": options.size } : {}),
      };

      const keepAlive = setTimeout(() => sw.active?.postMessage(0), 10000);

      ts.readable
        .pipeThrough(
          new TransformStream({
            transform(chunk, ctrl) {
              if (chunk instanceof Uint8Array) return ctrl.enqueue(chunk);
              const reader = new Response(chunk).body?.getReader();
              const pump = (_?: any): any =>
                reader
                  ?.read()
                  .then((e) => (e.done ? 0 : pump(ctrl.enqueue(e.value))));
              return pump();
            },
          })
        )
        .pipeTo(writable)
        .finally(() => {
          clearInterval(keepAlive);
        });

      // Transfer the stream to service worker
      sw.active?.postMessage(
        {
          url: sw.scope + fileName,
          headers,
          readablePort,
        },
        [readablePort]
      );

      // Trigger the download with a hidden iframe
      const iframe = document.createElement("iframe");
      iframe.hidden = true;
      iframe.src = sw.scope + fileName;
      document.body.appendChild(iframe);
    }

    return sink.getWriter();
  }
}

const WRITE = 0;
const PULL = 0;
const ERROR = 1;
const ABORT = 1;
const CLOSE = 2;

class MessagePortSink implements UnderlyingSink {
  constructor(private port: MessagePort) {
    this._resetReady();
    this.port.onmessage = (event) => this._onMessage(event.data);
  }

  private _controller!: WritableStreamDefaultController;
  private _readyPromise!: Promise<any>;
  private _readyReject: any;
  private _readyResolve: any;
  private _readyPending!: boolean;

  start(controller: WritableStreamDefaultController) {
    this._controller = controller;
    // Apply initial backpressure
    return this._readyPromise;
  }

  write(chunk: any) {
    const message = { type: WRITE, chunk };

    // Send chunk
    this.port.postMessage(message, [chunk.buffer]);

    // Assume backpressure after every write, until sender pulls
    this._resetReady();

    // Apply backpressure
    return this._readyPromise;
  }

  close() {
    this.port.postMessage({ type: CLOSE });
    this.port.close();
  }

  abort(reason: any) {
    this.port.postMessage({ type: ABORT, reason });
    this.port.close();
  }

  _onMessage(message: any) {
    if (message.type === PULL) this._resolveReady();
    if (message.type === ERROR) this._onError(message.reason);
  }

  _onError(reason: any) {
    this._controller.error(reason);
    this._rejectReady(reason);
    this.port.close();
  }

  _resetReady() {
    this._readyPromise = new Promise((resolve, reject) => {
      this._readyResolve = resolve;
      this._readyReject = reject;
    });
    this._readyPending = true;
  }

  _resolveReady() {
    this._readyResolve();
    this._readyPending = false;
  }

  _rejectReady(reason: any) {
    if (!this._readyPending) this._resetReady();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this._readyPromise.catch(() => {});
    this._readyReject(reason);
    this._readyPending = false;
  }
}

class RemoteWritableStream {
  constructor() {
    const channel = new MessageChannel();
    this.readablePort = channel.port1;
    this.writable = new WritableStream(new MessagePortSink(channel.port2));
  }
  public readablePort: MessagePort;
  public writable: WritableStream;
}
