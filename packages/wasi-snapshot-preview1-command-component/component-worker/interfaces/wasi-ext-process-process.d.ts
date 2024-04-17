export namespace WasiExtProcessProcess {
  export { Process };
  export function  create(name: string): Process;
}
export type ProcessId = bigint;
/**
 * # Variants
 * 
 * ## `"access"`
 * 
 * ## `"would-block"`
 * 
 * ## `"insufficient-memory"`
 * 
 * ## `"unsupported"`
 * 
 * ## `"invalid"`
 * 
 * ## `"not-started"`
 */
export type ErrorCode = 'access' | 'would-block' | 'insufficient-memory' | 'unsupported' | 'invalid' | 'not-started';
export type EnvVariable = [string, string];
import type { Descriptor } from '../interfaces/wasi-filesystem-types.js';
export { Descriptor };
export interface Capabilites {
  inherit?: boolean,
  none?: boolean,
  filesystem?: boolean,
  network?: boolean,
  all?: boolean,
}

export class Process {
  getProcessId(): ProcessId;
  setArgv(argv: string[]): void;
  setEnv(env: EnvVariable[]): void;
  getStdin(): Descriptor;
  getStdout(): Descriptor;
  getStderr(): Descriptor;
  getProcessControl(): Descriptor;
  setRoot(root: Descriptor): void;
  setCapabilities(caps: Capabilites): void;
  start(): ProcessId;
}
