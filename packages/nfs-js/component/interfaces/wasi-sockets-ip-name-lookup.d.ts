/** @module Interface wasi:sockets/ip-name-lookup@0.2.0 **/
export function resolveAddresses(network: Network, name: string): ResolveAddressStream;
export type IpAddress = import('./wasi-sockets-network.js').IpAddress;
export type ErrorCode = import('./wasi-sockets-network.js').ErrorCode;
export type Network = import('./wasi-sockets-network.js').Network;

export class ResolveAddressStream {
  /**
   * This type does not have a public constructor.
   */
  private constructor();
  resolveNextAddress(): IpAddress | undefined;
}
