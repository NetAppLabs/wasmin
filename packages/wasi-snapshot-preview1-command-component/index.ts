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



import { instantiate as componentInstantiateWorker } from './component-worker/index.js';
import { instantiate as componentInstantiateJspi } from './component-jspi/index.js';
import { compileCore as compileCoreWorker } from './component-worker/index.js';
import { compileCore as compileCoreJspi } from './component-jspi/index.js';
import { instantiatePromisified, isStackSwitchingEnabled, isJspiEnabled, instantiateJSPIwrapped } from '@netapplabs/wasm-promisify';

export type { ImportObject } from './component-worker/index.js';

export async function instantiate(
    compileCore: (path: string, imports: Record<string, any>) => Promise<WebAssembly.Module>,
    imports: any,
    instantiateCore?: (module: WebAssembly.Module, imports: Record<string, any>) => Promise<WebAssembly.Instance>
    ): Promise<Root>{
        let useJSPI = isJspiEnabled();
        let useStackSwitching = isStackSwitchingEnabled();

        //let useJSPI = false;
        if (useJSPI) {
            // @ts-ignore
            return await componentInstantiateJspi(compileCore, imports, instantiateJSPIwrapped);
        } else if (useStackSwitching) {
            // @ts-ignore
            return await componentInstantiateJspi(compileCore, imports, instantiatePromisified);  
        } else {
            // @ts-ignore
            return await componentInstantiateWorker(compileCore, imports, instantiateCore);
      }
}

export async function compileCore(url: string) {
  if (isJspiEnabled()) {
    return await compileCoreJspi(url);
  } else if (isStackSwitchingEnabled()) {
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