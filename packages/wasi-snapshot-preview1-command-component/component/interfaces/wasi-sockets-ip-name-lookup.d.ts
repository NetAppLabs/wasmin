export namespace WasiSocketsIpNameLookup {
  export function resolveAddresses(network: Network, name: string, addressFamily: IpAddressFamily | undefined, includeUnavailable: boolean): ResolveAddressStream;
  export function resolveNextAddress(this_: ResolveAddressStream): IpAddress | undefined;
}
import type { Network } from '../interfaces/wasi-sockets-network';
export { Network };
import type { IpAddressFamily } from '../interfaces/wasi-sockets-network';
export { IpAddressFamily };
export type ResolveAddressStream = number;
import type { ErrorCode } from '../interfaces/wasi-sockets-network';
export { ErrorCode };
import type { IpAddress } from '../interfaces/wasi-sockets-network';
export { IpAddress };
