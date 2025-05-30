export interface WasiExtProcessProcess {
  /**
   * Process ID - returns None if not started
   */
  /**
   * get-stdin-stream: func() -> output-stream;
   */
  /**
   * get-stdout-stream: func() -> input-stream;
   */
  /**
   * get-stderr-stream: func() -> input-stream;
   */
  /**
   * get-process-control-stream: func() -> input-stream;
   */
  /**
   * Start Process
   */
  /**
   * Terminate Process
   */
  /**
   * Shorthand Execute process
   * Equivalent to calling create, then setting variables then calling start
   */
   exec(name: string, args: ExecArgs | undefined): Process;
  /**
   * Create process - do not start it
   */
   create(name: string): Process;
  /**
   * List of processes
   */
   processes(): Process[];
}
import type { InputStream } from '../interfaces/wasi-io-streams.js';
export { InputStream };
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
import type { Descriptor } from '../interfaces/wasi-filesystem-types.js';
export { Descriptor };
import type { Datetime } from '../interfaces/wasi-clocks-wall-clock.js';
export { Datetime };
export type ProcessId = bigint;
export type EnvVariable = [string, string];
export interface Capabilites {
  /**
   * inherit capabilities from parent process
   */
  inherit?: boolean,
  /**
   * no capabilities
   */
  none?: boolean,
  /**
   * only filesystem
   */
  filesystem?: boolean,
  /**
   * network
   */
  network?: boolean,
  /**
   * all capabilities
   */
  all?: boolean,
}
/**
 * # Variants
 * 
 * ## `"created"`
 * 
 * ## `"running"`
 * 
 * ## `"waiting"`
 * 
 * ## `"terminated"`
 */
export type ProcessStatus = 'created' | 'running' | 'waiting' | 'terminated';
/**
 * # Variants
 * 
 * ## `"access"`
 * 
 * Permission denied, similar to `EACCES` in POSIX.
 * ## `"would-block"`
 * 
 * Resource unavailable, or operation would block, similar to `EAGAIN` and `EWOULDBLOCK` in POSIX.
 * ## `"insufficient-memory"`
 * 
 * Not enough space, similar to `ENOMEM` in POSIX.
 * ## `"unsupported"`
 * 
 * Not supported, similar to `ENOTSUP` and `ENOSYS` in POSIX.
 * ## `"invalid"`
 * 
 * Invalid executable, similar to `EINVAL` or `ENOEXEC` in POSIX.
 * ## `"not-started"`
 * 
 * Process in not yet started
 */
export type ErrorCode = 'access' | 'would-block' | 'insufficient-memory' | 'unsupported' | 'invalid' | 'not-started';
export interface ExecArgs {
  /**
   * optional args - argv[0] contains name of the program like POSIX
   */
  argv?: string[],
  /**
   * optional environment variables
   */
  env?: EnvVariable[],
  /**
   * root descriptor of process - may be none
   */
  root?: Descriptor,
  /**
   * capabilities
   */
  capabilities?: Capabilites,
}

export interface Process extends Disposable {
  getProcessId(): ProcessId;
  getName(): string;
  getArgv(): string[] | undefined;
  setArgv(argv: string[]): void;
  getEnv(): EnvVariable[] | undefined;
  setEnv(env: EnvVariable[]): void;
  getStdin(): Descriptor;
  getStdout(): Descriptor;
  getStderr(): Descriptor;
  getProcessControl(): Descriptor;
  getStatus(): ProcessStatus;
  getParent(): Process | undefined;
  getChildren(): Process[] | undefined;
  getRoot(): Descriptor | undefined;
  setRoot(root: Descriptor): void;
  getCapabilities(): Capabilites | undefined;
  setCapabilities(caps: Capabilites): void;
  getTimeStart(): Datetime | undefined;
  getTimeEnd(): Datetime | undefined;
  start(): ProcessId;
  terminate(): void;
}
