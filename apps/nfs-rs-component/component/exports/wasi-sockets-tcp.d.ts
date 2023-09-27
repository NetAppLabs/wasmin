export namespace WasiSocketsTcp {
  export function startConnect(this_: TcpSocket, network: Network, remoteAddress: IpSocketAddress): void;
  export function finishConnect(this_: TcpSocket): [InputStream, OutputStream];
  export function remoteAddress(this_: TcpSocket): IpSocketAddress;
  export function shutdown(this_: TcpSocket, shutdownType: ShutdownType): void;
  export function dropTcpSocket(this_: TcpSocket): void;
}
export type TcpSocket = number;
import type { Network } from '../exports/wasi-sockets-network';
export { Network };
import type { IpSocketAddress } from '../exports/wasi-sockets-network';
export { IpSocketAddress };
import type { ErrorCode } from '../exports/wasi-sockets-network';
export { ErrorCode };
import type { InputStream } from '../exports/wasi-io-streams';
export { InputStream };
import type { OutputStream } from '../exports/wasi-io-streams';
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
