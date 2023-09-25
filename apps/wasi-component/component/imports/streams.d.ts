export namespace ImportsStreams {
  export function read(this: InputStream, len: bigint): [Uint8Array | ArrayBuffer, StreamStatus];
  export function blockingRead(this: InputStream, len: bigint): [Uint8Array | ArrayBuffer, StreamStatus];
  export function subscribeToInputStream(this: InputStream): Pollable;
  export function dropInputStream(this: InputStream): void;
  export function checkWrite(this: OutputStream): bigint;
  export function write(this: OutputStream, contents: Uint8Array): void;
  export function blockingWriteAndFlush(this: OutputStream, contents: Uint8Array): void;
  export function blockingFlush(this: OutputStream): void;
  export function subscribeToOutputStream(this: OutputStream): Pollable;
  export function dropOutputStream(this: OutputStream): void;
}
export type InputStream = number;
/**
 * # Variants
 * 
 * ## `"open"`
 * 
 * ## `"ended"`
 */
export type StreamStatus = 'open' | 'ended';
import type { Pollable } from '../imports/poll';
export { Pollable };
export type OutputStream = number;
/**
 * # Variants
 * 
 * ## `"last-operation-failed"`
 * 
 * ## `"closed"`
 */
export type WriteError = 'last-operation-failed' | 'closed';
