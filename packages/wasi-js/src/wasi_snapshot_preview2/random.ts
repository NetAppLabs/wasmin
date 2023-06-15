import { WasiEnv, WasiOptions } from "../wasi";
import { WASIWorker, WasiWorkerThreadRunner } from "../wasiWorker";


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

    let args = [len];
    const buf = new ArrayBuffer(0);
    const ret = wasi.handleImport("wasi-random", "get-random-bytes", args, buf);
    
    return ret as Uint8Array;
}

export class WasiRandom {

    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = new WasiEnv(
            wasiOptions.openFiles,
            wasiOptions.stdin,
            wasiOptions.stdout,
            wasiOptions.stderr,
            wasiOptions.args,
            wasiOptions.env,
            wasiOptions.abortSignal,
            wasiOptions.tty
        );
        this._wasiEnv = wasiEnv;
    }

    async getRandomBytes(len: bigint): Promise<Uint8Array | ArrayBuffer> {
        let ret = new Uint8Array(Number(len));
        let crypto = globalThis.crypto;
        if (crypto) {
            crypto.getRandomValues(ret);
        } else {
            let offset = 'A'.charCodeAt(0);
            for (let i = 0; i < len; i++) {
                ret[i] = i + offset;
            }
        }
        console.log("getRandomBytes - len:", len, "ret:", ret);
        return ret;
    }

}