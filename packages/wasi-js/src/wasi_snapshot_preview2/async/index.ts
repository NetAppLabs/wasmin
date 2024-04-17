import { CliBaseEnvironmentNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type CliBaseEnvironment = CliBaseEnvironmentNamespace.WasiCliEnvironment;
import { FilesystemPreopensNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type FilesystemPreopens = FilesystemPreopensNamespace.WasiFilesystemPreopens;
import { CliBaseExitNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type CliBaseExit = CliBaseExitNamespace.WasiCliExit;
import { CliBaseStdinNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type CliBaseStdin = CliBaseStdinNamespace.WasiCliStdin;
import { CliBaseStdoutNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type CliBaseStdout = CliBaseStdoutNamespace.WasiCliStdout;
import { CliBaseStderrNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type CliBaseStderr = CliBaseStderrNamespace.WasiCliStderr;
import { FilesystemFilesystemNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type FilesystemFilesystem = FilesystemFilesystemNamespace.WasiFilesystemTypes;
import { IoStreamsNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type IoStreams = IoStreamsNamespace.WasiIoStreams;
import { RandomRandomNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type RandomRandom = RandomRandomNamespace.WasiRandomRandom;
import { RandomInsecureNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type RandomInsecure = RandomInsecureNamespace.WasiRandomInsecure;
import { RandomInsecureSeedNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type RandomInsecureSeed = RandomInsecureSeedNamespace.WasiRandomInsecureSeed;
import { HttpOutgoingHandlerNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type WasiHttpOutgoingHandler = HttpOutgoingHandlerNamespace.WasiHttpOutgoingHandler;
import { HttpTypesNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type WasiHttpTypes = HttpTypesNamespace.WasiHttpTypes;

import { WasiOptions } from "../../wasi.js";
import { FileSystemFileSystemAsyncHost } from "./filesystem.js";
import { WasiHttpOutgoingHandlerAsyncHost, WasiHttpTypesAsyncHost } from "./http.js";
import { IoPollAsyncHost, IoStreamsAsyncHost } from "./io.js";
import { RandomInsecureSeedAsyncHost, RandomRandomAsynHost } from "./random.js";
import { RandomInsecureAsyncHost } from "./random.js";
import { CliBaseEnvironmentAsyncHost } from "./cli.js";
import { FileSystemPreopensAsyncHost } from "./filesystem.js";
import { CliBaseExitAsyncHost } from "./cli.js";
import { CliBaseStdinAsyncHost } from "./cli.js";
import { CliBaseStdoutAsyncHost } from "./cli.js";
import { CliBaseStderrAsyncHost } from "./cli.js";
import { ClocksMonotonicClockAsyncHost, ClocksWallClockAsyncHost } from "./clocks.js";
import { ClocksMonotonicClockNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type ClocksMonotonicClock = ClocksMonotonicClockNamespace.WasiClocksMonotonicClock;
import { ClocksWallClockNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type ClocksWallClock = ClocksWallClockNamespace.WasiClocksWallClock;
import { SocketsInstanceNetworkNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsInstanceNetwork = SocketsInstanceNetworkNamespace.WasiSocketsInstanceNetwork;
import { SocketsNetworkNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsNetwork = SocketsNetworkNamespace.WasiSocketsNetwork;
import { SocketsTcpCreateSocketNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsTcpCreateSocket = SocketsTcpCreateSocketNamespace.WasiSocketsTcpCreateSocket;
import { SocketsTcpNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsTcp = SocketsTcpNamespace.WasiSocketsTcp;
import { SocketsUdpCreateSocketNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type WasiSocketsUdpCreateSocket = SocketsUdpCreateSocketNamespace.WasiSocketsUdpCreateSocket;
import { SocketsUdpNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type WasiSocketsUdp = SocketsUdpNamespace.WasiSocketsUdp;

import { SocketsIpNameLookupNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type SocketsIpNameLookup = SocketsIpNameLookupNamespace.WasiSocketsIpNameLookup;
import { SocketsIpNameLookupAsyncHost, SocketsNetworkAsyncHost, SocketsTcpAsyncHost, WasiSocketsUdpAsyncHost } from "./sockets.js";
import { IOPollNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type IoPoll = IOPollNamespace.WasiIoPoll;
import { TerminalStdInNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalStdin = TerminalStdInNamespace.WasiCliTerminalStdin;
import { TerminalStdOutNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalStdout = TerminalStdOutNamespace.WasiCliTerminalStdout;
import { TerminalStErrNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalStderr = TerminalStErrNamespace.WasiCliTerminalStderr;
type TerminalOutputErr = TerminalStErrNamespace.TerminalOutput;
import { TerminalInputNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalInput = TerminalInputNamespace.WasiCliTerminalInput;
import { TerminalOutputNamespace } from "@wasmin/wasi-snapshot-preview2/async";
type TerminalOutput = TerminalOutputNamespace.WasiCliTerminalOutput;
import { TerminalInputAsyncHost, TerminalOutputAsyncHost, TerminalStderrAsyncHost, TerminalStdinAsyncHost, TerminalStdoutAsyncHost } from "./terminal.js";

export type WasiSnapshotPreview2AsyncImportObject = {
    "wasi:cli/environment": CliBaseEnvironment;
    "wasi:cli/exit": CliBaseExit;
    "wasi:cli/stdin": CliBaseStdin;
    "wasi:cli/stdout": CliBaseStdout;
    "wasi:cli/stderr": CliBaseStderr;
    "wasi:clocks/monotonic-clock": ClocksMonotonicClock;
    "wasi:clocks/wall-clock": ClocksWallClock;
    "wasi:filesystem/preopens": FilesystemPreopens;
    "wasi:filesystem/types": FilesystemFilesystem;
    'wasi:http/outgoing-handler': WasiHttpOutgoingHandler,
    'wasi:http/types': WasiHttpTypes,  
    "wasi:io/streams": IoStreams;
    "wasi:io/poll": IoPoll;
    "wasi:sockets/instance-network": SocketsInstanceNetwork;
    "wasi:sockets/network": SocketsNetwork;
    "wasi:sockets/tcp": SocketsTcp;
    "wasi:sockets/tcp-create-socket": SocketsTcpCreateSocket;
    "wasi:sockets/udp": WasiSocketsUdp;
    "wasi:sockets/udp-create-socket": WasiSocketsUdpCreateSocket;
    "wasi:sockets/ip-name-lookup": SocketsIpNameLookup;
    "wasi:random/random": RandomRandom;
    "wasi:random/insecure": RandomInsecure;
    "wasi:random/insecure-seed": RandomInsecureSeed;
    "wasi:cli/terminal-input": TerminalInput;
    "wasi:cli/terminal-output": TerminalOutput;
    "wasi:cli/terminal-stdin": TerminalStdin;
    "wasi:cli/terminal-stdout": TerminalStdout;
    "wasi:cli/terminal-stderr": TerminalStderr;
};

export function constructWasiSnapshotPreview2Imports(wasiOptions: WasiOptions): WasiSnapshotPreview2AsyncImportObject {
    const socketsNetworkInstance = new SocketsNetworkAsyncHost(wasiOptions);
    const socketsTcpInstance = new SocketsTcpAsyncHost(wasiOptions);
    const socketsUdpInstance = new WasiSocketsUdpAsyncHost(wasiOptions);
    const socketsIpNameLookupInstance = new SocketsIpNameLookupAsyncHost(wasiOptions);
    const wasiPreview2Imports: WasiSnapshotPreview2AsyncImportObject = {
        "wasi:cli/environment": new CliBaseEnvironmentAsyncHost(wasiOptions),
        "wasi:cli/exit": new CliBaseExitAsyncHost(wasiOptions),
        "wasi:cli/stdin": new CliBaseStdinAsyncHost(wasiOptions),
        "wasi:cli/stdout": new CliBaseStdoutAsyncHost(wasiOptions),
        "wasi:cli/stderr": new CliBaseStderrAsyncHost(wasiOptions),
        "wasi:clocks/monotonic-clock": new ClocksMonotonicClockAsyncHost(wasiOptions),
        "wasi:clocks/wall-clock": new ClocksWallClockAsyncHost(wasiOptions),
        "wasi:filesystem/preopens": new FileSystemPreopensAsyncHost(wasiOptions),
        "wasi:filesystem/types": new FileSystemFileSystemAsyncHost(wasiOptions),
        'wasi:http/outgoing-handler': new WasiHttpOutgoingHandlerAsyncHost(wasiOptions),
        'wasi:http/types': new WasiHttpTypesAsyncHost(wasiOptions),      
        "wasi:io/streams": new IoStreamsAsyncHost(wasiOptions),
        "wasi:io/poll": new IoPollAsyncHost(wasiOptions),
        "wasi:sockets/instance-network": socketsNetworkInstance,
        "wasi:sockets/network": socketsNetworkInstance,
        "wasi:sockets/tcp": socketsTcpInstance,
        "wasi:sockets/tcp-create-socket": socketsTcpInstance,
        "wasi:sockets/udp": socketsUdpInstance,
        "wasi:sockets/udp-create-socket": socketsUdpInstance,
        "wasi:sockets/ip-name-lookup": socketsIpNameLookupInstance,
        "wasi:random/random": new RandomRandomAsynHost(wasiOptions),
        "wasi:random/insecure": new RandomInsecureAsyncHost(wasiOptions),
        "wasi:random/insecure-seed": new RandomInsecureSeedAsyncHost(wasiOptions),
        "wasi:cli/terminal-input": new TerminalInputAsyncHost(wasiOptions),
        "wasi:cli/terminal-output": new TerminalOutputAsyncHost(wasiOptions),
        "wasi:cli/terminal-stdin": new TerminalStdinAsyncHost(wasiOptions),
        "wasi:cli/terminal-stdout": new TerminalStdoutAsyncHost(wasiOptions),
        "wasi:cli/terminal-stderr": new TerminalStderrAsyncHost(wasiOptions),
    };
    return wasiPreview2Imports;
}
