export interface WasiExtProcessProcess {
  /**
   * Process ID - returns None if not started
   */
  /**
   * optional exported Descriptor from process
   * exported-descriptor: func() -> option<descriptor>;
   * Start Process
   */
  /**
   * Terminate Process
   */
  /**
   * Execute process
   * Equivalent to calling create and then calling start
   */
   exec(name: string, args: ExecArgs | undefined): Promise<Process>;
  /**
   * Create process - do not start it
   */
   create(name: string, args: ExecArgs | undefined): Promise<Process>;
  /**
   * List of processes
   */
   processes(): Promise<Process[]>;
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

export interface Process extends AsyncDisposable {
  getProcessId(): Promise<ProcessId | undefined>;
  getName(): Promise<string>;
  getArgv(): Promise<string[] | undefined>;
  getEnv(): Promise<EnvVariable[] | undefined>;
  getStdin(): Promise<OutputStream>;
  setStdin(stdin: OutputStream): Promise<void>;
  getStdout(): Promise<InputStream>;
  setStdout(stdout: InputStream): Promise<void>;
  getStderr(): Promise<InputStream>;
  setStderr(stderr: InputStream): Promise<void>;
  getStatus(): Promise<ProcessStatus>;
  getParent(): Promise<Process | undefined>;
  getChildren(): Promise<Process[] | undefined>;
  getRoot(): Promise<Descriptor | undefined>;
  getCapabilities(): Promise<Capabilites | undefined>;
  getTimeStart(): Promise<Datetime>;
  getTimeEnd(): Promise<Datetime>;
  start(): Promise<ProcessId>;
  terminate(): Promise<void>;
}
