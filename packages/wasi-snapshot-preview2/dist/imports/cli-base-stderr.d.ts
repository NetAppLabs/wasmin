export interface CliBaseStderr {
    getStderr(): OutputStream;
}
export interface CliBaseStderrAsync {
    getStderr(): Promise<OutputStream>;
}
import type { OutputStream } from "../imports/io-streams";
export { OutputStream };
//# sourceMappingURL=cli-base-stderr.d.ts.map
