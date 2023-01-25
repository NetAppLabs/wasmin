import { Socket } from "./wasiFileSystem";
import { Addr, AddrTypeN } from "./wasi_experimental_sockets_bindings";

export interface AddressInfo{
    address: string;
    family: string;
    port: number;
}

export interface NetSocket extends Socket {
    address(): Promise<AddressInfo>;
    remoteAddress(): Promise<AddressInfo>;
    bind(addr: AddressInfo): Promise<void>;
    listen(backlog: number): Promise<void>;
    getAcceptedSocket(): Promise<NetSocket>;
    connect(addr: string, port: number): Promise<void>;
    shutdown(): void;
}


export interface NodeNetTcpSocket {
    remoteFamily: any;
    remotePort: any;
    remoteAddress: any;
    address(): AddressInfo;
    connect(port: number, host: string, connectionListener?: () => void): Promise<this>;
    //end(callback?: () => void): this;
    end(str: Uint8Array | string, encoding?: BufferEncoding, callback?: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    on(event: 'close', listener: (hadError: boolean) => void): this;
    on(event: 'connect', listener: () => void): this;
    on(event: 'data', listener: (data: Buffer) => void): this;
    on(event: 'end', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'ready', listener: () => void): this;
    on(event: 'timeout', listener: () => void): this;
    read(size?: number): any;
    //write(buffer: Buffer | string, encoding?: string, cb?: (err?: Error) => void): boolean;
    write(chunk: any, callback?: (error: Error | null | undefined) => void): boolean;
    write(chunk: any, encoding: BufferEncoding, callback?: (error: Error | null | undefined) => void): boolean;
    [Symbol.asyncIterator](): AsyncIterableIterator<any>;
}

export interface NodeNetTcpServer {
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'close', listener: () => void): this;
    on(event: 'connection', listener: (socket: NodeNetTcpSocket) => void): this;
    on(event: 'listening', listener: () => void): this;
    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): this;
    address(): AddressInfo;
}


export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function createPromiseWithTimeout(
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

export function appendToUint8Array(arr: Uint8Array, data: Uint8Array): Uint8Array {
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

export function WasiAddrtoAddressInfo(addr: Addr): AddressInfo {
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

export function AddressInfoToWasiAddr(addr: AddressInfo): Addr{
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
