export namespace SocketsTcpCreateSocket {
  export function createTcpSocket(addressFamily: IpAddressFamily): TcpSocket;
}
import type { IpAddressFamily } from '../imports/network';
export { IpAddressFamily };
import type { TcpSocket } from '../imports/tcp';
export { TcpSocket };
import type { ErrorCode } from '../imports/network';
export { ErrorCode };
