import { i32, func, table, local } from "wasmati";
import { ImportFunc, externref, global, Module, FunctionTypeInput } from "wasmati";
import { call, call_indirect, elem, Const, Dependency } from "wasmati";
import { ref, Global, memory, } from "wasmati";

let tableMin = 2;
let tableMax = 1024;

export function testConstructProxyModule() {

    const type0: FunctionTypeInput = { in: [i32, i32, i32, i32], out: [i32] };
    const table0 = table({ type: { kind: "funcref" }, min: tableMin });

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
    const table0 = table({ type: { kind: "funcref" }, min: tableMin });
    const mem = Object.getPrototypeOf(WebAssembly.Memory);
    const imported_memory: Dependency.ImportMemory = {
        module: "env",
        string: "memory",
        kind: "importMemory",
        type: { limits: { min: 0 } },
        value: mem,
        deps: [],
    };


    let global0 = global(Const.refExternNull, { mutable: true });

    const nullfunc = () => { };
    const imported_start: ImportFunc<[], []> = { kind: "importFunction", module: "", string: "_start", type: { args: [], results: [] }, value: nullfunc, deps: [] };
    const imported_fd_write_async: ImportFunc<["externref", i32, i32, i32, i32], [i32]> = { kind: "importFunction", module: "wasi_snapshot_preview1", string: "fd_write", type: { args: ["externref", "i32", "i32", "i32", "i32"], results: ["i32"] }, value: nullfunc, deps: [] };

    const fd_write_export = func({ in: [i32, i32, i32, i32], out: [i32] }, ([a, b, c, d]) => {
        global.get(global0);
        local.get(a); // put input on the stack
        local.get(b); // put input on the stack
        local.get(c); // put input on the stack
        local.get(d); // put input on the stack
        call(imported_fd_write_async);
    });

    const start_export = func({ in: [externref], out: [] }, ([a]) => {
        global.set(global0, a);
        call(imported_start);
    });


    const imported_table: Dependency.ImportTable = {
        module: "",
        string: "$imports",
        kind: "importTable",
        type: { type: "funcref", limits: { min: tableMin } },
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