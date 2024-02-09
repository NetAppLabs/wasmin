export namespace WasiSocketsIpNameLookup {
  export { ResolveAddressStream };
  export function  resolveAddresses(network: Network, name: string): ResolveAddressStream;
}
import type { IpAddress } from '../interfaces/wasi-sockets-network.js';
export { IpAddress };
import type { ErrorCode } from '../interfaces/wasi-sockets-network.js';
export { ErrorCode };
import type { Network } from '../interfaces/wasi-sockets-network.js';
export { Network };

export class ResolveAddressStream {
  resolveNextAddress(): IpAddress | undefined;
}
