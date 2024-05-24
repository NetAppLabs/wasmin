export namespace WasiClocksMonotonicClock {
  export function now(): Instant;
  export function subscribeInstant(when: Instant): Pollable;
  export function subscribeDuration(when: Duration): Pollable;
}
export type Instant = bigint;
import type { Pollable } from './wasi-io-poll.js';
export { Pollable };
export type Duration = bigint;
