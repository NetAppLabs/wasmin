export namespace WasiSocketsUdp {
  export { UdpSocket };
  export { IncomingDatagramStream };
  export { OutgoingDatagramStream };
}
import type { Network } from '../interfaces/wasi-sockets-network.js';
export { Network };
import type { IpSocketAddress } from '../interfaces/wasi-sockets-network.js';
export { IpSocketAddress };
import type { ErrorCode } from '../interfaces/wasi-sockets-network.js';
export { ErrorCode };
import type { Pollable } from '../interfaces/wasi-io-poll.js';
export { Pollable };
export interface IncomingDatagram {
  data: Uint8Array,
  remoteAddress: IpSocketAddress,
}
export interface OutgoingDatagram {
  data: Uint8Array,
  remoteAddress?: IpSocketAddress,
}

export class UdpSocket {
  startBind(network: Network, localAddress: IpSocketAddress): void;
  finishBind(): void;
  stream(remoteAddress: IpSocketAddress | undefined): [IncomingDatagramStream, OutgoingDatagramStream];
  localAddress(): IpSocketAddress;
  remoteAddress(): IpSocketAddress;
  subscribe(): Pollable;
}

export class IncomingDatagramStream {
  receive(maxResults: bigint): IncomingDatagram[];
}

export class OutgoingDatagramStream {
  checkSend(): bigint;
  send(datagrams: OutgoingDatagram[]): bigint;
  subscribe(): Pollable;
}
