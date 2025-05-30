export namespace WasiClocksMonotonicClock {
  export function  now(): Instant;
  export function  resolution(): Duration;
  export function  subscribeInstant(when: Instant): Pollable;
  export function  subscribeDuration(when: Duration): Pollable;
}
export type Instant = bigint;
export type Duration = bigint;
import type { Pollable } from '../interfaces/wasi-io-poll.js';
export { Pollable };
