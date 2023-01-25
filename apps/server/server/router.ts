import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { OpenApiMeta } from 'trpc-openapi';
import { generateOpenApiDocument } from 'trpc-openapi';
import { Host, HostList, HostMap, Process, ProcessList, ProcessMap } from "./types";
import { HostManagerInstance } from "./host";

//const t = initTRPC.create();
const t = initTRPC.meta<OpenApiMeta>().create();

export const pingRouter = t.router({
  ping: t.procedure
    .meta({ openapi: { method: 'POST', path: '/ping/{input}'}})
    .input(z.object({ message: z.string() }))
    .output(z.object({ output: z.string() }))
    .mutation(async ({ input }) => {
      return { output: `${input.message}` };
    })
});

const processRouter = t.router({
  create: t.procedure
    .meta({ openapi: { method: 'POST', path: '/processes' } })
    .input(Process)
    .output(Process)
    .query(async ({ input }) => {
      return await HostManagerInstance.processManager.create(input as Process);
    }),
  map: t.procedure
    .meta({ openapi: { method: 'GET', path: '/processes' } })
    .input(z.undefined())
    .output(ProcessMap)
    .query(async () => {
      return await HostManagerInstance.processManager.map();
    }),
  kill: t.procedure
    .meta({ openapi: { method: 'POST', path: '/processes/{id}' } })
    .input(z.object({ id: z.string()}))
    .output(z.object({ id: z.string()}))
    .query(async ({ input }) => {
      const id = input.id;
      await HostManagerInstance.processManager.killProcess(id);
      return { id: id };
    }),
});

const hostRouter = t.router({
  get: t.procedure
    .meta({ openapi: { method: 'GET', path: '/host' } })
    .input(z.undefined())
    .output(Host)
    .query(() => {
      return HostManagerInstance.self;
    }),
  list: t.procedure
    .meta({ openapi: { method: 'GET', path: '/hosts' } })
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
    .meta({ openapi: { method: 'GET', path: '/openapi' } })
    .input(z.object({}))
    .output(z.any())
    .query(() => {
      return openApiDocument;
    })
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
  title: 'tRPC OpenAPI',
  version: '1.0.0',
  baseUrl: 'http://localhost:5001',
});