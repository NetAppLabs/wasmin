export namespace IoStreams {
    export function dropInputStream(this0: InputStream): void;
    export function write(this0: OutputStream, buf: Uint8Array): bigint;
    export function blockingWrite(this0: OutputStream, buf: Uint8Array): bigint;
    export function dropOutputStream(this0: OutputStream): void;
}
export type InputStream = number;
export type OutputStream = number;
export interface StreamError {}
