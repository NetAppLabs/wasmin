import { HttpOutgoingHandlerNamespace as httpo } from "@netapplabs/wasi-snapshot-preview2/async";
import { HttpTypesNamespace as httpt } from "@netapplabs/wasi-snapshot-preview2/async";
import { IoStreamsNamespace as ion } from "@netapplabs/wasi-snapshot-preview2/async";

import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { wasiPreview2Debug } from "../../wasiDebug.js";
import { DummyPollable, InStream } from "./io.js";
import { Resource } from "../../wasiResources.js";
import { Peekable, Readable } from "../../wasiFileSystem.js";

type WasiHttpTypes = httpt.WasiHttpTypes;
type WasiHttpOutgoingHandler = httpo.WasiHttpOutgoingHandler;

type FutureIncomingResponse = httpt.FutureIncomingResponse;
type OutgoingRequest = httpt.OutgoingRequest;
type RequestOptions = httpt.RequestOptions;
type ErrorCode = httpt.ErrorCode;
type Error = ion.Error;
type IncomingResponse = httpt.IncomingResponse;
type Fields = httpt.Fields;
type IncomingBody = httpt.IncomingBody;

export class WasiHttpOutgoingHandlerAsyncHost implements WasiHttpOutgoingHandler {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    async handle(request: OutgoingRequest, options: RequestOptions | undefined): Promise<FutureIncomingResponse> {
        let req = await httpOutgoingRequestToFetchRequest(request, options);
        if (req !== undefined) {
            try {
                let res = await fetch(req);
                let ret = await fetchResponseToFutureIncomingResponse(this.wasiEnv, res);
                return ret;
            } catch (err: any) {
                wasiPreview2Debug("WasiHttpOutgoingHandlerAsyncHost: handle err: ", err);
            }
        }
        throw 'internal-error';
    }
}

export class WasiHttpTypesAsyncHost implements WasiHttpTypes {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

    async httpErrorCode(err: Error): Promise<ErrorCode | undefined> {
        throw new Error("Method not implemented.");
    }
}

export class FieldsInstance implements Fields, Resource {
    response: Response;
    resource: number;
    _wasiEnv: WasiEnv;
    decoder = new TextDecoder();
    encoder = new TextEncoder();

    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    constructor(wasiOptions: WasiOptions, res: Response) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.response = res;
        this.resource = this.openFiles.addResource(this);
    }
    fromList(entries: [string, Uint8Array][]): Promise<httpt.Fields> {
        throw new Error("Method not implemented.");
    }
    async get(name: string): Promise<Uint8Array[]> {
        let headerValue = this.response.headers.get(name);
        if (headerValue !== null) {
            let arrVal = this.encoder.encode(headerValue);
            return [arrVal];
        }
        throw new Error("Method not implemented.");
    }
    async has(name: string): Promise<boolean> {
        let has = this.response.headers.has(name);
        return has;
    }
    async set(name: string, value: Uint8Array[]): Promise<void> {
        for (const val of value) {
            let headerValue = this.decoder.decode(val);
            this.response.headers.set(name, headerValue);    
        }
    }
    async 'delete'(name: string): Promise<void> {
        this.response.headers.delete(name);
    }
    async append(name: string, value: Uint8Array): Promise<void> {
        let headerValue = this.decoder.decode(value);
        this.response.headers.append(name, headerValue);
    }
    async entries(): Promise<[string, Uint8Array][]> {
        let ret: [string, Uint8Array][] = [];
        this.response.headers.forEach( (key, val) => {
            let headerValue = this.encoder.encode(val);
            let entry: [string, Uint8Array] = [key, headerValue];
            ret.push(entry);
        })
        return ret;
    }
    async clone(): Promise<httpt.Fields> {
        throw new Error("Method not implemented.");
    }
    async [Symbol.asyncDispose](): Promise<void>{
        await this.openFiles.disposeResource(this);
    }
}

export class IncomingBodyInstance implements IncomingBody, Readable, Peekable {
    response: Response;
    reader?: ReadableStreamBYOBReader;
    resource: number;
    _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    constructor(wasiOptions: WasiOptions, res: Response) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.response = res;
        this.resource = this.openFiles.addResource(this);
    }
    async read(len: number): Promise<Uint8Array> {
        let body = this.response.body;
        if (body !== undefined && this.reader == undefined) {
            this.reader = body?.getReader({ mode: "byob" });
        }
        if (this.reader == undefined ) {
            throw 'internal-error';
        }
        if (await this.reader?.closed ){
            return new Uint8Array(0);
        }
        let arr = new Uint8Array(len);
        this.reader?.read(arr);
        return arr;
    }

    async peek(): Promise<number> {
        const isClosed = await this.reader?.closed;
        if ( !isClosed ){
            // if not closed we assume we have at least 1 more bytes
            return 1;
        }
        return 0;
    }

    async stream(): Promise<httpt.InputStream> {
        let fd = this.resource;
        const closeFdOnStreamClose = false;
        let instream = new InStream(this.wasiEnv, fd, closeFdOnStreamClose);
        return instream;
    }
    async finish(this_: httpt.IncomingBody): Promise<httpt.FutureTrailers> {
        throw new Error("Method not implemented.");
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
}

export class IncomingResponseInstance implements IncomingResponse, Resource {
    response: Response;
    resource: number;
    _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    constructor(wasiOptions: WasiOptions, res: Response) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.response = res;
        this.resource = this.openFiles.addResource(this);
    }
    async status(): Promise<number> {
        let httpstatus = this.response.status;
        return httpstatus;
    }
    async headers(): Promise<httpt.Fields> {
        let fields = new FieldsInstance(this.wasiEnv, this.response);
        return fields;
    }
    async consume(): Promise<httpt.IncomingBody> {
        let incBody = new IncomingBodyInstance(this.wasiEnv, this.response);
        return incBody;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
}

export class FutureIncomingResponseInstance implements Resource, FutureIncomingResponse {
    response: Response;
    resource: number;
    _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    constructor(wasiOptions: WasiOptions, res: Response) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.response = res;
        this.resource = wasiEnv.openFiles.addResource(this);
    }
    
    async subscribe(): Promise<httpt.Pollable> {
        let pollable = new DummyPollable(this.openFiles, this.resource);
        return pollable;
    }

    async get(): Promise<httpt.Result<httpt.Result<httpt.IncomingResponse, httpo.ErrorCode>, void> | undefined> {
        let res = new IncomingResponseInstance(this.wasiEnv, this.response);
        let ret: httpt.Result<httpt.Result<httpt.IncomingResponse, httpo.ErrorCode>, void> | undefined= {
            tag: "ok",
            val: {
                tag: "ok",
                val: res,
            },
        }
        return ret;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
}

async function fetchResponseToFutureIncomingResponse(wasiEnv: WasiEnv, res: Response): Promise<FutureIncomingResponse> {

    let newRes = new FutureIncomingResponseInstance(wasiEnv, res);

    return newRes;
}

async function httpOutgoingRequestToFetchRequest(request: httpo.OutgoingRequest, options: httpo.RequestOptions | undefined) {
    let hscheme = await request.scheme();
    let scheme = "http";
    if (hscheme?.tag == "HTTP") {
        scheme = "http";
    } else if (hscheme?.tag == "HTTPS") {
        scheme = "https";
    } else {
        throw new Error("Unsupported scheme other");
    }
    let hmethod = await request.method();
    let method = "GET";
    if (hmethod?.tag == "other") {
        throw new Error("Unsupported method other");
    } else {
        method = hmethod.tag;
    }

    let hostname = await request.authority();
    let pathWithQuery = await request.pathWithQuery();
    let sUrl: RequestInfo = `${scheme}://${hostname}/${pathWithQuery}`;

    const httpHeaders = new Headers();
    const hHeaders = await request.headers();
    const decoder = new TextDecoder();

    for (const [hKey,hval] of await hHeaders.entries()) {
        let headerKey = hKey;
        // TODO: look into ascii support
        const headerValue = decoder.decode(hval);
        httpHeaders.append(headerKey, headerValue);
    }
    
    // Request body not possible to read from
    request.body();

    let cacheOptions: RequestCache = "default";
    let requestMode: RequestMode = "cors";
    let reqBody: BodyInit| undefined;
    let creds: RequestCredentials| undefined;
    let redirect: RequestRedirect | undefined;
    let referrer: string | undefined; // URL , "no-referrer" or "about:client",
    let referrerPolicy: ReferrerPolicy | undefined;
    let integrity: string | undefined;
    let keepalive: boolean | undefined;
    let signal: AbortSignal | null = null;

    const httpOptions: RequestInit = {
        method: method,
        headers: httpHeaders,
        body: reqBody,
        mode: requestMode,
        credentials: creds,
        cache: cacheOptions,
        redirect: redirect,
        referrer: referrer,
        referrerPolicy: referrerPolicy,
        integrity: integrity,
        keepalive: keepalive,
        signal: signal,
    };
    let req = new Request(sUrl, httpOptions);
    return req;
}

