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

/* eslint-disable @typescript-eslint/no-unused-vars */

import { SystemError } from "../errors.js";
import {
    string,
    ErrnoN,
    Fd,
    mutptr,
    ptr,
    Size,
    WasiSnapshotPreview1SocketsAsync,
    addWasiSnapshotPreview1SocketsToImports,
    AddressFamilyN,
    SockOptLevelN,
    SockOptSoN,
    SockTypeN,
    AddressFamily,
    SockType,
    Address,
    Addrinfo,
    u32,
} from "./bindings.js";
import { Iovec, usize } from "./bindings.js";
import {
    forEachIoVec,
    translateErrorToErrorno,
} from "../wasiPreview1Utils.js";
import { wasiCallDebug, wasiSocketsDebug } from "../wasiDebug.js";
import { WasiEnv } from "../wasi.js";
import { WasiSocket } from "../wasi_experimental_sockets/common.js";
import { isNode, isNodeorBunorDeno } from "../utils.js";
import { createTcpSocket, createUdpSocket, getAddressResolver } from "../wasi_experimental_sockets/net.js";
import { WasiSocketsAddrtoAddressInfo, WriteAddressInfoToAddrinfo, WriteAddressInfoToSockAddrV2, addrFamilyNoToAddrFamily } from "./utils.js";

export function initializeWasiSnapshotPreview1SocketsAsyncToImports(
    imports: any,
    get_export: (name: string) => WebAssembly.ExportValue,
    wasiEnv: WasiEnv
) {
    const wHost = new WasiSnapshotPreview1SocketsAsyncHost(wasiEnv);
    const errorHandler: (err: any) => number = function (err: any) {
        return translateErrorToErrorno(err);
    };
    wHost._get_exports_func = get_export;
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
    addWasiSnapshotPreview1SocketsToImports(imports, wHost, handler);
}

export class WasiSnapshotPreview1SocketsAsyncHost implements WasiSnapshotPreview1SocketsAsync {
    constructor(wasiEnv: WasiEnv, get_export?: (name: string) => WebAssembly.ExportValue) {
        this._wasiEnv = wasiEnv;
        this._get_exports_func = get_export;
        this._isNode = isNode();
    }
    public _get_exports_func?: (name: string) => WebAssembly.ExportValue;
    private _wasiEnv: WasiEnv;
    private _isNode: boolean;

    get wasiEnv() {
        return this._wasiEnv;
    }
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
    get cargs() {
        return this.wasiEnv.cargs;
    }
    get cenv() {
        return this.wasiEnv.cenv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    get abortSignal() {
        return this.wasiEnv.abortSignal;
    }
    get isNode() {
        return this._isNode;
    }
    checkAbort(): void {
        if (this.abortSignal) {
            if (this.abortSignal?.aborted) {
                throw new SystemError(ErrnoN.CANCELED);
            }
        }
    }
    delay(ms: number) {
        return new Promise((resolve, reject) => {
            const abortListener = () => {
                clearTimeout(id);
                reject(new SystemError(ErrnoN.CANCELED));
            };
            const onResolve = (value: unknown) => {
                this.abortSignal?.removeEventListener("abort", abortListener);
                resolve(value);
            };
            const id = setTimeout(onResolve, ms);
            this.abortSignal?.addEventListener("abort", abortListener);
        });
    }
    getSocket(fd: number): WasiSocket {
        const res = this.openFiles.get(fd);
        return res as WasiSocket;
    }
    async sockOpen(af: AddressFamily, socktype: SockType, fd: mutptr<Fd>): Promise<ErrnoN> {
        wasiCallDebug("[sock_open] af:", af, "sock_type:", socktype);
        wasiSocketsDebug("[sock_open]:  af: ", af);
        wasiSocketsDebug("[sock_open]:  sockType: ", socktype);
        if (socktype == SockTypeN.SOCK_STREAM) {
            const addrFamily = addrFamilyNoToAddrFamily(af);
            const sock = await createTcpSocket(addrFamily);
            const resultFd = this.openFiles.add(sock);
            wasiSocketsDebug("[sock_open] tcp 3 :");
            Fd.set(this.buffer, fd, resultFd);
            wasiSocketsDebug("SOCKET_STREAM: resultFd: ", resultFd);
            wasiCallDebug("[sock_open] SOCKET_STREAM returning fd:", resultFd);
            return ErrnoN.SUCCESS;
        } else if (socktype == SockTypeN.SOCK_DGRAM) {
            wasiSocketsDebug("[sock_open] udp 1 :");
            if (isNodeorBunorDeno()) {
                let sock: WasiSocket | undefined = undefined;
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
                if (sock) {
                    const resultFd = this.openFiles.add(sock);
                    Fd.set(this.buffer, fd, resultFd);
                    wasiSocketsDebug("[sock_open] SOCKET_DGRAM: resultFd: ", resultFd);
                    return ErrnoN.SUCCESS;
                } else {
                    return ErrnoN.BADF;
                }
            } else {
                // Not supported on other platforms than node
                return ErrnoN.NOSYS;
            }
        } else {
            return ErrnoN.INVAL;
        }
    }
    async sockBind(fd: number, addr: mutptr<Address>, port: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_bind] fd:", fd, "addr:", addr);
        const wasiAddr = Address.get(this.buffer, addr);
        const addr_array = new Uint8Array(this.buffer, wasiAddr.buf, wasiAddr.buf_len);
        const addrInfo = WasiSocketsAddrtoAddressInfo(addr_array);
        addrInfo.port = port;
        wasiSocketsDebug("[sock_bind] addrInfo:", addrInfo);
        const sock = this.getSocket(fd);
        await sock.bind(addrInfo);
        return ErrnoN.SUCCESS;
    }
    async sockConnect(fd: number, addr: mutptr<Address>, port: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_connect] fd:", fd, " addr:", addr);
        const sock = this.getSocket(fd);
        const wasiAddr = Address.get(this.buffer, addr);
        const addr_array = new Uint8Array(this.buffer, wasiAddr.buf, wasiAddr.buf_len);
        const addrInfo = WasiSocketsAddrtoAddressInfo(addr_array);
        addrInfo.port = port;
        wasiSocketsDebug("sockConnect: addrInfo: ", addrInfo);
        await sock.connect(addrInfo.address, addrInfo.port);
        return ErrnoN.SUCCESS;
    }
    async sockRecvFrom(fd: number, buf: mutptr<number>, buf_len: number, addr_ptr: mutptr<Address>, flags: number, port: mutptr<number>, nread: mutptr<number>, oflags: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_recv_from] fd:", fd);
        const sock = this.getSocket(fd);
        const iovs_ptr = buf as unknown as ptr<Iovec>;
        const iovs_len = buf_len as usize;
        const result_ptr = nread;
        await forEachIoVec(
            this.buffer,
            iovs_ptr,
            iovs_len,
            result_ptr,
            async (buf) => {
                const bufLen = buf.length;
                const read_chunk = await sock.readFrom(bufLen);
                const read_buf = read_chunk.buf;
                const read_buf_len = read_buf.length;
                wasiSocketsDebug("[sock_recv_from] fd:", fd, " received buf with length: ", read_buf_len);
                const read_addr = read_chunk.rinfo;
                const read_port = read_addr.port;
                Size.set(this.buffer, port, read_port);
                const addr = Address.get(this.buffer, addr_ptr);
                const chunk = read_buf;
                WriteAddressInfoToSockAddrV2(this.buffer, read_addr, addr);
                buf.set(chunk);
                return chunk.length;
            },
            () => {
                this.checkAbort();
            }
        );
        return ErrnoN.SUCCESS;
    }
    async sockSendTo(fd: number, buf: mutptr<number>, buf_len: number, addr: mutptr<Address>, port: number, flags: number, nwritten: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_send_to] fd:", fd, " address:", addr);
        const wasiAddr = Address.get(this.buffer, addr);
        wasiSocketsDebug("[sock_send_to] wasiAddr:", wasiAddr);
        const iovs_ptr = buf as unknown as ptr<Iovec>;
        const iovs_len = buf_len;
        const result_ptr = nwritten;
        await forEachIoVec(
            this.buffer,
            iovs_ptr,
            iovs_len,
            result_ptr,
            async (buf) => {
                const bufLen = buf.length;
                const addr_array = new Uint8Array(this.buffer, wasiAddr.buf, wasiAddr.buf_len);
                const addrInfo = WasiSocketsAddrtoAddressInfo(addr_array);
                addrInfo.port = port;
                wasiSocketsDebug("[sock_send_to] addrInfo:", addrInfo);
                const sock = this.getSocket(fd);
                const read_len = buf_len;
                await sock.writeTo(buf, addrInfo);
                Size.set(this.buffer, nwritten, read_len);

                const chunk = buf;
                return chunk.length;
            },
            () => {
                this.checkAbort();
            });
        return ErrnoN.SUCCESS;
    }
    async sockGetlocaladdr(fd: number, addr_ptr: mutptr<Address>, port: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_addr_local] fd:", fd);
        const sock = this.getSocket(fd);
        const gotaddr = await sock.address();
        const gotport = gotaddr.port;
        wasiSocketsDebug("[sock_addr_local] addr:", gotaddr);
        const addr = Address.get(this.buffer, addr_ptr);
        const addr_buf_len = addr.buf_len;
        wasiSocketsDebug("[sock_addr_local] addr_buf_len: ", addr_buf_len);
        WriteAddressInfoToSockAddrV2(this.buffer, gotaddr, addr);
        Size.set(this.buffer, port, gotport);
        return ErrnoN.SUCCESS;
    }
    async sockGetpeeraddr(fd: number, addr_ptr: mutptr<Address>, port: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_addr_remote] fd:", fd);
        const sock = this.getSocket(fd);
        const gotaddr = await sock.remoteAddress();
        const gotport = gotaddr.port;
        wasiSocketsDebug("[sock_addr_remote] addr: ", gotaddr);
        const addr = Address.get(this.buffer, addr_ptr);
        const addr_buf_len = addr.buf_len;
        wasiSocketsDebug("[sock_addr_remote] addr_buf_len: ", addr_buf_len);
        WriteAddressInfoToSockAddrV2(this.buffer, gotaddr, addr);
        Size.set(this.buffer, port, gotport);

        wasiSocketsDebug("sock_addr_remote: returning");
        return ErrnoN.SUCCESS;
    }
    async sockSetsockopt(fd: number, level: SockOptLevelN, name: SockOptSoN, value: number, value_len: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_setsockopt] fd:", fd);
        wasiSocketsDebug("[sock_setsockopt] fd:", fd);
        // TODO implement
        return ErrnoN.SUCCESS;
    }
    async sockGetsockopt(fd: number, level: SockOptLevelN, name: SockOptSoN, value: number, value_len: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_getsockopt] fd:", fd);
        wasiSocketsDebug("[sock_getsockopt] fd:", fd);
        // TODO implement
        return ErrnoN.SUCCESS;
    }
    async sockListen(fd: number, backlog: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_listen] fd:", fd);
        wasiSocketsDebug("[sock_listen] fd:", fd);
        const sock = this.getSocket(fd);
        await sock.listen(backlog);
        return ErrnoN.SUCCESS;
    }
    async sockGetaddrinfo(node_ptr: ptr<string>, node_len: number, server_ptr: ptr<string>, server_len: number, hint: mutptr<Addrinfo>, res: mutptr<Addrinfo>, max_len: number, res_len: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_get_addr_info]");
        const hostname = string.get(this.buffer, node_ptr, node_len);
        const server = string.get(this.buffer, server_ptr, server_len);
        wasiSocketsDebug(`[sock_get_addr_info] node: '${hostname}' server: '${server}'`);
        const port = parseInt(server, 10);
        const addrResolve = await getAddressResolver();
        if (addrResolve) {
            let numResponses = 0;
            // find the first in the array
            let current_res_ptr = res;
            let current_ai_ptr_view = new DataView(this.buffer)
            // read the pointer value little endian
            let current_ai_ptr = current_ai_ptr_view.getUint32(current_res_ptr, true) as mutptr<Addrinfo>;
            let current_ai = Addrinfo.get(this.buffer, current_ai_ptr);

            const dnsResponses = await addrResolve(hostname, port);
            for (const addrInfo of dnsResponses) {
                if (numResponses < max_len) {
                    wasiSocketsDebug("[addr_resolve] addrInfo: ", addrInfo);
                    WriteAddressInfoToAddrinfo(this.buffer, addrInfo, current_ai);
                    const next_ai_ptr = current_ai.ai_next;
                    numResponses++;
                }
            }
            u32.set(this.buffer, res_len, numResponses);
            return ErrnoN.SUCCESS;
        }
        return ErrnoN.NOSYS;
    }

}
