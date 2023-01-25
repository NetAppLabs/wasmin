
import { networkInterfaces } from 'node:os';

export function getDefaultLocalIPv4(): string {
    let ip = Object.values(networkInterfaces()).flat().find((i) => i?.family === 'IPv4' && !i?.internal)?.address;
    if (!ip) {
        ip = "127.0.0.1";
    }
    return ip;
}

export function getDefaultLocalIPv6(): string{
    let ip = Object.values(networkInterfaces()).flat().find((i) => i?.family === 'IPv6' && !i?.internal)?.address;
    if (!ip) {
        ip = "::1";
    }
    return ip;
}