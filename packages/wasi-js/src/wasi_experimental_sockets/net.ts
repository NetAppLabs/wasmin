
import { SystemError } from "../errors";
import { Socket } from "../wasiFileSystem";

import { ErrnoN } from "./bindings";
import { AddressInfo, appendToUint8Array, delay, WasiSocket, wasiSocketsDebug } from "./common";
import { NodeNetTcpServer, NodeNetTcpSocket } from './common';

/*
import { default as net } from "node:net";
type NodeNetTcpSocket = net.Socket;
type NodeNetTcpServer = net.Server;
*/

export class NetTcpSocket extends Socket implements WasiSocket {
    constructor(socketCreator: () => NodeNetTcpSocket, serverCreator?: () => NodeNetTcpServer) {
        super();
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
    private _nodeSocket: NodeNetTcpSocket
    private _nodeServer?: NodeNetTcpServer
    async waitForConnect(): Promise<void> {

        while (!this._connected && !this._ready) {
            if (this._error != 0) {
                throw new SystemError(ErrnoN.CONNREFUSED, false);
            }
            wasiSocketsDebug("waiting for connect");
            await delay(1);
        }
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
            throw new SystemError(ErrnoN.AGAIN, true)
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

    async write(data: Uint8Array): Promise<void> {
        wasiSocketsDebug("socket:write");
        await this.waitForConnect();
        this._nodeSocket.write(data, 'utf8');
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
            const addr: AddressInfo = {
                address: remoteAddr,
                port: remotePort,
                family: remoteFamily,
            }
            wasiSocketsDebug("remoteAddress: returning addr:", addr);
            return addr;
        }
        throw new Error("remoteAddress invalid address");
    }
    close(): void {
        wasiSocketsDebug("socket:close");
        this._nodeSocket.end('');
        //this._nodeSocket.destroy();
    }
    shutdown(): void {
        wasiSocketsDebug("socket:shutdown");
        this._nodeSocket.end('');
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
                server.on('listening', () => {
                    wasiSocketsDebug("server:listening");
                    superThis._connected = true;
                    superThis._ready = true;

                });
                server.on('error', (err: any) => {
                    wasiSocketsDebug("server:error");
                    wasiSocketsDebug('connect: Client: error with peer: ', err);
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
                server.on('close', () => {
                    wasiSocketsDebug("server:close");
                });

                server.on('connection', (netSocket: NodeNetTcpSocket) => {
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
        socket.on('data', (buf: Buffer) => {
            wasiSocketsDebug('connect: data');
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
        socket.on('close', () => {
            superThis._closed = true;
            wasiSocketsDebug('connect: Client: closed');
        });
        socket.on('connect', async () => {
            wasiSocketsDebug('connect: Client: connection established with peer');
            superThis._connected = true;
            /*for await (const chunk of socket) {
                const newChunks = new Uint8Array(chunk);
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, newChunks);
            }*/
        });
        socket.on('ready', function (this: any) {
            wasiSocketsDebug('connect: Client: connection ready with peer');
            superThis._ready = true;
        });
        socket.on('error', function (err: any) {
            wasiSocketsDebug('connect: Client: error with peer: ', err);
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
        socket.on('timeout', function (this: any) {
            wasiSocketsDebug('connect: Client: timeout with peer');
        });
        socket.on('end', () => {
            wasiSocketsDebug('connect: disconnected from peer');
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
}

export class NetUdpSocket extends Socket implements WasiSocket {
    constructor(family: string) {
        super();
        //const nodeSocket = dgram.createSocket(family);
        //this.nodeSocket = nodeSocket;
    }
    // TODO UDP
    /*
    nodeSocket: dgram.Socket
    async read(len: number): Promise<Uint8Array> {
        const res = this.nodeSocket.read(len);
        return res;
    }

    async write(data: Uint8Array): Promise<void>{
        this.nodeSocket.write(data);
    }
    */
    address(): Promise<AddressInfo> {
        throw new Error("UDP not implemented.");
    }
    remoteAddress(): Promise<AddressInfo> {
        throw new Error("UDP not implemented.");
    }
    bind(addr: AddressInfo): Promise<void> {
        throw new Error("UDP not implemented.");
    }
    listen(backlog: number): Promise<void> {
        throw new Error("UDP not implemented.");
    }
    getAcceptedSocket(): Promise<WasiSocket> {
        throw new Error("UDP not implemented.");
    }
    connect(addr: string, port: number): Promise<void> {
        throw new Error("UDP not implemented.");
    }
    shutdown(): void {
        throw new Error("UDP not implemented.");
    }

}