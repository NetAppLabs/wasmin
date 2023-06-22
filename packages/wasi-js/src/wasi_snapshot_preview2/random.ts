import { RandomRandomAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/random-random.js";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";
import { RandomInsecureAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/random-insecure.js";
import { RandomInsecureSeedAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/random-insecure-seed.js";

export class RandomRandomAsynHost implements RandomRandomAsync {
    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }

    async getRandomU64(): Promise<bigint> {
        let ret = randomU64();
        return ret;
    }

    async getRandomBytes(len: bigint): Promise<Uint8Array | ArrayBuffer> {
        const ret = randomBytes(len);
        return ret;
    }
}

export class RandomInsecureAsyncHost implements RandomInsecureAsync {
    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async getInsecureRandomBytes(len: bigint): Promise<Uint8Array | ArrayBuffer> {
        const ret = randomBytes(len);
        return ret;
    }
    async getInsecureRandomU64(): Promise<bigint> {
        let ret = randomU64();
        return ret;
    }
}

export class RandomInsecureSeedAsyncHost implements RandomInsecureSeedAsync {
    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async insecureSeed(): Promise<[bigint, bigint]> {
        const rand1 = randomU64();
        const rand2 = randomU64();
        return [rand1, rand1];
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
