export interface WasiCliStdin {
   getStdin(): Promise<InputStream>;
}
import type { InputStream } from '../interfaces/wasi-io-streams.js';
export { InputStream };
