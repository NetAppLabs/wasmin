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

import { getHostsFsHandle, getProcFsHandle } from "./procfs.js";
import { HostManagerInstance } from "./host.js";

import { startShell, getSecretStore } from "@wasmin/shell";
import { getOriginPrivateDirectory, memory, NFileSystemDirectoryHandle } from "@netapplabs/fs-js";
import { node } from "@netapplabs/node-fs-js";
import { FileSystemDirectoryHandle } from "@netapplabs/fs-js";
import { isBun } from "./util.js";

const USE_MEMORY = true;

async function getRootFS(): Promise<FileSystemDirectoryHandle> {
    // if environment variable NODE_ROOT_DIR is set it will use it as root path
    // else current directory
    let nodePath = process.env.NODE_ROOT_DIR;
    if (!nodePath || nodePath == "") {
        nodePath = process.cwd();
    }
    let rootfs: FileSystemDirectoryHandle;
    if (USE_MEMORY) {
        rootfs = await getOriginPrivateDirectory(memory, nodePath);
    } else if (isBun()) {
        const bunfs = await import("@wasmin/bun-fs-js");
        const bun = bunfs.bun;
        rootfs = await getOriginPrivateDirectory(bun, nodePath);
    } else {
        rootfs = await getOriginPrivateDirectory(node, nodePath);
    }
    if (rootfs instanceof NFileSystemDirectoryHandle) {
        const secretStore = getSecretStore();
        rootfs.secretStore = secretStore;
        const procfs = await getProcFsHandle();
        rootfs.mountHandle(procfs);
        const hostsfs = await getHostsFsHandle();
        rootfs.mountHandle(hostsfs);
    }
    return rootfs;
}

export async function startLocalShell() {
    const init_pwd = "/";
    const username = "user";
    const hostname = HostManagerInstance.self.name;
    const env = {
        RUST_BACKTRACE: "full",
        //RUST_LOG: "wasi=trace",
        PWD: init_pwd,
        TERM: "xterm-256color",
        COLORTERM: "truecolor",
        LC_CTYPE: "UTF-8",
        COMMAND_MODE: "unix2003",
        //FORCE_HYPERLINK: "true",
        FORCE_COLOR: "true",
        PROMPT_INDICATOR: ` ${username}@${hostname}> `,
    };
    await startShell(getRootFS, env);
}
