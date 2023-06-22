import { ClocksMonotonicClockNamespace as clockm } from "@wasm-env/wasi-snapshot-preview2";
type ClocksMonotonicClockAsync = clockm.ClocksMonotonicClockAsync;
import { ClocksWallClockNamespace as clockw } from "@wasm-env/wasi-snapshot-preview2";
type ClocksWallClockAsync = clockw.ClocksWallClockAsync;
import { ClocksTimezoneNamespace as clockt } from "@wasm-env/wasi-snapshot-preview2";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";
import { isNode } from "../wasiUtils.js";
type ClocksTimezoneAsync = clockt.ClocksTimezoneAsync;
type Datetime = clockw.Datetime;
type Instant = clockm.Instant;
type Timezone = clockt.Timezone;
type TimezoneDisplay = clockt.TimezoneDisplay;
type Pollable = clockm.Pollable;

let hrTimeStart: bigint;

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
        throw new Error("Method not implemented.");
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

export function toDateTimeFromMs(timeMillis: number): Datetime {
    const seconds = BigInt(Math.floor(timeMillis / 1000));
    const nanoseconds = (timeMillis % 1000) * 1_000_000;
    const dt: Datetime = {
        seconds: seconds,
        nanoseconds: nanoseconds,
    };
    return dt;
}

// Get HR time in nanoseconds
export async function getHrTime(): Promise<bigint> {
    if (isNode()) {
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
