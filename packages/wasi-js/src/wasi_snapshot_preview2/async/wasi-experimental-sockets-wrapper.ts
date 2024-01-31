import { FilesystemFilesystemNamespace as fs } from "@wasmin/wasi-snapshot-preview2";
type FilesystemFilesystemAsync = fs.WasiFilesystemTypesAsync;
import { SocketsInstanceNetworkNamespace as ins } from "@wasmin/wasi-snapshot-preview2";
type SocketsInstanceNetworkAsync = ins.WasiSocketsInstanceNetworkAsync;
import { SocketsIpNameLookupNamespace as lookupns } from "@wasmin/wasi-snapshot-preview2";
type SocketsIpNameLookupAsync = lookupns.WasiSocketsIpNameLookupAsync;
import { SocketsNetworkNamespace as sockns } from "@wasmin/wasi-snapshot-preview2";
type IpAddress = sockns.IpAddress;
type IpSocketAddress = sockns.IpSocketAddress;
type Ipv4SocketAddress = sockns.Ipv4SocketAddress;
type Ipv6SocketAddress = sockns.Ipv6SocketAddress;
type SocketsNetworkAsync = sockns.WasiSocketsNetworkAsync;
import { SocketsTcpNamespace as socktcpns } from "@wasmin/wasi-snapshot-preview2";
type SocketsTcpAsync = socktcpns.WasiSocketsTcpAsync;
import { SocketsTcpCreateSocketNamespace as sockcreatetcpns } from "@wasmin/wasi-snapshot-preview2";
type SocketsTcpCreateSocketAsync = sockcreatetcpns.WasiSocketsTcpCreateSocketAsync;

const ERRNO_AGAIN = 6;

type WasiExperimentalSocketsAddressFamily = "inet4" | "inet6";
type WasiExperimentalSocketsSocketType = "dgram" | "strm";
type WasiExperimentalSocketsFd = number;
type WasiExperimentalSocketsSize = number;
type WasiExperimentalSocketsRiflags = number;
type WasiExperimentalSocketsAddrResolveStream = number;

type WasiSnapshotPreview2FilesystemImportObject = FilesystemFilesystemAsync;

type WasiSnapshotPreview2SocketsImportObject = {
    socketsInstanceNetwork: SocketsInstanceNetworkAsync;
    socketsNetwork: SocketsNetworkAsync;
    socketsTcpCreateSocket: SocketsTcpCreateSocketAsync;
    socketsTcp: SocketsTcpAsync;
    socketsIpNameLookup: SocketsIpNameLookupAsync;
};

type WasiExperimentalSocketsAddressType = "ip4" | "ip6";
type WasiExperimentalSocketsIpPort = number;
interface WasiExperimentalSocketsAddressIp4 {
    n0: number;
    n1: number;
    h0: number;
    h1: number;
}
interface WasiExperimentalSocketsAddressIp4Port {
    addr: WasiExperimentalSocketsAddressIp4;
    port: WasiExperimentalSocketsIpPort;
}
interface WasiExperimentalSocketsAddressIp6 {
    n0: number;
    n1: number;
    n2: number;
    n3: number;
    h0: number;
    h1: number;
    h2: number;
    h3: number;
}
interface WasiExperimentalSocketsAddressIp6Port {
    addr: WasiExperimentalSocketsAddressIp6;
    port: WasiExperimentalSocketsIpPort;
}
type WasiExperimentalSocketsAddressU = WasiExperimentalSocketsAddressU0 | WasiExperimentalSocketsAddressU1;
interface WasiExperimentalSocketsAddressU0 {
    tag: 0;
    val: WasiExperimentalSocketsAddressIp4Port;
}
export interface WasiExperimentalSocketsAddressU1 {
    tag: 1;
    val: WasiExperimentalSocketsAddressIp6Port;
}
interface WasiExperimentalSocketsAddress {
    tag: WasiExperimentalSocketsAddressType;
    u: WasiExperimentalSocketsAddressU;
}

function WasiExperimentalSocketsAddressToIpv4SocketAddress(
    a: WasiExperimentalSocketsAddress
): Ipv4SocketAddress | undefined {
    if (a.tag !== "ip4") {
        return undefined;
    }
    const addr = a.u.val.addr as WasiExperimentalSocketsAddressIp4;
    const ip: Ipv4SocketAddress = {
        address: [addr.n0, addr.n1, addr.h0, addr.h1],
        port: a.u.val.port,
    };
    return ip;
}

function WasiExperimentalSocketsAddressToIpv6SocketAddress(
    a: WasiExperimentalSocketsAddress
): Ipv6SocketAddress | undefined {
    if (a.tag !== "ip6") {
        return undefined;
    }
    const addr = a.u.val.addr as WasiExperimentalSocketsAddressIp6;
    const ip: Ipv6SocketAddress = {
        address: [addr.n0, addr.n1, addr.n2, addr.n3, addr.h0, addr.h1, addr.h2, addr.h3],
        port: a.u.val.port,
        flowInfo: 0,
        scopeId: 0,
    };
    return ip;
}

function WasiExperimentalSocketsAddressToIpSocketAddress(a: WasiExperimentalSocketsAddress): IpSocketAddress {
    let ip: IpSocketAddress;
    const ip4 = WasiExperimentalSocketsAddressToIpv4SocketAddress(a);
    if (ip4) {
        ip = { tag: "ipv4", val: ip4 };
    } else {
        const ip6 = WasiExperimentalSocketsAddressToIpv6SocketAddress(a);
        if (!ip6) throw new Error(`invalid address ${a}`);
        ip = { tag: "ipv6", val: ip6 };
    }
    return ip;
}

function WasiExperimentalSocketsAddressIp4PortFromIpSocketAddress(
    ip: IpSocketAddress
): WasiExperimentalSocketsAddressIp4Port | undefined {
    if (ip.tag !== "ipv4") {
        return undefined;
    }
    const ip4 = ip.val as Ipv4SocketAddress;
    const addr: WasiExperimentalSocketsAddressIp4Port = {
        addr: {
            n0: ip4.address[0],
            n1: ip4.address[1],
            h0: ip4.address[2],
            h1: ip4.address[3],
        },
        port: ip4.port,
    };
    return addr;
}

function WasiExperimentalSocketsAddressIp6PortFromIpSocketAddress(
    ip: IpSocketAddress
): WasiExperimentalSocketsAddressIp6Port | undefined {
    if (ip.tag !== "ipv6") {
        return undefined;
    }
    const ip6 = ip.val as Ipv6SocketAddress;
    const addr: WasiExperimentalSocketsAddressIp6Port = {
        addr: {
            n0: ip6.address[0],
            n1: ip6.address[1],
            n2: ip6.address[2],
            n3: ip6.address[3],
            h0: ip6.address[4],
            h1: ip6.address[5],
            h2: ip6.address[6],
            h3: ip6.address[7],
        },
        port: ip6.port,
    };
    return addr;
}

function WasiExperimentalSocketsAddressFromIpSocketAddress(ip: IpSocketAddress): WasiExperimentalSocketsAddress {
    let addr: WasiExperimentalSocketsAddress;
    const addr4 = WasiExperimentalSocketsAddressIp4PortFromIpSocketAddress(ip);
    if (addr4) {
        addr = { tag: "ip4", u: { tag: 0, val: addr4 } };
    } else {
        const addr6 = WasiExperimentalSocketsAddressIp6PortFromIpSocketAddress(ip);
        if (!addr6) throw new Error(`invalid IP address ${ip}`);
        addr = { tag: "ip6", u: { tag: 1, val: addr6 } };
    }
    return addr;
}

function WasiExperimentalSocketsAddressFromIpAddress(ip: IpAddress, port: number): WasiExperimentalSocketsAddress {
    let ips: IpSocketAddress =
        ip.tag === "ipv6"
            ? { tag: ip.tag, val: { address: ip.val, port: port, flowInfo: 0, scopeId: 0 } }
            : { tag: ip.tag, val: { address: ip.val, port: port } };
    return WasiExperimentalSocketsAddressFromIpSocketAddress(ips);
}

/*
export class WasiExperimentalSocketsPreview2Wrapper {
    constructor(
        filesystem: () => WasiSnapshotPreview2FilesystemImportObject,
        sockets: () => WasiSnapshotPreview2SocketsImportObject
    ) {
        this._filesystem = filesystem;
        this._sockets = sockets;
    }

    _filesystem: () => WasiSnapshotPreview2FilesystemImportObject;
    _sockets: () => WasiSnapshotPreview2SocketsImportObject;
    _addrResolutions: Record<WasiExperimentalSocketsAddrResolveStream, WasiExperimentalSocketsIpPort | undefined> = {};

    get filesystem(): WasiSnapshotPreview2FilesystemImportObject {
        return this._filesystem();
    }

    get sockets(): WasiSnapshotPreview2SocketsImportObject {
        return this._sockets();
    }

    async addrResolve(
        host: string,
        port: WasiExperimentalSocketsIpPort | undefined
    ): Promise<WasiExperimentalSocketsAddrResolveStream> {
        const network = -1; // TODO: network value (unused by preview2 implementation)
        const addressFamily = undefined; // TODO: address family (unused by preview2 implementation)
        const includeUnavailable = true; // TODO: include unavailable flag (unused by preview2 implementation)
        const stream = await this.sockets.socketsIpNameLookup.resolveAddresses(
            network,
            host,
            addressFamily,
            includeUnavailable
        );
        this._addrResolutions[stream] = port;
        return stream;
    }

    async addrResolveStreamNext(
        stream: WasiExperimentalSocketsAddrResolveStream
    ): Promise<WasiExperimentalSocketsAddress | null> {
        const ip = await this.sockets.socketsIpNameLookup.resolveNextAddress(stream);
        if (!ip) {
            return null;
        }

        const port = this._addrResolutions[stream];
        return WasiExperimentalSocketsAddressFromIpAddress(ip, port || 0);
    }

    async addrResolveStreamDispose(stream: WasiExperimentalSocketsAddrResolveStream): Promise<void> {
        await this.sockets.socketsIpNameLookup.dropResolveAddressStream(stream);
        delete this._addrResolutions[stream];
    }

    async sockOpen(
        af: WasiExperimentalSocketsAddressFamily,
        _st: WasiExperimentalSocketsSocketType
    ): Promise<WasiExperimentalSocketsFd> {
        // TODO: socket type ignored
        return await this.sockets.socketsTcpCreateSocket.createTcpSocket(af as any);
    }

    async sockClose(fd: WasiExperimentalSocketsFd): Promise<void> {
        await this.sockets.socketsTcp.dropTcpSocket(fd);
    }

    async sockConnect(fd: WasiExperimentalSocketsFd, addr: WasiExperimentalSocketsAddress): Promise<void> {
        const ip = WasiExperimentalSocketsAddressToIpSocketAddress(addr);
        await this.sockets.socketsTcp.startConnect(fd, addr.tag === "ip6" ? 6 : 4, ip);
    }

    async sockAddrRemote(fd: WasiExperimentalSocketsFd): Promise<WasiExperimentalSocketsAddress> {
        const ip = await this.sockets.socketsTcp.remoteAddress(fd);
        return WasiExperimentalSocketsAddressFromIpSocketAddress(ip);
    }

    async sockAddrLocal(fd: WasiExperimentalSocketsFd): Promise<WasiExperimentalSocketsAddress> {
        const ip = await this.sockets.socketsTcp.localAddress(fd);
        return WasiExperimentalSocketsAddressFromIpSocketAddress(ip);
    }

    async sockSend(
        fd: WasiExperimentalSocketsFd,
        buf: Uint8Array,
        _len: WasiExperimentalSocketsSize,
        _flags: WasiExperimentalSocketsRiflags
    ): Promise<number> {
        // TODO: len and flags ignored
        const count = await this.filesystem.write(fd, buf, 0n);
        return Number(count);
    }

    async sockRecv(
        fd: WasiExperimentalSocketsFd,
        len: WasiExperimentalSocketsSize,
        _flags: WasiExperimentalSocketsRiflags
    ): Promise<Uint8Array | ArrayBuffer> {
        // TODO: flags ignored
        try {
            const [buf, _eof] = await this.filesystem.read(fd, BigInt(len), 0n);
            // TODO: eof ignored
            return buf;
        } catch (e: any) {
            if (e === "would-block") {
                throw ERRNO_AGAIN;
            }
            throw e;
        }
    }
}
*/
