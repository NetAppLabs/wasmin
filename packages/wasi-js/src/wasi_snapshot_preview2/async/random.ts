import { RandomRandomNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type RandomRandomAsync = RandomRandomNamespace.WasiRandomRandom;
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { RandomInsecureNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type RandomInsecureAsync = RandomInsecureNamespace.WasiRandomInsecure;
import { RandomInsecureSeedNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
import { wasiPreview2Debug } from "../../wasiDebug.js";
type RandomInsecureSeedAsync = RandomInsecureSeedNamespace.WasiRandomInsecureSeed;
export class RandomRandomAsyncHost implements RandomRandomAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async getRandomU64(): Promise<bigint> {
        wasiPreview2Debug("RandomRandomAsyncHost getRandomU64");
        const ret = randomU64();
        return ret;
    }

    async getRandomBytes(len: bigint): Promise<Uint8Array> {
        wasiPreview2Debug("RandomRandomAsyncHost getInsecureRandomBytes", len);
        const ret = randomBytes(len);
        return ret;
    }
}

export class RandomInsecureAsyncHost implements RandomInsecureAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;
    async getInsecureRandomBytes(len: bigint): Promise<Uint8Array> {
        wasiPreview2Debug("RandomInsecureAsyncHost getInsecureRandomBytes", len);
        const ret = randomBytes(len);
        return ret;
    }
    async getInsecureRandomU64(): Promise<bigint> {
        wasiPreview2Debug("RandomInsecureAsyncHost getInsecureRandomU64");
        const ret = randomU64();
        return ret;
    }
}

export class RandomInsecureSeedAsyncHost implements RandomInsecureSeedAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;
    async insecureSeed(): Promise<[bigint, bigint]> {
        wasiPreview2Debug("RandomInsecureSeedAsyncHost insecureSeed");
        const rand1 = randomU64();
        const rand2 = randomU64();
        return [rand1, rand2];
    }
}

export function randomBytes(len: bigint): Uint8Array {
    const ret = new Uint8Array(Number(len));
    const crypto = globalThis.crypto;
    if (crypto) {
        crypto.getRandomValues(ret);
    } else {
        const offset = "A".charCodeAt(0);
        for (let i = 0; i < len; i++) {
            ret[i] = i + offset;
        }
    }
    return ret;
}

export function randomU64(): bigint {
    let result = 0n;
    const rand = randomBytes(8n);
    const view = new DataView(rand.buffer, 0);
    result = view.getBigUint64(0, true);
    return result;
}
