import { NotFoundError } from "../errors.js";
import { FileSystemHandle, FileSystemFileHandle, FileSystemDirectoryHandle } from "../FileSystemAccess.js";

declare let globalThis: any;
globalThis.FSJS_UTIL_DEBUG = false;

function utilDebug(message?: any, ...optionalParams: any[]) {
    if (globalThis.FSJS_UTIL_DEBUG) {
        console.debug(message, ...optionalParams);
    }
}

export function join(parentPath: string, childName: string, includeTrailingSlash = false): string {
    let path: string;
    if (parentPath == "") {
        // Assuming we are at root
        path = childName;
    } else {
        let relChildName = childName;
        let relParentPath = parentPath;
        if (parentPath.endsWith("/")) {
            relParentPath = parentPath.substring(0, parentPath.length - 1);
        }
        if (childName.startsWith("/")) {
            relChildName = childName.substring(1, childName.length);
        }
        path = relParentPath + "/" + relChildName;
    }
    if (includeTrailingSlash) {
        path = `${path}/`;
    }
    return path;
}

// Code Borrowed and adapted from https://transang.me/modern-fetch-and-how-to-get-buffer-output-from-aws-sdk-v3-getobjectcommand/
export const concatBuffers = (buffers: Uint8Array[]): Uint8Array => {
    const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of buffers) {
        result.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }
    return result;
};
export const streamToBuffer = (stream: ReadableStream): Promise<Uint8Array> =>
    new Promise<Uint8Array>((resolve, reject) => {
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];
        utilDebug("starting streamToBuffer");
        try {
            const getData = async (reader2: ReadableStreamDefaultReader<any>) => {
                utilDebug("in getData");
                reader2
                    .read()
                    .then(({ done, value }) => {
                        utilDebug("getData read then");
                        if (done) {
                            utilDebug("getData read then done");
                            const ret = concatBuffers(chunks) as Uint8Array;
                            resolve(ret);
                        } else {
                            utilDebug("getData read pushing chunk");
                            chunks.push(value!);
                            getData(reader2);
                        }
                    })
                    .catch((err: any) => {
                        console.error("getData catch err: ", err);
                        // Seems to be a special case with Safari as it throws the error:
                        // TypeError: read() called on a reader owned by no readable stream
                        // Workaround is to resolve Promise here:
                        const ret = concatBuffers(chunks) as Uint8Array;
                        resolve(ret);
                    })
                    .finally(function () {
                        utilDebug("getData finally");
                    });
            };
            getData(reader);
        } catch (err) {
            console.error("streamToBuffer catched error: ", err);
            reject(err);
        } finally {
            utilDebug("streamToBuffer finally");
            // safari (iOS and macOS) doesn't support .releaseReader()
            // https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader/releaseLock#browser_compatibility
            //
            // releaseLock seems to problematic , disabling it for now
            /*try {
        reader?.releaseLock();
      } catch (err) {
        utilDebug("streamToBuffer error releaseLock: ", err);
      }*/
        }
    });

export const streamToBufferNode = (stream: any): Promise<Uint8Array> =>
    new Promise<Uint8Array>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(concatBuffers(chunks)));
    });

/**
 * Replaces the expression in for ${secret.value} with value found as path in secretStore
 * */
export function substituteSecretValue(secretKey: string, secretStore: any): string {
    utilDebug(`substituteSecretValue: secretKey: ${secretKey}`);
    utilDebug("substituteSecretValue: secretStore: ", secretStore);
    if (secretKey.startsWith("${")) {
        const secretKeyPath = secretKey.replace("${", "").replace("}", "");
        utilDebug(`substituteSecretValue: secretKeyPath: ${secretKeyPath}`);
        const secretKeyReplaced = resolveObjectPath(secretKeyPath, secretStore);
        utilDebug("substituteSecretValue: secretKeyReplaced: ", secretKeyReplaced);
        return secretKeyReplaced;
    }
    return secretKey;
}

function resolveObjectPath(path: string | string[], obj: any, separator = "."): string {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export async function openFileHandle(
    parentHandle: FileSystemDirectoryHandle,
    subPath: string
): Promise<FileSystemFileHandle> {
    const h = await openHandle(parentHandle, subPath, true);
    return h as FileSystemFileHandle;
}

export async function openDirectoryHandle(
    parentHandle: FileSystemDirectoryHandle,
    subPath: string
): Promise<FileSystemDirectoryHandle> {
    const h = await openHandle(parentHandle, subPath, false);
    return h as FileSystemDirectoryHandle;
}

export async function openHandle(
    parentHandle: FileSystemDirectoryHandle,
    subPath: string,
    expectingFile: boolean
): Promise<FileSystemHandle> {
    utilDebug(`openHandle: subPath: "${subPath}"`);

    const paths = subPath.split("/");
    utilDebug("openHandle: paths:", paths);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let dirHandle: FileSystemDirectoryHandle = parentHandle;
    const pathLength = paths.length;
    for (let i = 0; i < pathLength; i++) {
        const pathPart = paths[i];
        utilDebug(`openHandle: pathPart ${pathPart}`);
        // first part fom split may be "" if subPath starts with /
        if (pathPart != "") {
            let is_last = false;
            if (i == pathLength - 1) {
                is_last = true;
            }
            if (is_last) {
                if (expectingFile) {
                    utilDebug(`openHandle: expectingFile: ${expectingFile} before getFileHandle pathPart: ${pathPart}`);
                    const fileHandle = await dirHandle.getFileHandle(pathPart);
                    return fileHandle;
                } else {
                    utilDebug(
                        `openHandle: expectingFile: ${expectingFile} before getDirectoryHandle pathPart: ${pathPart}`
                    );
                    const retDirHandle = await dirHandle.getDirectoryHandle(pathPart);
                    return retDirHandle;
                }
            } else {
                if (pathPart == ".") {
                    dirHandle = dirHandle;
                } else {
                    utilDebug(`openHandle: before getDirectoryHandle pathPart: ${pathPart}`);
                    dirHandle = await dirHandle.getDirectoryHandle(pathPart);
                }
            }
        }
    }
    throw new NotFoundError();
}
