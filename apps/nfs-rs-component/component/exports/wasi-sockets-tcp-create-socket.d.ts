export namespace WasiSocketsTcpCreateSocket {
  export function createTcpSocket(addressFamily: IpAddressFamily): TcpSocket;
}
import type { IpAddressFamily } from '../exports/wasi-sockets-network';
export { IpAddressFamily };
import type { TcpSocket } from '../exports/wasi-sockets-tcp';
export { TcpSocket };
import type { ErrorCode } from '../exports/wasi-sockets-network';
export { ErrorCode };
