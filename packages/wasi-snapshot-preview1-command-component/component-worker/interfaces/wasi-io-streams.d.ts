export namespace WasiIoStreams {
  export { InputStream };
  export { OutputStream };
}
import type { Error } from '../interfaces/wasi-io-error.js';
export { Error };
export type StreamError = StreamErrorLastOperationFailed | StreamErrorClosed;
export interface StreamErrorLastOperationFailed {
  tag: 'last-operation-failed',
  val: Error,
}
export interface StreamErrorClosed {
  tag: 'closed',
}
import type { Pollable } from '../interfaces/wasi-io-poll.js';
export { Pollable };

export class OutputStream {
  checkWrite(): bigint;
  write(contents: Uint8Array): void;
  blockingWriteAndFlush(contents: Uint8Array): void;
  blockingFlush(): void;
  subscribe(): Pollable;
}

export class InputStream {
  read(len: bigint): Uint8Array;
  blockingRead(len: bigint): Uint8Array;
  subscribe(): Pollable;
}
