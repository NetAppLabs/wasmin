export namespace WasiSocketsUdpCreateSocket {
  export function  createUdpSocket(addressFamily: IpAddressFamily): UdpSocket;
}
import type { IpAddressFamily } from '../interfaces/wasi-sockets-network.js';
export { IpAddressFamily };
import type { UdpSocket } from '../interfaces/wasi-sockets-udp.js';
export { UdpSocket };
import type { ErrorCode } from '../interfaces/wasi-sockets-network.js';
export { ErrorCode };
