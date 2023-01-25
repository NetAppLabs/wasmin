
import { Socket } from './shim/net_shim';
import { NodeNetTcpServer, NodeNetTcpSocket } from "./wasi_experimental_sockets_common";


export function createNodeTcpSocket(): NodeNetTcpSocket{
    const nodeSock = new Socket();
    return nodeSock as NodeNetTcpSocket;
}

export function createNodeTcpServer(): NodeNetTcpServer{
    throw new Error("createNodeTcpServer not implemented for wsproxy");
}