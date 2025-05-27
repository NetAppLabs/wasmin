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
import { wasiCallDebug } from "../wasiDebug.js";
import { AddressFamily, AddressInfo, IPv4AddressToArray, IPv6AddressToArray } from "../wasi_experimental_sockets/common.js";
import { ErrnoN, AddressFamily as AddressFamilyNo, AddressFamilyN, Address, Addrinfo, ProtocolN, SockTypeN, AiflagsN, Sockaddr, mutptr, string } from "./bindings.js";
import * as ipaddr from 'ipaddr.js';

export function addrFamilyNoToAddrFamily(afno: AddressFamilyNo): AddressFamily {
    switch (afno) {
        case AddressFamilyN.INET_4:
            return "IPv4";
        case AddressFamilyN.INET_6:
            return "IPv6";
    }
    throw Error("Uknown address family");
}
export type AddressAsUint8Array = Uint8Array;

export function WasiSocketsAddrtoAddressInfo(addr: AddressAsUint8Array): AddressInfo {
    let family: AddressFamily;
    const port = 0;
    let hostAddr: string;
    wasiCallDebug("WasiSocketsAddrtoAddressInfo: addr.length: ", addr.length);
    if (addr.length == 4) {
        family = "IPv4";
        const addrs = Uint8ArrayAddrToTypedArray(addr);
        const ipa = ipaddr.fromByteArray(addrs);
        hostAddr = ipa.toString();
    } else if (addr.length == 16) {
        family = "IPv6";
        const addrs = Uint8ArrayAddrToTypedArray(addr);
        const ipa = ipaddr.fromByteArray(addrs);
        hostAddr = ipa.toString();
    } else if (addr.length == 128) {
        const sin_family = addr[0] as AddressFamilyN;
        if (sin_family == AddressFamilyN.INET_4) {
            family = "IPv4";
            wasiCallDebug("WasiSocketsAddrtoAddressInfo: family ipv4");
            const sockAddrSlice = addr.slice(2,6);
            const addrs = Uint8ArrayAddrToTypedArray(sockAddrSlice);
            const ipa = ipaddr.fromByteArray(addrs);
            hostAddr = ipa.toString();
            wasiCallDebug("WasiSocketsAddrtoAddressInfo: ipv4 hostAddr: ", hostAddr);
        } else if (sin_family == AddressFamilyN.INET_6) {
            family = "IPv6";
            wasiCallDebug("WasiSocketsAddrtoAddressInfo: family ipv6");
            const sockAddrSlice = addr.slice(2,18);
            const addrs = Uint8ArrayAddrToTypedArray(sockAddrSlice);
            const ipa = ipaddr.fromByteArray(addrs);
            hostAddr = ipa.toString();
            wasiCallDebug("WasiSocketsAddrtoAddressInfo: ipv6 hostAddr: ", hostAddr);
        } else {
            throw new SystemError(ErrnoN.AFNOSUPPORT);
        }
    } else {
        throw new SystemError(ErrnoN.AFNOSUPPORT);
    }
    const addrinfo: AddressInfo = {
        address: hostAddr,
        port: port,
        family: family,
    };
    return addrinfo;
}


export function AddressInfoToWasiSocketAddr(addr: AddressInfo): AddressAsUint8Array {
    const address = addr.address;
    // family: 'IPv4' or 'IPv6'
    const family = addr.family;
    const port = addr.port;
    if (family == "IPv4") {
        const addrArray = ipaddr.parse(address).toByteArray();
        const uArr = TypedArrayAddrToUint8Array(addrArray);
        return uArr;
    } else if (family == "IPv6") {
        //const addrArray = IPv6AddressToArray(address);
        const addrArray = ipaddr.parse(address).toByteArray();
        const uArr = TypedArrayAddrToUint8Array(addrArray);
        return uArr;
    }
    throw new Error("AddressInfoToWasiAddr invalid address");
}

export function TypedArrayAddrToUint8Array(addr: number[]): Uint8Array {
    const uarr = new Uint8Array(addr.length);
    let i = 0;
    for (const naddr of addr) {
        uarr[i] = naddr % 256;
        i++;
    }
    return uarr;
}

export function Uint8ArrayAddrToTypedArray(uint8Array: Uint8Array): number[] {
    var array = [];
    for (var i = 0; i < uint8Array.byteLength; i++) {
        array[i] = uint8Array[i];
    }
    return array;
}


export function WriteAddressInfoToSockAddrV2(buffer: ArrayBuffer, addr: AddressInfo, addrToWrite: Address) {
    const wasi_addr = AddressInfoToWasiSocketAddr(addr);

    let sa_family = AddressFamilyN.UNSPEC;
    const family = addr.family;
    const dstAddress = new Uint8Array(buffer, addrToWrite.buf, addrToWrite.buf_len - 2);
    if (family == "IPv4") {
        sa_family = AddressFamilyN.INET_4
    } else if (family == "IPv6") {
        sa_family = AddressFamilyN.INET_6
    }
    dstAddress
    const offset_base = addrToWrite.buf;
    const dv = new DataView(dstAddress.buffer, offset_base);
    //dv.setUint16(0, sa_family);
    dv.setUint8(0, sa_family);
    dstAddress.set(wasi_addr, 2)
}

export function WriteAddressInfoToAddrinfo(buffer: ArrayBuffer, addr: AddressInfo, ai: Addrinfo) {
    const wasi_addr = AddressInfoToWasiSocketAddr(addr);
    const port = addr.port;
    const family = addr.family;
    let addr_len = wasi_addr.length;

    let sa_family = AddressFamilyN.UNSPEC;
    if (family == "IPv4") {
        sa_family = AddressFamilyN.INET_4
    } else if (family == "IPv6") {
        sa_family = AddressFamilyN.INET_6
    }

    ai.ai_flags = AiflagsN.AI_ALL;
    ai.ai_family = sa_family;
    ai.ai_socktype = SockTypeN.SOCK_ANY;
    ai.ai_protocol = ProtocolN.IPPROTO_IP;
    ai.ai_addrlen = addr_len;

    const saddr = Sockaddr.get(buffer, ai.ai_addr as mutptr<Sockaddr>);
    saddr.sa_family = sa_family
    saddr.sa_data_len = addr_len;

    const dstAddress = new Uint8Array(buffer, saddr.sa_data, wasi_addr.length);
    saddr.sa_data_len = addr_len + 2;
    dstAddress.set(wasi_addr, 2);

    function numToUint8Array(num: number) {
        let arr = new Uint8Array(2);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = num % 256;
          num = Math.floor(num / 256);
        }
        return arr;
    }
    const port_array = numToUint8Array(port);
    dstAddress.set(port_array, 0);

    //const charToHex = c => c.charCodeAt().toString(16)
    //const n = BigInt(port.map(charToHex).join(''))
    //Buffer.readUIntBE()
    //dstAddress.set(port, 2);

    // TODO: handle canonical name
    //const canon = string.get(buffer, ai.ai_canonname, ai.ai_canonname_len)
    //const dstCanonName = new Uint8Array(buffer, ai.ai_canonname, ai.ai_canonname_len);
    //dstCanonName.set(real_canon_name);
}

