export interface WasiExtFilesystemsMount {
  /**
   * Get Union FS descriptor where new Descriptor is overlayed in top of source-descriptor
   */
   getUnionDescriptor(sourceDescriptor: Descriptor): Promise<Descriptor>;
  /**
   * Populate descriptor from URL
   */
   getDescriptorByUrl(sourceUrl: string): Promise<Descriptor>;
  /**
   * Mount under Descriptor
   */
   mount(desc: Descriptor, args: MountArgs): Promise<void>;
  /**
   * Bind under Descriptor
   */
   bind(parentDescriptor: Descriptor, subDescriptor: Descriptor, destinationPath: string): Promise<void>;
}
import type { Descriptor } from '../interfaces/wasi-filesystem-types.js';
export { Descriptor };
/**
 * # Variants
 * 
 * ## `"access"`
 * 
 * Permission denied, similar to `EACCES` in POSIX.
 * ## `"would-block"`
 * 
 * Resource unavailable, or operation would block, similar to `EAGAIN` and `EWOULDBLOCK` in POSIX.
 * ## `"insufficient-memory"`
 * 
 * Not enough space, similar to `ENOMEM` in POSIX.
 * ## `"insufficient-space"`
 * 
 * No space left on device, similar to `ENOSPC` in POSIX.
 * ## `"unsupported"`
 * 
 * Not supported, similar to `ENOTSUP` and `ENOSYS` in POSIX.
 * ## `"invalid"`
 * 
 * Invalid parameters, similar to `EINVAL` in POSIX.
 */
export type ErrorCode = 'access' | 'would-block' | 'insufficient-memory' | 'insufficient-space' | 'unsupported' | 'invalid';
/**
 * Arguments to mount
 */
export interface MountArgs {
  sourceUrl: string,
  destinationPath: string,
}
