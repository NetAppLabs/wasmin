import { randomBytes } from "crypto";

export function isBun() {
    // only bun has global Bun
    try {
        // @ts-ignore
        return globalThis.Bun != null;
    } catch (e) {
        return false;
    }
}

export function isNode() {
    if (!isBun()) {        
        return globalThis.process != null;
    } else {
        return false;
    }
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function CreateProcessId(): string {
    const id = CreateUniqueId();
    return id;
}

export function CreateHostId(): string {
    const id = CreateUniqueId();
    return id;
}

export function CreateUniqueId(): string {
    // potentially use ulid here:
    // https://github.com/ulid/javascript
    // https://github.com/ulid/spec
    const id = randomBytes(16).toString("hex");
    return id;
}
