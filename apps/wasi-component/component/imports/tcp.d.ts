export namespace ImportsTcp {
  export function startBind(this: TcpSocket, network: Network, localAddress: IpSocketAddress): void;
  export function finishBind(this: TcpSocket): void;
  export function startConnect(this: TcpSocket, network: Network, remoteAddress: IpSocketAddress): void;
  export function finishConnect(this: TcpSocket): [InputStream, OutputStream];
  export function startListen(this: TcpSocket): void;
  export function finishListen(this: TcpSocket): void;
  export function accept(this: TcpSocket): [TcpSocket, InputStream, OutputStream];
  export function localAddress(this: TcpSocket): IpSocketAddress;
  export function remoteAddress(this: TcpSocket): IpSocketAddress;
  export function shutdown(this: TcpSocket, shutdownType: ShutdownType): void;
  export function dropTcpSocket(this: TcpSocket): void;
}
export type TcpSocket = number;
import type { Network } from '../imports/network';
export { Network };
import type { IpSocketAddress } from '../imports/network';
export { IpSocketAddress };
import type { ErrorCode } from '../imports/network';
export { ErrorCode };
import type { InputStream } from '../imports/streams';
export { InputStream };
import type { OutputStream } from '../imports/streams';
export { OutputStream };
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
