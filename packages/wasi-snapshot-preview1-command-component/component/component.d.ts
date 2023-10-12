import { WasiCliEnvironment } from './interfaces/wasi-cli-environment';
import { WasiCliExit } from './interfaces/wasi-cli-exit';
import { WasiCliStderr } from './interfaces/wasi-cli-stderr';
import { WasiCliStdin } from './interfaces/wasi-cli-stdin';
import { WasiCliStdout } from './interfaces/wasi-cli-stdout';
import { WasiCliTerminalInput } from './interfaces/wasi-cli-terminal-input';
import { WasiCliTerminalOutput } from './interfaces/wasi-cli-terminal-output';
import { WasiCliTerminalStderr } from './interfaces/wasi-cli-terminal-stderr';
import { WasiCliTerminalStdin } from './interfaces/wasi-cli-terminal-stdin';
import { WasiCliTerminalStdout } from './interfaces/wasi-cli-terminal-stdout';
import { WasiClocksMonotonicClock } from './interfaces/wasi-clocks-monotonic-clock';
import { WasiClocksWallClock } from './interfaces/wasi-clocks-wall-clock';
import { WasiFilesystemPreopens } from './interfaces/wasi-filesystem-preopens';
import { WasiFilesystemTypes } from './interfaces/wasi-filesystem-types';
import { WasiIoStreams } from './interfaces/wasi-io-streams';
import { WasiPollPoll } from './interfaces/wasi-poll-poll';
import { WasiRandomRandom } from './interfaces/wasi-random-random';
import { WasiSocketsInstanceNetwork } from './interfaces/wasi-sockets-instance-network';
import { WasiSocketsIpNameLookup } from './interfaces/wasi-sockets-ip-name-lookup';
import { WasiSocketsNetwork } from './interfaces/wasi-sockets-network';
import { WasiSocketsTcp } from './interfaces/wasi-sockets-tcp';
import { WasiSocketsTcpCreateSocket } from './interfaces/wasi-sockets-tcp-create-socket';
import { WasiSocketsUdp } from './interfaces/wasi-sockets-udp';
import { WasiSocketsUdpCreateSocket } from './interfaces/wasi-sockets-udp-create-socket';
import { WasiCliRun } from './interfaces/wasi-cli-run';
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
  'wasi:sockets/instance-network': typeof WasiSocketsInstanceNetwork,
  'wasi:sockets/ip-name-lookup': typeof WasiSocketsIpNameLookup,
  'wasi:sockets/network': typeof WasiSocketsNetwork,
  'wasi:sockets/tcp': typeof WasiSocketsTcp,
  'wasi:sockets/tcp-create-socket': typeof WasiSocketsTcpCreateSocket,
  'wasi:sockets/udp': typeof WasiSocketsUdp,
  'wasi:sockets/udp-create-socket': typeof WasiSocketsUdpCreateSocket,
}
export interface Root {
  'wasi:cli/run': typeof WasiCliRun,
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

