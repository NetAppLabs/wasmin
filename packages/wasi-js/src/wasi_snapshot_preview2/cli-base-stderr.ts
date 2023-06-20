import { CliBaseStderrNamespace } from "@wasm-env/wasi-snapshot-preview2";
import { CliBaseStderrAsync, OutputStream } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-stderr";

export class CliBaseStderrAsyncHost implements CliBaseStderrAsync {
    async getStderr(): Promise<OutputStream> {
        //TODO: synchronize stderr numbering in openFiles
        const stderr_fd_no = 2;
        return stderr_fd_no;
    }

}