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

import { Host, HostList, HostMap, Process, ProcessList, ProcessMap } from "./types.js";
import { HostManagerInstance } from "./host.js";

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { OpenApiMeta } from "trpc-openapi";
import { generateOpenApiDocument } from "trpc-openapi";

//const t = initTRPC.create();
const t = initTRPC.meta<OpenApiMeta>().create();

export const pingRouter = t.router({
    ping: t.procedure
        .meta({ openapi: { method: "POST", path: "/ping/{input}" } })
        .input(z.object({ message: z.string() }))
        .output(z.object({ output: z.string() }))
        .mutation(async ({ input }) => {
            return { output: `${input.message}` };
        }),
});

const processRouter = t.router({
    create: t.procedure
        .meta({ openapi: { method: "POST", path: "/processes" } })
        .input(Process)
        .output(Process)
        .query(async ({ input }) => {
            return await HostManagerInstance.processManager.create(input as Process);
        }),
    map: t.procedure
        .meta({ openapi: { method: "GET", path: "/processes" } })
        .input(z.undefined())
        .output(ProcessMap)
        .query(async () => {
            return await HostManagerInstance.processManager.map();
        }),
    kill: t.procedure
        .meta({ openapi: { method: "POST", path: "/processes/{id}" } })
        .input(z.object({ id: z.string() }))
        .output(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const id = input.id;
            await HostManagerInstance.processManager.killProcess(id);
            return { id: id };
        }),
});

const hostRouter = t.router({
    get: t.procedure
        .meta({ openapi: { method: "GET", path: "/host" } })
        .input(z.undefined())
        .output(Host)
        .query(() => {
            return HostManagerInstance.self;
        }),
    list: t.procedure
        .meta({ openapi: { method: "GET", path: "/hosts" } })
        .input(z.undefined())
        .output(HostList)
        .query(async () => {
            return await HostManagerInstance.list();
        }),
    map: t.procedure.query(async () => {
        return await HostManagerInstance.map();
    }),
});

export const appRouter = t.router({
    //ping: pingRouter,
    process: processRouter,
    host: hostRouter,
    openapi: t.procedure
        .meta({ openapi: { method: "GET", path: "/openapi" } })
        .input(z.object({}))
        .output(z.any())
        .query(() => {
            return openApiDocument;
        }),
});

/*
const appRouterInterop = t.router<OpenApiMeta>().query('echo', {
  meta: { openapi: { enabled: true, method: 'GET', path: '/echo' } },
  input: z.object({ payload: z.string() }),
  output: z.object({ payload: z.string() }),
  resolve: ({ input }) => input,
});

export const trpcV10AppRouter = appRouterInterop.interop();
export const openApiV0AppRouter = appRouter;
export type AppRouter = typeof trpcV10AppRouter;
*/

export type AppRouter = typeof appRouter;

export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: "tRPC OpenAPI",
    version: "1.0.0",
    baseUrl: "http://localhost:5001",
});
