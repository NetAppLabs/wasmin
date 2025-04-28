export namespace WasiSocketsTcp {
  export { TcpSocket };
}
import type { Network } from './wasi-sockets-network.js';
export { Network };
import type { IpSocketAddress } from './wasi-sockets-network.js';
export { IpSocketAddress };
import type { ErrorCode } from './wasi-sockets-network.js';
export { ErrorCode };
import type { InputStream } from './wasi-io-streams.js';
export { InputStream };
import type { OutputStream } from './wasi-io-streams.js';
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

export class TcpSocket {
  startConnect(network: Network, remoteAddress: IpSocketAddress): void;
  finishConnect(): [InputStream, OutputStream];
  remoteAddress(): IpSocketAddress;
  shutdown(shutdownType: ShutdownType): void;
}
