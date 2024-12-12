import { ClocksMonotonicClockNamespace as clockm } from "@netapplabs/wasi-snapshot-preview2/async";
type ClocksMonotonicClockAsync = clockm.WasiClocksMonotonicClock;
import { ClocksWallClockNamespace as clockw } from "@netapplabs/wasi-snapshot-preview2/async";
type ClocksWallClockAsync = clockw.WasiClocksWallClock;
import { FsPollable } from "../../wasiFileSystem.js";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { isNodeorBunorDeno, sleep } from "../../utils.js";
import { toDateTimeFromMs } from "./preview2Utils.js";
import { DisposeAsyncResourceFunc, Resource } from "../../wasiResources.js";
import { wasiPreview2Debug } from "../../wasiDebug.js";
type Datetime = clockw.Datetime;
type Instant = clockm.Instant;
type Pollable = clockm.Pollable;

let hrTimeStart: bigint;

export class ClocksMonotonicPollable implements FsPollable, Resource {
    constructor(when: Instant, onDispose: DisposeAsyncResourceFunc) {
        this._when = when;
        this.resource = -1;
        this.onDispose = onDispose;
    }
    [Symbol.asyncDispose](): Promise<void> {
        return this.onDispose(this);
    }
    public resource: number;
    public onDispose: DisposeAsyncResourceFunc;
    
    async ready(): Promise<boolean> {
        return await this.doneWithoutWaiting();
    }

    private _when: Instant;

    async block(): Promise<void> {
        await this.doneWithWaiting();
    }

    async doneWithoutWaiting(): Promise<boolean> {
        const hrTimeNow = await getHrTime();
        return (this._when < hrTimeNow)
    }

    async doneWithWaiting(): Promise<boolean> {
        // XXX: mimic behavior of preview1 - waiting until done and, therefor, always returning true
        const hrTimeNow = await getHrTime();
        const ns = Number(this._when - hrTimeNow);
        wasiPreview2Debug(`attempting to sleep for ${ns} nanoseconds`);
        const millis = ns / 1_000_000;
        wasiPreview2Debug(`sleep for ${millis} milliseconds`);
        await sleep(millis);
        return true;
    }
}

export class ClocksMonotonicClockAsyncHost implements ClocksMonotonicClockAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async subscribeInstant(when: bigint): Promise<clockm.Pollable> {
        return this.subscribe(when, true);
    }
    async subscribeDuration(when: bigint): Promise<clockm.Pollable> {
        return this.subscribe(when, false);
    }
    private _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

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
        wasiPreview2Debug(`subscribe instant: ${when} absolute: ${absolute}`);
        if (!absolute) {
            const hrTimeNow = await getHrTime();
            when += hrTimeNow;
        }
        const disposeFunc = this.openFiles.getDisposeResourceFunc();
        const pollable = new ClocksMonotonicPollable(when, disposeFunc);
        this.openFiles.addResource(pollable);
        return pollable;
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
        const res = 1;
        const dt = toDateTimeFromMs(res);
        return dt;
    }
}

/*
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
*/

// Get HR time in nanoseconds
export async function getHrTime(): Promise<bigint> {
    if (isNodeorBunorDeno()) {
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
