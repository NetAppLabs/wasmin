

// @ts-ignore
export type WebAssemblyFunction = WebAssembly.Function;

export type WebAssemblyImportFunctions = Record<string, Record<string, WebAssemblyFunction>>;

export let JSPI_DEBUG = false;
export function jspiDebug(message?: any, ...optionalParams: any[]) {
    if (JSPI_DEBUG) {
        console.debug(message, optionalParams);
    }
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
            const hasProperty = (newImportNs[wffuncname] !== undefined);
            if (!hasProperty) {
              jspiDebug("newImports1 pre: ", newImports);
              Object.defineProperty(newImportNs, wffuncname, {
                  enumerable: true,
                  value: wffunc
              });
              jspiDebug("newImports2 post: ", newImports);
              jspiDebug("function module name: ", wfmodule);
              jspiDebug("function name: ", wffuncname);
              jspiDebug("function : ", wffunc);
            } else {
              jspiDebug("function already exists on object : ", wffunc);
            }
            break;
        }
    }
    return newImports
}
