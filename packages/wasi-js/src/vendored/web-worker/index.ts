
// Borrowed from repository https://github.com/developit/web-worker
// included and modified here because code is outdated


//type ConstructorOf<C> = { new (...args: any[]): C }
//
//declare const _default: ConstructorOf<Worker>;
//export default _de

interface AbstractWorker {
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

interface Worker extends EventTarget, AbstractWorker {
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
    const isNode = false;
    if (isNode) {
        const nodeImport = await import("./node.js");
        // @ts-ignore
        const nodeWorker = nodeImport.Worker;
        const w = new nodeWorker(scriptURL, options);
        return w;
    } else {
        return new Worker(scriptURL, options);
    }
}
