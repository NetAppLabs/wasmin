import { IoStreamsNamespace as io } from "@wasmin/wasi-snapshot-preview2";
type IoStreamsAsync = io.WasiIoStreamsAsync;
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { isBadFileDescriptor, isErrorAgain, isIoError, translateError, wasiPreview2Debug } from "./preview2Utils.js";
import { FsPollable, OpenFiles } from "../../wasiFileSystem.js";
import { sleep } from "../../wasiUtils.js";
import { USE_ACCEPTED_SOCKET_PROMISE } from "../../wasi_experimental_sockets/net.js";
import { delay } from "../../wasi_experimental_sockets/common.js";
import { IOPollNamespace as pollns } from "@wasmin/wasi-snapshot-preview2";
import { Resource } from "../../wasiResources.js";
type IOPollAsync = pollns.WasiIoPollAsync;

type InputStream = io.InputStream;
type OutputStream = io.OutputStream;
type Pollable = io.Pollable;
//type StreamStatus = io.StreamStatus;
type StreamErrorClosed = io.StreamErrorClosed;

export class InputStreamPollable implements FsPollable {
    _fd: number;
    resource: number;
    openFiles: OpenFiles;
    constructor(openFiles: OpenFiles, fd: number) {
        this._fd = fd;
        this.openFiles = openFiles;
        this.resource = -1;
    }
    get fd() {
        return this._fd;
    }
    async ready(): Promise<boolean> {
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
            /*if (ofda.hasConnectedClient) {
                let hasConnectedClient = await ofda.hasConnectedClient();
                if (hasConnectedClient) {
                    return true;
                }
            }*/
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] InputStreamPollable.done fd: ${this.fd} err:`, err);
            if (isBadFileDescriptor(err)) {
                return false;
            }
        } 
        return false;
    }
    async block(): Promise<void> {
        while (true) {
            const isReady = await this.ready();
            if (isReady) {
                return;
            }
            await sleep(1);
        }
    }
}

export class DummyPollable implements FsPollable {
    openFiles: OpenFiles;
    fd: number;
    resource: number;
    constructor(openFiles: OpenFiles, fd: number) {
        this.fd = fd;
        this.openFiles = openFiles;
        this.resource = -1;
    }
    async block(): Promise<void> {
        console.log("DummyPollable:block");
        return;
    }
    async ready(): Promise<boolean> {
        console.log("DummyPollable:ready");
        return true;
    }
}

export class IoStreamsAsyncHost implements IoStreamsAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    private _wasiEnv: WasiEnv;

}

export class InStream implements InputStream, Resource {
    constructor(wasiOptions: WasiOptions, fd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._fd = fd;
        this.resource = -1;
    }
    [Symbol.asyncDispose](): Promise<void> {
        throw new Error("Method not implemented.");
    }
    private _wasiEnv: WasiEnv;
    public _fd: number;
    public resource: number;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    get fd() {
        return this._fd;
    }
    async read(len: bigint): Promise<Uint8Array> {
        //let streamStatus: StreamStatus = 'ended';
        try {
            wasiPreview2Debug(`[io/streams] io:read ${this.fd} starting`);
            if (len == 0n) {
                return new Uint8Array();
            }
            const reader = this.openFiles.getAsReadable(this.fd);
            // TODO: handle bigint
            const buffer = await reader.read(Number(len));
            wasiPreview2Debug("io.read buffer: ", buffer);
            /*if (buffer.length < len) {
                isEnd = true;
            }*/
            wasiPreview2Debug(`[io/streams] io:read ${this.fd} open`);
            wasiPreview2Debug(`[io/streams] io:read ${this.fd} returning`,buffer);
            return buffer;    
        } catch (err: any) {
            wasiPreview2Debug("io.read(): err: ", err);
            if(isIoError(err)){
                let err: StreamErrorClosed = {
                    tag: "closed"
                }
                throw err;
            } else if(isErrorAgain(err)){
                throw err;
            } else {
                wasiPreview2Debug(`[io/streams] io:read ${this.fd} catching err:`, err);
                return new Uint8Array();
            }
        }
    }
    async blockingRead(len: bigint): Promise<Uint8Array> {
        // XXX: documentation for wasi:io/streams/blocking-read specifies that it will
        //      block until at least one byte can be read, so we should sleep and retry
        //      each time call to this.read(len) throws ErrnoN.AGAIN
        while (true) {
            try {
                const res = await this.read(len);
                return res;
            } catch (err: any) {
                if (!isErrorAgain(err)) {
                    throw err;
                }
            }
            await sleep(1);
        }
    }
    async skip(len: bigint): Promise<bigint> {
        let arr = await this.read(len);
        let numRead = BigInt(arr.length);
        return numRead;
    }
    async blockingSkip(len: bigint): Promise<bigint> {
        let arr = await this.blockingRead(len);
        let numRead = BigInt(arr.length);
        return numRead;
    }

    async subscribe(): Promise<io.Pollable> {
        const pollable = new InputStreamPollable(this.openFiles, this.fd);
        const resourceId = this._wasiEnv.openFiles.add(pollable);
        pollable.resource = resourceId;
        return pollable;
    }

    [Symbol.dispose]() {
        this._wasiEnv.openFiles.close(this.fd);
    }
}


export class OutStream implements OutputStream, Resource {
    constructor(wasiOptions: WasiOptions, fd: number) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._fd = fd;
        this.resource = -1;
    }
    [Symbol.asyncDispose](): Promise<void> {
        throw new Error("Method not implemented.");
    }
    private _wasiEnv: WasiEnv;
    public _fd: number;
    public resource: number;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    get fd() {
        return this._fd;
    }

    async checkWrite(): Promise<bigint> {
        // Default to 1MB
        // TODO make more intelligent
        return 4096n;
        //return 1048576n;
    }
    async write(contents: Uint8Array): Promise<void> {
        try {
            const writer = this.openFiles.getAsWritable(this.fd);
            const len = await writer.write(contents);
            const written = contents.length;
            return;
        } catch (err: any) {
            wasiPreview2Debug("[io/streams] write err: ",err);
        }
    }
    async blockingWriteAndFlush(contents: Uint8Array): Promise<void> {
        try {
            await this.write(contents);
            return await this.flush();
        } catch (err: any) {
            wasiPreview2Debug("[io/streams] blockingWriteAndFlush err: ",err);
        }
    }
    async flush(): Promise<void> {
        // TODO revise this]
        // NOOP for now
        return;
    }
    async blockingFlush(): Promise<void> {
        // TODO revise this
        // NOOP for now
        return;
    }
    async subscribe(): Promise<io.Pollable> {
        const pollable = new DummyPollable(this.openFiles, this.fd);
        this._wasiEnv.openFiles.add(pollable);
        return pollable;
    }
    writeZeroes(len: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    blockingWriteZeroesAndFlush(len: bigint): Promise<void> {
        throw new Error("Method not implemented.");
    }
    splice(src: io.InputStream, len: bigint): Promise<bigint> {
        throw new Error("Method not implemented.");
    }
    blockingSplice(src: io.InputStream, len: bigint): Promise<bigint> {
        throw new Error("Method not implemented.");
    }

}

/*
export class OldStreams implements InputStream {
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

    async read(len: bigint): Promise<Uint8Array> {
        let streamStatus: StreamStatus = 'ended';
        try {
            wasiPreview2Debug(`[io/streams] io:read ${instr} starting`);
            if (len == 0n) {
                return new Uint8Array();
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
    async blockingRead(len: bigint): Promise<Uint8Array> {
        while (true) {
            // XXX: in case of ErrnoN.AGAIN, this.read() will return [new Uint8Array(), 'open']
            //      however, documentation for wasi:io/streams/blocking-read specifies that it
            //      will block until at least one byte can be read, so we should sleep and retry
            const res = await this.read(instr, len);
            if (res[0].byteLength !== 0 || res[1] !== 'open') {
                return res;
            }
            await sleep(1);
        }
    }

    async blockingSkip(len: bigint): Promise<bigint> {
        let [arr,streamStatus] = await this.blockingRead(instr, len);
        let numRead = BigInt(arr.length);
        return [numRead,streamStatus];
    }

    async subscribeToInputStream(): Promise<Pollable> {
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

*/

export class IoPollAsyncHost implements IOPollAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async poll(in_: io.Pollable[]): Promise<Uint32Array> {
        const out: Uint32Array = new Uint32Array(in_.length);
        for (let i = 0; i < in_.length; i++) {
            //const pollable = this._wasiEnv.openFiles.get(in0[i]) as FsPollable;
            const pollable = in_[i];
            //out[i] = (await pollable.block());
            if (await pollable.ready()) {
                out[i] = i;
            } else {
                await pollable.block();
                out[i] = i;
            }
        }
        return out;
    }
    private _wasiEnv: WasiEnv;

    /*
    async dropPollable(this0: Pollable): Promise<void> {
        await this._wasiEnv.openFiles.close(this0);
    }

    async pollOneoff(in0: Uint32Array): Promise<boolean[]> {
        const out: boolean[] = []
        for (let i = 0; i < in0.length; i++) {
            const pollable = this._wasiEnv.openFiles.get(in0[i]) as FsPollable;
            out[i] = (await pollable.ready());
        }
        return out;
    }
    */
}