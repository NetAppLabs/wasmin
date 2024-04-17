export namespace WasiCliStderr {
  export function  getStderr(): Promise<OutputStream>;
}
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
