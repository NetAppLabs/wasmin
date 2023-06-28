export namespace IoStreams {
  export function subscribeToInputStream(this: InputStream): Pollable;
  export function dropInputStream(this: InputStream): void;
  export function write(this: OutputStream, buf: Uint8Array): bigint;
  export function blockingWrite(this: OutputStream, buf: Uint8Array): bigint;
  export function subscribeToOutputStream(this: OutputStream): Pollable;
  export function dropOutputStream(this: OutputStream): void;
}
export type InputStream = number;
import type { Pollable } from '../imports/poll';
export { Pollable };
export type OutputStream = number;
export interface StreamError {
}
