export interface WasiCliTerminalStderrAsync {
  /**
   * If stderr is connected to a terminal, return a `terminal-output` handle
   * allowing further interaction with it.
   */
   getTerminalStderr(): Promise<TerminalOutput | undefined>;
}
import type { TerminalOutput } from '../interfaces/wasi-cli-terminal-output';
export { TerminalOutput };
