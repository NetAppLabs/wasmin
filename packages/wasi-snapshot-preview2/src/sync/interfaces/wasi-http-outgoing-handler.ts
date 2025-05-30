export interface WasiHttpOutgoingHandler {
  /**
   * This function is invoked with an outgoing HTTP Request, and it returns
   * a resource `future-incoming-response` which represents an HTTP Response
   * which may arrive in the future.
   * 
   * The `options` argument accepts optional parameters for the HTTP
   * protocol's transport layer.
   * 
   * This function may return an error if the `outgoing-request` is invalid
   * or not allowed to be made. Otherwise, protocol errors are reported
   * through the `future-incoming-response`.
   */
   handle(request: OutgoingRequest, options: RequestOptions | undefined): FutureIncomingResponse;
}
import type { OutgoingRequest } from '../interfaces/wasi-http-types.js';
export { OutgoingRequest };
import type { RequestOptions } from '../interfaces/wasi-http-types.js';
export { RequestOptions };
import type { FutureIncomingResponse } from '../interfaces/wasi-http-types.js';
export { FutureIncomingResponse };
import type { ErrorCode } from '../interfaces/wasi-http-types.js';
export { ErrorCode };
