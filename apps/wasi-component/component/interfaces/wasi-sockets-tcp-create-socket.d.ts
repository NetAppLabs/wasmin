export namespace WasiSocketsTcpCreateSocket {
  export function createTcpSocket(addressFamily: IpAddressFamily): TcpSocket;
}
import type { IpAddressFamily } from '../interfaces/wasi-sockets-network';
export { IpAddressFamily };
import type { TcpSocket } from '../interfaces/wasi-sockets-tcp';
export { TcpSocket };
import type { ErrorCode } from '../interfaces/wasi-sockets-network';
export { ErrorCode };
