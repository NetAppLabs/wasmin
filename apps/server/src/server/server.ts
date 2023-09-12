import { DEFAULT_REST_PORT, DEFAULT_RPC_PORT } from "./defaults.js";
import { isBun, isNode } from "./util.js";

export async function startRpcServer(rpcPort = DEFAULT_RPC_PORT) {
    if (isNode()) {
        const nodeServer = await import("./node_server.js");
        await nodeServer.startRpcServerNode(rpcPort);
    } else if (isBun()) {
        const bunServer = await import("./bun_server.js");
        await bunServer.startRpcServerBun(rpcPort);
    }
}

export async function startRestServer(restPort = DEFAULT_REST_PORT) {
    if (isNode()) {
        const nodeServer = await import("./node_server.js");
        await nodeServer.startRestServerNode(restPort);
    } else if (isBun()) {
        const bunServer = await import("./bun_server.js");
        await bunServer.startRestServerBun(restPort);
    }
}
