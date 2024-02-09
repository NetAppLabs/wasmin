export namespace WasiClocksMonotonicClock {
  export function  now(): Promise<Instant>;
  export function  resolution(): Promise<Duration>;
  export function  subscribeInstant(when: Instant): Promise<Pollable>;
  export function  subscribeDuration(when: Duration): Promise<Pollable>;
}
export type Instant = bigint;
export type Duration = bigint;
import type { Pollable } from '../interfaces/wasi-io-poll.js';
export { Pollable };
