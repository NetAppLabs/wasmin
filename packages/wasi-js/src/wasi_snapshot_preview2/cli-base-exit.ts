import { CliBaseExitNamespace as clib } from "@wasm-env/wasi-snapshot-preview2";
import { ExitStatus } from "../wasiUtils.js";
type Result<T, E> = clib.Result<T,E>;

export class CliBaseExitAsyncHost implements clib.CliBaseExitAsync{
    async exit(status: Result<void, void>): Promise<void> {
        let rval = 0;
        if (status.tag == 'ok') {
            rval = 0;
            console.log("CliBaseExitAsyncHost exit ok: ", status.val);
        } else if (status.tag == 'err') {
            console.log("CliBaseExitAsyncHost exit err: ", status.val);
            // TODO: figure out exit code
            rval = 1;
        }
        throw new ExitStatus(rval);
    }
}