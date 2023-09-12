export interface HttpTypes {
    dropFields(fields: Fields): void;
    newFields(entries: [string, string][]): Fields;
    fieldsGet(fields: Fields, name: string): string[];
    fieldsSet(fields: Fields, name: string, value: string[]): void;
    fieldsDelete(fields: Fields, name: string): void;
    fieldsAppend(fields: Fields, name: string, value: string): void;
    fieldsEntries(fields: Fields): [string, string][];
    fieldsClone(fields: Fields): Fields;
    finishIncomingStream(s: IncomingStream): Trailers | null;
    finishOutgoingStream(s: OutgoingStream, trailers: Trailers | null): void;
    dropIncomingRequest(request: IncomingRequest): void;
    dropOutgoingRequest(request: OutgoingRequest): void;
    incomingRequestMethod(request: IncomingRequest): Method;
    incomingRequestPath(request: IncomingRequest): string;
    incomingRequestQuery(request: IncomingRequest): string;
    incomingRequestScheme(request: IncomingRequest): Scheme | null;
    incomingRequestAuthority(request: IncomingRequest): string;
    incomingRequestHeaders(request: IncomingRequest): Headers;
    incomingRequestConsume(request: IncomingRequest): IncomingStream;
    newOutgoingRequest(
        method: Method,
        path: string,
        query: string,
        scheme: Scheme | null,
        authority: string,
        headers: Headers
    ): OutgoingRequest;
    outgoingRequestWrite(request: OutgoingRequest): OutgoingStream;
    dropResponseOutparam(response: ResponseOutparam): void;
    setResponseOutparam(response: Result<OutgoingResponse, Error>): void;
    dropIncomingResponse(response: IncomingResponse): void;
    dropOutgoingResponse(response: OutgoingResponse): void;
    incomingResponseStatus(response: IncomingResponse): StatusCode;
    incomingResponseHeaders(response: IncomingResponse): Headers;
    incomingResponseConsume(response: IncomingResponse): IncomingStream;
    newOutgoingResponse(statusCode: StatusCode, headers: Headers): OutgoingResponse;
    outgoingResponseWrite(response: OutgoingResponse): OutgoingStream;
    dropFutureIncomingResponse(f: FutureIncomingResponse): void;
    futureIncomingResponseGet(f: FutureIncomingResponse): Result<IncomingResponse, Error> | null;
    listenToFutureIncomingResponse(f: FutureIncomingResponse): Pollable;
}
export interface HttpTypesAsync {
    dropFields(fields: Fields): Promise<void>;
    newFields(entries: [string, string][]): Promise<Fields>;
    fieldsGet(fields: Fields, name: string): Promise<string[]>;
    fieldsSet(fields: Fields, name: string, value: string[]): Promise<void>;
    fieldsDelete(fields: Fields, name: string): Promise<void>;
    fieldsAppend(fields: Fields, name: string, value: string): Promise<void>;
    fieldsEntries(fields: Fields): Promise<[string, string][]>;
    fieldsClone(fields: Fields): Promise<Fields>;
    finishIncomingStream(s: IncomingStream): Promise<Trailers | null>;
    finishOutgoingStream(s: OutgoingStream, trailers: Trailers | null): Promise<void>;
    dropIncomingRequest(request: IncomingRequest): Promise<void>;
    dropOutgoingRequest(request: OutgoingRequest): Promise<void>;
    incomingRequestMethod(request: IncomingRequest): Promise<Method>;
    incomingRequestPath(request: IncomingRequest): Promise<string>;
    incomingRequestQuery(request: IncomingRequest): Promise<string>;
    incomingRequestScheme(request: IncomingRequest): Promise<Scheme | null>;
    incomingRequestAuthority(request: IncomingRequest): Promise<string>;
    incomingRequestHeaders(request: IncomingRequest): Promise<Headers>;
    incomingRequestConsume(request: IncomingRequest): Promise<IncomingStream>;
    newOutgoingRequest(
        method: Method,
        path: string,
        query: string,
        scheme: Scheme | null,
        authority: string,
        headers: Headers
    ): Promise<OutgoingRequest>;
    outgoingRequestWrite(request: OutgoingRequest): Promise<OutgoingStream>;
    dropResponseOutparam(response: ResponseOutparam): Promise<void>;
    setResponseOutparam(response: Result<OutgoingResponse, Error>): Promise<void>;
    dropIncomingResponse(response: IncomingResponse): Promise<void>;
    dropOutgoingResponse(response: OutgoingResponse): Promise<void>;
    incomingResponseStatus(response: IncomingResponse): Promise<StatusCode>;
    incomingResponseHeaders(response: IncomingResponse): Promise<Headers>;
    incomingResponseConsume(response: IncomingResponse): Promise<IncomingStream>;
    newOutgoingResponse(statusCode: StatusCode, headers: Headers): Promise<OutgoingResponse>;
    outgoingResponseWrite(response: OutgoingResponse): Promise<OutgoingStream>;
    dropFutureIncomingResponse(f: FutureIncomingResponse): Promise<void>;
    futureIncomingResponseGet(f: FutureIncomingResponse): Promise<Result<IncomingResponse, Error> | null>;
    listenToFutureIncomingResponse(f: FutureIncomingResponse): Promise<Pollable>;
}
import type { InputStream } from "../imports/io-streams";
export { InputStream };
import type { OutputStream } from "../imports/io-streams";
export { OutputStream };
import type { Pollable } from "../imports/poll-poll";
export { Pollable };
export type StatusCode = number;
export type Scheme = SchemeHttp | SchemeHttps | SchemeOther;
export interface SchemeHttp {
    tag: "HTTP";
}
export interface SchemeHttps {
    tag: "HTTPS";
}
export interface SchemeOther {
    tag: "other";
    val: string;
}
export type ResponseOutparam = number;
export interface RequestOptions {
    connectTimeoutMs?: number;
    firstByteTimeoutMs?: number;
    betweenBytesTimeoutMs?: number;
}
export type OutgoingStream = OutputStream;
export type OutgoingResponse = number;
export type OutgoingRequest = number;
export type Method =
    | MethodGet
    | MethodHead
    | MethodPost
    | MethodPut
    | MethodDelete
    | MethodConnect
    | MethodOptions
    | MethodTrace
    | MethodPatch
    | MethodOther;
export interface MethodGet {
    tag: "get";
}
export interface MethodHead {
    tag: "head";
}
export interface MethodPost {
    tag: "post";
}
export interface MethodPut {
    tag: "put";
}
export interface MethodDelete {
    tag: "delete";
}
export interface MethodConnect {
    tag: "connect";
}
export interface MethodOptions {
    tag: "options";
}
export interface MethodTrace {
    tag: "trace";
}
export interface MethodPatch {
    tag: "patch";
}
export interface MethodOther {
    tag: "other";
    val: string;
}
export type IncomingStream = InputStream;
export type IncomingResponse = number;
export type IncomingRequest = number;
export type FutureIncomingResponse = number;
export type Fields = number;
export type Trailers = Fields;
export type Headers = Fields;
export type Error = ErrorInvalidUrl | ErrorTimeoutError | ErrorProtocolError | ErrorUnexpectedError;
export interface ErrorInvalidUrl {
    tag: "invalid-url";
    val: string;
}
export interface ErrorTimeoutError {
    tag: "timeout-error";
    val: string;
}
export interface ErrorProtocolError {
    tag: "protocol-error";
    val: string;
}
export interface ErrorUnexpectedError {
    tag: "unexpected-error";
    val: string;
}
export type Result<T, E> = { tag: "ok"; val: T } | { tag: "err"; val: E };
