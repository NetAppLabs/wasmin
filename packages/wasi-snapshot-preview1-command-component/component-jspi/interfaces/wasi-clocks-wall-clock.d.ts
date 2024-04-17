export namespace WasiClocksWallClock {
  export function  now(): Promise<Datetime>;
  export function  resolution(): Promise<Datetime>;
}
export interface Datetime {
  seconds: bigint,
  nanoseconds: number,
}
