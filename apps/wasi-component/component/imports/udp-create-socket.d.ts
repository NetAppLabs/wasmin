export namespace ImportsUdpCreateSocket {
  export function createUdpSocket(addressFamily: IpAddressFamily): UdpSocket;
}
import type { IpAddressFamily } from '../imports/network';
export { IpAddressFamily };
import type { UdpSocket } from '../imports/udp';
export { UdpSocket };
import type { ErrorCode } from '../imports/network';
export { ErrorCode };
