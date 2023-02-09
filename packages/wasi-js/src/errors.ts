import { Errno } from "./wasi_snapshot_preview1/bindings.js";

export class SystemError extends Error {
    constructor(public readonly code: Errno|number, public readonly ignore = false) {
        super(`Errno${code}`);
    }
}
