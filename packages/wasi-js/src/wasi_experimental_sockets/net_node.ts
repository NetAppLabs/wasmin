import { default as net } from "node:net";
import {
    AddressFamily,
    AddressInfo,
    NodeNetTcpServer,
    NodeNetTcpSocket,
    NodeNetUdpSocket,
    wasiSocketsDebug,
} from "./common.js";

import { default as dgram } from "node:dgram";
import { default as dns } from "node:dns";
import { promises as dnsPromises } from "node:dns";

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
