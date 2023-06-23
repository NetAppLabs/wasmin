import { Host } from "./types";

import { uniqueNamesGenerator, Config, adjectives, colors, names } from "unique-names-generator";
import { ProcessManager } from "./process";
import { CreateHostId, isBun, isNode, sleep } from "./util";
import { getDefaultLocalIPv4, getDefaultLocalIPv6 } from "./util_node";

const config: Config = {
    dictionaries: [adjectives, colors, names],
    separator: "-",
    style: "lowerCase",
};

class HostManager {
    constructor() {
        const myid = CreateHostId();
        const randomName = uniqueNamesGenerator(config);

        const humanName = randomName;
        const arch = process.arch;
        const os = process.platform;
        const ipv4Addr = getDefaultLocalIPv4();
        const ipv6Addr = getDefaultLocalIPv6();
        let runtime = "unknown";
        if (isNode()) {
            runtime = "node";
        }
        if (isBun()) {
            runtime = "bun";
        }
        this.self = {
            id: myid,
            name: humanName,
            arch: arch,
            os: os,
            ipv4: ipv4Addr,
            ipv6: ipv6Addr,
            runtime: runtime,
        };
        this.hosts[myid] = this.self;
        this.processManager = new ProcessManager();
    }
    self: Host;
    processManager: ProcessManager;
    private hosts: Record<string, Host> = {};
    private staleHosts: Record<string, Host> = {};
    private hostAge: Record<string, number> = {};

    async addHost(host: Host) {
        this.hosts[host.id] = host;
        const curTime = Date.now();
        this.hostAge[host.id] = curTime;
    }

    async markHostStale(hostid: string) {
        const host = this.hosts[hostid];
        this.staleHosts[hostid] = host;
        delete this.hosts[hostid];
    }

    async map(): Promise<Record<string, Host>> {
        return this.hosts;
    }

    async list(): Promise<Host[]> {
        const hosts: Host[] = [];
        Object.entries(this.hosts).forEach(([_key, host]) => {
            hosts.push(host);
        });
        return hosts;
    }

    async hostMonitor(): Promise<void> {
        while (true) {
            const graceTime = 3000;
            const hosts = await this.list();
            for (const host of hosts) {
                const hostid = host.id;
                const curTime = Date.now();
                const hostAge = this.hostAge[hostid];
                if (hostAge) {
                    const hostAgePlusGrace = hostAge + graceTime;
                    if (hostAgePlusGrace < curTime) {
                        this.markHostStale(hostid);
                    }
                }
            }
            await sleep(1000);
        }
    }
}

export const HostManagerInstance = new HostManager();
