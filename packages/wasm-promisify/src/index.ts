/**
 * Copyright 2025 NetApp Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { jspiDebug } from "./util.js";
import { PromisifiedWasmGenerator } from "./wasmgen.js";


/**
 * Detects if Newer JavaScript Promise Integration is enabed in runtime
 * @returns true if jspi/experimental-wasm-stack-switching is enabled in runtime node/deno
 */
export function isJspiEnabled() {
    const WebAssemblySuspending = (WebAssembly as any).Suspending
    if (typeof WebAssemblySuspending === 'function') {
        return true;
    }
    return false;
}

export function proxyGet(obj: any, transformFunc: any) {
    return new Proxy(obj, {
        get: (obj, name) => transformFunc(obj[name]),
    });
}

/**
 * 
 * @param mainModule Module to wrap
 * @param importObject WebAssembly.Import for instance
 * @returns Wrapped WebAssembly.Instance with async imports and exports
 * 
 *  Note: this works currently only if experimental-wasm-jspi is enabled 
 *      e.g. with 
 *      node --experimental-wasm-jspi
 *      or
 *      deno -v8-flags=--experimental-wasm-jspi
 * 
 */
export async function instantiateJSPIwrapped(mainModule: WebAssembly.Module, importObject: WebAssembly.Imports): Promise<WebAssembly.Instance>{
    jspiDebug(`Running module through instantiateJSPIwrapped`);
    const jspiH = new JspiInstanceHolder();
    const jspiifiedInstance = await WebAssembly.instantiate(mainModule, jspiH.wrapImports(importObject));
    jspiH.init(jspiifiedInstance, importObject);
    return jspiifiedInstance;
}

const WRAPPED_EXPORTS = new WeakMap();
export class JspiInstanceHolder {
    exports: any;
    init(instance: any, imports: any) {
        const { exports } = instance;
        let memory = exports.memory;
        if (memory == undefined) {
            if (imports !== undefined) {
                if (imports.env !== undefined) {
                    if (imports.env.memory !== undefined) {
                        memory = imports.env.memory;
                    }
                }
            }
        }
        this.exports = this.wrapExports(exports);
        Object.setPrototypeOf(instance, WebAssemblyJspiInstance.prototype);
    }
    wrapImportFn(fn: any) {
        jspiDebug("instantiateJSPIwrapped.wrapImportFn: ", fn);
        // @ts-ignore
        return new WebAssembly.Suspending(fn);
    }
    wrapModuleImports(module: any) {
        return proxyGet(module, (value: any) => {
            if (typeof value === "function") {
                return this.wrapImportFn(value);
            }
            return value;
        });
    }
    wrapImports(imports: WebAssembly.Imports) {
        if (imports === undefined) return;
        return proxyGet(imports, (moduleImports = Object.create(null)) => this.wrapModuleImports(moduleImports));
    }
    wrapExports(exports: any) {
        const newExports = Object.create(null);
        for (const exportName in exports) {
            let value = exports[exportName];
            if (isFunction(value)) {
                value = this.wrapExportFn(value);
            }
            Object.defineProperty(newExports, exportName, {
                enumerable: true,
                value,
            });
        }
        WRAPPED_EXPORTS.set(exports, newExports);
        return newExports;
    }
    wrapExportFn(fn: any) {
        jspiDebug("instantiateJSPIwrapped.wrapExportFn: ", fn);
        // @ts-ignore
        return WebAssembly.promising(fn);
    }
}
export class WebAssemblyJspiInstance extends WebAssembly.Instance {

    jspi: JspiInstanceHolder
    constructor(module: WebAssembly.Module, imports: WebAssembly.Imports) {
        const jspiH = new JspiInstanceHolder();
        super(module, jspiH.wrapImports(imports));
        this.jspi = jspiH;
        jspiH.init(this, imports);
    }

    get exports() {
        return WRAPPED_EXPORTS.get(super.exports);
    }

    get originalExports() {
        return super.exports;
    }
}



export function isFunction(value: any) {
    const WebAssemblyFunction = (WebAssembly as any).Function;
    if (typeof value === "function") {
        return true;
    } else if (value instanceof Function) {
        return true;
    } else if (WebAssemblyFunction !== undefined) {
        if (value instanceof WebAssemblyFunction) {
            return true;
        }
    }
    return false;
}

/**
 * Detects if Older JavaScript Promise Integration / Stack-switching is enabed in runtime
 * @returns true if jspi/experimental-wasm-stack-switching is enabled in runtime node/deno
 */
export function isStackSwitchingEnabled(): boolean {
    // type reflection
    const WebAssemblyFunction = (WebAssembly as any).Function
    // older form of jspi/stack-switching
    const WebAssemblySuspender = (WebAssembly as any).Suspender
    if (WebAssemblyFunction !== undefined && WebAssemblySuspender !== undefined) {
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
 *  with JSPI (JavaScript Promise Integration) older Stack Switching variant - https://v8.dev/blog/jspi
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
            ' If using a recent version of Node or Deno add the flags --experimental-wasm-jspi or --experimental-wasm-stack-switching'
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