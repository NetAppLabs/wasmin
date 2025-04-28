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

import { startRpcServer, startRestServer } from "./server.js";
import { startLocalShell } from "./shell.js";
import { DiscoveryManagerInstance } from "./discovery.js";
import { HostManagerInstance } from "./host.js";
import { getLogger, setLogToConsole } from "./log.js";
import { DEFAULT_REST_PORT, DEFAULT_RPC_PORT } from "./defaults.js";
//@ts-ignore
import { File } from "node:buffer";
import { Command } from "@molt/command";
import { z } from "zod";

if (!globalThis.File) {
    //@ts-ignore
    globalThis.File = File;
}

async function main() {
    // prettier-ignore
    const cmd = Command
    .create()
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
    const hostId = HostManagerInstance.self.id;
    const logger = await getLogger(hostId);
    logger.log("starting host:", HostManagerInstance.self);

    await startRpcServer(rpcPort);
    await startRestServer(restPort);

    DiscoveryManagerInstance.updateLoop();

    if (daemon) {
        logger.log("Not starting local shell as daemon mode");
    } else {
        //console.log("starting shell");
        await startLocalShell();
    }
}

await main();
