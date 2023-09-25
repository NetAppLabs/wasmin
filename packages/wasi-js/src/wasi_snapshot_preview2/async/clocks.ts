import { ClocksMonotonicClockNamespace as clockm } from "@wasm-env/wasi-snapshot-preview2";
type ClocksMonotonicClockAsync = clockm.WasiClocksMonotonicClockAsync;
import { ClocksWallClockNamespace as clockw } from "@wasm-env/wasi-snapshot-preview2";
type ClocksWallClockAsync = clockw.WasiClocksWallClockAsync;
import { ClocksTimezoneNamespace as clockt } from "@wasm-env/wasi-snapshot-preview2";
import { Pollable as FSPollable } from "../../wasiFileSystem.js";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { isNode, isNodeorBun, sleep } from "../../wasiUtils.js";
import { toDateTimeFromMs } from "./preview2Utils.js";
type ClocksTimezoneAsync = clockt.WasiClocksTimezoneAsync;
type Datetime = clockw.Datetime;
type Instant = clockm.Instant;
type Timezone = clockt.Timezone;
type TimezoneDisplay = clockt.TimezoneDisplay;
type Pollable = clockm.Pollable;

let hrTimeStart: bigint;

export class ClocksMonotonicPollable implements FSPollable {
    constructor(when: Instant) {
        this._when = when;
    }

    private _when: Instant;

    async done(): Promise<boolean> {
        // XXX: mimic behavior of preview1 - waiting until done and, therefor, always returning true
        const hrTimeNow = await getHrTime();
        const ns = Number(this._when - hrTimeNow);
        if (ns > 1_000_000) {
            await sleep(ns / 1_000_000);
        }
        return true;
    }
}

export class ClocksMonotonicClockAsyncHost implements ClocksMonotonicClockAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async now(): Promise<Instant> {
        if (!hrTimeStart) {
            hrTimeStart = await getHrTime();
        }
        const hrTimeNow = await getHrTime();
        return hrTimeNow - hrTimeStart;
    }
    async resolution(): Promise<Instant> {
        return 1n;
    }
    async subscribe(when: Instant, absolute: boolean): Promise<Pollable> {
        if (!absolute) {
            const hrTimeNow = await getHrTime();
            when += hrTimeNow;
        }
        const pollable = new ClocksMonotonicPollable(when);
        return this._wasiEnv.openFiles.add(pollable);
    }
}

export class ClocksWallClockAsyncHost implements ClocksWallClockAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async now(): Promise<Datetime> {
        const timeMillis = Date.now();
        let dt = toDateTimeFromMs(timeMillis);
        return dt;
    }
    async resolution(): Promise<Datetime> {
        // 1 ms
        const res = 1_000_000;
        const dt = toDateTimeFromMs(res);
        return dt;
    }
}

export class ClocksTimezoneAsyncHost implements ClocksTimezoneAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    async display(tz: Timezone, when: Datetime): Promise<TimezoneDisplay> {
        throw new Error("Method not implemented.");
    }
    async utcOffset(tz: Timezone, when: Datetime): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async dropTimezone(tz: Timezone): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

// Get HR time in nanoseconds
export async function getHrTime(): Promise<bigint> {
    if (isNodeorBun()) {
        const nodeProcess = await import("node:process");
        const hrTimeNode = nodeProcess.hrtime;
        const hrNow = hrTimeNode.bigint();
        return hrNow;
    } else {
        // performance.now() returns seconds with milliseconds as fractional
        const hrNowS = performance.now();
        const hrNowNs = BigInt(Math.floor(hrNowS * 1_000_000_000));
        return hrNowNs;
    }
}
