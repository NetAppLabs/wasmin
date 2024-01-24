export namespace WasiSocketsUdp {
  export { UdpSocket };
}
import type { Network } from '../interfaces/wasi-sockets-network.js';
export { Network };
import type { IpSocketAddress } from '../interfaces/wasi-sockets-network.js';
export { IpSocketAddress };
import type { ErrorCode } from '../interfaces/wasi-sockets-network.js';
export { ErrorCode };

export class UdpSocket {
  startBind(network: Network, localAddress: IpSocketAddress): void;
  finishBind(): void;
  localAddress(): IpSocketAddress;
  remoteAddress(): IpSocketAddress;
}
