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

import { default as net } from "node:net";
import {
    AddressFamily,
    AddressInfo,
    NodeNetTcpServer,
    NodeNetTcpSocket,
    NodeNetUdpSocket,
} from "./common.js";

import { default as dgram } from "node:dgram";
import { default as dns } from "node:dns";
import { promises as dnsPromises } from "node:dns";
import { wasiSocketsDebug } from "../wasiDebug.js";

export function createNodeTcpSocket(): NodeNetTcpSocket {
    const nodeSock = new net.Socket();
    return nodeSock as NodeNetTcpSocket;
}

export function createNodeTcpServer(): NodeNetTcpServer {
    const nodeServer = net.createServer();
    return nodeServer as NodeNetTcpServer;
}

export function createNodeUdpSocket(family: AddressFamily): NodeNetUdpSocket {
    let sockType: dgram.SocketType = "udp4";
    if (family == "IPv4") {
        sockType = "udp4";
    } else if (family == "IPv6") {
        sockType = "udp6";
    }
    const nodeSock = dgram.createSocket(sockType);
    return nodeSock as NodeNetUdpSocket;
}

export async function addrResolve(hostname: string, port: number): Promise<AddressInfo[]> {
    const addrInfos: AddressInfo[] = [];

    const options: dns.LookupAllOptions = {
        all: true,
    };

    const dnsResponses = await dnsPromises.lookup(hostname, options);
    for (const dnsresp of dnsResponses) {
        const addr = dnsresp.address;
        let family: AddressFamily = "IPv4";
        if (dnsresp.family == 6) {
            family = "IPv6";
        }
        const addrInfo: AddressInfo = {
            address: addr,
            family: family,
            port: port,
        };
        wasiSocketsDebug("addrInfos.push(addrInfo):", addrInfo);
        addrInfos.push(addrInfo);
    }
    return addrInfos;
}
