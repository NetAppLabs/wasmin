import { getDirectoryHandleByURL } from "@netapplabs/fs-js";
import { SystemError } from "./errors.js";
import { clamp_host, data_view, realloc_func, UTF8_DECODER, utf8_encode, UTF8_ENCODED_LEN } from "./intrinsics.js";
import { WasiEnv } from "./wasi.js";
import { unimplemented, translateErrorToErrorno } from "./wasiPreview1Utils.js";
import { ErrnoN } from "./wasi_snapshot_preview1/bindings.js";
import { showDirectoryPicker } from "@netapplabs/fs-js";
import { wasiPreview1Debug } from "./wasiDebug.js";

export function addWasiExperimentalFilesystemsToImports(
    importNs: string,
    imports: any,
    obj: WasiExperimentalFilesystems,
    get_export: (name: string) => WebAssembly.ExportValue
): void {
    if (!(importNs in imports)) imports[importNs] = {};
    //@ts-ignore
    imports[importNs]["fs_mount"] = async function (arg0, arg1, arg2, arg3, arg4, arg5) {
        const memory = get_export("memory") as WebAssembly.Memory;
        const ptr0 = arg0;
        const len0 = arg1;
        const ptr1 = arg2;
        const len1 = arg3;
        const ptr2 = arg4;
        const len2 = arg5;
        const ret = await obj.mount(
            UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr0, len0)),
            UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr1, len1)),
            UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr2, len2))
        );
        return clamp_host(ret, 0, 4294967295);
    };
    //@ts-ignore
    imports[importNs]["fs_umount"] = async function (arg0, arg1) {
        const memory = get_export("memory") as WebAssembly.Memory;
        const ptr0 = arg0;
        const len0 = arg1;
        const ret = await obj.umount(UTF8_DECODER.decode(new Uint8Array(memory.buffer, ptr0, len0)));
        return clamp_host(ret, 0, 4294967295);
    };
    //@ts-ignore
    imports[importNs]["fs_mounts"] = async function (arg0: number) {
        const memory = get_export("memory") as WebAssembly.Memory;
        const realloc = get_export("canonical_abi_realloc") as realloc_func;
        const ret = await obj.mounts();
        const vec5 = ret;
        const len5 = vec5.length;
        const result5 = await realloc(0, 0, 4, len5 * 24);
        for (let i = 0; i < vec5.length; i++) {
            const e = vec5[i];
            const base = result5 + i * 24;
            const { path: v0_0, source: v0_1, attributes: v0_2 } = e;
            const ptr1 = await utf8_encode(v0_0, realloc, memory);
            const len1 = UTF8_ENCODED_LEN;
            data_view(memory).setInt32(base + 4, len1, true);
            data_view(memory).setInt32(base + 0, ptr1, true);
            const ptr2 = await utf8_encode(v0_1, realloc, memory);
            const len2 = UTF8_ENCODED_LEN;
            data_view(memory).setInt32(base + 12, len2, true);
            data_view(memory).setInt32(base + 8, ptr2, true);
            const vec4 = v0_2;
            const len4 = vec4.length;
            const result4 = await realloc(0, 0, 4, len4 * 8);
            for (let i = 0; i < vec4.length; i++) {
                const e = vec4[i];
                const base = result4 + i * 8;
                const ptr3 = await utf8_encode(e, realloc, memory);
                const len3 = UTF8_ENCODED_LEN;
                data_view(memory).setInt32(base + 4, len3, true);
                data_view(memory).setInt32(base + 0, ptr3, true);
            }
            data_view(memory).setInt32(base + 20, len4, true);
            data_view(memory).setInt32(base + 16, result4, true);
        }
        data_view(memory).setInt32(arg0 + 4, len5, true);
        data_view(memory).setInt32(arg0 + 0, result5, true);
    };
}

// Info for each Mount
export interface MountInfo {
    // Path mounted on.
    path: string;
    // Filesystem identifier mounted.
    source: string;
    // attributes
    attributes: string[];
}

export interface WasiExperimentalFilesystems {
    //
    // Mount a filesystem from source URL on destination
    // @src source URL for filesystem
    // @dest destination path to mount on
    //
    mount(src: string, dest: string, subDest: string): Promise<number>;
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
    async mount(sourceMountURL: string, destMountPath: string, subDest: string): Promise<number> {
        try {
            wasiPreview1Debug(
                `[WasiExperimentalFilesystems:mount] sourceMountURL: ${sourceMountURL} , destMountPath: ${destMountPath}`
            );

            // @ts-ignore
            let fileSystemHandle: Handle = {};
            if (sourceMountURL.startsWith("local")) {
                if ((globalThis as any).showDirectoryPicker) {
                    fileSystemHandle = await (globalThis as any).showDirectoryPicker();
                } else {
                    return new Promise((_resolve, reject) => {
                        reject(ErrnoN.NOSYS);
                    });
                }
            } else {
                fileSystemHandle = await getDirectoryHandleByURL(sourceMountURL);
            }
            let destSubDir = subDest;
            if (destSubDir == "") {
                destSubDir = fileSystemHandle.name;
            }
            await this._wasiEnv.openFiles.mountHandleOnUnderRootOnPath(fileSystemHandle, destMountPath, destSubDir);
            return new Promise((resolve) => {
                resolve(ErrnoN.SUCCESS);
            });
        } catch (err: any) {
            wasiPreview1Debug("WasiExperimentalFilesystemsHost: error: ", err);
            return translateErrorToErrorno(err);
        }
    }
    async umount(dest: string): Promise<number> {
        wasiPreview1Debug(`[WasiExperimentalFilesystems:umount] dest: ${dest}`);
        try{
            await this._wasiEnv.openFiles.unMountFomAbsolutePath(dest);
            return ErrnoN.SUCCESS;
        } catch (err: any) {
            wasiPreview1Debug("WasiExperimentalFilesystemsHost: error: ", err);
            return ErrnoN.INVAL;
        }
    }
    async mounts(): Promise<MountInfo[]> {
        wasiPreview1Debug(`[WasiExperimentalFilesystems:mounts]`);
        return await this._wasiEnv.openFiles.listMountsUnderAbsolutePath("/");
    }
}

export function initializeWasiExperimentalFilesystemsToImports(
    imports: any,
    get_export: (name: string) => WebAssembly.ExportValue,
    wasiEnv: WasiEnv
) {
    const wHost = new WasiExperimentalFilesystemsHost(wasiEnv);

    let experimentalFileSystemsNs = "wasi_experimental_filesystems";
    addWasiExperimentalFilesystemsToImports(experimentalFileSystemsNs, imports, wHost, get_export);
    let wasiPreview1Ns = "wasi_snapshot_preview1";
    addWasiExperimentalFilesystemsToImports(wasiPreview1Ns, imports, wHost, get_export);

}
