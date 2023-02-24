import { startRpcServer, startRestServer } from "./server";
import { startLocalShell } from "./shell";
import { DiscoveryManagerInstance } from "./discovery";
import { HostManagerInstance } from "./host";
import { Logger, setLogToConsole } from "./log";
//@ts-ignore
import { File } from "node:buffer";
import { Command } from "@molt/command";
import { z } from "zod";
import { DEFAULT_REST_PORT, DEFAULT_RPC_PORT } from "./defaults";

if (!globalThis.File) {
    globalThis.File = File;
}

/*
const cmd = Command.parameters({
    '--rpcport': z.number(),
    '-v --verbose': z.boolean(),
    '-d --daemonize': z.boolean(),
  });
*/

async function main() {
    // prettier-ignore
    const cmd = Command
    .parameter(`rpcport`, z
      .number()
      .default(DEFAULT_RPC_PORT)
      .describe(`RPC Server port.`)
    )
    .parameter(`restport`, z
      .number()
      .default(DEFAULT_REST_PORT)
      .describe(`REST Server port.`)
    )
    .parameter(`verbose v`, z
      .boolean()
      .default(false)
      .describe(`Log debug messages.`)
    )
    .parameter(`daemonize d`, z
      .boolean()
      .default(false)
      .describe(`Deamonize and don't run shell.`)
    );

    cmd.settings({
        parameters: { environment: { $default: { prefix: "wasm_env" } } },
    });
    cmd.settings({ description: "testdesc" });

    const args = cmd.parse();

    const v = args.verbose;
    const daemon = args.daemonize;

    const rpcPort = args.rpcport;
    const restPort = args.restport;

    if (daemon) {
        setLogToConsole();
    }

    await startRpcServer(rpcPort);
    await startRestServer(restPort);

    Logger.log("starting host:", HostManagerInstance.self);

    DiscoveryManagerInstance.updateLoop();

    if (daemon) {
        Logger.log("Not starting local shell as daemon mode");
    } else {
        startLocalShell();
        console.log("starting shell");
    }
}

main();
