export interface WasiCliStdin {
   getStdin(): InputStream;
}
import type { InputStream } from '../interfaces/wasi-io-streams.js';
export { InputStream };
