//import { Console } from "node:console";
import { isBun } from "./util.js";
import * as fsSync from "node:fs";
import * as fs from "node:fs/promises";

let logToConsole = false;

export function setLogToConsole() {
    logToConsole = true;
}

function isFileLog() {
    return !logToConsole;
}

interface Logger {
    log(msg?: any, ...optionalParams: any[]): void;
    info(msg?: any, ...optionalParams: any[]): void;
    warn(msg?: any, ...optionalParams: any[]): void;
    error(msg?: any, ...optionalParams: any[]): void;
}

let underlyingLogger: Logger| undefined = undefined;

export async function getLogger(id?: string): Promise<Logger> {
    if (isFileLog()) {
        if (isBun()) {
            if (!underlyingLogger) {
                let outFileName = "out.log";
                let errFileName = "err.log";
                if (id) {
                    outFileName = `out-${id}.log`;
                    errFileName = `err-${id}.log`;
                }
                // @ts-ignore
                const outFile = Bun.file(outFileName);
                // @ts-ignore
                const errFile = Bun.file(errFileName);
                //console.log("bFile:", bFile);
                //const bunOutWriter = bFile.writer();
                //console.log("bunOutWriter:", bunOutWriter);
                const logger = new BunLogger(outFile, errFile);
                //underlyingLogger = logger;
                underlyingLogger = logger;
            }
            return underlyingLogger;
        } else {
            if (!underlyingLogger) {
                const cons = await import("node:console");
                const Console = cons.Console;
                let outFile = "out.log";
                let errFile = "out.log";
                if (id) {
                    outFile = `out-${id}.log`;
                    errFile = `err-${id}.log`;
                }
                const logger = new Console({
                    //stdout: fs.createWriteStream("out."+HostManagerInstance.self.id+".log"),
                    //stderr: fs.createWriteStream("err."+HostManagerInstance.self.id+".log"),
                    stdout: fsSync.createWriteStream(outFile),
                    stderr: fsSync.createWriteStream(errFile),
                });
                underlyingLogger=logger;
            }
            return underlyingLogger;
        }
    } else {
        return console;
    }
}

export class BunLogger {
    outFile: any;
    errFile: any;

    constructor(outFile: any, errFile: any) {
        this.outFile = outFile;
        this.errFile = errFile;
    }
    writeMsg(fil: any, msg?: any, ...optionalParams: any[]) {
        console.log("writemsg: ",msg);
        fil.writer().write(msg);
        if (optionalParams) {
            for (const param of optionalParams) {
                fil.writer().write(JSON.stringify(param));
            }
        }
        fil.writer().write("\n");
        fil.writer().flush();
    }
    log(msg?: any, ...optionalParams: any[]) {
        this.writeMsg(this.outFile, msg, ...optionalParams);
    }
    info(msg?: any, ...optionalParams: any[]) {
        this.writeMsg(this.outFile, msg, ...optionalParams);
    }
    error(msg?: any, ...optionalParams: any[]) {
        this.writeMsg(this.errFile, msg, ...optionalParams);
    }
    warn(msg?: any, ...optionalParams: any[]) {
        this.writeMsg(this.outFile, msg, ...optionalParams);
    }
}
