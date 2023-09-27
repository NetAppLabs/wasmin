import { IoStreamsNamespace as io } from "@wasm-env/wasi-snapshot-preview2";
type IoStreamsAsync = io.WasiIoStreamsAsync;
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { translateError } from "./preview2Utils.js";

type InputStream = io.InputStream;
type OutputStream = io.OutputStream;
type Pollable = io.Pollable;
type StreamStatus = io.StreamStatus;

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

    //async read(instr: InputStream, len: bigint): Promise<[Uint8Array | ArrayBuffer, StreamStatus]>{
    async read(instr: InputStream, len: bigint): Promise<[Uint8Array, StreamStatus]> {
        try {
            let streamStatus: StreamStatus = 'ended';
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
            return [buffer, streamStatus];
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async blockingRead(instr: InputStream, len: bigint): Promise<[Uint8Array, StreamStatus]> {
        return await this.read(instr, len);
    }
    async (instr: InputStream, len: bigint): Promise<[bigint, boolean]> {
        throw new Error("Method not implemented.");
    }
    async blockingSkip(instr: InputStream, len: bigint): Promise<[bigint, StreamStatus]> {
        throw new Error("Method not implemented.");
    }
    async subscribeToInputStream(instr: InputStream): Promise<Pollable> {
        throw new Error("Method not implemented.");
    }
    async dropInputStream(instr: InputStream): Promise<void> {
        try {
            await this.openFiles.close(instr);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async write(outstr: OutputStream, contents: Uint8Array): Promise<void> {
        try {
            const writer = this.openFiles.getAsWritable(outstr);
            const len = await writer.write(contents);
            const written = contents.length;
            return;
        } catch (err: any) {
            throw translateError(err);
        }
    }

    async checkWrite(this0: OutputStream): Promise<bigint> {
        // Default to 1MB
        // TODO make more intelligent
        return 1048576n;
    }

    async blockingWriteAndFlush(outstr: OutputStream, contents: Uint8Array): Promise<void> {
        try {
            return await this.write(outstr, contents);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    writeZeroes(outstr: OutputStream, len: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    blockingWriteZeroes(outstr: OutputStream, len: bigint): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    splice(outstr: OutputStream, src: number, len: bigint): Promise<[bigint, StreamStatus]> {
        throw new Error("Method not implemented.");
    }
    blockingSplice(outstr: OutputStream, src: number, len: bigint): Promise<[bigint, StreamStatus]> {
        throw new Error("Method not implemented.");
    }
    async forward(this0: OutputStream, src: InputStream): Promise<[bigint, StreamStatus]> {
        throw new Error("Method not implemented.");
    }
    subscribeToOutputStream(outstr: OutputStream): Promise<Pollable> {
        throw new Error("Method not implemented.");
    }
    async dropOutputStream(outstr: OutputStream): Promise<void> {
        try {
            await this.openFiles.close(outstr);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async skip(this0: number, len: bigint): Promise<[bigint, io.StreamStatus]> {
        throw new Error("Method not implemented.");
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
