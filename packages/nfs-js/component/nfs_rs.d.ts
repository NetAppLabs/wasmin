import { WasiCliEnvironment } from './interfaces/wasi-cli-environment.js';
import { WasiCliExit } from './interfaces/wasi-cli-exit.js';
import { WasiCliStderr } from './interfaces/wasi-cli-stderr.js';
import { WasiCliStdin } from './interfaces/wasi-cli-stdin.js';
import { WasiCliStdout } from './interfaces/wasi-cli-stdout.js';
import { WasiClocksMonotonicClock } from './interfaces/wasi-clocks-monotonic-clock.js';
import { WasiClocksWallClock } from './interfaces/wasi-clocks-wall-clock.js';
import { WasiFilesystemPreopens } from './interfaces/wasi-filesystem-preopens.js';
import { WasiFilesystemTypes } from './interfaces/wasi-filesystem-types.js';
import { WasiIoError } from './interfaces/wasi-io-error.js';
import { WasiIoPoll } from './interfaces/wasi-io-poll.js';
import { WasiIoStreams } from './interfaces/wasi-io-streams.js';
import { WasiRandomRandom } from './interfaces/wasi-random-random.js';
import { WasiSocketsInstanceNetwork } from './interfaces/wasi-sockets-instance-network.js';
import { WasiSocketsIpNameLookup } from './interfaces/wasi-sockets-ip-name-lookup.js';
import { WasiSocketsNetwork } from './interfaces/wasi-sockets-network.js';
import { WasiSocketsTcpCreateSocket } from './interfaces/wasi-sockets-tcp-create-socket.js';
import { WasiSocketsTcp } from './interfaces/wasi-sockets-tcp.js';
import { ComponentNfsRsNfs } from './interfaces/component-nfs-rs-nfs.js';
export interface ImportObject {
  'wasi:cli/environment@0.2.0': typeof WasiCliEnvironment,
  'wasi:cli/exit@0.2.0': typeof WasiCliExit,
  'wasi:cli/stderr@0.2.0': typeof WasiCliStderr,
  'wasi:cli/stdin@0.2.0': typeof WasiCliStdin,
  'wasi:cli/stdout@0.2.0': typeof WasiCliStdout,
  'wasi:clocks/monotonic-clock@0.2.0': typeof WasiClocksMonotonicClock,
  'wasi:clocks/wall-clock@0.2.0': typeof WasiClocksWallClock,
  'wasi:filesystem/preopens@0.2.0': typeof WasiFilesystemPreopens,
  'wasi:filesystem/types@0.2.0': typeof WasiFilesystemTypes,
  'wasi:io/error@0.2.0': typeof WasiIoError,
  'wasi:io/poll@0.2.0': typeof WasiIoPoll,
  'wasi:io/streams@0.2.0': typeof WasiIoStreams,
  'wasi:random/random@0.2.0': typeof WasiRandomRandom,
  'wasi:sockets/instance-network@0.2.0': typeof WasiSocketsInstanceNetwork,
  'wasi:sockets/ip-name-lookup@0.2.0': typeof WasiSocketsIpNameLookup,
  'wasi:sockets/network@0.2.0': typeof WasiSocketsNetwork,
  'wasi:sockets/tcp-create-socket@0.2.0': typeof WasiSocketsTcpCreateSocket,
  'wasi:sockets/tcp@0.2.0': typeof WasiSocketsTcp,
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
* The first argument to this function, `getCoreModule`, is
* used to compile core wasm modules within the component.
* Components are composed of core wasm modules and this callback
* will be invoked per core wasm module. The caller of this
* function is responsible for reading the core wasm module
* identified by `path` and returning its compiled
* `WebAssembly.Module` object. This would use `compileStreaming`
* on the web, for example.
*/
export function instantiate(
getCoreModule: (path: string) => Promise<WebAssembly.Module>,
imports: ImportObject,
instantiateCore?: (module: WebAssembly.Module, imports: Record<string, any>) => Promise<WebAssembly.Instance>
): Promise<Root>;

