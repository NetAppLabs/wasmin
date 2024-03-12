export namespace WasiExtCliTerminalStdinExtended {
  export function  getTerminalStdin(): Promise<TerminalInputExtended | undefined>;
}
import type { TerminalInputExtended } from '../interfaces/wasi-ext-cli-terminal-input-extended.js';
export { TerminalInputExtended };
