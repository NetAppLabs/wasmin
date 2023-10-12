import { PollPollNamespace as pollns } from "@wasmin/wasi-snapshot-preview2";
type PollAsync = pollns.WasiPollPollAsync;
type Pollable = pollns.Pollable;

import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { FsPollable } from "../../wasiFileSystem.js";

export class PollPollAsyncHost implements PollAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async dropPollable(this0: Pollable): Promise<void> {
        await this._wasiEnv.openFiles.close(this0);
    }

    async pollOneoff(in0: Uint32Array): Promise<boolean[]> {
        const out: boolean[] = []
        for (let i = 0; i < in0.length; i++) {
            const pollable = this._wasiEnv.openFiles.get(in0[i]) as FsPollable;
            out[i] = (await pollable.done());
        }
        return out;
    }
}
