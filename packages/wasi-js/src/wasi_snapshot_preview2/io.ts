import { IoStreamsNamespace as io } from "@wasm-env/wasi-snapshot-preview2";
import { IoStreamsAsync } from "@wasm-env/wasi-snapshot-preview2/dist/imports/io-streams";
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../wasi.js";
import { translateError } from "./preview2Utils.js";

type InputStream = io.InputStream;
type OutputStream = io.OutputStream;
type Pollable = io.Pollable;

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
        try{
            if (len == 0n) {
                return [new Uint8Array(), true];
            }
            const reader = this.openFiles.getAsReadable(instr);
            // TODO: handle bigint
            const buffer = await reader.read(Number(len));
            let isEnd = false;
            if (buffer.length < len ) {
                isEnd = true;
            }
            return [buffer,isEnd];
        } catch (err: any) {
            throw translateError(err);
        }
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
    subscribeToInputStream(instr: InputStream): Promise<Pollable> {
        throw new Error("Method not implemented.");
    }
    async dropInputStream(instr: InputStream): Promise<void> {
        try{
            await this.openFiles.close(instr);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async write(outstr: OutputStream, buf: Uint8Array): Promise<bigint> {
        try {
            const writer = this.openFiles.getAsWritable(outstr);
            const len = await writer.write(buf);
            const written = buf.length;
            return BigInt(written);
        } catch (err: any) {
            throw translateError(err);
        }
    }
    async blockingWrite(outstr: OutputStream, buf: Uint8Array): Promise<bigint> {
        try {
            return await this.write(outstr, buf);
        } catch (err: any) {
            throw translateError(err);
        }
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
    subscribeToOutputStream(outstr: OutputStream): Promise<Pollable> {
        throw new Error("Method not implemented.");
    }
    async dropOutputStream(outstr: OutputStream): Promise<void> {
        try{
            await this.openFiles.close(outstr);
        } catch (err: any) {
            throw translateError(err);
        }
    }

}