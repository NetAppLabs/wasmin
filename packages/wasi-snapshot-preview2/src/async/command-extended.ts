import { WasiExtCliTerminalInputExtended } from './interfaces/wasi-ext-cli-terminal-input-extended.js';
import { WasiExtCliTerminalOutputExtended } from './interfaces/wasi-ext-cli-terminal-output-extended.js';
import { WasiExtCliTerminalStderrExtended } from './interfaces/wasi-ext-cli-terminal-stderr-extended.js';
import { WasiExtCliTerminalStdinExtended } from './interfaces/wasi-ext-cli-terminal-stdin-extended.js';
import { WasiExtCliTerminalStdoutExtended } from './interfaces/wasi-ext-cli-terminal-stdout-extended.js';
import { WasiExtFilesystemsMount } from './interfaces/wasi-ext-filesystems-mount.js';
import { WasiExtProcessProcess } from './interfaces/wasi-ext-process-process.js';
import { WasiCliEnvironment } from './interfaces/wasi-cli-environment.js';
import { WasiCliExit } from './interfaces/wasi-cli-exit.js';
import { WasiCliStderr } from './interfaces/wasi-cli-stderr.js';
import { WasiCliStdin } from './interfaces/wasi-cli-stdin.js';
import { WasiCliStdout } from './interfaces/wasi-cli-stdout.js';
import { WasiCliTerminalInput } from './interfaces/wasi-cli-terminal-input.js';
import { WasiCliTerminalOutput } from './interfaces/wasi-cli-terminal-output.js';
import { WasiCliTerminalStderr } from './interfaces/wasi-cli-terminal-stderr.js';
import { WasiCliTerminalStdin } from './interfaces/wasi-cli-terminal-stdin.js';
import { WasiCliTerminalStdout } from './interfaces/wasi-cli-terminal-stdout.js';
import { WasiClocksMonotonicClock } from './interfaces/wasi-clocks-monotonic-clock.js';
import { WasiClocksWallClock } from './interfaces/wasi-clocks-wall-clock.js';
import { WasiFilesystemPreopens } from './interfaces/wasi-filesystem-preopens.js';
import { WasiFilesystemTypes } from './interfaces/wasi-filesystem-types.js';
import { WasiHttpOutgoingHandler } from './interfaces/wasi-http-outgoing-handler.js';
import { WasiHttpTypes } from './interfaces/wasi-http-types.js';
import { WasiIoError } from './interfaces/wasi-io-error.js';
import { WasiIoPoll } from './interfaces/wasi-io-poll.js';
import { WasiIoStreams } from './interfaces/wasi-io-streams.js';
import { WasiRandomInsecureSeed } from './interfaces/wasi-random-insecure-seed.js';
import { WasiRandomInsecure } from './interfaces/wasi-random-insecure.js';
import { WasiRandomRandom } from './interfaces/wasi-random-random.js';
import { WasiSocketsInstanceNetwork } from './interfaces/wasi-sockets-instance-network.js';
import { WasiSocketsIpNameLookup } from './interfaces/wasi-sockets-ip-name-lookup.js';
import { WasiSocketsNetwork } from './interfaces/wasi-sockets-network.js';
import { WasiSocketsTcpCreateSocket } from './interfaces/wasi-sockets-tcp-create-socket.js';
import { WasiSocketsTcp } from './interfaces/wasi-sockets-tcp.js';
import { WasiSocketsUdpCreateSocket } from './interfaces/wasi-sockets-udp-create-socket.js';
import { WasiSocketsUdp } from './interfaces/wasi-sockets-udp.js';
import { WasiCliRun } from './interfaces/wasi-cli-run.js';
export interface CommandExtended {
  'wasi:cli/run@0.2.0': WasiCliRun,
  run: WasiCliRun,
}
