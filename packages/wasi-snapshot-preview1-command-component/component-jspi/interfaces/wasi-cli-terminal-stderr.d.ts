export namespace WasiCliTerminalStderr {
  export function  getTerminalStderr(): Promise<TerminalOutput | undefined>;
}
import type { TerminalOutput } from '../interfaces/wasi-cli-terminal-output.js';
export { TerminalOutput };
