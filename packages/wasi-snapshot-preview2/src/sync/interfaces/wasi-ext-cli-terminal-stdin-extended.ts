export interface WasiExtCliTerminalStdinExtended {
  /**
   * If stdin is connected to a terminal, return a `terminal-input-extended` handle
   * allowing further interaction with it.
   */
   getTerminalStdin(): TerminalInputExtended | undefined;
  /**
   * convert to extended resource
   */
   toExtended(input: TerminalInput): TerminalInputExtended | undefined;
}
import type { TerminalInputExtended } from '../interfaces/wasi-ext-cli-terminal-input-extended.js';
export { TerminalInputExtended };
import type { TerminalInput } from '../interfaces/wasi-cli-terminal-input.js';
export { TerminalInput };
