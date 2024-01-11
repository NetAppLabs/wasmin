import { CliBaseEnvironmentNamespace } from "@wasmin/wasi-snapshot-preview2";
type CliBaseEnvironmentAsync = CliBaseEnvironmentNamespace.WasiCliEnvironmentAsync;
import { FilesystemPreopensNamespace } from "@wasmin/wasi-snapshot-preview2";
type FilesystemPreopensAsync = FilesystemPreopensNamespace.WasiFilesystemPreopensAsync;
import { CliBaseExitNamespace } from "@wasmin/wasi-snapshot-preview2";
type CliBaseExitAsync = CliBaseExitNamespace.WasiCliExitAsync;
import { CliBaseStdinNamespace } from "@wasmin/wasi-snapshot-preview2";
type CliBaseStdinAsync = CliBaseStdinNamespace.WasiCliStdinAsync;
import { CliBaseStdoutNamespace } from "@wasmin/wasi-snapshot-preview2";
type CliBaseStdoutAsync = CliBaseStdoutNamespace.WasiCliStdoutAsync;
import { CliBaseStderrNamespace } from "@wasmin/wasi-snapshot-preview2";
type CliBaseStderrAsync = CliBaseStderrNamespace.WasiCliStderrAsync;
import { FilesystemFilesystemNamespace } from "@wasmin/wasi-snapshot-preview2";
type FilesystemFilesystemAsync = FilesystemFilesystemNamespace.WasiFilesystemTypesAsync;
import { IoStreamsNamespace } from "@wasmin/wasi-snapshot-preview2";
type IoStreamsAsync = IoStreamsNamespace.WasiIoStreamsAsync;
import { RandomRandomNamespace } from "@wasmin/wasi-snapshot-preview2";
type RandomRandomAsync = RandomRandomNamespace.WasiRandomRandomAsync;
import { RandomInsecureNamespace } from "@wasmin/wasi-snapshot-preview2";
type RandomInsecureAsync = RandomInsecureNamespace.WasiRandomInsecureAsync;
import { RandomInsecureSeedNamespace } from "@wasmin/wasi-snapshot-preview2";
type RandomInsecureSeedAsync = RandomInsecureSeedNamespace.WasiRandomInsecureSeedAsync;

import { WasiOptions } from "../../wasi.js";
import { FileSystemFileSystemAsyncHost } from "./filesystem.js";
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
import { ClocksMonotonicClockNamespace } from "@wasmin/wasi-snapshot-preview2";
type ClocksMonotonicClockAsync = ClocksMonotonicClockNamespace.WasiClocksMonotonicClockAsync;
import { ClocksWallClockNamespace } from "@wasmin/wasi-snapshot-preview2";
type ClocksWallClockAsync = ClocksWallClockNamespace.WasiClocksWallClockAsync;
import { SocketsInstanceNetworkNamespace } from "@wasmin/wasi-snapshot-preview2";
type SocketsInstanceNetworkAsync = SocketsInstanceNetworkNamespace.WasiSocketsInstanceNetworkAsync;
import { SocketsNetworkNamespace } from "@wasmin/wasi-snapshot-preview2";
type SocketsNetworkAsync = SocketsNetworkNamespace.WasiSocketsNetworkAsync;
import { SocketsTcpCreateSocketNamespace } from "@wasmin/wasi-snapshot-preview2";
type SocketsTcpCreateSocketAsync = SocketsTcpCreateSocketNamespace.WasiSocketsTcpCreateSocketAsync;
import { SocketsTcpNamespace } from "@wasmin/wasi-snapshot-preview2";
type SocketsTcpAsync = SocketsTcpNamespace.WasiSocketsTcpAsync;
import { SocketsUdpCreateSocketNamespace } from "@wasmin/wasi-snapshot-preview2";
type WasiSocketsUdpCreateSocketAsync = SocketsUdpCreateSocketNamespace.WasiSocketsUdpCreateSocketAsync;
import { SocketsUdpNamespace } from "@wasmin/wasi-snapshot-preview2";
type WasiSocketsUdpAsync = SocketsUdpNamespace.WasiSocketsUdpAsync;

import { SocketsIpNameLookupNamespace } from "@wasmin/wasi-snapshot-preview2";
type SocketsIpNameLookupAsync = SocketsIpNameLookupNamespace.WasiSocketsIpNameLookupAsync;
import { SocketsIpNameLookupAsyncHost, SocketsNetworkAsyncHost, SocketsTcpAsyncHost, WasiSocketsUdpAsyncHost } from "./sockets.js";
import { IOPollNamespace } from "@wasmin/wasi-snapshot-preview2";
type IoPollAsync = IOPollNamespace.WasiIoPollAsync;
import { TerminalStdInNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalStdinAsync = TerminalStdInNamespace.WasiCliTerminalStdinAsync;
type TerminalInput = TerminalStdInNamespace.TerminalInput;
import { TerminalStdOutNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalStdoutAsync = TerminalStdOutNamespace.WasiCliTerminalStdoutAsync;
type TerminalOutput = TerminalStdOutNamespace.TerminalOutput;
import { TerminalStErrNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalStderrAsync = TerminalStErrNamespace.WasiCliTerminalStderrAsync;
type TerminalOutputErr = TerminalStErrNamespace.TerminalOutput;
import { TerminalInputNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalInputAsync = TerminalInputNamespace.WasiCliTerminalInputAsync;
import { TerminalOutputNamespace } from "@wasmin/wasi-snapshot-preview2";
type TerminalOutputAsync = TerminalOutputNamespace.WasiCliTerminalOutputAsync;
import { TerminalInputAsyncHost, TerminalOutputAsyncHost, TerminalStderrAsyncHost, TerminalStdinAsyncHost, TerminalStdoutAsyncHost } from "./terminal.js";

export type WasiSnapshotPreview2AsyncImportObject = {
    "wasi:cli/environment": CliBaseEnvironmentAsync;
    "wasi:cli/exit": CliBaseExitAsync;
    "wasi:cli/stdin": CliBaseStdinAsync;
    "wasi:cli/stdout": CliBaseStdoutAsync;
    "wasi:cli/stderr": CliBaseStderrAsync;
    "wasi:clocks/monotonic-clock": ClocksMonotonicClockAsync;
    "wasi:clocks/wall-clock": ClocksWallClockAsync;
    "wasi:filesystem/preopens": FilesystemPreopensAsync;
    "wasi:filesystem/types": FilesystemFilesystemAsync;
    "wasi:io/streams": IoStreamsAsync;
    "wasi:io/poll": IoPollAsync;
    "wasi:sockets/instance-network": SocketsInstanceNetworkAsync;
    "wasi:sockets/network": SocketsNetworkAsync;
    "wasi:sockets/tcp": SocketsTcpAsync;
    "wasi:sockets/tcp-create-socket": SocketsTcpCreateSocketAsync;
    "wasi:sockets/udp": WasiSocketsUdpAsync;
    "wasi:sockets/udp-create-socket": WasiSocketsUdpCreateSocketAsync;
    "wasi:sockets/ip-name-lookup": SocketsIpNameLookupAsync;
    "wasi:random/random": RandomRandomAsync;
    "wasi:random/insecure": RandomInsecureAsync;
    "wasi:random/insecure-seed": RandomInsecureSeedAsync;
    "wasi:cli/terminal-input": TerminalInputAsync;
    "wasi:cli/terminal-output": TerminalOutputAsync;
    "wasi:cli/terminal-stdin": TerminalStdinAsync;
    "wasi:cli/terminal-stdout": TerminalStdoutAsync;
    "wasi:cli/terminal-stderr": TerminalStderrAsync;
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
