export namespace WasiSocketsTcpCreateSocket {
  export function createTcpSocket(addressFamily: IpAddressFamily): TcpSocket;
}
import type { IpAddressFamily } from '../interfaces/wasi-sockets-network.js';
export { IpAddressFamily };
import type { TcpSocket } from '../interfaces/wasi-sockets-tcp.js';
export { TcpSocket };
import type { ErrorCode } from '../interfaces/wasi-sockets-network.js';
export { ErrorCode };
