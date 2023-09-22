import { ImportsEnvironment } from './imports/environment';
import { ImportsExit } from './imports/exit';
import { ImportsPreopens } from './imports/preopens';
import { ImportsStderr } from './imports/stderr';
import { ImportsStdin } from './imports/stdin';
import { ImportsStdout } from './imports/stdout';
import { ImportsMonotonicClock } from './imports/monotonic-clock';
import { ImportsWallClock } from './imports/wall-clock';
import { ImportsFilesystem } from './imports/filesystem';
import { ImportsStreams } from './imports/streams';
import { ImportsPoll } from './imports/poll';
import { ImportsRandom } from './imports/random';
import { ImportsIpNameLookup } from './imports/ip-name-lookup';
import { ImportsNetwork } from './imports/network';
import { ImportsTcp } from './imports/tcp';
import { ImportsTcpCreateSocket } from './imports/tcp-create-socket';
import { ExportsComponentNfsRsNfs } from './exports/component-nfs-rs-nfs';
export interface ImportObject {
  'wasi:cli-base/environment': typeof ImportsEnvironment,
  'wasi:cli-base/exit': typeof ImportsExit,
  'wasi:cli-base/preopens': typeof ImportsPreopens,
  'wasi:cli-base/stderr': typeof ImportsStderr,
  'wasi:cli-base/stdin': typeof ImportsStdin,
  'wasi:cli-base/stdout': typeof ImportsStdout,
  'wasi:clocks/monotonic-clock': typeof ImportsMonotonicClock,
  'wasi:clocks/wall-clock': typeof ImportsWallClock,
  'wasi:filesystem/filesystem': typeof ImportsFilesystem,
  'wasi:io/streams': typeof ImportsStreams,
  'wasi:poll/poll': typeof ImportsPoll,
  'wasi:random/random': typeof ImportsRandom,
  'wasi:sockets/ip-name-lookup': typeof ImportsIpNameLookup,
  'wasi:sockets/network': typeof ImportsNetwork,
  'wasi:sockets/tcp': typeof ImportsTcp,
  'wasi:sockets/tcp-create-socket': typeof ImportsTcpCreateSocket,
}
export interface Root {
  'component:nfs-rs/nfs': typeof ExportsComponentNfsRsNfs,
  nfs: typeof ExportsComponentNfsRsNfs,
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

