export interface WasiCliTerminalOutputAsync {
  /**
   * Dispose of the specified terminal-output, after which it may no longer
   * be used.
   */
   dropTerminalOutput(this_: TerminalOutput): Promise<void>;
}
/**
 * The output side of a terminal.
 * 
 * This [represents a resource](https://github.com/WebAssembly/WASI/blob/main/docs/WitInWasi.md#Resources).
 */
export type TerminalOutput = number;
