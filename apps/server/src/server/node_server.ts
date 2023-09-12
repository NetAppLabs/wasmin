import { appRouter } from "./router.js";
import { HostManagerInstance } from "./host.js";
import { DiscoveryManagerInstance } from "./discovery.js";
import { getLogger } from "./log.js";
import { DEFAULT_REST_PORT, DEFAULT_RPC_PORT } from "./defaults.js";
//import { renderTrpcPanel } from "trpc-panel";

//import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { default as http } from "node:http";
import { createOpenApiHttpHandler } from "trpc-openapi";
import { CreateHTTPContextOptions, createHTTPServer, createHTTPHandler } from "@trpc/server/adapters/standalone";

// Initialize a context for the server
function createContext(opts: CreateHTTPContextOptions) {
    opts.res.setHeader("Access-Control-Allow-Origin", "*");
    opts.res.setHeader("Access-Control-Allow-Headers", "*");
    return {};
}

export async function startRpcServerNode(rpcPort = DEFAULT_RPC_PORT) {
    // Create regular trpc server
    const logger = await getLogger();
    const trpcHandler = createHTTPHandler({
        router: appRouter,
        createContext: () => ({}),
    });

    // create and listen to the server handler
    const server = http.createServer((req, res) => {
        // act on the req/res objects

        // enable CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Request-Method", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        res.setHeader("Access-Control-Allow-Headers", "*");

        // accepts OPTIONS
        if (req.method === "OPTIONS") {
            res.writeHead(200);
            return res.end();
        }

        //if (req.url?.endsWith("/panel")) {
        //  return res.write(
        //    renderTrpcPanel(appRouter, { url: "http://localhost:"+DEFAULT_RPC_PORT+"/" })
        //  );
        //} else {
        // then we can pass the req/res to the tRPC handler
        trpcHandler(req, res);
        //}
    });
    server.on("error", (e: any) => {
        if (e.code === "EADDRINUSE") {
            logger.log("RPC Default address in use, retrying on random port ...");
            server.listen(0);
        }
    });
    server.on("listening", (e: any) => {
        if (server) {
            const addr = server.address() as any;
            if (addr) {
                if (addr.port) {
                    const myPort = addr.port;
                    logger.log("RPC Listening on port " + myPort);
                    const selfHost = HostManagerInstance.self;
                    selfHost.port = myPort;
                    DiscoveryManagerInstance.publish(selfHost);
                }
            }
        }
    });

    server.listen(rpcPort);

    /*
  const { server, listen } = createHTTPServer({
    router: appRouter,
    createContext,
  });
  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      Logger.log('RPC Default address in use, retrying on random port ...');
      server.listen(0);
    }
  });
  server.on('listening', (e: any) => {
    if (server) {
      const addr = server.address() as any;
      if (addr) {
        if (addr.port) {
          const myPort = addr.port;
          Logger.log('RPC Listening on port ' + myPort);
          const selfHost = HostManagerInstance.self;
          selfHost.port = myPort;
          DiscoveryManagerInstance.publish(selfHost);
        }
      }
    }
  });
  try {
    const res = listen(DEFAULT_RPC_PORT);
    const myPort = res.port;
    Logger.log('RPC Listening on port ' + myPort);
  } catch(err: any){
    Logger.log('RPC listen error ', err);
  }
  */
}

export async function startRestServerNode(restPort = DEFAULT_REST_PORT) {
    const logger = await getLogger();

    const server = http.createServer(
        createOpenApiHttpHandler({
            router: appRouter,
        })
    );

    server.listen(restPort);

    server.on("listening", (e: any) => {
        if (server) {
            const addr = server.address() as any;
            if (addr) {
                if (addr.port) {
                    const myPort = addr.port;
                    logger.log("REST Listening on port " + myPort);
                    const selfHost = HostManagerInstance.self;
                    selfHost.port = myPort;
                    //DiscoveryManagerInstance.publish(selfHost);
                }
            }
        }
    });

    server.on("error", (e: any) => {
        if (e.code === "EADDRINUSE") {
            logger.log("Default address in use, retrying on random port ...");
            server.listen(0);
        }
    });
}
