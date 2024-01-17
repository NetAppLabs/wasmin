import { WasiCliEnvironment } from './interfaces/wasi-cli-environment.js';
import { WasiCliExit } from './interfaces/wasi-cli-exit.js';
import { WasiCliStderr } from './interfaces/wasi-cli-stderr.js';
import { WasiCliStdin } from './interfaces/wasi-cli-stdin.js';
import { WasiCliStdout } from './interfaces/wasi-cli-stdout.js';
import { WasiCliTerminalInput } from './interfaces/wasi-cli-terminal-input.js';
import { WasiCliTerminalOutput } from './interfaces/wasi-cli-terminal-output.js';
import { WasiCliTerminalStderr } from './interfaces/wasi-cli-terminal-stderr.js';
import { WasiCliTerminalStdin } from './interfaces/wasi-cli-terminal-stdin.js';
import { WasiCliTerminalStdout } from './interfaces/wasi-cli-terminal-stdout.js';
import { WasiClocksMonotonicClock } from './interfaces/wasi-clocks-monotonic-clock.js';
import { WasiClocksWallClock } from './interfaces/wasi-clocks-wall-clock.js';
import { WasiFilesystemPreopens } from './interfaces/wasi-filesystem-preopens.js';
import { WasiFilesystemTypes } from './interfaces/wasi-filesystem-types.js';
import { WasiIoError } from './interfaces/wasi-io-error.js';
import { WasiIoPoll } from './interfaces/wasi-io-poll.js';
import { WasiIoStreams } from './interfaces/wasi-io-streams.js';
import { WasiRandomRandom } from './interfaces/wasi-random-random.js';
import { WasiSocketsNetwork } from './interfaces/wasi-sockets-network.js';
import { WasiSocketsTcp } from './interfaces/wasi-sockets-tcp.js';
import { WasiCliRun } from './interfaces/wasi-cli-run.js';
export interface ImportObject {
  'wasi:cli/environment@0.2.0-rc-2023-12-05': typeof WasiCliEnvironment,
  'wasi:cli/exit@0.2.0-rc-2023-12-05': typeof WasiCliExit,
  'wasi:cli/stderr@0.2.0-rc-2023-12-05': typeof WasiCliStderr,
  'wasi:cli/stdin@0.2.0-rc-2023-12-05': typeof WasiCliStdin,
  'wasi:cli/stdout@0.2.0-rc-2023-12-05': typeof WasiCliStdout,
  'wasi:cli/terminal-input@0.2.0-rc-2023-12-05': typeof WasiCliTerminalInput,
  'wasi:cli/terminal-output@0.2.0-rc-2023-12-05': typeof WasiCliTerminalOutput,
  'wasi:cli/terminal-stderr@0.2.0-rc-2023-12-05': typeof WasiCliTerminalStderr,
  'wasi:cli/terminal-stdin@0.2.0-rc-2023-12-05': typeof WasiCliTerminalStdin,
  'wasi:cli/terminal-stdout@0.2.0-rc-2023-12-05': typeof WasiCliTerminalStdout,
  'wasi:clocks/monotonic-clock@0.2.0-rc-2023-11-10': typeof WasiClocksMonotonicClock,
  'wasi:clocks/wall-clock@0.2.0-rc-2023-11-10': typeof WasiClocksWallClock,
  'wasi:filesystem/preopens@0.2.0-rc-2023-11-10': typeof WasiFilesystemPreopens,
  'wasi:filesystem/types@0.2.0-rc-2023-11-10': typeof WasiFilesystemTypes,
  'wasi:io/error@0.2.0-rc-2023-11-10': typeof WasiIoError,
  'wasi:io/poll@0.2.0-rc-2023-11-10': typeof WasiIoPoll,
  'wasi:io/streams@0.2.0-rc-2023-11-10': typeof WasiIoStreams,
  'wasi:random/random@0.2.0-rc-2023-11-10': typeof WasiRandomRandom,
  'wasi:sockets/network@0.2.0-rc-2023-11-10': typeof WasiSocketsNetwork,
  'wasi:sockets/tcp@0.2.0-rc-2023-11-10': typeof WasiSocketsTcp,
}
export interface Root {
  'wasi:cli/run@0.2.0-rc-2023-12-05': typeof WasiCliRun,
  run: typeof WasiCliRun,
}

/**
* Instantiates this component with the provided imports and
* returns a map of all the exports of the component.
*
* This function is intended to be similar to the
* `WebAssembly.instantiate` function. The second `imports`
* argument is the "import object" for wasm, except here it
* uses component-model-layer types instead of core wasm
* integers/numbers/etc.
*
* The first argument to this function, `compileCore`, is
* used to compile core wasm modules within the component.
* Components are composed of core wasm modules and this callback
* will be invoked per core wasm module. The caller of this
* function is responsible for reading the core wasm module
* identified by `path` and returning its compiled
* WebAssembly.Module object. This would use `compileStreaming`
* on the web, for example.
*/
export function instantiate(
compileCore: (path: string, imports: Record<string, any>) => Promise<WebAssembly.Module>,
imports: ImportObject,
instantiateCore?: (module: WebAssembly.Module, imports: Record<string, any>) => Promise<WebAssembly.Instance>
): Promise<Root>;

