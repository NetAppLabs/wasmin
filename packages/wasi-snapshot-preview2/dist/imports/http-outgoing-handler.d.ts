export interface HttpOutgoingHandler {
    handle(request: OutgoingRequest, options: RequestOptions | null): FutureIncomingResponse;
}
export interface HttpOutgoingHandlerAsync {
    handle(request: OutgoingRequest, options: RequestOptions | null): Promise<FutureIncomingResponse>;
}
import type { OutgoingRequest } from '../imports/http-types';
export { OutgoingRequest };
import type { RequestOptions } from '../imports/http-types';
export { RequestOptions };
import type { FutureIncomingResponse } from '../imports/http-types';
export { FutureIncomingResponse };
//# sourceMappingURL=http-outgoing-handler.d.ts.map