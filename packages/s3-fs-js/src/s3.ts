import {
    FileSystemHandlePermissionDescriptor,
    NFileSystemWritableFileStream,
    NotAllowedError,
    NotFoundError,
    Stat,
    Statable,
    TypeMismatchError,
} from "@wasmin/fs-js";
import { join, substituteSecretValue } from "@wasmin/fs-js";
import { DefaultSink, ImpleFileHandle, ImplFolderHandle } from "@wasmin/fs-js";
import {
    FileSystemWritableFileStream,
    FileSystemHandle,
    FileSystemDirectoryHandle,
    FileSystemFileHandle,
} from "@wasmin/fs-js";


import { parseUrl, urlToString } from "@wasmin/fs-js";


import * as AWS from "@aws-sdk/client-s3";

import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListBucketsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    ListObjectsV2Request,
    CreateBucketCommand,
    DeleteBucketCommand,
} from "@aws-sdk/client-s3";

const DefaultMaxKeys = 1000;
const DefaultCacheTTL = 1000;

declare global {
    var S3_DEBUG: boolean;
}
globalThis.S3_DEBUG = false;


function s3Debug(message?: any, ...optionalParams: any[]) {
    if (globalThis.S3_DEBUG) {
        console.debug(message, optionalParams);
    }
}

export class S3Sink extends DefaultSink<S3FileHandle> implements FileSystemWritableFileStream {
    constructor(fileHandle: S3FileHandle) {
        super(fileHandle);
        this.fileHandle = fileHandle;
        this.file = fileHandle.file;
        this.size = fileHandle.file.size;
        this.position = 0;
    }

    fileHandle: S3FileHandle;

    getWriter(): WritableStreamDefaultWriter<any> {
        const w = new WritableStreamDefaultWriter<any>(this);
        return w;
    }

    async abort() {
        await this.close();
    }

    async write(chunk: any) {
        s3Debug("write chunk:", chunk);
        const bucketName = this.fileHandle.config.bucketName;
        const s3client = this.fileHandle.config.getS3Client();

        const preFile = this.file;
        try {
            await this.genericWrite(chunk);
            const file = this.file;
            if (file) {
                const path = this.fileHandle.path;
                const body = await file.arrayBuffer();
                const abody = new Uint8Array(body);
                const params = {
                    Bucket: bucketName,
                    Key: path,
                    Body: abody,
                };
                const command = new PutObjectCommand(params);
                const _s3obj = await s3client.send(command);
            } else {
                throw new Error("Unexpected error, file is not set");
            }
        } catch (err: any) {
            this.file = preFile;
            throw err;
        }
    }

    async close() {
        if (this.fileHandle.deleted) throw new NotFoundError();
        if (this.file) {
            this.fileHandle.file = this.file;
        }
        this.file = undefined;
        this.position = this.size = 0;
    }
}

export interface S3File extends File {
    lastModified: number;
    name: string;
    path: string;
    webkitRelativePath: string;
    type: string;
    size: number;
    start: number | undefined;
    end: number | undefined;
    contentType: string | undefined;
}

//export class S3File extends File {
export class S3File {
    constructor(
        config: S3Config,
        path: string,
        fileName: string,
        fileBits: BlobPart[],
        size: number,
        lastModified: number,
        options?: FilePropertyBag
    ) {
        //super(fileBits, fileName, options)
        this.config = config;
        this.size = size;
        this.type = "File";
        this.webkitRelativePath = fileName;
        this.name = fileName;
        this.path = path;
        this.lastModified = lastModified;
    }
    config: S3Config;
    lastModified: number;
    name: string;
    path: string;
    webkitRelativePath: string;
    type: string;
    size: number;

    start: number | undefined;
    end: number | undefined;
    contentType: string | undefined;

    async arrayBuffer(): Promise<ArrayBuffer>;
    async arrayBuffer(): Promise<ArrayBuffer> {
        const bucketName = this.config.bucketName;
        const s3client = this.config.getS3Client();
        const start = this.start || 0;
        let end = this.end || this.size;
        const contentType = this.contentType;
        if (start >= this.size) {
            // handle EOF
            return new ArrayBuffer(0);
        }

        s3Debug(`S3File: arrayBuffer: start: ${start}" end: ${end} contentType: ${contentType}`);
        const path = this.path;
        let rangeEnd = 0;
        if (end >= this.size) {
            // bytes rangeEnd needs to be reduced by 1 because it is including last range end
            rangeEnd = this.size - 1;
        } else {
            // bytes rangeEnd needs to be reduced by 1 because it is including last range end
            rangeEnd = end - 1;
        }
        const range = `bytes=${start}-${rangeEnd}`;
        s3Debug(`s3client.getObject Range: ${range}`);
        try {
            const params = {
                Bucket: bucketName,
                Key: path,
                Range: range,
                ChecksumMode: AWS.ChecksumMode.ENABLED,
            };
            const command = new GetObjectCommand(params);
            const s3obj = await s3client.send(command);
            //const s3obj = await s3client.getObject();
            s3Debug(`s3obj.Body ${s3obj.Body}`);
            if (s3obj.Body) {
                let uArray = await s3obj.Body.transformToByteArray();
                return uArray.buffer;
            } else {
                return new ArrayBuffer(0);
            }
        } catch (err) {
            if (err instanceof AWS.S3ServiceException) {
                const s3err = err as AWS.S3ServiceException;
                const statusCode = s3err.$response?.statusCode || 0;
                if (statusCode == 416) {
                    s3Debug("arrayBuffer() catch error 416");
                    // StatusCode: 416 Range Not Satisfiable (RFC 7233)
                    // Special case because in this case we have reached end of file
                    return new ArrayBuffer(0);
                }
                if (statusCode >= 400) {
                    // Rethrow the error in case it is a serious error
                    throw err;
                }
            }
            s3Debug("catched error on s3client.getObject: ", err);
            // Assuming it is out of range and returning an empty array
            return new ArrayBuffer(0);
        }
    }
    slice(start?: number, end?: number, contentType?: string): Blob;
    slice(start?: number, end?: number, contentType?: string): Blob {
        const file = new S3File(this.config, this.path, this.name, [], this.size, this.lastModified);
        file.start = start;
        file.end = end;
        file.contentType = contentType;
        return file;
    }
    stream(): ReadableStream<any>;
    stream(): NodeJS.ReadableStream;
    stream(): ReadableStream<any> | NodeJS.ReadableStream {
        throw new Error("Method not implemented.");
    }
    async text(): Promise<string>;
    async text(): Promise<string> {
        const ab = await this.arrayBuffer();
        const b = Buffer.from(ab);
        const str = b.toString("utf8");
        return str;
    }
}

export class S3FileHandle implements ImpleFileHandle<File, S3Sink>, FileSystemFileHandle {
    constructor(config: S3Config, path = "", name = "", file = new File([], name), writable = true) {
        this.config = config;
        this.file = file;
        this.name = name;
        this.path = path;
        this.deleted = false;
        this.writable = writable;
        this.readable = true;
    }

    config: S3Config;
    deleted: boolean;
    file: File;
    name: string;
    readable: boolean;
    writable: boolean;
    path: string;
    public kind = "file" as const;

    async getFile() {
        if (this.deleted) throw new NotFoundError();
        return this.file;
    }

    async createWritableSink(opts?: any) {
        s3Debug("createWritable: ");
        if (!this.writable) throw new NotAllowedError();
        if (this.deleted) throw new NotFoundError();
        return new S3Sink(this);
    }

    async createWritable(opts?: any) {
        const sink = this.createWritableSink(opts);
        const fstream = new NFileSystemWritableFileStream(sink);
        return sink;
    }

    async isSameEntry(other: any): Promise<boolean> {
        return this === other;
    }

    async destroy() {
        const bucketName = this.config.bucketName;
        const s3client = this.config.getS3Client();
        const params = {
            Bucket: bucketName,
            Key: this.path,
        };
        const command = new DeleteObjectCommand(params);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _res = await s3client.send(command);
        this.deleted = true;
        // @ts-ignore
        this.file = null;
    }

    async createSyncAccessHandle(): Promise<FileSystemSyncAccessHandle> {
        throw new Error("createSyncAccessHandle not implemented");
    }

    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }
}

export class S3Config {
    constructor(clientConfig: AWS.S3ClientConfig, bucketName: string, isAws: boolean) {
        this.config = clientConfig;
        this.bucketName = bucketName;
        this.maxKeys = DefaultMaxKeys;
        this.cacheTTL = DefaultCacheTTL;
        this.isAws = isAws;
    }
    bucketName: string;
    config: AWS.S3ClientConfig;
    maxKeys: number;
    cacheTTL: number;
    isAws: boolean;

    getS3Client(): AWS.S3Client {
        const cl = new AWS.S3Client(this.config);
        /* TODO find way to figure out region becore CORS
    console.log("s3: trying to set region");
    cl.getBucketLocation({Bucket: this.bucketName}).then((resp) => {
      const region = resp.LocationConstraint || "us-east-1";
      console.log("s3: setting region: ", region);
      this.config.region = region;
    });
    const cl2 = new AWS.S3(this.config);
    */
        return cl;
    }
}

function addParamKeyValueToUrl(baseUrl: string, addParamKeyValue: string): string {
    let newUrl = baseUrl;
    if (newUrl.includes("?")) {
        newUrl = newUrl + "&" + addParamKeyValue;
    } else {
        newUrl = newUrl + "?" + addParamKeyValue;
    }
    return newUrl;
}

function parseS3Url(s3Url: string, secretStore?: any, defaultRegion = "us-east-1"): { s3config: S3Config; newUrl: string } {
    let newUrl = s3Url;
    const forcePathStyle = true;
    const sUrl = parseUrl(s3Url);
    const sInsecure = sUrl.searchParams.get("insecure") || "false";
    let insecure = false;
    if (sInsecure == "true") {
        insecure = true;
    }
    let awsAccessKeyId = sUrl.searchParams.get("accessKeyId") || "";
    if (awsAccessKeyId == "") {
        newUrl = addParamKeyValueToUrl(newUrl, "accessKeyId=${aws.accessKeyId}");
    }
    awsAccessKeyId = substituteSecretValue(awsAccessKeyId, secretStore);
    let awsSecretAccessKey = sUrl.searchParams.get("secretAccessKey") || "";
    awsSecretAccessKey = substituteSecretValue(awsSecretAccessKey, secretStore);
    if (awsSecretAccessKey == "") {
        newUrl = addParamKeyValueToUrl(newUrl, "secretAccessKey=${aws.secretAccessKey}");
    }
    const region = sUrl.searchParams.get("region") || defaultRegion;
    const paramMaxKeys  = sUrl.searchParams.get("maxKeys");
    let maxKeys = DefaultMaxKeys;
    if (paramMaxKeys != undefined) {
        const parsedMaxKeys = parseInt(paramMaxKeys);
        if (!Number.isNaN(parsedMaxKeys)) {
            maxKeys = parsedMaxKeys;
        }
    }

    const paramCacheTTL  = sUrl.searchParams.get("cachettl");
    let cacheTTL = DefaultCacheTTL;
    if (paramCacheTTL != undefined) {
        const parsedCacheTTL = parseInt(paramCacheTTL);
        if (!Number.isNaN(parsedCacheTTL)) {
            cacheTTL = parsedCacheTTL;
        }
    }
    let pathName = sUrl.pathname;
    if (pathName == "/") {
        pathName = "";
    }
    s3Debug(`config pathName: ${pathName}`);
    let isAws = true;
    let hostnameOrBucket = sUrl.hostname;

    const port = sUrl.port;
    if (pathName == "") {
        isAws = true;
    } else {
        isAws = false;
    }
    if (port != "") {
        hostnameOrBucket = `${hostnameOrBucket}:${port}`;
        isAws = false;
    }
    const isAwsParam = sUrl.searchParams.get("aws");
    if (isAwsParam !== undefined) {
        if (isAwsParam == "true") {
            isAws=true;
        } else if (isAwsParam == "false") {
            isAws=false;
        }
    }

    s3Debug(`config isAws: ${isAws}`);
    s3Debug(`config hostnameOrBucket: ${hostnameOrBucket}`);
    s3Debug(`config region: ${region}`);
    s3Debug(`config awsAccessKeyId: ${awsAccessKeyId}`);
    s3Debug(`config awsSecretAccessKey: ${awsSecretAccessKey}`);
    // TODO look into why NodeHttpHandler is not working correctly in node.js
    //const requestHandler = new NodeHttpHandler();
    //const requestHandler = new FetchHttpHandler();
    let bucketName: string;
    let s3clientConfig: AWS.S3ClientConfig;
    if (isAws) {
        s3Debug("config using aws");
        // Assuming an AWS bucket:
        bucketName = hostnameOrBucket;
        s3Debug(`config bucketName: ${bucketName}`);
        s3clientConfig = {
            region: region,
            //forcePathStyle: forcePathStyle,
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey,
            },
            tls: !insecure,
            //requestHandler: requestHandler,
        };
    } else {
        bucketName = pathName;
        if (bucketName.startsWith("/")) {
            bucketName = bucketName.replace("/", "");
        }
        s3Debug(`config bucketName: ${bucketName}`);

        let protocol = "https";
        if (insecure) {
            protocol = "http";
        }
        let hostname = hostnameOrBucket;
        s3Debug(`config hostname: ${hostname}`);
        /*const endpoint: Endpoint = {
            protocol: protocol,
            hostname: hostname,
            path: "",
            port: undefined,
            query: undefined,
        };*/
        const endpoint = `${protocol}://${hostname}`;
        s3clientConfig = {
            region: region,
            // Issue with @aws-sdk not including port in host header
            // See: https://github.com/christophgysin/aws-sdk-js-v3/issues/24
            // and https://github.com/aws/aws-sdk-js-v3/issues/1941
            // and https://github.com/aws/aws-sdk-js-v3/issues/1930
            endpoint: endpoint,
            tls: !insecure,
            forcePathStyle: forcePathStyle,
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey,
            },
            //requestHandler: requestHandler,
        };
    }
    const sConfig = new S3Config(s3clientConfig, bucketName, isAws);
    sConfig.maxKeys = maxKeys;
    sConfig.cacheTTL = cacheTTL;
    return { s3config: sConfig, newUrl: newUrl };

}

export class S3FolderHandle implements ImplFolderHandle<S3FileHandle, S3FolderHandle>, FileSystemDirectoryHandle {
    constructor(config: S3Config, path: string, name: string, writable = true) {
        this.config = config;
        this.name = name;
        this.path = path;
        this.deleted = false;
        this._entries = {};
        this.writable = writable;
        this.readable = true;
    }
    protected config: S3Config;
    _entries: Record<string, S3FolderHandle | S3FileHandle>;
    _entriesCacheTime: number|undefined = undefined;
    name: string;
    deleted: boolean;
    readable: boolean;
    writable: boolean;
    public kind = "directory" as const;
    public path = "";

    [Symbol.asyncIterator]() {
        return this.entries();
    }

    get [Symbol.toStringTag]() {
        return "FileSystemDirectoryHandle";
    }

    isCached(){
        if (this._entriesCacheTime !== undefined){
            let ttl = this.config.cacheTTL;
            let expiry = this._entriesCacheTime + ttl;
            let currMs = getTimeMillis();
            if (currMs <= expiry) {
                return true;
            }
        }
        return false;
    }

    // List the entries in the bucket
    async populateEntries() {
        if (!this.isCached()) {
            const bucketName = this.config.bucketName;
            const s3client = this.config.getS3Client();
            try {
                const delimeter = "/";
                const maxKeys = this.config.maxKeys;
                const prefix = this.path;
                s3Debug(`before s3.listObjectsV2: bucketName: ${bucketName} Prefix: ${prefix} delimeter: ${delimeter}`);
                const params: ListObjectsV2Request = {
                    Bucket: bucketName,
                    Prefix: prefix,
                    Delimiter: delimeter,
                    MaxKeys: maxKeys,
                };
                const command = new ListObjectsV2Command(params);
                // TODO support walking over objects if it contains more than MaxKeys (default 1000 entries)
                // check objectsresponse.IsTruncated and objectsresponse.ContinuationToken
                const objectsresponse = await s3client.send(command);
                const contents = objectsresponse.Contents;
                if (contents != undefined) {
                    for (const cont of contents) {
                        let entryName: string = cont.Key != undefined ? cont.Key : "";
                        s3Debug(`populateEntries entryName: '${entryName}'`);
                        // Remove prefix for object:
                        entryName = entryName.replace(this.path, "");
                        s3Debug(`populateEntries after parsing entryName: '${entryName}'`);
                        // Strip out empty object entries as we assume they are directories
                        if (entryName != "") {
                            const lastModifiedDate = cont.LastModified;
                            const size = cont.Size ?? 0;
                            s3Debug(`populateEntries lastModifiedDate: ${lastModifiedDate}`);
                            const lastModifiedMillis = lastModifiedDate?.getTime() ?? 0;
                            const writeable = true;
                            s3Debug(`populateEntries lastModifiedMillis: ${lastModifiedMillis}`);
                            const path = join(this.path, entryName);
                            const file = new S3File(this.config, path, entryName, [], size, lastModifiedMillis);
                            this._entries[entryName] = new S3FileHandle(this.config, path, entryName, file, writeable);
                        }
                    }
                }
                const prefixes = objectsresponse.CommonPrefixes;
                if (prefixes != undefined) {
                    for (const pref of prefixes) {
                        const spref = pref.Prefix;
                        if (spref != undefined) {
                            // Remove prefix for object:
                            let entryName = spref.replace(this.path, "");
                            // Remove the trailing slash
                            entryName = entryName.replace("/", "");
                            const writeable = true;
                            const path = join(this.path, entryName, true);
                            this._entries[entryName] = new S3FolderHandle(this.config, path, entryName, writeable);
                        }
                    }
                }
                this._entriesCacheTime = getTimeMillis();
            } catch (error) {
                s3Debug("populateEntries catched error: ", error);
            }
        }
    }

    async *entries(): AsyncGenerator<[string, S3FileHandle | S3FolderHandle]> {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        for (const [k, v] of Object.entries(this._entries)) {
            yield [k, v];
        }
    }

    async *values(): AsyncGenerator<S3FileHandle | S3FolderHandle> {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        for (const v of Object.values(this._entries)) {
            yield v;
        }
    }

    async *keys(): AsyncGenerator<string> {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        for (const k of Object.keys(this._entries)) {
            yield k;
        }
    }

    async isSameEntry(other: any) {
        return this === other;
    }

    async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        if (this.deleted) throw new NotFoundError();
        await this.populateEntries();
        const entry = this._entries[name];
        if (entry) {
            // entry exist
            if (entry instanceof S3FileHandle) {
                throw new TypeMismatchError();
            } else {
                return entry;
            }
        } else {
            if (options.create) {
                const folder = await this.createS3Folder(name);
                return (this._entries[name] = folder);
            } else {
                s3Debug(`NotFoundError for name: ${name} options: ${options}`);
                throw new NotFoundError();
            }
        }
    }

    async createS3Folder(name: string): Promise<S3FolderHandle> {
        const bucketName = this.config.bucketName;
        const s3client = this.config.getS3Client();
        const dirPath = join(this.path, name, true);
        //const hiddenFile = join(dirPath, ".dir");
        const hiddenFile = join(dirPath, "");
        const f = new S3FolderHandle(this.config, dirPath, name);
        const params = {
            Bucket: bucketName,
            Key: hiddenFile,
            Body: new Uint8Array(),
        };
        const command = new PutObjectCommand(params);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _s3obj = await s3client.send(command);
        //const _s3obj = await s3client.putObject();
        return f;
    }

    async createS3File(name: string): Promise<S3FileHandle> {
        s3Debug("createS3File", name);
        const bucketName = this.config.bucketName;
        const s3client = this.config.getS3Client();
        const path = join(this.path, name);
        try {
            const f = new S3FileHandle(this.config, path, name);
            s3Debug("createS3File f:", f);
            const abody = new Uint8Array();
            const params = {
                Bucket: bucketName,
                Key: path,
                Body: abody,
            };
            s3Debug("createS3File params:", params);
            const command = new PutObjectCommand(params);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _s3obj = await s3client.send(command);
            //const _s3obj = await s3client.putObject();
            return f;
        } catch (err: any) {
            s3Debug("err: ", err);
        }
        throw new Error("Unable to create file");
    }

    async getFileHandle(name: string, options?: { create?: boolean }): Promise<S3FileHandle> {
        s3Debug("getFileHandle: ", name, options);
        await this.populateEntries();
        const entry = this._entries[name];
        const isFile = entry instanceof S3FileHandle;
        let do_create = false;
        if (options) {
            if (options.create) {
                do_create = options.create;
            }
        }
        if (entry && isFile) return entry;
        if (entry && !isFile) {
            s3Debug(`TypeMismatchError for name: ${name} options: ${options}`);
            throw new TypeMismatchError();
        }
        if (!entry && !do_create) {
            s3Debug(`NotFoundError for name: ${name} options: ${options}`);
            throw new NotFoundError();
        }
        if (!entry && do_create) {
            const s3filehandle = await this.createS3File(name);
            return (this._entries[name] = s3filehandle);
        }
        throw new NotFoundError();
    }

    async removeEntry(name: string, opts: { recursive?: boolean }): Promise<void> {
        s3Debug("removeEntry: ", name, opts);

        const entry = this._entries[name];
        if (!entry) throw new NotFoundError();
        try {
            let isRecursive = false;
            if (opts) {
                if (opts.recursive) {
                    isRecursive = true;
                }
            }
            await entry.destroy(isRecursive);
            delete this._entries[name];
        } catch (err: any) {
            s3Debug("removeEntry err: ", err);
        }
    }

    async destroy(recursive?: boolean) {
        const bucketName = this.config.bucketName;
        const s3client = this.config.getS3Client();
        const path = this.path;
        s3Debug("destroy: ", path);
        if (recursive) {
            for (const x of Object.values(this._entries)) {
                await x.destroy(recursive);
            }
        }

        const params = {
            Bucket: bucketName,
            Key: path,
        };

        s3Debug("destroy params:", params);
        const command = new DeleteObjectCommand(params);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _s3obj = await s3client.send(command);

        this._entries = {};
        this.deleted = true;
    }

    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    resolve(_possibleDescendant: S3FileHandle | S3FolderHandle): Promise<string[] | null> {
        throw new Error("Method not implemented.");
    }
}

export class S3BucketHandle extends S3FolderHandle implements Statable {
    constructor(s3Url: string, secretStore?: any, creationDate?: Date) {
        const { s3config: config, newUrl: newUrl } = parseS3Url(s3Url, secretStore);
        const name = config.bucketName;
        super(config, "", name);
        this.origS3Url = s3Url;
        this.origSecretStore = secretStore;
        this.creationDate = creationDate;
    }

    origS3Url: string;
    origSecretStore: any;
    cachedRegion: string|undefined;
    creationDate?: Date;

    /**
     * Populates object list cache for the bucket
     * @returns region name
     */
    async populateEntries() {
        if (this.cachedRegion == undefined) {
            this.cachedRegion = await this.findBucketRegion();
            const { s3config: config, newUrl: newUrl } = parseS3Url(this.origS3Url, this.origSecretStore, this.cachedRegion);
            this.config = config;
        }
        return await super.populateEntries();
    }

    /**
     * Find the region the bucket is in
     * @returns region name
     */
    async findBucketRegion() {
        let foundRegion = "us-east-1";
        try {
            let bucketName = this.name;
            if (this.config.isAws) {
                let bucketHostName =`${bucketName}.s3.amazonaws.com`;
                let getBucketUrl = `https://${bucketHostName}`;
                if (bucketName.includes(".")) {
                    // Special case where we fall back to unsecure http for buckets containing '.'
                    // because otherwise the S3 server TLS certificate validation does not work.
                    getBucketUrl = `http://${bucketHostName}`;
                }
                // perform a getbucketlocation head request
                let resp = await fetch(getBucketUrl,
                    {
                        method: 'HEAD',
                        redirect: 'manual'
                    }
                );
                let respHeaders = resp.headers;
                let region = respHeaders.get('x-amz-bucket-region');
                if (region == "EU") {
                    region = "eu-west-1";
                }
                if (region) {
                    if (region != "") {
                        s3Debug(`findBucketRegion bucketName: '${bucketName}' region: ${region}`);
                        foundRegion = region;
                    }
                }
            }
        } catch (err: any) {
            s3Debug(`findBucketRegion err:`, err);
        }
        return foundRegion;
    }

    async stat(): Promise<Stat> {
        let creationTimeUnixNs = 0n;
        if (this.creationDate !== undefined) {
            let creationTimeUnixMs = BigInt(this.creationDate.valueOf());
            creationTimeUnixNs = creationTimeUnixMs * 1000_000n;
        }
        let st: Stat = {
            size: 0n,
            creationTime: creationTimeUnixNs,
            modifiedTime: creationTimeUnixNs,
            accessedTime: creationTimeUnixNs
        }
        return st
    }
    updateTimes(accessedTime: bigint | null, modifiedTime: bigint | null): Promise<void> {
        throw new Error("Update Stat not supported");
    }
}

export class S3BucketListHandle implements ImplFolderHandle<S3FileHandle, S3BucketHandle>, FileSystemDirectoryHandle {
    constructor(s3Url: string, secretStore?: any) {
        const { s3config: config, newUrl: newUrl } = parseS3Url(s3Url, secretStore);
        const name = "s3";
        this.name = name;
        this.url = newUrl;
        this.config = config;
        this.writable = false;
        this.readable = true;
        this._entries = {};
        this.secretStore = secretStore;
    }
    url: string;
    config: S3Config;
    _entries: Record<string, S3BucketHandle | S3FileHandle>;
    name: string;
    readable: boolean;
    writable: boolean;
    public kind = "directory" as const;
    public path = "";
    secretStore: any;
    _entriesCacheTime: number|undefined = undefined;

    [Symbol.asyncIterator]() {
        return this.entries();
    }

    isCached(){
        if (this._entriesCacheTime !== undefined){
            let ttl = this.config.cacheTTL;
            let expiry = this._entriesCacheTime + ttl;
            let currMs = getTimeMillis();
            if (currMs <= expiry) {
                return true;
            }
        }
        return false;
    }


    // List the entries in the bucket
    async populateEntries() {
        if (!this.isCached()) {
            try {
                const s3client = this.config.getS3Client();
                const params = {};
                const command = new ListBucketsCommand(params);
                const bucketsresponse = await s3client.send(command);
                //const bucketsresponse = await s3client.listBuckets({});
                const buckets = bucketsresponse.Buckets;
                if (buckets != undefined) {
                    for (const buck of buckets) {
                        const entryName = buck != undefined ? buck.Name : "";
                        if (entryName) {
                            const creationDate = buck.CreationDate;
                            s3Debug(`populateEntries entryName: '${entryName}', creationDate: `, creationDate);
                            let s3BucketUrl = this.getS3UrlForBucketFromBaseUrl(this.url, entryName);
                            s3Debug(`populateEntries s3BucketUrl: '${s3BucketUrl}'`);
                            this._entries[entryName] = new S3BucketHandle(s3BucketUrl, this.secretStore, creationDate);
                        }
                    }
                }
                this._entriesCacheTime = getTimeMillis();
            } catch (error) {
                s3Debug("populateEntries catched error: ", error);
            }
        }
    }

    getS3UrlForBucketFromBaseUrl(s3Url: string, bucketName: string): string {
        let s3BucketUrl = "";
        if (this.config.isAws) {
            const urlParsed = parseUrl(s3Url);
            urlParsed.hostname = bucketName;
            s3BucketUrl = urlToString(urlParsed);
            s3Debug(`entryName: ${s3BucketUrl}`);
        } else {
            const urlParsed = parseUrl(s3Url);
            urlParsed.pathname = bucketName;
            s3BucketUrl = urlToString(urlParsed);
            s3Debug(`entryName: ${s3BucketUrl}`);
        }
        return s3BucketUrl;
    }

    async *entries() {
        await this.populateEntries();
        yield* Object.entries(this._entries);
    }

    async *values() {
        await this.populateEntries();
        yield* Object.values(this._entries);
    }

    async *keys() {
        await this.populateEntries();
        yield* Object.keys(this._entries);
    }

    async isSameEntry(other: any) {
        return this === other;
    }

    async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        await this.populateEntries();
        const entry = this._entries[name];
        if (entry) {
            // entry exist
            if (entry instanceof S3FileHandle) {
                throw new TypeMismatchError();
            } else {
                return entry;
            }
        } else {
            if (options.create) {
                const bucket = await this.createS3Bucket(name);
                return bucket;
            } else {
                s3Debug(`NotFoundError for name: ${name} options: ${options}`);
                throw new NotFoundError();
            }
        }
    }

    async createS3Bucket(name: string): Promise<S3BucketHandle> {
        let bucketName = name;
        const s3client = this.config.getS3Client();
        const dirPath = join(this.path, name, true);
        let s3BucketUrl = this.getS3UrlForBucketFromBaseUrl(this.url, name);
        const f = new S3BucketHandle(s3BucketUrl, this.secretStore, new Date());
        const params = {
            Bucket: bucketName,
        };
        const command = new CreateBucketCommand(params);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _s3obj = await s3client.send(command);
        //const _s3obj = await s3client.putObject();
        return f;
    }

    async getFileHandle(_name: string, _opts?: { create?: boolean }): Promise<S3FileHandle> {
        throw new TypeMismatchError();
    }

    async removeEntry(name: string, opts: { recursive?: boolean }): Promise<void> {
        if (opts) {
            if (opts.recursive) {
                throw new Error("Recursive remove not supported");
            }
        }
        await this.deleteS3Bucket(name);
        delete this._entries[name];
    }

    async deleteS3Bucket(name: string): Promise<void> {
        let bucketName = name;
        const s3client = this.config.getS3Client();
        const params = {
            Bucket: bucketName,
        };
        const command = new DeleteBucketCommand(params);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _s3obj = await s3client.send(command);
        //const _s3obj = await s3client.putObject();
    }


    async destroy(recursive?: boolean) {
        throw new Error("destroy not supported");
    }

    async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor) {
        return "granted" as const;
    }

    resolve(_possibleDescendant: S3FileHandle | S3FolderHandle): Promise<string[] | null> {
        throw new Error("Method not implemented.");
    }
}

function getTimeMillis(){
    var date = Date.now();
    return date;
}

function GetBucketHandle(s3Url: string, secretStore?: any): S3BucketHandle | S3BucketListHandle {
    const { s3config: config, newUrl: newUrl } = parseS3Url(s3Url, secretStore);
    const bucketName = config.bucketName;
    if (bucketName) {
        const h = new S3BucketHandle(newUrl, secretStore);
        return h;
    } else {
        const h = new S3BucketListHandle(newUrl, secretStore);
        return h;
    }
}

export default (s3Url: string, secretStore?: any) => GetBucketHandle(s3Url, secretStore);
