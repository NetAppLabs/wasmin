import { CliBaseStdoutNamespace } from "@wasm-env/wasi-snapshot-preview2";
import { CliBaseStdoutAsync, OutputStream } from "@wasm-env/wasi-snapshot-preview2/dist/imports/cli-base-Stdout";

export class CliBaseStdoutAsyncHost implements CliBaseStdoutAsync {
    async getStdout(): Promise<OutputStream> {
        //TODO: synchronize stdin numbering in openFiles
        const stdout_fd_no = 1;
        return stdout_fd_no;
    }

}