import { FilesystemsMountNamespace as fsm } from "@wasmin/wasi-snapshot-preview2/async";
type WasiExtFilesystemsMount = fsm.WasiExtFilesystemsMount;
type FsMountErrCode = fsm.ErrorCode;
type MountArgs = fsm.MountArgs;

import { WasiEnv, WasiOptions, wasiEnvFromWasiOptions } from "../../wasi.js";
import { wasiPreview2Debug } from "../../wasiDebug.js";
import { getDirectoryHandleByURL, showDirectoryPicker } from "@wasmin/fs-js";

export class WasiExtFilesystemsMountAsyncHost implements WasiExtFilesystemsMount {
    constructor(wasiOptions: WasiOptions) {
        const wasiEnv = wasiEnvFromWasiOptions(wasiOptions);
        this._wasiEnv = wasiEnv;
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
    private _wasiEnv: WasiEnv;
    get wasiEnv() {
        return this._wasiEnv;
    }
    get openFiles() {
        return this.wasiEnv.openFiles;
    }

    async mount(desc: fsm.Descriptor, args: MountArgs): Promise<void> {
        let errorToThrow: FsMountErrCode | undefined = undefined;
        try {
            let sourceMountURL = args.sourceUrl;
            let destMountPath = args.destinationPath;
            // @ts-ignore
            let fileSystemHandle: Handle = {};
            if (sourceMountURL.startsWith("local")) {
                // @ts-ignore
                if (globalThis.showDirectoryPicker) {
                    fileSystemHandle = await showDirectoryPicker();
                } else {
                    errorToThrow = "invalid";
                }
            } else {
                fileSystemHandle = await getDirectoryHandleByURL(sourceMountURL);
            }
            const destSubDir = fileSystemHandle.name;
            this._wasiEnv.openFiles.mountHandleOnPath(fileSystemHandle, destMountPath, destSubDir);
        } catch(err: any) {
            wasiPreview2Debug("WasiExtFilesystemsMountAsyncHost mount err: ", err);
        }
        if (errorToThrow !== undefined) {
            throw errorToThrow;
        }
    }

}
