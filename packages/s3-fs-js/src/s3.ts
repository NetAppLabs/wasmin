import {
    NFileSystemWritableFileStream,
    NotAllowedError,
    NotFoundError,
    TypeMismatchError,
} from "@wasm-env/fs-js";
import {
    join,
    streamToBuffer,
    streamToBufferNode,
    substituteSecretValue,
    FileSystemWritableFileStream,
} from "@wasm-env/fs-js";
import { DefaultSink, ImpleFileHandle, ImplFolderHandle } from "@wasm-env/fs-js";

import { default as urlparse } from "url-parse";

import * as AWS from "@aws-sdk/client-s3";

import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListBucketsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

const S3_DEBUG = false;

function s3Debug(message?: any, ...optionalParams: any[]) {
    if (S3_DEBUG) {
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
            let file = this.file;
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
        } catch(err: any) {
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
        if (end >= this.size) {
            end = this.size - 1;
        }
        const range = `bytes=${start}-${end}`;
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
                if (s3obj.Body instanceof ReadableStream) {
                    const body: ReadableStream = s3obj.Body as ReadableStream;
                    s3Debug("before streamToBuffer");
                    const buf = await streamToBuffer(body);
                    s3Debug("returning buf");
                    return buf;
                } else if (s3obj.Body instanceof Blob) {
                    const body: Blob = s3obj.Body as Blob;
                    return body.arrayBuffer();
                } else {
                    const body = s3obj.Body as any;
                    s3Debug("before streamToBuffer");
                    const buf = await streamToBufferNode(body);
                    s3Debug("returning buf");
                    return buf;
                }
            } else {
                return new ArrayBuffer(0);
            }
        } catch (err) {
            if (err instanceof AWS.S3ServiceException) {
                const s3err = err as AWS.S3ServiceException;
                const statusCode = s3err.$response?.statusCode || 0;
                if (statusCode == 416) {
                    // StatusCode: 416 Range Not Satisfiable (RFC 7233)
                    // Special case because in this case we have reached end of file
                    return new ArrayBuffer(0);
                }
                if (statusCode >= 400) {
                    // Rethrow the error in case it is a serious error
                    throw err;
                }
            }
            console.error("catched error on s3client.getObject: ", err);
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

export class S3FileHandle implements ImpleFileHandle<S3Sink, File> {
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

    public async getFile() {
        if (this.deleted) throw new NotFoundError();
        return this.file;
    }

    public async createWritableSink(opts?: any) {
        s3Debug("createWritable: ");
        if (!this.writable) throw new NotAllowedError();
        if (this.deleted) throw new NotFoundError();
        return new S3Sink(this);
    }

    public async createWritable(opts?: any) {
        const sink = this.createWritableSink(opts);
        const fstream = new NFileSystemWritableFileStream(sink);
        return sink;
    }

    public async isSameEntry(other: any): Promise<boolean> {
        return this === other;
    }

    public async destroy() {
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
}

export class S3Config {
    constructor(clientConfig: AWS.S3ClientConfig, bucketName: string) {
        this.config = clientConfig;
        this.bucketName = bucketName;
    }
    bucketName: string;
    config: AWS.S3ClientConfig;

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

function parseS3Url(s3Url: string, secretStore?: any): { s3config: S3Config; newUrl: string } {
    let newUrl = s3Url;
    const defaultRegion = "us-east-1";
    const forcePathStyle = true;
    const sUrl = urlparse(s3Url, true);
    const sInsecure = sUrl.query["insecure"] || "false";
    let insecure = false;
    if (sInsecure == "true") {
        insecure = true;
    }
    let awsAccessKeyId = sUrl.query["accessKeyId"] || "";
    if (awsAccessKeyId == "") {
        newUrl = newUrl + "?accessKeyId=${aws.accessKeyId}";
    }
    awsAccessKeyId = substituteSecretValue(awsAccessKeyId, secretStore);
    let awsSecretAccessKey = sUrl.query["secretAccessKey"] || "";
    awsSecretAccessKey = substituteSecretValue(awsSecretAccessKey, secretStore);
    if (awsSecretAccessKey == "") {
        newUrl = newUrl + "&secretAccessKey=${aws.secretAccessKey}";
    }
    const region = sUrl.query["region"] || defaultRegion;

    let pathName = sUrl.pathname;
    if (pathName == "/") {
        pathName = "";
    }
    s3Debug(`config pathName: ${pathName}`);

    let hostname = sUrl.hostname;
    s3Debug(`config hostname: ${hostname}`);
    s3Debug(`config region: ${region}`);
    s3Debug(`config awsAccessKeyId: ${awsAccessKeyId}`);
    s3Debug(`config awsSecretAccessKey: ${awsSecretAccessKey}`);
    // TODO look into why NodeHttpHandler is not working correctly in node.js
    //const requestHandler = new NodeHttpHandler();
    //const requestHandler = new FetchHttpHandler();

    if (pathName == "") {
        s3Debug("config using aws");
        // Assuming an AWS bucket:
        const bucketName = hostname;
        s3Debug(`config bucketName: ${bucketName}`);
        const s3clientConfig: AWS.S3ClientConfig = {
            region: region,
            //forcePathStyle: forcePathStyle,
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey,
            },
            tls: !insecure,
            //requestHandler: requestHandler,
        };
        const sConfig = new S3Config(s3clientConfig, bucketName);
        return { s3config: sConfig, newUrl: newUrl };
    } else {
        let bucketName = pathName;
        if (bucketName.startsWith("/")) {
            bucketName = bucketName.replace("/", "");
        }
        s3Debug(`config bucketName: ${bucketName}`);

        let protocol = "https";
        if (insecure) {
            protocol = "http";
        }
        const port = sUrl.port;
        if (port != "") {
            hostname = `${hostname}:${port}`;
        }
        s3Debug(`config hostname: ${hostname}`);
        /*const endpoint: Endpoint = {
      protocol: protocol,
      hostname: hostname,
      path: "",
      port: undefined,
      query: undefined,
    };*/
        const endpoint = `${protocol}://${hostname}`;
        const s3clientConfig: AWS.S3ClientConfig = {
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
        const sConfig = new S3Config(s3clientConfig, bucketName);
        return { s3config: sConfig, newUrl: newUrl };
    }
}

export class S3FolderHandle implements ImplFolderHandle<S3FileHandle, S3FolderHandle> {
    constructor(config: S3Config, path: string, name: string, writable = true) {
        this.config = config;
        this.name = name;
        this.path = path;
        this.deleted = false;
        this._entries = {};
        this.writable = writable;
        this.readable = true;
    }
    config: S3Config;
    _entries: Record<string, S3FolderHandle | S3FileHandle>;
    _entriesCached = false;
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

    // List the entries in the bucket
    async populateEntries() {
        if (!this._entriesCached) {
            const bucketName = this.config.bucketName;
            const s3client = this.config.getS3Client();
            try {
                const delimeter = "/";
                const prefix = this.path;
                s3Debug(`before s3.listObjectsV2: bucketName: ${bucketName} Prefix: ${prefix} delimeter: ${delimeter}`);
                const params = {
                    Bucket: bucketName,
                    Prefix: prefix,
                    Delimiter: delimeter,
                };
                const command = new ListObjectsV2Command(params);
                // TODO support more than 1000 entries
                //const objectsresponse = await s3client.listObjectsV2({
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
                this._entriesCached = true;
            } catch (error) {
                console.error("populateEntries catched error: ", error);
            }
        }
    }

    public async *entries() {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        yield* Object.entries(this._entries);
    }

    public async *values() {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        yield* Object.values(this._entries);
    }

    public async *keys() {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        yield* Object.keys(this._entries);
    }

    public isSameEntry(other: any) {
        return this === other;
    }

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
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

    public async createS3Folder(name: string): Promise<S3FolderHandle> {
        const bucketName = this.config.bucketName;
        const s3client = this.config.getS3Client();
        const dirPath = join(this.path, name, true);
        //const hiddenFile = join(dirPath, ".dir");
        const hiddenFile = join(dirPath, "");
        const f = new S3FolderHandle(this.config, dirPath, name);
        const params = {
            Bucket: bucketName,
            Key: hiddenFile,
        };
        const command = new PutObjectCommand(params);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _s3obj = await s3client.send(command);
        //const _s3obj = await s3client.putObject();
        return f;
    }

    public async createS3File(name: string): Promise<S3FileHandle> {
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

    public async getFileHandle(name: string, options?: { create?: boolean }): Promise<S3FileHandle | undefined> {
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
    }

    public async removeEntry(name: string, opts: { recursive?: boolean }): Promise<void> {
        s3Debug("removeEntry: ", name, opts);

        const entry = this._entries[name];
        if (!entry) throw new NotFoundError();
        try {
            await entry.destroy(opts.recursive);
            delete this._entries[name];
        } catch (err: any) {
            console.log("removeEntry err: ", err);
        }
    }

    public async destroy(recursive?: boolean) {
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
}

export class S3BucketHandle extends S3FolderHandle {
    constructor(s3Url: string, secretStore?: any) {
        const { s3config: config, newUrl: newUrl } = parseS3Url(s3Url, secretStore);
        const name = config.bucketName;
        super(config, "", name);
        this.url = newUrl;
        this.config = config;
    }
    url: string;
    config: S3Config;
}

export class S3BucketListHandle implements ImplFolderHandle<S3FileHandle, S3BucketHandle> {
    constructor(s3Url: string, secretStore?: any) {
        const { s3config: config, newUrl: newUrl } = parseS3Url(s3Url, secretStore);
        const name = "s3";
        this.name = name;
        this.url = newUrl;
        this.config = config;
        this.deleted = false;
        this.writable = false;
        this.readable = true;
        this._entries = {};
        this.secretStore = secretStore;
    }
    url: string;
    config: S3Config;
    _entries: Record<string, S3BucketHandle | S3FileHandle>;
    name: string;
    deleted: boolean;
    readable: boolean;
    writable: boolean;
    public kind = "directory" as const;
    public path = "";
    secretStore: any;

    // List the entries in the bucket
    async populateEntries() {
        try {
            const s3client = this.config.getS3Client();
            const params = {};
            const command = new ListBucketsCommand(params);
            const bucketsresponse = await s3client.send(command);
            //const bucketsresponse = await s3client.listBuckets({});
            const contents = bucketsresponse.Buckets;
            if (contents != undefined) {
                for (const cont of contents) {
                    const entryName = cont != undefined ? cont.Name : "";
                    if (entryName) {
                        const creationDate = cont.CreationDate;
                        s3Debug(`populateEntries entryName: '${entryName}'`);
                        s3Debug(`populateEntries after parsing entryName: '${entryName}'`);
                        const urlParsed = urlparse(this.url, false);
                        //urlParsed.set("pathname", entryName);
                        urlParsed.set("hostname", entryName);
                        const s3BucketUrl = urlParsed.toString();
                        s3Debug(`entryName: ${s3BucketUrl}`);
                        this._entries[entryName] = new S3BucketHandle(s3BucketUrl, this.secretStore);
                    }
                }
            }
        } catch (error) {
            console.error("populateEntries catched error: ", error);
        }
    }

    public async *entries() {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        yield* Object.entries(this._entries);
    }

    public async *values() {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        yield* Object.values(this._entries);
    }

    public async *keys() {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        yield* Object.keys(this._entries);
    }

    public isSameEntry(other: any) {
        return this === other;
    }

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        if (this.deleted) throw new NotFoundError();
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
                throw new Error("create not supported");
            } else {
                console.error(`NotFoundError for name: ${name} options: ${options}`);
                throw new NotFoundError();
            }
        }
    }

    public async getFileHandle(_name: string, _opts?: { create?: boolean }): Promise<undefined> {
        throw new TypeMismatchError();
    }

    public async removeEntry(name: string, opts: { recursive?: boolean }): Promise<void> {
        throw new Error("remove not supported");
    }

    public async destroy(recursive?: boolean) {
        throw new Error("destroy not supported");
    }
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
