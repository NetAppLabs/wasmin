export interface WasiCliTerminalInputAsync {
  /**
   * Dispose of the specified terminal-input after which it may no longer
   * be used.
   */
   dropTerminalInput(this_: TerminalInput): Promise<void>;
}
/**
 * The input side of a terminal.
 * 
 * This [represents a resource](https://github.com/WebAssembly/WASI/blob/main/docs/WitInWasi.md#Resources).
 */
export type TerminalInput = number;
