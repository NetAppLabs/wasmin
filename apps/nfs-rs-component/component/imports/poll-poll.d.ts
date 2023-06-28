export namespace PollPoll {
  export function dropPollable(this: Pollable): void;
  export function pollOneoff(in: Uint32Array): Uint8Array | ArrayBuffer;
}
export type Pollable = number;
