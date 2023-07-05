import { startShell, getSecretStore } from "@wasm-env/shell";
import { getOriginPrivateDirectory, memory, NFileSystemDirectoryHandle } from "@wasm-env/fs-js";
import { node } from "@wasm-env/node-fs-js";
import { getHostsFsHandle, getProcFsHandle } from "./procfs";
import { HostManagerInstance } from "./host";
import { FileSystemDirectoryHandle } from "@wasm-env/fs-js";

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
    } else {
        rootfs = await getOriginPrivateDirectory(node, nodePath);
    }
    if (rootfs instanceof NFileSystemDirectoryHandle) {
        const secretStore = getSecretStore();
        rootfs.secretStore = secretStore;
        const procfs = await getProcFsHandle();
        rootfs.insertHandle(procfs);
        const hostsfs = await getHostsFsHandle();
        rootfs.insertHandle(hostsfs);
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
    await startShell(await getRootFS(), env);
}
