export interface WasiCliTerminalStdoutAsync {
  /**
   * If stdout is connected to a terminal, return a `terminal-output` handle
   * allowing further interaction with it.
   */
   getTerminalStdout(): Promise<TerminalOutput | undefined>;
}
import type { TerminalOutput } from '../interfaces/wasi-cli-terminal-output';
export { TerminalOutput };
