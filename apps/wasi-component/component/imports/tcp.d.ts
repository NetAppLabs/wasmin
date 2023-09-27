export namespace ImportsTcp {
  export function accept(this: TcpSocket): [TcpSocket, InputStream, OutputStream];
  export function shutdown(this: TcpSocket, shutdownType: ShutdownType): void;
  export function dropTcpSocket(this: TcpSocket): void;
}
export type TcpSocket = number;
import type { InputStream } from '../imports/streams';
export { InputStream };
import type { OutputStream } from '../imports/streams';
export { OutputStream };
import type { ErrorCode } from '../imports/network';
export { ErrorCode };
/**
 * # Variants
 * 
 * ## `"receive"`
 * 
 * ## `"send"`
 * 
 * ## `"both"`
 */
export type ShutdownType = 'receive' | 'send' | 'both';
