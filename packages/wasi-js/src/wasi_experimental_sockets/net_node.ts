import { default as net } from "node:net";
import { AddressInfo, NodeNetTcpServer, NodeNetTcpSocket } from "./common";

//import { default as dgram } from "node:dgram";
//import { default as dns } from "node:dns";

export function createNodeTcpSocket(): NodeNetTcpSocket {
    const nodeSock = new net.Socket();
    return nodeSock as NodeNetTcpSocket;
}

export function createNodeTcpServer(): NodeNetTcpServer {
    const nodeServer = net.createServer();
    return nodeServer as NodeNetTcpServer;
}

export async function addrResolve(hostname: string, port: number): Promise<AddressInfo[]> {
    const addrInfos: AddressInfo[] = [];
    // TODO figure out why require is needed here, import does not seem to work
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dns = require("node:dns");
    // @ts-ignore
    const options: dns.LookupAllOptions = {
        all: true,
    };
    const dnsPromises = dns.promises;

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
        addrInfos.push(addrInfo);
    }
    return addrInfos;
}