/** @module Interface wasi:io/poll@0.2.0 **/
export function poll(in_: Array<Pollable>): Uint32Array;

export class Pollable {
  /**
   * This type does not have a public constructor.
   */
  private constructor();
}
