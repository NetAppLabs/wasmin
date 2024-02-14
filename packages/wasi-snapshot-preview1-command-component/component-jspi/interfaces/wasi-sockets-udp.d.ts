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

export class IncomingDatagramStream {
  receive(maxResults: bigint): Promise<IncomingDatagram[]>;
}

export class OutgoingDatagramStream {
  checkSend(): Promise<bigint>;
  send(datagrams: OutgoingDatagram[]): Promise<bigint>;
  subscribe(): Promise<Pollable>;
}

export class UdpSocket {
  startBind(network: Network, localAddress: IpSocketAddress): Promise<void>;
  finishBind(): Promise<void>;
  stream(remoteAddress: IpSocketAddress | undefined): Promise<[IncomingDatagramStream, OutgoingDatagramStream]>;
  localAddress(): Promise<IpSocketAddress>;
  remoteAddress(): Promise<IpSocketAddress>;
  subscribe(): Promise<Pollable>;
}
