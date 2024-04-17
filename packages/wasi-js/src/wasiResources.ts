import { isObject } from "typeson";
import { HandleCallType, HandleWasmComponentImportFunc } from "./desyncify.js";
import { Channel } from "./vendored/sync-message/index.js";
import { GetProxyFunctionToCall, createComponentImportOrResourceProxy, getProxyFunctionToCall } from "./wasmWorker.js";
import { isArray, isSymbol } from "./workerUtils.js";
import { wasiResourceDebug } from "./wasiUtils.js";

export type StoreResourcesFunc = (importName: string, resourceId: number, resourceObject: Resource) => void;

export interface Resource {
    resource: number;
}

export type DisposeAsyncResourceFunc = (res: Resource) => Promise<void>;

export function createProxyForResources(
    resObjOrAny: any,
    importName: string,
    channel: Channel,
    handleComponentImportFunc: HandleWasmComponentImportFunc,
) {
    let getResourceObjFunc = (resObjInner: Resource ) => {
        const resourceId = resObjInner.resource;
        if (resourceId !== undefined) {
            const identifier = getResourceIdentifier(importName, resourceId);
            const resProxyObj = createComponentImportOrResourceProxy("resource", identifier, channel, handleComponentImportFunc);
            return resProxyObj;
        }
        return undefined;
    }
    return handleResourceObject(resObjOrAny, getResourceObjFunc, true);
}


export class ResourceProxy implements Resource {
    constructor(resource: number, importName: string, typeName?: string) {
        this.resource = resource;
        this.importName = importName;
        this.typeName = typeName;
    }
    resource: number;
    typeName?: string;
    importName: string;
}

const disposeSym = Symbol.dispose;

export function createResourceProxy(
    functionName: string,
    callType: HandleCallType,
    importName: string,
    channel: Channel,
    handleComponentImportFunc: HandleWasmComponentImportFunc,
    getProxyFunctionToCall: GetProxyFunctionToCall,
) {
    const dummyTarget = new ResourceProxy(0, importName, functionName);
    const dummyProxy = new Proxy(dummyTarget, {
        get: (_target, name, _receiver) => {
            if (name == Symbol.hasInstance) {
                if (_target.resource !== undefined && _receiver.resource !== undefined) {
                    return ()=>{return true};
                }
            } else if (name == disposeSym) {
                wasiResourceDebug("returning symbol for dispose");
                const disposeFunc = () => { return; };
                return disposeFunc;
            } else if (name == "resource") {
                return 0;
            } else if (name == "prototype") {
                wasiResourceDebug("returning prototype for obj");
                return _receiver;
            } else {
                if (!isSymbol(name)) {
                    functionName = name as string;
                    const funcTarget = () => {};
                    const proxyFunc = new Proxy(funcTarget, {
                        get: (_target, name, _receiver) => {
                            wasiResourceDebug("get for proxyFunc");
                            return _receiver;
                        },
                        apply: (target, thisArg, argumentsList) => {
                          wasiResourceDebug("apply for proxyFunc");
                          //fn(prop, argumentsList);
                          callType = "resource";
                          const resource = argumentsList[0];
                          const resourceId = resource.resource;
                          const identifier = getResourceIdentifier(importName, resourceId);
                          const proxyFuncReal = getProxyFunctionToCall(
                                functionName,
                                callType,
                                identifier,
                                channel,
                                handleComponentImportFunc,
                          );
                          // removing 'this' from argumentList
                          const newArgumentsList = argumentsList.slice(1);
                          return Reflect.apply(proxyFuncReal, resource, newArgumentsList);
                        }
                    });
                    return proxyFunc;
                }
            }
            return undefined;
        },
    });
    return dummyProxy;
}

type HandleResourceObjCallBack = (resourceObjOrAny: any) => void|any;
type LookupResourceFunc = (importNamespace: string, resourceId: any) => Resource | undefined;

export function storeResourceObjects(importNamespace: string, resourceObjOrAny: any, storeFunc: StoreResourcesFunc){
    let storeResourceObjCallback = (resObj: Resource ) => {
        const resourceId = resObj.resource;
        if (resourceId !== undefined) {
            storeFunc(importNamespace, resourceId, resObj);
        }
    }
    handleResourceObject(resourceObjOrAny, storeResourceObjCallback, false);
}

export function containsResourceObjects(resObjOrAny: any) {
    if (isArray(resObjOrAny)) {
        const arr = resObjOrAny as any[];
        let containsResource = false;
        for (let i = 0; i < arr.length; i++) {
            let val = arr[i];
            if (containsResourceObjects(val)) {
                containsResource = true;
            }
        }
        return containsResource;
    } else if (isObject(resObjOrAny)) {
        if (resObjOrAny !== undefined ) {
            if (resObjOrAny.resource !== undefined) {
                return true;
            }
        } else {
            const keys = Object.keys(resObjOrAny);
            keys.forEach((key: string) => {
                let val = resObjOrAny[key];
                if (containsResourceObjects(val)) {
                    return true;
                }
            });
        }
    }
    return false;
}

export function handleResourceObject(resourceObjOrAny: any, handleCallback: HandleResourceObjCallBack, constructNewReturn: boolean){
    if (isArray(resourceObjOrAny)) {
        const arr = resourceObjOrAny as any[];
        let newArr: any[]|undefined = undefined;
        if (constructNewReturn) {
            newArr = [];
        }
        arr.forEach((val, index) => {
            if (containsResourceObjects(val)) {
                val = handleResourceObject(val, handleCallback, constructNewReturn);
            }
            if (constructNewReturn) {
                if (newArr) {
                    newArr[index] = val;
                }
            }
        });
        if (constructNewReturn) {
            return newArr;
        }
    } else if (isObject(resourceObjOrAny)) {
        if (resourceObjOrAny !== undefined ) {
            if (resourceObjOrAny.resource !== undefined) {
                const val: any = handleCallback(resourceObjOrAny);
                return val;
            }
        } else {
            const keys = Object.keys(resourceObjOrAny);
            let newKeys: any = undefined;
            if (constructNewReturn) {
                newKeys = {} as any;
            }
            keys.forEach((key: string) => {
                let val = resourceObjOrAny[key];
                if (containsResourceObjects(val)) {
                    val = handleResourceObject(val, handleCallback, constructNewReturn);
                }
                if (constructNewReturn) {
                    newKeys[key] = val;
                }
            });
            if (constructNewReturn) {
                return newKeys;
            }
        }
    } else {
        return resourceObjOrAny;
    }
}


export function getResourceIdentifier(importName: string, resourceId: number) {
    const importNameSplit = importName.split('/');
    // cutting off the subnamespace after /
    const importNamePrefix1 = importNameSplit[0];
    const importNamePrerefixSplit = importNamePrefix1.split(':');
    let importNamePrefix = importNamePrerefixSplit[0];
    /*if (importNamePrerefixSplit.length > 1) {
        importNamePrefix = `${importNamePrefix}:${importNamePrerefixSplit[1]}`
    }*/
    const identifier = `${importNamePrefix}:${resourceId}`;
    return identifier;
}


export function getResourceSerializableForProxyObjects(resourceObjOrAny: any){
    let getResourceObjFunc = (resObj: any ) => {
        const resourceId = resObj.resource;
        if (resourceId !== undefined) {
            return {resource: resourceId};
        }
        return undefined;
    }
    return handleResourceObject(resourceObjOrAny, getResourceObjFunc, true);
}

export function getResourceObjectForResourceProxy(resourceObjOrAny: any, importName: string, lookupResourceFunc: LookupResourceFunc): Resource| undefined{
    let getResourceObjFunc = (resObj: any ) => {
        const resourceId = resObj.resource;
        if (resourceId !== undefined) {
            const newResourceObj = lookupResourceFunc(importName,resourceId);
            return newResourceObj;
        }
    }
    return handleResourceObject(resourceObjOrAny, getResourceObjFunc, true);
}



