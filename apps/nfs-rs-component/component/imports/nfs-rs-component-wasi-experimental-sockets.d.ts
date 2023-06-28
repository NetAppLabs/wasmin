export namespace NfsRsComponentWasiExperimentalSockets {
  export function addrResolve(host: string, port: IpPort | null): AddrResolveStream;
  export function addrResolveStreamNext(strm: AddrResolveStream): Addr | null;
  export function addrResolveStreamDispose(strm: AddrResolveStream): void;
  export function sockOpen(af: AddressFamily, socktype: SocketType): Fd;
  export function sockClose(s: Fd): void;
  export function sockConnect(s: Fd, a: Addr): void;
  export function sockAddrRemote(s: Fd): Addr;
  export function sockRecv(s: Fd, len: Size, f: Riflags): Uint8Array | ArrayBuffer;
  export function sockSend(s: Fd, buf: Uint8Array, len: Size, f: Riflags): Size;
}
export type IpPort = number;
export type AddrResolveStream = number;
export type ErrorCode = number;
/**
 * # Variants
 * 
 * ## `"ip4"`
 * 
 * ## `"ip6"`
 */
export type AddrType = 'ip4' | 'ip6';
export interface AddrIp4 {
  n0: number,
  n1: number,
  h0: number,
  h1: number,
}
export interface AddrIp4Port {
  addr: AddrIp4,
  port: IpPort,
}
export interface AddrIp6 {
  n0: number,
  n1: number,
  n2: number,
  n3: number,
  h0: number,
  h1: number,
  h2: number,
  h3: number,
}
export interface AddrIp6Port {
  addr: AddrIp6,
  port: IpPort,
}
export type AddrU = AddrU0 | AddrU1;
export interface AddrU0 {
  tag: 0,
  val: AddrIp4Port,
}
export interface AddrU1 {
  tag: 1,
  val: AddrIp6Port,
}
export interface Addr {
  tag: AddrType,
  u: AddrU,
}
/**
 * # Variants
 * 
 * ## `"inet4"`
 * 
 * ## `"inet6"`
 */
export type AddressFamily = 'inet4' | 'inet6';
/**
 * # Variants
 * 
 * ## `"dgram"`
 * 
 * ## `"strm"`
 */
export type SocketType = 'dgram' | 'strm';
export type Fd = number;
export type Size = number;
export type Riflags = number;
