import { Asyncify, isPromise } from "./asyncify.js";

//@ts-ignore
//import { proxymise } from 'proxymise';
//const proxymise = require('proxymise');
//import makeSynchronous from 'make-synchronous';
//import { createSyncFn } from 'synckit'

const makeSynchronous = (fn: any) => {
    //return createSyncFn(fn);
    return fn;
};
//const makeSynchronous = proxymise;

export async function instantiateWithAsyncDetection(
    source: WebAssembly.Module,
    imports: WebAssembly.Imports
): Promise<{ instance: WebAssembly.Instance; isAsync: boolean }> {
    console.log("instantiateWithAsyncDetection");

    let isAsync = false;
    let syncResult = await WebAssembly.instantiate(source, imports);
    if (syncResult.exports["asyncify_get_state"] == null) {
        console.log("asyncify_get_state == null");
        isAsync = false;
    } else {
        console.log("asyncify_get_state != null");
        isAsync = true;
    }
    if (isAsync) {
        const state = new Asyncify();
        const asyncResult = await WebAssembly.instantiate(source, state.wrapImports(imports));
        state.init(asyncResult, imports);
        return { instance: asyncResult, isAsync: isAsync };
    } else {

        const memory = new WebAssembly.Memory({
            initial: 10,
            maximum: 100,
            shared: true,
          });

        syncResult = await WebAssembly.instantiate(source, wrapAllImportsSync(imports));
        return { instance: syncResult, isAsync: isAsync };
    }
}

function wrapAllImportsSync(imports: WebAssembly.Imports): WebAssembly.Imports {
    const updatedImports: Record<string, WebAssembly.ModuleImports> = {};
    for (const [key, value] of Object.entries(imports)) {
        updatedImports[key] = wrapImportsSync(value);
    }
    return updatedImports;
}

function wrapImportsSync(imp: WebAssembly.ModuleImports): WebAssembly.ModuleImports {
    const modProxy = new Proxy(imp, {
        get: (target, name, receiver) => {
            console.log("wrapImportsSync get:", name);

            const oldFunc = Reflect.get(target, name, receiver);
            const typeOfName = typeof name;
            const typeOfValue = typeof oldFunc;
            console.log(`wrapImportsSync typeOfName: ${typeOfName}`);
            console.log(`wrapImportsSync typeOfValue: ${typeOfValue}`);

            if (typeof name !== "string" || typeof oldFunc !== "function") {
                console.log("returning oldFunc directly");
                return oldFunc;
            }

            //const funcIsAsync = isPromise(value);
            const funcIsAsync = true;

            if (funcIsAsync) {
                console.log("before makeSynchronous");
                const newFunc = makeSynchronous(oldFunc);
                console.log("newFunc: ", name, newFunc);
                return newFunc;
            } else {
                console.log("returning oldFunc as it is sync");
                return oldFunc;
            }
        },
    });
    return modProxy;
}

function wrapImportFnSync(fn: any) {
    return (...args: any[]) => {
        const value = fn(...args);
        if (!isPromise(value)) {
            return value;
        } else {
            const newFn = (...args: any[]) => {
                fn(...args).then((val: any) => {
                    return val;
                });
            };
            return newFn;
        }
    };
}
