//
// This file is borrowed from another repo (https://github.com/GoogleChromeLabs/asyncify)
// for testing with ts-jest (not supported external module only esm)

/**
 * Copyright 2019 Google Inc. All Rights Reserved.
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
 */

// Put `__asyncify_data` somewhere at the start.
// This address is pretty hand-wavy and we might want to make it configurable in future.
// See https://github.com/WebAssembly/binaryen/blob/6371cf63687c3f638b599e086ca668c04a26cbbb/src/passes/Asyncify.cpp#L106-L113
// for structure details.
const DATA_ADDR = 16;
// Place actual data right after the descriptor (which is 2 * sizeof(i32) = 8 bytes).
const DATA_START = DATA_ADDR + 8;
// End data at 1024 bytes. This is where the unused area by Clang ends and real stack / data begins.
// Because this might differ between languages and parameters passed to wasm-ld, ideally we would
// use `__stack_pointer` here, but, sadly, it's not exposed via exports yet.
//const DATA_END = 1024;
//const DATA_END = 2048;
//const DATA_END = 4096;
//const DATA_END = 8192;
//const DATA_END = 16384;
const DATA_END = 65536;
//const DATA_END = 1048576;

const ASYNCIFY_DEBUG = false;

function asyncifyDebug(msg?: any, ...optionalParams: any[]): void {
    if (ASYNCIFY_DEBUG) {
        console.debug(msg, optionalParams);
    }
}

const WRAPPED_EXPORTS = new WeakMap();

const State = {
    None: 0,
    Unwinding: 1,
    Rewinding: 2,
};

export function isPromise(obj: any) {
    return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}

function proxyGet(obj: any, transform: any) {
    return new Proxy(obj, {
        get: (obj, name) => transform(obj[name]),
    });
}

export class Asyncify {
    constructor() {
        this.value = undefined;
        this.exports = null;
    }

    private value: any;
    private exports: any;

    getState() {
        return this.exports.asyncify_get_state();
    }

    assertNoneState() {
        const state = this.getState();
        if (state !== State.None) {
            throw new Error(`Invalid async state ${state}, expected 0.`);
        }
    }

    wrapImportFn(fn: any) {
        return (...args: any[]) => {
            if (this.getState() === State.Rewinding) {
                this.exports.asyncify_stop_rewind();
                return this.value;
            }
            this.assertNoneState();
            const value = fn(...args);
            if (!isPromise(value)) {
                return value;
            }
            this.exports.asyncify_start_unwind(DATA_ADDR);
            this.value = value;
        };
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

    wrapExportFn(fn: any) {
        let newExport = WRAPPED_EXPORTS.get(fn);

        if (newExport !== undefined) {
            return newExport;
        }

        newExport = async (...args: any[]) => {
            this.assertNoneState();

            let result = fn(...args);
            while (this.getState() === State.Unwinding) {
                this.exports.asyncify_stop_unwind();
                this.value = await this.value;
                this.assertNoneState();
                this.exports.asyncify_start_rewind(DATA_ADDR);
                try {
                    result = fn();
                } catch (err: any) {
                    asyncifyDebug("asyncify error: ", fn, err);
                    throw err;
                }
            }

            this.assertNoneState();

            return result;
        };

        WRAPPED_EXPORTS.set(fn, newExport);

        return newExport;
    }

    wrapExports(exports: any) {
        const newExports = Object.create(null);

        for (const exportName in exports) {
            let value = exports[exportName];
            if (typeof value === "function" && !exportName.startsWith("asyncify_")) {
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

    init(instance: any, imports: any) {
        const { exports } = instance;

        const memory = exports.memory || (imports.env && imports.env.memory);

        //new Int32Array(memory.buffer, DATA_ADDR).set([DATA_START, DATA_END]);
        const data_end = exports.__data_end || DATA_END;
        asyncifyDebug(`asyncify: data_end: ${data_end}`);
        new Int32Array(memory.buffer, DATA_ADDR).set([DATA_START, data_end]);

        this.exports = this.wrapExports(exports);

        Object.setPrototypeOf(instance, Instance.prototype);
    }
}

export class Instance extends WebAssembly.Instance {
    constructor(module: WebAssembly.Module, imports: WebAssembly.Imports) {
        const state = new Asyncify();
        super(module, state.wrapImports(imports));
        state.init(this, imports);
    }

    get exports() {
        return WRAPPED_EXPORTS.get(super.exports);
    }

    get originalExports() {
        return super.exports;
    }
}

Object.defineProperty(Instance.prototype, "exports", { enumerable: true });

export async function instantiate(source: WebAssembly.Module, imports: WebAssembly.Imports) {
    const state = new Asyncify();
    const result = await WebAssembly.instantiate(source, state.wrapImports(imports));
    state.init(result, imports);
    return result;
}

export async function instantiateStreaming(source: Response | Promise<Response>, imports: WebAssembly.Imports) {
    const state = new Asyncify();
    const result = await WebAssembly.instantiateStreaming(source, state.wrapImports(imports));
    state.init(result.instance, imports);
    return result;
}
