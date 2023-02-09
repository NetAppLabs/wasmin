
import { getDirectoryHandleByURL } from "@wasm-env/fs-js";
import { SystemError } from "./errors.js";
import { clamp_host, data_view, UTF8_DECODER, utf8_encode, UTF8_ENCODED_LEN } from "./intrinsics.js";
import { WasiEnv } from "./wasi.js";
import { wasiDebug, unimplemented, translateErrorToErrorno } from "./wasiUtils.js";
import { ErrnoN } from "./wasi_snapshot_preview1/bindings.js";

export function addWasiExperimentalFilesystemsToImports(
    imports: any,
    obj: WasiExperimentalFilesystems,
    get_export: (name: string) => WebAssembly.ExportValue
): void {
    if (!("wasi-experimental-filesystems" in imports)) imports["wasi-experimental-filesystems"] = {};
    //@ts-ignore
    imports["wasi-experimental-filesystems"]["mount"] = async function (arg0, arg1, arg2, arg3) {
        const memory = get_export("memory");
        const ptr0 = arg0;
        const len0 = arg1;
        const ptr1 = arg2;
        const len1 = arg3;
        const ret = await obj.mount(
            //@ts-ignore
            UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr0, len0)),
            //@ts-ignore
            UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr1, len1))
        );
        return clamp_host(ret, 0, 4294967295);
    };
    //@ts-ignore
    imports["wasi-experimental-filesystems"]["umount"] = async function (arg0, arg1) {
        const memory = get_export("memory");
        const ptr0 = arg0;
        const len0 = arg1;
        //@ts-ignore
        const ret = obj.umount(UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr0, len0)));
        //@ts-ignore
        return clamp_host(ret, 0, 4294967295);
    };
    //@ts-ignore
    imports["wasi-experimental-filesystems"]["mounts"] = async function (arg0) {
        const memory = get_export("memory");
        //@ts-ignore
        const realloc = get_export("canonical_abi_realloc");
        const ret = obj.mounts();
        const vec5 = ret;
        //@ts-ignore
        const len5 = vec5.length;
        //@ts-ignore
        const result5 = realloc(0, 0, 4, len5 * 24);
        //@ts-ignore
        for (let i = 0; i < vec5.length; i++) {
            //@ts-ignore
            const e = vec5[i];
            const base = result5 + i * 24;
            const { path: v0_0, fs: v0_1, attributes: v0_2 } = e;
            //@ts-ignore
            const ptr1 = utf8_encode(v0_0, realloc, memory);
            const len1 = UTF8_ENCODED_LEN;
            data_view(memory).setInt32(base + 4, len1, true);
            data_view(memory).setInt32(base + 0, ptr1, true);
            //@ts-ignore
            const ptr2 = utf8_encode(v0_1, realloc, memory);
            const len2 = UTF8_ENCODED_LEN;
            data_view(memory).setInt32(base + 12, len2, true);
            data_view(memory).setInt32(base + 8, ptr2, true);
            const vec4 = v0_2;
            const len4 = vec4.length;
            //@ts-ignore
            const result4 = realloc(0, 0, 4, len4 * 8);
            for (let i = 0; i < vec4.length; i++) {
                const e = vec4[i];
                const base = result4 + i * 8;
                //@ts-ignore
                const ptr3 = utf8_encode(e, realloc, memory);
                const len3 = UTF8_ENCODED_LEN;
                data_view(memory).setInt32(base + 4, len3, true);
                data_view(memory).setInt32(base + 0, ptr3, true);
            }
            data_view(memory).setInt32(base + 20, len4, true);
            data_view(memory).setInt32(base + 16, result4, true);
        }
        data_view(memory).setInt32(arg0 + 8, len5, true);
        data_view(memory).setInt32(arg0 + 0, result5, true);
    };
}


// Info for each Mount
export interface MountInfo {
    // Path mounted on.
    path: string;
    // Filesystem identifier mounted.
    fs: string;
    // attributes
    attributes: string[];
}

export interface WasiExperimentalFilesystems {
    //
    // Mount a filesystem from source URL on destination
    // @src source URL for filesystem
    // @dest destination path to mount on
    //
    mount(src: string, dest: string): Promise<number>;
    //
    // Unmount a filesystem that is mounted on destination
    // @dest destination path where mount resides to unmount
    //
    umount(dest: string): Promise<number>;
    //
    // Get list of current mounted filesystems
    // @return returns a list of mount-info
    //
    mounts(): Promise<MountInfo[]>;
}

class WasiExperimentalFilesystemsHost implements WasiExperimentalFilesystems {
    constructor(wasi: WasiEnv) {
        this._wasiEnv = wasi;
    }
    private _wasiEnv: WasiEnv;
    async mount(sourceMountURL: string, destMountPath: string): Promise<number> {
        try {
            wasiDebug(
                `[WasiExperimentalFilesystems:mount] sourceMountURL: ${sourceMountURL} , destMountPath: ${destMountPath}`
            );

            // @ts-ignore
            let fileSystemHandle: Handle = {};
            if (sourceMountURL.startsWith("local")) {
                // @ts-ignore
                if (globalThis.showDirectoryPicker) {
                    fileSystemHandle = await showDirectoryPicker();
                } else {
                    return new Promise((_resolve, reject) => {
                        reject(ErrnoN.NOSYS);
                    });
                }
            } else {
                fileSystemHandle = await getDirectoryHandleByURL(sourceMountURL);
            }

            const destSubDir = fileSystemHandle.name;
            this._wasiEnv.openFiles.mountHandleOnPath(fileSystemHandle, destMountPath, destSubDir);
            return new Promise((resolve) => {
                resolve(ErrnoN.SUCCESS);
            });
        } catch (err: any) {
            console.log("WasiExperimentalFilesystemsHost: error: ", err);
            return translateErrorToErrorno(err);
        }
    }
    async umount(dest: string): Promise<number> {
        wasiDebug(`[WasiExperimentalFilesystems:umount] dest: ${dest}`);
        unimplemented("umount");
        return 0;
    }
    async mounts(): Promise<MountInfo[]> {
        wasiDebug(`[WasiExperimentalFilesystems:mounts]`);
        unimplemented("mounts");
        throw new SystemError(ErrnoN.NOSYS);
        //const list = new MountInfo{path: "", fs: "", attributes=""};
        //return new MountInfo[0];
    }
}

export function initializeWasiExperimentalFilesystemsToImports(
    imports: any,
    get_export: (name: string) => WebAssembly.ExportValue,
    wasiEnv: WasiEnv
) {
    const wHost = new WasiExperimentalFilesystemsHost(wasiEnv);
    addWasiExperimentalFilesystemsToImports(imports, wHost, get_export);
}
