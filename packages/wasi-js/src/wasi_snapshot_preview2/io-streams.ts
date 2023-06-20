import { IoStreamsNamespace as io } from "@wasm-env/wasi-snapshot-preview2";
import { IoStreamsAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/io-streams";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi";

type InputStream = io.InputStream;
type OutputStream = io.OutputStream;

export class IoStreamsAsyncHost implements IoStreamsAsync {
    private _wasiEnv: WasiEnv;
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    get wasiEnv(){
        return this._wasiEnv;
    }
    get openFiles(){
        return this.wasiEnv.openFiles;
    }
    async read(instr: InputStream, len: bigint): Promise<[Uint8Array | ArrayBuffer, boolean]> {
        const reader = this.openFiles.getAsReadable(instr);
        // TODO: handle bigint
        const buffer = await reader.read(Number(len));
        return [buffer,true];
    }
    async blockingRead(instr: InputStream, len: bigint): Promise<[Uint8Array | ArrayBuffer, boolean]> {
        return await this.read(instr, len);
    }
    skip(instr: InputStream, len: bigint): Promise<[bigint, boolean]> {
        throw new Error("Method not implemented.");
    }
    blockingSkip(instr: InputStream, len: bigint): Promise<[bigint, boolean]> {
        throw new Error("Method not implemented.");
    }
    subscribeToInputStream(instr: InputStream): Promise<number> {
        throw new Error("Method not implemented.");
    }
    dropInputStream(instr: InputStream): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async write(outstr: OutputStream, buf: Uint8Array): Promise<bigint> {
        const writer = this.openFiles.getAsWritable(outstr);
        const len = await writer.write(buf);
        const written = buf.length;
        // TODO: handle bigint
        return BigInt(written);
    }
    async blockingWrite(outstr: OutputStream, buf: Uint8Array): Promise<bigint> {
        return await this.write(outstr, buf);
    }
    writeZeroes(outstr: OutputStream, len: bigint): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    blockingWriteZeroes(outstr: OutputStream, len: bigint): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    splice(outstr: OutputStream, src: number, len: bigint): Promise<[bigint, boolean]> {
        throw new Error("Method not implemented.");
    }
    blockingSplice(outstr: OutputStream, src: number, len: bigint): Promise<[bigint, boolean]> {
        throw new Error("Method not implemented.");
    }
    forward(outstr: OutputStream, src: number): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    subscribeToOutputStream(outstr: OutputStream): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async dropOutputStream(outstr: OutputStream): Promise<void> {
        await this.openFiles.close(outstr);
    }

}