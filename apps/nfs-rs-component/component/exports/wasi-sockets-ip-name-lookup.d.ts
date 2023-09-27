export namespace WasiSocketsIpNameLookup {
  export function resolveAddresses(network: Network, name: string, addressFamily: IpAddressFamily | null, includeUnavailable: boolean): ResolveAddressStream;
  export function resolveNextAddress(this_: ResolveAddressStream): IpAddress | null;
  export function dropResolveAddressStream(this_: ResolveAddressStream): void;
}
import type { Network } from '../exports/wasi-sockets-network';
export { Network };
import type { IpAddressFamily } from '../exports/wasi-sockets-network';
export { IpAddressFamily };
export type ResolveAddressStream = number;
import type { ErrorCode } from '../exports/wasi-sockets-network';
export { ErrorCode };
import type { IpAddress } from '../exports/wasi-sockets-network';
export { IpAddress };
