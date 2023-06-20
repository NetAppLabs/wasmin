export interface SocketsUdp {
  /**
   * Bind the socket to a specific network on the provided IP address and port.
   * 
   * If the IP address is zero (`0.0.0.0` in IPv4, `::` in IPv6), it is left to the implementation to decide which
   * network interface(s) to bind to.
   * If the TCP/UDP port is zero, the socket will be bound to a random free port.
   * 
   * When a socket is not explicitly bound, the first invocation to connect will implicitly bind the socket.
   * 
   * Unlike in POSIX, this function is async. This enables interactive WASI hosts to inject permission prompts.
   * 
   * # Typical `start` errors
   * - `address-family-mismatch`:   The `local-address` has the wrong address family. (EINVAL)
   * - `already-bound`:             The socket is already bound. (EINVAL)
   * - `concurrency-conflict`:      Another `bind` or `connect` operation is already in progress. (EALREADY)
   * 
   * # Typical `finish` errors
   * - `ephemeral-ports-exhausted`: No ephemeral ports available. (EADDRINUSE, ENOBUFS on Windows)
   * - `address-in-use`:            Address is already in use. (EADDRINUSE)
   * - `address-not-bindable`:      `local-address` is not an address that the `network` can bind to. (EADDRNOTAVAIL)
   * - `not-in-progress`:           A `bind` operation is not in progress.
   * - `would-block`:               Can't finish the operation, it is still in progress. (EWOULDBLOCK, EAGAIN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/bind.html>
   * - <https://man7.org/linux/man-pages/man2/bind.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-bind>
   * - <https://man.freebsd.org/cgi/man.cgi?query=bind&sektion=2&format=html>
   */
   startBind(this0: UdpSocket, network: Network, localAddress: IpSocketAddress): void;
   finishBind(this0: UdpSocket): void;
  /**
   * Set the destination address.
   * 
   * The local-address is updated based on the best network path to `remote-address`.
   * 
   * When a destination address is set:
   * - all receive operations will only return datagrams sent from the provided `remote-address`.
   * - the `send` function can only be used to send to this destination.
   * 
   * Note that this function does not generate any network traffic and the peer is not aware of this "connection".
   * 
   * Unlike in POSIX, this function is async. This enables interactive WASI hosts to inject permission prompts.
   * 
   * # Typical `start` errors
   * - `address-family-mismatch`:   The `remote-address` has the wrong address family. (EAFNOSUPPORT)
   * - `invalid-remote-address`:    The IP address in `remote-address` is set to INADDR_ANY (`0.0.0.0` / `::`). (EDESTADDRREQ, EADDRNOTAVAIL)
   * - `invalid-remote-address`:    The port in `remote-address` is set to 0. (EDESTADDRREQ, EADDRNOTAVAIL)
   * - `already-attached`:          The socket is already bound to a different network. The `network` passed to `connect` must be identical to the one passed to `bind`.
   * - `concurrency-conflict`:      Another `bind` or `connect` operation is already in progress. (EALREADY)
   * 
   * # Typical `finish` errors
   * - `ephemeral-ports-exhausted`: Tried to perform an implicit bind, but there were no ephemeral ports available. (EADDRINUSE, EADDRNOTAVAIL on Linux, EAGAIN on BSD)
   * - `not-in-progress`:           A `connect` operation is not in progress.
   * - `would-block`:               Can't finish the operation, it is still in progress. (EWOULDBLOCK, EAGAIN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/connect.html>
   * - <https://man7.org/linux/man-pages/man2/connect.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-connect>
   * - <https://man.freebsd.org/cgi/man.cgi?connect>
   */
   startConnect(this0: UdpSocket, network: Network, remoteAddress: IpSocketAddress): void;
   finishConnect(this0: UdpSocket): void;
  /**
   * Receive a message.
   * 
   * Returns:
   * - The sender address of the datagram
   * - The number of bytes read.
   * 
   * # Typical errors
   * - `not-bound`:          The socket is not bound to any local address. (EINVAL)
   * - `remote-unreachable`: The remote address is not reachable. (ECONNREFUSED, ECONNRESET, ENETRESET on Windows, EHOSTUNREACH, EHOSTDOWN, ENETUNREACH, ENETDOWN)
   * - `would-block`:        There is no pending data available to be read at the moment. (EWOULDBLOCK, EAGAIN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/recvfrom.html>
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/recvmsg.html>
   * - <https://man7.org/linux/man-pages/man2/recv.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-recv>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-recvfrom>
   * - <https://learn.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms741687(v=vs.85)>
   * - <https://man.freebsd.org/cgi/man.cgi?query=recv&sektion=2>
   */
   receive(this0: UdpSocket): Datagram;
  /**
   * Send a message to a specific destination address.
   * 
   * The remote address option is required. To send a message to the "connected" peer,
   * call `remote-address` to get their address.
   * 
   * # Typical errors
   * - `address-family-mismatch`: The `remote-address` has the wrong address family. (EAFNOSUPPORT)
   * - `invalid-remote-address`:  The IP address in `remote-address` is set to INADDR_ANY (`0.0.0.0` / `::`). (EDESTADDRREQ, EADDRNOTAVAIL)
   * - `invalid-remote-address`:  The port in `remote-address` is set to 0. (EDESTADDRREQ, EADDRNOTAVAIL)
   * - `already-connected`:       The socket is in "connected" mode and the `datagram.remote-address` does not match the address passed to `connect`. (EISCONN)
   * - `not-bound`:               The socket is not bound to any local address. Unlike POSIX, this function does not perform an implicit bind.
   * - `remote-unreachable`:      The remote address is not reachable. (ECONNREFUSED, ECONNRESET, ENETRESET on Windows, EHOSTUNREACH, EHOSTDOWN, ENETUNREACH, ENETDOWN)
   * - `datagram-too-large`:      The datagram is too large. (EMSGSIZE)
   * - `would-block`:             The send buffer is currently full. (EWOULDBLOCK, EAGAIN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/sendto.html>
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/sendmsg.html>
   * - <https://man7.org/linux/man-pages/man2/send.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-send>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-sendto>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-wsasendmsg>
   * - <https://man.freebsd.org/cgi/man.cgi?query=send&sektion=2>
   */
   send(this0: UdpSocket, datagram: Datagram): void;
  /**
   * Get the current bound address.
   * 
   * # Typical errors
   * - `not-bound`: The socket is not bound to any local address.
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/getsockname.html>
   * - <https://man7.org/linux/man-pages/man2/getsockname.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-getsockname>
   * - <https://man.freebsd.org/cgi/man.cgi?getsockname>
   */
   localAddress(this0: UdpSocket): IpSocketAddress;
  /**
   * Get the address set with `connect`.
   * 
   * # Typical errors
   * - `not-connected`: The socket is not connected to a remote address. (ENOTCONN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/getpeername.html>
   * - <https://man7.org/linux/man-pages/man2/getpeername.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-getpeername>
   * - <https://man.freebsd.org/cgi/man.cgi?query=getpeername&sektion=2&n=1>
   */
   remoteAddress(this0: UdpSocket): IpSocketAddress;
  /**
   * Whether this is a IPv4 or IPv6 socket.
   * 
   * Equivalent to the SO_DOMAIN socket option.
   */
   addressFamily(this0: UdpSocket): IpAddressFamily;
  /**
   * Whether IPv4 compatibility (dual-stack) mode is disabled or not.
   * 
   * Equivalent to the IPV6_V6ONLY socket option.
   * 
   * # Typical errors
   * - `ipv6-only-operation`:  (get/set) `this` socket is an IPv4 socket.
   * - `already-bound`:        (set) The socket is already bound.
   * - `not-supported`:        (set) Host does not support dual-stack sockets. (Implementations are not required to.)
   * - `concurrency-conflict`: (set) Another `bind` or `connect` operation is already in progress. (EALREADY)
   */
   ipv6Only(this0: UdpSocket): boolean;
   setIpv6Only(this0: UdpSocket, value: boolean): void;
  /**
   * Equivalent to the IP_TTL & IPV6_UNICAST_HOPS socket options.
   * 
   * # Typical errors
   * - `concurrency-conflict`: (set) Another `bind` or `connect` operation is already in progress. (EALREADY)
   */
   unicastHopLimit(this0: UdpSocket): number;
   setUnicastHopLimit(this0: UdpSocket, value: number): void;
  /**
   * The kernel buffer space reserved for sends/receives on this socket.
   * 
   * Note #1: an implementation may choose to cap or round the buffer size when setting the value.
   * In other words, after setting a value, reading the same setting back may return a different value.
   * 
   * Note #2: there is not necessarily a direct relationship between the kernel buffer size and the bytes of
   * actual data to be sent/received by the application, because the kernel might also use the buffer space
   * for internal metadata structures.
   * 
   * Fails when this socket is in the Listening state.
   * 
   * Equivalent to the SO_RCVBUF and SO_SNDBUF socket options.
   * 
   * # Typical errors
   * - `concurrency-conflict`: (set) Another `bind` or `connect` operation is already in progress. (EALREADY)
   */
   receiveBufferSize(this0: UdpSocket): bigint;
   setReceiveBufferSize(this0: UdpSocket, value: bigint): void;
   sendBufferSize(this0: UdpSocket): bigint;
   setSendBufferSize(this0: UdpSocket, value: bigint): void;
  /**
   * Create a `pollable` which will resolve once the socket is ready for I/O.
   * 
   * Note: this function is here for WASI Preview2 only.
   * It's planned to be removed when `future` is natively supported in Preview3.
   */
   subscribe(this0: UdpSocket): Pollable;
  /**
   * Dispose of the specified `udp-socket`, after which it may no longer be used.
   * 
   * Note: this function is scheduled to be removed when Resources are natively supported in Wit.
   */
   dropUdpSocket(this0: UdpSocket): void;
}
export interface SocketsUdpAsync {
  /**
   * Bind the socket to a specific network on the provided IP address and port.
   * 
   * If the IP address is zero (`0.0.0.0` in IPv4, `::` in IPv6), it is left to the implementation to decide which
   * network interface(s) to bind to.
   * If the TCP/UDP port is zero, the socket will be bound to a random free port.
   * 
   * When a socket is not explicitly bound, the first invocation to connect will implicitly bind the socket.
   * 
   * Unlike in POSIX, this function is async. This enables interactive WASI hosts to inject permission prompts.
   * 
   * # Typical `start` errors
   * - `address-family-mismatch`:   The `local-address` has the wrong address family. (EINVAL)
   * - `already-bound`:             The socket is already bound. (EINVAL)
   * - `concurrency-conflict`:      Another `bind` or `connect` operation is already in progress. (EALREADY)
   * 
   * # Typical `finish` errors
   * - `ephemeral-ports-exhausted`: No ephemeral ports available. (EADDRINUSE, ENOBUFS on Windows)
   * - `address-in-use`:            Address is already in use. (EADDRINUSE)
   * - `address-not-bindable`:      `local-address` is not an address that the `network` can bind to. (EADDRNOTAVAIL)
   * - `not-in-progress`:           A `bind` operation is not in progress.
   * - `would-block`:               Can't finish the operation, it is still in progress. (EWOULDBLOCK, EAGAIN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/bind.html>
   * - <https://man7.org/linux/man-pages/man2/bind.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-bind>
   * - <https://man.freebsd.org/cgi/man.cgi?query=bind&sektion=2&format=html>
   */
   startBind(this0: UdpSocket, network: Network, localAddress: IpSocketAddress): Promise<void>;
   finishBind(this0: UdpSocket): Promise<void>;
  /**
   * Set the destination address.
   * 
   * The local-address is updated based on the best network path to `remote-address`.
   * 
   * When a destination address is set:
   * - all receive operations will only return datagrams sent from the provided `remote-address`.
   * - the `send` function can only be used to send to this destination.
   * 
   * Note that this function does not generate any network traffic and the peer is not aware of this "connection".
   * 
   * Unlike in POSIX, this function is async. This enables interactive WASI hosts to inject permission prompts.
   * 
   * # Typical `start` errors
   * - `address-family-mismatch`:   The `remote-address` has the wrong address family. (EAFNOSUPPORT)
   * - `invalid-remote-address`:    The IP address in `remote-address` is set to INADDR_ANY (`0.0.0.0` / `::`). (EDESTADDRREQ, EADDRNOTAVAIL)
   * - `invalid-remote-address`:    The port in `remote-address` is set to 0. (EDESTADDRREQ, EADDRNOTAVAIL)
   * - `already-attached`:          The socket is already bound to a different network. The `network` passed to `connect` must be identical to the one passed to `bind`.
   * - `concurrency-conflict`:      Another `bind` or `connect` operation is already in progress. (EALREADY)
   * 
   * # Typical `finish` errors
   * - `ephemeral-ports-exhausted`: Tried to perform an implicit bind, but there were no ephemeral ports available. (EADDRINUSE, EADDRNOTAVAIL on Linux, EAGAIN on BSD)
   * - `not-in-progress`:           A `connect` operation is not in progress.
   * - `would-block`:               Can't finish the operation, it is still in progress. (EWOULDBLOCK, EAGAIN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/connect.html>
   * - <https://man7.org/linux/man-pages/man2/connect.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-connect>
   * - <https://man.freebsd.org/cgi/man.cgi?connect>
   */
   startConnect(this0: UdpSocket, network: Network, remoteAddress: IpSocketAddress): Promise<void>;
   finishConnect(this0: UdpSocket): Promise<void>;
  /**
   * Receive a message.
   * 
   * Returns:
   * - The sender address of the datagram
   * - The number of bytes read.
   * 
   * # Typical errors
   * - `not-bound`:          The socket is not bound to any local address. (EINVAL)
   * - `remote-unreachable`: The remote address is not reachable. (ECONNREFUSED, ECONNRESET, ENETRESET on Windows, EHOSTUNREACH, EHOSTDOWN, ENETUNREACH, ENETDOWN)
   * - `would-block`:        There is no pending data available to be read at the moment. (EWOULDBLOCK, EAGAIN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/recvfrom.html>
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/recvmsg.html>
   * - <https://man7.org/linux/man-pages/man2/recv.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-recv>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-recvfrom>
   * - <https://learn.microsoft.com/en-us/previous-versions/windows/desktop/legacy/ms741687(v=vs.85)>
   * - <https://man.freebsd.org/cgi/man.cgi?query=recv&sektion=2>
   */
   receive(this0: UdpSocket): Promise<Datagram>;
  /**
   * Send a message to a specific destination address.
   * 
   * The remote address option is required. To send a message to the "connected" peer,
   * call `remote-address` to get their address.
   * 
   * # Typical errors
   * - `address-family-mismatch`: The `remote-address` has the wrong address family. (EAFNOSUPPORT)
   * - `invalid-remote-address`:  The IP address in `remote-address` is set to INADDR_ANY (`0.0.0.0` / `::`). (EDESTADDRREQ, EADDRNOTAVAIL)
   * - `invalid-remote-address`:  The port in `remote-address` is set to 0. (EDESTADDRREQ, EADDRNOTAVAIL)
   * - `already-connected`:       The socket is in "connected" mode and the `datagram.remote-address` does not match the address passed to `connect`. (EISCONN)
   * - `not-bound`:               The socket is not bound to any local address. Unlike POSIX, this function does not perform an implicit bind.
   * - `remote-unreachable`:      The remote address is not reachable. (ECONNREFUSED, ECONNRESET, ENETRESET on Windows, EHOSTUNREACH, EHOSTDOWN, ENETUNREACH, ENETDOWN)
   * - `datagram-too-large`:      The datagram is too large. (EMSGSIZE)
   * - `would-block`:             The send buffer is currently full. (EWOULDBLOCK, EAGAIN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/sendto.html>
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/sendmsg.html>
   * - <https://man7.org/linux/man-pages/man2/send.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-send>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-sendto>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-wsasendmsg>
   * - <https://man.freebsd.org/cgi/man.cgi?query=send&sektion=2>
   */
   send(this0: UdpSocket, datagram: Datagram): Promise<void>;
  /**
   * Get the current bound address.
   * 
   * # Typical errors
   * - `not-bound`: The socket is not bound to any local address.
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/getsockname.html>
   * - <https://man7.org/linux/man-pages/man2/getsockname.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-getsockname>
   * - <https://man.freebsd.org/cgi/man.cgi?getsockname>
   */
   localAddress(this0: UdpSocket): Promise<IpSocketAddress>;
  /**
   * Get the address set with `connect`.
   * 
   * # Typical errors
   * - `not-connected`: The socket is not connected to a remote address. (ENOTCONN)
   * 
   * # References
   * - <https://pubs.opengroup.org/onlinepubs/9699919799/functions/getpeername.html>
   * - <https://man7.org/linux/man-pages/man2/getpeername.2.html>
   * - <https://learn.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-getpeername>
   * - <https://man.freebsd.org/cgi/man.cgi?query=getpeername&sektion=2&n=1>
   */
   remoteAddress(this0: UdpSocket): Promise<IpSocketAddress>;
  /**
   * Whether this is a IPv4 or IPv6 socket.
   * 
   * Equivalent to the SO_DOMAIN socket option.
   */
   addressFamily(this0: UdpSocket): Promise<IpAddressFamily>;
  /**
   * Whether IPv4 compatibility (dual-stack) mode is disabled or not.
   * 
   * Equivalent to the IPV6_V6ONLY socket option.
   * 
   * # Typical errors
   * - `ipv6-only-operation`:  (get/set) `this` socket is an IPv4 socket.
   * - `already-bound`:        (set) The socket is already bound.
   * - `not-supported`:        (set) Host does not support dual-stack sockets. (Implementations are not required to.)
   * - `concurrency-conflict`: (set) Another `bind` or `connect` operation is already in progress. (EALREADY)
   */
   ipv6Only(this0: UdpSocket): Promise<boolean>;
   setIpv6Only(this0: UdpSocket, value: boolean): Promise<void>;
  /**
   * Equivalent to the IP_TTL & IPV6_UNICAST_HOPS socket options.
   * 
   * # Typical errors
   * - `concurrency-conflict`: (set) Another `bind` or `connect` operation is already in progress. (EALREADY)
   */
   unicastHopLimit(this0: UdpSocket): Promise<number>;
   setUnicastHopLimit(this0: UdpSocket, value: number): Promise<void>;
  /**
   * The kernel buffer space reserved for sends/receives on this socket.
   * 
   * Note #1: an implementation may choose to cap or round the buffer size when setting the value.
   * In other words, after setting a value, reading the same setting back may return a different value.
   * 
   * Note #2: there is not necessarily a direct relationship between the kernel buffer size and the bytes of
   * actual data to be sent/received by the application, because the kernel might also use the buffer space
   * for internal metadata structures.
   * 
   * Fails when this socket is in the Listening state.
   * 
   * Equivalent to the SO_RCVBUF and SO_SNDBUF socket options.
   * 
   * # Typical errors
   * - `concurrency-conflict`: (set) Another `bind` or `connect` operation is already in progress. (EALREADY)
   */
   receiveBufferSize(this0: UdpSocket): Promise<bigint>;
   setReceiveBufferSize(this0: UdpSocket, value: bigint): Promise<void>;
   sendBufferSize(this0: UdpSocket): Promise<bigint>;
   setSendBufferSize(this0: UdpSocket, value: bigint): Promise<void>;
  /**
   * Create a `pollable` which will resolve once the socket is ready for I/O.
   * 
   * Note: this function is here for WASI Preview2 only.
   * It's planned to be removed when `future` is natively supported in Preview3.
   */
   subscribe(this0: UdpSocket): Promise<Pollable>;
  /**
   * Dispose of the specified `udp-socket`, after which it may no longer be used.
   * 
   * Note: this function is scheduled to be removed when Resources are natively supported in Wit.
   */
   dropUdpSocket(this0: UdpSocket): Promise<void>;
}
import type { Pollable } from '../imports/poll-poll';
export { Pollable };
import type { Network } from '../imports/sockets-network';
export { Network };
import type { ErrorCode } from '../imports/sockets-network';
export { ErrorCode };
import type { IpSocketAddress } from '../imports/sockets-network';
export { IpSocketAddress };
import type { IpAddressFamily } from '../imports/sockets-network';
export { IpAddressFamily };
/**
 * A UDP socket handle.
 */
export type UdpSocket = number;
export interface Datagram {
  data: Uint8Array,
  remoteAddress: IpSocketAddress,
}
