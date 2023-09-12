export interface ClocksMonotonicClock {
    /**
     * Read the current value of the clock.
     *
     * The clock is monotonic, therefore calling this function repeatedly will
     * produce a sequence of non-decreasing values.
     */
    now(): Instant;
    /**
     * Query the resolution of the clock.
     */
    resolution(): Instant;
    /**
     * Create a `pollable` which will resolve once the specified time has been
     * reached.
     */
    subscribe(when: Instant, absolute: boolean): Pollable;
}
export interface ClocksMonotonicClockAsync {
    /**
     * Read the current value of the clock.
     *
     * The clock is monotonic, therefore calling this function repeatedly will
     * produce a sequence of non-decreasing values.
     */
    now(): Promise<Instant>;
    /**
     * Query the resolution of the clock.
     */
    resolution(): Promise<Instant>;
    /**
     * Create a `pollable` which will resolve once the specified time has been
     * reached.
     */
    subscribe(when: Instant, absolute: boolean): Promise<Pollable>;
}
import type { Pollable } from "../imports/poll-poll";
export { Pollable };
/**
 * A timestamp in nanoseconds.
 */
export type Instant = bigint;
//# sourceMappingURL=clocks-monotonic-clock.d.ts.map
