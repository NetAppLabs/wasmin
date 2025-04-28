export namespace WasiIoPoll {
  export function poll(in_: Pollable[]): Uint32Array;
  export { Pollable };
}

export class Pollable {
  ready(): boolean;
  block(): void;
}
