export interface WasiCliExit {
  /**
   * Exit the current instance and any linked instances.
   */
   exit(status: Result<void, void>): Promise<void>;
}
export type Result<T, E> = { tag: 'ok', val: T } | { tag: 'err', val: E };
