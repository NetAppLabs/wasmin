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

import { Bonjour, Service } from "bonjour-service";
//import NostrEmitter from '@cmdcode/nostr-emitter';
import { NostrEmitter } from "./nostr-emitter/index.js";

import { Host } from "./types.js";

import { AppRouter } from "./router.js";
import { HostManagerInstance } from "./host.js";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { getLogger } from "./log.js";
import { sleep } from "./util.js";

interface NostrEmitterTyped {
    connect(relayUrl: string, secret: string): Promise<void>;
    emit(eventName: string, args: any, eventMsg?: any): void;
    on(eventName: string, fn: any): void;
}

interface DiscoveryManager {
    publish(host: Host): Promise<void>;
    updateLoop(): Promise<void>;
}

class DiscoveryManagerLocal implements DiscoveryManager {
    constructor() {}
    async publish(host: Host): Promise<void> {
        return;
    }
    async updateLoop(): Promise<void> {
        return;
    }
}

class DiscoveryManagerNostr implements DiscoveryManager {
    constructor() {
        //Logger.log("Starting DiscoveryManagerNostr");
    }
    emitter?: NostrEmitterTyped;

    async getEmitter(): Promise<NostrEmitterTyped> {
        const logger = await getLogger();
        const secret = "mySuperSecretClusterInNostrHyperSpace";
        //const relay = "wss://nostr.rocks";
        //const relay = "wss://nostr-relay.wlvs.space";
        //const relay = "wss://nostr-relay.gkbrk.com";
        //const relay = "wss://public.nostr.swissrouting.com";
        const relay = "wss://relay.nostr.bg";
        //const relay = "ws://127.0.0.1:8080";
        const logFunc = (msg?: any, ...optionalParams: any[]) => {
            logger.log(msg, ...optionalParams);
        };
        if (!this.emitter) {
            const newEm = new NostrEmitter({
                log: logFunc,
            });
            //Logger.debug("newEmitter: ", newEm);
            const em = newEm as NostrEmitterTyped;
            //Logger.debug("em: ", em);
            await em.connect(relay, secret);
            //const em = newEm;
            this.emitter = em;
        }
        return this.emitter;
    }

    async publish(host: Host): Promise<void> {
        const logger = await getLogger();

        const emitter = await this.getEmitter();
        // Connect your emitter to the relay.
        while (true) {
            // Publish events like any other emitter.
            try {
                emitter.emit("publish-host", host);
            } catch (err: any) {
                logger.error("Error emitting event: ", err);
            }
            await sleep(1000);
        }

        // Self-published events are filtered out
        // by default, but you can enable them.
        //emitter.opt.selfPub = true

        // Specify optional parameters.
        /*
        const emitter = new NostrEmitter({
        version : 0,          // Nostr protocol version.
        kind    : 29001,      // Default event type (ephemeral).
        selfPub : false,      // Filter self-published events.
        socket  : WebSocket,  // Specify your own websocket object.
        tags    : [],         // Add your own tags to each message.
        filter  : {}          // Add your own subscription filters.
        })
        */

        return;
    }

    async updateLoop(): Promise<void> {
        this.discoverHosts();
        await HostManagerInstance.hostMonitor();
    }

    async discoverHosts(): Promise<void> {
        const logger = await getLogger();

        const emitter = await this.getEmitter();

        const listenPublishHandler = async (host: Host) => {
            logger.log("Hello From ", host);
            await this.addHost(host);
        };

        // Register an event listener.
        emitter.on("publish-host", listenPublishHandler);

        return;
    }

    async addHost(host: Host): Promise<void> {
        await HostManagerInstance.addHost(host);
    }
}

class DiscoveryManagerBonjour implements DiscoveryManager {
    constructor() {
        this.bonjourInstance = new Bonjour();
        //Logger.log("Starting DiscoveryManagerBonjour");
    }
    bonjourInstance: Bonjour;

    async publish(host: Host): Promise<void> {
        const logger = await getLogger();

        const serverName = host.name;
        const myPort = host.port;
        if (myPort) {
            this.bonjourInstance.publish({
                host: serverName,
                name: serverName,
                type: "wasmenv",
                port: myPort,
            });
        } else {
            logger.log("no port set, unable to publish host");
        }
    }

    async updateLoop(): Promise<void> {
        this.discoverHosts();
        await HostManagerInstance.hostMonitor();
    }

    async discoverHosts(): Promise<void> {
        const logger = await getLogger();
        const browser = this.bonjourInstance.find({ type: "wasmenv" });
        browser.start();
        while (true) {
            const onUp = async (service: Service) => {
                const serverName = service.name;
                const selfName = HostManagerInstance.self.name;
                if (serverName != selfName) {
                    logger.log("Found server:", service);
                    let ipv4_addr = "127.0.0.1";
                    let ipv6_addr = " ::1";
                    const addrs = service.addresses;
                    if (addrs) {
                        for (const addr of addrs) {
                            if (addr.includes("::")) {
                                // is ipv6 address
                                ipv6_addr = addr;
                            } else {
                                ipv4_addr = addr;
                            }
                        }
                    }
                    const port = service.port;
                    const url = "http://" + ipv4_addr + ":" + port;
                    logger.log("Found peer: ", service.name, "on url", url);
                    await this.queryHost(url);
                }
            };
            const services = browser.services;
            for (const serv of services) {
                await onUp(serv);
            }
            await sleep(1000);
        }
    }

    async discoverHosts2(): Promise<void> {
        const logger = await getLogger();

        while (true) {
            const onUp = async (service: Service) => {
                const serverName = service.name;
                const selfName = HostManagerInstance.self.name;
                if (serverName != selfName) {
                    logger.log("Found server:", service);
                    let ipv4_addr = "127.0.0.1";
                    let ipv6_addr = " ::1";
                    const addrs = service.addresses;
                    if (addrs) {
                        if (addrs.length > 0) {
                            ipv4_addr = addrs[0];
                        }
                        if (addrs.length > 1) {
                            ipv6_addr = addrs[1];
                        }
                    }
                    const port = service.port;
                    const url = "http://" + ipv4_addr + ":" + port;
                    logger.log("Found peer: ", service.name, "on url", url);
                    await this.queryHost(url);
                }
            };
            const browser = this.bonjourInstance.find({ type: "wasmenv" }, onUp);
            await sleep(1000);
        }
    }

    async queryHost(url: string): Promise<void> {
        const logger = await getLogger();
        try {
            const links = [
                httpBatchLink({
                    url: url,
                }),
            ];
            const proxy = createTRPCProxyClient<AppRouter>({ links: links });
            //const caller = appRouter.createCaller({url: url});
            //const host = await caller.host.get();
            const host = (await proxy.host.get.query()) as Host;
            logger.log("got host: ", host);
            await this.addHost(host);
        } catch (err: any) {
            logger.log("queryHost: ", err);
        }
    }

    async addHost(host: Host): Promise<void> {
        await HostManagerInstance.addHost(host);
    }
}

//export const DiscoveryManagerInstance = new DiscoveryManagerBonjour();

export const DiscoveryManagerInstance = new DiscoveryManagerNostr();

//export const DiscoveryManagerInstance = new DiscoveryManagerLocal();
