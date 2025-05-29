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

import { debugMessage, WasmLoader } from "./loader/generic.js";
import { HttpLoader } from "./loader/http.js";
import { LocalLoader } from "./loader/local.js";
import { MetaLoader } from "./loader/meta.js";
import { OciLoader } from "./loader/oci.js";
import { WatLoader } from "./loader/wat.js";


export async function getWasmLoader(resourcePath: string, fileSystemUrl?: string): Promise<{ loader: WasmLoader; relativePath: string; }> {
    const partsArray = resourcePath.split("/");
    const firstPart = partsArray[1];
    const relPath = resourcePath.replace(`/${firstPart}`, "");
    let inst: WasmLoader;
    debugMessage("getWasmLoader: firstPart: ", firstPart);
    debugMessage("getWasmLoader: relPath: ", relPath);

    if (firstPart == "meta") {
        inst = new MetaLoader();
    } else if (firstPart == "http") {
        inst = new HttpLoader();
    } else if (firstPart == "https") {
        inst = new HttpLoader(true);
    } else if (firstPart == "local") {
        inst = new LocalLoader();
    } else if (firstPart == "oci") {
        inst = new OciLoader();
    } else {
        inst = new WatLoader();
    }
    return { loader: inst, relativePath: relPath };
}


export async function instantiateWasmModule(resourcePath: string, fileSystemUrl?: string) {
	const wldr = await getWasmLoader(resourcePath, fileSystemUrl);
	const relativePath = wldr.relativePath;
	const ldr = wldr.loader;
	return await ldr.instantiate(relativePath);
}
