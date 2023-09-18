import { SystemError } from "../errors.js";
import { Socket } from "../wasiFileSystem.js";
import { isNode, isNodeorBun } from "../wasiUtils.js";

import { ErrnoN, AddressFamily as AddressFamilyNo, AddressFamilyN } from "./bindings.js";
import {
    AddressInfo,
    appendToUint8Array,
    delay,
    NodeNetUdpSocket,
    RemoteChunk,
    RemoteInfo,
    SocketType,
    WasiSocket,
    wasiSocketsDebug,
} from "./common.js";
import { NodeNetTcpServer, NodeNetTcpSocket, AddressFamily } from "./common.js";

/*
import { default as net } from "node:net";
type NodeNetTcpSocket = net.Socket;
type NodeNetTcpServer = net.Server;
*/

export class NetTcpSocket extends Socket implements WasiSocket {
    type: SocketType;
    constructor(socketCreator: () => NodeNetTcpSocket, serverCreator?: () => NodeNetTcpServer) {
        super();
        this.type = "strm";
        this._socketCreator = socketCreator;
        this._serverCreator = serverCreator;
        let nodeSocket: NodeNetTcpSocket | undefined;
        wasiSocketsDebug("creating new NodeTcpSocket");
        try {
            nodeSocket = socketCreator();
        } catch (err: any) {
            wasiSocketsDebug("NodeTcpSocket: err ", err);
            throw err;
        }
        wasiSocketsDebug("NodeTcpSocket: created new net.Socket");
        this._nodeSocket = nodeSocket;
        this._connected = false;
        this._ready = false;
        this._closed = false;
        this._dataBuffer = new Uint8Array();
        this._error = 0;
        this._acceptedSockets = [];
        this._isServerConnection = false;
    }
    _socketCreator: () => NodeNetTcpSocket;
    _serverCreator?: () => NodeNetTcpServer;
    _dataBuffer: Uint8Array;
    _connected: boolean;
    _ready: boolean;
    _closed: boolean;
    _error: number;
    _acceptedSockets: Array<NetTcpSocket>;
    _isServerConnection: boolean;
    bindAddress?: AddressInfo;
    // @ts-ignore
    private _nodeSocket: NodeNetTcpSocket;
    private _nodeServer?: NodeNetTcpServer;
    async waitForConnect(): Promise<void> {
        while (!this._connected && !this._ready) {
            if (this._error != 0) {
                throw new SystemError(ErrnoN.CONNREFUSED, false);
            }
            wasiSocketsDebug("waiting for connect");
            await delay(1);
        }
    }

    async peek(): Promise<number> {
        let peekedSize = 0;
        wasiSocketsDebug("socket:peek ");
        if (this._closed) {
            wasiSocketsDebug("socket:peek returning 0 as closed");
            // assuming the sender closed
            return 0;
        } else {
            if (this._dataBuffer) {
                peekedSize = this._dataBuffer.length;
            }
        }
        await this.waitForConnect();
        return peekedSize;
    }

    async read(len: number): Promise<Uint8Array> {
        wasiSocketsDebug("socket:read len:", len);
        if (this._closed) {
            wasiSocketsDebug("socket:read returning 0 as closed");
            // assuming the sender closed
            return new Uint8Array(0);
        }
        await this.waitForConnect();

        if (this._dataBuffer.length == 0) {
            wasiSocketsDebug("socket:read throwing EAGAIN as no data");
            await delay(1);
            // assuming connected and empty buffer, no data available, telling client to try again
            throw new SystemError(ErrnoN.AGAIN, true);
        }

        let retChunks = this._dataBuffer;
        const databufferLen = this._dataBuffer.length;
        wasiSocketsDebug("socket:read databufferLen: ", databufferLen);
        if (databufferLen > len) {
            retChunks = this._dataBuffer.subarray(0, len);
            this._dataBuffer = this._dataBuffer.slice(len);
        } else {
            this._dataBuffer = new Uint8Array(0);
        }

        wasiSocketsDebug("socket:read returning retChunks.length: ", retChunks.length);
        return retChunks;
    }

    /*
    async readWithTimeout(len: number): Promise<Uint8Array> {
        return createPromiseWithTimeout(this.readPull2(len),1000, new SystemError(ErrnoN.AGAIN, true));
    }

    async readPull(len: number): Promise<Uint8Array> {
        wasiSocketsDebug("socket:read len:", len);
        if (this._closed) {
            wasiSocketsDebug("socket:read returning empty as closed");
            return new Uint8Array(0);
        }
        await this.waitForConnect();
        const socket = this._nodeSocket;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const superThis = this;

        return new Promise((resolve, reject) => {
            socket.on('readable', () => {
                let chunk;
                while (!superThis._closed && ((chunk = socket.read(len)) != null)) {
                    resolve(chunk);
                }
            });
            socket.on('close', () => {
                wasiSocketsDebug("socket:read rejected promise as closed");
                resolve(new Uint8Array(0));
            });
            socket.on('end', () => {
                wasiSocketsDebug("socket:read rejected promise as end");
                resolve(new Uint8Array(0));
            });
        });
    }

    async readPull2(len: number): Promise<Uint8Array> {
        wasiSocketsDebug("socket:read len:", len);
        if (this._closed) {
            return new Uint8Array(0);
        }
        await this.waitForConnect();
        const socket = this._nodeSocket;

        for await (const chunk of socket) {
            const newChunks = new Uint8Array(chunk);
            this._dataBuffer = appendToUint8Array(this._dataBuffer, newChunks);
        }


        let retChunks = this._dataBuffer;
        const databufferLen = this._dataBuffer.length;
        wasiSocketsDebug("socket:read databufferLen: ", databufferLen);
        if (databufferLen > len) {
            retChunks = this._dataBuffer.slice(0,len);
            this._dataBuffer = this._dataBuffer.slice(len);
        }

        wasiSocketsDebug("socket:read returning retChunks.length: ", retChunks.length);
        return retChunks;
    }*/

    async writeTo(data: Uint8Array, addr?: AddressInfo): Promise<void> {
        wasiSocketsDebug("socket:writeTo");
        await this.write(data);
    }

    async write(data: Uint8Array): Promise<void> {
        wasiSocketsDebug("socket:write");
        await this.waitForConnect();
        this._nodeSocket.write(data, "utf8");
    }

    async address(): Promise<AddressInfo> {
        wasiSocketsDebug("socket:address");
        await this.waitForConnect();
        let addr: AddressInfo;
        if (this._nodeServer) {
            addr = this._nodeServer.address() as AddressInfo;
        } else {
            addr = this._nodeSocket.address() as AddressInfo;
        }
        wasiSocketsDebug("address: returning addr:", addr);
        return addr;
    }
    async remoteAddress(): Promise<AddressInfo> {
        wasiSocketsDebug("socket:remoteAddress");
        await this.waitForConnect();
        const remoteAddr = this._nodeSocket.remoteAddress;
        wasiSocketsDebug("remoteAddress: ", remoteAddr);
        const remotePort = this._nodeSocket.remotePort;
        const remoteFamily = this._nodeSocket.remoteFamily;
        if (remoteAddr && remotePort && remoteFamily) {
            const aRemoteFamily = remoteFamily as AddressFamily;
            const addr: AddressInfo = {
                address: remoteAddr,
                port: remotePort,
                family: aRemoteFamily,
            };
            wasiSocketsDebug("remoteAddress: returning addr:", addr);
            return addr;
        }
        throw new Error("remoteAddress invalid address");
    }
    close(): void {
        wasiSocketsDebug("socket:close()");
        try {
            //console.log("close:, ", this._nodeSocket);
            if (!this._closed) {
                this._nodeSocket.end();
                this._closed = true;
            }
        } catch (err: any) {
            wasiSocketsDebug("socket:close() err: ", err);
        }
        //this._nodeSocket.destroy();
    }
    shutdown(): void {
        wasiSocketsDebug("socket:shutdown");
        this._nodeSocket.end();
    }
    async bind(addrInfo: AddressInfo) {
        wasiSocketsDebug("socket:bind");
        this.bindAddress = addrInfo;
    }
    async listen(backlog: number) {
        wasiSocketsDebug("socket:listen");
        const bindAddressInfo = this.bindAddress;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const superThis = this;
        if (bindAddressInfo) {
            if (this._serverCreator) {
                const server = this._serverCreator();
                superThis._nodeServer = server;
                const port = bindAddressInfo.port;
                const host = bindAddressInfo.address;
                server.listen(port, host);
                server.on("listening", () => {
                    wasiSocketsDebug("server:listening");
                    superThis._connected = true;
                    superThis._ready = true;
                });
                server.on("error", (err: any) => {
                    wasiSocketsDebug("server:error");
                    wasiSocketsDebug("connect: Client: error with peer: ", err);
                    if (err.code) {
                        if (err.code == "ECONNREFUSED") {
                            superThis._error = ErrnoN.CONNREFUSED;
                        } else if (err.code == "ECONNABORTED") {
                            superThis._error = ErrnoN.CONNABORTED;
                        } else if (err.code == "ECONNRESET") {
                            superThis._error = ErrnoN.CONNRESET;
                        } else if (err.code == "EADDRINUSE") {
                            superThis._error = ErrnoN.ADDRINUSE;
                        } else if (err.code == "EADDRNOTAVAIL") {
                            superThis._error = ErrnoN.ADDRNOTAVAIL;
                        } else {
                            superThis._error = ErrnoN.CONNABORTED;
                        }
                    } else {
                        superThis._error = ErrnoN.CONNABORTED;
                    }
                });
                server.on("close", () => {
                    wasiSocketsDebug("server:close");
                    superThis._closed = true;
                });
                server.on("drop", () => {
                    wasiSocketsDebug("server:drop");
                });
                server.on("connection", (netSocket: NodeNetTcpSocket) => {
                    const getClientSocket = () => netSocket;
                    const newSocket = new NetTcpSocket(getClientSocket, this._serverCreator);
                    newSocket._isServerConnection = true;
                    newSocket.setupListeners();

                    superThis._acceptedSockets.push(newSocket);
                    newSocket._connected = true;
                    newSocket._ready = true;
                });
            }
        }
    }
    async connect(host: string, port: number): Promise<void> {
        wasiSocketsDebug("connect: starting");
        const socket = this._nodeSocket;

        socket.connect(port, host);

        /*socket.connect(port, host, function() {
            wasiSocketsDebug("connect: connected on socket");
            socket.on('data', (buf) => {
                wasiSocketsDebug('connect: data: buf.length:', buf.length);
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, buf);
            });
        });*/

        //await socket.connect(port, host);
        wasiSocketsDebug("connect: connected");
        /*socket.on("data", data => {
            wasiSocketsDebug("connect: data");
            received += data
        })*/
        this.setupListeners();
    }

    setupListeners() {
        const socket = this._nodeSocket;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const superThis = this;
        //if (this._isServerConnection) {
        socket.on("data", (buf: Buffer) => {
            wasiSocketsDebug("connect: data");
            if (buf) {
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, buf);
            }
        });
        /*} else {
            socket.on('readable', () => {
                wasiSocketsDebug('connect: readable');
                const chunk = socket.read();
                if (chunk) {
                    superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, chunk);
                }
            });
        }*/
        socket.on("close", () => {
            superThis._closed = true;
            wasiSocketsDebug("connect: Client: closed");
        });
        socket.on("connect", async () => {
            wasiSocketsDebug("connect: Client: connection established with peer");
            superThis._connected = true;
            /*for await (const chunk of socket) {
                const newChunks = new Uint8Array(chunk);
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, newChunks);
            }*/
        });
        socket.on("ready", function (this: any) {
            wasiSocketsDebug("connect: Client: connection ready with peer");
            superThis._ready = true;
        });
        socket.on("error", function (err: any) {
            wasiSocketsDebug("connect: Client: error with peer: ", err);
            if (err.code) {
                if (err.code == "ECONNREFUSED") {
                    superThis._error = ErrnoN.CONNREFUSED;
                } else if (err.code == "ECONNABORTED") {
                    superThis._error = ErrnoN.CONNABORTED;
                } else if (err.code == "ECONNRESET") {
                    superThis._error = ErrnoN.CONNRESET;
                } else {
                    superThis._error = ErrnoN.CONNABORTED;
                }
            } else {
                superThis._error = ErrnoN.CONNABORTED;
            }
        });
        socket.on("timeout", function (this: any) {
            wasiSocketsDebug("connect: Client: timeout with peer");
        });
        socket.on("end", () => {
            wasiSocketsDebug("connect: disconnected from peer");
            superThis._connected = false;
            superThis._closed = true;
        });
    }

    async getAcceptedSocket(): Promise<NetTcpSocket> {
        let acceptedSocket = this._acceptedSockets.shift();
        let counter = 0;
        while (!acceptedSocket) {
            if (counter > 1000) {
                // Timing out tellling client to retry
                // to allow other operation to run rather to hang on accept
                throw new SystemError(ErrnoN.AGAIN, true);
            }
            await delay(1);
            acceptedSocket = this._acceptedSockets.shift();
            counter = counter + 1;
        }
        return acceptedSocket;
    }

    async readFrom(len: number): Promise<RemoteChunk> {
        const chunk = await this.read(len);
        const rinfoNull: RemoteInfo = {
            address: "0.0.0.0",
            port: 0,
            family: "IPv4",
            size: 0,
        };
        const ret = { buf: chunk, rinfo: rinfoNull };
        return ret;
    }
}

export class NetUdpSocket extends Socket implements WasiSocket {
    type: SocketType;
    constructor(family: AddressFamily, socketCreator: (fam: AddressFamily) => NodeNetUdpSocket) {
        super();
        this.type = "dgram";
        const nodeSocket = socketCreator(family);
        this._nodeSocket = nodeSocket;
        this.setupListeners();
    }
    private _nodeSocket: NodeNetUdpSocket;
    private _closed = false;
    private _listening = false;
    private _connected = false;
    private _error = 0;
    // _dataBuffer = new Uint8Array();
    _dataBuffer: Array<RemoteChunk> = [];

    private _remoteAddr: string = "";
    private _remotePort: number = 0;
    async waitForConnect(): Promise<void> {
        if (this._error) {
            wasiSocketsDebug("udp socket waitForConnect throwing err: ", this._error);
            throw new SystemError(this._error, true);
        }
        while (!(this._connected || this._listening)) {
            if (this._error != 0) {
                wasiSocketsDebug("udp socket waiting for connect err: ", this._error);
                throw new SystemError(ErrnoN.CONNREFUSED, false);
            }
            wasiSocketsDebug("udp socket waiting for connect");
            await delay(1);
        }
    }

    async read(len: number): Promise<Uint8Array> {
        const rfrom = await this.readFrom(len);
        const arr = rfrom.buf;
        return arr;
    }

    /*async readFrom(len: number): Promise<RemoteChunk> {
        let ret: RemoteChunk | undefined = undefined;
        while (ret==undefined) {
            try {
                ret = await this.readFromWithoutRetry(len);
                return ret;
            } catch( err: any) {
                delay(100);
                wasiSocketsDebug("udp socket:readFrom err:", err);
            }
        }
        throw new SystemError(ErrnoN.CONNABORTED, true);
    }*/
    async readFrom(len: number): Promise<RemoteChunk> {
        const ret = await this.readFromWithoutRetry(len);
        return ret;
    }
    async readFromWithoutRetry(len: number): Promise<RemoteChunk> {
        //console.trace();
        wasiSocketsDebug("udp socket:readFrom len:", len);
        if (this._closed) {
            wasiSocketsDebug("udp socket:readFrom ErrnoN.CONNABORTED as closed");
            // assuming the sender closed
            //return new Uint8Array(0);
            throw new SystemError(ErrnoN.CONNABORTED, true);
        }

        await this.waitForConnect();
        if (this._dataBuffer.length == 0) {
            wasiSocketsDebug("udp socket:readFrom throwing EAGAIN as no data");
            await delay(1);
            // assuming connected and empty buffer, no data available, telling client to try again
            throw new SystemError(ErrnoN.AGAIN, true);
        }

        let availableChunks = this._dataBuffer;
        const lastChunk = availableChunks.shift();
        if (lastChunk) {
            let returningBuf = lastChunk.buf;
            const returningRinfo = lastChunk.rinfo;
            const returningBufLen = returningBuf.length;
            wasiSocketsDebug("udp socket:readFrom returningBuf: ", returningBufLen);
            if (returningBufLen > len) {
                returningBuf = lastChunk.buf.subarray(0, len);
                this._dataBuffer = this._dataBuffer.slice(len);
                const remainingBuf = lastChunk.buf.subarray(len);
                const remainingBufLen = remainingBuf.length;
                // pushing back the remaining buf
                const remainingRinfo: RemoteInfo = {
                    address: returningRinfo.address,
                    port: returningRinfo.port,
                    size: remainingBufLen,
                    family: returningRinfo.family,
                };
                wasiSocketsDebug("udp socket:readFrom returning remainingRinfo: ", remainingRinfo);
                this._dataBuffer.push({ buf: remainingBuf, rinfo: remainingRinfo });
            }
            wasiSocketsDebug("udp socket:readFrom returning returningBuf.length: ", returningBuf.length);
            wasiSocketsDebug("udp socket:readFrom returning returningRinfo: ", returningRinfo);
            return { buf: returningBuf, rinfo: returningRinfo };
        } else {
            throw new SystemError(ErrnoN.AGAIN, true);
        }
    }

    async write(data: Uint8Array): Promise<void> {
        await this.writeTo(data, undefined);
    }

    async writeTo(data: Uint8Array, addr?: AddressInfo): Promise<void> {
        wasiSocketsDebug("udp socket:write");
        wasiSocketsDebug("udp socket:write data:", data);
        await this.waitForConnect();
        const cb = (error: Error | null, bytes: number) => {
            wasiSocketsDebug("udp write callback:");
            wasiSocketsDebug("udp write callback: error:"), error;
            wasiSocketsDebug("udp write callback: bytes:"), bytes;
        };
        if (addr) {
            wasiSocketsDebug("udp socket:write addr:", addr);
            const remotePort = addr.port;
            const remoteAddr = addr.address;
            this._nodeSocket.send(data, remotePort, remoteAddr, cb);
        } else {
            wasiSocketsDebug("udp socket:write noaddr");
            this._nodeSocket.send(data);
        }
    }
    async address(): Promise<AddressInfo> {
        await this.waitForConnect();
        const addr = this._nodeSocket.address();
        return addr;
    }
    async remoteAddress(): Promise<AddressInfo> {
        await this.waitForConnect();
        const addr = this._nodeSocket.remoteAddress();
        return addr;
    }
    async bind(addr: AddressInfo): Promise<void> {
        wasiSocketsDebug("udp socket bind");
        const address = addr.address;
        const port = addr.port;
        this._nodeSocket.bind(port, address);
    }
    async listen(backlog: number): Promise<void> {
        wasiSocketsDebug("udp socket listen");
    }
    getAcceptedSocket(): Promise<WasiSocket> {
        throw new Error("UDP not implemented.");
    }
    async connect(addr: string, port: number): Promise<void> {
        wasiSocketsDebug("udp connect: starting");
        const host = addr;
        const socket = this._nodeSocket;
        socket.connect(port, host);
        wasiSocketsDebug("udp connect: setting _remoteAddr: ", addr);
        this._remoteAddr = addr;
        wasiSocketsDebug("udp connect: setting _remotePort: ", port);
        this._remotePort = port;
        wasiSocketsDebug("udp connect: connected");
    }
    shutdown(): void {
        throw new Error("UDP not implemented.");
    }
    setupListeners() {
        const socket = this._nodeSocket;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const superThis = this;

        //socket.on(event: string, listener: (...args: any[]) => void)

        //if (this._isServerConnection) {
        socket.on("message", (buf: Buffer, rinfo: RemoteInfo) => {
            wasiSocketsDebug("udp socket on message:");
            wasiSocketsDebug("udp socket on message from rinfo:", rinfo);

            if (buf) {
                const gotMsg: RemoteChunk = { buf: buf, rinfo: rinfo };
                superThis._dataBuffer.push(gotMsg);
            }
        });
        socket.on("listening", () => {
            wasiSocketsDebug("udp socket on listening:");
            superThis._listening = true;
        });
        socket.on("close", () => {
            wasiSocketsDebug("udp socket on close:");
            superThis._closed = true;
            wasiSocketsDebug("connect: Client: closed");
        });
        socket.on("connect", async () => {
            wasiSocketsDebug("udp socket on connect: Client: connection established with peer");
            superThis._connected = true;
        });
        socket.on("error", function (err: any) {
            wasiSocketsDebug("udp socket on error: ", err);
            wasiSocketsDebug("udp socket on error err.code: ", err.code);
            if (err.code) {
                if (err.code == "ECONNREFUSED") {
                    superThis._error = ErrnoN.CONNREFUSED;
                } else if (err.code == "ECONNABORTED") {
                    superThis._error = ErrnoN.CONNABORTED;
                } else if (err.code == "ECONNRESET") {
                    superThis._error = ErrnoN.CONNRESET;
                } else {
                    superThis._error = ErrnoN.CONNABORTED;
                }
            } else {
                superThis._error = ErrnoN.CONNABORTED;
            }
        });
    }

    async peek(): Promise<number> {
        let peekedSize = 0;
        wasiSocketsDebug("udp socket:peek ");
        if (this._closed) {
            wasiSocketsDebug("udp socket:peek returning 0 as closed");
            // assuming the sender closed
            return 0;
        } else {
            if (this._dataBuffer) {
                if (this._dataBuffer.length > 0) {
                    const buf = this._dataBuffer[0].buf;
                    peekedSize = buf.length;
                }
            }
        }
        return peekedSize;
    }
}

export async function createTcpSocket(af?: AddressFamily): Promise<NetTcpSocket> {
    if (isNodeorBun()) {
        const nodeImpl = await import("./net_node.js");
        const createSocket = nodeImpl.createNodeTcpSocket;
        const createServer = nodeImpl.createNodeTcpServer;
        wasiSocketsDebug("net createTcpSocket node 1 :");
        const sock = new NetTcpSocket(createSocket, createServer);
        wasiSocketsDebug("net createTcpSocket node 2 :");
        return sock;
    } else {
        const wsImpl = await import("./net_wsproxy.js");
        const createSocket = wsImpl.createNodeTcpSocket;
        const createServer = wsImpl.createNodeTcpServer;
        wasiSocketsDebug("net createTcpSocket ws 1 :");
        const sock = new NetTcpSocket(createSocket, createServer);
        wasiSocketsDebug("net createTcpSocket ws 2 :");
        return sock;
    }
}

export async function createUdpSocket(af?: AddressFamily): Promise<NetUdpSocket> {
    if (isNodeorBun()) {
        const nodeImpl = await import("./net_node.js");
        const createSocket = nodeImpl.createNodeUdpSocket;
        wasiSocketsDebug("net createUdpSocket node 1 :");
        if (!af) {
            af = "IPv4";
        }
        const sock = new NetUdpSocket(af, createSocket);
        wasiSocketsDebug("net createUdpSocket node 2 :");
        return sock;
    } else {
        throw new Error("UDP not supported");
    }
}

export function addrFamilyNoToAddrFamily(afno: AddressFamilyNo): AddressFamily {
    switch (afno) {
        case AddressFamilyN.INET_4:
            return "IPv4";
        case AddressFamilyN.INET_6:
            return "IPv6";
    }
}

export type AddressResolve = (host: string, port: number) => Promise<AddressInfo[]>;

export async function getAddressResolver(): Promise<AddressResolve> {
    if (isNodeorBun()) {
        const nodeImpl = await import("./net_node.js");
        const addrResolve = nodeImpl.addrResolve;
        return addrResolve;
    } else {
        const wsImpl = await import("./net_wsproxy.js");
        const addrResolve = wsImpl.addrResolve;
        return addrResolve;
    }
}
