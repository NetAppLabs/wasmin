import { default as net } from "node:net";
import { NodeNetTcpServer, NodeNetTcpSocket } from "./wasi_experimental_sockets_common";


export function createNodeTcpSocket(): NodeNetTcpSocket{
    const nodeSock = new net.Socket();
    return nodeSock as NodeNetTcpSocket;
}

export function createNodeTcpServer(): NodeNetTcpServer{
    const nodeServer = net.createServer();
    return nodeServer as NodeNetTcpServer;
}