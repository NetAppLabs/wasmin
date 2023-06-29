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
    "cli-base": {
        cliBaseEnvironment: CliBaseEnvironmentAsync;
        cliBasePreopens: CliBasePreopensAsync;
        cliBaseExit: CliBaseExitAsync;
        cliBaseStdin: CliBaseStdinAsync;
        cliBaseStdout: CliBaseStdoutAsync;
        cliBaseStderr: CliBaseStderrAsync;
    };
    clocks: {
        clocksMonotonicClock: ClocksMonotonicClockAsync;
        clocksTimezone: ClocksTimezoneAsync;
        clocksWallClock: ClocksWallClockAsync;
    };
    filesystem: {
        filesystemFilesystem: FilesystemFilesystemAsync;
    };
    io: {
        ioStreams: IoStreamsAsync;
    };
    poll: {
        pollPoll: PollPollAsync;
    };
    sockets: {
        socketsInstanceNetwork: SocketsInstanceNetworkAsync;
        socketsNetwork: SocketsNetworkAsync;
        socketsTcpCreateSocket: SocketsTcpCreateSocketAsync;
        socketsTcp: SocketsTcpAsync;
        socketsIpNameLookup: SocketsIpNameLookupAsync;
    };
    random: {
        randomRandom: RandomRandomAsync;
        randomInsecure: RandomInsecureAsync;
        randomInsecureSeed: RandomInsecureSeedAsync;
    };
};

export function constructWasiSnapshotPreview2Imports(wasiOptions: WasiOptions): WasiSnapshotPreview2ImportObject {
    const socketsNetworkInstance = new SocketsNetworkAsyncHost(wasiOptions);
    const socketsTcpInstance = new SocketsTcpAsyncHost(wasiOptions);
    const socketsIpNameLookupInstance = new SocketsIpNameLookupAsyncHost(wasiOptions);

    const wasiImports: WasiSnapshotPreview2ImportObject = {
        "cli-base": {
            cliBaseEnvironment: new CliBaseEnvironmentAsyncHost(wasiOptions),
            cliBasePreopens: new CliBasePreopensAsyncHost(wasiOptions),
            cliBaseExit: new CliBaseExitAsyncHost(wasiOptions),
            cliBaseStdin: new CliBaseStdinAsyncHost(wasiOptions),
            cliBaseStdout: new CliBaseStdoutAsyncHost(wasiOptions),
            cliBaseStderr: new CliBaseStderrAsyncHost(wasiOptions),
        },
        clocks: {
            clocksMonotonicClock: new ClocksMonotonicClockAsyncHost(wasiOptions),
            clocksTimezone: new ClocksTimezoneAsyncHost(wasiOptions),
            clocksWallClock: new ClocksWallClockAsyncHost(wasiOptions),
        },
        filesystem: {
            filesystemFilesystem: new FileSystemFileSystemAsyncHost(wasiOptions),
        },
        io: {
            ioStreams: new IoStreamsAsyncHost(wasiOptions),
        },
        poll: {
            pollPoll: new PollPollAsyncHost(wasiOptions),
        },
        sockets: {
            socketsInstanceNetwork: socketsNetworkInstance,
            socketsNetwork: socketsNetworkInstance,
            socketsTcpCreateSocket: socketsTcpInstance,
            socketsTcp: socketsTcpInstance,
            socketsIpNameLookup: socketsIpNameLookupInstance,
        },
        random: {
            randomRandom: new RandomRandomAsynHost(wasiOptions),
            randomInsecure: new RandomInsecureAsyncHost(wasiOptions),
            randomInsecureSeed: new RandomInsecureSeedAsyncHost(wasiOptions),
        },
    };
    return wasiImports;
}
