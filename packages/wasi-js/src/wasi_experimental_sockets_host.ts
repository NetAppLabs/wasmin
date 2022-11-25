import { WasiEnv } from "./wasi";
import { detectNode, translateErrorToErrorno } from "./wasiUtils";
import { Addr, AddressFamily, AddressFamilyN, AddrTypeN, addWasiExperimentalSocketsToImports, Errno, ErrnoN, Fd, i32, IpPort, mutptr, ptr, Size, SockType, SockTypeN, string, u32, WasiExperimentalSocketsAsync } from "./wasi_experimental_sockets_bindings";

import { Socket } from "./wasiFileSystem";
import { SystemError } from "./errors";

/*
const net = require("node:net");
const dgram = require("node:dgram");
const dns = require("node:dns");
*/



import { default as net } from "node:net";
//import { default as dgram } from "node:dgram";
//import { default as dns } from "node:dns";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createPromiseWithTimeout(
    promise: Promise<any>,
    ms: number,
    timeoutError = new Error('Promise timed out')
  ) {
    // create a promise that rejects in milliseconds
    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(timeoutError);
      }, ms);
    });
  
    // returns a race between timeout and the passed promise
    return Promise.race([promise, timeout]);
  }

function appendToUint8Array(arr: Uint8Array, data: Uint8Array): Uint8Array {
	const newArray = new Uint8Array(arr.length + data.length);
	newArray.set(arr);              // copy old data
	newArray.set(data, arr.length); // copy new data after end of old data
	return newArray;
}

declare let globalThis: any;
globalThis.WASI_SOCKETS_DEBUG = false;

export function wasiSocketsDebug(msg?: any, ...optionalParams: any[]): void {
    if (globalThis.WASI_SOCKETS_DEBUG) {
        console.debug(msg, ...optionalParams);
    }
}
export interface AddressInfo{
    address: string;
    family: string;
    port: number;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
//const net = require("node:net");

class NodeTcpSocket extends Socket{
    constructor() {
        super();
        const nodeSocket = new net.Socket();
        this._nodeSocket = nodeSocket;
        this._connected = false;
        this._ready = false;
        this._closed = false;
        this._dataBuffer = new Uint8Array();
        this._error = 0;
    }
    _dataBuffer: Uint8Array;
    _connected: boolean;
    _ready: boolean;
    _closed: boolean;
    _error: number;
    bindAddress?: AddressInfo
    // @ts-ignore
    private _nodeSocket: net.Socket
    async waitForConnect(): Promise<void> {
        while (!this._connected && !this._ready) {
            if ( this._error != 0 ) {
                throw new SystemError(ErrnoN.CONNREFUSED, false);
            }
            wasiSocketsDebug("waiting for connect");
            await delay(1);
        }
    }

    async read(len: number): Promise<Uint8Array> {
        wasiSocketsDebug("socket:read len:", len);
        await this.waitForConnect();
        if (this._closed) {
            // assuming the sender closed
            return new Uint8Array(0);
        }
        if (this._dataBuffer.length == 0) {
            await delay(1);
            // assuming connected and empty buffer, no data available, telling client to try again
            throw new SystemError(ErrnoN.AGAIN, true)
        }

        let retChunks = this._dataBuffer;
        const databufferLen = this._dataBuffer.length;
        wasiSocketsDebug("socket:read databufferLen: ", databufferLen);
        if (databufferLen > len) {
            retChunks = this._dataBuffer.subarray(0,len);
            this._dataBuffer = this._dataBuffer.slice(len);
        } else {
            this._dataBuffer = new Uint8Array(0);
        }

        wasiSocketsDebug("socket:read returning retChunks.length: ", retChunks.length);
        return retChunks;

    }

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

        //const res = socket.read(len);
        /*
        socket.on('data', () => {
           let chunk;
           while (null !== (chunk = socket.read(len))) {
             chunks.set(chunk);
             hasData = true;
             delay(1);
           }
        });
        wasiSocketsDebug("socket:read returning chunks: ", chunks);
        //return res;
        */
        /*
        let chunk: Uint8Array;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const superThis = this;
        let hasData = false;
        socket.on('readable', function() {
            while ((chunk = socket.read(len)) != null) {
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, chunk);
                hasData = true;
            }
        });
        while (!hasData){
            delay(1);
        }
        */
        
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
    }

    async write(data: Uint8Array): Promise<void>{
        wasiSocketsDebug("socket:write");
        await this.waitForConnect();
        this._nodeSocket.write(data);
    }

    async address(): Promise<AddressInfo> {
        await this.waitForConnect();
        const addr = this._nodeSocket.address() as AddressInfo;
        wasiSocketsDebug("address: returning addr:", addr);
        return addr;
    }
    async remoteAddress(): Promise<AddressInfo> {
        await this.waitForConnect();
        const remoteAddr = this._nodeSocket.remoteAddress;
        wasiSocketsDebug("remoteAddress: ", remoteAddr);
        const remotePort = this._nodeSocket.remotePort;
        const remoteFamily = this._nodeSocket.remoteFamily;
        if (remoteAddr && remotePort && remoteFamily ){
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
        this._nodeSocket.destroy();
    }
    shutdown(): void {
        wasiSocketsDebug("socket:shutdown");
        this._nodeSocket.destroy();
    }
    async bind(addrInfo: AddressInfo) {
        this.bindAddress = addrInfo;
    }
    async listen(backlog: number) {
        const addrInfo = this.bindAddress;
        if (addrInfo) {
            const srv = net.createServer();
            const port = addrInfo.port;
            const host = addrInfo.address;
            srv.listen(port, host);
        }
    }
    async connect(host: string, port: number): Promise<void> {
        wasiSocketsDebug("connect: starting");
        const socket = this._nodeSocket;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const superThis = this;

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
        socket.on('readable', () => {
            wasiSocketsDebug('connect: readable');
            /*let chunk;
            while ((chunk = socket.read()) != null) {
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, chunk);
            }*/
            const chunk = socket.read();
            if (chunk) {
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, chunk);
            }
        });

        socket.on('close', () => {
            superThis._closed = true;
            wasiSocketsDebug('connect: Client: closed');
        });
        socket.on('connect', async () => {
            wasiSocketsDebug('connect: Client: connection established with server');
            superThis._connected = true;
            for await (const chunk of socket) {
                const newChunks = new Uint8Array(chunk);
                superThis._dataBuffer = appendToUint8Array(superThis._dataBuffer, newChunks);
            }    
        });
        socket.on('ready', function(this: any) {
            wasiSocketsDebug('connect: Client: connection ready with server');
            superThis._ready = true;
        });
        socket.on('error', function(err: any) {
            wasiSocketsDebug('connect: Client: error with server: ', err);
            if ( err.code ) {
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
        socket.on('timeout', function(this: any){
            wasiSocketsDebug('connect: Client: timeout with server');
        });
        socket.on('end', () => {
            wasiSocketsDebug('connect: disconnected from server');
            superThis._connected = false;
            superThis._closed = true;
        });
    }
}
class NodeUdpSocket extends Socket{
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
}

function IPv4AddressToArray(addr: string): number[]{
    const saddrs = addr.split(".");
    const retAddrs: number[] = [];
    for(const saddr of saddrs)
    {
        retAddrs.push(parseInt(saddr));
    }
    return retAddrs;
}

function IPv6AddressToArray(addr: string): number[]{
    const saddrs = addr.split(":");
    const retAddrs: number[] = [];
    for(const saddr of saddrs)
    {
        retAddrs.push(parseInt(saddr, 16));
    }
    return retAddrs;
}

function WasiAddrtoAddressInfo(addr: Addr): AddressInfo {
    let family: string;
    let hostAddr: string;
    if (addr.tag == AddrTypeN.IP_4 ){
        family = "IPv4"
        hostAddr = `${addr.data.addr.n_0}.${addr.data.addr.n_1}.${addr.data.addr.h_0}.${addr.data.addr.h_1}`;
    } else if (addr.tag == AddrTypeN.IP_6 ){
        family = "IPv6"
        const n0 = addr.data.addr.n_0;
        const n0s = n0.toString(16);
        const n1 = addr.data.addr.n_1;
        const n1s = n1.toString(16);
        const n2 = addr.data.addr.n_2;
        const n2s = n2.toString(16);
        const n3 = addr.data.addr.n_3;
        const n3s = n3.toString(16);
        const h0 = addr.data.addr.h_0;
        const h0s = h0.toString(16);
        const h1 = addr.data.addr.h_1;
        const h1s = h1.toString(16);
        const h2 = addr.data.addr.h_2;
        const h2s = h2.toString(16);
        const h3 = addr.data.addr.h_3;
        const h3s = h3.toString(16);
        hostAddr = `${n0s}:${n1s}:${n2s}}:${n3s}:${h0s}:${h1s}:${h2s}}:${h3s}`;
    } else {
        family = "undefined";
        hostAddr = "";
    }
    const addrinfo: AddressInfo = {
        address: hostAddr,
        port: addr.data.port,
        family: family
    }
    return addrinfo;
}

function AddressInfoToWasiAddr(addr: AddressInfo): Addr{
    const address =  addr.address;
    // family: 'IPv4' or 'IPv6'
    const family =  addr.family;
    const port =  addr.port;
    if (family == "IPv4" ){
        const addrArray = IPv4AddressToArray(address);
        const wasiAddr: Addr = {
            tag: AddrTypeN.IP_4,
            data: {
                addr: {
                    n_0: addrArray[0],
                    n_1: addrArray[1],
                    h_0: addrArray[2],
                    h_1: addrArray[3],
                },
                port: port,
            },
        };
        return wasiAddr;
    } else if (family == "IPv6" ){
        const addrArray = IPv6AddressToArray(address);
        const wasiAddr: Addr = {
            tag: AddrTypeN.IP_6,
            data: {
                addr: {
                    n_0: addrArray[0],
                    n_1: addrArray[1],
                    n_2: addrArray[2],
                    n_3: addrArray[3],
                    h_0: addrArray[4],
                    h_1: addrArray[5],
                    h_2: addrArray[6],
                    h_3: addrArray[7],
                },
                port: port,
            },
        };
        return wasiAddr;
    }
    throw new Error("AddressInfoToWasiAddr invalid address");
}

export class WasiExperimentalSocketsAsyncHost implements WasiExperimentalSocketsAsync {
    constructor(wasiEnv: WasiEnv, get_export?: (name: string) => WebAssembly.ExportValue) {
        this._wasiEnv = wasiEnv;
        this._get_exports_func = get_export;
        this._isNode = detectNode();
    }
    public _get_exports_func?: (name: string) => WebAssembly.ExportValue;
    private _wasiEnv: WasiEnv;
    private _isNode: boolean;
    get memory(): WebAssembly.Memory | undefined {
        if (this._get_exports_func) {
            const eMem = this._get_exports_func("memory");
            return eMem as WebAssembly.Memory;
        } else {
            throw new Error("_get_exports_func not set");
        }
    }
    get buffer() {
        if (this.memory) {
            const memory: WebAssembly.Memory = this.memory;
            return memory.buffer;
        } else {
            throw new Error("memory not set for buffer");
        }
    }
    get openFiles() {
        return this._wasiEnv.openFiles;
    }

    getSocket(fd: number) : NodeTcpSocket{
        const res = this.openFiles.get(fd);
        return res as NodeTcpSocket;
    }
    async addrResolve(host_ptr: ptr<string>, host_len: number, port: number, buf: mutptr<number>, buf_len: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const dns = require("node:dns");
        // @ts-ignore
        const options: dns.LookupAllOptions = {
            all: true,
        };
        const dnsPromises = dns.promises;
        const hostname = string.get(this.buffer, host_ptr, host_len);

        let offset = 0;
        const dnsResponses = await dnsPromises.lookup(hostname, options);
        for (const dnsresp of dnsResponses) {
            const addr = dnsresp.address;
            let family = "IPv4";
            if (dnsresp.family == 6) {
                family = "IPv6";
            }
            const addrInfo: AddressInfo = {
                address: addr,
                family: family,
                port: port,
            }
            const wasiAddr = AddressInfoToWasiAddr(addrInfo);
            const mptr = (buf + offset) as any as mutptr<Addr>;
            Addr.set(this.buffer, mptr, wasiAddr);
            if (dnsresp.family == 4) {
                offset = offset + 8
            }else if (dnsresp.family == 6) {
                offset = offset + 20
            }
        }
        u32.set(this.buffer, result_ptr, offset);
        return ErrnoN.SUCCESS;
    }
    async sockAddrLocal(fd: number, buf: mutptr<number>, buf_len: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockAddrLocal:");
        const sock = this.getSocket(fd);
        const addr = await sock.address();
        wasiSocketsDebug("sockAddrLocal: addr: ", addr);
        const wasiAddr = AddressInfoToWasiAddr(addr);
        const mptr = buf as any as mutptr<Addr>;
        Addr.set(this.buffer, mptr, wasiAddr);
        wasiSocketsDebug("sockAddrLocal: returning");
        return ErrnoN.SUCCESS;
    }
    async sockAddrRemote(fd: number, buf: mutptr<number>, buf_len: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockAddrRemote:");
        const sock = this.getSocket(fd);
        //wasiSocketsDebug("sockAddrRemote: sock: ", sock);
        const addr = await sock.remoteAddress();
        wasiSocketsDebug("sockAddrRemote: addr: ", addr);
        const wasiAddr = AddressInfoToWasiAddr(addr);
        const mptr = buf as any as mutptr<Addr>;
        Addr.set(this.buffer, mptr, wasiAddr);
        wasiSocketsDebug("sockAddrRemote: returning");
        return ErrnoN.SUCCESS;
    }
    async sockOpen(af: AddressFamily, socktype: SockType, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockOpen:");
        wasiSocketsDebug("sockOpen:  af: ", af);
        wasiSocketsDebug("sockOpen:  afn: ", af as number);
        wasiSocketsDebug("sockOpen:  sockType: ", socktype);
        if (socktype == SockTypeN.SOCKET_STREAM) {
            wasiSocketsDebug("sockOpen tcp 1 :");
            const sock = new NodeTcpSocket();
            wasiSocketsDebug("sockOpen tcp 2 :");
            const resultFd = this.openFiles.add(sock);
            wasiSocketsDebug("sockOpen tcp 3 :");
            Fd.set(this.buffer, result_ptr, resultFd);
            wasiSocketsDebug("SOCKET_STREAM: resultFd: ", resultFd);
            return ErrnoN.SUCCESS;
        }else if (socktype == SockTypeN.SOCKET_DGRAM) {
            wasiSocketsDebug("sockOpen udp 1 :");
            let sock: NodeUdpSocket;
            switch(af) {
                case AddressFamilyN.INET_4:
                    sock = new NodeUdpSocket('udp4');
                case AddressFamilyN.INET_6:
                    sock = new NodeUdpSocket('udp6');
            }
            const resultFd = this.openFiles.add(sock);
            Fd.set(this.buffer, result_ptr, resultFd);
            wasiSocketsDebug("SOCKET_DGRAM: resultFd: ", resultFd);
            return ErrnoN.SUCCESS;
        } else {
            return ErrnoN.INVAL;
        }
    }
    async sockClose(fd: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockClose:");
        const sock = this.getSocket(fd);
        try {
            sock.close();
        } catch(err: any) {
            console.error("close() error: ", err);
            return ErrnoN.BUSY;
        }
        return ErrnoN.SUCCESS;
    }
    async sockSetReuseAddr(fd: number, reuse: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockSetReuseAddr:");
        throw new Error("Method not implemented.");
    }
    async sockGetReuseAddr(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockGetReuseAddr:");
        throw new Error("Method not implemented.");
    }
    async sockSetReusePort(fd: number, reuse: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockSetReusePort:");
        throw new Error("Method not implemented.");
    }
    async sockGetReusePort(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockGetReusePort:");
        throw new Error("Method not implemented.");
    }
    async sockSetRecvBufSize(fd: number, size: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockSetRecvBufSize:");
        throw new Error("Method not implemented.");
    }
    async sockGetRecvBufSize(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockGetRecvBufSize:");
        throw new Error("Method not implemented.");
    }
    async sockSetSendBufSize(fd: number, size: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockSetSendBufSize:");
        throw new Error("Method not implemented.");
    }
    async sockGetSendBufSize(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockGetSendBufSize:");
        throw new Error("Method not implemented.");
    }
    async sockBind(fd: number, addr: mutptr<{ tag: AddrTypeN.IP_4; data: { addr: { n_0: number; n_1: number; h_0: number; h_1: number; }; port: number; }; } | { tag: AddrTypeN.IP_6; data: { addr: { n_0: number; n_1: number; n_2: number; n_3: number; h_0: number; h_1: number; h_2: number; h_3: number; }; port: number; }; }>): Promise<ErrnoN> {
        wasiSocketsDebug("sockBind:");
        const addrval = Addr.get(this.buffer, addr);
        const addrInfo = WasiAddrtoAddressInfo(addrval);
        const sock = this.getSocket(fd);
        await sock.bind(addrInfo);
        return ErrnoN.SUCCESS;
    }
    async sockListen(fd: number, backlog: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockListen:");
        const sock = this.getSocket(fd);
        await sock.listen(backlog);
        return ErrnoN.SUCCESS;
    }
    async sockAccept(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockAccept:");
        throw new Error("Method not implemented.");
    }
    async sockConnect(fd: number, addr: mutptr<{ tag: AddrTypeN.IP_4; data: { addr: { n_0: number; n_1: number; h_0: number; h_1: number; }; port: number; }; } | { tag: AddrTypeN.IP_6; data: { addr: { n_0: number; n_1: number; n_2: number; n_3: number; h_0: number; h_1: number; h_2: number; h_3: number; }; port: number; }; }>): Promise<ErrnoN> {
        wasiSocketsDebug("sockConnect:");
        const sock = this.getSocket(fd);
        const addrval = Addr.get(this.buffer, addr);
        const addrInfo = WasiAddrtoAddressInfo(addrval);
        wasiSocketsDebug("sockConnect: addrInfo: ", addrInfo);
        await sock.connect(addrInfo.address, addrInfo.port);
        return ErrnoN.SUCCESS;
    }
    async sockRecv(fd: number, buf: mutptr<number>, buf_len: number, flags: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockRecv:");
        const sock = this.getSocket(fd);
        const read_len = buf_len;
        const ret = await sock.read(read_len);
        const readbuf = new Uint8Array(this.buffer, buf, buf_len);
        readbuf.set(ret);
        Size.set(this.buffer, result_ptr, read_len);
        return ErrnoN.SUCCESS;
    }
    async sockRecvFrom(fd: number, buf: mutptr<number>, buf_len: number, addr_buf: mutptr<number>, addr_buf_len: number, flags: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockRecvFrom:");
        if (addr_buf && addr_buf_len) {
            const addr_ptr = buf as any as mutptr<Addr>;
            this.sockConnect(fd, addr_ptr);
        }
        const sock = this.getSocket(fd);
        const read_len = buf_len;
        const ret = await sock.read(read_len);
        const readbuf = new Uint8Array(this.buffer, buf, buf_len);
        readbuf.set(ret);
        Size.set(this.buffer, result_ptr, read_len);
        return ErrnoN.SUCCESS;
    }
    async sockSend(fd: number, buf: mutptr<number>, buf_len: number, flags: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockSend:");
        const sock = this.getSocket(fd);
        const read_len = buf_len;
        const writebuf = new Uint8Array(this.buffer, buf, buf_len);
        await sock.write(writebuf);
        Size.set(this.buffer, result_ptr, read_len);
        return ErrnoN.SUCCESS;
    }
    async sockSendTo(fd: number, buf: mutptr<number>, buf_len: number, addr: mutptr<{ tag: AddrTypeN.IP_4; data: { addr: { n_0: number; n_1: number; h_0: number; h_1: number; }; port: number; }; } | { tag: AddrTypeN.IP_6; data: { addr: { n_0: number; n_1: number; n_2: number; n_3: number; h_0: number; h_1: number; h_2: number; h_3: number; }; port: number; }; }>, flags: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockSendTo:");
        if (addr) {
            this.sockConnect(fd,addr);
        }
        const sock = this.getSocket(fd);
        const read_len = buf_len;
        const writebuf = new Uint8Array(this.buffer, buf, buf_len);
        await sock.write(writebuf);
        Size.set(this.buffer, result_ptr, read_len);
        return ErrnoN.SUCCESS;
    }
    async sockShutdown(fd: number, how: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockShutdown:");
        const sock = this.getSocket(fd);
        sock.shutdown();
        return ErrnoN.SUCCESS;
    }
}


export function initializeWasiExperimentalSocketsToImports(
    imports: any,
    get_export: (name: string) => WebAssembly.ExportValue,
    wasiEnv: WasiEnv
) {
    //const memory = get_export("memory") as WebAssembly.Memory;
    const wHost = new WasiExperimentalSocketsAsyncHost(wasiEnv);
    wHost._get_exports_func = get_export;
    const errorHandler: (err: any) => number = function (err: any) {
        return translateErrorToErrorno(err);
    };
    const checkAbort: () => void = function () {
        if (wasiEnv.abortSignal) {
            if (wasiEnv.abortSignal?.aborted) {
                throw new SystemError(ErrnoN.CANCELED);
            }
        }
    };
    const handler = {
        getExport: get_export,
        checkAbort: checkAbort,
        handleError: errorHandler,
    }
    
    addWasiExperimentalSocketsToImports(imports, wHost, handler);
}