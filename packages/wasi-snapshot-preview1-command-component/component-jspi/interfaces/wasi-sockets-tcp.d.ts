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
  startBind(network: Network, localAddress: IpSocketAddress): Promise<void>;
  finishBind(): Promise<void>;
  startConnect(network: Network, remoteAddress: IpSocketAddress): Promise<void>;
  finishConnect(): Promise<[InputStream, OutputStream]>;
  startListen(): Promise<void>;
  finishListen(): Promise<void>;
  accept(): Promise<[TcpSocket, InputStream, OutputStream]>;
  localAddress(): Promise<IpSocketAddress>;
  remoteAddress(): Promise<IpSocketAddress>;
  subscribe(): Promise<Pollable>;
  shutdown(shutdownType: ShutdownType): Promise<void>;
}
