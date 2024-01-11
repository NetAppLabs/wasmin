export interface WasiCliStdinAsync {
   getStdin(): Promise<InputStream>;
}
import type { InputStream } from '../interfaces/wasi-io-streams.js';
export { InputStream };
