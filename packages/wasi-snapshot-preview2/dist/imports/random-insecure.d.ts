export interface RandomInsecure {
    /**
     * Return `len` insecure pseudo-random bytes.
     *
     * This function is not cryptographically secure. Do not use it for
     * anything related to security.
     *
     * There are no requirements on the values of the returned bytes, however
     * implementations are encouraged to return evenly distributed values with
     * a long period.
     */
    getInsecureRandomBytes(len: bigint): Uint8Array | ArrayBuffer;
    /**
     * Return an insecure pseudo-random `u64` value.
     *
     * This function returns the same type of pseudo-random data as
     * `get-insecure-random-bytes`, represented as a `u64`.
     */
    getInsecureRandomU64(): bigint;
}
export interface RandomInsecureAsync {
    /**
     * Return `len` insecure pseudo-random bytes.
     *
     * This function is not cryptographically secure. Do not use it for
     * anything related to security.
     *
     * There are no requirements on the values of the returned bytes, however
     * implementations are encouraged to return evenly distributed values with
     * a long period.
     */
    getInsecureRandomBytes(len: bigint): Promise<Uint8Array | ArrayBuffer>;
    /**
     * Return an insecure pseudo-random `u64` value.
     *
     * This function returns the same type of pseudo-random data as
     * `get-insecure-random-bytes`, represented as a `u64`.
     */
    getInsecureRandomU64(): Promise<bigint>;
}
//# sourceMappingURL=random-insecure.d.ts.map