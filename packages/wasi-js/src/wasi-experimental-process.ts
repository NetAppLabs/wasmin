import { UTF8_DECODER, clamp_host } from "./intrinsics.js";
import { WasiEnv } from "./wasi.js";
import { translateErrorToErrorno, parseCStringArray, parseCStringArrayToKeyValue } from "./wasiPreview1Utils.js";
import { mutptr, u32, u64 } from "./wasi_snapshot_preview1/bindings.js";
import { BufferedPipe } from "./wasiPipes.js";
import { wasiProcessDebug } from "./wasiDebug.js";
import { ProcessControl, WasiProcess } from "./wasiProcess.js";


export function addWasiExperimentalProcessToImports(
    importsNS: string,
    imports: any,
    obj: WasiExperimentalProcess,
    get_export: (name: string) => WebAssembly.ExportValue
): void {
    if (!(importsNS in imports)) imports[importsNS] = {};
    imports[importsNS]["proc_exec"] = async function (
        arg0: number,
        arg1: number,
        arg2: number,
        arg3: number,
        arg4: number,
        arg5: number,
        arg6: number,
        arg7: number,
        arg8: mutptr<u32>,
        arg9: mutptr<u32>,
        arg10: mutptr<u32>,
        arg11: mutptr<u32>,
        arg12: mutptr<u64>,
    ) {
        const memory = get_export("memory") as WebAssembly.Memory;
        const ptr0 = arg0;
        const len0 = arg1;
        const ptr1 = arg2;
        const len1 = arg3;
        const ptr2 = arg4;
        const len2 = arg5;
        const ptr3 = arg6;
        const len3 = arg7;
        const proc_fd_ptr = arg8;
        const stdin_ptr = arg9;
        const stdout_ptr = arg10;
        const stderr_ptr = arg11;
        const pid_ptr = arg12;
        let ret = 0;
        try {
            ret = await obj.exec(
                UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr0, len0)),
                UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr1, len1)),
                UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr2, len2)),
                UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr3, len3)),
                proc_fd_ptr,
                stdin_ptr,
                stdout_ptr,
                stderr_ptr,
                pid_ptr,
            );
        } catch (err: any) {
            return translateErrorToErrorno(err);
        }
        return clamp_host(ret, 0, 4294967295);
    };
}

export function initializeWasiExperimentalProcessToImports(
    imports: any,
    get_export: (name: string) => WebAssembly.ExportValue,
    wasi: WasiEnv
) {
    const wHost = new WasiExperimentalProcessHost(wasi, get_export);
    let experimentalProcessNs = "wasi_experimental_process";
    addWasiExperimentalProcessToImports(experimentalProcessNs, imports, wHost, get_export);
    let wasiPreview1Ns = "wasi_snapshot_preview1";
    addWasiExperimentalProcessToImports(wasiPreview1Ns, imports, wHost, get_export);

}

export interface WasiExperimentalProcess {
    exec(
        name: string, 
        cwd: string,
        argv: string,
        env: string,
        proc_fd_ptr: mutptr<u32>,
        stdin_fd_ptr: mutptr<u32>,
        stdout_fd_ptr: mutptr<u32>,
        stderr_fd_ptr: mutptr<u32>,
        pid_ptr: mutptr<u64>,
    ): Promise<number>;
}

class WasiExperimentalProcessHost implements WasiExperimentalProcess {
    constructor(wasiEnv: WasiEnv, get_export?: (name: string) => WebAssembly.ExportValue) {
        this._wasiEnv = wasiEnv;
        this._get_exports_func = get_export;
    }
    public _get_exports_func?: (name: string) => WebAssembly.ExportValue;
    private _wasiEnv: WasiEnv;
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
    async exec(
        name: string,
        cwd: string,
        argvString: string,
        envString: string,
        proc_fd_ptr: mutptr<u32>,
        stdin_fd_ptr: mutptr<u32>,
        stdout_fd_ptr: mutptr<u32>,
        stderr_fd_ptr: mutptr<u32>,
        pid_ptr: mutptr<u64>,
    ): Promise<number> {
        wasiProcessDebug("exec cwd: ", cwd);
        wasiProcessDebug("exec name: ", name);
        //const argvString = string.get(this._getBuffer(), argv_ptr, argv_len);
        wasiProcessDebug("exec argvString: ", argvString);
        const args: string[] = parseCStringArray(argvString);
        wasiProcessDebug("exec args: ", args);
        wasiProcessDebug("exec envString: ", envString);
        let env = parseCStringArrayToKeyValue(envString);

        let stdinPtrVal = u32.get(this.buffer, stdin_fd_ptr);
        wasiProcessDebug("exec stdinPtrVal: ", stdinPtrVal);
        let stdOutPtrVal = u32.get(this.buffer, stdout_fd_ptr);
        wasiProcessDebug("exec stdOutPtrVal: ", stdOutPtrVal);

        let procControl = new ProcessControl();
        let newStdin = new BufferedPipe();
        let newStdOut = new BufferedPipe();
        let newStdErr = new BufferedPipe();

        let newProcFd = this._wasiEnv.openFiles.add(procControl);
        let newStdInFd = this._wasiEnv.openFiles.add(newStdin);
        let newStdOutFd = this._wasiEnv.openFiles.add(newStdOut);
        let newStdErrFd = this._wasiEnv.openFiles.add(newStdErr);
        u32.set(this.buffer, proc_fd_ptr, newProcFd);
        u32.set(this.buffer, stdin_fd_ptr, newStdInFd);
        u32.set(this.buffer, stdout_fd_ptr, newStdOutFd);
        u32.set(this.buffer, stderr_fd_ptr, newStdErrFd);

        wasiProcessDebug("setting newProcFd: ", newProcFd);
        wasiProcessDebug("setting newStdInFd: ", newStdInFd);
        wasiProcessDebug("setting newStdOutFd: ", newStdOutFd);
        wasiProcessDebug("setting newStdErrFd: ", newStdErrFd);

        let proc = new WasiProcess(
            this._wasiEnv,
            name,
            cwd,
            args,
            env,
            newStdin,
            newStdOut,
            newStdErr,
            procControl
        );

        let pid = await proc.start();

        u64.set(this.buffer, pid_ptr, pid);
        return 0;
    }
}
