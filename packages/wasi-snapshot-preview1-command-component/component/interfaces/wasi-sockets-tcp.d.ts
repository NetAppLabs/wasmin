export namespace WasiSocketsTcp {
  export { TcpSocket };
}
import type { InputStream } from '../interfaces/wasi-io-streams.js';
export { InputStream };
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
import type { ErrorCode } from '../interfaces/wasi-sockets-network.js';
export { ErrorCode };
/**
 * # Variants
 * 
 * ## `"receive"`
 * 
 * ## `"send"`
 * 
 * ## `"both"`
 */
export type ShutdownType = 'receive' | 'send' | 'both';

export class TcpSocket {
  accept(): [TcpSocket, InputStream, OutputStream];
  shutdown(shutdownType: ShutdownType): void;
}
