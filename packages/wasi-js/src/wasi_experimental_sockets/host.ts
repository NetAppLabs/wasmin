import { WasiEnv } from "../wasi.js";
import { detectNode, translateErrorToErrorno } from "../wasiUtils.js";
import {
    Addr,
    AddressFamily,
    AddressFamilyN,
    AddrTypeN,
    addWasiExperimentalSocketsToImports,
    ErrnoN,
    Fd,
    mutptr,
    ptr,
    Size,
    SockType,
    SockTypeN,
    string,
    u32,
    WasiExperimentalSocketsAsync,
} from "./bindings.js";

import { SystemError } from "../errors.js";
import { AddressInfo, AddressInfoToWasiAddr, WasiSocket, WasiAddrtoAddressInfo, wasiSocketsDebug } from "./common.js";
import { NetTcpSocket, NetUdpSocket } from "./net.js";

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

    getSocket(fd: number): WasiSocket {
        const res = this.openFiles.get(fd);
        return res as WasiSocket;
    }

    async addrResolve(
        host_ptr: ptr<string>,
        host_len: number,
        port: number,
        buf: mutptr<number>,
        buf_len: number,
        result_ptr: mutptr<number>
    ): Promise<ErrnoN> {
        let addrResolve: (host: string, port: number) => Promise<AddressInfo[]>;
        if (detectNode()) {
            const nodeImpl = await import("./net_node.js");
            addrResolve = nodeImpl.addrResolve;
        } else {
            const wsImpl = await import("./net_wsproxy.js");
            addrResolve = wsImpl.addrResolve;
        }
        if (addrResolve) {
            let offset = 0;
            const hostname = string.get(this.buffer, host_ptr, host_len);
            const dnsResponses = await addrResolve(hostname, port);
            for (const addrInfo of dnsResponses) {
                const wasiAddr = AddressInfoToWasiAddr(addrInfo);
                const mptr = (buf + offset) as any as mutptr<Addr>;
                Addr.set(this.buffer, mptr, wasiAddr);
                if (addrInfo.family == "IPv4") {
                    offset = offset + 8;
                } else if (addrInfo.family == "IPv6") {
                    offset = offset + 20;
                }
            }
            u32.set(this.buffer, result_ptr, offset);
            return ErrnoN.SUCCESS;
        }
        return ErrnoN.NOSYS;
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
            if (detectNode()) {
                const nodeImpl = await import("./net_node.js");
                const createSocket = nodeImpl.createNodeTcpSocket;
                const createServer = nodeImpl.createNodeTcpServer;
                wasiSocketsDebug("sockOpen tcp 1 :");
                const sock = new NetTcpSocket(createSocket, createServer);
                wasiSocketsDebug("sockOpen tcp 2 :");
                const resultFd = this.openFiles.add(sock);
                wasiSocketsDebug("sockOpen tcp 3 :");
                Fd.set(this.buffer, result_ptr, resultFd);
                wasiSocketsDebug("SOCKET_STREAM: resultFd: ", resultFd);
                return ErrnoN.SUCCESS;
            } else {
                const wsImpl = await import("./net_wsproxy.js");
                const createSocket = wsImpl.createNodeTcpSocket;
                const createServer = wsImpl.createNodeTcpServer;
                wasiSocketsDebug("sockOpen tcp 1 :");
                const sock = new NetTcpSocket(createSocket, createServer);
                wasiSocketsDebug("sockOpen tcp 2 :");
                const resultFd = this.openFiles.add(sock);
                wasiSocketsDebug("sockOpen tcp 3 :");
                Fd.set(this.buffer, result_ptr, resultFd);
                wasiSocketsDebug("SOCKET_STREAM: resultFd: ", resultFd);
                return ErrnoN.SUCCESS;
            }
        } else if (socktype == SockTypeN.SOCKET_DGRAM) {
            wasiSocketsDebug("sockOpen udp 1 :");
            if (detectNode()) {
                let sock: WasiSocket;
                switch (af) {
                    case AddressFamilyN.INET_4:
                        sock = new NetUdpSocket("udp4");
                    case AddressFamilyN.INET_6:
                        sock = new NetUdpSocket("udp6");
                }
                const resultFd = this.openFiles.add(sock);
                Fd.set(this.buffer, result_ptr, resultFd);
                wasiSocketsDebug("SOCKET_DGRAM: resultFd: ", resultFd);
                return ErrnoN.SUCCESS;
            } else {
                // Not supported on other platforms than node
                return ErrnoN.NOSYS;
            }
        } else {
            return ErrnoN.INVAL;
        }
    }
    async sockClose(fd: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockClose:");
        //const sock = this.getSocket(fd);
        try {
            this.openFiles.close(fd);
        } catch (err: any) {
            wasiSocketsDebug("close() error: ", err);
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
    async sockBind(
        fd: number,
        addr: mutptr<
            | {
                  tag: AddrTypeN.IP_4;
                  data: {
                      addr: { n_0: number; n_1: number; h_0: number; h_1: number };
                      port: number;
                  };
              }
            | {
                  tag: AddrTypeN.IP_6;
                  data: {
                      addr: {
                          n_0: number;
                          n_1: number;
                          n_2: number;
                          n_3: number;
                          h_0: number;
                          h_1: number;
                          h_2: number;
                          h_3: number;
                      };
                      port: number;
                  };
              }
        >
    ): Promise<ErrnoN> {
        wasiSocketsDebug("sockBind:");
        const addrval = Addr.get(this.buffer, addr);
        const addrInfo = WasiAddrtoAddressInfo(addrval);
        const sock = this.getSocket(fd);
        await sock.bind(addrInfo);
        return ErrnoN.SUCCESS;
    }
    async sockListen(fd: number, backlog: number): Promise<ErrnoN> {
        wasiSocketsDebug("sockListen: fd: ", fd);
        const sock = this.getSocket(fd);
        await sock.listen(backlog);
        return ErrnoN.SUCCESS;
    }
    async sockAccept(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiSocketsDebug("sockAccept:");
        const sock = this.getSocket(fd);
        const clientSock = await sock.getAcceptedSocket();
        const resultFd = this.openFiles.add(clientSock);
        Fd.set(this.buffer, result_ptr, resultFd);
        wasiSocketsDebug("sockAccept: accept: resultFd: ", resultFd);
        return ErrnoN.SUCCESS;
    }
    async sockConnect(
        fd: number,
        addr: mutptr<
            | {
                  tag: AddrTypeN.IP_4;
                  data: {
                      addr: { n_0: number; n_1: number; h_0: number; h_1: number };
                      port: number;
                  };
              }
            | {
                  tag: AddrTypeN.IP_6;
                  data: {
                      addr: {
                          n_0: number;
                          n_1: number;
                          n_2: number;
                          n_3: number;
                          h_0: number;
                          h_1: number;
                          h_2: number;
                          h_3: number;
                      };
                      port: number;
                  };
              }
        >
    ): Promise<ErrnoN> {
        wasiSocketsDebug("sockConnect:");
        const sock = this.getSocket(fd);
        const addrval = Addr.get(this.buffer, addr);
        const addrInfo = WasiAddrtoAddressInfo(addrval);
        wasiSocketsDebug("sockConnect: addrInfo: ", addrInfo);
        await sock.connect(addrInfo.address, addrInfo.port);
        return ErrnoN.SUCCESS;
    }
    async sockRecv(
        fd: number,
        buf: mutptr<number>,
        buf_len: number,
        flags: number,
        result_ptr: mutptr<number>
    ): Promise<ErrnoN> {
        wasiSocketsDebug("sockRecv:");
        const sock = this.getSocket(fd);
        const read_len = buf_len;
        const ret = await sock.read(read_len);
        const readbuf = new Uint8Array(this.buffer, buf, buf_len);
        readbuf.set(ret);
        Size.set(this.buffer, result_ptr, read_len);
        return ErrnoN.SUCCESS;
    }
    async sockRecvFrom(
        fd: number,
        buf: mutptr<number>,
        buf_len: number,
        addr_buf: mutptr<number>,
        addr_buf_len: number,
        flags: number,
        result_ptr: mutptr<number>
    ): Promise<ErrnoN> {
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
    async sockSend(
        fd: number,
        buf: mutptr<number>,
        buf_len: number,
        flags: number,
        result_ptr: mutptr<number>
    ): Promise<ErrnoN> {
        wasiSocketsDebug("sockSend:");
        const sock = this.getSocket(fd);
        const read_len = buf_len;
        const writebuf = new Uint8Array(this.buffer, buf, buf_len);
        await sock.write(writebuf);
        Size.set(this.buffer, result_ptr, read_len);
        return ErrnoN.SUCCESS;
    }
    async sockSendTo(
        fd: number,
        buf: mutptr<number>,
        buf_len: number,
        addr: mutptr<
            | {
                  tag: AddrTypeN.IP_4;
                  data: {
                      addr: { n_0: number; n_1: number; h_0: number; h_1: number };
                      port: number;
                  };
              }
            | {
                  tag: AddrTypeN.IP_6;
                  data: {
                      addr: {
                          n_0: number;
                          n_1: number;
                          n_2: number;
                          n_3: number;
                          h_0: number;
                          h_1: number;
                          h_2: number;
                          h_3: number;
                      };
                      port: number;
                  };
              }
        >,
        flags: number,
        result_ptr: mutptr<number>
    ): Promise<ErrnoN> {
        wasiSocketsDebug("sockSendTo:");
        if (addr) {
            this.sockConnect(fd, addr);
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
    };

    addWasiExperimentalSocketsToImports(imports, wHost, handler);
}
