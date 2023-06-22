import { SocketsInstanceNetworkNamespace as socki } from "@wasm-env/wasi-snapshot-preview2";
type SocketsInstanceNetworkAsync = socki.SocketsInstanceNetworkAsync;
type Network = socki.Network;
import { SocketsNetworkNamespace as sockn } from "@wasm-env/wasi-snapshot-preview2";
type SocketsNetworkAsync = sockn.SocketsNetworkAsync;
import { SocketsTcpCreateSocketNamespace as socktc } from "@wasm-env/wasi-snapshot-preview2";
type SocketsTcpCreateSocketAsync = socktc.SocketsTcpCreateSocketAsync;
import { SocketsIpNameLookupNamespace as socklookup } from "@wasm-env/wasi-snapshot-preview2";
type SocketsIpNameLookupAsync = socklookup.SocketsIpNameLookupAsync;

import { SocketsTcpNamespace as sockt } from "@wasm-env/wasi-snapshot-preview2";
import { InputStream, OutputStream } from "@wasm-env/wasi-snapshot-preview2/dist/imports/io-streams";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi";
import { createTcpSocket, getAddressResolver } from "../wasi_experimental_sockets/net.js";
import {
    AddressFamily as AddressFamilyCommon,
    AddressInfo,
    IPv4AddressToArray,
    IPv6AddressToArray,
    WasiSocket,
} from "../wasi_experimental_sockets/common";
import { ResourceManager, translateError } from "./preview2Utils";
type SocketsTcpAsync = sockt.SocketsTcpAsync;
type TcpSocket = socktc.TcpSocket;
type Pollable = sockt.Pollable;
type IpSocketAddress = sockn.IpSocketAddress;
type IpSocketAddressIpv4 = sockn.IpSocketAddressIpv4;
type IpSocketAddressIpv6 = sockn.IpSocketAddressIpv6;
type IpAddress = sockn.IpAddress;
type IpAddressFamily = sockn.IpAddressFamily;
type ResolveAddressStream = socklookup.ResolveAddressStream;
type Ipv4Address = sockn.Ipv4Address;
type Ipv6Address = sockn.Ipv6Address;
type IpAddressIpv4 = sockn.IpAddressIpv4;
type IpAddressIpv6 = sockn.IpAddressIpv6;

const DEFAULT_NETWORK: Network = 0;

export class SocketsNetworkAsyncHost implements SocketsInstanceNetworkAsync, SocketsNetworkAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async instanceNetwork(): Promise<Network> {
        return DEFAULT_NETWORK;
    }
    async dropNetwork(netw: Network): Promise<void> {
        // no-op for now
        return;
    }
}

export class SocketsTcpAsyncHost implements SocketsTcpCreateSocketAsync, SocketsTcpAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    getSocket(fd: number): WasiSocket {
        const res = this.openFiles.get(fd);
        return res as WasiSocket;
    }

    async createTcpSocket(addressFamily: sockn.IpAddressFamily): Promise<TcpSocket> {
        try {
            // TODO: addressFamily ignored for now
            const sock = await createTcpSocket();
            const sockFd = this.openFiles.add(sock);
            return sockFd;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async startBind(sockFd: TcpSocket, network: number, localAddress: IpSocketAddress): Promise<void> {
        try {
            const sock = this.getSocket(sockFd);
            const addrInfo = IpSocketAddressToAddrInfo(localAddress);
            await sock.bind(addrInfo);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async finishBind(sockFd: TcpSocket): Promise<void> {
        // no-op for now
    }
    async startConnect(sockFd: TcpSocket, network: Network, remoteAddress: sockn.IpSocketAddress): Promise<void> {
        try {
            const sock = this.getSocket(sockFd);
            const remoteAddrInfo = IpSocketAddressToAddrInfo(remoteAddress);
            const remoteAddr = remoteAddrInfo.address;
            const remotePort = remoteAddrInfo.port;
            await sock.connect(remoteAddr, remotePort);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async finishConnect(sockFd: TcpSocket): Promise<[InputStream, OutputStream]> {
        // returning as previously created in startConnect
        return [sockFd, sockFd];
    }
    async startListen(sockFd: TcpSocket, network: Network): Promise<void> {
        try {
            // Network ignored for now
            const sock = this.getSocket(sockFd);
            // TODO look into backlog
            const backlog = 0;
            await sock.listen(backlog);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async finishListen(sockFd: TcpSocket): Promise<void> {
        // no-op for now
    }
    async accept(sockFd: TcpSocket): Promise<[TcpSocket, InputStream, OutputStream]> {
        try {
            const sock = this.getSocket(sockFd);
            const clientSock = await sock.getAcceptedSocket();
            const resultFd = this.openFiles.add(clientSock);
            return [resultFd, resultFd, resultFd];
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async localAddress(sockFd: TcpSocket): Promise<sockn.IpSocketAddress> {
        try {
            const sock = this.getSocket(sockFd);
            const localAddrInfo = await sock.address();
            const localAddr = AddressInfoToIpSocketAddress(localAddrInfo);
            return localAddr;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async remoteAddress(sockFd: TcpSocket): Promise<sockn.IpSocketAddress> {
        try {
            const sock = this.getSocket(sockFd);
            const remoteAddrInfo = await sock.remoteAddress();
            const remoteAddr = AddressInfoToIpSocketAddress(remoteAddrInfo);
            return remoteAddr;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async addressFamily(sockFd: TcpSocket): Promise<sockn.IpAddressFamily> {
        try {
            const sock = this.getSocket(sockFd);
            const localAddrInfo = await sock.address();
            const aFamily = localAddrInfo.family;
            const family = AddressFamilyToIpAddressFamily(aFamily);
            return family;
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async ipv6Only(sockFd: TcpSocket): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async setIpv6Only(sockFd: TcpSocket, value: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async setListenBacklogSize(sockFd: TcpSocket, value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async keepAlive(sockFd: TcpSocket): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async setKeepAlive(sockFd: TcpSocket, value: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async noDelay(TcpSocket: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async setNoDelay(sockFd: TcpSocket, value: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async unicastHopLimit(sockFd: TcpSocket): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async setUnicastHopLimit(sockFd: TcpSocket, value: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async receiveBufferSize(sockFd: TcpSocket): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    async setReceiveBufferSize(sockFd: TcpSocket, value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async sendBufferSize(sockFd: TcpSocket): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    async setSendBufferSize(sockFd: TcpSocket, value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async subscribe(sockFd: TcpSocket): Promise<Pollable> {
        throw new Error("Method not implemented.");
    }
    async shutdown(sockFd: TcpSocket, shutdownType: sockt.ShutdownType): Promise<void> {
        try {
            const sock = this.getSocket(sockFd);
            sock.shutdown();
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async dropTcpSocket(sockFd: TcpSocket): Promise<void> {
        try {
            this.openFiles.close(sockFd);
        } catch (err: any) {
            throw translateError(err);
        }
    }
}

export class ResolveAddressIterator {
    constructor(public addresses: AddressInfo[], public position: number = 0) {}
    nextAddress(): AddressInfo | null {
        if (this.addresses.length > this.position) {
            const nextAddr = this.addresses[this.position];
            this.position++;
            return nextAddr;
        }
        return null;
    }
}

export class SocketsIpNameLookupAsyncHost implements SocketsIpNameLookupAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;
    private _addressLookupManager = new ResourceManager();
    async resolveAddresses(
        network: Network,
        name: string,
        addressFamily: IpAddressFamily | null,
        includeUnavailable: boolean
    ): Promise<ResolveAddressStream> {
        const host = name;
        const port = 0;
        const resolve = await getAddressResolver();
        const addresses = await resolve(host, port);
        const iter = new ResolveAddressIterator(addresses);
        const returnId = this._addressLookupManager.add(iter);
        return returnId;
    }
    async resolveNextAddress(resId: ResolveAddressStream): Promise<IpAddress | null> {
        const res = this._addressLookupManager.get(resId);
        if (res) {
            const iter = res as ResolveAddressIterator;
            const addrInfo = iter.nextAddress();
            if (addrInfo) {
                const ipAddr = AddressInfoToIpAddress(addrInfo);
                return ipAddr;
            }
        }
        return null;
    }
    async dropResolveAddressStream(res: ResolveAddressStream): Promise<void> {
        await this._addressLookupManager.close(res);
    }
    async subscribe(res: ResolveAddressStream): Promise<Pollable> {
        throw new Error("Method not implemented.");
    }
}

export function IpSocketAddressToAddrInfo(sockAddr: IpSocketAddress): AddressInfo {
    let family: AddressFamilyCommon;
    let hostAddr: string;
    let port: number;
    switch (sockAddr.tag) {
        case "ipv4": {
            family = "IPv4";
            const ip4SockAddr = sockAddr.val;
            port = ip4SockAddr.port;
            const ipv4 = ip4SockAddr.address as Ipv4Address;
            hostAddr = `${ipv4[0]}.${ipv4[1]}.${ipv4[2]}.${ipv4[3]}`;
        }
        case "ipv6": {
            family = "IPv6";
            const ip6SockAddr = sockAddr.val;
            port = ip6SockAddr.port;
            const ipv6 = ip6SockAddr.address as Ipv6Address;
            const n0s = ipv6[0];
            const n1s = ipv6[1];
            const n2s = ipv6[2];
            const n3s = ipv6[3];
            const h0s = ipv6[4];
            const h1s = ipv6[5];
            const h2s = ipv6[6];
            const h3s = ipv6[7];
            hostAddr = `${n0s}:${n1s}:${n2s}}:${n3s}:${h0s}:${h1s}:${h2s}}:${h3s}`;
        }
    }
    const addrinfo: AddressInfo = {
        address: hostAddr,
        port: port,
        family: family,
    };
    return addrinfo;
}

export function AddressInfoToIpSocketAddress(addrInfo: AddressInfo): IpSocketAddress {
    const address = addrInfo.address;
    switch (addrInfo.family) {
        case "IPv4": {
            const addrArray = IPv4AddressToArray(address);
            const ipv4Addr: IpSocketAddressIpv4 = {
                tag: "ipv4",
                val: {
                    port: addrInfo.port,
                    address: addrArray,
                },
            };
            return ipv4Addr;
        }
        case "IPv6": {
            const addrArray = IPv6AddressToArray(address);
            const ipv6Addr: IpSocketAddressIpv6 = {
                tag: "ipv6",
                val: {
                    port: addrInfo.port,
                    address: addrArray,
                    flowInfo: 0,
                    scopeId: 0,
                },
            };
            return ipv6Addr;
        }
    }
}

export function AddressInfoToIpAddress(addrInfo: AddressInfo): IpAddress {
    const ipSockAddr = AddressInfoToIpSocketAddress(addrInfo);
    switch (ipSockAddr.tag) {
        case "ipv4": {
            const ipAddr: IpAddressIpv4 = {
                tag: "ipv4",
                val: ipSockAddr.val.address,
            };
            return ipAddr;
        }
        case "ipv6": {
            const ipAddr: IpAddressIpv6 = {
                tag: "ipv6",
                val: ipSockAddr.val.address,
            };
            return ipAddr;
        }
    }
}

export function AddressFamilyToIpAddressFamily(addrFamily: AddressFamilyCommon): IpAddressFamily {
    switch (addrFamily) {
        case "IPv4":
            return "ipv4";
        case "IPv6":
            return "ipv6";
    }
}
