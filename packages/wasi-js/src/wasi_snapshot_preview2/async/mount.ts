import { FilesystemsMountNamespace as fsm } from "@netapplabs/wasi-snapshot-preview2/async";
type WasiExtFilesystemsMount = fsm.WasiExtFilesystemsMount;
type FsMountErrCode = fsm.ErrorCode;

import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { wasiPreview2Debug } from "../../wasiDebug.js";
import { getDirectoryHandleByURL, showDirectoryPicker } from "@netapplabs/fs-js";
import { FileSystemFileDescriptor } from "./filesystem.js";

export class WasiExtFilesystemsMountAsyncHost implements WasiExtFilesystemsMount {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
    }
    async mounts(desc: fsm.Descriptor): Promise<fsm.MountEntry[]> {
        if (this._wasiEnv.allowsMount) {
            if (desc instanceof FileSystemFileDescriptor) {
                let fDesc = desc as FileSystemFileDescriptor;
                let fd = fDesc._fd;
                let parentDir = this._wasiEnv.openFiles.getAsDir(fd);
                let parentHandle = parentDir._handle;
                return await this._wasiEnv.openFiles.listMountsUnderDirectoryHandle(parentHandle);
            } else {
                return await this._wasiEnv.openFiles.listMountsUnderAbsolutePath("/");
            }
        } else {
            throw 'access-denied';
        }
    }
    async getUnionDescriptor(sourceDescriptor: fsm.Descriptor): Promise<fsm.Descriptor> {
        throw new Error("Method not implemented.");
    }
    async getDescriptorByUrl(sourceUrl: string): Promise<fsm.Descriptor> {
        throw new Error("Method not implemented.");
    }
    async bind(parentDescriptor: fsm.Descriptor, subDescriptor: fsm.Descriptor, destinationPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async unmount(desc: fsm.Descriptor, destMountPath: string): Promise<void> {
        if (this._wasiEnv.allowsMount) {
            if (desc instanceof FileSystemFileDescriptor) {
                let fDesc = desc as FileSystemFileDescriptor;
                let fd = fDesc._fd;
                let parentDir = this._wasiEnv.openFiles.getAsDir(fd);
                let parentHandle = parentDir._handle;
                return await this._wasiEnv.openFiles.unMountFomRelativePath(parentHandle, destMountPath);
            } else {
                return await this._wasiEnv.openFiles.unMountFomAbsolutePath(destMountPath);
            }
        } else {
            throw 'access-denied';
        }
    }

    private _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

    async mount(desc: fsm.Descriptor, sourceMountURL: string, destMountPath: string): Promise<void> {
        if (this._wasiEnv.allowsMount) {
            let errorToThrow: FsMountErrCode | undefined = undefined;
            try {
                // @ts-ignore
                let fileSystemHandle: Handle = {};
                if (sourceMountURL.startsWith("local")) {
                    if ((globalThis as any).showDirectoryPicker) {
                        fileSystemHandle = await (globalThis as any).showDirectoryPicker();
                    } else {
                        errorToThrow = "invalid";
                    }
                } else {
                    fileSystemHandle = await getDirectoryHandleByURL(sourceMountURL);
                }
                let destSubDir = destMountPath;
                if (destSubDir == "") {
                    destSubDir = fileSystemHandle.name;
                }
                if (desc instanceof FileSystemFileDescriptor) {
                    let fDesc = desc as FileSystemFileDescriptor;
                    let fd = fDesc._fd;
                    let parentDir = this._wasiEnv.openFiles.getAsDir(fd);
                    let parentHandle = parentDir._handle;
                    await this._wasiEnv.openFiles.mountHandleUnderParentOnPath(parentHandle, fileSystemHandle, destSubDir);
                } else {
                    await this._wasiEnv.openFiles.mountHandleOnUnderRootOnPath(fileSystemHandle, destMountPath, destSubDir);
                }
            } catch(err: any) {
                wasiPreview2Debug("WasiExtFilesystemsMountAsyncHost mount err: ", err);
                errorToThrow = "invalid";
                throw errorToThrow;
            }
            if (errorToThrow !== undefined) {
                throw errorToThrow;
            }
        } else {
            throw 'access-denied';
        }
    }

}
