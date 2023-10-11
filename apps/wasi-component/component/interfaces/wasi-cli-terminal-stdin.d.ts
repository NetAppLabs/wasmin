export namespace WasiCliTerminalStdin {
  export function getTerminalStdin(): TerminalInput | undefined;
}
import type { TerminalInput } from '../interfaces/wasi-cli-terminal-input';
export { TerminalInput };
