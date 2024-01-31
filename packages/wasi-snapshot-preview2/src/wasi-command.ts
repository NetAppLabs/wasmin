import { WasiCliEnvironmentAsync as WasiCliEnvironment } from './interfaces/wasi-cli-environment.js';
import { WasiCliExitAsync as WasiCliExit } from './interfaces/wasi-cli-exit.js';
import { WasiCliStderrAsync as WasiCliStderr } from './interfaces/wasi-cli-stderr.js';
import { WasiCliStdinAsync as WasiCliStdin } from './interfaces/wasi-cli-stdin.js';
import { WasiCliStdoutAsync as WasiCliStdout } from './interfaces/wasi-cli-stdout.js';
import { WasiCliTerminalInputAsync as WasiCliTerminalInput } from './interfaces/wasi-cli-terminal-input.js';
import { WasiCliTerminalOutputAsync as WasiCliTerminalOutput } from './interfaces/wasi-cli-terminal-output.js';
import { WasiCliTerminalStderrAsync as WasiCliTerminalStderr } from './interfaces/wasi-cli-terminal-stderr.js';
import { WasiCliTerminalStdinAsync as WasiCliTerminalStdin } from './interfaces/wasi-cli-terminal-stdin.js';
import { WasiCliTerminalStdoutAsync as WasiCliTerminalStdout } from './interfaces/wasi-cli-terminal-stdout.js';
import { WasiClocksMonotonicClockAsync as WasiClocksMonotonicClock } from './interfaces/wasi-clocks-monotonic-clock.js';
import { WasiClocksWallClockAsync as WasiClocksWallClock } from './interfaces/wasi-clocks-wall-clock.js';
import { WasiFilesystemPreopensAsync as WasiFilesystemPreopens } from './interfaces/wasi-filesystem-preopens.js';
import { WasiFilesystemTypesAsync as WasiFilesystemTypes } from './interfaces/wasi-filesystem-types.js';
import { WasiIoErrorAsync as WasiIoError } from './interfaces/wasi-io-error.js';
import { WasiIoPollAsync as WasiIoPoll } from './interfaces/wasi-io-poll.js';
import { WasiIoStreamsAsync as WasiIoStreams } from './interfaces/wasi-io-streams.js';
import { WasiRandomInsecureSeedAsync as WasiRandomInsecureSeed } from './interfaces/wasi-random-insecure-seed.js';
import { WasiRandomInsecureAsync as WasiRandomInsecure } from './interfaces/wasi-random-insecure.js';
import { WasiRandomRandomAsync as WasiRandomRandom } from './interfaces/wasi-random-random.js';
import { WasiSocketsInstanceNetworkAsync as WasiSocketsInstanceNetwork } from './interfaces/wasi-sockets-instance-network.js';
import { WasiSocketsIpNameLookupAsync as WasiSocketsIpNameLookup } from './interfaces/wasi-sockets-ip-name-lookup.js';
import { WasiSocketsNetworkAsync as WasiSocketsNetwork } from './interfaces/wasi-sockets-network.js';
import { WasiSocketsTcpCreateSocketAsync as WasiSocketsTcpCreateSocket } from './interfaces/wasi-sockets-tcp-create-socket.js';
import { WasiSocketsTcpAsync as WasiSocketsTcp } from './interfaces/wasi-sockets-tcp.js';
import { WasiSocketsUdpCreateSocketAsync as WasiSocketsUdpCreateSocket } from './interfaces/wasi-sockets-udp-create-socket.js';
import { WasiSocketsUdpAsync as WasiSocketsUdp } from './interfaces/wasi-sockets-udp.js';
import { WasiCliRunAsync as WasiCliRun } from './interfaces/wasi-cli-run.js';
export interface ImportObject {
  'wasi:cli/environment@0.2.0-rc-2023-12-05': WasiCliEnvironment,
  'wasi:cli/exit@0.2.0-rc-2023-12-05': WasiCliExit,
  'wasi:cli/stderr@0.2.0-rc-2023-12-05': WasiCliStderr,
  'wasi:cli/stdin@0.2.0-rc-2023-12-05': WasiCliStdin,
  'wasi:cli/stdout@0.2.0-rc-2023-12-05': WasiCliStdout,
  'wasi:cli/terminal-input@0.2.0-rc-2023-12-05': WasiCliTerminalInput,
  'wasi:cli/terminal-output@0.2.0-rc-2023-12-05': WasiCliTerminalOutput,
  'wasi:cli/terminal-stderr@0.2.0-rc-2023-12-05': WasiCliTerminalStderr,
  'wasi:cli/terminal-stdin@0.2.0-rc-2023-12-05': WasiCliTerminalStdin,
  'wasi:cli/terminal-stdout@0.2.0-rc-2023-12-05': WasiCliTerminalStdout,
  'wasi:clocks/monotonic-clock@0.2.0-rc-2023-11-10': WasiClocksMonotonicClock,
  'wasi:clocks/wall-clock@0.2.0-rc-2023-11-10': WasiClocksWallClock,
  'wasi:filesystem/preopens@0.2.0-rc-2023-11-10': WasiFilesystemPreopens,
  'wasi:filesystem/types@0.2.0-rc-2023-11-10': WasiFilesystemTypes,
  'wasi:io/error@0.2.0-rc-2023-11-10': WasiIoError,
  'wasi:io/poll@0.2.0-rc-2023-11-10': WasiIoPoll,
  'wasi:io/streams@0.2.0-rc-2023-11-10': WasiIoStreams,
  'wasi:random/insecure-seed@0.2.0-rc-2023-11-10': WasiRandomInsecureSeed,
  'wasi:random/insecure@0.2.0-rc-2023-11-10': WasiRandomInsecure,
  'wasi:random/random@0.2.0-rc-2023-11-10': WasiRandomRandom,
  'wasi:sockets/instance-network@0.2.0-rc-2023-11-10': WasiSocketsInstanceNetwork,
  'wasi:sockets/ip-name-lookup@0.2.0-rc-2023-11-10': WasiSocketsIpNameLookup,
  'wasi:sockets/network@0.2.0-rc-2023-11-10': WasiSocketsNetwork,
  'wasi:sockets/tcp-create-socket@0.2.0-rc-2023-11-10': WasiSocketsTcpCreateSocket,
  'wasi:sockets/tcp@0.2.0-rc-2023-11-10': WasiSocketsTcp,
  'wasi:sockets/udp-create-socket@0.2.0-rc-2023-11-10': WasiSocketsUdpCreateSocket,
  'wasi:sockets/udp@0.2.0-rc-2023-11-10': WasiSocketsUdp,
}
export interface Command {
  'wasi:cli/run@0.2.0-rc-2023-12-05': WasiCliRun,
  run: WasiCliRun,
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
* The first argument to this function, `getCoreModule`, is
* used to compile core wasm modules within the component.
* Components are composed of core wasm modules and this callback
* will be invoked per core wasm module. The caller of this
* function is responsible for reading the core wasm module
* identified by `path` and returning its compiled
* `WebAssembly.Module` object. This would use `compileStreaming`
* on the web, for example.
*/
/*
export function instantiate(
getCoreModule: (path: string) => Promise<WebAssembly.Module>,
imports: ImportObject,
instantiateCore?: (module: WebAssembly.Module, imports: Record<string, any>) => Promise<WebAssembly.Instance>
): Promise<Command>;
*/
