import { Process } from "./types.js";
import { getLogger } from "./log.js";
import { CreateProcessId } from "./util.js";

import { Readable, WASI, Writable } from "@wasm-env/wasi-js";


/*function randomBytes(count: number) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webcrypto = require("crypto").webcrypto;
    const arr = new Uint8Array(count);
    return webcrypto.getRandomValues(arr);
}*/

class BufferedInOut implements Writable, Readable {
    buf!: Uint8Array;
    async write(data: Uint8Array): Promise<void> {
        const logger = await getLogger();
        //throw new Error("Method not implemented.");
        const textdecoder = new TextDecoder();
        const str = textdecoder.decode(data);
        logger.log(str);
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
        const logger = await getLogger();

        logger.log("process.create");
        process.status = "created";

        if (!process.id) {
            process.id = CreateProcessId();
        }
        logger.log("process.create process.cmd: ", process.cmd, " id: ", process.id);

        const p = await this.start(process);
        return process;
    }

    async start(process: Process): Promise<Process> {
        const logger = await getLogger();

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
                    logger.log("in run then");
                })
                .catch((err: any) => {
                    process.status = "terminated";
                    logger.log("in run catch err:", err);
                })
                .finally(() => {
                    process.status = "terminated";
                    logger.log("in run finally");
                });
        } catch (err: any) {
            logger.log("in try catch");
            logger.error(err.message);
        } finally {
            logger.log("in try finally");
        }
        return process;
    }

    async map(): Promise<Record<string, Process>> {
        const logger = await getLogger();

        const pMap: Record<string, Process> = {};
        for (const p of this.processList) {
            const proc = p.process;
            if (proc.id) {
                pMap[proc.id] = proc;
            }
        }
        logger.log("listing processes");
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
        const logger = await getLogger();

        logger.log("killing processes ", id);
        const p = await this.getProcessInfo(id);
        if (p.abortController) {
            const abortc = p.abortController;
            try {
                abortc.abort();
            } catch (err: any) {
                logger.log("catched err: ", err);
            }
        }
        return true;
    }
}
