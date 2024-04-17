/* eslint-disable @typescript-eslint/no-unused-vars */

import { SystemError } from "../errors.js";
import { FIRST_PREOPEN_FD, OpenFile, FileOrDir, OpenDirectory } from "../wasiFileSystem.js";
import { unimplemented, wasiCallDebug } from "../wasiUtils.js";
import {
    u64,
    string,
    ClockidN,
    Errno,
    ErrnoN,
    EventtypeN,
    Fd,
    FdflagsN,
    FiletypeN,
    mutptr,
    PreopentypeN,
    ptr,
    Size,
    SubclockflagsN,
    Timestamp,
    u8,
    WasiSnapshotPreview1Async,
    WhenceN,
    Rights,
    Prestat,
    Ciovec,
    Dircookie,
    Dirent,
    Filedelta,
    Whence,
    OflagsN,
    Lookupflags,
    Oflags,
    Subscription,
    Riflags,
    Siflags,
    Roflags,
    Sdflags,
    Signal,
    Advice,
    Exitcode,
    addWasiSnapshotPreview1ToImports,
    RightsN,
    FstflagsN,
} from "./bindings.js";
import { Event, Fdstat, Fdflags, Filestat, Filesize, Iovec, usize, Fstflags } from "./bindings.js";
import {
    wasiDebug,
    wasiFdDebug,
    populateFileStat,
    forEachIoVec,
    ExitStatus,
    RIGHTS_STDIN_BASE,
    RIGHTS_STDOUT_BASE,
    RIGHTS_FILE_BASE,
    RIGHTS_DIRECTORY_BASE,
    RIGHTS_DIRECTORY_INHERITING,
    translateErrorToErrorno,
    wasiWarn,
    isNode,
} from "../wasiUtils.js";
import { WasiEnv } from "../wasi.js";
import { Statable } from "@wasmin/fs-js";
import { WasiSocket } from "../wasi_experimental_sockets/common.js";

export function initializeWasiSnapshotPreview1AsyncToImports(
    imports: any,
    get_export: (name: string) => WebAssembly.ExportValue,
    wasiEnv: WasiEnv
) {
    //const memory = get_export("memory") as WebAssembly.Memory;
    const wHost = new WasiSnapshotPreview1AsyncHost(wasiEnv);
    const errorHandler: (err: any) => number = function (err: any) {
        return translateErrorToErrorno(err);
    };
    //const errorHandler = new ErrorHandlerTranslator();
    wHost._get_exports_func = get_export;
    const checkAbort: () => void = function () {
        if (wasiEnv.abortSignal) {
            if (wasiEnv.abortSignal?.aborted) {
                throw new SystemError(ErrnoN.CANCELED);
            }
        }
    };
    const handler = {
        getExport: get_export,
        checkAbort: checkAbort,
        handleError: errorHandler,
    };
    addWasiSnapshotPreview1ToImports(imports, wHost, handler);
}

export class WasiSnapshotPreview1AsyncHost implements WasiSnapshotPreview1Async {
    constructor(wasiEnv: WasiEnv, get_export?: (name: string) => WebAssembly.ExportValue) {
        this._wasiEnv = wasiEnv;
        this._get_exports_func = get_export;
        this._isNode = isNode();
    }
    public _get_exports_func?: (name: string) => WebAssembly.ExportValue;
    private _wasiEnv: WasiEnv;
    private _isNode: boolean;

    get wasiEnv() {
        return this._wasiEnv;
    }
    get memory(): WebAssembly.Memory | undefined {
        if (this._get_exports_func) {
            const eMem = this._get_exports_func("memory");
            return eMem as WebAssembly.Memory;
        } else {
            throw new Error("_get_exports_func not set");
        }
    }
    get buffer() {
        if (this.memory) {
            const memory: WebAssembly.Memory = this.memory;
            return memory.buffer;
        } else {
            throw new Error("memory not set for buffer");
        }
    }
    get cargs() {
        return this.wasiEnv.cargs;
    }
    get cenv() {
        return this.wasiEnv.cenv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }
    /*
    get stdin() {
        return this.wasiEnv.stdin;
    }
    get stdout() {
        return this.wasiEnv.stdout;
    }
    get stderr() {
        return this.wasiEnv.stderr;
    }
    */
    get abortSignal() {
        return this.wasiEnv.abortSignal;
    }
    get suspendStdIn() {
        return this.wasiEnv.suspendStdIn;
    }
    get isNode() {
        return this._isNode;
    }
    _checkAbort(): void {
        if (this.abortSignal) {
            if (this.abortSignal?.aborted) {
                throw new SystemError(ErrnoN.CANCELED);
            }
        }
    }
    _wait(ms: number) {
        return new Promise((resolve, reject) => {
            const abortListener = () => {
                clearTimeout(id);
                reject(new SystemError(ErrnoN.CANCELED));
            };
            const onResolve = (value: unknown) => {
                this.abortSignal?.removeEventListener("abort", abortListener);
                resolve(value);
            };
            const id = setTimeout(onResolve, ms);
            this.abortSignal?.addEventListener("abort", abortListener);
        });
    }

    async argsGet(argv: mutptr<mutptr<u8>>, argv_buf: mutptr<u8>): Promise<Errno> {
        wasiCallDebug("[args_get]");
        this.cargs.get(this.buffer, argv, argv_buf);
        return ErrnoN.SUCCESS;
    }
    async argsSizesGet(argc_ptr: mutptr<Size>, argv_buf_size_ptr: mutptr<Size>): Promise<Errno> {
        wasiCallDebug("[args_sizes_get]");
        this.cargs.sizes_get(this.buffer, argc_ptr, argv_buf_size_ptr);
        return ErrnoN.SUCCESS;
    }
    async environGet(environ: mutptr<mutptr<u8>>, environ_buf: mutptr<u8>): Promise<Errno> {
        wasiCallDebug("[environ_get]");
        this.cenv.get(this.buffer, environ, environ_buf);
        return ErrnoN.SUCCESS;
    }
    async environSizesGet(count_ptr: mutptr<Size>, size_ptr: mutptr<Size>): Promise<Errno> {
        wasiCallDebug("[environ_sizes_get]");
        this.cenv.sizes_get(this.buffer, count_ptr, size_ptr);
        return ErrnoN.SUCCESS;
    }
    async clockResGet(id: ClockidN, result_ptr: mutptr<Timestamp>): Promise<Errno> {
        wasiCallDebug("[clock_res_get] id:", id);
        // 1 ms
        Timestamp.set(this.buffer, result_ptr, 1_000_000n);
        return ErrnoN.SUCCESS;
    }
    async clockTimeGet(id: ClockidN, precision: Timestamp, result_ptr: mutptr<Timestamp>): Promise<Errno> {
        wasiCallDebug("[clock_time_get] id:", id);
        const origin = id === ClockidN.REALTIME ? Date : globalThis.performance;
        Timestamp.set(this.buffer, result_ptr, BigInt(Math.round(origin.now() * 1_000_000)));
        return ErrnoN.SUCCESS;
    }
    async fdAdvise(fd: Fd, offset: Filesize, len: Filesize, advice: Advice): Promise<Errno> {
        wasiCallDebug("[fd_advise] fd:", fd);
        const of = this.openFiles.getAsFile(fd);
        // TODO look into how to keep track of offset and len
        // of.setSize(Number(len));
        //of.position = Number(offset);
        of.advice = advice;
        return ErrnoN.SUCCESS;
    }
    async fdAllocate(fd: Fd, offset: Filesize, len: Filesize): Promise<Errno> {
        wasiCallDebug("[fd_allocate] fd:", fd);
        const totalSize = len + offset;
        const ret = this.fdFilestatSetSize(fd, totalSize);
        return ret;
    }
    async fdClose(fd: Fd): Promise<Errno> {
        wasiCallDebug("[fd_close] fd:", fd);
        await this.openFiles.close(fd);
        return ErrnoN.SUCCESS;
    }
    async fdDatasync(fd: Fd): Promise<Errno> {
        wasiCallDebug("[fd_datasync] fd:", fd);
        this.openFiles.getAsFile(fd).flush();
        return ErrnoN.SUCCESS;
    }
    async fdFdstatGet(fd: Fd, fdstat_ptr: mutptr<Fdstat>): Promise<Errno> {
        wasiCallDebug("[fd_fdstat_get] fd:", fd, " fdstat_ptr: ", fdstat_ptr);
        let filetype;
        let fsflags = 0;
        let rightsBase: Rights = -1n; /* anything */
        let rightsInheriting: Rights = ~(1n << 24n); /* anything but symlink */
        //let rightsInheriting = 0n as Rights;
        //let rightsBase = RightsN.FD_READ;
        if (fd < FIRST_PREOPEN_FD) {
            // stdin
            fsflags = FdflagsN.APPEND;
            if (fd == 0) {
                rightsBase = RIGHTS_STDIN_BASE;
            } else {
                rightsBase = RIGHTS_STDOUT_BASE;
            }

            //rightsInheriting empty for std(in/out/err)
            rightsInheriting = BigInt(0);
            filetype = FiletypeN.CHARACTER_DEVICE;
        } else if (this.openFiles.isFile(fd)) {
            rightsBase = RIGHTS_FILE_BASE;
            rightsInheriting = BigInt(0);
            filetype = FiletypeN.REGULAR_FILE;
        } else if (this.openFiles.isDirectory(fd)) {
            rightsBase = RIGHTS_DIRECTORY_BASE;
            rightsInheriting = RIGHTS_DIRECTORY_INHERITING;
            filetype = FiletypeN.DIRECTORY;
        } else if (this.openFiles.isSocket(fd)) {
            rightsBase = RIGHTS_FILE_BASE;
            rightsInheriting = BigInt(0);
            filetype = FiletypeN.SOCKET_STREAM;
            const sock = this.getSocket(fd);
            if (sock.type == "strm") {
                filetype = FiletypeN.SOCKET_STREAM;
            } else if (sock.type == "dgram") {
                filetype = FiletypeN.SOCKET_DGRAM;
            }
            fsflags = sock.fdFlags;
        } else {
            return ErrnoN.BADF;
        }
        const newFdstat: Fdstat = {
            fs_filetype: filetype,
            fs_flags: fsflags,
            fs_rights_base: rightsBase,
            fs_rights_inheriting: rightsInheriting,
        };
        Fdstat.set(this.buffer, fdstat_ptr, newFdstat);
        return ErrnoN.SUCCESS;
    }
    async fdFdstatSetFlags(fd: Fd, flags: Fdflags): Promise<Errno> {
        wasiCallDebug("[fd_fdstat_set_flags] fd:", fd);
        if (flags & FdflagsN.DSYNC) {
            unimplemented("fd_fdstat_set_flags FdFlags.DSync");
        } else if (flags & FdflagsN.RSYNC) {
            unimplemented("fd_fdstat_set_flags FdFlags.RSync");
        } else if (flags & FdflagsN.SYNC) {
            unimplemented("fd_fdstat_set_flags FdFlags.Sync");
        }
        if (this.openFiles.isFile(fd)) {
            const openFile = this.openFiles.getAsFile(fd);
            openFile.fdFlags = flags;
        } else if (this.openFiles.isDirectory(fd)) {
            return ErrnoN.NOTSUP;
        } else if (this.openFiles.isSocket(fd)) {
            const sock = this.openFiles.getAsSocket(fd);
            sock.fdFlags = flags;
        } else {
            // silently ignore for other types
        }

        return ErrnoN.SUCCESS;
    }
    async fdFdstatSetRights(fd: Fd, fs_rights_base: Rights, fs_rights_inheriting: Rights): Promise<Errno> {
        // TODO: implement
        return ErrnoN.SUCCESS;
    }
    async fdFilestatGet(fd: Fd, filestat_ptr: mutptr<Filestat>): Promise<Errno> {
        wasiCallDebug(`[fd_filestat_get] fd: ${fd}`);
        if (fd == 0 || fd == 1 || fd == 2) {
            // TODO improve this by moving stdin etc. into this._openFiles
            const newFilestat: Filestat = {
                dev: 0n,
                ino: 0n,
                filetype: FiletypeN.CHARACTER_DEVICE,
                nlink: 0n,
                size: 0n,
                atim: 0n,
                mtim: 0n,
                ctim: 0n,
            };
            Filestat.set(this.buffer, filestat_ptr, newFilestat);
        } else {
            const openFile = this.openFiles.get(fd);
            wasiDebug(`[fd_filestat_get fd: ${fd}] openFile: `, openFile);
            const openHandle = this.openFiles.getAsFileOrDir(fd);
            const handle = openHandle.handle;
            await populateFileStat(this.buffer, handle, filestat_ptr);
        }
        return ErrnoN.SUCCESS;
    }
    async fdFilestatSetSize(fd: Fd, size: Filesize): Promise<Errno> {
        wasiCallDebug(`[fd_filestat_set_size] fd: ${fd} , size: ${size}`);
        await this.openFiles.getAsFile(fd).setSize(Number(size));
        return ErrnoN.SUCCESS;
    }
    async fdFilestatSetTimes(fd: Fd, atim: Timestamp, mtim: Timestamp, fst_flags: Fstflags): Promise<Errno> {
        wasiCallDebug("[fd_filestat_set_times] fd:", fd);
        const of = this.openFiles.getAsFileOrDir(fd);
        const handle = of.handle;
        if ((handle as any).updateTimes) {
            const uh = handle as unknown as Statable;
            let dataAccessTimestampNs: bigint | null = null;
            if (fst_flags & (FstflagsN.ATIM && FstflagsN.ATIM_NOW)) {
                // can not both be set
                return ErrnoN.INVAL;
            }
            if (fst_flags & (FstflagsN.MTIM && FstflagsN.MTIM_NOW)) {
                // can not both be set
                return ErrnoN.INVAL;
            }
            if (fst_flags & FstflagsN.ATIM) {
                dataAccessTimestampNs = atim;
            } else if (fst_flags & FstflagsN.ATIM_NOW) {
                dataAccessTimestampNs = BigInt(Date.now() * 1_000_000);
            }
            let dataModificationTimestampNs: bigint | null = null;
            if (fst_flags & FstflagsN.MTIM) {
                dataModificationTimestampNs = mtim;
            } else if (fst_flags & FstflagsN.MTIM_NOW) {
                dataModificationTimestampNs = BigInt(Date.now() * 1_000_000);
            }
            await uh.updateTimes(dataAccessTimestampNs, dataModificationTimestampNs);
        }
        return ErrnoN.SUCCESS;
    }
    async fdPread(
        fd: Fd,
        iovs_ptr: ptr<Iovec>,
        iovs_len: usize,
        offset: Filesize,
        result_ptr: mutptr<Size>
    ): Promise<Errno> {
        wasiCallDebug("[fd_pread] fd:", fd);
        const newFd = await this.openFiles.openReader(fd, offset);
        const input = this.openFiles.getAsReadable(newFd);
        try {
            await forEachIoVec(
                this.buffer,
                iovs_ptr,
                iovs_len,
                result_ptr,
                async (buf) => {
                    const bufLen = buf.length;
                    wasiFdDebug(`[fd_read] forEachIoVec bufLen: ${bufLen} input: `, input);
                    const chunk = await input.read(bufLen);
                    buf.set(chunk);
                    return chunk.length;
                },
                () => {
                    this._checkAbort();
                }
            );
        } finally {
            this.openFiles.close(newFd);
        }
        return ErrnoN.SUCCESS;
    }
    async fdPrestatGet(fd: Fd, result_ptr: mutptr<Prestat>): Promise<Errno> {
        wasiCallDebug("[fd_prestat_get] fd:", fd);
        try {
            const newPrestat: Prestat = {
                tag: PreopentypeN.DIR,
                data: {
                    pr_name_len: this.openFiles.getPreOpen(fd).path.length,
                },
            };
            Prestat.set(this.buffer, result_ptr, newPrestat);
        } catch (err: any) {
            return ErrnoN.BADF;
        }
        return ErrnoN.SUCCESS;
    }
    async fdPrestatDirName(fd: Fd, path: mutptr<u8>, path_len: Size): Promise<Errno> {
        wasiCallDebug(`[fd_prestat_dir_name] fd: ${fd}`);
        // TODO: look into type safety
        const path_ptr = path as unknown as ptr<string>;
        const preOpenPath = this.openFiles.getPreOpen(fd).path;
        string.set(this.buffer, path_ptr, preOpenPath, path_len);
        wasiDebug(`[fd_prestat_dir_name] fd: ${fd} , preOpenPath: ${preOpenPath}`);
        return ErrnoN.SUCCESS;
    }
    async fdPwrite(
        fd: Fd,
        iovs_ptr: ptr<Ciovec>,
        iovs_len: usize,
        offset: Filesize,
        result_ptr: mutptr<Size>
    ): Promise<Errno> {
        wasiFdDebug("[fd_pwrite]", fd, iovs_ptr, iovs_len, result_ptr);
        const newFd = this.openFiles.openWriter(fd, offset);
        const out = this.openFiles.getAsWritable(newFd);
        try {
            await forEachIoVec(
                this.buffer,
                iovs_ptr,
                iovs_len,
                result_ptr,
                async (data) => {
                    await out.write(data);
                    return data.length;
                },
                () => {
                    this._checkAbort();
                }
            );
        } finally {
            this.openFiles.close(newFd);
        }
        return ErrnoN.SUCCESS;
    }
    async fdRead(fd: Fd, iovs_ptr: ptr<Iovec>, iovs_len: usize, result_ptr: mutptr<Size>): Promise<Errno> {
        wasiFdDebug(`[fd_read] fd: ${fd} iovsLen: ${iovs_len}`);
        const input = this.openFiles.getAsReadable(fd);
        await forEachIoVec(
            this.buffer,
            iovs_ptr,
            iovs_len,
            result_ptr,
            async (buf) => {
                const bufLen = buf.length;
                wasiFdDebug(`[fd_read] forEachIoVec bufLen: ${bufLen} input: `, input);
                const chunk = await input.read(bufLen);
                buf.set(chunk);
                return chunk.length;
            },
            () => {
                this._checkAbort();
            }
        );
        wasiFdDebug("[fd_read] returning");
        return ErrnoN.SUCCESS;
    }
    async fdReaddir(
        fd: Fd,
        buf: mutptr<u8>,
        buf_len: Size,
        cookie: Dircookie,
        result_ptr: mutptr<Size>
    ): Promise<Errno> {
        let setcookie = cookie;
        wasiCallDebug("[fd_readdir] fd:", fd, " cookie: ", setcookie);
        const textEncoder = new TextEncoder();

        const initialBufPtr = buf;
        const initialBufLen = buf_len;
        const openDir = this.openFiles.getAsDir(fd);
        const dirfh = openDir.handle;
        let dot_inode = 0n;
        if ((dirfh as any).stat) {
            const statable = dirfh as unknown as Statable;
            const s = await statable.stat();
            const got_inode = s.inode;
            if (got_inode) {
                dot_inode = s.inode;
            }
        }
        // type conversion because buf is ptr<u8> but expects ptr<Dirent>
        let dirent_buf_ptr = buf as unknown as ptr<Dirent>;

        // Adding . and ..
        if (setcookie < 1n) {
            const name = ".";
            const nameAsBytes = textEncoder.encode(name);
            const nameLen = nameAsBytes.byteLength;
            const itemSize = Dirent.size + nameLen;
            const newDirent: Dirent = {
                d_next: ++setcookie,
                d_ino: dot_inode,
                d_namlen: nameLen,
                d_type: FiletypeN.DIRECTORY,
            };
            Dirent.set(this.buffer, dirent_buf_ptr, newDirent);
            string.set(this.buffer, (dirent_buf_ptr + Dirent.size) as ptr<string>, name);
            dirent_buf_ptr = (dirent_buf_ptr + itemSize) as ptr<Dirent>;
            buf_len -= itemSize;
        }

        if (setcookie < 2n) {
            const name = "..";
            const nameAsBytes = textEncoder.encode(name);
            const nameLen = nameAsBytes.byteLength;

            let dotdot_inode = 0n;
            if (dot_inode > 0n) {
                dotdot_inode = dot_inode - 1n;
            }
            const itemSize = Dirent.size + nameLen;
            const newDirent: Dirent = {
                d_next: ++setcookie,
                d_ino: dotdot_inode, // TODO get correct parent inode ?
                d_namlen: nameLen,
                d_type: FiletypeN.DIRECTORY,
            };
            Dirent.set(this.buffer, dirent_buf_ptr, newDirent);
            string.set(this.buffer, (dirent_buf_ptr + Dirent.size) as ptr<string>, name);
            dirent_buf_ptr = (dirent_buf_ptr + itemSize) as ptr<Dirent>;
            buf_len -= itemSize;
        }

        // cookie is numbered including . and ..
        // pos is therefore indexed by cookie starting with cookie = 2
        // so pos needs to be decreased by 2
        const pos = Number(setcookie - 2n);
        wasiDebug("[fd_readdir] pos: ", pos);
        const entries = openDir.getEntries(pos);
        let hasMoreinIterator = false;
        for await (const handle of entries) {
            this._checkAbort();
            const name = handle.name;
            const nameAsBytes = textEncoder.encode(name);
            const nameLen = nameAsBytes.byteLength;

            let entry_inode = 0n;
            if ((handle as any).stat) {
                const statable = handle as unknown as Statable;
                const s = await statable.stat();
                const got_inode = s.inode;
                if (got_inode) {
                    entry_inode = s.inode;
                }
            }
            const itemSize = Dirent.size + nameLen;
            const newDirent: Dirent = {
                d_next: ++setcookie,
                d_ino: entry_inode,
                d_namlen: nameLen,
                d_type: handle.kind === "file" ? FiletypeN.REGULAR_FILE : FiletypeN.DIRECTORY,
            };

            if (buf_len < itemSize) {
                hasMoreinIterator = true;
                entries.revert(handle);
                // write out dirent cut off to rest of buffer
                wasiDebug("[fd_readdir] write out cutoff dirent of len: ", buf_len);
                const tmpArrBuffer = new ArrayBuffer(itemSize);
                Dirent.set(tmpArrBuffer, 0 as ptr<Dirent>, newDirent);
                const cutArrayBuffer = tmpArrBuffer.slice(0, buf_len);
                const cutUint8Array = new Uint8Array(cutArrayBuffer);
                const dst = new Uint8Array(this.buffer, dirent_buf_ptr, buf_len);
                dst.set(cutUint8Array);
                break;
            }

            Dirent.set(this.buffer, dirent_buf_ptr, newDirent);
            string.set(this.buffer, (dirent_buf_ptr + Dirent.size) as ptr<string>, name);
            dirent_buf_ptr = (dirent_buf_ptr + itemSize) as ptr<Dirent>;
            buf_len -= itemSize;
        }
        if (hasMoreinIterator) {
            // result_ptr is written with size wual to buf_len
            // indicating that there is more in the directory
            Size.set(this.buffer, result_ptr, initialBufLen);
            wasiDebug("[fd_readdir] done - hasMoreinIterator");
            return ErrnoN.SUCCESS;
        } else {
            const actualBufSize = dirent_buf_ptr - initialBufPtr;
            Size.set(this.buffer, result_ptr, actualBufSize);
            wasiDebug("[fd_readdir] done");
            return ErrnoN.SUCCESS;
        }
    }
    async fdRenumber(fd: Fd, to: Fd): Promise<Errno> {
        wasiCallDebug("[fd_renumber] fd:", fd);
        this.openFiles.renumber(fd, to);
        return ErrnoN.SUCCESS;
    }
    async fdSeek(fd: Fd, offset: Filedelta, whence: Whence, result_ptr: mutptr<Filesize>): Promise<Errno> {
        wasiCallDebug(`[fd_seek] fd: ${fd} offset: ${offset} whence: ${whence}`);
        if (fd < FIRST_PREOPEN_FD) {
            // Assuming this is a FileType.CharacterDevice
            // TODO look into how best to handle this error as character devices do not support seek
            wasiDebug(`[fd_seek fd: ${fd} offset: ${offset} whence: ${whence}]`);
            throw new SystemError(ErrnoN.NOTCAPABLE);
            //uint64_t.set(this.buffer, filesizePtr, BigInt(offset));
            //Filesize.set(this.buffer, result_ptr, BigInt(offset));
        } else {
            const openFile = this.openFiles.getAsFile(fd);
            let base: number;
            switch (whence) {
                case WhenceN.SET:
                    base = 0;
                    break;
                case WhenceN.CUR:
                    base = openFile.position;
                    break;
                case WhenceN.END:
                    base = (await openFile.getFile()).size;
                    break;
            }
            openFile.position = base + Number(offset);
            u64.set(this.buffer, result_ptr, BigInt(openFile.position));
        }
        return ErrnoN.SUCCESS;
    }
    async fdSync(fd: Fd): Promise<Errno> {
        wasiCallDebug("[fd_sync] fd:", fd);
        if (this.openFiles.isFile(fd)) {
            const openFile = this.openFiles.getAsFile(fd);
            await openFile.flush();
        }
        return ErrnoN.SUCCESS;
    }
    async fdTell(fd: Fd, result_ptr: mutptr<Filesize>): Promise<Errno> {
        wasiCallDebug(`[fd_tell] fd: ${fd}`);
        const filePos = this.openFiles.getAsFile(fd).position;
        u64.set(this.buffer, result_ptr, BigInt(filePos));
        return ErrnoN.SUCCESS;
    }
    async fdWrite(fd: Fd, iovs_ptr: ptr<Ciovec>, iovs_len: usize, result_ptr: mutptr<Size>): Promise<Errno> {
        wasiFdDebug("[fd_write]", fd, iovs_ptr, iovs_len, result_ptr);
        const out = this.openFiles.getAsWritable(fd);
        await forEachIoVec(
            this.buffer,
            iovs_ptr,
            iovs_len,
            result_ptr,
            async (data) => {
                await out.write(data);
                return data.length;
            },
            () => {
                this._checkAbort();
            }
        );
        return ErrnoN.SUCCESS;
    }
    async pathCreateDirectory(fd: Fd, path_ptr: ptr<string>, path_len: usize): Promise<Errno> {
        const pathString = string.get(this.buffer, path_ptr, path_len);
        wasiCallDebug(`[path_create_directory] pathString: ${pathString} on fd: ${fd}`);
        const cMode = FileOrDir.Dir;
        const openFlags = OflagsN.CREAT | OflagsN.DIRECTORY | OflagsN.EXCL;
        const preOpenDir = this.openFiles.getAsDir(fd);
        await preOpenDir.getFileOrDir(pathString, cMode, openFlags);

        return ErrnoN.SUCCESS;
    }
    async pathFilestatGet(
        fd: Fd,
        flags: Lookupflags,
        path_ptr: ptr<string>,
        path_len: usize,
        result_ptr: mutptr<Filestat>
    ): Promise<Errno> {
        const pathString = string.get(this.buffer, path_ptr, path_len);
        wasiCallDebug(
            `[path_filestat_get] fd: ${fd} _flags: ${flags} pathString: ${pathString} result_ptr: ${result_ptr}`
        );
        const handle = await this.openFiles.getAsDir(fd).getFileOrDir(pathString, FileOrDir.Any);
        await populateFileStat(this.buffer, handle, result_ptr);
        return ErrnoN.SUCCESS;
    }
    async pathFilestatSetTimes(
        fd: Fd,
        flags: Lookupflags,
        path_ptr: ptr<string>,
        path_len: usize,
        atim: Timestamp,
        mtim: Timestamp,
        fst_flags: Fstflags
    ): Promise<Errno> {
        wasiCallDebug("[fd_filestat_set_times] fd:", fd);
        // TODO; handle Lookupflags
        const path = string.get(this.buffer, path_ptr, path_len);
        const opendir = this.openFiles.getAsDir(fd);
        const handle = await opendir.getFileOrDir(path, FileOrDir.Any);
        if ((handle as any).updateTimes) {
            const uh = handle as unknown as Statable;
            let dataAccessTimestampNs: bigint | null = null;
            if (fst_flags & FstflagsN.ATIM) {
                dataAccessTimestampNs = atim;
            } else if (fst_flags & FstflagsN.ATIM_NOW) {
                dataAccessTimestampNs = BigInt(Date.now() * 1_000_000);
            }
            let dataModificationTimestampNs: bigint | null = null;
            if (fst_flags & FstflagsN.MTIM) {
                dataModificationTimestampNs = mtim;
            } else if (fst_flags & FstflagsN.MTIM_NOW) {
                dataModificationTimestampNs = BigInt(Date.now() * 1_000_000);
            }
            await uh.updateTimes(dataAccessTimestampNs, dataModificationTimestampNs);
        }
        return ErrnoN.SUCCESS;
    }
    async pathLink(
        old_fd: Fd,
        old_flags: Lookupflags,
        old_path_ptr: ptr<string>,
        old_path_len: usize,
        new_fd: Fd,
        new_path_ptr: ptr<string>,
        new_path_len: usize
    ): Promise<Errno> {
        unimplemented("path_link");
        return ErrnoN.NOSYS;
    }
    async pathOpen(
        fd: Fd,
        dirflags: Lookupflags,
        path_ptr: ptr<string>,
        path_len: usize,
        oflags: Oflags,
        fs_rights_base: Rights,
        fs_rights_inheriting: Rights,
        fdflags: Fdflags,
        result_ptr: mutptr<Fd>
    ): Promise<Errno> {
        const path = string.get(this.buffer, path_ptr, path_len);
        wasiCallDebug(`[path_open] fd: ${fd}, dirFlags: ${dirflags}, path: ${path}, fdflags: ${fdflags}`);
        if (fdflags & FdflagsN.NONBLOCK) {
            wasiWarn(
                `Asked for non-blocking mode on path ${path} with dirFd: ${fd} while opening the file, falling back to blocking one.`
            );
            fdflags &= ~FdflagsN.NONBLOCK;
        }
        if (fdflags & FdflagsN.DSYNC) {
            unimplemented("path_open FdFlags.DSYNC");
        } else if (fdflags & FdflagsN.RSYNC) {
            unimplemented("path_open FdFlags.RSYNC");
        } else if (fdflags & FdflagsN.SYNC) {
            unimplemented("path_open FdFlags.SYNC");
        }

        const openDir = this.openFiles.getAsDir(fd);
        const resultFd = await this.openFiles.open(openDir, path, oflags, fdflags);
        wasiCallDebug(`[path_open] fd: ${fd} path: ${path} result fd: ${resultFd}`);

        Fd.set(this.buffer, result_ptr, resultFd);
        return ErrnoN.SUCCESS;
    }
    async pathReadlink(
        fd: Fd,
        path_ptr: ptr<string>,
        path_len: usize,
        buf: mutptr<u8>,
        buf_len: Size,
        result_ptr: mutptr<Size>
    ): Promise<Errno> {
        const path = string.get(this.buffer, path_ptr, path_len);
        wasiCallDebug(`[path_readlink] dirFd: ${fd} , path: ${path}`);
        //throw new SystemError(ErrnoN.INVAL);
        return ErrnoN.INVAL;
    }
    async pathRemoveDirectory(fd: Fd, path_ptr: ptr<string>, path_len: usize): Promise<Errno> {
        const path = string.get(this.buffer, path_ptr, path_len);
        wasiCallDebug(`[path_remove_directory] fd: ${fd} path: ${path}`);
        const openDir = this.openFiles.getAsDir(fd);
        await openDir.delete(path);
        return ErrnoN.SUCCESS;
    }
    async pathRename(
        fd: Fd,
        old_path_ptr: ptr<string>,
        old_path_len: usize,
        new_fd: Fd,
        new_path_ptr: ptr<string>,
        new_path_len: usize
    ): Promise<Errno> {
        unimplemented("path_rename");
        return ErrnoN.NOSYS;
    }
    async pathSymlink(
        old_path_ptr: ptr<string>,
        old_path_len: usize,
        fd: Fd,
        new_path_ptr: ptr<string>,
        new_path_len: usize
    ): Promise<Errno> {
        unimplemented("path_symlink");
        return ErrnoN.NOSYS;
    }
    async pathUnlinkFile(fd: Fd, path_ptr: ptr<string>, path_len: usize): Promise<Errno> {
        const path = string.get(this.buffer, path_ptr, path_len);
        wasiCallDebug(`[path_unlink_file] dir fd: ${fd} path: ${path}`);
        const resource = this.openFiles.get(fd);
        if (resource instanceof OpenDirectory) {
            const dir = resource as OpenDirectory;
            await dir.delete(path);
        } else if (resource instanceof OpenFile) {
            const f = resource as OpenFile;
            wasiDebug("unexpected file fd in pathUnlinkFile");
            return ErrnoN.BADF;
        } else {
            return ErrnoN.BADF;
        }
        return ErrnoN.SUCCESS;
    }
    async pollOneoff(
        in_: ptr<Subscription>,
        out: mutptr<Event>,
        nsubscriptions: Size,
        result_ptr: mutptr<Size>
    ): Promise<Errno> {
        wasiCallDebug("[poll_oneoff] nsubscriptions: ", nsubscriptions);
        const subscriptionsNum = nsubscriptions;
        const eventsNumPtr = result_ptr;
        let subscriptionPtr = in_;
        let eventsPtr = out;
        if (nsubscriptions === 0) {
            throw new RangeError("Polling requires at least one subscription");
        } else {
            wasiDebug("poll_oneoff subscriptionsNum: " + nsubscriptions);
        }
        let eventsNum = 0;
        const addEvent = (event: Partial<Event>) => {
            Object.assign(Event.get(this.buffer, eventsPtr), event);
            eventsNum++;
            eventsPtr = (eventsPtr + Event.size) as ptr<Event>;
        };
        const clockEvents: {
            timeout: number;
            extra: number;
            userdata: bigint;
        }[] = [];
        for (let i = 0; i < subscriptionsNum; i++) {
            const { userdata, u } = Subscription.get(this.buffer, subscriptionPtr);
            subscriptionPtr = (subscriptionPtr + Subscription.size) as ptr<Subscription>;
            switch (u.tag) {
                case EventtypeN.CLOCK: {
                    wasiCallDebug("[poll_oneoff] event_type: clock");
                    let timeout = Number(u.data.timeout) / 1_000_000;
                    if (u.data.flags === SubclockflagsN.SUBSCRIPTION_CLOCK_ABSTIME) {
                        const origin = u.data.id === ClockidN.REALTIME ? Date : globalThis.performance;
                        timeout -= origin.now();
                    }
                    // This is not completely correct, since setTimeout doesn't give the required precision for monotonic clock.
                    clockEvents.push({
                        timeout,
                        extra: Number(u.data.precision) / 1_000_000,
                        userdata,
                    });
                    break;
                }
                case EventtypeN.FD_READ: {
                    const fd_forread = u.data.file_descriptor;
                    wasiCallDebug("[poll_oneoff] event_type: fd_read, fd:", fd_forread);
                    if (this.suspendStdIn == true) {
                        wasiDebug("poll_oneoff EventType.FdRead: _suspendStdIn==true");
                        wasiDebug("poll_oneoff EventType.FdRead: args: ", this.cargs);
                        wasiDebug("poll_oneoff EventType.FdRead: env: ", this.cenv);

                        await this._wait(1000);
                    } else {
                        wasiDebug("poll_oneoff EventType.FdRead: _suspendStdIn==false");
                        wasiDebug("poll_oneoff EventType.FdRead: args: ", this.cargs);
                        wasiDebug("poll_oneoff EventType.FdRead: env: ", this.cenv);
                        let nBytes = 0n;
                        const ofd = this.openFiles.get(fd_forread);
                        const ofda = ofd as any;
                        if (ofda.peek) {
                            const peekBytes = await ofda.peek();
                            nBytes = BigInt(peekBytes);
                            wasiCallDebug("[poll_oneoff] fd:", fd_forread, " peek:", nBytes);
                        } else if (fd_forread == 0) {
                            // TODO this is a hack, specifically for stdin , fd=0
                            // if peek is not implemented on stdin handle
                            nBytes = 1n;
                        }

                        // EventrwflagsN.NONE does not exist, setting to 0
                        const eventFlagsNone = 0;
                       
                        addEvent({
                            userdata,
                            error: ErrnoN.SUCCESS,
                            type: u.tag,
                            fd_readwrite: {
                                nbytes: nBytes,
                                flags: eventFlagsNone,
                            },
                        });
                    }
                    break;
                }
                case EventtypeN.FD_WRITE: {
                    const fd_forwrite = u.data.file_descriptor;
                    wasiCallDebug("[poll_oneoff] event_type: fd_write, fd:", fd_forwrite);
                    break;
                }
                default: {
                    wasiCallDebug("[poll_oneoff] event_type: unknown");
                    // EventrwflagsN.NONE does not exist, setting to 0
                    const eventFlagsNone = 0;
                    addEvent({
                        userdata,
                        error: ErrnoN.NOSYS,
                        // @ts-ignore
                        type: union.tag,
                        fd_readwrite: {
                            nbytes: 0n,
                            flags: eventFlagsNone,
                        },
                    });
                    break;
                }
            }
        }
        if (!eventsNum) {
            clockEvents.sort((a, b) => a.timeout - b.timeout);
            const wait = clockEvents[0].timeout + clockEvents[0].extra;
            let matchingCount = clockEvents.findIndex((item) => item.timeout > wait);
            matchingCount = matchingCount === -1 ? clockEvents.length : matchingCount;
            await this._wait(clockEvents[matchingCount - 1].timeout);
            for (let i = 0; i < matchingCount; i++) {
                addEvent({
                    userdata: clockEvents[i].userdata,
                    error: ErrnoN.SUCCESS,
                    type: EventtypeN.CLOCK,
                });
            }
        }
        Size.set(this.buffer, eventsNumPtr, eventsNum);
        return ErrnoN.SUCCESS;
    }
    async procExit(rval: Exitcode): Promise<void> {
        wasiCallDebug("[proc_exit] rval: ", rval);
        throw new ExitStatus(rval);
    }
    async procRaise(sig: Signal): Promise<Errno> {
        unimplemented("proc_raise");
        return ErrnoN.NOSYS;
    }
    async schedYield(): Promise<Errno> {
        wasiCallDebug("[sched_yield]");
        // Single threaded environment
        // This is a no-op in JS
        return ErrnoN.SUCCESS;
    }
    async randomGet(buf: mutptr<u8>, buf_len: Size): Promise<Errno> {
        wasiCallDebug("[random_get] buf_len: ", buf_len);
        let copyToSharedArrayBuffer = false;
        if (this.buffer instanceof SharedArrayBuffer) {
            copyToSharedArrayBuffer = true;
        }
        let uBuf: Uint8Array;
        let sBuf: Uint8Array | undefined;
        if (copyToSharedArrayBuffer) {
            sBuf = new Uint8Array(this.buffer, buf, buf_len);
            uBuf = new Uint8Array(buf_len);
        } else {
            sBuf = undefined;
            uBuf = new Uint8Array(this.buffer, buf, buf_len);
        }
        let crypto = globalThis.crypto;
        if (!crypto) {
            //fallback for older versions of node
            if (this.isNode) {
                wasiDebug("randomGet: isNode buf_len:", buf_len);
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                crypto = require("crypto").webcrypto;
            } else {
                wasiDebug("randomGet: not in node but globalThis.crypto not available:");
            }
        }
        crypto.getRandomValues(uBuf);
        if (copyToSharedArrayBuffer) {
            if (sBuf) {
                sBuf.set(uBuf);
            }
        }
        return ErrnoN.SUCCESS;
    }

    getSocket(fd: number): WasiSocket {
        const res = this.openFiles.get(fd);
        return res as WasiSocket;
    }

    async sockAccept(fd: Fd, flags: Fdflags, result_ptr: mutptr<Fd>): Promise<Errno> {
        wasiCallDebug("[sock_accept] fd:", fd);
        const sock = this.getSocket(fd);
        const clientSock = await sock.getAcceptedSocket();
        const resultFd = this.openFiles.add(clientSock);
        Fd.set(this.buffer, result_ptr, resultFd);
        wasiCallDebug("[sock_accept] returning fd:", resultFd);
        return ErrnoN.SUCCESS;
    }

    async sockRecv(
        fd: Fd,
        ri_data_ptr: ptr<Iovec>,
        ri_data_len: usize,
        ri_flags: Riflags,
        result_0_ptr: mutptr<Size>,
        result_1_ptr: mutptr<Roflags>
    ): Promise<Errno> {
        wasiCallDebug("[sock_recv] fd:", fd);
        const sock = this.getSocket(fd);
        try {
            await forEachIoVec(
                this.buffer,
                ri_data_ptr,
                ri_data_len,
                result_0_ptr,
                async (buf) => {
                    const read_len = ri_data_len;
                    wasiDebug(`[sock_recv] forEachIoVec bufLen: ${ri_data_len} input: `, sock);
                    const chunk = await sock.read(read_len);
                    buf.set(chunk);
                    return chunk.length;
                },
                () => {
                    this._checkAbort();
                }
            );
        } catch (err: any) {
            wasiDebug("[sock_recv] err: ", err);
        }
        return ErrnoN.SUCCESS;
    }
    async sockSend(
        fd: Fd,
        si_data_ptr: ptr<Ciovec>,
        si_data_len: usize,
        si_flags: Siflags,
        result_ptr: mutptr<Size>
    ): Promise<Errno> {
        wasiCallDebug("[sock_send] fd:", fd);
        const sock = this.getSocket(fd);
        try {
            await forEachIoVec(
                this.buffer,
                si_data_ptr,
                si_data_len,
                result_ptr,
                async (data) => {
                    await sock.write(data);
                    return data.length;
                },
                () => {
                    this._checkAbort();
                }
            );
        } catch (err: any) {
            wasiDebug("[sock_send] err: ", err);
        }
        return ErrnoN.SUCCESS;
    }
    async sockShutdown(fd: Fd, how: Sdflags): Promise<Errno> {
        wasiCallDebug("[sock_shutdown] fd:", fd);
        const sock = this.getSocket(fd);
        sock.shutdown();
        return ErrnoN.SUCCESS;
    }
}
