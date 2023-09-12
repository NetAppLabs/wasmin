//import { createOpenApiNodeHttpHandler } from 'trpc-openapi';
import { appRouter } from "./router.js";
import { getLogger } from "./log.js";
import { HostManagerInstance } from "./host.js";
import { DiscoveryManagerInstance } from "./discovery.js";
import { DEFAULT_REST_PORT, DEFAULT_RPC_PORT } from "./defaults.js";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import http from "http";
import { createOpenApiHttpHandler } from "trpc-openapi";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

/*
type Proc = {
  id: string,
  type: number,
  cmd: string,
  args: Array<string>,
  env: Record<string,string>,
}

function inspectProcs(){ 
  const p: Proc = {
    id: "test",
    type: 12,
    cmd: "flip",
    args: ["1"],
    env: {"env1": "env1value"},
  }
  inspectProc(p);
}

function inspectProc(p: Proc){
  for (const key in p) {
    console.log(key);
  }
  Object.entries(p).forEach(([key, value], index) => {
    const typval = typeof value;
    if (value instanceof Array) {
      console.log(key, "is array");
      type Arrtype = typeof value;
      //type ArrtypeElement = Arrtype[number];
      //const styp = ArrtypeElement
      //if (ArrtypeElement == string) {
      //
      //}
      const arr = value as Arrtype;
      const s = typeof value;
      console.log("arrtyp:", s);
    } else if (value instanceof Object) {
      inspectProc(value);
    }
    console.log(key, typeof key, value, typval, index);
  });

}

inspectProcs();
*/

//import { liveReload } from 'bun-livereload'

const rpcPort = DEFAULT_RPC_PORT;
const restPort = DEFAULT_REST_PORT;

//const liveReloadImport = await import("bun-livereload");
//const liveReload = liveReloadImport.liveReload;
export default {
    port: rpcPort,
    fetch: async (request: Request) => {
        //fetch: liveReload(async (request: Request) => {
        if (request.method === "OPTIONS")
            return new Response("", {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                },
            });

        const { appRouter } = await import("./router");
        const response = await fetchRequestHandler({
            router: appRouter,
            endpoint: "",
            req: request,
            createContext: async () => {},
        });
        response.headers.set("Access-Control-Allow-Origin", "*");
        return response;
        //}),
    },
};

const logger = await getLogger();
logger.log("RPC Listening on port " + rpcPort);
const selfHost = HostManagerInstance.self;
selfHost.port = rpcPort;
DiscoveryManagerInstance.publish(selfHost);

DiscoveryManagerInstance.updateLoop();

const server = http.createServer(createOpenApiHttpHandler({ router: appRouter }));
//const server = http.createServer(liveReload(createOpenApiHttpHandler({ router: appRouter })));
server.listen(restPort);
