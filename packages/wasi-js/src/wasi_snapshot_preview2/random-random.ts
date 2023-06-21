import { RandomRandomAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/random-random";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";
import { WASIWorker, WasiWorkerThreadRunner } from "../wasiWorker.js";


let WASI_WORKER: WASIWorker;

async function initializeWasi() {
    if (!WASI_WORKER){
        const wasiWorker = new WASIWorker({});
        await wasiWorker.createWorker();
        WASI_WORKER = wasiWorker;
    }
    return WASI_WORKER;
}

function getWasi(): WASIWorker {
    if (!WASI_WORKER){
        throw new Error("Error, WASIWorker not initialized");
    }
    return WASI_WORKER;
}

export function getRandomBytes(len: bigint): Uint8Array | ArrayBuffer {


    const wasi = getWasi();

    const args = [len];
    const buf = new ArrayBuffer(0);
    const ret = wasi.handleImport("wasi-random", "get-random-bytes", args, buf);
    
    return ret as Uint8Array;
}

export class RandomRandomAsynHost implements RandomRandomAsync {

    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    
    async getRandomU64(): Promise<bigint> {
        throw new Error("Method not implemented.");
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
        // console.log("getRandomBytes - len:", len, "ret:", ret);
        return ret;
    }

}