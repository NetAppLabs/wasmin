export interface WasiCliTerminalStdout {
  /**
   * If stdout is connected to a terminal, return a `terminal-output` handle
   * allowing further interaction with it.
   */
   getTerminalStdout(): TerminalOutput | undefined;
}
import type { TerminalOutput } from '../interfaces/wasi-cli-terminal-output.js';
export { TerminalOutput };
