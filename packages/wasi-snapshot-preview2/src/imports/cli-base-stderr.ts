export interface CliBaseStderr {
   getStderr(): OutputStream;
}
export interface CliBaseStderrAsync {
   getStderr(): Promise<OutputStream>;
}
import type { OutputStream } from '../imports/io-streams';
export { OutputStream };
