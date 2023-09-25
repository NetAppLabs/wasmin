export interface WasiCliStderrAsync {
   getStderr(): Promise<OutputStream>;
}
import type { OutputStream } from '../interfaces/wasi-io-streams';
export { OutputStream };
