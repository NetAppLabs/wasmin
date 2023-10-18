// Borrowed from repository https://github.com/developit/web-worker
// included and modified here because code is outdated

import { transfer } from "comlink";
import { isNode } from "../../wasiUtils.js";

//type ConstructorOf<C> = { new (...args: any[]): C }
//
//declare const _default: ConstructorOf<Worker>;
//export default _default

export interface AbstractWorker {
    onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null;
    addEventListener<K extends keyof AbstractWorkerEventMap>(
        type: K,
        listener: (this: AbstractWorker, ev: AbstractWorkerEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof AbstractWorkerEventMap>(
        type: K,
        listener: (this: AbstractWorker, ev: AbstractWorkerEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;
}

export interface Worker extends EventTarget, AbstractWorker {
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
    onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null;
    postMessage(message: any, transfer: Transferable[]): void;
    postMessage(message: any, options?: StructuredSerializeOptions): void;
    terminate(): void;
    addEventListener<K extends keyof WorkerEventMap>(
        type: K,
        listener: (this: Worker, ev: WorkerEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof WorkerEventMap>(
        type: K,
        listener: (this: Worker, ev: WorkerEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void;
}

interface WorkerOptions {
    credentials?: RequestCredentials;
    name?: string;
    type?: WorkerType;
}

export default Worker;

export async function createWorker(scriptURL: string | URL, options?: WorkerOptions): Promise<Worker> {
    const forNode = isNode();
    if (forNode) {
        try {
            const nodeImport = await import("./node.js");
            const nodeWorker = nodeImport.default;
            let stringScriptUrl: string;
            if (scriptURL instanceof URL) {
                const sUrl = scriptURL as URL;
                stringScriptUrl = sUrl.toString();
            } else {
                stringScriptUrl = scriptURL;
            }
            const w = new nodeWorker(stringScriptUrl, options);
            return w;
        } catch (err: any) {
            console.log("createWorker err: ", err);
            throw err;
        }
    } else {
        const worker = new Worker(scriptURL, options);
        return worker;
        //const wProxy = new WorkerProxy(worker);
        //return wProxy;
    }
}

export class WorkerProxy implements Worker {
    private worker:Worker;
    constructor(worker: Worker) {
        this.worker = worker;
    }
    public get onmessageerror(): ((this: Worker, ev: MessageEvent<any>) => any) | null {
        return this.worker.onmessageerror;
    }
    public set onmessageerror(value: ((this: Worker, ev: MessageEvent<any>) => any) | null) {
        this.worker.onmessageerror = value;
    }
    public get onmessage(): ((this: Worker, ev: MessageEvent<any>) => any) | null {
        return this.worker.onmessage;
    }
    public set onmessage(value: ((this: Worker, ev: MessageEvent<any>) => any) | null) {
        console.log("onmessage: value:", value);
        this.worker.onmessageerror = value;
    }
    public get onerror(): ((this: AbstractWorker, ev: ErrorEvent) => any) | null {
        return this.worker.onerror;
    }
    public set onerror(value: ((this: AbstractWorker, ev: ErrorEvent) => any) | null) {
        this.worker.onerror = value;
    }

    postMessage(message: any, transfer: Transferable[]): void;
    postMessage(message: any, options?: StructuredSerializeOptions | undefined): void;
    postMessage(message: unknown, options?: any): void {
        console.log("postMessage: message:", message, "options: ", options)
        return this.worker.postMessage(message, options);
    }
    terminate(): void {
        return this.worker.terminate();
    }
    addEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
    addEventListener(type: unknown, listener: unknown, options?: unknown): void;
    addEventListener(type: any, listener: any, options?: any): void{
        return this.worker.addEventListener(type, listener, options);
    }
    removeEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker, ev: WorkerEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
    removeEventListener(type: any, listener: any, options?: any): void {
        return this.worker.removeEventListener(type, listener, options);
    }
    dispatchEvent(event: Event): boolean;
    dispatchEvent(event: Event): boolean;
    dispatchEvent(event: any): boolean {
        return this.worker.dispatchEvent(event);
    }
}