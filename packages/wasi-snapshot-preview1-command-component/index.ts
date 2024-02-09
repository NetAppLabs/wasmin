

import { instantiate as componentInstantiateWorker } from './component-worker/index.js';
import { instantiate as componentInstantiateJspi } from './component-jspi/index.js';
import { compileCore as compileCoreWorker } from './component-worker/index.js';
import { compileCore as compileCoreJspi } from './component-jspi/index.js';
import { instantiatePromisified, isStackSwitchingEnabled } from '@wasmin/wasm-promisify';


export type { ImportObject } from './component-worker/index.js';

export async function instantiate(
    compileCore: (path: string, imports: Record<string, any>) => Promise<WebAssembly.Module>,
    imports: any,
    instantiateCore?: (module: WebAssembly.Module, imports: Record<string, any>) => Promise<WebAssembly.Instance>
    ): Promise<Root>{
        let useJSPI = isStackSwitchingEnabled();
        //let useJSPI = false;
        if (useJSPI) {
          let instantiateCoreJSPI = instantiatePromisified;
          // @ts-ignore
          return await componentInstantiateJspi(compileCore, imports, instantiateCoreJSPI);
        } else {
          // @ts-ignore
          return await componentInstantiateWorker(compileCore, imports, instantiateCore);
      }
}

export async function compileCore(url: string) {
  if (isStackSwitchingEnabled()) {
    return await compileCoreJspi(url);
  } else {
    return await compileCoreWorker(url);
  }
}

export interface WasiCliRun {
    run(): Promise<void>;
}

export interface Root {
  'wasi:cli/run': WasiCliRun,
  run: WasiCliRun,
}