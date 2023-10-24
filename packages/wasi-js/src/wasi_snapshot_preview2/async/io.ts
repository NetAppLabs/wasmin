import { IoStreamsNamespace as io } from "@wasmin/wasi-snapshot-preview2";
type IoStreamsAsync = io.WasiIoStreamsAsync;
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { isBadFileDescriptor, isErrorAgain, translateError, wasiPreview2Debug } from "./preview2Utils.js";
import { FsPollable, OpenFiles } from "../../wasiFileSystem.js";
import { sleep } from "../../wasiUtils.js";
import { USE_ACCEPTED_SOCKET_PROMISE } from "../../wasi_experimental_sockets/net.js";
import { delay } from "../../wasi_experimental_sockets/common.js";

type InputStream = io.InputStream;
type OutputStream = io.OutputStream;
type Pollable = io.Pollable;
type StreamStatus = io.StreamStatus;

export class InputStreamPollable implements FsPollable {
    fd: number;
    openFiles: OpenFiles;
    constructor(openFiles: OpenFiles, fd: number) {
        this.fd = fd;
        this.openFiles = openFiles;
    }
    async done(): Promise<boolean> {
        try {
            const ofd = this.openFiles.get(this.fd);
            const ofda = ofd as any;
            if (ofda.peek) {
                let peekBytes = await ofda.peek();
                wasiPreview2Debug(`[io/streams] InputStreamPollable peekBytes: ${peekBytes} for fd: ${this.fd}`);
                if (peekBytes > 0) {
                    return true;
                }
            }
            if (ofda.hasConnectedClient) {
                let hasConnectedClient = await ofda.hasConnectedClient();
                if (hasConnectedClient) {
                    return hasConnectedClient;
                }
            }
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] InputStreamPollable.done fd: ${this.fd} err:`, err);
            if (isBadFileDescriptor(err)) {
                return true;
            }
        } 
        return false;
    }
}


export class IoStreamsAsyncHost implements IoStreamsAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

    async read(instr: InputStream, len: bigint): Promise<[Uint8Array, StreamStatus]> {
        let streamStatus: StreamStatus = 'ended';
        try {
            wasiPreview2Debug(`[io/streams] io:read ${instr} starting`);
            if (len == 0n) {
                return [new Uint8Array(), streamStatus];
            }
            const reader = this.openFiles.getAsReadable(instr);
            // TODO: handle bigint
            const buffer = await reader.read(Number(len));
            let isEnd = false;
            if (buffer.length < len) {
                isEnd = true;
            }
            if (isEnd) {
                streamStatus = 'ended';
            } else {
                streamStatus = 'open';
            }
            wasiPreview2Debug(`[io/streams] io:read ${instr} returning`,[buffer, streamStatus]);
            return [buffer, streamStatus];    
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] io:read ${instr} catching err:`, err);
            if (isErrorAgain(err)) {
                streamStatus = 'open';
            }
            return [new Uint8Array(), streamStatus];
        }
    }
    async blockingRead(instr: InputStream, len: bigint): Promise<[Uint8Array, StreamStatus]> {
        return await this.read(instr, len);
    }

    async blockingSkip(instr: InputStream, len: bigint): Promise<[bigint, StreamStatus]> {
        let [arr,streamStatus] = await this.blockingRead(instr, len);
        let numRead = BigInt(arr.length);
        return [numRead,streamStatus];
    }

    async subscribeToInputStream(instr: InputStream): Promise<Pollable> {
        const pollable = new InputStreamPollable(this.openFiles, instr);
        return this._wasiEnv.openFiles.add(pollable);
    }

    async dropInputStream(instr: InputStream): Promise<void> {
        wasiPreview2Debug(`[io/streams] dropInputStream fd: ${instr}`);
        try {
            await this.openFiles.closeReader(instr);
        } catch (err: any) {
            wasiPreview2Debug("[io/streams] dropInputStream err: ",err);
        }
    }
    async write(outstr: OutputStream, contents: Uint8Array): Promise<void> {
        try {
            const writer = this.openFiles.getAsWritable(outstr);
            const len = await writer.write(contents);
            const written = contents.length;
            return;
        } catch (err: any) {
            wasiPreview2Debug("[io/streams] write err: ",err);
        }
    }

    async checkWrite(this0: OutputStream): Promise<bigint> {
        // Default to 1MB
        // TODO make more intelligent
        //return 4096n;
        return 1048576n;
    }

    async blockingWriteAndFlush(outstr: OutputStream, contents: Uint8Array): Promise<void> {
        try {
            return await this.write(outstr, contents);
        } catch (err: any) {
            wasiPreview2Debug("[io/streams] blockingWriteAndFlush err: ",err);
        }
    }

    async writeZeroes(outstr: OutputStream, len: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async blockingWriteZeroes(outstr: OutputStream, len: bigint): Promise<bigint> {
        throw new Error("Method not implemented.");
    }

    async splice(outstr: OutputStream, src: number, len: bigint): Promise<[bigint, StreamStatus]> {
        throw new Error("Method not implemented.");
    }

    async blockingSplice(outstr: OutputStream, src: number, len: bigint): Promise<[bigint, StreamStatus]> {
        throw new Error("Method not implemented.");
    }

    async forward(this0: OutputStream, src: InputStream): Promise<[bigint, StreamStatus]> {
        throw new Error("Method not implemented.");
    }

    async subscribeToOutputStream(outstr: OutputStream): Promise<Pollable> {
        throw new Error("Method not implemented.");
    }

    async dropOutputStream(outstr: OutputStream): Promise<void> {
        wasiPreview2Debug(`[io/streams] dropOutputStream for fd: ${outstr}`);
        try {
            await this.openFiles.closeWriter(outstr);
        } catch (err: any) {
            wasiPreview2Debug("[io/streams] dropOutputStream err: ",err);
        }
    }

    async skip(instr: InputStream, len: bigint): Promise<[bigint, io.StreamStatus]> {
        let [arr,streamStatus] = await this.read(instr, len);
        let numRead = BigInt(arr.length);
        return [numRead,streamStatus];
    }

    async flush(this0: number): Promise<void> {
        // TODO revise this
        // NOOP for now
        return;
    }

    async blockingFlush(this0: number): Promise<void> {
        // TODO revise this
        // NOOP for now
        return;
    }
}
