// @ts-ignore
export type WebAssemblyFunction = WebAssembly.Function;

type WebAssemblyImportFunctions = Record<string, Record<string, WebAssemblyFunction>>;

export declare interface WASI {
    fd_write(fd: number, iovsPtr: number, iovsLength: number, bytesWrittenPtr: number): Promise<number>;
}

let JSPI_DEBUG = false;
export function jspiDebug(message?: any, ...optionalParams: any[]) {
    if (JSPI_DEBUG) {
        console.debug(message, optionalParams);
    }
}

function getInstanceFuncionNames(obj: any) {
    return Object
        .getOwnPropertyNames (Object.getPrototypeOf (obj))
        .filter(name => (name !== 'constructor' && typeof obj[name] === 'function'));
}

export function promisifyImportObject(importObj: any, mod: WebAssembly.Module) {

    let importFuncNames = getInstanceFuncionNames(importObj);
    const wasip1imports = {} as WebAssembly.ModuleImports;

    importFuncNames.forEach((importFuncName: string) => {
        const myObj = importObj as any;
        const realImportFunc = myObj[importFuncName];
        jspiDebug("realImportFunc: ", realImportFunc);
        if (typeof realImportFunc === 'function') {
            let newWrappedImportFunc = async (...params: any) => {
                let boundOwnFunc = realImportFunc.bind(myObj);
                return await boundOwnFunc(...params);
            }
            wasip1imports[importFuncName] = newWrappedImportFunc;
        }
        jspiDebug("importFuncName: ", importFuncName);
    });
    
    const imports = {
        'wasi_snapshot_preview1': wasip1imports,
    }
    const wasmImportFuncs = constructWebAssemblyImportFunctionMap(mod);
    jspiDebug("wasmImportFuncs: ", wasmImportFuncs);
    const wrappedImports = promisifyWebAssemblyImports(imports, wasmImportFuncs);
    jspiDebug("wrappedImports: ", wrappedImports);
    return wrappedImports;
}


export class WasiImpl {
    inst?: WebAssembly.Instance;

    promisifiedImports2() {
        let fd_write_f = async (fd: number, iovsPtr: number, iovsLength: number, bytesWrittenPtr: number) => {
            return await this.fd_write(fd, iovsPtr, iovsLength, bytesWrittenPtr);
        }
        const fd_write_wrapped = promisifyImportFunction(fd_write_f, ['i32', 'i32', 'i32', 'i32'], ['i32']);
        //fd_write_wrapped.bind(this);
        const imports = {
            'wasi_snapshot_preview1': {
                fd_write: fd_write_wrapped
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
        
        const memory = this.inst!.exports.memory as any as WebAssembly.Memory;
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
            console.log(decodedString);
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

function initializeWebAssemblyFunction(): any {
    const WebAssemblyFunction = (WebAssembly as any).Function
    if (typeof WebAssemblyFunction !== 'function') {
        throw new Error(
            'WebAssembly.Function is not available in this runtime.' +
            ' If using a recent version of Node add the flags --wasm-staging --experimental-wasm-stack-switching'
        )
    }
    return WebAssemblyFunction
}
export function constructWebAssemblyImportFunctionMap(mod: WebAssembly.Module): WebAssemblyImportFunctions {
    const newImports: WebAssemblyImportFunctions = {};

    for (let imp of WebAssembly.Module.imports(mod)) {
        switch (imp.kind) {
          case "table":
            //value = new WebAssembly.Table(imp.type);
            //jspiDebug("table value: ", value);
            break;
          case "memory":
            //value = new WebAssembly.Memory(imp.type);
            //jspiDebug("memory value: ", value);
            break;
          case "global":
            //value = new WebAssembly.Global(imp.type, undefined);
            //jspiDebug("global value: ", value);
            break;
          case "function":
            jspiDebug("funcion imp value: ", imp);
            let wfmodule = imp.module;
            let wffuncname = imp.name;
            // @ts-ignore
            let wffunc = imp.type;
            let newImportNs = newImports[wfmodule];
            jspiDebug("newImportNs: ", newImportNs);
            if (!newImportNs) {
                newImportNs = {};
                jspiDebug("!newImportNs: ", newImportNs);
                Object.defineProperty(newImports, wfmodule, {
                    enumerable: true,
                    value: newImportNs,
                });
            }
            jspiDebug("newImports1: ", newImports);
            Object.defineProperty(newImportNs, wffuncname, {
                enumerable: true,
                value: wffunc
            });
            jspiDebug("newImports2: ", newImports);
            jspiDebug("function module name: ", wfmodule);
            jspiDebug("function name: ", wffuncname);
            jspiDebug("function : ", wffunc);
            break;
        }
    }
    return newImports
}

export function promisifyWebAssemblyImports<T extends WebAssembly.Imports, U extends Array<keyof T>>(imports: T, importFuncs: WebAssemblyImportFunctions): WebAssembly.Imports {
    return promisifyWebAssemblyImportsWithWrapFn(imports, (importValue, importNs, importFuncName) => {
        let isNotFunction = typeof importValue !== 'function'
        jspiDebug("promisifyWebAssemblyImports name: ", importFuncName);
        jspiDebug("promisifyWebAssemblyImports importNs: ", importNs);
        jspiDebug("promisifyWebAssemblyImports importFuncs: ", importFuncs);
        const wsFunc = importFuncs[importNs][importFuncName];
        if (wsFunc) {
            return isNotFunction ? importValue : promisifyImportFunctionWithTypeReflection(importValue as any, wsFunc)
        } else {
            return undefined;
        }
    }) as PromisifiedExports<T, U>
}

export function promisifyWebAssemblyImportsWithWrapFn(imports: WebAssembly.Imports, wrapFn: (value: WebAssembly.ImportValue, importNs: string, key: string) => WebAssembly.ImportValue|undefined): WebAssembly.Imports {
    const newImports = {};
    Object.keys(imports).forEach(ns => {
        const importNs = imports[ns];
        const newImportNs = {};
        Object.defineProperty(newImports, ns, {
            enumerable: true,
            value: newImportNs
        });
        Object.keys(importNs).forEach(name => {
            const importValue = importNs[name]
            const wrapFnValue = wrapFn(importValue, ns, name);
            if (wrapFnValue) {
                Object.defineProperty(newImportNs, name, {
                    enumerable: true,
                    value: wrapFnValue,
                })
            }
        })
    })
    return newImports
}

export function promisifyImportFunctionWithTypeReflection<T extends (...args: any[]) => any>(
    func: T,
    wsFunc: WebAssemblyFunction,
): (...args: [object, ...Parameters<T>]) => ReturnType<T> {
    const parameterTypes = wsFunc.parameters;
    const returnTypes = wsFunc.results;
    return promisifyImportFunction(
        func,
        parameterTypes,
        returnTypes,
    );
}

export function promisifyImportFunction<T extends (...args: any[]) => any>(
    func: T,
    parameterTypes: WebAssembly.ValueType[],
    returnTypes: WebAssembly.ValueType[]
): (...args: [object, ...Parameters<T>]) => ReturnType<T> {
    const WebAssemblyFunction = initializeWebAssemblyFunction()
    if (typeof func !== 'function') {
        throw new TypeError('Only supported for Function')
    }
    let needsAddingSuspendingExternRef = true;
    if (parameterTypes.length>0) {
        if (parameterTypes[0] == 'externref') {
            needsAddingSuspendingExternRef=false;
        }
    }
    const parameters = parameterTypes.slice(0)
    if (needsAddingSuspendingExternRef) {
        parameters.unshift('externref')
    }
    return new WebAssemblyFunction(
        { parameters, results: returnTypes },
        func,
        { suspending: 'first' }
    )
}

export function promisifyExportFunction<T extends Function = any>(
    func: Function
): T {
    const WebAssemblyFunction = initializeWebAssemblyFunction()
    if (typeof func !== 'function') {
        throw new TypeError('Only supported for Function')
    }
        const wfparams = WebAssemblyFunction.type(func).parameters;
        const wfresults = WebAssemblyFunction.type(func).results;
        try {
            return new WebAssemblyFunction(
                { parameters: [...wfparams.slice(1)], results: ['externref'] },
                func,
                { promising: 'first' }
            )
        } catch (err: any) {
            return new WebAssemblyFunction(
                { parameters: wfparams, results: wfresults },
                func,
                { promising: 'none' }
            )
        }
}

export function promisifyWebAssemblyExportsWithWrapFn(exports: WebAssembly.Exports, wrapFn: (value: WebAssembly.ExportValue, key: string) => WebAssembly.ExportValue): WebAssembly.Exports {
    const newExports = {};
    Object.keys(exports).forEach(name => {
        const exportValue = exports[name]
        Object.defineProperty(newExports, name, {
            enumerable: true,
            value: wrapFn(exportValue, name)
        })
    })
    return newExports
}

export function promisifyWebAssemblyExports<T extends WebAssembly.Exports, U extends Array<keyof T>>(exports: T): PromisifiedExports<T, U> {
    return promisifyWebAssemblyExportsWithWrapFn(exports, (exportValue, name) => {
        let isNotFunction = typeof exportValue !== 'function'
        return isNotFunction ? exportValue : promisifyExportFunction(exportValue as any)
    }) as PromisifiedExports<T, U>
}

export type CallableFunction = (...args: any[]) => any
export type AsyncCallableFunction<T> = T extends CallableFunction ? (...args: Parameters<T>) => Promise<ReturnType<T>> : T

export type PromisifiedExports<T, U> = T extends Record<string, any>
    ? {
        [P in keyof T]: T[P] extends CallableFunction
        ? U extends Array<keyof T>
        ? P extends U[number]
        ? AsyncCallableFunction<T[P]>
        : T[P]
        : AsyncCallableFunction<T[P]>
        : T[P]
    }
    : T