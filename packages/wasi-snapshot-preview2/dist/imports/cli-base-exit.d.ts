export interface CliBaseExit {
    /**
     * Exit the curerent instance and any linked instances.
     */
    exit(status: Result<void, void>): void;
}
export interface CliBaseExitAsync {
    /**
     * Exit the curerent instance and any linked instances.
     */
    exit(status: Result<void, void>): Promise<void>;
}
export type Result<T, E> = {
    tag: 'ok';
    val: T;
} | {
    tag: 'err';
    val: E;
};
//# sourceMappingURL=cli-base-exit.d.ts.map