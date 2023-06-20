export interface CliBaseStdout {
    getStdout(): OutputStream;
}
export interface CliBaseStdoutAsync {
    getStdout(): Promise<OutputStream>;
}
import type { OutputStream } from '../imports/io-streams';
export { OutputStream };
//# sourceMappingURL=cli-base-stdout.d.ts.map