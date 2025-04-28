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

import { Socket } from "../vendored/serverless/net_shim.js";
import { AddressFamily, AddressInfo, NodeNetTcpServer, NodeNetTcpSocket } from "./common.js";

export function createNodeTcpSocket(): NodeNetTcpSocket {
    const wsSocket = new Socket();
    return wsSocket as NodeNetTcpSocket;
}

export function createNodeTcpServer(): NodeNetTcpServer {
    throw new Error("createNodeTcpServer not implemented for wsproxy");
}

export async function addrResolve(hostname: string, port: number): Promise<AddressInfo[]> {
    return await cloudflareResolve(hostname, port);
}

export async function cloudflareResolve(hostname: string, port: number): Promise<AddressInfo[]> {
    const aInfos: AddressInfo[] = [];
    // doing to requests for ipv4 and ipv6
    // find out way to do it in one
    const resp = await fetch(`https://1.1.1.1/dns-query?name=${hostname}&type=A`, {
        method: "GET",
        headers: {
            Accept: "application/dns-json",
        },
    });

    const data = await resp.json();
    if (data.Answer) {
        const answers = data.Answer;
        for (const aRecord of answers) {
            const type = aRecord.type;
            let family: AddressFamily = "IPv4";
            if (type == 28) {
                family = "IPv6";
            }
            const ip = aRecord.data;
            const aInfo: AddressInfo = {
                address: ip,
                port: port,
                family: family,
            };
            aInfos.push(aInfo);
        }
    }

    const respv6 = await fetch(`https://1.1.1.1/dns-query?name=${hostname}&type=AAAA`, {
        method: "GET",
        headers: {
            Accept: "application/dns-json",
        },
    });

    const datav6 = await respv6.json();
    if (datav6.Answer) {
        const answers = datav6.Answer;
        for (const aRecord of answers) {
            const type = aRecord.type;
            let family: AddressFamily = "IPv4";
            if (type == 28) {
                family = "IPv6";
            }
            const ip = aRecord.data;
            const aInfo: AddressInfo = {
                address: ip,
                port: port,
                family: family,
            };
            aInfos.push(aInfo);
        }
    }

    return aInfos;
}
