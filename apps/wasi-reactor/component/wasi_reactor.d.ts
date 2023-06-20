import { CliBaseEnvironment as CliBaseEnvironmentImports } from './imports/cli-base-environment';
import { CliBasePreopens as CliBasePreopensImports } from './imports/cli-base-preopens';
import { CliBaseExit as CliBaseExitImports } from './imports/cli-base-exit';
import { CliBaseStdin as CliBaseStdinImports } from './imports/cli-base-stdin';
import { CliBaseStdout as CliBaseStdoutImports } from './imports/cli-base-stdout';
import { CliBaseStderr as CliBaseStderrImports } from './imports/cli-base-stderr';
import { FilesystemFilesystem as FilesystemFilesystemImports } from './imports/filesystem-filesystem';
import { IoStreams as IoStreamsImports } from './imports/io-streams';
import { RandomRandom as RandomRandomImports } from './imports/random-random';
export interface ImportObject {
  'cli-base': {
    cliBaseEnvironment: typeof CliBaseEnvironmentImports,
    cliBasePreopens: typeof CliBasePreopensImports,
    cliBaseExit: typeof CliBaseExitImports,
    cliBaseStdin: typeof CliBaseStdinImports,
    cliBaseStdout: typeof CliBaseStdoutImports,
    cliBaseStderr: typeof CliBaseStderrImports,
  },
  filesystem: {
    filesystemFilesystem: typeof FilesystemFilesystemImports,
  },
  io: {
    ioStreams: typeof IoStreamsImports,
  },
  random: {
    randomRandom: typeof RandomRandomImports,
  },
}
export interface Root {
  hello(x: string): string,
  uuid(): string,
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

