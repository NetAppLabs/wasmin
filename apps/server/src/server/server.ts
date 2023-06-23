import { DEFAULT_REST_PORT, DEFAULT_RPC_PORT } from "./defaults";
import { isBun, isNode } from "./util";

export async function startRpcServer(rpcPort = DEFAULT_RPC_PORT) {
    if (isNode()) {
        const nodeServer = await import("./node_server");
        nodeServer.startRpcServerNode(rpcPort);
    } else if (isBun()) {
        const bunServer = await import("./bun_server");
        await bunServer.startRpcServerBun(rpcPort);
    }
}

export async function startRestServer(restPort = DEFAULT_REST_PORT) {
    if (isNode()) {
        const nodeServer = await import("./node_server");
        nodeServer.startRestServerNode(restPort);
    } else if (isBun()) {
        const bunServer = await import("./bun_server");
        await bunServer.startRestServerBun(restPort);
    }
}
