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

import { DEFAULT_REST_PORT, DEFAULT_RPC_PORT } from "./defaults.js";
import { DiscoveryManagerInstance } from "./discovery.js";
import { HostManagerInstance } from "./host.js";
import { getLogger } from "./log.js";
import http from "http";
import { createOpenApiHttpHandler } from "trpc-openapi";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { nodeHTTPRequestHandler } from "@trpc/server/adapters/node-http";
import { CreateHTTPContextOptions, createHTTPServer, createHTTPHandler } from "@trpc/server/adapters/standalone";

export async function startRpcServerBun(rpcPort = DEFAULT_RPC_PORT) {
    const logger = await getLogger();
    logger.log("RPC Listening on port " + rpcPort);
    /*const liveReloadImport = await import("bun-livereload");
    const liveReload = liveReloadImport.liveReload;

    const { appRouter } = await import("./router");

    const trpcHandler = liveReload(
        createHTTPHandler({
            router: appRouter,
            createContext: () => ({}),
        })
    );*/

    const { appRouter } = await import("./router");

    const trpcHandler = createHTTPHandler({
        router: appRouter,
        createContext: () => ({}),
    });

    // create and listen to the server handler
    const server = http.createServer((req, res) => {
        // enable CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Request-Method", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
        res.setHeader("Access-Control-Allow-Headers", "*");

        if (req.method === "OPTIONS") {
            res.writeHead(200);
            return res.end();
        }
        trpcHandler(req, res);
    });

    //const selfHost = HostManagerInstance.self;
    //selfHost.port = rpcPort;
    //DiscoveryManagerInstance.publish(selfHost);

    try {
        server.listen(rpcPort);
    } catch (err: any) {
        console.log("server.listen: err", err);
        logger.log("RPC Default address in use, retrying on random port ...");
        server.listen(0);
    }
    server.on("error", (e: any) => {
        //console.log("erver errcode:", e.code);
        //console.log("erver err:", e);
        //if (e.code === "EADDRINUSE") {
            // blindly assuming we got EADDRINUSE
            logger.log("RPC Default address in use, retrying on random port ...");
            server.listen(0);
        //}
    });
    server.on("listening", (e: any) => {
        if (server) {
            const addr = server.address() as any;
            if (addr) {
                //console.log("listening on addr:", addr);
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

}

/*
export async function startRestServerBun(restPort = DEFAULT_REST_PORT) {
    Logger.log("REST Listening on port " + restPort);

    const liveReloadImport = await import("bun-livereload");
    const liveReload = liveReloadImport.liveReload;
    const { appRouter } = await import("./router");

    const server = http.createServer(liveReload(createOpenApiHttpHandler({ router: appRouter })));
    server.listen(restPort);
}
*/

export async function startRestServerBun(restPort = DEFAULT_REST_PORT) {
    const logger = await getLogger();
    logger.log("REST Listening on port " + restPort);

    const { appRouter } = await import("./router");

    const server = http.createServer(createOpenApiHttpHandler({ router: appRouter }));
    try {
        server.listen(restPort);
    } catch (err: any) {
        console.log("server.listen: err", err);
        logger.log("Rest Default address in use, retrying on random port ...");
        server.listen(0);
    }
    server.on("error", (e: any) => {
        //console.log("erver errcode:", e.code);
        //console.log("erver err:", e);
        //if (e.code === "EADDRINUSE") {
            // blindly assuming we got EADDRINUSE
            logger.log("RPC Default address in use, retrying on random port ...");
            server.listen(0);
        //}
    });
    server.on("listening", (e: any) => {
        if (server) {
            const addr = server.address() as any;
            if (addr) {
                //console.log("listening on addr:", addr);
                if (addr.port) {
                    const myPort = addr.port;
                    logger.log("REST Listening on port " + myPort);
                    const selfHost = HostManagerInstance.self;
                    //selfHost.port = myPort;
                    DiscoveryManagerInstance.publish(selfHost);
                }
            }
        }
    });}
