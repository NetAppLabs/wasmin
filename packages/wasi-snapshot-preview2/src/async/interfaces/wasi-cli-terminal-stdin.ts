export interface WasiCliTerminalStdin {
  /**
   * If stdin is connected to a terminal, return a `terminal-input` handle
   * allowing further interaction with it.
   */
   getTerminalStdin(): Promise<TerminalInput | undefined>;
}
import type { TerminalInput } from '../interfaces/wasi-cli-terminal-input.js';
export { TerminalInput };
