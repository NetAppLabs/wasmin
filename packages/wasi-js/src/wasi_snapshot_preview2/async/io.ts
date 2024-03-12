import { IoStreamsNamespace as io } from "@wasmin/wasi-snapshot-preview2/async";
type IoStreamsAsync = io.WasiIoStreams;
import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { isBadFileDescriptor, isErrorAgain, isIoSocketsError, translateToFsOrSocketsError } from "./preview2Utils.js";
import { OpenFiles, Peekable } from "../../wasiFileSystem.js";
import { sleep } from "../../utils.js";
import { IOPollNamespace as pollns } from "@wasmin/wasi-snapshot-preview2/async";
import { Resource } from "../../wasiResources.js";
import { wasiPreview2Debug } from "../../wasiDebug.js";

type IOPollAsync = pollns.WasiIoPoll;
type IOError = io.Error;

type InputStream = io.InputStream;
type OutputStream = io.OutputStream;
type Pollable = io.Pollable;
type StreamErrorClosed = io.StreamErrorClosed;
type StreamErrorLastOperationFailed = io.StreamErrorLastOperationFailed;

export class InputStreamPollable implements Pollable, Resource {
    _fd: number;
    resource: number;
    openFiles: OpenFiles;
    constructor(openFiles: OpenFiles, fd: number) {
        this._fd = fd;
        this.openFiles = openFiles;
        this.resource = this.openFiles.addResource(this);
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    get fd() {
        return this._fd;
    }
    async readyWithError(): Promise<boolean> {
        const ofd = this.openFiles.get(this.fd);
        const ofda = ofd as any;
        if (ofda.peek) {
            let peekable = ofda as Peekable;
            let peekBytes = await peekable.peek();
            wasiPreview2Debug(`[io/streams] InputStreamPollable peekBytes: ${peekBytes} for fd: ${this.fd}`);
            if (peekBytes > 0) {
                return true;
            }
        }
        return false;
    }

    async ready(): Promise<boolean> {
        try {
            return await this.readyWithError();
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] InputStreamPollable.done fd: ${this.fd} err:`, err);
            if (isBadFileDescriptor(err)) {
                wasiPreview2Debug("badf for InputStreamPollable");
                return false;
            }
        } 
        return false;
    }
    async block(): Promise<void> {
        let attempt = 0;
        let attempts = 5;
        while (attempt < attempts) {
            try {
                const isReady = await this.readyWithError();
                if (isReady) {
                    return;
                }
                await sleep(1);
            } catch (err: any) {
                attempt = attempts;
                wasiPreview2Debug("InputStreamPollable.block err: ", err);
            }
            attempt++;
        }
    }
}

export class DummyPollable implements Pollable, Resource {
    openFiles: OpenFiles;
    fd: number;
    resource: number;
    constructor(openFiles: OpenFiles, fd: number) {
        this.fd = fd;
        this.openFiles = openFiles;
        this.resource = this.openFiles.addResource(this);
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }
    async block(): Promise<void> {
        wasiPreview2Debug("DummyPollable:block");
        await sleep(1);
        return;
    }
    async ready(): Promise<boolean> {
        wasiPreview2Debug("DummyPollable:ready");
        await sleep(1);
        return true;
    }
}

export class IoStreamsAsyncHost implements IoStreamsAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.OutputStream = OutStream;
        this.InputStream = InStream;

    }
    public OutputStream: typeof OutStream;
    public InputStream: typeof InStream;

    private _wasiEnv: WasiEnv;

}

export class InStream implements InputStream, Resource, AsyncDisposable {
    constructor(wasiOptions: WasiOptions, fd: number, closeFdOnStreamClose: boolean) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._fd = fd;
        this.closeFdOnStreamClose = closeFdOnStreamClose;
        this.resource = this.openFiles.addResource(this);
    }

    private _wasiEnv: WasiEnv;
    private closeFdOnStreamClose: boolean;
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
        let buffer: Uint8Array | undefined = undefined;
        try {
            wasiPreview2Debug(`[io/streams] io:read ${this.fd} starting`);
            if (len == 0n) {
                return new Uint8Array();
            }
            const reader = this.openFiles.getAsReadable(this.fd);
            // TODO: handle bigint
            buffer = await reader.read(Number(len));
            wasiPreview2Debug("io.read buffer: ", buffer);
            wasiPreview2Debug(`[io/streams] io:read ${this.fd} open`);
            wasiPreview2Debug(`[io/streams] io:read ${this.fd} returning`,buffer);
        } catch (err: any) {
            wasiPreview2Debug("io.read(): err: ", err);
            if(isIoSocketsError(err)){
                wasiPreview2Debug("throwing StreamErrorClosed");
                let err: StreamErrorClosed = {
                    tag: "closed"
                }
                throw err;
            } else if(isErrorAgain(err)){
                // catch EAGAIN / would-block and return empty array
                return new Uint8Array();
            } else {
                wasiPreview2Debug(`[io/streams] io:read ${this.fd} catching err:`, err);
                const fsOrSocketsErr = translateToFsOrSocketsError(err);
                wasiPreview2Debug("throwing StreamErrorLastOperationFailed");

                let errResource = new IOErrorResource(this._wasiEnv, fsOrSocketsErr);
                let throwErr: StreamErrorLastOperationFailed = {
                    tag: "last-operation-failed",
                    val: errResource,
                }
                throw throwErr;
            }
        }
        if (buffer && buffer?.length > 0) {
            return buffer;
        } else {
            let err: StreamErrorClosed = {
                tag: "closed"
            }
            throw err;
        }
    }
    async blockingRead(len: bigint): Promise<Uint8Array> {
        // XXX: documentation for wasi:io/streams/blocking-read specifies that it will
        //      block until at least one byte can be read, so we should sleep and retry
        //      each time call to this.read(len) until it is larger than 0
        while (true) {
            const res = await this.read(len);
            if (res.length > 0 ) {
                return res;
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
        return pollable;
    }

    async [Symbol.asyncDispose]() {
        try {
            if (this.closeFdOnStreamClose) {
                await this.openFiles.close(this.fd);
            }
            await this.openFiles.disposeResource(this);
        } catch( err: any) {
            wasiPreview2Debug("InStream.Symbol.dispose err or closing fd: ", this.fd);
        }
    }

}


export class OutStream implements OutputStream, Resource {
    constructor(wasiOptions: WasiOptions, fd: number, closeFdOnStreamClose: boolean) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this._fd = fd;
        this.resource = this.openFiles.addResource(this);
        this.closeFdOnStreamClose = closeFdOnStreamClose;
    }

    private _wasiEnv: WasiEnv;
    public _fd: number;
    public resource: number;
    private closeFdOnStreamClose: boolean;
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
        //return 4096n;
        return 1048576n;
    }
    async write(contents: Uint8Array): Promise<void> {
        try {
            const writer = this.openFiles.getAsWritable(this.fd);
            const len = await writer.write(contents);
            const written = contents.length;
            return;
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] write ${this.fd} catching err:`, err);
            const fsOrSocketsErr = translateToFsOrSocketsError(err);
            wasiPreview2Debug("throwing StreamErrorLastOperationFailed");
            let errResource = new IOErrorResource(this._wasiEnv, fsOrSocketsErr);
            let throwErr: StreamErrorLastOperationFailed = {
                tag: "last-operation-failed",
                val: errResource,
            }
            throw throwErr;
        }
    }
    async blockingWriteAndFlush(contents: Uint8Array): Promise<void> {
        try {
            await this.write(contents);
            return await this.flush();
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] blockingWriteAndFlush ${this.fd} catching err:`, err);
            const fsOrSocketsErr = translateToFsOrSocketsError(err);
            wasiPreview2Debug("throwing StreamErrorLastOperationFailed");
            let errResource = new IOErrorResource(this._wasiEnv, fsOrSocketsErr);
            let throwErr: StreamErrorLastOperationFailed = {
                tag: "last-operation-failed",
                val: errResource,
            }
            throw throwErr;
        }
    }
    async flush(): Promise<void> {
        try {
            if (this.openFiles.isFile(this.fd)) {
                const fil = this.openFiles.getAsFile(this.fd);
                await fil.flush();  
            }
        } catch (err: any) {
            wasiPreview2Debug(`[io/streams] flush ${this.fd} catching err:`, err);
            const fsOrSocketsErr = translateToFsOrSocketsError(err);
            wasiPreview2Debug("throwing StreamErrorLastOperationFailed");
            let errResource = new IOErrorResource(this._wasiEnv, fsOrSocketsErr);
            let throwErr: StreamErrorLastOperationFailed = {
                tag: "last-operation-failed",
                val: errResource,
            }
            throw throwErr;
        }
        return;
    }
    async blockingFlush(): Promise<void> {
        return await this.flush();
    }
    async subscribe(): Promise<io.Pollable> {
        const pollable = new DummyPollable(this.openFiles, this.fd);
        return pollable;
    }
    async writeZeroes(len: bigint): Promise<void> {
        let numLen = Number(len);
        let arrZeroes = new Uint8Array(numLen);
        await this.write(arrZeroes);
    }
    async blockingWriteZeroesAndFlush(len: bigint): Promise<void> {
        await this.writeZeroes(len);
        await this.blockingFlush();
    }
    async splice(src: io.InputStream, lenBig: bigint): Promise<bigint> {
        let len = Number(lenBig);
        let hasWritten = 0;
        let moreWites = true;
        while (moreWites) {
            let numToRead = await this.checkWrite();
            let readBytes = await src.read(numToRead);
            let readBytesLen = readBytes.length;
            if (readBytesLen == 0) {
                moreWites = false;
            } else {
                hasWritten = hasWritten + readBytesLen;
                if (hasWritten < len) {
                    await this.write(readBytes);
                } else if (hasWritten == len) {
                    moreWites = false;
                    await this.write(readBytes);
                } else if (hasWritten > len ) {
                    moreWites = false;
                    let numberToCutOff = hasWritten - len;
                    let newEnd = readBytesLen - numberToCutOff;
                    // cut off the bytes to write:
                    let readBytesSubArray = readBytes.subarray(0, newEnd );
                    await this.write(readBytesSubArray);
                }
            }
        }
        return BigInt(hasWritten);
    }
    async blockingSplice(src: io.InputStream, len: bigint): Promise<bigint> {
        return await this.splice(src,len);
    }
    
    async [Symbol.asyncDispose]() {
        try {
            if (this.closeFdOnStreamClose) {
                await this.openFiles.close(this.fd);
            }
            await this.openFiles.disposeResource(this);
        } catch( err: any) {
            wasiPreview2Debug("OutStream.Symbol.dispose err or closing fd: ", this.fd);
        }
    }
}

export class IoPollAsyncHost implements IOPollAsync {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.Pollable = InputStreamPollable;
    }
    public Pollable: typeof InputStreamPollable;

    async poll(in_: io.Pollable[]): Promise<Uint32Array> {
        const out: Uint32Array = new Uint32Array(in_.length);
        for (let i = 0; i < in_.length; i++) {
            const pollable = in_[i];
            if (await pollable.ready()) {
                out[i] = i;
            } else {
                let usePollTimeout = false;
                if (usePollTimeout) {
                    // 1000 ms
                    const BLOCK_PROMISE_TIMEOUT = 1000;
                    const blockPromise = pollable.block();
                    const timeoutPromise = Promise.race([blockPromise, new Promise((res, rej) => setTimeout(rej, BLOCK_PROMISE_TIMEOUT))]);
                    try {
                        await timeoutPromise;
                    } catch(err :any) {
                        let typeName = pollable.constructor?.name;
                        const aPollable = pollable as any;
                        let resource = "";
                        let fd = "";
                        if (typeName == undefined) {
                            if (aPollable.typeName ) {
                                typeName = aPollable.typeName;
                            }
                        }
                        if (aPollable.resource ) {
                            resource = aPollable.resource;
                        }
                        if (aPollable.fd ) {
                            fd = aPollable.fd;
                        }
                        if (aPollable._fd ) {
                            fd = aPollable._fd;
                        }
                        wasiPreview2Debug(`poll.poll polling on ${typeName} resource: ${resource} fd: ${fd} err: `, err);
                    }
                    //out[i] = i;
                } else {
                    // TODO should we check for instance of ClocksMonotonicPollable
                    // and block only if it is single in the list ?
                    await pollable.block();
                    //out[i] = i;
                }
            }
        }
        return out;
    }
    private _wasiEnv: WasiEnv;
}

export class IOErrorResource implements IOError, Resource {
    constructor(wasiOptions: WasiOptions, errorString: string) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
        this.resource = this.openFiles.addResource(this);
        this.errorString = errorString;
    }
    resource: number;
    _wasiEnv: WasiEnv;
    errorString: string;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

    async toDebugString(): Promise<string> {
        return this.errorString;
    }
    async [Symbol.asyncDispose](): Promise<void> {
        await this.openFiles.disposeResource(this);
    }

}