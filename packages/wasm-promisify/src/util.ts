import {initializeWebAssemblyFunction, isJspiEnabled, isStackSwitchingEnabled, PromisifiedExports} from "./index";

// TODO: look into inconsistency in funcref <-> anyfunc
//type WasmRefType = "funcref" | "externref";
type WasmRefType = "externref";
type WasmValueType = "i32" | "i64" | "f32" | "f64" | "v128" | WasmRefType;


export const TableMin = 1;
export const TableMax = 1024;

// @ts-ignore
export type WebAssemblyFunctionOptional = WebAssembly.Function;

// types provided here as they are not publicly available
export interface WebAssemblyFunction extends WebAssemblyFunctionOptional {
  parameters: WasmValueType[],
  results: WasmValueType[],
}

export type WebAssemblyTable = WebAssembly.Table;

// anyfunc renamed to funcref
//export type WebAssemblyTableKind = "anyfunc" | "externref";
export type WebAssemblyRefType = "funcref" | "externref"

export type WebAssemblyTableType = {
  element: WebAssemblyRefType,
  minimum: number,
  maximum: number,
}

export type WebAssemblyMemoryType = {
  index: "u32",
  minimum: number,
  maximum?: number,
  shared?: boolean,
}

export type WebAssemblyGlobalType = {
  value: WasmValueType,
  mutable?: boolean,
}

export type WebAssemblyImportExportType = WebAssemblyFunction | WebAssemblyTableType | WebAssemblyMemoryType | WebAssemblyGlobalType;
export type WebAssemblyImportExport = {
  kind: WebAssembly.ImportExportKind
  type: WebAssemblyImportExportType,
}

export type WebAssemblyImports = Record<string, Record<string, WebAssemblyImportExport>>;
export type WebAssemblyExports = Record<string, WebAssemblyImportExport>;

declare global {
  var JSPI_DEBUG: boolean;
}
globalThis.JSPI_DEBUG = false;

export function jspiDebug(message?: any, ...optionalParams: any[]) {
  if (globalThis.JSPI_DEBUG) {
    console.debug(message, optionalParams);
  }
}

export function isNodeorBunorDeno() {
  if (isDeno()) {
      return true;
  } else {
      return isNodeorBun();
  }
}

export function isNodeorBun() {
  return globalThis.process != null;
}

export function isNode() {
  if (isBun()) {
      return false;
  } else if (isDeno()) {
      return false;
  } else {
      // node.js/bun/deno have global process class
      return globalThis.process != null;
  }
}

export function isBun() {
  // only bun has global Bun
  try {
      // @ts-ignore
      return globalThis.Bun != null;
  } catch (e) {
      return false;
  }
}

export function isDeno() {
  // only deno has global Deno
  try {
      // @ts-ignore
      return globalThis.Deno != null;
  } catch (e) {
      return false;
  }
}


export async function writeFile(path: string, buf: Uint8Array) {
  if (isNode()) {
    let _fs = await import("node:fs/promises");
    return await _fs.writeFile(path, buf);
  }
}

export function constructWebAssemblyImportMap(mod: WebAssembly.Module): WebAssemblyImports {
  const newImports: WebAssemblyImports = {};
  for (let imp of WebAssembly.Module.imports(mod)) {
    let wfmodule = imp.module;
    let elemName = imp.name;
    let newImportNs = newImports[wfmodule];
    if (newImportNs == undefined) {
      newImportNs = {};
      newImports[wfmodule] = newImportNs;
    }
    let elem = parseImportExport(elemName, imp);
    if (elem !== undefined) {
      newImportNs[elemName] = elem;
    }
  }
  return newImports;
}


export function constructWebAssemblyExportMap(mod: WebAssembly.Module): WebAssemblyExports {
  const newExports: WebAssemblyExports = {};
  for (let imp of WebAssembly.Module.exports(mod)) {
    let elemName = imp.name;
    let elem = parseImportExport(elemName, imp);
    if (elem !== undefined) {
      newExports[elemName] = elem;
    }
  }
  return newExports
}


export function parseImportExport(elemName: string, imp: WebAssembly.ModuleImportDescriptor | WebAssembly.ModuleExportDescriptor) {
  let impAny = imp as any;
  switch (imp.kind) {
    case "table":
      let tableTypeAny = impAny.type as any;
      let tableType = tableTypeAny as WebAssemblyTableType;
      let tableRes = {
        kind: "table" as WebAssembly.ImportExportKind,
        type: tableType,
      }
      jspiDebug(`parseImportExport: table ${elemName}`, tableRes);
      return tableRes;
    case "memory":
      let memoryTypeAny = impAny.type as any;
      let memoryType = memoryTypeAny as WebAssemblyMemoryType;
      let memRes = {
        kind: "memory" as WebAssembly.ImportExportKind,
        type: memoryType,
      }
      jspiDebug(`parseImportExport: memory ${elemName}`, memRes);
      return memRes;
    case "global":
      let globalTypeAny = impAny.type as any;
      let globalType = globalTypeAny as WebAssemblyGlobalType;
      let glob = {
        kind: "global" as WebAssembly.ImportExportKind,
        type: globalType,
      }
      jspiDebug(`parseImportExport: glob ${elemName}`, glob);
      return glob;
    case "function":
      let funcTypeAny = impAny.type as any;
      let functionType = funcTypeAny as WebAssemblyFunction;
      let wffunc = {
        kind: "function" as WebAssembly.ImportExportKind,
        type: functionType,
      }
      jspiDebug(`parseImportExport: function ${elemName}`, wffunc);
      return wffunc;
  }
}


export function readCustomSections(mod: WebAssembly.Module): Record<string, string> {
  let sections: Record<string, string> = {}
  const nameSections = WebAssembly.Module.customSections(mod, "name");
  if (nameSections.length !== 0) {
    let nameSection = nameSections[0];
    let nameSectionArrray = new Uint8Array(nameSection);

    var byteIndex = 0;

    function readByte() {
      return nameSectionArrray[byteIndex++];
    }

    function readLEB() {
      const bytes = [];
      while (true) {
        const byte = readByte();
        bytes.push(byte & 0x7f);
        if (!(byte & 0x80)) {
          break;
        }
      }
      // Bytes are stored in little-endian - read them in significance order
      let val: number = 0;
      for (let i = 0; i < bytes.length; ++i) {
        const byt = bytes[bytes.length - i - 1];
        val <<= 7;
        val |= byt & 0x7f;
      }
      return val;
    }
    function readString() {
      let strLen = readLEB();
      let result = "";
      for (var i = 0; i < strLen; ++i) {
        result += String.fromCharCode(readByte());
      }
      return result;
    }

    // not processed
    let headerType1 = readLEB();
    jspiDebug("name custom section headerType1: ", headerType1);
    let headerType2 = readLEB();
    jspiDebug("name custom section headerType2: ", headerType2);

    let moduleNameString = readString();
    if (moduleNameString !== "" ) {
      // cleanup non friendly characters
      moduleNameString = moduleNameString.replace(/[^a-zA-Z0-9:._-]/g, '');
      // ensure string is not too long
      moduleNameString = moduleNameString.slice(0, 200);
      sections["name"] = moduleNameString;
      jspiDebug("found name: ", moduleNameString);
    }
    let nextSectionType = readLEB();
    if (nextSectionType == 1) {
      let nextSectionLength = readLEB();
      // function info
      let functionsCount = readLEB();
      for (var i = 0; i < functionsCount; ++i) {
        let functionIndex = readLEB();
        let functionName = readString();
        let funcMeta = {
          index: functionIndex,
          name: functionName,
        }
        jspiDebug("found function meta: ", funcMeta);
      }
    }
  }

  return sections;
}


export function promisifyImportObject(importObj: any, mod: WebAssembly.Module) {
  const newImports: Record<string, any> = {};
  Object.keys(importObj).forEach((importNamespace: string) => {
      const importNsObj = importObj[importNamespace];
      newImports[importNamespace] = importNsObj;
  })
  const wasmImportFuncs = constructWebAssemblyImportMap(mod);
  jspiDebug("newImports: ", newImports);
  jspiDebug("wasmImportFuncs: ", wasmImportFuncs);
  const wrappedImports = promisifyWebAssemblyImports(newImports, wasmImportFuncs);
  jspiDebug("wrappedImports: ", wrappedImports);
  return wrappedImports;
}

export function promisifyWebAssemblyImports<T extends WebAssembly.Imports, U extends Array<keyof T>>(imports: T, importFuncs: WebAssemblyImports): WebAssembly.Imports {
  return promisifyWebAssemblyImportsWithWrapFn(imports, (importValue, importNs, importFuncName) => {
      let isNotFunction = typeof importValue !== 'function'
      jspiDebug("promisifyWebAssemblyImports name: ", importFuncName);
      jspiDebug("promisifyWebAssemblyImports importNs: ", importNs);
      jspiDebug("promisifyWebAssemblyImports importFuncs: ", importFuncs);
      const importNsFuncs = importFuncs[importNs];
      if (importNsFuncs) {
          jspiDebug("promisifyWebAssemblyImports importNsFuncs: ", importNsFuncs);
          const wsImport = importNsFuncs[importFuncName];
          if (wsImport !== undefined) {
              if (wsImport.kind == "function") {
                  let wsFuncType = wsImport.type as WebAssemblyFunction;
                  if (wsFuncType) {
                      jspiDebug("promisifyWebAssemblyImports wsFunc: ", wsFuncType);
                      return isNotFunction ? importValue : promisifyImportFunctionWithTypeReflection(importFuncName, importValue as any, wsFuncType);
                  }
              } else {
                  return importValue;
              }
          }
      }
      return undefined;
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
  importFuncName: string,
  func: T,
  wsFunc: WebAssemblyFunction,
): (...args: [object, ...Parameters<T>]) => ReturnType<T> {
  const parameterTypes = wsFunc.parameters;
  const returnTypes = wsFunc.results;
  return promisifyImportFunction(
      importFuncName,
      func,
      parameterTypes,
      returnTypes,
  );
}

export function promisifyImportFunction<T extends (...args: any[]) => any>(
  importFuncName: string,
  func: T,
  parameterTypes: WebAssembly.ValueType[],
  returnTypes: WebAssembly.ValueType[]
): (...args: [object, ...Parameters<T>]) => ReturnType<T> {
  const WebAssemblyFunction = initializeWebAssemblyFunction()
  if (typeof func !== 'function') {
      throw new TypeError('Only supported for Function')
  }
  let needsAddingSuspendingExternRef = true;
  jspiDebug("promisifyImportFunction: importFuncName: ", importFuncName);
  jspiDebug("promisifyImportFunction: func: ", func);
  jspiDebug("promisifyImportFunction: parameterTypes: ", parameterTypes);
  jspiDebug("promisifyImportFunction: returnTypes: ", returnTypes);
  if (parameterTypes.length>0) {
      if (parameterTypes[0] == 'externref') {
          needsAddingSuspendingExternRef=false;
      }
  }
  const parameters = parameterTypes.slice(0)
  if (needsAddingSuspendingExternRef) {
      parameters.unshift('externref')
  }
  let funcAny = func as any;
  let isExportAsyncFunction = false;
  if (funcAny.isExportAsyncFunction) {
      isExportAsyncFunction = true;
      jspiDebug(`importFuncName ${importFuncName} is exported WebAssemblyFunction`, func);
  } else {
      jspiDebug(`importFuncName ${importFuncName} is notexported  WebAssemblyFunction`, func);
  }
  if (isExportAsyncFunction) {
      return func;
  } else {
      let wfFunc = new WebAssemblyFunction(
          { parameters, results: returnTypes },
          func,
          { suspending: 'first' }
      );
      return wfFunc;
  }
}

function useNewerWebAssemblyFunctionType() {
  if (isJspiEnabled()) {
    return true;
  } else if (isStackSwitchingEnabled()) {
    if (process) {
      if (process.versions) {
        if (process.versions.node) {
          let nodeVersion = process.versions.node;
          let sNodeVersionMajor = nodeVersion.split('.')[0];
          let nodeVersionMajor = Number(sNodeVersionMajor);
          if (nodeVersionMajor < 22){
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export function getWebAssemblyFunctionTypeForFunction(func: Function) {
  const WebAssemblyFunction = initializeWebAssemblyFunction()
  //if (isNode()) { // old behaviour for node 21
  //  const wffunc = WebAssemblyFunction.type(func);
  //  return wffunc;
  if (useNewerWebAssemblyFunctionType()) {
    let anyFunc = func as any;
    jspiDebug("getWebAssemblyFunctionTypeForFunction: anyFunc: ", anyFunc);
    let anyFuncType = anyFunc.type()
    jspiDebug("getWebAssemblyFunctionTypeForFunction: anyFuncType: ", anyFuncType);
    return anyFuncType as WebAssemblyFunction;
  } else {
    const wffunc = WebAssemblyFunction.type(func);
    return wffunc;
  }
}


export function promisifyExportFunction<T extends Function = any>(
  functionName: string,
  func: Function
): T {
  const WebAssemblyFunction = initializeWebAssemblyFunction()
  if (typeof func !== 'function') {
      throw new TypeError('Only supported for Function')
  } else {
      let wffunc = getWebAssemblyFunctionTypeForFunction(func);
      // @ts-ignore
      const wfparams = wffunc.parameters;
      // @ts-ignore
      const wfresults = wffunc.results;
      let firstParam = wfparams.at(0);
      let newParams = firstParam;
      let newResults = wfresults;
      if (firstParam == 'externref') {
          // Here we have an actual async-able function
          jspiDebug(`promisifyExportFunction promisifying async function ${functionName}`, func);

          // cut off the externref if firstParam is externref
          // @ts-ignore
          newParams = [...wfparams.slice(1)];
          // and rewrite the results to have only one 'externref'
          newResults = ['externref'];

          // Mark the function with a property so we can track it was exported from here
          Object.defineProperty(func, "isExportAsyncFunction", {
              enumerable: false,
              value: true,
          })
          let wfFunc = new WebAssemblyFunction(
              { parameters: newParams, results: newResults },
              func,
              { promising: 'first' }
          );
          Object.defineProperty(wfFunc, "isExportAsyncFunction", {
              enumerable: false,
              value: true,
          })
          return wfFunc;
      } else {
          // Here we have an regular sync function so we just pass it on without promising
          jspiDebug(`promisifyExportFunction encountered non-async function ${functionName}`, func);
          return new WebAssemblyFunction(
              { parameters: wfparams, results: wfresults },
              func,
              { promising: 'none' }
          )
      }
  }
}

export function promisifyWebAssemblyExportsWithWrapFn(exports: WebAssembly.Exports, wrapFn: (value: WebAssembly.ExportValue, key: string) => WebAssembly.ExportValue): WebAssembly.Exports {
  const newExports = {};
  Object.keys(exports).forEach(name => {
      const exportValue = exports[name];
      Object.defineProperty(newExports, name, {
          enumerable: true,
          value: wrapFn(exportValue, name)
      })
  })
  return newExports
}

export function promisifyWebAssemblyExports<T extends WebAssembly.Exports, U extends Array<keyof T>>(exports: T): PromisifiedExports<T, U> {
  return promisifyWebAssemblyExportsWithWrapFn(exports, (exportValue, name) => {
      let isFunction = isExportValueFunction(exportValue);
      if (isFunction) {
          jspiDebug(`promisifyWebAssemblyExportsWithWrapFn: isFunction name: ${name}`);
          return promisifyExportFunction(name, exportValue as any);
      } else {
          jspiDebug(`promisifyWebAssemblyExportsWithWrapFn: is Not Function name: ${name}`);
          return exportValue;
      }
  }) as PromisifiedExports<T, U>
}

export function isExportValueFunction(exportValue: WebAssembly.ExportValue) {
  let isFunctionInstance = exportValue instanceof Function;
  if (!isFunctionInstance) {
      let isFunction = typeof exportValue === 'function';
      isFunctionInstance = isFunction;
  }
  return isFunctionInstance;
}

function getObjectFunctionProperties(obj: any) {
  return Object
      .keys (obj);
}
