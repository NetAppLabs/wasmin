export namespace WasiSocketsNetwork {
}
export type Network = number;
/**
 * # Variants
 * 
 * ## `"ipv4"`
 * 
 * ## `"ipv6"`
 */
export type IpAddressFamily = 'ipv4' | 'ipv6';
/**
 * # Variants
 * 
 * ## `"unknown"`
 * 
 * ## `"access-denied"`
 * 
 * ## `"not-supported"`
 * 
 * ## `"out-of-memory"`
 * 
 * ## `"timeout"`
 * 
 * ## `"concurrency-conflict"`
 * 
 * ## `"not-in-progress"`
 * 
 * ## `"would-block"`
 * 
 * ## `"address-family-not-supported"`
 * 
 * ## `"address-family-mismatch"`
 * 
 * ## `"invalid-remote-address"`
 * 
 * ## `"ipv4-only-operation"`
 * 
 * ## `"ipv6-only-operation"`
 * 
 * ## `"new-socket-limit"`
 * 
 * ## `"already-attached"`
 * 
 * ## `"already-bound"`
 * 
 * ## `"already-connected"`
 * 
 * ## `"not-bound"`
 * 
 * ## `"not-connected"`
 * 
 * ## `"address-not-bindable"`
 * 
 * ## `"address-in-use"`
 * 
 * ## `"ephemeral-ports-exhausted"`
 * 
 * ## `"remote-unreachable"`
 * 
 * ## `"already-listening"`
 * 
 * ## `"not-listening"`
 * 
 * ## `"connection-refused"`
 * 
 * ## `"connection-reset"`
 * 
 * ## `"datagram-too-large"`
 * 
 * ## `"invalid-name"`
 * 
 * ## `"name-unresolvable"`
 * 
 * ## `"temporary-resolver-failure"`
 * 
 * ## `"permanent-resolver-failure"`
 */
export type ErrorCode = 'unknown' | 'access-denied' | 'not-supported' | 'out-of-memory' | 'timeout' | 'concurrency-conflict' | 'not-in-progress' | 'would-block' | 'address-family-not-supported' | 'address-family-mismatch' | 'invalid-remote-address' | 'ipv4-only-operation' | 'ipv6-only-operation' | 'new-socket-limit' | 'already-attached' | 'already-bound' | 'already-connected' | 'not-bound' | 'not-connected' | 'address-not-bindable' | 'address-in-use' | 'ephemeral-ports-exhausted' | 'remote-unreachable' | 'already-listening' | 'not-listening' | 'connection-refused' | 'connection-reset' | 'datagram-too-large' | 'invalid-name' | 'name-unresolvable' | 'temporary-resolver-failure' | 'permanent-resolver-failure';
export type Ipv4Address = [number, number, number, number];
export type Ipv6Address = [number, number, number, number, number, number, number, number];
export type IpAddress = IpAddressIpv4 | IpAddressIpv6;
export interface IpAddressIpv4 {
  tag: 'ipv4',
  val: Ipv4Address,
}
export interface IpAddressIpv6 {
  tag: 'ipv6',
  val: Ipv6Address,
}
export interface Ipv4SocketAddress {
  port: number,
  address: Ipv4Address,
}
export interface Ipv6SocketAddress {
  port: number,
  flowInfo: number,
  address: Ipv6Address,
  scopeId: number,
}
export type IpSocketAddress = IpSocketAddressIpv4 | IpSocketAddressIpv6;
export interface IpSocketAddressIpv4 {
  tag: 'ipv4',
  val: Ipv4SocketAddress,
}
export interface IpSocketAddressIpv6 {
  tag: 'ipv6',
  val: Ipv6SocketAddress,
}
