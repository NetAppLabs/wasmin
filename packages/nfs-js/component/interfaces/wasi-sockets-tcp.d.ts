/** @module Interface wasi:sockets/tcp@0.2.0 **/
export type Network = import('./wasi-sockets-network.js').Network;
export type IpSocketAddress = import('./wasi-sockets-network.js').IpSocketAddress;
export type ErrorCode = import('./wasi-sockets-network.js').ErrorCode;
export type InputStream = import('./wasi-io-streams.js').InputStream;
export type OutputStream = import('./wasi-io-streams.js').OutputStream;
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
  /**
   * This type does not have a public constructor.
   */
  private constructor();
  startConnect(network: Network, remoteAddress: IpSocketAddress): void;
  finishConnect(): [InputStream, OutputStream];
  remoteAddress(): IpSocketAddress;
  shutdown(shutdownType: ShutdownType): void;
}
