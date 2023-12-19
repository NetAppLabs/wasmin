

import { WasiCliEnvironment } from './interfaces/wasi-cli-environment';
import { WasiCliExit } from './interfaces/wasi-cli-exit';
import { WasiCliStderr } from './interfaces/wasi-cli-stderr';
import { WasiCliStdin } from './interfaces/wasi-cli-stdin';
import { WasiCliStdout } from './interfaces/wasi-cli-stdout';
import { WasiCliTerminalInput } from './interfaces/wasi-cli-terminal-input';
import { WasiCliTerminalOutput } from './interfaces/wasi-cli-terminal-output';
import { WasiCliTerminalStderr } from './interfaces/wasi-cli-terminal-stderr';
import { WasiCliTerminalStdin } from './interfaces/wasi-cli-terminal-stdin';
import { WasiCliTerminalStdout } from './interfaces/wasi-cli-terminal-stdout';
import { WasiClocksMonotonicClock } from './interfaces/wasi-clocks-monotonic-clock';
import { WasiClocksWallClock } from './interfaces/wasi-clocks-wall-clock';
import { WasiFilesystemPreopens } from './interfaces/wasi-filesystem-preopens';
import { WasiFilesystemTypes } from './interfaces/wasi-filesystem-types';
import { WasiIoStreams } from './interfaces/wasi-io-streams';
import { WasiPollPoll } from './interfaces/wasi-poll-poll';
import { WasiRandomRandom } from './interfaces/wasi-random-random';
import { WasiSocketsInstanceNetwork } from './interfaces/wasi-sockets-instance-network';
import { WasiSocketsIpNameLookup } from './interfaces/wasi-sockets-ip-name-lookup';
import { WasiSocketsNetwork } from './interfaces/wasi-sockets-network';
import { WasiSocketsTcp } from './interfaces/wasi-sockets-tcp';
import { WasiSocketsTcpCreateSocket } from './interfaces/wasi-sockets-tcp-create-socket';
import { WasiSocketsUdp } from './interfaces/wasi-sockets-udp';
import { WasiSocketsUdpCreateSocket } from './interfaces/wasi-sockets-udp-create-socket';
import { WasiCliRun } from './interfaces/wasi-cli-run';
export interface ImportObject {
  'wasi:cli/environment': typeof WasiCliEnvironment,
  'wasi:cli/exit': typeof WasiCliExit,
  'wasi:cli/stderr': typeof WasiCliStderr,
  'wasi:cli/stdin': typeof WasiCliStdin,
  'wasi:cli/stdout': typeof WasiCliStdout,
  'wasi:cli/terminal-input': typeof WasiCliTerminalInput,
  'wasi:cli/terminal-output': typeof WasiCliTerminalOutput,
  'wasi:cli/terminal-stderr': typeof WasiCliTerminalStderr,
  'wasi:cli/terminal-stdin': typeof WasiCliTerminalStdin,
  'wasi:cli/terminal-stdout': typeof WasiCliTerminalStdout,
  'wasi:clocks/monotonic-clock': typeof WasiClocksMonotonicClock,
  'wasi:clocks/wall-clock': typeof WasiClocksWallClock,
  'wasi:filesystem/preopens': typeof WasiFilesystemPreopens,
  'wasi:filesystem/types': typeof WasiFilesystemTypes,
  'wasi:io/streams': typeof WasiIoStreams,
  'wasi:poll/poll': typeof WasiPollPoll,
  'wasi:random/random': typeof WasiRandomRandom,
  'wasi:sockets/instance-network': typeof WasiSocketsInstanceNetwork,
  'wasi:sockets/ip-name-lookup': typeof WasiSocketsIpNameLookup,
  // @ts-ignore
  //'wasi:sockets/network': typeof WasiSocketsNetwork,
  'wasi:sockets/tcp': typeof WasiSocketsTcp,
  'wasi:sockets/tcp-create-socket': typeof WasiSocketsTcpCreateSocket,
  'wasi:sockets/udp': typeof WasiSocketsUdp,
  'wasi:sockets/udp-create-socket': typeof WasiSocketsUdpCreateSocket,
}

import { instantiate as componentInstantiate } from './component.js';

export async function instantiate(
    compileCore: (path: string, imports: Record<string, any>) => Promise<WebAssembly.Module>,
    imports: ImportObject,
    instantiateCore?: (module: WebAssembly.Module, imports: Record<string, any>) => Promise<WebAssembly.Instance>
    ): Promise<Root>{
        // @ts-ignore
        return await componentInstantiate(compileCore, imports, instantiateCore);
}    

export interface Root {
  'wasi:cli/run': typeof WasiCliRun,
  run: typeof WasiCliRun,
}

const isNode = typeof process !== "undefined" && process.versions && process.versions.node;

export async function fetchCompile(url: URL) {
    if (isNode) {
        let _fs = await import("fs/promises");
        return WebAssembly.compile(await _fs.readFile(url));
    }
    return fetch(url).then(WebAssembly.compileStreaming);
}

export async function compileCore(url: string) {
    // special case for main core module of component
    /*if (url == "component.core.wasm") {
        if (this.wasmModOrBufferSource) {
            if (this.wasmModOrBufferSource instanceof WebAssembly.Module) {
                return this.wasmModOrBufferSource as WebAssembly.Module;
            } else {
                const bufSource = this.wasmModOrBufferSource as BufferSource;
                const mod = await WebAssembly.compile(bufSource);
                return mod;
            }
        } else {
            throw new Error("Wasm module source not set");
        }
    }*/
    if (url == "component.core.wasm") {
        throw new Error("unsupported component.core.wasm");
    } else if (url == "component.core2.wasm") {
        const metaUrl = new URL("./component.core2.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    } else if (url == "component.core3.wasm") {
        const metaUrl = new URL("./component.core3.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    } else if (url == "component.core4.wasm") {
        const metaUrl = new URL("./component.core4.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    } else if (url == "component.core5.wasm") {
        const metaUrl = new URL("./component.core5.wasm", import.meta.url);
        return await fetchCompile(metaUrl);
    } else {
        throw new Error(`unsupported wasm URL: ${url}`);
    }
    /*url = "./" + url;
    const metaUrl = new URL(url, import.meta.url);
    return await fetchCompile(metaUrl);
    */
}