
import {CliBaseEnvironmentNamespace } from "@wasm-env/wasi-snapshot-preview2"
type CliBaseEnvironmentAsync = CliBaseEnvironmentNamespace.CliBaseEnvironmentAsync;
import {CliBasePreopensNamespace } from "@wasm-env/wasi-snapshot-preview2"
type CliBasePreopensAsync = CliBasePreopensNamespace.CliBasePreopensAsync;
import {CliBaseExitNamespace } from "@wasm-env/wasi-snapshot-preview2"
type CliBaseExitAsync = CliBaseExitNamespace.CliBaseExitAsync;
import {CliBaseStdinNamespace } from "@wasm-env/wasi-snapshot-preview2"
type CliBaseStdinAsync = CliBaseStdinNamespace.CliBaseStdinAsync;
import {CliBaseStdoutNamespace } from "@wasm-env/wasi-snapshot-preview2"
type CliBaseStdoutAsync = CliBaseStdoutNamespace.CliBaseStdoutAsync;
import {CliBaseStderrNamespace } from "@wasm-env/wasi-snapshot-preview2"
type CliBaseStderrAsync = CliBaseStderrNamespace.CliBaseStderrAsync;
import {FilesystemFilesystemNamespace } from "@wasm-env/wasi-snapshot-preview2"
type FilesystemFilesystemAsync = FilesystemFilesystemNamespace.FilesystemFilesystemAsync;
import {IoStreamsNamespace } from "@wasm-env/wasi-snapshot-preview2"
type IoStreamsAsync = IoStreamsNamespace.IoStreamsAsync;
import {RandomRandomNamespace } from "@wasm-env/wasi-snapshot-preview2"
type RandomRandomAsync = RandomRandomNamespace.RandomRandomAsync;

import { WasiOptions } from "../wasi";
import { FileSystemFileSystemAsyncHost } from "./filesystem-filesystem";
import { IoStreamsAsyncHost } from "./io-streams";
import { RandomRandomAsynHost } from "./random-random";
import { CliBaseEnvironmentAsyncHost } from "./cli-base-environment";
import { CliBasePreopensAsyncHost } from "./cli-base-preopens";
import { CliBaseExitAsyncHost } from "./cli-base-exit";
import { CliBaseStdinAsyncHost } from "./cli-base-stdin";
import { CliBaseStdoutAsyncHost } from "./cli-base-stdout";
import { CliBaseStderrAsyncHost } from "./cli-base-stderr";


type WasiSnapshotPreview2ImportObject = {
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
