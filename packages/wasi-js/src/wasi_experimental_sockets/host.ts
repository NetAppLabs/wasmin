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

import { WasiEnv } from "../wasi.js";
import { translateErrorToErrorno } from "../wasiPreview1Utils.js";
import { isNodeorBunorDeno } from "../utils.js";
import { wasiCallDebug, wasiSocketsDebug } from "../wasiDebug.js";
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
import { AddressInfo, AddressInfoToWasiAddr, WasiSocket, WasiAddrtoAddressInfo } from "./common.js";
import {
    NetTcpSocket,
    NetUdpSocket,
    addrFamilyNoToAddrFamily,
    createTcpSocket,
    createUdpSocket,
    getAddressResolver,
} from "./net.js";

export class WasiExperimentalSocketsAsyncHost implements WasiExperimentalSocketsAsync {
    constructor(wasiEnv: WasiEnv, get_export?: (name: string) => WebAssembly.ExportValue) {
        this._wasiEnv = wasiEnv;
        this._get_exports_func = get_export;
        this._isNode = isNodeorBunorDeno();
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
        const hostname = string.get(this.buffer, host_ptr, host_len);
        wasiCallDebug("[addr_resolve] hostname:", hostname, " port:", port);
        const addrResolve = await getAddressResolver();
        if (addrResolve) {
            let offset = 0;
            const dnsResponses = await addrResolve(hostname, port);
            for (const addrInfo of dnsResponses) {
                wasiSocketsDebug("[addr_resolve] addrInfo: ", addrInfo);
                const wasiAddr = AddressInfoToWasiAddr(addrInfo);
                wasiSocketsDebug("[addr_resolve] wasiAddr: ", wasiAddr);
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
        wasiCallDebug("[sock_addr_local] fd:", fd);
        const sock = this.getSocket(fd);
        const addr = await sock.address();
        wasiCallDebug("[sock_addr_local] addr:", addr);
        const wasiAddr = AddressInfoToWasiAddr(addr);
        const mptr = buf as any as mutptr<Addr>;
        Addr.set(this.buffer, mptr, wasiAddr);
        wasiSocketsDebug("[sock_addr_local] returnign wasi_addr:", wasiAddr);
        return ErrnoN.SUCCESS;
    }
    async sockAddrRemote(fd: number, buf: mutptr<number>, buf_len: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_addr_remote] fd:", fd);
        const sock = this.getSocket(fd);
        //wasiSocketsDebug("sockAddrRemote: sock: ", sock);
        const addr = await sock.remoteAddress();
        wasiCallDebug("[sock_addr_remote] addr: ", addr);
        const wasiAddr = AddressInfoToWasiAddr(addr);
        const mptr = buf as any as mutptr<Addr>;
        Addr.set(this.buffer, mptr, wasiAddr);
        wasiSocketsDebug("sock_addr_remote: returning");
        return ErrnoN.SUCCESS;
    }
    async sockOpen(af: AddressFamily, socktype: SockType, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_open] af:", af, "sock_type:", socktype);
        wasiSocketsDebug("[sock_open]:  af: ", af);
        wasiSocketsDebug("[sock_open]:  sockType: ", socktype);
        if (socktype == SockTypeN.SOCKET_STREAM) {
            const addrFamily = addrFamilyNoToAddrFamily(af);
            const sock = await createTcpSocket(addrFamily);
            const resultFd = this.openFiles.add(sock);
            wasiSocketsDebug("[sock_open] tcp 3 :");
            Fd.set(this.buffer, result_ptr, resultFd);
            wasiSocketsDebug("SOCKET_STREAM: resultFd: ", resultFd);
            wasiCallDebug("[sock_open] SOCKET_STREAM returning fd:", resultFd);
            return ErrnoN.SUCCESS;
        } else if (socktype == SockTypeN.SOCKET_DGRAM) {
            wasiSocketsDebug("[sock_open] udp 1 :");
            if (isNodeorBunorDeno()) {
                let sock: WasiSocket;
                switch (af) {
                    case AddressFamilyN.INET_4:
                        wasiSocketsDebug("[sock_open] udp INET_4:");
                        sock = await createUdpSocket("IPv4");
                        break;
                    case AddressFamilyN.INET_6:
                        wasiSocketsDebug("[sock_open] udp INET_6:");
                        sock = await createUdpSocket("IPv6");
                        break;
                }
                const resultFd = this.openFiles.add(sock);
                Fd.set(this.buffer, result_ptr, resultFd);
                wasiSocketsDebug("[sock_open] SOCKET_DGRAM: resultFd: ", resultFd);
                wasiCallDebug("[sock_open] SOCKET_DGRAM returning fd:", resultFd);
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
        wasiCallDebug("[sock_close] fd:", fd);
        //const sock = this.getSocket(fd);
        try {
            this.openFiles.close(fd);
        } catch (err: any) {
            wasiSocketsDebug("[sock_close] error: ", err);
            return ErrnoN.BUSY;
        }
        return ErrnoN.SUCCESS;
    }
    async sockSetReuseAddr(fd: number, reuse: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_set_reuse_addr] fd:", fd, " reuse:", reuse);
        // Silently ignored for now
        return ErrnoN.SUCCESS;
    }
    async sockGetReuseAddr(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_get_reuse_addr] fd:", fd);
        // Silently ignored for now
        const reuse = 0;
        Fd.set(this.buffer, result_ptr, reuse);
        return ErrnoN.SUCCESS;
    }
    async sockSetReusePort(fd: number, reuse: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_set_reuse_port] fd:", fd);
        throw new Error("Method not implemented.");
    }
    async sockGetReusePort(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_get_reuse_port] fd:", fd);
        throw new Error("Method not implemented.");
    }
    async sockSetRecvBufSize(fd: number, size: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_set_recv_buffer_size] fd:", fd);
        throw new Error("Method not implemented.");
    }
    async sockGetRecvBufSize(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_get_recv_buffer_size] fd:", fd);
        throw new Error("Method not implemented.");
    }
    async sockSetSendBufSize(fd: number, size: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_set_send_buf_size] fd:", fd);
        throw new Error("Method not implemented.");
    }
    async sockGetSendBufSize(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_get_send_buf_size] fd:", fd);
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
        wasiCallDebug("[sock_bind] fd:", fd, "addr:", addr);
        const addrval = Addr.get(this.buffer, addr);
        const addrInfo = WasiAddrtoAddressInfo(addrval);
        const sock = this.getSocket(fd);
        await sock.bind(addrInfo);
        return ErrnoN.SUCCESS;
    }
    async sockListen(fd: number, backlog: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_listen] fd:", fd);
        const sock = this.getSocket(fd);
        await sock.listen(backlog);
        return ErrnoN.SUCCESS;
    }
    async sockAccept(fd: number, result_ptr: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_accept] fd:", fd);
        const sock = this.getSocket(fd);
        const clientSock = await sock.getAcceptedSocket();
        const resultFd = this.openFiles.add(clientSock);
        Fd.set(this.buffer, result_ptr, resultFd);
        wasiSocketsDebug("sockAccept: accept: resultFd: ", resultFd);
        wasiCallDebug("[sock_accept] fd:", fd, " returning fd:", resultFd);
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
        wasiCallDebug("[sock_connect] fd:", fd, " addr:", addr);
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
        wasiCallDebug("[sock_recv] fd:", fd);
        const sock = this.getSocket(fd);
        let read_len = buf_len;
        const ret = await sock.read(read_len);
        read_len = ret.length;
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
        wasiCallDebug("[sock_recv_from] fd:", fd);

        //const addr_ptr = addr_buf as any as mutptr<Addr>;
        //const addr = Addr.get(this.buffer, addr_ptr);
        //wasiCallDebug("[sock_recv_from] addr:", addr);

        /*if (addr_buf && addr_buf_len) {
            const addr_ptr = buf as any as mutptr<Addr>;
            this.sockConnect(fd, addr_ptr);
        }*/
        const sock = this.getSocket(fd);
        let read_len = buf_len;
        const read_chunk = await sock.readFrom(read_len);
        const read_buf = read_chunk.buf;
        const read_addr = read_chunk.rinfo;
        const addr_ptr = addr_buf as any as mutptr<Addr>;
        const wasi_addr = AddressInfoToWasiAddr(read_addr);
        wasiCallDebug("[sock_recv_from] wasi_addr:", wasi_addr);
        Addr.set(this.buffer, addr_ptr, wasi_addr);
        const read_buf_len = read_buf.length;
        const read_buf_return = new Uint8Array(this.buffer, buf, read_buf_len);
        read_buf_return.set(read_buf);
        Size.set(this.buffer, result_ptr, read_buf_len);
        return ErrnoN.SUCCESS;
    }
    async sockSend(
        fd: number,
        buf: mutptr<number>,
        buf_len: number,
        flags: number,
        result_ptr: mutptr<number>
    ): Promise<ErrnoN> {
        wasiCallDebug("[sock_send] fd:", fd);
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
        wasiCallDebug("[sock_send_to] fd:", fd, " address:", addr);
        const wasiAddr = Addr.get(this.buffer, addr);
        wasiCallDebug("[sock_send_to] wasiAddr:", wasiAddr);
        const addrInfo = WasiAddrtoAddressInfo(wasiAddr);
        wasiCallDebug("[sock_send_to] addrInfo:", addrInfo);

        const sock = this.getSocket(fd);
        const read_len = buf_len;
        const writebuf = new Uint8Array(this.buffer, buf, buf_len);
        await sock.writeTo(writebuf, addrInfo);
        Size.set(this.buffer, result_ptr, read_len);
        return ErrnoN.SUCCESS;
    }
    async sockShutdown(fd: number, how: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_shutdown] fd:", fd);
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

    let experimentalSocketsNs = "wasi_experimental_sockets";
    addWasiExperimentalSocketsToImports(experimentalSocketsNs, imports, wHost, handler);
}
