
import { CliBaseEnvironmentNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type CliBaseEnvironmentAsync = CliBaseEnvironmentNamespace.CliBaseEnvironmentAsync;
import { CliBasePreopensNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type CliBasePreopensAsync = CliBasePreopensNamespace.CliBasePreopensAsync;
import { CliBaseExitNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type CliBaseExitAsync = CliBaseExitNamespace.CliBaseExitAsync;
import { CliBaseStdinNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type CliBaseStdinAsync = CliBaseStdinNamespace.CliBaseStdinAsync;
import { CliBaseStdoutNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type CliBaseStdoutAsync = CliBaseStdoutNamespace.CliBaseStdoutAsync;
import { CliBaseStderrNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type CliBaseStderrAsync = CliBaseStderrNamespace.CliBaseStderrAsync;
import { FilesystemFilesystemNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type FilesystemFilesystemAsync = FilesystemFilesystemNamespace.FilesystemFilesystemAsync;
import { IoStreamsNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type IoStreamsAsync = IoStreamsNamespace.IoStreamsAsync;
import { RandomRandomNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js"
type RandomRandomAsync = RandomRandomNamespace.RandomRandomAsync;

import { WasiOptions } from "../wasi";
import { FileSystemFileSystemAsyncHost } from "./filesystem-filesystem.js";
import { IoStreamsAsyncHost } from "./io-streams.js";
import { RandomRandomAsynHost } from "./random-random.js";
import { CliBaseEnvironmentAsyncHost } from "./cli-base-environment.js";
import { CliBasePreopensAsyncHost } from "./cli-base-preopens.js";
import { CliBaseExitAsyncHost } from "./cli-base-exit.js";
import { CliBaseStdinAsyncHost } from "./cli-base-stdin.js";
import { CliBaseStdoutAsyncHost } from "./cli-base-stdout.js";
import { CliBaseStderrAsyncHost } from "./cli-base-stderr.js";


export type WasiSnapshotPreview2ImportObject = {
    'cli-base': {
      cliBaseEnvironment: CliBaseEnvironmentAsync,
      cliBasePreopens: CliBasePreopensAsync,
      cliBaseExit: CliBaseExitAsync,
      cliBaseStdin: CliBaseStdinAsync,
      cliBaseStdout: CliBaseStdoutAsync,
      cliBaseStderr: CliBaseStderrAsync,
    },
    filesystem: {
      filesystemFilesystem: FilesystemFilesystemAsync,
    },
    io: {
      ioStreams: IoStreamsAsync,
    },
    random: {
      randomRandom: RandomRandomAsync,
    },
};


export function constructWasiSnapshotPreview2Imports(wasiOptions: WasiOptions): WasiSnapshotPreview2ImportObject {
    let wasiImports: WasiSnapshotPreview2ImportObject;
    wasiImports = {
        'cli-base': {
            cliBaseEnvironment: new CliBaseEnvironmentAsyncHost(wasiOptions),
            cliBasePreopens: new CliBasePreopensAsyncHost(wasiOptions),
            cliBaseExit: new CliBaseExitAsyncHost(),
            cliBaseStdin: new CliBaseStdinAsyncHost(wasiOptions),
            cliBaseStdout: new CliBaseStdoutAsyncHost(),
            cliBaseStderr: new CliBaseStderrAsyncHost(),
          },
          filesystem: {
            filesystemFilesystem: new FileSystemFileSystemAsyncHost(wasiOptions),
          },
          io: {
            ioStreams: new IoStreamsAsyncHost(wasiOptions),
          },
          random: {
            randomRandom: new RandomRandomAsynHost(wasiOptions),
          },
    };
    return wasiImports;
}
