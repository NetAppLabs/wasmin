export interface WasiCliStdout {
   getStdout(): OutputStream;
}
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
