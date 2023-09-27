export namespace WasiSocketsTcpCreateSocket {
  export function createTcpSocket(addressFamily: IpAddressFamily): TcpSocket;
}
import type { IpAddressFamily } from '../imports/wasi-sockets-network';
export { IpAddressFamily };
import type { TcpSocket } from '../imports/wasi-sockets-tcp';
export { TcpSocket };
import type { ErrorCode } from '../imports/wasi-sockets-network';
export { ErrorCode };
