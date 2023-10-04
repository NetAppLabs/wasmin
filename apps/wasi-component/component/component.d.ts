import { ImportsEnvironment } from './imports/environment';
import { ImportsExit } from './imports/exit';
import { ImportsStderr } from './imports/stderr';
import { ImportsStdin } from './imports/stdin';
import { ImportsStdout } from './imports/stdout';
import { ImportsTerminalInput } from './imports/terminal-input';
import { ImportsTerminalOutput } from './imports/terminal-output';
import { ImportsTerminalStderr } from './imports/terminal-stderr';
import { ImportsTerminalStdin } from './imports/terminal-stdin';
import { ImportsTerminalStdout } from './imports/terminal-stdout';
import { ImportsMonotonicClock } from './imports/monotonic-clock';
import { ImportsWallClock } from './imports/wall-clock';
import { ImportsPreopens } from './imports/preopens';
import { ImportsTypes } from './imports/types';
import { ImportsStreams } from './imports/streams';
import { ImportsPoll } from './imports/poll';
import { ImportsRandom } from './imports/random';
import { ImportsInstanceNetwork } from './imports/instance-network';
import { ImportsIpNameLookup } from './imports/ip-name-lookup';
import { ImportsNetwork } from './imports/network';
import { ImportsTcp } from './imports/tcp';
import { ImportsTcpCreateSocket } from './imports/tcp-create-socket';
import { ImportsUdp } from './imports/udp';
import { ImportsUdpCreateSocket } from './imports/udp-create-socket';
import { ExportsWasiCliRun } from './exports/wasi-cli-run';
export interface ImportObject {
  'wasi:cli/environment': typeof ImportsEnvironment,
  'wasi:cli/exit': typeof ImportsExit,
  'wasi:cli/stderr': typeof ImportsStderr,
  'wasi:cli/stdin': typeof ImportsStdin,
  'wasi:cli/stdout': typeof ImportsStdout,
  'wasi:cli/terminal-input': typeof ImportsTerminalInput,
  'wasi:cli/terminal-output': typeof ImportsTerminalOutput,
  'wasi:cli/terminal-stderr': typeof ImportsTerminalStderr,
  'wasi:cli/terminal-stdin': typeof ImportsTerminalStdin,
  'wasi:cli/terminal-stdout': typeof ImportsTerminalStdout,
  'wasi:clocks/monotonic-clock': typeof ImportsMonotonicClock,
  'wasi:clocks/wall-clock': typeof ImportsWallClock,
  'wasi:filesystem/preopens': typeof ImportsPreopens,
  'wasi:filesystem/types': typeof ImportsTypes,
  'wasi:io/streams': typeof ImportsStreams,
  'wasi:poll/poll': typeof ImportsPoll,
  'wasi:random/random': typeof ImportsRandom,
  'wasi:sockets/instance-network': typeof ImportsInstanceNetwork,
  'wasi:sockets/ip-name-lookup': typeof ImportsIpNameLookup,
  'wasi:sockets/network': typeof ImportsNetwork,
  'wasi:sockets/tcp': typeof ImportsTcp,
  'wasi:sockets/tcp-create-socket': typeof ImportsTcpCreateSocket,
  'wasi:sockets/udp': typeof ImportsUdp,
  'wasi:sockets/udp-create-socket': typeof ImportsUdpCreateSocket,
}
export interface Root {
  'wasi:cli/run': typeof ExportsWasiCliRun,
  run: typeof ExportsWasiCliRun,
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

