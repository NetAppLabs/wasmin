export interface WasiCliStdout {
   getStdout(): Promise<OutputStream>;
}
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
