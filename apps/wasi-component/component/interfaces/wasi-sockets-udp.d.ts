export namespace WasiSocketsUdp {
  export function startBind(this_: UdpSocket, network: Network, localAddress: IpSocketAddress): void;
  export function finishBind(this_: UdpSocket): void;
  export function startConnect(this_: UdpSocket, network: Network, remoteAddress: IpSocketAddress): void;
  export function finishConnect(this_: UdpSocket): void;
  export function receive(this_: UdpSocket, maxResults: bigint): Datagram[];
  export function send(this_: UdpSocket, datagrams: Datagram[]): bigint;
  export function localAddress(this_: UdpSocket): IpSocketAddress;
  export function remoteAddress(this_: UdpSocket): IpSocketAddress;
  export function dropUdpSocket(this_: UdpSocket): void;
}
export type UdpSocket = number;
import type { Network } from '../interfaces/wasi-sockets-network';
export { Network };
import type { IpSocketAddress } from '../interfaces/wasi-sockets-network';
export { IpSocketAddress };
import type { ErrorCode } from '../interfaces/wasi-sockets-network';
export { ErrorCode };
export interface Datagram {
  data: Uint8Array,
  remoteAddress: IpSocketAddress,
}
