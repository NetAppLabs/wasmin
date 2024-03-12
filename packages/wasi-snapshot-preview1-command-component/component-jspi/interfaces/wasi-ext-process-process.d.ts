export namespace WasiExtProcessProcess {
  export { Process };
  export function  create(name: string): Promise<Process>;
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
  getProcessId(): Promise<ProcessId>;
  setArgv(argv: string[]): Promise<void>;
  setEnv(env: EnvVariable[]): Promise<void>;
  getStdin(): Promise<Descriptor>;
  getStdout(): Promise<Descriptor>;
  getStderr(): Promise<Descriptor>;
  getProcessControl(): Promise<Descriptor>;
  setRoot(root: Descriptor): Promise<void>;
  setCapabilities(caps: Capabilites): Promise<void>;
  start(): Promise<ProcessId>;
}
