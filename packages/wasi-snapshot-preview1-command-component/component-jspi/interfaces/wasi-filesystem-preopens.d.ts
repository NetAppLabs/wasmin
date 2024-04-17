export namespace WasiFilesystemPreopens {
  export function  getDirectories(): Promise<[Descriptor, string][]>;
}
import type { Descriptor } from '../interfaces/wasi-filesystem-types.js';
export { Descriptor };
