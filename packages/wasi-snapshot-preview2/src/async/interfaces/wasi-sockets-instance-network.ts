export interface WasiSocketsInstanceNetwork {
  /**
   * Get a handle to the default network.
   */
   instanceNetwork(): Promise<Network>;
}
import type { Network } from '../interfaces/wasi-sockets-network.js';
export { Network };
