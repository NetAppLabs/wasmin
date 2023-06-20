export interface CliBaseStdin {
    getStdin(): InputStream;
}
export interface CliBaseStdinAsync {
    getStdin(): Promise<InputStream>;
}
import type { InputStream } from '../imports/io-streams';
export { InputStream };
//# sourceMappingURL=cli-base-stdin.d.ts.map