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

import { randomBytes } from "node:crypto";

export function isBun() {
    // only bun has global Bun
    try {
        // @ts-ignore
        return globalThis.Bun != null;
    } catch (e) {
        return false;
    }
}

export function isNode() {
    if (!isBun()) {
        return globalThis.process != null;
    } else {
        return false;
    }
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function CreateProcessId(): string {
    const id = CreateUniqueId();
    return id;
}

export function CreateHostId(): string {
    const id = CreateUniqueId();
    return id;
}

export function CreateUniqueId(): string {
    // potentially use ulid here:
    // https://github.com/ulid/javascript
    // https://github.com/ulid/spec
    const id = randomBytes(16).toString("hex");
    return id;
}
