export namespace WasiSocketsTcp {
  export function startBind(this_: TcpSocket, network: Network, localAddress: IpSocketAddress): void;
  export function finishBind(this_: TcpSocket): void;
  export function startConnect(this_: TcpSocket, network: Network, remoteAddress: IpSocketAddress): void;
  export function finishConnect(this_: TcpSocket): [InputStream, OutputStream];
  export function startListen(this_: TcpSocket): void;
  export function finishListen(this_: TcpSocket): void;
  export function accept(this_: TcpSocket): [TcpSocket, InputStream, OutputStream];
  export function localAddress(this_: TcpSocket): IpSocketAddress;
  export function remoteAddress(this_: TcpSocket): IpSocketAddress;
  export function shutdown(this_: TcpSocket, shutdownType: ShutdownType): void;
  export function dropTcpSocket(this_: TcpSocket): void;
}
export type TcpSocket = number;
import type { Network } from '../interfaces/wasi-sockets-network';
export { Network };
import type { IpSocketAddress } from '../interfaces/wasi-sockets-network';
export { IpSocketAddress };
import type { ErrorCode } from '../interfaces/wasi-sockets-network';
export { ErrorCode };
import type { InputStream } from '../interfaces/wasi-io-streams';
export { InputStream };
import type { OutputStream } from '../interfaces/wasi-io-streams';
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
