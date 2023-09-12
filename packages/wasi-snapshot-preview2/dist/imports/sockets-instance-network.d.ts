export interface SocketsInstanceNetwork {
    /**
     * Get a handle to the default network.
     */
    instanceNetwork(): Network;
}
export interface SocketsInstanceNetworkAsync {
    /**
     * Get a handle to the default network.
     */
    instanceNetwork(): Promise<Network>;
}
import type { Network } from "../imports/sockets-network";
export { Network };
//# sourceMappingURL=sockets-instance-network.d.ts.map
