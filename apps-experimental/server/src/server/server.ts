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
