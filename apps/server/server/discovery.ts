

import { Bonjour, Service } from 'bonjour-service';
//import NostrEmitter from '@cmdcode/nostr-emitter';
import { NostrEmitter } from './nostr-emitter/index';

import { Host } from './types';

import { AppRouter } from './router';
import { HostManagerInstance } from './host';
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { Logger } from './log';
import { sleep } from './util';

interface NostrEmitterTyped {
    connect(relayUrl: string, secret: string): Promise<void>;
    emit(eventName: string, args: any, eventMsg?: any): void;
    on(eventName: string, fn: any): void;
}

interface DiscoveryManager {
    publish(host: Host): Promise<void>;
    updateLoop(): Promise<void>;
}

class DiscoveryManagerNostr implements DiscoveryManager {
    constructor() {
        Logger.log("Starting DiscoveryManagerNostr")
    }
    emitter?: NostrEmitterTyped;

    async getEmitter(): Promise<NostrEmitterTyped> {
        const secret = "mySuperSecretClusterInNostrHyperSpace";
        //const relay = "wss://nostr-relay.wlvs.space";
        //const relay = "wss://nostr-relay.gkbrk.com";
        const relay = "wss://public.nostr.swissrouting.com"
        //const relay = "wss://relay.nostr.bg";
        //const relay = "ws://127.0.0.1:8080";
        if (!this.emitter){
            const newEm = new NostrEmitter({
                log: Logger.log,
            });
            //Logger.debug("newEmitter: ", newEm);
            const em = newEm as NostrEmitterTyped;
            //Logger.debug("em: ", em);
            await em.connect(
                relay,
                secret
            );
            //const em = newEm;
            this.emitter = em;
        }
        return this.emitter;
    }

    async publish(host: Host): Promise<void> {
        const emitter = await this.getEmitter();
        // Connect your emitter to the relay.
        while (true) {
            // Publish events like any other emitter.
            try {
                emitter.emit('publish-host', host);
            } catch(err: any) {
                Logger.error("Error emitting event: ", err);
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

        const emitter = await this.getEmitter();

        const listenPublishHandler = async (host: Host) => {
            Logger.log('Hello From ', host);
            await this.addHost(host);
        };

        // Register an event listener.
        emitter.on('publish-host', listenPublishHandler)

        return;
    }

    async addHost(host: Host): Promise<void> {
        await HostManagerInstance.addHost(host);
    }
}


class DiscoveryManagerBonjour implements DiscoveryManager {
    constructor() {
        this.bonjourInstance = new Bonjour()
        Logger.log("Starting DiscoveryManagerBonjour")
    }
    bonjourInstance: Bonjour;

    async publish(host: Host): Promise<void> {
        const serverName = host.name;
        const myPort= host.port;
        if (myPort) {
            this.bonjourInstance.publish({ host: serverName, name: serverName , type: 'wasmenv', port: myPort});
        } else {
            Logger.log("no port set, unable to publish host");
        }
    }

    async updateLoop(): Promise<void> {
        this.discoverHosts();
        await HostManagerInstance.hostMonitor();
    }

    async discoverHosts(): Promise<void> {
        const browser = this.bonjourInstance.find({ type: 'wasmenv'});
        browser.start();
        while (true) {
            const onUp = async (service: Service) => {
                    const serverName = service.name;
                    const selfName = HostManagerInstance.self.name;
                    if (serverName != selfName ) {
                        Logger.log('Found server:', service)
                        let ipv4_addr = "127.0.0.1";
                        let ipv6_addr = " ::1";
                        const addrs = service.addresses;
                        if (addrs) {
                            for (const addr of addrs) {
                                if (addr.includes('::')){
                                    // is ipv6 address
                                    ipv6_addr = addr;
                                } else {
                                    ipv4_addr = addr;
                                }
                            }
                        }
                        const port = service.port;
                        const url = "http://"+ipv4_addr+":"+port
                        Logger.log("Found peer: ", service.name, "on url", url);
                        await this.queryHost(url);
                    }
            };
            const services = browser.services;
            for (const serv of services){
                await onUp(serv);
            }
            await sleep(1000);
        }
    }

    async discoverHosts2(): Promise<void> {
        while (true) {
            const onUp = async (service: Service) => {
                    const serverName = service.name;
                    const selfName = HostManagerInstance.self.name;
                    if (serverName != selfName ) {
                        Logger.log('Found server:', service)
                        let ipv4_addr = "127.0.0.1";
                        let ipv6_addr = " ::1";
                        const addrs = service.addresses;
                        if (addrs) {
                            if (addrs.length>0) {
                                ipv4_addr = addrs[0];
                            }
                            if (addrs.length>1) {
                                ipv6_addr = addrs[1];
                            }
                        }
                        const port = service.port;
                        const url = "http://"+ipv4_addr+":"+port
                        Logger.log("Found peer: ", service.name, "on url", url);
                        await this.queryHost(url);
                    }
            };
            const browser = this.bonjourInstance.find({ type: 'wasmenv'}, onUp);
            await sleep(1000);
        }
    }

    async queryHost(url: string): Promise<void> {
        try {
            const links = [
                httpBatchLink({
                url: url,
                }),
            ];
            const proxy = createTRPCProxyClient<AppRouter>({links: links});
            //const caller = appRouter.createCaller({url: url});
            //const host = await caller.host.get();
            const host = await proxy.host.get.query() as Host;
            Logger.log("got host: ", host);
            await this.addHost(host);
        } catch (err: any) {
            Logger.log("queryHost: ",err);
        }
    }

    async addHost(host: Host): Promise<void> {
        await HostManagerInstance.addHost(host);
    }
}

//export const DiscoveryManagerInstance = new DiscoveryManagerBonjour();

export const DiscoveryManagerInstance = new DiscoveryManagerNostr();


