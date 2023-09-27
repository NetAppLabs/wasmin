export namespace ImportsIpNameLookup {
  export function resolveAddresses(network: Network, name: string, addressFamily: IpAddressFamily | null, includeUnavailable: boolean): ResolveAddressStream;
  export function resolveNextAddress(this: ResolveAddressStream): IpAddress | null;
}
import type { Network } from '../imports/network';
export { Network };
import type { IpAddressFamily } from '../imports/network';
export { IpAddressFamily };
export type ResolveAddressStream = number;
import type { ErrorCode } from '../imports/network';
export { ErrorCode };
import type { IpAddress } from '../imports/network';
export { IpAddress };
