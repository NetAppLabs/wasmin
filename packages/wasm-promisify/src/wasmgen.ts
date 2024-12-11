import {
  call,
  call_indirect,
  Const,
  Dependency,
  elem,
  externref,
  func,
  FunctionTypeInput,
  global,
  i32,
  ImportFunc,
  local,
  Module,
  return_,
  StackVar,
  table,
  ToTypeTuple,
  ValueType,
  ValueTypeObject,
} from "wasmati";
import {
  constructWebAssemblyExportMap,
  constructWebAssemblyImportMap,
  isExportValueFunction,
  jspiDebug,
  promisifyImportObject,
  promisifyWebAssemblyExports,
  readCustomSections,
  TableMin,
  WebAssemblyExports,
  WebAssemblyFunction,
  WebAssemblyImports,
  WebAssemblyTableType,
  writeFile,
} from "./util";


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
    importFunctionInfos?: FunctionInfo[];
    _importsMap?: WebAssemblyImports;
    _exportsMap?: WebAssemblyExports;
    customSections: Record<string,string>;
    constructor(mod: WebAssembly.Module) {
        this.mod = mod;
        this.customSections = readCustomSections(this.mod);
    }

    get importsMap() {
        if (this._importsMap == undefined ) {
            this._importsMap = constructWebAssemblyImportMap(this.mod);
        }
        return this._importsMap;
    }

    get exportsMap() {
        if (this._exportsMap == undefined ) {
            this._exportsMap = constructWebAssemblyExportMap(this.mod);
        }
        return this._exportsMap;
    }

    get moduleName(){
        let modName = undefined;
        let customModName = this.customSections["name"];
        if (customModName !== undefined) {
            modName = customModName;
        }
        return modName;
    }

    getImportFunctionInfos() {
        if (!this.importFunctionInfos ) {
            this.importFunctionInfos = [];
            for (const [m,funcs] of Object.entries(this.importsMap)) {
                const moduleName = m;
                for (const [k,v] of Object.entries(funcs)) {
                    if (v.kind == "function" ) {
                        const funcType = v.type as WebAssemblyFunction;
                        const funcName = k;
                        const inParams = funcType.parameters;
                        const outParams = funcType.results;
                        const funcInfoCurrent: FunctionInfo = {
                            module: moduleName,
                            name: funcName,
                            in: inParams,
                            out: outParams,
                        }
                        jspiDebug("getFunctionInfos: ", funcName);
                        this.importFunctionInfos.push(funcInfoCurrent);
                    }
                }
            }

        }
        return this.importFunctionInfos;
    }


    async instantiateWithRewrittenAsyncExportsIndirect(importObject?: WebAssembly.Imports) {
        let modName = this.moduleName;
        let proxyModuleBytesArray = await this.generateWithRewrittenAsyncExportsIndirect();
        const proxyModuleBytes = proxyModuleBytesArray.buffer;
        if (globalThis.JSPI_DEBUG) {
            await writeFile(`./${modName}_rewritten_exports.wasm`, proxyModuleBytesArray);
        }
        const proxyModule = await WebAssembly.compile(proxyModuleBytes as ArrayBuffer);
        // Modify imports if any:
        let importsPromisified = importObject;
        if (importObject !== undefined) {
            importsPromisified = promisifyImportObject(importObject, proxyModule);
        }
        const instanceProxy = await WebAssembly.instantiate(proxyModule, importsPromisified);
        // Modify exports:
        const promisifiedExports = promisifyWebAssemblyExports(instanceProxy.exports);
        Object.defineProperty(instanceProxy, 'exports', { value: promisifiedExports })
        return instanceProxy;
    }

    async generateWithRewrittenAsyncExportsIndirect() {
        let exports: Record<string,any> = {};

        let elem_init: Const.refFunc[] = [];

        let exported_table: Dependency.AnyTable | undefined = undefined;

        for (const [k,v] of Object.entries(this.exportsMap)) {
                if (v.kind == "table" ) {
                    let tableName = k
                    let tableType = v.type as WebAssemblyTableType;
                    let tElement = tableType.element
                    let initial = tableType.minimum;
                    let maximum = tableType.maximum;
                    exported_table = {
                        kind: "table",
                        type: { type: tElement, limits: { shared: false, min: initial, max: maximum } },
                        deps: [],
                    };
                    exports[tableName] = exported_table;
                }
        }

        for (const [exportsKey,exportsValue] of Object.entries(this.exportsMap)) {
            if (exportsValue.kind == "function") {
                let funcType = exportsValue.type as WebAssemblyFunction;
                const funcInValueObjects = valueTypeArrayToValueObjectTypeArray(funcType.parameters);
                const funcOutValueObjects = valueTypeArrayToValueObjectTypeArray(funcType.results);

                const funcInValueObjectsRewritten = [externref ,...funcInValueObjects];

                let funcName = exportsKey;
                let functionIndex = Number(funcName);

                const inParams: ToTypeTuple<Tuple<ValueType>> = funcInValueObjectsRewritten as ToTypeTuple<Tuple<ValueType>>
                const outParams: ToTypeTuple<Tuple<ValueType>> = funcOutValueObjects as ToTypeTuple<Tuple<ValueType>>

                const exported_indirect_func = func({ in: inParams, out: outParams }, (params) => {
                    for (const param of params ) {
                        local.get(param); // put input params on the stack
                    }
                    i32.const(functionIndex);
                    call_indirect(exported_table!, { in: inParams, out: outParams });
                });
                elem_init.push(Const.refFunc(exported_indirect_func));
                exports[funcName] = exported_indirect_func;
            }
        }
        let module = Module({
            exports: exports,
        });
        const moduleBytesArray = module.toBytes();
        return moduleBytesArray;
    }

    async instantiateWithRewrittenAsyncImports(importObject?: WebAssembly.Imports){
        let modName = this.moduleName;
        let proxyModuleBytesArray = await this.generateWithRewrittenAsyncImports();
        const proxyModuleBytes = proxyModuleBytesArray.buffer;
        if (globalThis.JSPI_DEBUG) {
            await writeFile(`./${modName}_rewritten_imports.wasm`, proxyModuleBytesArray);
        }
        const proxyModule = await WebAssembly.compile(proxyModuleBytes as ArrayBuffer);
        // Modify imports if any:
        let importsPromisified = importObject;
        if (importObject !== undefined) {
            importsPromisified = promisifyImportObject(importObject, proxyModule);
        }
        const instanceProxy = await WebAssembly.instantiate(proxyModule, importsPromisified);
        // Modify exports:
        const promisifiedExports = promisifyWebAssemblyExports(instanceProxy.exports);
        Object.defineProperty(instanceProxy, 'exports', { value: promisifiedExports })
        return instanceProxy;
    }


    async generateWithRewrittenAsyncImports(){
        let exports: Record<string,any> = {};

        let funcinfos = this.getImportFunctionInfos();
        let elem_init: Const.refFunc[] = [];
        const nullfunc = () => { };
        const mem = Object.getPrototypeOf(WebAssembly.Memory);

        let imported_table: Dependency.ImportTable | undefined = undefined;

        for (const [m,funcs] of Object.entries(this.importsMap)) {
            const moduleName = m;
            for (const [k,v] of Object.entries(funcs)) {
                if (v.kind == "table" ) {
                    let tableName = k
                    let tableType = v.type as WebAssemblyTableType;
                    let tElement = tableType.element
                    let initial = tableType.minimum;
                    let maximum = tableType.maximum;
                    imported_table = {
                        module: moduleName,
                        string: tableName,
                        kind: "importTable",
                        type: { type: tElement, limits: { shared: false, min: initial, max: maximum } },
                        value: mem,
                        deps: [],
                    };

                }
            }
        }

        for (const funcInfo of funcinfos) {

            let module = funcInfo.module;
            let funcName = funcInfo.name;

            let funcArgs = funcInfo.in as ValueType[];
            let funcArgsRewritten = ["externref", ...funcArgs]  as ValueType[];
            let funcResults = funcInfo.out as ValueType[];
            const rewrittenImportFunc: ImportFunc<typeof funcArgs, typeof funcResults> = { kind: "importFunction", module: module, string: funcName, type: { args: funcArgsRewritten, results: funcResults }, value: nullfunc, deps: [] };
            elem_init.push(Const.refFunc(rewrittenImportFunc));
        }

        if (imported_table !== undefined) {
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
            const dummy_elem_init = func({ in: [], out: [] }, ([]) => {
                i32.const(0);
                call_indirect(imported_table!, { in: [], out: [] });
            });
            exports["_dummy_elem_init"] = dummy_elem_init;

            let module = Module({
                exports: exports,
            });
            const moduleBytes = module.toBytes();
            return moduleBytes;
        } else {
            let module = Module({
                exports: exports,
            });
            const moduleBytes = module.toBytes();
            return moduleBytes;
        }



    }

    /**
     *
     * Returns an instance of the generated promisified adapter as result, wired with the original module and proxy on the back-end.
     * The importObject with async imports is rewritten to the original Module as sync and exports are rewritten as async.
     *
     * @param mainModule original WebAssembly.Module
     * @param importObject imports to original WebAssembly.Module
     * @returns instance of the Adapter WebAssembly.Module
     */
    async instantiateWithAdapterAndWiredProxy(mainModule: WebAssembly.Module, importObject?: WebAssembly.Imports) {
        let modName = this.moduleName;
        const proxyRes = await this.generateImportsProxyAndWrappedImports(importObject);
        const wrappedImportsToImportsProxy = proxyRes.imports;
        const table = proxyRes.table;

        const instanceMain = await WebAssembly.instantiate(mainModule, wrappedImportsToImportsProxy)
        const memory = instanceMain.exports.memory;

        const bytesAdapterArr = this.generateAdapter();
        const bytesAdapter = bytesAdapterArr.buffer;
        if (globalThis.JSPI_DEBUG) {
            await writeFile(`./${modName}_adapter_gen.wasm`, bytesAdapterArr);
        }
        const modAdapter = await WebAssembly.compile(bytesAdapter as ArrayBuffer);

        let importsForAdapter = undefined;
        if (importObject !== undefined) {
            importsForAdapter = promisifyImportObject(importObject, modAdapter);

            let emptyNsImportsForAdapter = importsForAdapter[""];
            if (emptyNsImportsForAdapter === undefined) {
                emptyNsImportsForAdapter = {};
                importsForAdapter[""] = emptyNsImportsForAdapter;
            }
            // re-write all exported functions
            for (const [exportedFuncKey, exportedVal] of Object.entries(instanceMain.exports)) {
                if (isExportValueFunction(exportedVal)) {
                    jspiDebug("Re-wiring exported function as import: ", exportedFuncKey);
                    let exportedFunc = exportedVal;
                    emptyNsImportsForAdapter[exportedFuncKey] = exportedFunc;
                } else {
                    jspiDebug("Skipping Re-wiring exported function as import: ", exportedFuncKey);
                }
            }
            if (table !== undefined ) {
                jspiDebug("Adding $imports table to imports");
                emptyNsImportsForAdapter["$imports"] = table;
            }

            let envImportsForAdapter = importsForAdapter["env"];
            if (envImportsForAdapter === undefined) {
                envImportsForAdapter = {};
                importsForAdapter["env"] = envImportsForAdapter;
            }
            if (memory !== undefined) {
                jspiDebug("Adding env.memory to imports");
                envImportsForAdapter["memory"] = memory;
            }
        }
        if (importsForAdapter == undefined) {
            importsForAdapter = {};
        }
        const instanceAdapter = await WebAssembly.instantiate(modAdapter, importsForAdapter)

        const promisifiedInstance = Object.create(WebAssembly.Instance.prototype)
        const promisifiedExports = promisifyWebAssemblyExports(instanceAdapter.exports);
        Object.defineProperty(promisifiedInstance, 'exports', { value: promisifiedExports })
        promisifiedInstance.exports.memory = memory;

        return promisifiedInstance;
    }


    async generateImportsProxyAndWrappedImports(realImportObject?: WebAssembly.Imports) {
        const bytesImportsProxyArray = this.generateImportsProxy();
        const bytesImportsProxy = bytesImportsProxyArray.buffer;
        let modName = this.moduleName;
        if (globalThis.JSPI_DEBUG) {
            await writeFile(`./${modName}_adapter_proxy_gen.wasm`, bytesImportsProxyArray);
        }

        const importsForImportsProxy = {};
        const instanceImportsProxy = await WebAssembly.instantiate(bytesImportsProxy, importsForImportsProxy);

        const funcInfos = this.getImportFunctionInfos();
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
            jspiDebug("getting tableIndex: ", funcInfo.tableIndex);
            if (funcInfo.tableIndex !== undefined) {
                exportName = funcInfo.tableIndex.toString();
            }
            mod[functionName] = instanceImportsProxy.exports[exportName];
        }

        for (const [m,entries] of Object.entries(this.importsMap)) {
            const moduleName = m;
            for (const [importKey,importValue] of Object.entries(entries)) {
                if (importValue.kind == "global" ) {
                    // Pass on the global from the original ImportObject
                    let globalName = importKey
                    let mod = wrappedImportsToImportsProxy[moduleName];
                    if (!mod) {
                        mod = {};
                        wrappedImportsToImportsProxy[moduleName] = mod;
                    }
                    if (realImportObject!=undefined) {
                        let realGlobal = realImportObject[moduleName][globalName];
                        mod[globalName] = realGlobal;
                    }
                } else if (importValue.kind == "table" ) {
                    // Pass on the table from the original ImportObject
                    let tableName = importKey
                    let mod = wrappedImportsToImportsProxy[moduleName];
                    if (!mod) {
                        mod = {};
                        wrappedImportsToImportsProxy[moduleName] = mod;
                    }
                    if (realImportObject!=undefined) {
                        let realTable = realImportObject[moduleName][importKey];
                        mod[tableName] = realTable;
                    }
                } else if (importValue.kind == "memory" ) {
                    // Pass on the memory from the original ImportObject
                    let memoryName = importKey
                    let mod = wrappedImportsToImportsProxy[moduleName];
                    if (!mod) {
                        mod = {};
                        wrappedImportsToImportsProxy[moduleName] = mod;
                    }
                    if (realImportObject!=undefined) {
                        let realMem = realImportObject[moduleName][importKey];
                        mod[memoryName] = realMem;
                    }
                }
            }
        }
        const table = instanceImportsProxy.exports["$imports"];

        return {
            instance: instanceImportsProxy,
            imports: wrappedImportsToImportsProxy,
            table: table,
        }
    }

    generateImportsProxy() {

        const funcinfos = this.getImportFunctionInfos();
        const functionsLength = funcinfos.length;
        let tableMin = functionsLength;

        const table0 = table({ type: { kind: "funcref" }, min: tableMin });
        const exports: Record<string, any> = {
            "$imports": table0
        };

        let tableIndex = 0;
        for (const funcInfo of funcinfos) {

            const funcInValueObjects = valueTypeArrayToValueObjectTypeArray(funcInfo.in);
            const funcOutValueObjects = valueTypeArrayToValueObjectTypeArray(funcInfo.out);

            const type0: FunctionTypeInput = { in: funcInValueObjects,  out: funcOutValueObjects };

            const inParams: ToTypeTuple<Tuple<ValueType>> = funcInValueObjects as ToTypeTuple<Tuple<ValueType>>
            const outParams: ToTypeTuple<Tuple<ValueType>> = funcOutValueObjects as ToTypeTuple<Tuple<ValueType>>

            jspiDebug("funcName: ", funcInfo.name);
            jspiDebug("inParams: ", inParams);
            jspiDebug("outParams: ", outParams);
            const proxied_func = func({ in: inParams, out: outParams }, (params) => {
                for (const param of params ) {
                    local.get(param); // put input on the stack
                }
                i32.const(tableIndex);
                jspiDebug("setting tableIndex: ", tableIndex);
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
        let tableMin = TableMin;
        const table0 = table({ type: { kind: "funcref" }, min: tableMin });
        const funcinfos = this.getImportFunctionInfos();

        let hasMemory = false;
        const nullfunc = () => { };

        let global_suspender = global(Const.refExternNull, { mutable: true });

        let exports: Record<string,any> = {};

        // Redefine exported functions as imports and re-export as async
        for (const [exported_key, exported_value] of Object.entries(this.exportsMap)) {
            if (exported_value.kind == "function") {
                let funcName = exported_key;
                let module = "";
                let funcType = exported_value.type as WebAssemblyFunction;
                let funcArgs = funcType.parameters as ValueType[];
                let funcResults = funcType.results as ValueType[];

                // Original exported "sync" function imported
                const importedExportFunc: ImportFunc<typeof funcArgs, typeof funcResults> = { kind: "importFunction", module: module, string: funcName, type: { args: funcArgs, results: funcResults }, value: nullfunc, deps: [] };

                let funcArgsWithExternRef: ValueType[] = ["externref", ...funcArgs];
                const funcInValueObjects = valueTypeArrayToValueObjectTypeArray(funcArgsWithExternRef);
                const funcOutValueObjects = valueTypeArrayToValueObjectTypeArray(funcResults);

                const inParams: ToTypeTuple<Tuple<ValueType>> = funcInValueObjects as ToTypeTuple<Tuple<ValueType>>;
                const outParams: ToTypeTuple<Tuple<ValueType>> = funcOutValueObjects as ToTypeTuple<Tuple<ValueType>>;

                // Define an exported func with added "externref" as async
                const funcForAsyncExport = func({ in: inParams, out: outParams }, (params) => {
                    var arrayLength = params.length;
                    for (var i = 0; i < arrayLength; i++) {
                        let param = params[i];
                        // get externref handle from first argument
                        if (i == 0 ) {
                            let val = local.get(param);
                            if (val !== undefined) {
                                // Set global as gotten externref
                                let externRef = val as StackVar<"externref">;
                                global.set(global_suspender, externRef);
                            }
                        } else {
                            local.get(param); // put input params on the stack
                        }
                    }
                    // Call the imported sync func
                    call(importedExportFunc);
                });

                exports[funcName] = funcForAsyncExport;
            } else if (exported_value.kind == "memory") {
                hasMemory = true;
            }
        }

        let imported_memory: Dependency.ImportMemory | undefined = undefined;
        const mem = Object.getPrototypeOf(WebAssembly.Memory);
        if (hasMemory) {
            imported_memory = {
                module: "env",
                string: "memory",
                kind: "importMemory",
                type: { limits: { shared: false, min: 0 } },
                value: mem,
                deps: [],
            };
        }
        const imported_table: Dependency.ImportTable = {
            module: "",
            string: "$imports",
            kind: "importTable",
            type: { type: "funcref", limits: { shared: false, min: tableMin } },
            value: mem,
            deps: [],
        };

        let elem_init: Const.refFunc[] = [];

        // Redefine imported functions and redefine as async
        for (const funcInfo of funcinfos) {

            const funcIn = funcInfo.in;
            const funcInVals = funcIn;
            const funcOut = funcInfo.out;
            const module = funcInfo.module;
            const funcName = funcInfo.name;

            const funcInValueObjects = valueTypeArrayToValueObjectTypeArray(funcInfo.in);
            const funcOutValueObjects = valueTypeArrayToValueObjectTypeArray(funcInfo.out);

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


            const funcForExport = func({ in: inParams, locals: [externref], out: outParams,  }, (params, [suspender_copy]) => {
                // get externref handle from global as first argument
                global.get(global_suspender);
                // sets the suspender_copy as the current global_suspender
                // and puts the global_suspender/suspender_copy
                // as first input parameter on the stack
                local.tee(suspender_copy);
                for (const param of params ) {
                    local.get(param); // put input params on the stack
                }
                // Call the imported async func
                call(importedAsyncFunc);
                // re-sets the global_suspender
                // as the value of the current suspender_copy
                local.get(suspender_copy);
                global.set(global_suspender);
                return_();
            });

            const exportedFuncName = `${module}_${funcName}`;
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
        const dummy_elem_init = func({ in: [], out: [] }, ([]) => {
            i32.const(0);
            call_indirect(imported_table, { in: [], out: [] });
        });

        exports["_dummy_elem_init"] = dummy_elem_init;

        let module = Module({
            exports: exports,
            memory: imported_memory,
        });

        const moduleBytes = module.toBytes();
        return moduleBytes;
    }
}