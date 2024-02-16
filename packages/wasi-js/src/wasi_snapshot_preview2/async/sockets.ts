import { SocketsInstanceNetworkNamespace as socki } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsInstanceNetworkAsync = socki.WasiSocketsInstanceNetwork;
type Network = socki.Network;
import { SocketsNetworkNamespace as sockn } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsNetworkAsync = sockn.WasiSocketsNetwork;
import { SocketsTcpCreateSocketNamespace as socktc } from "@wasmin/wasi-snapshot-preview2/async";
import { SocketsUdpCreateSocketNamespace as sockuc } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsTcpCreateSocketAsync = socktc.WasiSocketsTcpCreateSocket;
import { SocketsIpNameLookupNamespace as socklookup } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsIpNameLookupAsync = socklookup.WasiSocketsIpNameLookup;
import { IoStreamsNamespace as io } from "@wasmin/wasi-snapshot-preview2/async";
type InputStream = io.InputStream;
type OutputStream = io.OutputStream;
import { SocketsTcpNamespace as sockt } from "@wasmin/wasi-snapshot-preview2/async";
import { SocketsUdpNamespace as socku } from "@wasmin/wasi-snapshot-preview2/async";

import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { createTcpSocket, createUdpSocket, getAddressResolver } from "../../wasi_experimental_sockets/net.js";
import {
    AddressFamily as AddressFamilyCommon,
    AddressInfo,
    IPv4AddressToArray,
    IPv6AddressToArray,
    WasiSocket,
} from "../../wasi_experimental_sockets/common.js";
import { isBadFileDescriptor, isErrorAgain, translateToSocketsError, wasiPreview2Debug } from "./preview2Utils.js";
import { DummyPollable, InStream, OutStream } from "./io.js";
import { Resource } from "../../wasiResources.js";
import { OpenFiles } from "../../wasiFileSystem.js";
import { sleep } from "../../wasiUtils.js";
type UdpSocket = socku.UdpSocket;
type OutgoingDatagram = socku.OutgoingDatagram;
type OutgoingDatagramStream = socku.OutgoingDatagramStream
type IncomingDatagram = socku.IncomingDatagram;
type IncomingDatagramStream = socku.IncomingDatagramStream;
type SocketsTcpAsync = sockt.WasiSocketsTcp;
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
type WasiSocketsUdpAsync = socku.WasiSocketsUdp;
type WasiSocketsUdpCreateSocketAsync = sockuc.WasiSocketsUdpCreateSocket;


export class SocketsNetworkAsyncHost implements SocketsInstanceNetworkAsync, SocketsNetworkAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._instanceNetworkId = -1;
        this.Network = NetworkInstance;
    }
    public Network: typeof NetworkInstance;
    private _wasiEnv: WasiEnv;
    private _instanceNetworkId: number;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    async instanceNetwork(): Promise<Network> {
        if (this._instanceNetworkId == -1) {
            const netInstance = new NetworkInstance(this._wasiEnv);
            this._instanceNetworkId = netInstance.resource;
        }
        const netInstance = this.openFiles.get(this._instanceNetworkId);
        return netInstance as Network;
    }
    async dropNetwork(netw: Network): Promise<void> {
        // no-op for now
        return;
    }
}

export class NetworkInstance implements Resource {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
    }
    private _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    resource: number;
}

export class SocketsTcpAsyncHost implements SocketsTcpCreateSocketAsync, SocketsTcpAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.TcpSocket = TcpSocketInstance;
    }
    public TcpSocket: typeof TcpSocketInstance;
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
            const af = IPAddressFamilyToAddressFamily(addressFamily);
            const sock = await createTcpSocket(af);
            const sockFd = this.openFiles.add(sock);
            const sockInstance = new TcpSocketInstance(this._wasiEnv, sockFd);
            return sockInstance;
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("createTcpSocket: err:", err);
            throw 'not-supported';
        }
    }

}

export class TcpSocketInstance implements TcpSocket, Resource {
    constructor(wasiOptions: WasiOptions, sockFd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._sockFd = sockFd
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
    }
    private _wasiEnv: WasiEnv;
    private _sockFd: number;
    public resource: number;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    get sockFd() {
        return this._sockFd;
    }
    get inputstream() {
        const closeFdOnStreamClose = false;
        const instream = new InStream(this._wasiEnv,this.sockFd, closeFdOnStreamClose);
        return instream;
    }
    get outputstream() {
        let closeFdOnStreamClose = false;
        const outstream = new OutStream(this._wasiEnv,this.sockFd, closeFdOnStreamClose);
        return outstream;
    }

    getSocket(fd: number): WasiSocket {
        const res = this.openFiles.get(fd);
        return res as WasiSocket;
    }
    async startBind(network: Network, localAddress: IpSocketAddress): Promise<void> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            const addrInfo = IpSocketAddressToAddrInfo(localAddress);
            await sock.bind(addrInfo);
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("TcpSocketInstance.startBind: err:", err);
            throw 'address-not-bindable'
        }
    }
    async finishBind(): Promise<void> {
        // no-op for now
    }
    async startConnect( network: Network, remoteAddress: sockn.IpSocketAddress): Promise<void> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            const remoteAddrInfo = IpSocketAddressToAddrInfo(remoteAddress);
            const remoteAddr = remoteAddrInfo.address;
            const remotePort = remoteAddrInfo.port;
            wasiPreview2Debug(`TcpSocketInstance.startConnect fd: ${sockFd} remoteAddr: ${remoteAddr} remotePort: ${remotePort}`);
            await sock.connect(remoteAddr, remotePort);
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("startConnect: err:", err);
            throw 'connection-refused'
        }
    }
    async finishConnect(): Promise<[InputStream, OutputStream]> {
        // returning as previously created in startConnect
        const sockFd = this.sockFd;
        const inStream = this.inputstream;
        const outStream = this.outputstream;
        return [inStream, outStream];
    }
    async startListen(): Promise<void> {
        try {
            const sockFd = this.sockFd;
            // Network ignored for now
            const sock = this.getSocket(sockFd);
            // TODO look into backlog
            const backlog = 0;
            await sock.listen(backlog);
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("TcpSocketInstance.startListen: err:", err);
            throw 'already-listening';
        }
    }
    async finishListen(): Promise<void> {
        // no-op for now
    }
    async accept(): Promise<[TcpSocket, InputStream, OutputStream]> {
        try {
            wasiPreview2Debug(`TcpSocketInstance.accept: starting on fd: ${this.sockFd}`);
            const sockFd = this.sockFd;
            const connectionCloser = async () => {
                if (clientSock) {
                    wasiPreview2Debug(`accept connectionCloser clientSockFd: is ${clientSockFd}`);
                    if (this.openFiles) {
                        wasiPreview2Debug("accept connectionCloser this.openFiles is set");
                        try {
                            if (this.openFiles.exists(clientSockFd)) {
                                this.openFiles.close(clientSockFd);
                            }
                        } catch (err: any) {
                            wasiPreview2Debug("accept connectionCloser close error:", err);
                        }
                    } else {
                        wasiPreview2Debug("accept connectionCloser this.openFiles null");
                    }
                } else {
                    wasiPreview2Debug("accept connectionCloser clientSockFd: is null");
                }
            }
            const sock = this.getSocket(sockFd);
            const clientSock = await sock.getAcceptedSocket();
            clientSock.connectionCloser = connectionCloser;
            const clientSockFd = this.openFiles.add(clientSock);
            wasiPreview2Debug(`TcpSocketInstance.accept: returning clientSockFd: ${clientSockFd}`);
            const clientSockInstance = new TcpSocketInstance(this._wasiEnv,clientSockFd);
            const inStream = clientSockInstance.inputstream;
            const outStream = clientSockInstance.outputstream;
            return [clientSockInstance, inStream, outStream];
        } catch (err: any) {
            wasiPreview2Debug("TcpSocketInstance.accept: err:", err);
            if (isErrorAgain(err)) {
                throw 'would-block';
            } else {
                throw translateToSocketsError(err);
            }
        }
    }
    async localAddress(): Promise<sockn.IpSocketAddress> {
        let localAddrInfo: AddressInfo|undefined = undefined;
        try {
            const sockFd = this.sockFd;
            wasiPreview2Debug(`TcpSocketInstance.localAddress: calling this.getSocket: sockfd: ${sockFd}`);
            const sock = this.getSocket(sockFd);
            //wasiPreview2Debug("localAddress: sock: ", sock);
            localAddrInfo = await sock.address();
            wasiPreview2Debug("TcpSocketInstance.localAddress: localAddrInfo: ", localAddrInfo);
            const localAddr = AddressInfoToIpSocketAddress(localAddrInfo);
            wasiPreview2Debug("TcpSocketInstance.localAddr: localAddr: ", localAddr);
            return localAddr;
        } catch (err: any) {
            wasiPreview2Debug ("TcpSocketInstance.localAddress: localAddrInfo:", localAddrInfo);
            wasiPreview2Debug("TcpSocketInstance.localAddress err:", err);
            //throw translateError(err);
            throw 'invalid-state';
        }
    }
    async remoteAddress(): Promise<sockn.IpSocketAddress> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            const remoteAddrInfo = await sock.remoteAddress();
            const remoteAddr = AddressInfoToIpSocketAddress(remoteAddrInfo);
            return remoteAddr;
        } catch (err: any) {
            wasiPreview2Debug("TcpSocketInstance.remoteAddress err: ", err);
            // TODO: look into error handling here
            //throw translateError(err);
            //throw 'connection-aborted';
            let dummyAddr: IpSocketAddressIpv4 = {
                tag: "ipv4",
                val: {
                    port: 0,
                    address: [0,0,0,0]
                }
            }
            return dummyAddr;
        }
    }
    async addressFamily(): Promise<sockn.IpAddressFamily> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            const localAddrInfo = await sock.address();
            const aFamily = localAddrInfo.family;
            const family = AddressFamilyToIpAddressFamily(aFamily);
            return family;
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("TcpSocketInstance.addressFamily err: ", err);
            throw 'invalid-state';
        }
    }
    async setListenBacklogSize(value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async receiveBufferSize(): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    async setReceiveBufferSize( value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async sendBufferSize(): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    async setSendBufferSize(value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async subscribe(): Promise<Pollable> {
        const pollable = new TcpSocketPollable(this.openFiles, this.sockFd);
        return pollable;
    }
    async shutdown(shutdownType: sockt.ShutdownType): Promise<void> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            sock.shutdown();
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("TcpSocketInstance.shutdown err: ", err);
            throw 'not-connected';
        }
    }
    isListening(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    keepAliveEnabled(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    setKeepAliveEnabled(value: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    keepAliveIdleTime(): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    setKeepAliveIdleTime(value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    keepAliveInterval(): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    setKeepAliveInterval(value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    keepAliveCount(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    setKeepAliveCount(value: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    hopLimit(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    setHopLimit(value: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async [Symbol.asyncDispose]() : Promise<void> {
        try {
            const sockFd = this.sockFd;
            if (this.openFiles.exists(sockFd)) {
                this.openFiles.close(sockFd);
            }
            this.openFiles.disposeResource(this);
        } catch (err: any) {
            // Swallow error:
            wasiPreview2Debug("TCPSocketInstance.dispose Symbol.asyncDispose err: ", err);
        }
    }
}

export class TcpSocketPollable implements Pollable {
    _fd: number;
    resource: number;
    openFiles: OpenFiles;
    constructor(openFiles: OpenFiles, fd: number) {
        this._fd = fd;
        this.openFiles = openFiles;
        this.resource = this.openFiles.addResource(this);
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    get fd() {
        return this._fd;
    }
    async readyWithError(): Promise<boolean> {
        const ofd = this.openFiles.get(this.fd);
        const ofda = ofd as any;
        if (ofda.peek) {
            let peekBytes = await ofda.peek();
            wasiPreview2Debug(`[io/streams] TcpSocketPollable peekBytes: ${peekBytes} for fd: ${this.fd}`);
            if (peekBytes > 0) {
                return true;
            }
        }
        if (ofda.hasConnectedClient) {
            const hasConnected = await ofda.hasConnectedClient();
            if (hasConnected) {
                return true;
            }
        }
        return false;
    }
    async ready(): Promise<boolean> {
        try {
            await this.readyWithError();
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] TcpSocketPollable.done fd: ${this.fd} err:`, err);
            if (isBadFileDescriptor(err)) {
                wasiPreview2Debug("badf for TcpSocketPollable")
                return false;
            }
        } 
        return false;
    }

    async block(): Promise<void> {
        //attemtlet isWaiting = true;
        let attempt = 0;
        let attempts = 1;
        while (attempt < attempts) {
            try {
                const isReady = await this.readyWithError();
                if (isReady) {
                    return;
                }
                await sleep(1);
            } catch (err: any) {
                wasiPreview2Debug("TcpSocketPollable.block err:", err);
                //isWaiting = false;
                attempt = attempts;
            }
            attempt++;
        }
    }
}

export class WasiSocketsUdpAsyncHost implements WasiSocketsUdpCreateSocketAsync,WasiSocketsUdpAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.UdpSocket = UdpSocketInstance;
        this.IncomingDatagramStream = UdpIncomingDatagramStreamInstance
        this.OutgoingDatagramStream = UdpOutgoingDatagramStreamInstance

    }
    public UdpSocket: typeof UdpSocketInstance;
    public IncomingDatagramStream: typeof UdpIncomingDatagramStreamInstance;
    public OutgoingDatagramStream: typeof UdpOutgoingDatagramStreamInstance;

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
    async createUdpSocket(addressFamily: sockn.IpAddressFamily): Promise<UdpSocket> {
        try {
            const addrFamily = IPAddressFamilyToAddressFamily(addressFamily);
            const sock = await createUdpSocket(addrFamily);
            const sockFd = this.openFiles.add(sock);
            const sockInstance = new UdpSocketInstance(this._wasiEnv, sockFd);
            return sockInstance;
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("udp createUdpSocket err:", err);
            throw 'not-supported';
        }
    }


}

export class UdpIncomingDatagramStreamInstance implements IncomingDatagramStream, Resource {
    constructor(wasiOptions: WasiOptions, fd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._fd = fd;
        this.resource = this.openFiles.addResource(this);
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    private _wasiEnv: WasiEnv;
    private _fd: number;
    public resource: number;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get fd() {
        return this._fd;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    getSocket(fd: number): WasiSocket {
        const res = this.openFiles.get(fd);
        return res as WasiSocket;
    }
    async receive(maxResults: bigint): Promise<IncomingDatagram[]> {
        let raddr: sockn.IpSocketAddress | undefined = undefined;
        const sockFd = this.fd;
        try {
            wasiPreview2Debug(`UdpIncomingDatagramStreamInstance.receive: calling this.getSocket: sockfd: ${sockFd}`);
            const sock = this.getSocket(sockFd);
            //wasiPreview2Debug("receive: sock: ", sock);
            //let buf_size = this.receiveBufferSize(sockFd);
            let buf_size = 4096;
            let remoteChunk = await sock.readFrom(buf_size);
            let data = remoteChunk.buf; 
            let rinfo = remoteChunk.rinfo;
            wasiPreview2Debug(`UdpIncomingDatagramStreamInstance.receive sockfd: ${sockFd} rinfo.address: ${rinfo.address} rinfo.port: ${rinfo.port}`);
            wasiPreview2Debug(`UdpIncomingDatagramStreamInstance.receive sockfd: ${sockFd} data.length: ${data.length}`);

            raddr = AddressInfoToIpSocketAddress(rinfo);
            wasiPreview2Debug(`UdpIncomingDatagramStreamInstance.receive sockfd: ${sockFd} raddr: `, raddr);

            let datagram: IncomingDatagram = {
                data: data,
                remoteAddress: raddr,
            }

            let datagrams = [datagram];
            return datagrams;
        } catch (err: any) {
            wasiPreview2Debug("UdpIncomingDatagramStreamInstance.receive err:", err);
            if (isErrorAgain(err)) {
                wasiPreview2Debug("UdpIncomingDatagramStreamInstance.receive isErrorAgain:");
                // this should not throw 'would-block' rather return an empty array
                await sleep(1);
                let datagrams: IncomingDatagram[] = [];
                return datagrams;
            }
            //throw translateError(err);
            throw 'remote-unreachable';
        }
    }
    async subscribe(): Promise<socklookup.Pollable> {
        const pollable = new UdpSocketPollable(this.openFiles, this.fd);
        return pollable;
    }
}

export class UdpOutgoingDatagramStreamInstance implements OutgoingDatagramStream, Resource {
    constructor(wasiOptions: WasiOptions, fd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._fd = fd;
        this.resource = this.openFiles.addResource(this);
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }

    private _wasiEnv: WasiEnv;
    private _fd: number;
    public resource: number;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get fd() {
        return this._fd;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    getSocket(fd: number): WasiSocket {
        const res = this.openFiles.get(fd);
        return res as WasiSocket;
    }
    async checkSend(): Promise<bigint> {
        const allowedToSend = 1n;
        return allowedToSend;
    }
    async send(datagrams: OutgoingDatagram[]): Promise<bigint> {
        try {
            const sockFd = this.fd;
            wasiPreview2Debug(`UdpOutgoingDatagramStreamInstance.send: calling this.getSocket: sockfd: ${sockFd}`);
            const sock = this.getSocket(sockFd);
            wasiPreview2Debug("UdpOutgoingDatagramStreamInstance.send: sock: ", sock);
            let sent_count = 0n;
            for (let datagram of datagrams) {
                let buf = datagram.data;
                let raddr = datagram.remoteAddress;
                let raddrinfo: AddressInfo|undefined = undefined;
                if (raddr) {
                    raddrinfo = IpSocketAddressToAddrInfo(raddr);
                }
                let res = await sock.writeTo(buf, raddrinfo);
                sent_count += BigInt(buf.length);
            }
            return sent_count;
        } catch (err: any) {
            wasiPreview2Debug("UdpOutgoingDatagramStreamInstance.send err:", err);
            if (isErrorAgain(err)) {
                //this should not throw 'would-block' rather return 0
                return 0n;
            }
            //throw translateError(err);
            throw 'remote-unreachable';
        }
    }
    async subscribe(): Promise<socklookup.Pollable> {
        const pollable = new UdpSocketPollable(this.openFiles, this.fd);
        return pollable;
    }
}

export class UdpSocketInstance implements UdpSocket, Resource {
    constructor(wasiOptions: WasiOptions, sockFd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._sockFd = sockFd;
        this.resource = this.openFiles.addResource(this);
    }

    private _wasiEnv: WasiEnv;
    public _sockFd: number;
    public resource: number;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get sockFd() {
        return this._sockFd;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    getSocket(fd: number): WasiSocket {
        const res = this.openFiles.get(fd);
        return res as WasiSocket;
    }
    async startBind(network: Network, localAddress: sockn.IpSocketAddress): Promise<void> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            const addrInfo = IpSocketAddressToAddrInfo(localAddress);
            await sock.bind(addrInfo);
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("UDPSocketInstance.startBind err:", err);
            throw 'already-bound';
        }
    }
    async finishBind(): Promise<void> {
        // no-op for now
    }
    async startConnect(remoteAddress: sockn.IpSocketAddress): Promise<void> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            const remoteAddrInfo = IpSocketAddressToAddrInfo(remoteAddress);
            const remoteAddr = remoteAddrInfo.address;
            const remotePort = remoteAddrInfo.port;
            wasiPreview2Debug(`UDPSocketInstance.startConnect fd: ${sockFd} remoteAddr: ${remoteAddr} remotePort: ${remotePort}`);
            await sock.connect(remoteAddr, remotePort);
        } catch (err: any) {
            //throw translateError(err);
            wasiPreview2Debug("UDPSocketInstance.startConnect err:", err);
            throw 'remote-unreachable';
        }
    }
    async stream(remoteAddress: sockn.IpSocketAddress | undefined): Promise<[socku.IncomingDatagramStream, socku.OutgoingDatagramStream]> {
        if (remoteAddress !== undefined) {
            // in 'connect' mode where remoteAddress is set
            await this.startConnect(remoteAddress);
        }
        const incomingDataStream = new UdpIncomingDatagramStreamInstance(this.wasiEnv,this.sockFd);
        const outgoingDataStream = new UdpOutgoingDatagramStreamInstance(this.wasiEnv,this.sockFd);
        return [incomingDataStream, outgoingDataStream];
    }
    async localAddress(): Promise<sockn.IpSocketAddress> {
        try {
            const sockFd = this.sockFd;
            wasiPreview2Debug(`UDPSocketInstance.localAddress: calling this.getSocket: sockfd: ${sockFd}`);
            const sock = this.getSocket(sockFd);
            //wasiPreview2Debug("localAddress: sock: ", sock);
            const localAddrInfo = await sock.address();
            wasiPreview2Debug("UDPSocketInstance.localAddress: localAddrInfo: ", localAddrInfo);
            const localAddr = AddressInfoToIpSocketAddress(localAddrInfo);
            wasiPreview2Debug("UDPSocketInstance.localAddr: localAddr: ", localAddr);
            return localAddr;
        } catch (err: any) {
            wasiPreview2Debug("UDPSocketInstance.localAddress err:", err);
            //throw translateError(err);
            throw 'connection-aborted';
        }
    }
    async remoteAddress(): Promise<sockn.IpSocketAddress> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            const remoteAddrInfo = await sock.remoteAddress();
            const remoteAddr = AddressInfoToIpSocketAddress(remoteAddrInfo);
            return remoteAddr;
        } catch (err: any) {
            wasiPreview2Debug("UDPSocketInstance.remoteAddress err: ", err);
            // TODO: look into error handling here
            //throw translateError(err);
            //throw 'connection-aborted'
            let dummyAddr: IpSocketAddressIpv4 = {
                tag: "ipv4",
                val: {
                    port: 0,
                    address: [0,0,0,0]
                }
            }
            return dummyAddr;
        }
    }
    async addressFamily(): Promise<sockn.IpAddressFamily> {
        try {
            const sockFd = this.sockFd;
            const sock = this.getSocket(sockFd);
            const localAddrInfo = await sock.address();
            const aFamily = localAddrInfo.family;
            const family = AddressFamilyToIpAddressFamily(aFamily);
            return family;
        } catch (err: any) {
            wasiPreview2Debug("UDPSocketInstance.addressFamily err: ", err);
            throw 'invalid-state';
        }
    }
    async unicastHopLimit(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async setUnicastHopLimit(value: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async receiveBufferSize(): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    async setReceiveBufferSize(value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async sendBufferSize(): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    async setSendBufferSize(value: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async subscribe(): Promise<Pollable> {
        const pollable = new UdpSocketPollable(this.openFiles, this.sockFd);
        return pollable;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        try {
            const sockFd = this.sockFd;
            if (this.openFiles.exists(sockFd)) {
                this.openFiles.close(sockFd);
            }
            this.openFiles.disposeResource(this);
        } catch (err: any) {
            // swallow error
            wasiPreview2Debug("UDPSocketInstance Symbol.asyncDispose err: ", err);
        }
    }
}

export class UdpSocketPollable implements Pollable {
    _fd: number;
    resource: number;
    openFiles: OpenFiles;
    constructor(openFiles: OpenFiles, fd: number) {
        this._fd = fd;
        this.openFiles = openFiles;
        this.resource = this.openFiles.addResource(this);
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    get fd() {
        return this._fd;
    }
    async readyWithError(): Promise<boolean> {
        const ofd = this.openFiles.get(this.fd);
        const ofda = ofd as any;
        if (ofda.peek) {
            let peekBytes = await ofda.peek();
            wasiPreview2Debug(`[io/streams] UdpSocketPollable peekBytes: ${peekBytes} for fd: ${this.fd}`);
            if (peekBytes > 0) {
                return true;
            }
        }
        /*if (ofda.hasConnectedClient) {
            const hasConnected = await ofda.hasConnectedClient();
            if (hasConnected) {
                return true;
            }
        }
        */
        return false;
    }
    async ready(): Promise<boolean> {
        try {
            await this.readyWithError();
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] TcpSocketPollable.done fd: ${this.fd} err:`, err);
            if (isBadFileDescriptor(err)) {
                wasiPreview2Debug("badf for TcpSocketPollable")
                return false;
            }
        } 
        return false;
    }

    async block(): Promise<void> {
        //attemtlet isWaiting = true;
        let attempt = 0;
        let attempts = 1;
        while (attempt < attempts) {
            try {
                const isReady = await this.readyWithError();
                if (isReady) {
                    return;
                }
                await sleep(1);
            } catch (err: any) {
                wasiPreview2Debug("TcpSocketPollable.block err:", err);
                //isWaiting = false;
                attempt = attempts;
            }
            attempt++;
        }
    }
}


export class ResolveAddressIterator implements ResolveAddressStream, Resource {
    public resource: number;
    public openFiles: OpenFiles;
    constructor(openFiles: OpenFiles, public addresses: AddressInfo[], public addressFamily?: IpAddressFamily | undefined, public position: number = 0) {
        this.openFiles = openFiles,
        this.resource = openFiles.addResource(this);
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    nextAddress(): AddressInfo | null {
        while (this.addresses.length > this.position) {
            const nextAddr = this.addresses[this.position];
            if (this.addressFamily) {
                const ipAddrFamily = IPAddressFamilyToAddressFamily(this.addressFamily);
                if (nextAddr.family == ipAddrFamily) {
                    this.position++;
                    return nextAddr;    
                } else {
                    this.position++;
                }
            } else {
                this.position++;
                return nextAddr;
            }
        }
        return null;
    }
    async resolveNextAddress(): Promise<IpAddress | undefined> {
        try {
            const iter = this;
            const addrInfo = iter.nextAddress();
            if (addrInfo) {
                const ipAddr = AddressInfoToIpAddress(addrInfo);
                return ipAddr;
            }
        } catch (err: any) {
            // swallow error
            //throw translateError(err);
            wasiPreview2Debug("resolveNextAddress err: ", err);
            throw 'name-unresolvable';
        }
        return undefined;
    }
    async subscribe(): Promise<Pollable> {
        const pollable = new DummyPollable(this.openFiles, this.resource);
        return pollable;
    }
}

export class SocketsIpNameLookupAsyncHost implements SocketsIpNameLookupAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.ResolveAddressStream = ResolveAddressIterator;
    }
    public ResolveAddressStream: typeof ResolveAddressIterator;

    private _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

    async resolveAddresses(
        network: Network,
        name: string,
    ): Promise<ResolveAddressStream> {
        try {
            const host = name;
            const port = 0;
            const resolve = await getAddressResolver();
            const addresses = await resolve(host, port);
            const iter = new ResolveAddressIterator(this.openFiles, addresses);
            return iter;
        } catch (err: any) {
            // swallow error
            //throw translateError(err);
            wasiPreview2Debug("resolveAddresses err: ", err);
            throw 'invalid-name';
        }
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
            break;
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
            hostAddr = `${n0s}:${n1s}:${n2s}:${n3s}:${h0s}:${h1s}:${h2s}:${h3s}`;
            break;
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

export function IPAddressFamilyToAddressFamily(addrFamily: IpAddressFamily): AddressFamilyCommon {
    switch (addrFamily) {
        case "ipv4":
            return "IPv4";
        case "ipv6":
            return "IPv6";
    }
}