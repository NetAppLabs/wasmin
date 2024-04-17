export interface WasiFilesystemPreopens {
  /**
   * Return the set of preopened directories, and their path.
   */
   getDirectories(): [Descriptor, string][];
}
import type { Descriptor } from '../interfaces/wasi-filesystem-types.js';
export { Descriptor };
