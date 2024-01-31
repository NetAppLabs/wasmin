export interface WasiCliStdoutAsync {
    getStdout(): Promise<OutputStream>;
}
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
