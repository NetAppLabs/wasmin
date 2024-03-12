export interface WasiExtFilesystemsMount {
  /**
   * Get Union FS descriptor where new Descriptor is overlayed in top of source-descriptor
   */
   getUnionDescriptor(sourceDescriptor: Descriptor): Descriptor;
  /**
   * Populate descriptor from URL
   */
   getDescriptorByUrl(sourceUrl: string): Descriptor;
  /**
   * Mount under Descriptor
   */
   mount(desc: Descriptor, sourceUrl: string, destinationPath: string): void;
  /**
   * Bind under Descriptor
   */
   bind(parentDescriptor: Descriptor, subDescriptor: Descriptor, destinationPath: string): void;
  /**
   * Un Mount from Descriptor
   */
   unmount(desc: Descriptor, destinationPath: string): void;
  /**
   * List mount under descriptor
   */
   mounts(desc: Descriptor): MountEntry[];
}
import type { Descriptor } from '../interfaces/wasi-filesystem-types.js';
export { Descriptor };
export interface MountEntry {
  path: string,
  source: string,
  attributes: string[],
}
/**
 * # Variants
 * 
 * ## `"access"`
 * 
 * Permission denied, similar to `EACCES` in POSIX.
 * ## `"would-block"`
 * 
 * Resource unavailable, or operation would block, similar to `EAGAIN` and `EWOULDBLOCK` in POSIX.
 * ## `"unsupported"`
 * 
 * Not supported, similar to `ENOTSUP` and `ENOSYS` in POSIX.
 * ## `"invalid"`
 * 
 * Invalid parameters, similar to `EINVAL` in POSIX.
 */
export type ErrorCode = 'access' | 'would-block' | 'unsupported' | 'invalid';
