/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { isBun, isNodeorDeno } from "./utils.js";

export let CurrentLogger: Logger = console;

export type LoggerOutput = "console" | "file";

export interface LoggerSettings {
    output: LoggerOutput,
    fileNamePrefix?: string,
}

export let LoggerSettings: LoggerSettings = {
    output: 'console',
}

function isFileLog() {
    if (LoggerSettings.output == "file") {
        return true;
    }
    return false;
}

export async function initializeLogging(settings: LoggerSettings) {
    LoggerSettings = settings;
    CurrentLogger = await getLogger();
}

interface Logger {
    log(msg?: any, ...optionalParams: any[]): void;
    debug(msg?: any, ...optionalParams: any[]): void;
    info(msg?: any, ...optionalParams: any[]): void;
    warn(msg?: any, ...optionalParams: any[]): void;
    error(msg?: any, ...optionalParams: any[]): void;
}

export async function getLogger(prefix?: string): Promise<Logger> {
    if (isFileLog()) {
        if (prefix == undefined) {
            prefix = "wasmin";
        }
        let outFileName = prefix;
        if (!outFileName.endsWith(".log")) {
            outFileName = `${outFileName}.log`;
        }
        if (isBun()) {
            // @ts-ignore
            const outFile = Bun.file(outFileName);
            // @ts-ignore
            const outFileWriter = outFile.writer();
            const logger = new BunLogger(outFileWriter);
            return logger;
        } if (isNodeorDeno()){
            const cons = await import("node:console");
            const fsSync = await import("node:fs");
            const Console = cons.Console;
            const logger = new Console({
                stdout: fsSync.createWriteStream(outFileName),
            });
            return logger;
        } else {
            const logger = console;
            return logger;
        }
    } else {
        return console;
    }
}


export class BunLogger {
    outFile: any;
    errFile?: any;

    constructor(outFile: any, errFile?: any) {
        this.outFile = outFile;
        this.errFile = errFile;
    }
    writeMsg(fil: any, msg?: any, ...optionalParams: any[]) {
        const wr = fil;
        wr.write(msg);
        if (optionalParams) {
            for (const param of optionalParams) {
                wr.write(JSON.stringify(param));
            }
        }
        wr.write("\n");
        wr.flush();
    }
    log(msg?: any, ...optionalParams: any[]) {
        this.writeMsg(this.outFile, msg, ...optionalParams);
    }
    debug(msg?: any, ...optionalParams: any[]) {
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