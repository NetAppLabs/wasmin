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
  startBind(network: Network, localAddress: IpSocketAddress): Promise<void>;
  finishBind(): Promise<void>;
  localAddress(): Promise<IpSocketAddress>;
  remoteAddress(): Promise<IpSocketAddress>;
}
