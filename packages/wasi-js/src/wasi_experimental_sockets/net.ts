/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemError } from "../errors.js";
import { appendToUint8Array } from "../utils.js";
import { Peekable, Socket } from "../wasiFileSystem.js";
import { isNodeorBunorDeno } from "../utils.js";

import { ErrnoN, AddressFamily as AddressFamilyNo, AddressFamilyN } from "./bindings.js";
import {
    AddressInfo,
    delay,
    NodeNetUdpSocket,
    RemoteChunk,
    RemoteInfo,
    SocketType,
    WasiSocket,
} from "./common.js";
import { NodeNetTcpServer, NodeNetTcpSocket, AddressFamily } from "./common.js";
import { wasiSocketsDebug } from "../wasiDebug.js";

declare global {
    var USE_ACCEPTED_SOCKET_PROMISE: boolean;
    var USE_ACCEPTED_SOCKET_PROMISE_TIMEOUT: number;
}
globalThis.USE_ACCEPTED_SOCKET_PROMISE = true;
globalThis.USE_ACCEPTED_SOCKET_PROMISE_TIMEOUT = 1;

export type AcceptedSocketPromiseType = ReturnType<typeof deferredPromise<NetTcpSocket|undefined>>;

function deferredPromise<T>() {
    let resolve: (value: T) => void = () => {};
    let reject: (error?: string) => void = () => {};
    const promise = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    });
    return {promise, resolve, reject};
}

export class NetTcpSocket extends Socket implements WasiSocket, Peekable {
    type: SocketType;
    constructor(family: AddressFamily, socketCreator: () => NodeNetTcpSocket, serverCreator?: () => NodeNetTcpServer, parentSocket?: NetTcpSocket) {
        super();
        this._family = family;
        this.type = "strm";
        this._socketCreator = socketCreator;
        this._serverCreator = serverCreator;
        this._parentSocket = parentSocket;
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
    _family: AddressFamily;
    _socketCreator: () => NodeNetTcpSocket;
    _serverCreator?: () => NodeNetTcpServer;
    _parentSocket?: NetTcpSocket;
    connectionCloser?: () => Promise<void>;
    _dataBuffer: Uint8Array;
    _connected: boolean;
    _ready: boolean;
    _closed: boolean;
    _error: number;
    _acceptedSockets: Array<NetTcpSocket>;
    _acceptedSocketPromises: Array<AcceptedSocketPromiseType> = [];
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
            wasiSocketsDebug("tcp socket waiting for connect");
            await delay(1);
        }
    }

    async peek(): Promise<number> {
        let peekedSize = 0;
        if (this._dataBuffer) {
            peekedSize = this._dataBuffer.length;
        }
        return peekedSize;
    }

    addAcceptedPromise(acceptedPromise: AcceptedSocketPromiseType){
        this._acceptedSocketPromises.push(acceptedPromise);
    }

    getAcceptedPromise(): AcceptedSocketPromiseType|undefined {
        const ret = this._acceptedSocketPromises.shift();
        return ret;
    }

    removeAcceptedPromise(acceptedPromise: AcceptedSocketPromiseType){
        function removeValueFromAcceptList(value: AcceptedSocketPromiseType, index:number , arr: Array<AcceptedSocketPromiseType>) {
            if (value === acceptedPromise) {
                arr.splice(index, 1);
                return true;
            }
            return false;
        }
        this._acceptedSocketPromises.filter(removeValueFromAcceptList);
    }

    rejectAllAcceptPromises(): void {
        if (globalThis.USE_ACCEPTED_SOCKET_PROMISE) {
            let acceptPromise = this._acceptedSocketPromises.shift();
            while (acceptPromise !== undefined) {
                try {
                    wasiSocketsDebug("close acceptPromise rejecting");
                    acceptPromise.reject("rejectAllAcceptPromises");
                    wasiSocketsDebug("close acceptPromise rejected");
                } catch(err: any) {
                    wasiSocketsDebug("close acceptPromise err:", err);
                }
                acceptPromise = this._acceptedSocketPromises.shift();
            }
        }
    }

    async getAcceptedSocketByPromise(): Promise<NetTcpSocket> {
        let acceptedSocket = this._acceptedSockets.shift();
        if (acceptedSocket !== undefined) {
            return acceptedSocket;
        }
        const acceptedPromise = deferredPromise<NetTcpSocket|undefined>();
        this.addAcceptedPromise(acceptedPromise);
        const { promise } = acceptedPromise;
        wasiSocketsDebug("tcp server timeoutPromise starting: ");
        wasiSocketsDebug(`tcp server timeoutPromises.length: ${this._acceptedSocketPromises.length}`);
        let timeoutPromise = new Promise(function(resolve, reject) {
            let rejWithReason = () => {
                reject("fromTimeout");
            }
            setTimeout(rejWithReason, globalThis.USE_ACCEPTED_SOCKET_PROMISE_TIMEOUT);
        });
        const timeoutPromiseRace = Promise.race([promise, timeoutPromise]);
        try {
            const gotAcceptedSocket = await timeoutPromiseRace.catch(
                (reason: any) => {
                    wasiSocketsDebug("promise rejected because", reason);
                }
            );
            if (gotAcceptedSocket !== undefined) {
                wasiSocketsDebug("getAccptedSocketByPromise got acceptedPromise");
                acceptedSocket = gotAcceptedSocket as NetTcpSocket;
                wasiSocketsDebug("tcp server timeoutPromise returning acceptedSocket");
                return acceptedSocket;
            }
        } catch(err :any) {
            throw err;
        } finally {
            wasiSocketsDebug("getAccptedSocketByPromise finally removeAcceptedPromise");
            this.removeAcceptedPromise(acceptedPromise);
        }
        throw new Error("getAccptedSocketByPromise time out");
    }

    notifyAcceptedSocket(acceptedSock: NetTcpSocket) {
        if (globalThis.USE_ACCEPTED_SOCKET_PROMISE) {
            const acceptPromise = this.getAcceptedPromise();
            if (acceptPromise !== undefined) {
                wasiSocketsDebug("notifyAcceptedSocket() acceptPromise.resolve");
                acceptPromise.resolve(acceptedSock);
            } else {
                wasiSocketsDebug("notifyAcceptedSocket() this._acceptedSockets.push");
                this._acceptedSockets.push(acceptedSock);
                wasiSocketsDebug("notifyAcceptedSocket rejectAllAcceptPromises()");
                this.rejectAllAcceptPromises();
            }
        } else {
            wasiSocketsDebug("notifyAcceptedSocket() else this._acceptedSockets.push");
            this._acceptedSockets.push(acceptedSock);
        }

    }

    async hasConnectedClient(): Promise<boolean> {
        let hasConnectedClient = false;
        if (this.isListening()) {
            if (globalThis.USE_ACCEPTED_SOCKET_PROMISE) {
                try {
                    wasiSocketsDebug("hasConnectedClient() before getAccptedSocketByPromise()");
                    const acceptedSock = await this.getAcceptedSocketByPromise();
                    wasiSocketsDebug("hasConnectedClient() notifyAcceptedSocket()");
                    this.notifyAcceptedSocket(acceptedSock);
                    hasConnectedClient = true;
                } catch (err: any) {
                    wasiSocketsDebug("hasConnectedClient err: ", err);
                }
            } else {
                if (this._acceptedSockets) {
                    if ( this._acceptedSockets.length > 0 ){
                        hasConnectedClient = true;
                    }
                }
            }
        }
        return hasConnectedClient;
    }

    async read(len: number): Promise<Uint8Array> {
        wasiSocketsDebug("tcp socket:read len:", len);
        let isClosingAndHasMoreData = false;
        if (this._closed) {
            // assuming the remote peer closed
            if (this._dataBuffer && this._dataBuffer.length > 0) {
                // Here the remote peer has closed but we have data in the buffer
                isClosingAndHasMoreData = true;
            } else {
                return new Uint8Array(0); 
            }
        }
        // Skip this waitForConnect if we are closing
        if (!isClosingAndHasMoreData) {
            await this.waitForConnect();
        }

        if (this._dataBuffer.length == 0) {
            wasiSocketsDebug("tcp socket:read throwing EAGAIN as no data");
            await delay(1);
            // assuming connected and empty buffer, no data available, telling client to try again
            throw new SystemError(ErrnoN.AGAIN, true);
        }

        let retChunks = this._dataBuffer;
        const databufferLen = this._dataBuffer.length;
        wasiSocketsDebug("tcp socket:read databufferLen: ", databufferLen);
        if (databufferLen > len) {
            retChunks = this._dataBuffer.subarray(0, len);
            this._dataBuffer = this._dataBuffer.slice(len);
        } else {
            this._dataBuffer = new Uint8Array(0);
        }

        wasiSocketsDebug("tcp socket:read returning retChunks.length: ", retChunks.length);
        return retChunks;
    }

    async writeTo(data: Uint8Array, addr?: AddressInfo): Promise<void> {
        wasiSocketsDebug("tcp socket:writeTo");
        await this.write(data);
    }

    async write(data: Uint8Array): Promise<void> {
        let promisedWrite: Promise<void> = new Promise(async (resolve, reject) => {
            wasiSocketsDebug("tcp socket:write");
            await this.waitForConnect();
            let writeCallback = (error: Error | null | undefined) => {
                if (error) {
                    wasiSocketsDebug("tcp socket:write got error: ", error);
                    let errAny = error as any;
                    // default to CONNRESET error
                    let thowErr = new SystemError(ErrnoN.CONNRESET, false);
                    if (errAny.code) {
                        const errCode = errAny.code;
                        if (errCode == "EPIPE") {
                            thowErr = new SystemError(ErrnoN.PIPE, false);
                        }
                    }
                    reject(thowErr);
                } else {
                    resolve();
                }
            }
            let flushed = this._nodeSocket.write(data, "utf8", writeCallback);
            if (!flushed) {
                wasiSocketsDebug("tcp socket:write did not successfully flush");
            }
        });
        return promisedWrite;
    }

    async address(): Promise<AddressInfo> {
        wasiSocketsDebug("tcp socket:address");
        await this.waitForConnect();
        let addr: AddressInfo;
        if (this._nodeServer) {
            wasiSocketsDebug("tcp socket:address: isNodeServer");
            addr = this._nodeServer.address() as AddressInfo;
            wasiSocketsDebug("tcp socket:address: server returning addr:", addr);
        } else if (this._parentSocket && this._parentSocket._nodeServer) {
            wasiSocketsDebug("tcp socket:address: isNodeClient with parentSock");
            addr = this._parentSocket._nodeServer.address() as AddressInfo;
            wasiSocketsDebug("tcp socket:address: client returning addr:", addr);
        } else {
            wasiSocketsDebug("tcp socket:address: isNodeClient");
            addr = this._nodeSocket.address() as AddressInfo;
            wasiSocketsDebug("tcp socket:address: client returning addr:", addr);
        }
        wasiSocketsDebug("tcp socket:address: returning addr:", addr);
        if (addr.address && addr.family && addr.port) {
            // normalize on deno as family is 4/6 on deno
            let addrAny = addr as any;
            let addrFamily = addrAny.family;
            if (addrFamily == "4") {
                addr.family = "IPv4";
                wasiSocketsDebug("tcp socket:address: normalizing setting famly as IPv4");
            } else if (addrFamily == "6") {
                addr.family = "IPv6";
                wasiSocketsDebug("tcp socket:address: normalizing setting famly as IPv6");
            }
            return addr;
        } else {
            wasiSocketsDebug("tcp socket:address: unexpected malformed address");
            console.trace();
            // throw if we have malformed address
            throw new SystemError(ErrnoN.CONNRESET, true);
        }
    }
    async remoteAddress(): Promise<AddressInfo> {
        wasiSocketsDebug("tcp socket:remoteAddress");
        await this.waitForConnect();
        const remoteAddr = this._nodeSocket.remoteAddress;
        wasiSocketsDebug("tcp socket:remoteAddress: ", remoteAddr);
        const remotePort = this._nodeSocket.remotePort;
        const remoteFamily = this._nodeSocket.remoteFamily;
        if (remoteAddr && remotePort && remoteFamily) {
            const aRemoteFamily = remoteFamily as AddressFamily;
            const addr: AddressInfo = {
                address: remoteAddr,
                port: remotePort,
                family: aRemoteFamily,
            };
            wasiSocketsDebug("tcp socket:remoteAddress: returning addr:", addr);
            return addr;
        } else {
            if (this._connected) {
                wasiSocketsDebug("tcp socket:remoteAddress: remoteAddr:", remoteAddr);
                wasiSocketsDebug("tcp socket:remoteAddress: remotePort:", remotePort);
                wasiSocketsDebug("tcp socket:remoteAddress: remoteFamily:", remoteFamily);

                wasiSocketsDebug("tcp socket:remoteAddress: unexpected malformed address");
                console.trace();
            } else {
                wasiSocketsDebug("tcp socket:remoteAddress: called for socket that is no longer connected");
            }
        }
        throw new SystemError(ErrnoN.CONNRESET, true);
    }
    close(): void {
        wasiSocketsDebug("tcp socket:close()");
        try {
            //wasiSocketsDebug("close:, ", this._nodeSocket);
            if (!this._closed) {
                wasiSocketsDebug("close() rejectAllAcceptPromises()");
                this.rejectAllAcceptPromises();
                this._nodeSocket.end();
                this._closed = true;
            }
        } catch (err: any) {
            wasiSocketsDebug("tcp socket:close() err: ", err);
        }
        //this._nodeSocket.destroy();
    }

    shutdown(): void {
        wasiSocketsDebug("tcp socket:shutdown");
        this._nodeSocket.end();
    }
    async bind(addrInfo: AddressInfo) {
        wasiSocketsDebug("tcp socket:bind");
        this.bindAddress = addrInfo;
    }
    async listen(backlog: number) {
        wasiSocketsDebug("tcp socket:listen");
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
                    wasiSocketsDebug("tcp server on listening");
                    superThis._connected = true;
                    superThis._ready = true;
                });
                server.on("error", (err: any) => {
                    wasiSocketsDebug("tcp server on error");
                    wasiSocketsDebug("tcp server : Client: error with peer: ", err);
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
                    wasiSocketsDebug("tcp server on close");
                    superThis._closed = true;
                });
                server.on("drop", () => {
                    wasiSocketsDebug("tcp server on drop");
                });
                server.on("connection", (netSocket: NodeNetTcpSocket) => {
                    wasiSocketsDebug("tcp server on connection");
                    const getClientSocket = () => netSocket;
                    const newSocket = new NetTcpSocket(this._family, getClientSocket, this._serverCreator, this);
                    newSocket._isServerConnection = true;
                    newSocket.setupListeners();
                    
                    wasiSocketsDebug("server.on(connection) superThis.notifyAcceptedSocket()");
                    superThis.notifyAcceptedSocket(newSocket);

                    newSocket._connected = true;
                    newSocket._ready = true;
                });
            }
        }
    }
    async connect(host: string, port: number): Promise<void> {
        wasiSocketsDebug(`tcp socket connect: starting to host: ${host} and port: ${port}`);
        const socket = this._nodeSocket;
        socket.connect(port, host);
        wasiSocketsDebug("tcp socket connect: connected");
        this.setupListeners();
    }

    isListening() {
        if (this.bindAddress) {
            return true;
        }
        return false;
    }

    setupListeners() {
        const socket = this._nodeSocket;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const superThis = this;
        socket.on("data", (buf: Buffer) => {
            wasiSocketsDebug("tcp socket on data");
            if (this._parentSocket) {
                wasiSocketsDebug("tcp socket.on(data) this._parentSocket.rejectAllAcceptPromises()");
                this._parentSocket.rejectAllAcceptPromises();
            }
            if (buf) {
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, buf);
            }
        });
        socket.on("close", () => {
            superThis._closed = true;
            if (this._parentSocket) {
                wasiSocketsDebug("tcp socket.on(close) this._parentSocket.rejectAllAcceptPromises()");
                this._parentSocket.rejectAllAcceptPromises();
            }
            wasiSocketsDebug("tcp socket on close");
        });
        socket.on("connect", async () => {
            wasiSocketsDebug("tcp socket on connect: Client: connection established with peer");
            superThis._connected = true;
        });
        socket.on("ready", function (this: any) {
            wasiSocketsDebug("tcp socket on ready");
            wasiSocketsDebug("tcp socket : Client: connection ready with peer");
            superThis._ready = true;
        });
        socket.on("error", function (err: any) {
            wasiSocketsDebug("tcp socket on error");
            wasiSocketsDebug("tcp socket : Client: error with peer: ", err);
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
            wasiSocketsDebug("tcp socket on timeout");
            wasiSocketsDebug("tcp socket: Client: timeout with peer");
        });
        socket.on("end", () => {
            wasiSocketsDebug("tcp socket on end");
            wasiSocketsDebug("tcp socket : disconnected from peer");
            if (this._parentSocket) {
                wasiSocketsDebug("tcp socket.on(end) this._parentSocket.rejectAllAcceptPromises()");
                this._parentSocket.rejectAllAcceptPromises();
            }
            superThis._connected = false;
            superThis._closed = true;
            if (this.connectionCloser) {
                this.connectionCloser();
            }
        });
    }
    
    async getAcceptedSocket(): Promise<NetTcpSocket> {
        wasiSocketsDebug("getAcceptedSocket()");
        if (globalThis.USE_ACCEPTED_SOCKET_PROMISE) {
            try {
                return await this.getAcceptedSocketByPromise();
            } catch (err: any) {
                throw new SystemError(ErrnoN.AGAIN, true);
            }
        } else {
            return await this.getAcceptedSocketPlain();
        }
    }

    async getAcceptedSocketPlain(): Promise<NetTcpSocket> {
        wasiSocketsDebug("getAcceptedSocketPlain()");
        let acceptedSocket = this._acceptedSockets.shift();
        if (!acceptedSocket) {
            wasiSocketsDebug("tcp server accept throwing err: ErrnoN.AGAIN");
            throw new SystemError(ErrnoN.AGAIN, true);
        }
        return acceptedSocket;
    }

    async readFrom(len: number): Promise<RemoteChunk> {
        wasiSocketsDebug("tcp socket readFrom");
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

export class NetUdpSocket extends Socket implements WasiSocket, Peekable {
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
    _dataChunks: Array<RemoteChunk> = [];

    private _remoteAddr: string = "";
    private _remotePort: number = 0;
    async waitForConnect(): Promise<void> {
        wasiSocketsDebug("udp socket waitForConnect ");
        if (this._error) {
            wasiSocketsDebug("udp socket waitForConnect throwing err: ", this._error);
            throw new SystemError(this._error, true);
        }
        while (!(this._connected || this._listening)) {
            wasiSocketsDebug("udp socket waitForConnect waiting");
            if (this._error != 0) {
                wasiSocketsDebug("udp socket waiting for connect err: ", this._error);
                throw new SystemError(ErrnoN.CONNREFUSED, false);
            }
            await delay(1);
        }
    }

    async read(len: number): Promise<Uint8Array> {
        wasiSocketsDebug("udp socket:read");
        const rfrom = await this.readFrom(len);
        const arr = rfrom.buf;
        return arr;
    }

    async readFrom(len: number): Promise<RemoteChunk> {
        wasiSocketsDebug("udp socket:readFrom");
        const ret = await this.readFromWithoutRetry(len);
        return ret;
    }
    async readFromWithoutRetry(len: number): Promise<RemoteChunk> {
        //console.trace();
        wasiSocketsDebug("udp socket:readFromWithoutRetry len:", len);
        if (this._closed) {
            wasiSocketsDebug("udp socket:readFromWithoutRetry ErrnoN.CONNABORTED as closed");
            // assuming the sender closed
            //return new Uint8Array(0);
            throw new SystemError(ErrnoN.CONNABORTED, true);
        }

        await this.waitForConnect();
        if (this._dataChunks.length == 0) {
            wasiSocketsDebug("udp socket:readFromWithoutRetry throwing EAGAIN as no data");
            await delay(1);
            // check again after delay
            if (this._dataChunks.length == 0) {
                // assuming connected and empty buffer, no data available, telling client to try again
                throw new SystemError(ErrnoN.AGAIN, true);
            }
        }

        let availableChunks = this._dataChunks;
        const firstChunk = availableChunks.shift();
        if (firstChunk) {
            let returningBuf = firstChunk.buf;
            const returningRinfo = firstChunk.rinfo;
            const returningBufLen = returningBuf.byteLength;
            wasiSocketsDebug("udp socket:readFromWithoutRetry returningBuf: ", returningBufLen);
            if (returningBufLen > len) {
                returningBuf = firstChunk.buf.subarray(0, len);
                this._dataChunks = this._dataChunks.slice(len);
                const remainingBuf = firstChunk.buf.subarray(len);
                const remainingBufLen = remainingBuf.length;
                // pushing back the remaining buf
                const remainingRinfo: RemoteInfo = {
                    address: returningRinfo.address,
                    port: returningRinfo.port,
                    size: remainingBufLen,
                    family: returningRinfo.family,
                };
                wasiSocketsDebug("udp socket:readFromWithoutRetry returning remainingRinfo: ", remainingRinfo);
                this._dataChunks.unshift({ buf: remainingBuf, rinfo: remainingRinfo });
            }
            wasiSocketsDebug("udp socket:readFromWithoutRetry returning returningBuf.length: ", returningBuf.length);
            wasiSocketsDebug("udp socket:readFromWithoutRetry returning returningRinfo: ", returningRinfo);
            return { buf: returningBuf, rinfo: returningRinfo };
        } else {
            throw new SystemError(ErrnoN.AGAIN, true);
        }
    }

    async write(data: Uint8Array): Promise<void> {
        wasiSocketsDebug("udp socket:write");
        await this.writeTo(data, undefined);
    }

    async writeTo(data: Uint8Array, addr?: AddressInfo): Promise<void> {
        wasiSocketsDebug("udp socket:writeTo");
        wasiSocketsDebug("udp socket:writeTo data:", data);
        await this.waitForConnect();
        const cb = (error: Error | null, bytes: number) => {
            wasiSocketsDebug("udp writeTo callback:");
            wasiSocketsDebug("udp writeTo callback: error:"), error;
            wasiSocketsDebug("udp writeTo callback: bytes:"), bytes;
        };
        if (addr) {
            wasiSocketsDebug("udp socket:writeTo addr:", addr);
            const remotePort = addr.port;
            const remoteAddr = addr.address;
            this._nodeSocket.send(data, remotePort, remoteAddr, cb);
        } else {
            wasiSocketsDebug("udp socket:writeTo noaddr");
            this._nodeSocket.send(data);
        }
    }
    async address(): Promise<AddressInfo> {
        wasiSocketsDebug("udp socket address");
        await this.waitForConnect();
        const addr = this._nodeSocket.address();
        if (addr.address && addr.family && addr.port) {
            return addr;
        } else {
            console.trace();
            // throw if we have malformed address
            throw new SystemError(ErrnoN.CONNRESET, true);
        }
    }
    async remoteAddress(): Promise<AddressInfo> {
        wasiSocketsDebug("udp socket remoteAddress");
        await this.waitForConnect();
        const addr = this._nodeSocket.remoteAddress();
        if (addr.address && addr.family && addr.port) {
            return addr;
        } else {
            console.trace();
            // throw if we have malformed address
            throw new SystemError(ErrnoN.CONNRESET, true);
        }
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
        wasiSocketsDebug("udp socket connect: starting");
        const host = addr;
        const socket = this._nodeSocket;
        socket.connect(port, host);
        wasiSocketsDebug("udp socket connect: setting _remoteAddr: ", addr);
        this._remoteAddr = addr;
        wasiSocketsDebug("udp socket connect: setting _remotePort: ", port);
        this._remotePort = port;
        wasiSocketsDebug("udp socket connect: connected");
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
                superThis._dataChunks.push(gotMsg);
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
        wasiSocketsDebug("udp socket peek ");
        if (this._closed) {
            wasiSocketsDebug("udp socket peek returning 0 as closed");
            // assuming the sender closed
            return 0;
        } else {
            if (this._dataChunks) {
                if (this._dataChunks.length > 0) {
                    const buf = this._dataChunks[0].buf;
                    peekedSize = buf.length;
                }
            }
        }
        wasiSocketsDebug(`udp socket peek returning ${peekedSize}`);
        return peekedSize;
    }
}

export async function createTcpSocket(af?: AddressFamily): Promise<NetTcpSocket> {
    if (isNodeorBunorDeno()) {
        const nodeImpl = await import("./net_node.js");
        const createSocket = nodeImpl.createNodeTcpSocket;
        const createServer = nodeImpl.createNodeTcpServer;
        wasiSocketsDebug("net createTcpSocket node 1 :");
        if (!af) {
            af = "IPv4";
        }
        const sock = new NetTcpSocket(af, createSocket, createServer);
        wasiSocketsDebug("net createTcpSocket node 2 :");
        return sock;
    } else {
        const wsImpl = await import("./net_wsproxy.js");
        const createSocket = wsImpl.createNodeTcpSocket;
        const createServer = wsImpl.createNodeTcpServer;
        wasiSocketsDebug("net createTcpSocket ws 1 :");
        if (!af) {
            af = "IPv4";
        }
        const sock = new NetTcpSocket(af, createSocket, createServer);
        wasiSocketsDebug("net createTcpSocket ws 2 :");
        return sock;
    }
}

export async function createUdpSocket(af?: AddressFamily): Promise<NetUdpSocket> {
    if (isNodeorBunorDeno()) {
        const nodeImpl = await import("./net_node.js");
        const createSocket = nodeImpl.createNodeUdpSocket;
        wasiSocketsDebug(`net createUdpSocket attempting to create socket af: ${af}:`);
        if (!af) {
            af = "IPv4";
        }
        const sock = new NetUdpSocket(af, createSocket);
        wasiSocketsDebug(`net createUdpSocket created socket af: ${af}:`);
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
    if (isNodeorBunorDeno()) {
        const nodeImpl = await import("./net_node.js");
        const addrResolve = nodeImpl.addrResolve;
        return addrResolve;
    } else {
        const wsImpl = await import("./net_wsproxy.js");
        const addrResolve = wsImpl.addrResolve;
        return addrResolve;
    }
}
