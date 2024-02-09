import { i32, func, table, local } from "wasmati";
import { ImportFunc, externref, global, Module, FunctionTypeInput } from "wasmati";
import { call, call_indirect, elem, Const, Dependency } from "wasmati";
import { TableMin, jspiDebug, promisifyImportFunction } from "./util.js";
import { FunctionInfo } from "./wasmgen.js";


export declare interface WASITest {
    fd_write(fd: number, iovsPtr: number, iovsLength: number, bytesWrittenPtr: number): Promise<number>;
}


export class WasiImpl {
    inst?: WebAssembly.Instance;

    promisifiedImports() {
        let fd_write_f = async (fd: number, iovsPtr: number, iovsLength: number, bytesWrittenPtr: number) => {
            return await this.fd_write(fd, iovsPtr, iovsLength, bytesWrittenPtr);
        }
        const fd_write_wrapped = promisifyImportFunction("fd_write", fd_write_f, ['i32', 'i32', 'i32', 'i32'], ['i32']);
        //fd_write_wrapped.bind(this);
        const imports = {
            'wasi_snapshot_preview1': {
                fd_write: fd_write_wrapped
            },
        }
        return imports;
    }

    imports() {
        let fd_write_impl = this.fd_write.bind(this);
        const imports = {
            'wasi_snapshot_preview1': {
                fd_write: fd_write_impl
            },
        }
        return imports;
    }
    async fd_write(fd: number, iovsPtr: number, iovsLength: number, bytesWrittenPtr: number): Promise<number> {

        /*
        let ms = 1000;
        let prom = new Promise((resolve) => {
            setTimeout(resolve, ms)
        });
        await prom;
        */
        const inst = this.inst!;
        const memory = inst.exports.memory as any as WebAssembly.Memory;
        const iovs = new Uint32Array(memory.buffer, iovsPtr, iovsLength * 2);
        const decoder = new TextDecoder();
        jspiDebug(`fd_write: fd: ${fd}`);
        jspiDebug(`fd_write: iovsPtr: ${iovsPtr}, iovsLength" ${iovsLength} bytesWrittenPtr: ${bytesWrittenPtr}`);

        jspiDebug(`fd_write memory: `, memory);

        if (fd === 1) { // 1 is stdout
            let decodedString = "";
            let totalBytesWritten = 0;
            for (let i = 0; i < iovsLength * 2; i += 2) {
                const offset = iovs[i];
                const length = iovs[i + 1];
                const textChunk = decoder.decode(new Int8Array(memory.buffer, offset, length));
                decodedString += textChunk;
                totalBytesWritten += length;
            }
            const dataView = new DataView(memory.buffer);
            dataView.setInt32(bytesWrittenPtr, totalBytesWritten, true);
            jspiDebug("decodedString: ", decodedString);
        }
        return 0;
    }

    async start(inst: WebAssembly.Instance): Promise<number> {
        this.inst = inst;
        let exitCode = 0;

        const { _start } = inst.exports

        let ret
        try {
            ret = (_start as () => any)()
        } catch (err) {
            if (err !== exitCode) {
                throw err
            }
        }

        if (ret instanceof Promise) {
            return ret.then(
                () => exitCode,
                (err) => {
                    if (err !== exitCode) {
                        throw err
                    }
                    return exitCode
                }
            )
        }
        return exitCode
    }
}


function testGetFunctionInfos() {
    const funcInfo0: FunctionInfo = {
        module: "wasi_snapshot_preview1",
        name: "fd_write",
        in: ["i32", "i32", "i32", "i32"],
        out: ["i32"],
    }
    const funcinfos: FunctionInfo[] = [funcInfo0];
    return funcinfos;
}

export function testConstructProxyModule() {

    const type0: FunctionTypeInput = { in: [i32, i32, i32, i32], out: [i32] };
    const table0 = table({ type: { kind: "funcref" }, min: TableMin });

    const fd_write_adapt = func({ in: [i32, i32, i32, i32], out: [i32] }, ([a, b, c, d]) => {
        local.get(a); // put input on the stack
        local.get(b); // put input on the stack
        local.get(c); // put input on the stack
        local.get(d); // put input on the stack
        i32.const(0);
        call_indirect(table0, type0);
    });

    let module = Module({
        exports: { "0": fd_write_adapt, "$imports": table0 },
    });
    const moduleBytes = module.toBytes();
    return moduleBytes;
}

export function testConstructAdapterModule() {

    const type0: FunctionTypeInput = { in: [i32, i32, i32, i32], out: [i32] };
    const table0 = table({ type: { kind: "funcref" }, min: TableMin });
    const mem = Object.getPrototypeOf(WebAssembly.Memory);
    const imported_memory: Dependency.ImportMemory = {
        module: "env",
        string: "memory",
        kind: "importMemory",
        type: { limits: { shared: false, min: 0 } },
        value: mem,
        deps: [],
    };


    let global_suspender = global(Const.refExternNull, { mutable: true });

    const nullfunc = () => { };
    const imported_start: ImportFunc<[], []> = { kind: "importFunction", module: "", string: "_start", type: { args: [], results: [] }, value: nullfunc, deps: [] };
    const imported_fd_write_async: ImportFunc<["externref", i32, i32, i32, i32], [i32]> = { kind: "importFunction", module: "wasi_snapshot_preview1", string: "fd_write", type: { args: ["externref", "i32", "i32", "i32", "i32"], results: ["i32"] }, value: nullfunc, deps: [] };

    const fd_write_export = func({ in: [i32, i32, i32, i32], out: [i32] }, ([a, b, c, d]) => {
        global.get(global_suspender);
        local.get(a); // put input on the stack
        local.get(b); // put input on the stack
        local.get(c); // put input on the stack
        local.get(d); // put input on the stack
        call(imported_fd_write_async);
    });

    const start_export = func({ in: [externref], out: [] }, ([a]) => {
        global.set(global_suspender, a);
        call(imported_start);
    });


    const imported_table: Dependency.ImportTable = {
        module: "",
        string: "$imports",
        kind: "importTable",
        type: { type: "funcref", limits: { shared: false, min: TableMin } },
        value: mem,
        deps: [],
    };

    const elem_init: Const.refFunc[] = [
        Const.refFunc(fd_write_export),
        Const.refFunc(start_export)
    ];
    const elem0 = elem({ type: { kind: "funcref" }, mode: { table: imported_table, offset: Const.i32(0) } }, elem_init);
    // Not used. only needed to have elems populate imported table
    const dummy_elem_init_export = func({ in: [], out: [] }, ([]) => {
        i32.const(0);
        call_indirect(imported_table, { in: [], out: [] });
    });

    let module = Module({
        exports: {
            "_start": start_export,
            "fd_write": fd_write_export,
            "_dummy_elem_init": dummy_elem_init_export,
        },
        memory: imported_memory,
    });

    const moduleBytes = module.toBytes();
    return moduleBytes;
}