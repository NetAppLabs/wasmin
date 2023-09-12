export interface CliBasePreopens {
    /**
     * Return the set of of preopened directories, and their path.
     */
    getDirectories(): [Descriptor, string][];
}
export interface CliBasePreopensAsync {
    /**
     * Return the set of of preopened directories, and their path.
     */
    getDirectories(): Promise<[Descriptor, string][]>;
}
import type { Descriptor } from "../imports/filesystem-filesystem";
export { Descriptor };
import type { InputStream } from "../imports/io-streams";
export { InputStream };
import type { OutputStream } from "../imports/io-streams";
export { OutputStream };
//# sourceMappingURL=cli-base-preopens.d.ts.map
