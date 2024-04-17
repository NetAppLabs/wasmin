export interface WasiExtCliTerminalStdoutExtended {
  /**
   * If stdout is connected to a terminal, return a `terminal-output-extended` handle
   * allowing further interaction with it.
   */
   getTerminalStdout(): TerminalOutputExtended | undefined;
  /**
   * convert to extended resource
   */
   toExtended(input: TerminalOutput): TerminalOutputExtended | undefined;
}
import type { TerminalOutputExtended } from '../interfaces/wasi-ext-cli-terminal-output-extended.js';
export { TerminalOutputExtended };
import type { TerminalOutput } from '../interfaces/wasi-cli-terminal-output.js';
export { TerminalOutput };
