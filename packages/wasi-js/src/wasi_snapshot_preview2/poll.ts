import { PollPollAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/poll-poll.js";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";
import { Pollable } from "../wasiFileSystem.js";

export class PollPollAsyncHost implements PollPollAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async dropPollable(this0: number): Promise<void> {
        await this._wasiEnv.openFiles.close(this0);
    }
    async pollOneoff(in0: Uint32Array): Promise<Uint8Array | ArrayBuffer> {
        const out = new Uint8Array(in0.length);
        for (let i = 0; i < in0.length; i++) {
            const pollable = this._wasiEnv.openFiles.get(in0[i]) as Pollable;
            out[i] = (await pollable.done()) ? 1 : 0;
        }
        return out;
    }
}
