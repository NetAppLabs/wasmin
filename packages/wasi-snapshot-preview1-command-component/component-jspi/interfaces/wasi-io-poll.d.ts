export namespace WasiIoPoll {
  export function  poll(in_: Pollable[]): Promise<Uint32Array>;
  export { Pollable };
}

export class Pollable {
}
