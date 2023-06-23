import { Process } from "./types";
import { Readable, WASI, Writable } from "@wasm-env/wasi-js";

import { Logger } from "./log";
import { CreateProcessId } from "./util";

/*function randomBytes(count: number) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webcrypto = require("crypto").webcrypto;
    const arr = new Uint8Array(count);
    return webcrypto.getRandomValues(arr);
}*/

class BufferedInOut implements Writable, Readable {
    buf!: Uint8Array;
    async write(data: Uint8Array): Promise<void> {
        //throw new Error("Method not implemented.");
        const textdecoder = new TextDecoder();
        const str = textdecoder.decode(data);
        Logger.log(str);
        return;
    }
    read(len: number): Promise<Uint8Array> {
        throw new Error("Method not implemented.");
    }
}

class ProcessInfo {
    constructor(process: Process, wasi: WASI) {
        this.process = process;
        this.wasi = wasi;
    }
    process: Process;
    wasi: WASI;
    abortController?: AbortController;
}

export class ProcessManager {
    processList: ProcessInfo[] = [];
    async create(process: Process): Promise<Process> {
        Logger.log("process.create");
        process.status = "created";

        if (!process.id) {
            process.id = CreateProcessId();
        }
        Logger.log("process.create process.cmd: ", process.cmd, " id: ", process.id);

        const p = await this.start(process);
        return process;
    }

    async start(process: Process): Promise<Process> {
        const wasmBinaryUrl = process.cmd;

        const buf = await fetch(wasmBinaryUrl);
        const resp = await buf.arrayBuffer();
        const mod = await WebAssembly.compile(resp);

        const stdin = new BufferedInOut();
        const stdout = new BufferedInOut();
        const stderr = new BufferedInOut();

        try {
            const abortController = new AbortController();
            const w = new WASI({
                abortSignal: abortController.signal,
                //openFiles: openFiles,
                stdin: stdin,
                stdout: stdout,
                stderr: stderr,
                args: process.args,
                env: process.env,
                //tty: tty,
            });
            const pInfo = new ProcessInfo(process, w);
            pInfo.abortController = abortController;
            this.processList.push(pInfo);

            /*const statusCode = await w.run(mod);
            if (statusCode !== 0) {
              Logger.log(`Exit code: ${statusCode}`);
            }*/
            process.status = "running";
            w.run(mod)
                .then(() => {
                    Logger.log("in run then");
                })
                .catch((err: any) => {
                    process.status = "terminated";
                    Logger.log("in run catch err:", err);
                })
                .finally(() => {
                    process.status = "terminated";
                    Logger.log("in run finally");
                });
        } catch (err: any) {
            Logger.log("in try catch");
            Logger.error(err.message);
        } finally {
            Logger.log("in try finally");
        }
        return process;
    }

    async map(): Promise<Record<string, Process>> {
        const pMap: Record<string, Process> = {};
        for (const p of this.processList) {
            const proc = p.process;
            if (proc.id) {
                pMap[proc.id] = proc;
            }
        }
        Logger.log("listing processes");
        return pMap;
    }

    async getProcessInfo(id: string): Promise<ProcessInfo> {
        for (const p of await this.processList) {
            if (p.process.id == id) {
                return p;
            }
        }
        throw new Error("process with id: " + id + " not found");
    }

    async getProcess(id: string): Promise<Process> {
        const pmap = await this.map();
        const proc = pmap[id];
        if (proc) {
            return proc;
        }
        throw new Error("process with id: " + id + " not found");
    }

    async killProcess(id: string): Promise<boolean> {
        Logger.log("killing processes ", id);
        const p = await this.getProcessInfo(id);
        if (p.abortController) {
            const abortc = p.abortController;
            try {
                abortc.abort();
            } catch (err: any) {
                Logger.log("catched err: ", err);
            }
        }
        return true;
    }
}
