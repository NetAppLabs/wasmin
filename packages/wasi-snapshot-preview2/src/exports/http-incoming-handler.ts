export interface HttpIncomingHandler {
    handle(request: IncomingRequest, responseOut: ResponseOutparam): void;
}
export interface HttpIncomingHandlerAsync {
    handle(request: IncomingRequest, responseOut: ResponseOutparam): Promise<void>;
}
import type { IncomingRequest } from "../imports/http-types";
export { IncomingRequest };
import type { ResponseOutparam } from "../imports/http-types";
export { ResponseOutparam };
