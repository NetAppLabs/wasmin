import { WasiCliEnvironment } from './imports/wasi-cli-environment';
import { WasiCliExit } from './imports/wasi-cli-exit';
import { WasiCliStderr } from './imports/wasi-cli-stderr';
import { WasiCliStdin } from './imports/wasi-cli-stdin';
import { WasiCliStdout } from './imports/wasi-cli-stdout';
import { WasiCliTerminalInput } from './imports/wasi-cli-terminal-input';
import { WasiCliTerminalOutput } from './imports/wasi-cli-terminal-output';
import { WasiCliTerminalStderr } from './imports/wasi-cli-terminal-stderr';
import { WasiCliTerminalStdin } from './imports/wasi-cli-terminal-stdin';
import { WasiCliTerminalStdout } from './imports/wasi-cli-terminal-stdout';
import { WasiClocksMonotonicClock } from './imports/wasi-clocks-monotonic-clock';
import { WasiClocksWallClock } from './imports/wasi-clocks-wall-clock';
import { WasiFilesystemPreopens } from './imports/wasi-filesystem-preopens';
import { WasiFilesystemTypes } from './imports/wasi-filesystem-types';
import { WasiIoStreams } from './imports/wasi-io-streams';
import { WasiPollPoll } from './imports/wasi-poll-poll';
import { WasiRandomRandom } from './imports/wasi-random-random';
import { WasiSocketsIpNameLookup } from './imports/wasi-sockets-ip-name-lookup';
import { WasiSocketsNetwork } from './imports/wasi-sockets-network';
import { WasiSocketsTcp } from './imports/wasi-sockets-tcp';
import { WasiSocketsTcpCreateSocket } from './imports/wasi-sockets-tcp-create-socket';
import { ComponentNfsRsNfs } from './exports/component-nfs-rs-nfs';
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

