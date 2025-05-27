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
import { FIRST_PREOPEN_FD, OpenFile, FileOrDir, OpenDirectory, Peekable } from "../wasiFileSystem.js";
import { unimplemented } from "../wasiPreview1Utils.js";
import {
    u64,
    string,
    ClockidN,
    Errno,
    ErrnoN,
    EventtypeN,
    Fd,
    FdflagsN,
    FiletypeN,
    mutptr,
    PreopentypeN,
    ptr,
    Size,
    SubclockflagsN,
    Timestamp,
    u8,
    WasiSnapshotPreview1SocketsAsync,
    WhenceN,
    Rights,
    Prestat,
    Ciovec,
    Dircookie,
    Dirent,
    Filedelta,
    Whence,
    OflagsN,
    Lookupflags,
    Oflags,
    Subscription,
    Riflags,
    Siflags,
    Roflags,
    Sdflags,
    Signal,
    Advice,
    Exitcode,
    addWasiSnapshotPreview1SocketsToImports,
    RightsN,
    FstflagsN,
    AddressFamilyN,
    ProtocolN,
    SockOptLevelN,
    SockOptSoN,
    SockTypeN,
    AddressFamily,
    SockType,
    Address,
    Addrinfo,
    u32,
} from "./bindings.js";
import { Event, Fdstat, Fdflags, Filestat, Filesize, Iovec, usize, Fstflags } from "./bindings.js";
import {
    populateFileStat,
    forEachIoVec,
    ExitStatus,
    RIGHTS_STDIN_BASE,
    RIGHTS_STDOUT_BASE,
    RIGHTS_FILE_BASE,
    RIGHTS_DIRECTORY_BASE,
    RIGHTS_DIRECTORY_INHERITING,
    translateErrorToErrorno,
} from "../wasiPreview1Utils.js";
import { wasiCallDebug, wasiPreview1Debug, wasiPreview1FdDebug, wasiSocketsDebug, wasiWarn } from "../wasiDebug.js";
import { WasiEnv } from "../wasi.js";
import { WasiSocket } from "../wasi_experimental_sockets/common.js";
import { isNode, isNodeorBunorDeno } from "../utils.js";
import { createTcpSocket, createUdpSocket, getAddressResolver } from "../wasi_experimental_sockets/net.js";
import { AddressInfoToWasiSocketAddr, WasiSocketsAddrtoAddressInfo, WriteAddressInfoToAddrinfo, WriteAddressInfoToSockAddrV2, addrFamilyNoToAddrFamily } from "./utils.js";

export function initializeWasiSnapshotPreview1SocketsAsyncToImports(
    imports: any,
    get_export: (name: string) => WebAssembly.ExportValue,
    wasiEnv: WasiEnv
) {
    //const memory = get_export("memory") as WebAssembly.Memory;
    const wHost = new WasiSnapshotPreview1SocketsAsyncHost(wasiEnv);
    const errorHandler: (err: any) => number = function (err: any) {
        return translateErrorToErrorno(err);
    };
    //const errorHandler = new ErrorHandlerTranslator();
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
                let sock: WasiSocket|undefined = undefined;
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
                    wasiCallDebug("[sock_open] SOCKET_DGRAM returning fd:", resultFd);
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
        wasiCallDebug("[sock_bind] addrInfo:", addrInfo);
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
        wasiCallDebug("sockConnect: addrInfo: ", addrInfo);
        await sock.connect(addrInfo.address, addrInfo.port);
        return ErrnoN.SUCCESS;
    }
    async sockRecvFrom(fd: number, buf: mutptr<number>, buf_len: number, addr_ptr: mutptr<Address>, flags: number, port: mutptr<number>, nread: mutptr<number>, oflags: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_recv_from] fd:", fd);
        const sock = this.getSocket(fd);
        let read_len = buf_len;
        const read_chunk = await sock.readFrom(read_len);
        const read_buf = read_chunk.buf;
        const read_buf_len = read_buf.length;
        const read_addr = read_chunk.rinfo;
        const read_port = read_addr.port;
        //const addr_ptr = addr as any as mutptr<Address>;
        const wasi_addr = AddressInfoToWasiSocketAddr(read_addr);
        wasiCallDebug("[sock_recv_from] wasi_addr:", wasi_addr, "port: ", read_port, "read_buf_len: ", read_buf_len);
        
        const addr = Address.get(this.buffer, addr_ptr);
        const dstAddress = new Uint8Array(this.buffer, addr.buf, wasi_addr.length);
        addr.buf_len = wasi_addr.length;
        dstAddress.set(wasi_addr);
        Size.set(this.buffer, port, read_port);

        const read_buf_return = new Uint8Array(this.buffer, buf, read_buf_len);
        read_buf_return.set(read_buf);
        Size.set(this.buffer, nread, read_buf_len);
        return ErrnoN.SUCCESS;
    }
    async sockSendTo(fd: number, buf: mutptr<number>, buf_len: number, addr: mutptr<Address>, port: number, flags: number, nwritten: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_send_to] fd:", fd, " address:", addr);
        const wasiAddr = Address.get(this.buffer, addr);
        wasiCallDebug("[sock_send_to] wasiAddr:", wasiAddr);

        const addr_array = new Uint8Array(this.buffer, wasiAddr.buf, wasiAddr.buf_len);
        const addrInfo = WasiSocketsAddrtoAddressInfo(addr_array);
        addrInfo.port = port;
        wasiCallDebug("[sock_send_to] addrInfo:", addrInfo);

        const sock = this.getSocket(fd);
        const read_len = buf_len;
        const writebuf = new Uint8Array(this.buffer, buf, buf_len);
        await sock.writeTo(writebuf, addrInfo);
        Size.set(this.buffer, nwritten, read_len);
        return ErrnoN.SUCCESS;
    }
    async sockGetlocaladdr(fd: number, addr_ptr: mutptr<Address>, port: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_addr_local] fd:", fd);
        const sock = this.getSocket(fd);
        const gotaddr = await sock.address();
        const gotport = gotaddr.port;
        wasiCallDebug("[sock_addr_local] addr:", gotaddr);
        //const wasi_addr = AddressInfoToWasiSocketAddr(gotaddr);
        const addr = Address.get(this.buffer, addr_ptr);
        const addr_buf_len = addr.buf_len;
        wasiCallDebug("[sock_addr_local] addr_buf_len: ", addr_buf_len);
        WriteAddressInfoToSockAddrV2(this.buffer, gotaddr, addr);
        Size.set(this.buffer, port, gotport);

        //const dstAddress = new Uint8Array(this.buffer, addr.buf, wasi_addr.length);
        //addr.buf_len = wasi_addr.length;
        //dstAddress.set(wasi_addr);

        return ErrnoN.SUCCESS;
    }
    async sockGetpeeraddr(fd: number, addr_ptr: mutptr<Address>, port: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_addr_remote] fd:", fd);
        const sock = this.getSocket(fd);
        //wasiSocketsDebug("sockAddrRemote: sock: ", sock);
        const gotaddr = await sock.remoteAddress();
        const gotport = gotaddr.port;
        wasiCallDebug("[sock_addr_remote] addr: ", gotaddr);
        const addr = Address.get(this.buffer, addr_ptr);
        const addr_buf_len = addr.buf_len;
        wasiCallDebug("[sock_addr_remote] addr_buf_len: ", addr_buf_len);
        WriteAddressInfoToSockAddrV2(this.buffer, gotaddr, addr);
        Size.set(this.buffer, port, gotport);

        wasiSocketsDebug("sock_addr_remote: returning");
        return ErrnoN.SUCCESS;
    }
    async sockSetsockopt(fd: number, level: SockOptLevelN, name: SockOptSoN, value: number, value_len: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_setsockopt] fd:", fd);
        // TODO implement
        return ErrnoN.SUCCESS;
    }
    async sockGetsockopt(fd: number, level: SockOptLevelN, name: SockOptSoN, value: number, value_len: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_getsockopt] fd:", fd);
        // TODO implement
        return ErrnoN.SUCCESS;
    }
    async sockListen(fd: number, backlog: number): Promise<ErrnoN> {
        wasiCallDebug("[sock_listen] fd:", fd);
        const sock = this.getSocket(fd);
        await sock.listen(backlog);
        return ErrnoN.SUCCESS;
    }
    async sockGetaddrinfo(node_ptr: ptr<string>, node_len: number, server_ptr: ptr<string>, server_len: number, hint: mutptr<Addrinfo>, res: mutptr<Addrinfo>, max_len: number, res_len: mutptr<number>): Promise<ErrnoN> {
        wasiCallDebug("[sock_get_addr_info]");
        const hostname = string.get(this.buffer, node_ptr, node_len);
        const server = string.get(this.buffer, server_ptr, server_len);
        wasiCallDebug(`[sock_get_addr_info] node: '${hostname}' server: '${server}'`);
        const port = Number(server);
        const addrResolve = await getAddressResolver();
        if (addrResolve) {
            let numResponses = 0;
            let current_ai = Addrinfo.get(this.buffer, res);
            const dnsResponses = await addrResolve(hostname, port);
            for (const addrInfo of dnsResponses) {
                if (numResponses < max_len) {
                    wasiSocketsDebug("[addr_resolve] addrInfo: ", addrInfo);
                    WriteAddressInfoToAddrinfo(this.buffer, addrInfo, current_ai);
                    const next_ai_ptr = current_ai.ai_next;
                    current_ai = Addrinfo.get(this.buffer, next_ai_ptr as mutptr<Addrinfo>);
                    numResponses++;
                }
            }
            u32.set(this.buffer, res_len, numResponses);
            return ErrnoN.SUCCESS;
        }
        return ErrnoN.NOSYS;
    }

}
