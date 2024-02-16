import { isNode, jspiDebug, promisifyImportFunction } from "./util.js";
import { PromisifiedWasmGenerator } from "./wasmgen.js";

/**
 * Detects if JavaScript Promise Integration is enabed in runtime
 * @returns true if jspi/experimental-wasm-stack-switching is enabled in runtime node/deno
 */
export function isStackSwitchingEnabled(): boolean {
    const WebAssemblyFunction = (WebAssembly as any).Function
    if (typeof WebAssemblyFunction === 'function') {
        if (isNode()) {
            let hasStackSwitchingFlags = hasFlags('experimental-wasm-stack-switching');
            return hasStackSwitchingFlags;
        }
        return true;
    }
    return false;
}

function hasFlags(...flags: string[]) {
    //let nodeArgv = process.argv;
    let nodeExecArgv = process.execArgv;
    //let nodeArgv0 = process.argv0;
    return flags.every(flag =>
        nodeExecArgv.includes(/^-{1,2}/.test(flag) ? flag : '--' + flag)
    )
}

/**
 * 
 *  Takes in a WebAssembly.Module with desired importObject and re-wires all imports and exports to be async capable
 *  with JSPI (JavaScript Promise Integration) - https://v8.dev/blog/jspi
 * 
 *  Note: this works currently only if experimental-wasm-stack-switching is enabled 
 *      e.g. with --experimental-wasm-stack-switching on node
 *      and both --experimental-wasm-stack-switching and --experimental-wasm-type-reflection on deno
 * 
 *  Wasm is rewriteen with two extra modules:
 *  Wasm Adapter:
 *      Which is the returned object with rewritten exports.
 *  Original Wasm is kept intact.
 *  Wasm Proxy:
 *      An extra object with is to handle imports from original wasm and bass them back into wasm adapter to be handled
 *      and then passed onto the host in an async way.
 * 
 *                                                                                                            
 *                       +--------------------+          +--------------------+       +--------------------+
 *                       |                    |          |                    |       |                    |
 *                       |                    |          |                    |       |                    |
 *      export --->      |       wasm         |   ---->  |      original      | ----> |       wasm         |
 *                       |       adapter      |          |      wasm          |       |       proxy        |
 *                       |                    |          |                    |       |                    |
 *                       |                    |          |                    |       |                    |
 *                       +--------------------+          +--------------------+       +--------------------+
 *                                 ^                                                           |            
 *                                 |                         call indirect                     |            
 *                                 |------------------------------------------------------------            
 *                                                                                                          
 * 
 * Takes in a WebAssembly.Module with desired importObject which may have async functions
 * @param mainModule main module to instantiate
 * @param importObject populated importObject with optionally async functions
 * @returns a new adapted WebAssembly.Instance that is wired with the input main WebAssembly.Module and a proxy Module Instance in the background
 */
export async function instantiatePromisified(mainModule: WebAssembly.Module, importObject?: WebAssembly.Imports): Promise<WebAssembly.Instance>{

    const gen = new PromisifiedWasmGenerator(mainModule);
    let modName = gen.moduleName;
    if (modName !== undefined) {
        if (modName == "wit-component:shim" ) {
            jspiDebug(`Running module ${modName} through instantiateWithRewrittenAsyncExportsIndirect`);
            const instanceRes = await gen.instantiateWithRewrittenAsyncExportsIndirect(importObject);
            return instanceRes;
        } else if (modName == "wit-component:fixups" ) {
            jspiDebug(`Running module ${modName} through instantiateWithRewrittenAsyncImports`);
            const instanceProxy = await gen.instantiateWithRewrittenAsyncImports(importObject);
            return instanceProxy;
        }
    }

    jspiDebug(`Running module ${modName} through general instantiatePromisified`);
    let promisifiedInstance = await gen.instantiateWithAdapterAndWiredProxy(mainModule, importObject);

    return promisifiedInstance;
}


/**
 * Workaround function for WebAssembly Component model where wit-component:fixups is rewritten only by adding externref to all
 * imported functions
 * 
 * Takes in a WebAssembly.Module with desired importObject
 * @param mainModule main module to instantiate
 * @param importObject populated importObject with optionally async functions
 * @returns an adapted WebAssembly.Instance that is wired with the input main WebAssembly.Module and a proxy Module Instance in the background
 */
export async function instantiatePromisifiedOnlyImports(mainModule: WebAssembly.Module, importObject: WebAssembly.Imports): Promise<WebAssembly.Instance>{
    
    const gen = new PromisifiedWasmGenerator(mainModule);
    const instanceProxy = await gen.instantiateWithRewrittenAsyncImports(importObject);
    return instanceProxy;
}

/**
 * Workaround function for WebAssembly Component model where wit-component:shim is rewritten only by adding externref to all exported functions
 * which are then populated to table to be called by call_indirect
 * 
 * Takes in a WebAssembly.Module with desired importObject
 * @param mainModule main module to instantiate
 * @param importObject populated importObject with optionally async functions
 * @returns an adapted WebAssembly.Instance that is wired with the input main WebAssembly.Module and a proxy Module Instance in the background
 */
export async function instantiatePromisifiedExportFunctionsIndirect(mainModule: WebAssembly.Module, importObject: WebAssembly.Imports): Promise<WebAssembly.Instance>{
    
    const gen = new PromisifiedWasmGenerator(mainModule);
    const instanceRes = await gen.instantiateWithRewrittenAsyncExportsIndirect(importObject);
    return instanceRes;
    
}


export function initializeWebAssemblyFunction(): any {
    const WebAssemblyFunction = (WebAssembly as any).Function
    if (typeof WebAssemblyFunction !== 'function') {
        throw new Error(
            'WebAssembly.Function is not available in this runtime.' +
            ' If using a recent version of Node add the flags --wasm-staging --experimental-wasm-stack-switching'
        )
    }
    return WebAssemblyFunction
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