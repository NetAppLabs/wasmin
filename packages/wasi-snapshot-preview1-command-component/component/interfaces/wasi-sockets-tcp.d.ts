export namespace WasiSocketsTcp {
  export { TcpSocket };
}
import type { Network } from '../interfaces/wasi-sockets-network.js';
export { Network };
import type { IpSocketAddress } from '../interfaces/wasi-sockets-network.js';
export { IpSocketAddress };
import type { ErrorCode } from '../interfaces/wasi-sockets-network.js';
export { ErrorCode };
import type { InputStream } from '../interfaces/wasi-io-streams.js';
export { InputStream };
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
import type { Pollable } from '../interfaces/wasi-io-poll.js';
export { Pollable };
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

export class TcpSocket {
  startBind(network: Network, localAddress: IpSocketAddress): void;
  finishBind(): void;
  startConnect(network: Network, remoteAddress: IpSocketAddress): void;
  finishConnect(): [InputStream, OutputStream];
  startListen(): void;
  finishListen(): void;
  accept(): [TcpSocket, InputStream, OutputStream];
  localAddress(): IpSocketAddress;
  remoteAddress(): IpSocketAddress;
  subscribe(): Pollable;
  shutdown(shutdownType: ShutdownType): void;
}
