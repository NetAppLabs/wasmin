export namespace ImportsUdp {
  export function startBind(this: UdpSocket, network: Network, localAddress: IpSocketAddress): void;
  export function finishBind(this: UdpSocket): void;
  export function startConnect(this: UdpSocket, network: Network, remoteAddress: IpSocketAddress): void;
  export function finishConnect(this: UdpSocket): void;
  export function localAddress(this: UdpSocket): IpSocketAddress;
  export function remoteAddress(this: UdpSocket): IpSocketAddress;
  export function dropUdpSocket(this: UdpSocket): void;
}
export type UdpSocket = number;
import type { Network } from '../imports/network';
export { Network };
import type { IpSocketAddress } from '../imports/network';
export { IpSocketAddress };
import type { ErrorCode } from '../imports/network';
export { ErrorCode };
