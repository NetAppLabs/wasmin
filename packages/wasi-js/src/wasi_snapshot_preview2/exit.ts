//import { WASI } from "../wasi.js";
//import { WasiSnapshotPreview1AsyncHost } from "../wasi_snapshot_preview1/host.js";
import { Result } from "./imports/exit.js";

//const w = new WASI({});
//const wasip1 = new WasiSnapshotPreview1AsyncHost(w.wasiEnv);

export function exit(status: Result<void, void>): void {
    const result =
    //wasip1.procExit(result);
    console.log("exit - status:");
    console.log(status);
    return;
}