export interface WasiCliStderr {
   getStderr(): OutputStream;
}
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
