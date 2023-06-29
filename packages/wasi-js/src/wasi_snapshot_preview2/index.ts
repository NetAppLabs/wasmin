import { CliBaseEnvironmentNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type CliBaseEnvironmentAsync = CliBaseEnvironmentNamespace.CliBaseEnvironmentAsync;
import { CliBasePreopensNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type CliBasePreopensAsync = CliBasePreopensNamespace.CliBasePreopensAsync;
import { CliBaseExitNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type CliBaseExitAsync = CliBaseExitNamespace.CliBaseExitAsync;
import { CliBaseStdinNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type CliBaseStdinAsync = CliBaseStdinNamespace.CliBaseStdinAsync;
import { CliBaseStdoutNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type CliBaseStdoutAsync = CliBaseStdoutNamespace.CliBaseStdoutAsync;
import { CliBaseStderrNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type CliBaseStderrAsync = CliBaseStderrNamespace.CliBaseStderrAsync;
import { FilesystemFilesystemNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type FilesystemFilesystemAsync = FilesystemFilesystemNamespace.FilesystemFilesystemAsync;
import { IoStreamsNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type IoStreamsAsync = IoStreamsNamespace.IoStreamsAsync;
import { RandomRandomNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type RandomRandomAsync = RandomRandomNamespace.RandomRandomAsync;
import { RandomInsecureNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type RandomInsecureAsync = RandomInsecureNamespace.RandomInsecureAsync;
import { RandomInsecureSeedNamespace } from "@wasm-env/wasi-snapshot-preview2/dist/index.js";
type RandomInsecureSeedAsync = RandomInsecureSeedNamespace.RandomInsecureSeedAsync;

import { WasiOptions } from "../wasi";
import { FileSystemFileSystemAsyncHost } from "./filesystem.js";
import { IoStreamsAsyncHost } from "./io.js";
import { RandomInsecureSeedAsyncHost, RandomRandomAsynHost } from "./random.js";
import { RandomInsecureAsyncHost } from "./random.js";
import { CliBaseEnvironmentAsyncHost } from "./cli-base.js";
import { CliBasePreopensAsyncHost } from "./cli-base.js";
import { CliBaseExitAsyncHost } from "./cli-base.js";
import { CliBaseStdinAsyncHost } from "./cli-base.js";
import { CliBaseStdoutAsyncHost } from "./cli-base.js";
import { CliBaseStderrAsyncHost } from "./cli-base.js";
import { ClocksMonotonicClockAsyncHost, ClocksTimezoneAsyncHost, ClocksWallClockAsyncHost } from "./clocks.js";
import { ClocksMonotonicClockAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/clocks-monotonic-clock";
import { ClocksWallClockAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/clocks-wall-clock";
import { ClocksTimezoneAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/clocks-timezone";
import { SocketsInstanceNetworkAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/sockets-instance-network";
import { SocketsNetworkAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/sockets-network";
import { SocketsTcpCreateSocketAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/sockets-tcp-create-socket";
import { SocketsTcpAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/sockets-tcp";
import { SocketsIpNameLookupAsyncHost, SocketsNetworkAsyncHost, SocketsTcpAsyncHost } from "./sockets.js";
import { SocketsIpNameLookupAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/sockets-ip-name-lookup";
import { PollPollAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/poll-poll";
import { PollPollAsyncHost } from "./poll.js";

export type WasiSnapshotPreview2ImportObject = {
    'wasi:cli-base/environment': CliBaseEnvironmentAsync,
    'wasi:cli-base/preopens': CliBasePreopensAsync,
    'wasi:cli-base/exit': CliBaseExitAsync,
    'wasi:cli-base/stdin': CliBaseStdinAsync,
    'wasi:cli-base/stdout': CliBaseStdoutAsync,
    'wasi:cli-base/stderr': CliBaseStderrAsync
    'wasi:clocks/monotonic-clock': ClocksMonotonicClockAsync,
    'wasi:clocks/timezone': ClocksTimezoneAsync,
    'wasi:clocks/wall-clock': ClocksWallClockAsync,
    'wasi:filesystem/filesystem': FilesystemFilesystemAsync,
    'wasi:io/streams': IoStreamsAsync,
    'wasi:poll/poll': PollPollAsync,
    'wasi:sockets/instance-network': SocketsInstanceNetworkAsync,
    'wasi:sockets/network': SocketsNetworkAsync,
    'wasi:sockets/tcp': SocketsTcpAsync,
    'wasi:sockets/tcp-create-socket': SocketsTcpCreateSocketAsync,
    'wasi:sockets/ip-name-lookup': SocketsIpNameLookupAsync,
    'wasi:random/random': RandomRandomAsync,
    'wasi:random/insecure': RandomInsecureAsync,
    'wasi:random/insecure-seed': RandomInsecureSeedAsync,
  }

export function constructWasiSnapshotPreview2Imports(wasiOptions: WasiOptions): WasiSnapshotPreview2ImportObject {
    const socketsNetworkInstance = new SocketsNetworkAsyncHost(wasiOptions);
    const socketsTcpInstance = new SocketsTcpAsyncHost(wasiOptions);
    const socketsIpNameLookupInstance = new SocketsIpNameLookupAsyncHost(wasiOptions);
    const wasiPreview2Imports: WasiSnapshotPreview2ImportObject = {
        'wasi:cli-base/environment': new CliBaseEnvironmentAsyncHost(wasiOptions),
        'wasi:cli-base/preopens': new CliBasePreopensAsyncHost(wasiOptions),
        'wasi:cli-base/exit': new CliBaseExitAsyncHost(wasiOptions),
        'wasi:cli-base/stdin': new CliBaseStdinAsyncHost(wasiOptions),
        'wasi:cli-base/stdout': new CliBaseStdoutAsyncHost(wasiOptions),
        'wasi:cli-base/stderr': new CliBaseStderrAsyncHost(wasiOptions),
        'wasi:clocks/monotonic-clock': new ClocksMonotonicClockAsyncHost(wasiOptions),
        'wasi:clocks/timezone': new ClocksTimezoneAsyncHost(wasiOptions),
        'wasi:clocks/wall-clock': new ClocksWallClockAsyncHost(wasiOptions),
        'wasi:filesystem/filesystem': new FileSystemFileSystemAsyncHost(wasiOptions),
        'wasi:io/streams': new IoStreamsAsyncHost(wasiOptions),
        'wasi:poll/poll': new PollPollAsyncHost(wasiOptions),
        'wasi:sockets/instance-network': socketsNetworkInstance,
        'wasi:sockets/network': socketsNetworkInstance,
        'wasi:sockets/tcp': socketsTcpInstance,
        'wasi:sockets/tcp-create-socket': socketsTcpInstance,
        'wasi:sockets/ip-name-lookup': socketsIpNameLookupInstance,
        'wasi:random/random': new RandomRandomAsynHost(wasiOptions),
        'wasi:random/insecure': new RandomInsecureAsyncHost(wasiOptions),
        'wasi:random/insecure-seed': new RandomInsecureSeedAsyncHost(wasiOptions),
    };
    return wasiPreview2Imports;
}
