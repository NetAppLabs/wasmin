/**
 * Copyright 2020 Google LLC
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
 */

import URL from "node:url";
import VM from "vm";
import threads from "node:worker_threads";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";



const WORKER = Symbol.for("worker");
const EVENTS = Symbol.for("events");

const NODE_WORKER_DEBUG = false;

function debugMessage(...args: any) {
    if (NODE_WORKER_DEBUG) {
        console.debug(...args);
    }
}

class EventTarget {
    constructor() {
        /*Object.defineProperty(this, EVENTS, {
            value: new Map(),
        });*/
    }
    _events = new Map();
    _onlisteners: Map<string, (params: any[]) => any> = new Map();
    get [EVENTS]() {
        return this._events;
    }
    get on() {
        return this._onlisteners;
    }

    //dispatchEvent(event: Event): boolean;
    dispatchEvent(event: any): boolean {
        event.target = event.currentTarget = this;
        const onevent = this.on.get(event.type);
        if (onevent) {
            try {
                onevent(event);
            } catch (err) {
                console.error(err);
            }
        }
        const list = this[EVENTS].get(event.type);
        if (list == null) return false;
        list.forEach((handler: any) => {
            try {
                handler.call(this, event);
            } catch (err) {
                console.error(err);
            }
        });
        return true;
    }
    //addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
    addEventListener(type: string, fn: any) {
        let events = this[EVENTS].get(type);
        if (!events) this[EVENTS].set(type, (events = []));
        events.push(fn);
    }
    removeEventListener(type: any, fn: any) {
        const events = this[EVENTS].get(type);
        if (events) {
            const index = events.indexOf(fn);
            if (index !== -1) events.splice(index, 1);
        }
    }
}

class WorkerEvent {
    constructor(type: string, target?: any) {
        this.type = type;
        this.timeStamp = Date.now();
        this.target = this.currentTarget = this.data = null;
    }
    public type: string;
    public timeStamp: number;
    public target: any;
    public currentTarget: any;
    public data: any;
}

// this module is used self-referentially on both sides of the
// thread boundary, but behaves differently in each context.
//export default threads.isMainThread ? mainThread() : workerThread();

export default mainThread();

const baseUrl = URL.pathToFileURL(process.cwd() + "/");

function mainThread() {
    /**
     * A web-compatible Worker implementation atop Node's worker_threads.
     *  - uses DOM-style events (Event.data, Event.type, etc)
     *  - supports event handler properties (worker.onmessage)
     *  - Worker() constructor accepts a module URL
     *  - accepts the {type:'module'} option
     *  - emulates WorkerGlobalScope within the worker
     * @param {string} url  The URL or module specifier to load
     * @param {object} [options]  Worker construction options
     * @param {string} [options.name]  Available as `self.name` within the Worker
     * @param {string} [options.type="classic"]  Pass "module" to create a Module Worker.
     */
    class Worker extends EventTarget {
        constructor(url: string, options: any) {
            super();
            const { name, type } = options || {};
            url += "";
            let mod: string;
            let doEval = false;
            if (/^data:/.test(url)) {
                debugMessage(`new Worker data: url: ${url}`)
                mod = url;
            }
            else if (/^file:/.test(url)) {
                debugMessage(`new Worker file: url: ${url}`)
                mod = URL.fileURLToPath(new URL.URL(url, baseUrl));
                debugMessage(`new Worker file: mod:`, mod)
            }
            else if (/^sea:/.test(url)) {
                debugMessage(`new Worker sea: url: ${url}`);
                let filePaths = url.split("/");
                let fileName = filePaths[filePaths.length-1];
                // replace .js to .mjs because of node issues for esm module worker
                fileName = fileName.replace(".js",".mjs")
                var binData = fs.readFileSync(url);

                //@ts-ignore
                //const tmpDir = globalThis.NODE_SEA_TMP_DIR;
                const tmpDir = "/tmp/wasmin-tmp";
                const filePath = path.join(tmpDir, fileName);
                const fileUrl = URL.pathToFileURL(filePath);
                const fileUrlString = fileUrl.toString();

                debugMessage("writing worker out to path", filePath);
                debugMessage("writing worker out to url ", fileUrl);
                debugMessage("writing worker out to url string ", fileUrlString);

                fs.writeFileSync(filePath, binData);

                mod = URL.fileURLToPath(new URL.URL(fileUrlString, baseUrl));
            } else {
                debugMessage(`new Worker else: url: ${url}`)
                debugMessage(`node worker: url: ${url}`);
                debugMessage(`node worker: baseUrl: ${baseUrl}`);
                mod = url;
            }
            const threadsWorker = new threads.Worker(mod, {
                workerData: { name, type },
                eval: doEval,
            });
            /*Object.defineProperty(this, WORKER, {
                value: worker,
            });*/
            this._worker = threadsWorker;
            threadsWorker.on("message", (data) => {
                const event = new WorkerEvent("message");
                event.data = data;
                this.dispatchEvent(event);
            });
            threadsWorker.on("error", (error: any) => {
                error.type = "error";
                debugMessage("threadsWorker.on error: ", error);
                this.dispatchEvent(error);
            });
            threadsWorker.on("exit", () => {
                debugMessage("threadsWorker.on exit: ");
                this.dispatchEvent(new WorkerEvent("close"));
            });
        }
        _worker: threads.Worker;
        get [WORKER]() {
            return this._worker;
        }
        postMessage(data: any, transferList: any) {
            this[WORKER].postMessage(data, transferList);
        }
        terminate() {
            this[WORKER].terminate();
        }

        onmessage(msg: any) {
            debugMessage("node.Worker onmessage: ", msg);
        }
        onerror(msg: any) {
            debugMessage("node.Worker onerror: ", msg);
        }
        onmessageerror(msg: any) {
            debugMessage("node.Worker onmessageerror: ", msg);
        }
    }
    //Worker.prototype.onmessage = Worker.prototype.onerror = Worker.prototype.onclose = null;
    return Worker;
}

function workerThread() {
    const { mod, name, type } = threads.workerData;

    // turn global into a mock WorkerGlobalScope
    const workerThis = globalThis;

    // enqueue messages to dispatch after modules are loaded
    let q: Event[] | null = [];
    function flush() {
        const buffered = q;
        q = null;
        if (buffered) {
            buffered.forEach((event) => {
                workerThis.dispatchEvent(event);
            });
        }
    }
    if (threads.parentPort) {
        threads.parentPort.on("message", (data) => {
            const event = new WorkerEvent("message");
            event.data = data;
            const ev = event as unknown as Event;
            if (q == null) workerThis.dispatchEvent(ev);
            else q.push(ev);
        });
        threads.parentPort.on("error", (err) => {
            err.type = "Error";
            workerThis.dispatchEvent(err);
        });
    }

    class WorkerGlobalScope extends EventTarget {
        postMessage(data: any, transferList: readonly threads.TransferListItem[] | undefined) {
            if (threads.parentPort) {
                threads.parentPort.postMessage(data, transferList);
            }
        }
        // Emulates https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope/close
        close() {
            process.exit();
        }
    }
    let proto = Object.getPrototypeOf(global);
    delete proto.constructor;
    Object.defineProperties(WorkerGlobalScope.prototype, proto);
    proto = Object.setPrototypeOf(global, new WorkerGlobalScope());
    ["postMessage", "addEventListener", "removeEventListener", "dispatchEvent"].forEach((fn) => {
        proto[fn] = proto[fn].bind(global);
    });
    // @ts-ignore
    global.name = name;

    const isDataUrl = /^data:/.test(mod);
    if (type === "module") {
        import(mod)
            .catch((err) => {
                if (isDataUrl && err.message === "Not supported") {
                    console.warn(
                        "Worker(): Importing data: URLs requires Node 12.10+. Falling back to classic worker."
                    );
                    return evaluateDataUrl(mod, name);
                }
                console.error(err);
            })
            .then(flush);
    } else {
        try {
            if (/^data:/.test(mod)) {
                evaluateDataUrl(mod, name);
            } else {
                require(mod);
            }
        } catch (err) {
            console.error(err);
        }
        Promise.resolve().then(flush);
    }
}

function evaluateDataUrl(url: any, name: any) {
    const { data } = parseDataUrl(url);
    return VM.runInThisContext(data, {
        filename: "worker.<" + (name || "data:") + ">",
    });
}

function parseDataUrl(url: { match: (arg0: RegExp) => any[] }) {
    // eslint-disable-next-line prefer-const
    let [m, type, encoding, data] = url.match(/^data: *([^;,]*)(?: *; *([^,]*))? *,(.*)$/) || [];
    if (!m) throw Error("Invalid Data URL.");
    if (encoding)
        switch (encoding.toLowerCase()) {
            case "base64":
                data = Buffer.from(data, "base64").toString();
                break;
            default:
                throw Error('Unknown Data URL encoding "' + encoding + '"');
        }
    return { type, data };
}
