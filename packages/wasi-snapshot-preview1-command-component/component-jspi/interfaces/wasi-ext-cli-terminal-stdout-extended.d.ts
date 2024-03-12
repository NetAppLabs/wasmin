export namespace WasiExtCliTerminalStdoutExtended {
  export function  getTerminalStdout(): Promise<TerminalOutputExtended | undefined>;
}
import type { TerminalOutputExtended } from '../interfaces/wasi-ext-cli-terminal-output-extended.js';
export { TerminalOutputExtended };
