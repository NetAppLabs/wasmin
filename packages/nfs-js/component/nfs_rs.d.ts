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
import { WasiIoStreams } from './interfaces/wasi-io-streams.js';
import { WasiPollPoll } from './interfaces/wasi-poll-poll.js';
import { WasiRandomRandom } from './interfaces/wasi-random-random.js';
import { WasiSocketsIpNameLookup } from './interfaces/wasi-sockets-ip-name-lookup.js';
import { WasiSocketsNetwork } from './interfaces/wasi-sockets-network.js';
import { WasiSocketsTcp } from './interfaces/wasi-sockets-tcp.js';
import { WasiSocketsTcpCreateSocket } from './interfaces/wasi-sockets-tcp-create-socket.js';
import { ComponentNfsRsNfs } from './interfaces/component-nfs-rs-nfs.js';
export interface ImportObject {
  'wasi:cli/environment': typeof WasiCliEnvironment,
  'wasi:cli/exit': typeof WasiCliExit,
  'wasi:cli/stderr': typeof WasiCliStderr,
  'wasi:cli/stdin': typeof WasiCliStdin,
  'wasi:cli/stdout': typeof WasiCliStdout,
  'wasi:cli/terminal-input': typeof WasiCliTerminalInput,
  'wasi:cli/terminal-output': typeof WasiCliTerminalOutput,
  'wasi:cli/terminal-stderr': typeof WasiCliTerminalStderr,
  'wasi:cli/terminal-stdin': typeof WasiCliTerminalStdin,
  'wasi:cli/terminal-stdout': typeof WasiCliTerminalStdout,
  'wasi:clocks/monotonic-clock': typeof WasiClocksMonotonicClock,
  'wasi:clocks/wall-clock': typeof WasiClocksWallClock,
  'wasi:filesystem/preopens': typeof WasiFilesystemPreopens,
  'wasi:filesystem/types': typeof WasiFilesystemTypes,
  'wasi:io/streams': typeof WasiIoStreams,
  'wasi:poll/poll': typeof WasiPollPoll,
  'wasi:random/random': typeof WasiRandomRandom,
  'wasi:sockets/ip-name-lookup': typeof WasiSocketsIpNameLookup,
  'wasi:sockets/network': typeof WasiSocketsNetwork,
  'wasi:sockets/tcp': typeof WasiSocketsTcp,
  'wasi:sockets/tcp-create-socket': typeof WasiSocketsTcpCreateSocket,
}
export interface Root {
  'component:nfs-rs/nfs': typeof ComponentNfsRsNfs,
  nfs: typeof ComponentNfsRsNfs,
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

