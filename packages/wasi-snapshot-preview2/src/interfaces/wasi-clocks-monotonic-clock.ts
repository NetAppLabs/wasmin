export interface WasiClocksMonotonicClockAsync {
  /**
   * Read the current value of the clock.
   * 
   * The clock is monotonic, therefore calling this function repeatedly will
   * produce a sequence of non-decreasing values.
   */
   now(): Promise<Instant>;
  /**
   * Query the resolution of the clock. Returns the duration of time
   * corresponding to a clock tick.
   */
   resolution(): Promise<Duration>;
  /**
   * Create a `pollable` which will resolve once the specified instant
   * occured.
   */
   subscribeInstant(when: Instant): Promise<Pollable>;
  /**
   * Create a `pollable` which will resolve once the given duration has
   * elapsed, starting at the time at which this function was called.
   * occured.
   */
   subscribeDuration(when: Duration): Promise<Pollable>;
}
import type { Pollable } from '../interfaces/wasi-io-poll.js';
export { Pollable };
/**
 * An instant in time, in nanoseconds. An instant is relative to an
 * unspecified initial value, and can only be compared to instances from
 * the same monotonic-clock.
 */
export type Instant = bigint;
/**
 * A duration of time, in nanoseconds.
 */
export type Duration = bigint;
