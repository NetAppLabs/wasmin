export namespace WasiExtFilesystemsMount {
  export function  mount(desc: Descriptor, sourceUrl: string, destinationPath: string): Promise<void>;
  export function  unmount(desc: Descriptor, destinationPath: string): Promise<void>;
  export function  mounts(desc: Descriptor): Promise<MountEntry[]>;
}
import type { Descriptor } from '../interfaces/wasi-filesystem-types.js';
export { Descriptor };
/**
 * # Variants
 * 
 * ## `"access"`
 * 
 * ## `"would-block"`
 * 
 * ## `"unsupported"`
 * 
 * ## `"invalid"`
 */
export type ErrorCode = 'access' | 'would-block' | 'unsupported' | 'invalid';
export interface MountEntry {
  path: string,
  source: string,
  attributes: string[],
}
