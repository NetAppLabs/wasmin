import { DEFAULT_REST_PORT, DEFAULT_RPC_PORT } from "./defaults";
import { DiscoveryManagerInstance } from "./discovery";
import { HostManagerInstance } from "./host";
import { Logger } from "./log";
import http from 'http';
import { createOpenApiHttpHandler } from 'trpc-openapi';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http'
import { CreateHTTPContextOptions, createHTTPServer, createHTTPHandler } from '@trpc/server/adapters/standalone';


export async function startRpcServerBun(rpcPort = DEFAULT_RPC_PORT) {
    Logger.log('RPC Listening on port ' + rpcPort);
    const liveReloadImport = await import('bun-livereload');
    const liveReload = liveReloadImport.liveReload;

    const { appRouter } = await import('./router')

    const trpcHandler = liveReload(createHTTPHandler({
        router: appRouter,
        createContext: () => ({}),
    }));

    // create and listen to the server handler
    const server = http.createServer((req, res) => {
        // enable CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            return res.end();
        }
        trpcHandler(req, res);
    });

    const selfHost = HostManagerInstance.self;
    selfHost.port = rpcPort;
    DiscoveryManagerInstance.publish(selfHost);

    server.listen(rpcPort);
    
}

export async function startRestServerBun(restPort = DEFAULT_REST_PORT) {
    Logger.log('REST Listening on port ' + restPort);

    const liveReloadImport = await import('bun-livereload');
    const liveReload = liveReloadImport.liveReload;
    const { appRouter } = await import('./router')

    const server = http.createServer(liveReload(createOpenApiHttpHandler({ router: appRouter })));
    server.listen(restPort);
}