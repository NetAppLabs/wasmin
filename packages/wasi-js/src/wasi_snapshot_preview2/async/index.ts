import { CliBaseEnvironmentNamespace, FilesystemsMountNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type CliBaseEnvironment = CliBaseEnvironmentNamespace.WasiCliEnvironment;
import { FilesystemPreopensNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type FilesystemPreopens = FilesystemPreopensNamespace.WasiFilesystemPreopens;
import { CliBaseExitNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type CliBaseExit = CliBaseExitNamespace.WasiCliExit;
import { CliBaseStdinNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type CliBaseStdin = CliBaseStdinNamespace.WasiCliStdin;
import { CliBaseStdoutNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type CliBaseStdout = CliBaseStdoutNamespace.WasiCliStdout;
import { CliBaseStderrNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type CliBaseStderr = CliBaseStderrNamespace.WasiCliStderr;
import { FilesystemFilesystemNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type FilesystemFilesystem = FilesystemFilesystemNamespace.WasiFilesystemTypes;
import { IoErrorNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type IoError = IoErrorNamespace.WasiIoError;
import { IoStreamsNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type IoStreams = IoStreamsNamespace.WasiIoStreams;
import { RandomRandomNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type RandomRandom = RandomRandomNamespace.WasiRandomRandom;
import { RandomInsecureNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type RandomInsecure = RandomInsecureNamespace.WasiRandomInsecure;
import { RandomInsecureSeedNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type RandomInsecureSeed = RandomInsecureSeedNamespace.WasiRandomInsecureSeed;
import { HttpOutgoingHandlerNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type WasiHttpOutgoingHandler = HttpOutgoingHandlerNamespace.WasiHttpOutgoingHandler;
import { HttpTypesNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type WasiHttpTypes = HttpTypesNamespace.WasiHttpTypes;
import { TerminalInputExtendedNamespace as terminputextns } from "@netapplabs/wasi-snapshot-preview2/async";
import { TerminalOutputExtendedNamespace as termoutputextns } from "@netapplabs/wasi-snapshot-preview2/async";
import { TerminalStdInExtendedNamespace as termstdinextns } from "@netapplabs/wasi-snapshot-preview2/async";
import { TerminalStdOutExtendedNamespace as termstdoutextns } from "@netapplabs/wasi-snapshot-preview2/async";
import { TerminalStdErrExtendedNamespace as termstderrextns } from "@netapplabs/wasi-snapshot-preview2/async";

type TerminalInputExtended = terminputextns.WasiExtCliTerminalInputExtended;
type TerminalOutputExtended = termoutputextns.WasiExtCliTerminalOutputExtended;
type TerminalStdinExtended = termstdinextns.WasiExtCliTerminalStdinExtended;
type TerminalStdoutExtended = termstdoutextns.WasiExtCliTerminalStdoutExtended;
type TerminalStderrExtended = termstderrextns.WasiExtCliTerminalStderrExtended;

import { WasiOptions } from "../../wasi.js";
import { FileSystemFileSystemAsyncHost } from "./filesystem.js";
import { WasiHttpOutgoingHandlerAsyncHost, WasiHttpTypesAsyncHost } from "./http.js";
import { IoErrorAsyncHost, IoPollAsyncHost, IoStreamsAsyncHost } from "./io.js";
import { RandomInsecureSeedAsyncHost, RandomRandomAsyncHost } from "./random.js";
import { RandomInsecureAsyncHost } from "./random.js";
import { CliBaseEnvironmentAsyncHost } from "./cli.js";
import { FileSystemPreopensAsyncHost } from "./filesystem.js";
import { CliBaseExitAsyncHost } from "./cli.js";
import { CliBaseStdinAsyncHost } from "./cli.js";
import { CliBaseStdoutAsyncHost } from "./cli.js";
import { CliBaseStderrAsyncHost } from "./cli.js";
import { ClocksMonotonicClockAsyncHost, ClocksWallClockAsyncHost } from "./clocks.js";
import { ClocksMonotonicClockNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type ClocksMonotonicClock = ClocksMonotonicClockNamespace.WasiClocksMonotonicClock;
import { ClocksWallClockNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type ClocksWallClock = ClocksWallClockNamespace.WasiClocksWallClock;
import { SocketsInstanceNetworkNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type SocketsInstanceNetwork = SocketsInstanceNetworkNamespace.WasiSocketsInstanceNetwork;
import { SocketsNetworkNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type SocketsNetwork = SocketsNetworkNamespace.WasiSocketsNetwork;
import { SocketsTcpCreateSocketNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type SocketsTcpCreateSocket = SocketsTcpCreateSocketNamespace.WasiSocketsTcpCreateSocket;
import { SocketsTcpNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type SocketsTcp = SocketsTcpNamespace.WasiSocketsTcp;
import { SocketsUdpCreateSocketNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type WasiSocketsUdpCreateSocket = SocketsUdpCreateSocketNamespace.WasiSocketsUdpCreateSocket;
import { SocketsUdpNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type WasiSocketsUdp = SocketsUdpNamespace.WasiSocketsUdp;

import { SocketsIpNameLookupNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type SocketsIpNameLookup = SocketsIpNameLookupNamespace.WasiSocketsIpNameLookup;
import { SocketsIpNameLookupAsyncHost, SocketsNetworkAsyncHost, SocketsTcpAsyncHost, WasiSocketsUdpAsyncHost } from "./sockets.js";
import { IOPollNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type IoPoll = IOPollNamespace.WasiIoPoll;
import { TerminalStdInNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalStdin = TerminalStdInNamespace.WasiCliTerminalStdin;
import { TerminalStdOutNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalStdout = TerminalStdOutNamespace.WasiCliTerminalStdout;
import { TerminalStErrNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalStderr = TerminalStErrNamespace.WasiCliTerminalStderr;
type TerminalOutputErr = TerminalStErrNamespace.TerminalOutput;
import { TerminalInputNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalInput = TerminalInputNamespace.WasiCliTerminalInput;
import { TerminalOutputNamespace } from "@netapplabs/wasi-snapshot-preview2/async";
type TerminalOutput = TerminalOutputNamespace.WasiCliTerminalOutput;
import { TerminalStderrAsyncHost, TerminalStdinAsyncHost, TerminalStdoutAsyncHost } from "./terminal.js";

import { FilesystemsMountNamespace as fsmns } from "@netapplabs/wasi-snapshot-preview2/async";
import { ProcessNamespace as procns } from "@netapplabs/wasi-snapshot-preview2/async";

type WasiExtFilesystemsMount = fsmns.WasiExtFilesystemsMount;
type WasiExtProcessProcess = procns.WasiExtProcessProcess;

import { isFunction } from "../../workerUtils.js";
import { wasiPreview2Debug } from "../../wasiDebug.js";
import { WasiExtFilesystemsMountAsyncHost } from "./mount.js";
import { WasiExtProcessProcessAsyncHost } from "./process.js";

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
    "wasi:http/outgoing-handler": WasiHttpOutgoingHandler,
    "wasi:http/types": WasiHttpTypes,  
    "wasi:io/error": IoError;
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
    "wasi:cli/terminal-stdin": TerminalStdin;
    "wasi:cli/terminal-stdout": TerminalStdout;
    "wasi:cli/terminal-stderr": TerminalStderr;
    "wasi:cli/terminal-input": TerminalInput;
    "wasi:cli/terminal-output": TerminalOutput;
    "wasi-ext:cli/terminal-stdin-extended": TerminalInputExtended;
    "wasi-ext:cli/terminal-stdout-extended": TerminalStdoutExtended;
    "wasi-ext:cli/terminal-stderr-extended": TerminalStderrExtended;
    "wasi-ext:cli/terminal-input-extended": TerminalInputExtended;
    "wasi-ext:cli/terminal-output-extended": TerminalOutputExtended;
    "wasi-ext:filesystems/mount": WasiExtFilesystemsMount,
    "wasi-ext:process/process": WasiExtProcessProcess,
};

export function constructWasiSnapshotPreview2Imports(wasiOptions: WasiOptions): WasiSnapshotPreview2AsyncImportObject {
    const socketsNetworkInstance = new SocketsNetworkAsyncHost(wasiOptions);
    const socketsTcpInstance = new SocketsTcpAsyncHost(wasiOptions);
    const socketsUdpInstance = new WasiSocketsUdpAsyncHost(wasiOptions);
    const socketsIpNameLookupInstance = new SocketsIpNameLookupAsyncHost(wasiOptions);

    const termStdInHost = new TerminalStdinAsyncHost(wasiOptions);
    const termStdOutHost = new TerminalStdoutAsyncHost(wasiOptions);
    const termStdErrHost = new TerminalStderrAsyncHost(wasiOptions);
    
    const termInputHost = termStdInHost;
    const termOutputHost = termStdOutHost;
    const mountHost = new WasiExtFilesystemsMountAsyncHost(wasiOptions);
    const processHost = new WasiExtProcessProcessAsyncHost(wasiOptions);

    let wasiPreview2Imports: WasiSnapshotPreview2AsyncImportObject = {
        "wasi:cli/environment": new CliBaseEnvironmentAsyncHost(wasiOptions),
        "wasi:cli/exit": new CliBaseExitAsyncHost(wasiOptions),
        "wasi:cli/stdin": new CliBaseStdinAsyncHost(wasiOptions),
        "wasi:cli/stdout": new CliBaseStdoutAsyncHost(wasiOptions),
        "wasi:cli/stderr": new CliBaseStderrAsyncHost(wasiOptions),
        "wasi:clocks/monotonic-clock": new ClocksMonotonicClockAsyncHost(wasiOptions),
        "wasi:clocks/wall-clock": new ClocksWallClockAsyncHost(wasiOptions),
        "wasi:filesystem/preopens": new FileSystemPreopensAsyncHost(wasiOptions),
        "wasi:filesystem/types": new FileSystemFileSystemAsyncHost(wasiOptions),
        "wasi:http/outgoing-handler": new WasiHttpOutgoingHandlerAsyncHost(wasiOptions),
        "wasi:http/types": new WasiHttpTypesAsyncHost(wasiOptions),      
        "wasi:io/error": new IoErrorAsyncHost(wasiOptions),
        "wasi:io/streams": new IoStreamsAsyncHost(wasiOptions),
        "wasi:io/poll": new IoPollAsyncHost(wasiOptions),
        "wasi:sockets/instance-network": socketsNetworkInstance,
        "wasi:sockets/network": socketsNetworkInstance,
        "wasi:sockets/tcp": socketsTcpInstance,
        "wasi:sockets/tcp-create-socket": socketsTcpInstance,
        "wasi:sockets/udp": socketsUdpInstance,
        "wasi:sockets/udp-create-socket": socketsUdpInstance,
        "wasi:sockets/ip-name-lookup": socketsIpNameLookupInstance,
        "wasi:random/random": new RandomRandomAsyncHost(wasiOptions),
        "wasi:random/insecure": new RandomInsecureAsyncHost(wasiOptions),
        "wasi:random/insecure-seed": new RandomInsecureSeedAsyncHost(wasiOptions),
        "wasi:cli/terminal-stdin": termStdInHost,
        "wasi:cli/terminal-stdout": termStdOutHost,
        "wasi:cli/terminal-stderr": termStdErrHost,
        "wasi:cli/terminal-input": termInputHost,
        "wasi:cli/terminal-output": termOutputHost,    
        "wasi-ext:cli/terminal-stdin-extended": termStdInHost,
        "wasi-ext:cli/terminal-stdout-extended": termStdOutHost,
        "wasi-ext:cli/terminal-stderr-extended": termStdErrHost,
        "wasi-ext:cli/terminal-input-extended": termInputHost,
        "wasi-ext:cli/terminal-output-extended": termOutputHost,
        "wasi-ext:filesystems/mount": mountHost,
        "wasi-ext:process/process": processHost,
    };
    wasiPreview2Imports = ensureThisBound(wasiPreview2Imports);
    return wasiPreview2Imports;
}

// Ensure that 'this' is bound on all instance functions
export function ensureThisBound(importObj: WasiSnapshotPreview2AsyncImportObject): WasiSnapshotPreview2AsyncImportObject {
    for (const [nsKey, nsObj] of Object.entries(importObj)) {
        let nsObjAny = nsObj as any;
        let nsObjProto = Object.getPrototypeOf(nsObjAny);
        if (nsObjProto !== undefined) {
            for (let property of Object.getOwnPropertyNames(nsObjProto)) {
                let elemKey = property;
                let nsElement = nsObjAny[elemKey];
                if (isFunction(nsElement)) {
                    if (nsElement.bind) {
                        let newNsElement = nsElement.bind(nsObj);
                        let nsObjAny = nsObj as any;
                        nsObjAny[elemKey] = newNsElement;
                    }
                }
            }
        }
    }
    return importObj;
}