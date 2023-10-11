export namespace WasiSocketsUdpCreateSocket {
  export function createUdpSocket(addressFamily: IpAddressFamily): UdpSocket;
}
import type { IpAddressFamily } from '../interfaces/wasi-sockets-network';
export { IpAddressFamily };
import type { UdpSocket } from '../interfaces/wasi-sockets-udp';
export { UdpSocket };
import type { ErrorCode } from '../interfaces/wasi-sockets-network';
export { ErrorCode };
