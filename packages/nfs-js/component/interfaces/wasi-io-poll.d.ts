export namespace WasiIoPoll {
  export function poll(in_: Array<Pollable>): Uint32Array;
  export { Pollable };
}

export class Pollable {
}
