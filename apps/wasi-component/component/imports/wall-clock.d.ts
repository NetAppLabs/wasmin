export namespace ImportsWallClock {
    export function now(): Datetime;
    export function resolution(): Datetime;
}
export interface Datetime {
    seconds: bigint;
    nanoseconds: number;
}
