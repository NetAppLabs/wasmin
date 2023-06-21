import { RandomRandomAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/random-random";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";

export class RandomRandomAsynHost implements RandomRandomAsync {

    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    
    async getRandomU64(): Promise<bigint> {
        let result = 0n;
        const rand = await this.getRandomBytes(8n);
        if (rand instanceof Uint8Array) {
            const view = new DataView(rand.buffer, 0);
            result = view.getBigUint64(0, true);    
        } else if (rand instanceof ArrayBuffer) {
            const view = new DataView(rand, 0);
            result = view.getBigUint64(0, true);    
        }
        return result;
    }

    async getRandomBytes(len: bigint): Promise<Uint8Array | ArrayBuffer> {
        const ret = new Uint8Array(Number(len));
        const crypto = globalThis.crypto;
        if (crypto) {
            crypto.getRandomValues(ret);
        } else {
            const offset = 'A'.charCodeAt(0);
            for (let i = 0; i < len; i++) {
                ret[i] = i + offset;
            }
        }
        //console.log("RandomRandomAsynHost getRandomBytes - len:", len, "ret:", ret);
        return ret;
    }

}