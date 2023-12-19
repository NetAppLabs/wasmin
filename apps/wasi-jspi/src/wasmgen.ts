import { i32, func, table, local, ValueTypeObject, ToTypeTuple, ValueType } from "wasmati";
import { ImportFunc, externref, global, Module, FunctionTypeInput } from "wasmati";
import { call, call_indirect, elem, Const, Dependency } from "wasmati";
import { ref, Global, memory, Type } from "wasmati";
import { constructWebAssemblyImportFunctionMap } from "./util.js";

let tableMin = 1;
let tableMax = 1024;

// Defined here because it is not exported from "wasmati"
type Tuple<T> = [] | [T, ...T[]];

export interface FunctionInfo {
    module: string,
    name: string
    in: ValueType[];
    out: ValueType[];
    tableIndex?: number,
}

export function valueTypeObjectArrayToValueTypeArray(valObjs: ValueTypeObject[]){
    let valArr: ValueType[] = [];
    for (const v of valObjs ){
        const val = v.kind;
        valArr.push(val);
    }
    return valArr;
}

export function valueTypeArrayToValueObjectTypeArray(valObjs: ValueType[]){
    let valArr: ValueTypeObject[] = [];
    for (const v of valObjs ){
        const val: ValueTypeObject = {
            kind: v
        }
        valArr.push(val);
    }
    return valArr;
}

export class PromisifiedWasmGenerator {
    mod: WebAssembly.Module;
    funcInfos?: FunctionInfo[];
    constructor(mod: WebAssembly.Module) {
        this.mod = mod;
    }

    getFunctionInfos() {
        if (!this.funcInfos ) {
            this.funcInfos = [];
            const importFuncMap = constructWebAssemblyImportFunctionMap(this.mod);
            for (const [m,funcs] of Object.entries(importFuncMap)) {
                const moduleName = m;
                for (const [k,v] of Object.entries(funcs)) {
                    const funcName = k;
                    const func = v;
                    const inParams = v.parameters;
                    const outParams = v.results;
                    const funcInfoCurrent: FunctionInfo = {
                        module: moduleName,
                        name: funcName,
                        in: inParams,
                        out: outParams,
                    }
                    this.funcInfos.push(funcInfoCurrent);    
                }
            }
    
        }
        return this.funcInfos;
    }

    testGetFunctionInfos() {
        const funcInfo0: FunctionInfo = {
            module: "wasi_snapshot_preview1",
            name: "fd_write",
            in: ["i32", "i32", "i32", "i32"],
            out: ["i32"],
        }
        const funcinfos: FunctionInfo[] = [funcInfo0];
        return funcinfos;
    }

    async generateImportsProxyAndWrappedImports() {
        const bytesImportsProxyArray = this.generateImportsProxy();
        const bytesImportsProxy = bytesImportsProxyArray.buffer;

        const importsForImportsProxy = {};
        const instanceImportsProxySource = await WebAssembly.instantiate(bytesImportsProxy, importsForImportsProxy)
        const instanceImportsProxy = instanceImportsProxySource.instance;
    
        const funcInfos = this.getFunctionInfos();
        let wrappedImportsToImportsProxy: Record<string,Record<string,any>> = {};

        for (const funcInfo of funcInfos) {
            const moduleName = funcInfo.module;
            const functionName = funcInfo.name;
            let mod = wrappedImportsToImportsProxy[moduleName];
            if (!mod) {
                mod = {};
                wrappedImportsToImportsProxy[moduleName] = mod;
            }
            let exportName = functionName
            console.log("getting tableIndex: ", funcInfo.tableIndex);
            if (funcInfo.tableIndex !== undefined) {
                exportName = funcInfo.tableIndex.toString();
            }
            mod[functionName] = instanceImportsProxy.exports[exportName];
        }

        const table = instanceImportsProxy.exports["$imports"];

        return {
            instance: instanceImportsProxy,
            imports: wrappedImportsToImportsProxy,
            table: table,
        }
    }

    generateImportsProxy() {

        const funcinfos = this.getFunctionInfos();
        const functionsLength = funcinfos.length;
        tableMin = functionsLength;

        const table0 = table({ type: { kind: "funcref" }, min: tableMin });
        const exports: Record<string, any> = {
            "$imports": table0
        };

        let tableIndex = 0;
        for (const funcInfo of funcinfos) {

            const funcInValueObjects = valueTypeArrayToValueObjectTypeArray(funcInfo.in);
            const funcOutValueObjects = valueTypeArrayToValueObjectTypeArray(funcInfo.out);

            const type0: FunctionTypeInput = { in: funcInValueObjects,  out: funcOutValueObjects };
            
            /*
            type ToTypeTuple<T extends readonly ValueType[]> = {
                [K in keyof T]: Type<T[K]>;
            };
            */
            
            const inParams: ToTypeTuple<Tuple<ValueType>> = funcInValueObjects as ToTypeTuple<Tuple<ValueType>>
            const outParams: ToTypeTuple<Tuple<ValueType>> = funcOutValueObjects as ToTypeTuple<Tuple<ValueType>>

            console.log("funcName: ", funcInfo.name);
            console.log("inParams: ", inParams);
            console.log("outParams: ", outParams);
            const proxied_func = func({ in: inParams, out: outParams }, (params) => {
                for (const param of params ) {
                    local.get(param); // put input on the stack
                }
                i32.const(tableIndex);
                console.log("setting tableIndex: ", tableIndex);
                funcInfo.tableIndex = tableIndex;
                call_indirect(table0, type0);
            });
            const tableIndexString = tableIndex.toString();
            exports[tableIndexString] = proxied_func;
            tableIndex ++;
        }

        let module = Module({
            exports: exports,
        });
        const moduleBytes = module.toBytes();
        return moduleBytes;    
    }

    generateAdapter() {
        const table0 = table({ type: { kind: "funcref" }, min: tableMin });
        const funcinfos = this.getFunctionInfos();

        const mem = Object.getPrototypeOf(WebAssembly.Memory);
        const imported_memory: Dependency.ImportMemory = {
            module: "env",
            string: "memory",
            kind: "importMemory",
            type: { limits: { min: 0 } },
            value: mem,
            deps: [],
        };
        const imported_table: Dependency.ImportTable = {
            module: "",
            string: "$imports",
            kind: "importTable",
            type: { type: "funcref", limits: { min: tableMin } },
            value: mem,
            deps: [],
        };

        const nullfunc = () => { };

        let global0 = global(Const.refExternNull, { mutable: true });

        const imported_start: ImportFunc<[], []> = { kind: "importFunction", module: "", string: "_start", type: { args: [], results: [] }, value: nullfunc, deps: [] };

        const start_export = func({ in: [externref], out: [] }, ([a]) => {
            global.set(global0, a);
            call(imported_start);
        });
        
        let exports: Record<string,any> = {
            "_start": start_export,
        };

        let elem_init: Const.refFunc[] = [];

        for (const funcInfo of funcinfos) {

            const funcIn = funcInfo.in;
            const funcInVals = funcIn;
            const funcOut = funcInfo.out;
            const module = funcInfo.module;
            const funcName = funcInfo.name;

            const funcInValueObjects = valueTypeArrayToValueObjectTypeArray(funcInfo.in);
            const funcOutValueObjects = valueTypeArrayToValueObjectTypeArray(funcInfo.out);

            const type0: FunctionTypeInput = { in: funcInValueObjects, out: funcOutValueObjects };

            // Adding externref as first value in
            const funcInValueTypes: ValueType[] = ["externref", ...funcInVals];
            const funcOutValueTypes: ValueType[] = funcOut;

            const importedAsyncFunc: ImportFunc<typeof funcInValueTypes, typeof funcOutValueTypes> = { 
                kind: "importFunction",
                module: module,
                string: funcName,
                type: {
                    args: funcInValueTypes,
                    results: funcOutValueTypes,
                },
                value: nullfunc,
                deps: []
            };
        
            const inParams: ToTypeTuple<Tuple<ValueType>> = funcInValueObjects as ToTypeTuple<Tuple<ValueType>>;
            const outParams: ToTypeTuple<Tuple<ValueType>> = funcOutValueObjects as ToTypeTuple<Tuple<ValueType>>;

            const funcForExport = func({ in: inParams, out: outParams }, (params) => {
                // get externref handle from global as first argument
                global.get(global0);
                for (const param of params ) {
                    local.get(param); // put input params on the stack
                }
                // Call the imported async func
                call(importedAsyncFunc);
            });

            const exportedFuncName = funcName;
            exports[exportedFuncName] = funcForExport;
            // Push the function to the table
            elem_init.push(Const.refFunc(funcForExport));
        }
    
        const elem0 = elem(
            {
                type: {
                    kind: "funcref"
                },
                mode: {
                    table: imported_table,
                    offset: Const.i32(0)
                }
            },
            elem_init
        );

        // Not used. only needed to have elems populate imported table
        const dummy_elem_init_export = func({ in: [], out: [] }, ([]) => {
            i32.const(0);
            call_indirect(imported_table, { in: [], out: [] });
        });
    
        exports["_dummy_elem_init"] = dummy_elem_init_export;

        let module = Module({
            exports: exports,
            memory: imported_memory,
        });
    
        const moduleBytes = module.toBytes();
        return moduleBytes;    
    }
}

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