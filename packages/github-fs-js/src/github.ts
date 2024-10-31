import {
    InvalidModificationError,
    InvalidStateError,
    NotAllowedError,
    NotFoundError,
    SyntaxError,
    TypeMismatchError,
    FileSystemHandlePermissionDescriptor,
    NFileSystemWritableFileStream,
} from "@wasmin/fs-js";
import { join, substituteSecretValue } from "@wasmin/fs-js";
import {
    FileSystemWritableFileStream,
    FileSystemHandle,
    FileSystemDirectoryHandle,
    FileSystemFileHandle,
} from "@wasmin/fs-js";
import { DefaultSink, ImpleFileHandle, ImplFolderHandle } from "@wasmin/fs-js";
import { parseUrl } from "@wasmin/fs-js";

const GITHUB_DEBUG = false;

function githubDebug(message?: any, ...optionalParams: any[]) {
    if (GITHUB_DEBUG) {
        console.debug(message, optionalParams);
    }
}

export class GithubFileSink extends DefaultSink<GithubFileHandle> implements FileSystemWritableFileStream {
    constructor(fileHandle: GithubFileHandle) {
        super(fileHandle);
        this.fileHandle = fileHandle;
        this.file = fileHandle.file;
        this.size = fileHandle.file.size;
        this.position = 0;
    }

    fileHandle: GithubFileHandle;
    file: File;
    size: number;
    position: number;

    async abort() {
        await this.close();
    }

    getWriter(): WritableStreamDefaultWriter<any> {
        const w = new WritableStreamDefaultWriter<any>(this);
        return w;
    }

    async write(chunk: FileSystemWriteChunkType) {
        return await this.genericWrite(chunk);
    }

    async close() {
        if (this.fileHandle.deleted) throw new NotFoundError();
        this.fileHandle.file = this.file;
        // @ts-ignore
        this.file = this.position = this.size = null;
    }
}

export interface GithubFile extends File {
    blobUrl: string;
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

export class GithubFile {
    constructor(
        config: GithubConfig,
        blobUrl: string,
        path: string,
        fileName: string,
        fileBits: BlobPart[],
        size: number,
        lastModified: number,
        options?: FilePropertyBag
    ) {
        this.config = config;
        this.blobUrl = blobUrl;
        this.size = size;
        this.type = "File";
        this.webkitRelativePath = fileName;
        this.name = fileName;
        this.path = path;
        this.lastModified = lastModified;
    }
    config: GithubConfig;
    blobUrl: string;
    lastModified: number;
    name: string;
    path: string;
    webkitRelativePath: string;
    type: string;
    size: number;

    start: number | undefined;
    end: number | undefined;
    contentType: string | undefined;

    async arrayBuffer(...args: []): Promise<ArrayBuffer> {
        const url = this.blobUrl;
        try {
            // TODO cache response
            const response = await this.config.fetchBlob(url);
            githubDebug("response: ", response);
            // @ts-ignore
            const json = await response.json();
            const base64data = json.content;
            githubDebug("base64data:", base64data);
            const bString = atob(base64data);
            const len = bString.length;
            const buffer = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                buffer[i] = bString.charCodeAt(i);
            }
            const start = this.start || 0;
            const end = this.end || this.size;
            const ret = buffer.slice(start, end);
            return ret;
        } catch (error) {
            githubDebug("arrayBuffer cached error: ", error);
        }
        return new ArrayBuffer(0);
    }
    slice(start?: number, end?: number, contentType?: string): Blob;
    slice(start?: number, end?: number, contentType?: string): Blob {
        const file = new GithubFile(this.config, this.blobUrl, this.path, this.name, [], this.size, this.lastModified);
        file.start = start;
        file.end = end;
        file.contentType = contentType;
        return file;
    }
    stream(): ReadableStream<any>;
    stream(): NodeJS.ReadableStream;
    stream(): ReadableStream<any> | NodeJS.ReadableStream {
        throw new Error("stream method not implemented.");
    }
    async text(): Promise<string>;
    async text(): Promise<string> {
        const ab = await this.arrayBuffer();
        const b = Buffer.from(ab);
        const str = b.toString("utf8");
        return str;
    }
}

export class GithubFileHandle implements ImpleFileHandle<File, GithubFileSink>, FileSystemFileHandle {
    constructor(
        config: GithubConfig,
        blobUrl: string,
        path = "",
        name = "",
        file = new File([], name),
        writable = true
    ) {
        this.config = config;
        this.blobUrl = blobUrl;
        this.file = file;
        this.name = name;
        this.path = path;
        this.deleted = false;
        this.writable = writable;
        this.readable = true;
    }

    config: GithubConfig;
    blobUrl: string;
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
        if (!this.writable) throw new NotAllowedError();
        if (this.deleted) throw new NotFoundError();
        return new GithubFileSink(this);
    }

    public async createWritable(opts?: any) {
        const sink = await this.createWritableSink(opts);
        const fstream = new NFileSystemWritableFileStream(sink);
        return sink;
    }

    public async isSameEntry(other: any): Promise<boolean> {
        return this === other;
    }

    public destroy() {
        throw new Error("unimplemented");
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

export class GithubConfig {
    constructor(owner: string, repoName: string, ref: string | undefined, user: string, password: string) {
        this.owner = owner;
        this.repoName = repoName;
        this.ref = ref;
        this.user = user;
        this.password = password;
    }
    owner: string;
    repoName: string;
    ref: string | undefined;
    user: string;
    password: string;

    async fetch(url: string) {
        const githubUser = this.user;
        const githubPassword = this.password;
        const authString = `${githubUser}:${githubPassword}`;
        githubDebug(`authString: ${authString}`);
        //const buf = Buffer.from(authString);
        //const credentials = buf.toString("base64");
        const credentials = btoa(authString);
        const authorization = `Basic ${credentials}`;
        githubDebug(`authorization: ${authorization}`);
        const headers = {
            Accept: "application/vnd.github.v3+json",
            Authorization: authorization,
        };
        githubDebug(`performing request: ${url}`);
        githubDebug("headers:", headers);

        const options = { headers: headers };
        const data = await fetch(url, options);
        return data;
    }

    async fetchRepoEntries(path: string) {
        const owner = this.owner;
        const repo = this.repoName;
        let ref = this.ref;
        githubDebug(`ref before ${ref}`);
        if (ref == undefined) {
            // TODO cache default branch
            ref = await this.fetchRepoDefaultBranch();
            this.ref = ref;
            githubDebug(`ref after ${ref}`);
        }

        const filePath = encodeFilePath(path).replace(/^\//, ":");

        const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}${filePath}`;
        githubDebug(`fetchRepoEntries: url: ${url}`);
        return this.fetch(url);
    }

    async fetchBlob(blobUrl: string) {
        return this.fetch(blobUrl);
    }

    async fetchRepoInfo(path: string) {
        const owner = this.owner;
        const repo = this.repoName;
        const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;

        return this.fetch(repoUrl);
    }

    async fetchRepoDefaultBranch(): Promise<string> {
        const repo = this.repoName;
        const response = await this.fetchRepoInfo(repo);
        const data = await response.json();
        const default_branch = data["default_branch"];
        githubDebug(`repo: ${repo} default_branch: ${default_branch}`);
        return default_branch;
    }

    async fetchRepoList(username: string) {
        // TODO implement paging
        //const githubUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
        //const githubUrl = `https://api.github.com/orgs/${username}/repos?per_page=100`;
        const githubUrl = "https://api.github.com/user/repos?per_page=100";
        return this.fetch(githubUrl);
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

function parseGithubUrl(githubUrl: string, secretStore?: any): { gitHubConfig: GithubConfig; newUrl: string } {
    // We need urlparse because URL with special urls is broken in Chrome/Firefox
    let newurl = githubUrl;
    const urlParsed = parseUrl(githubUrl);
    let githubUser = urlParsed.searchParams.get("username") || "";
    if (githubUser == "") {
        newurl = addParamKeyValueToUrl(newurl, "username=${github.username}");
    }
    githubUser = substituteSecretValue(githubUser, secretStore);

    let githubToken = urlParsed.searchParams.get("token") || "";
    if (githubUser == "") {
        newurl = addParamKeyValueToUrl(newurl, "token=${github.token}");
    }
    githubToken = substituteSecretValue(githubToken, secretStore);

    const ref = urlParsed.searchParams.get("ref") || undefined;

    const pathName = urlParsed.pathname;
    const hostname = urlParsed.hostname;

    githubDebug("githubUrl: " + githubUrl);
    githubDebug("urlParsed.toString(): " + urlParsed.toString());

    githubDebug("hostname: " + hostname);
    githubDebug("pathname: " + pathName);

    const owner = hostname;
    let repo = pathName;
    if (repo.startsWith("/")) {
        repo = repo.replace("/", "");
    }
    const githubPassword = githubToken;
    const gConfig = new GithubConfig(owner, repo, ref, githubUser, githubPassword);
    return { gitHubConfig: gConfig, newUrl: newurl };
}

export const encodeFilePath = (filePath: string): string => {
    if (filePath != "") {
        filePath = `/${filePath}`;
    }
    return filePath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
};

export class GithubFolderHandle
    implements ImplFolderHandle<GithubFileHandle, GithubFolderHandle>, FileSystemDirectoryHandle
{
    constructor(config: GithubConfig, path: string, name: string, writable = true) {
        this.config = config;
        this.name = name;
        this.path = path;
        this.deleted = false;
        this._entries = {};
        this.writable = writable;
        this.readable = true;
    }
    config: GithubConfig;
    _entries: Record<string, GithubFolderHandle | GithubFileHandle>;
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

    public async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState> {
        return "granted" as const;
    }

    public async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState> {
        return "granted" as const;
    }

    // List the entries in the bucket
    async populateEntries() {
        try {
            let data = await this.config.fetchRepoEntries(this.path);
            githubDebug("data: ", data);

            // @ts-ignore
            data = await data.json();
            githubDebug("datajson: ", data);

            // @ts-ignore
            for (const item of data.tree || []) {
                const itemPath = item.path;
                const itemMode = item.mode;
                const itemType = item.type;
                const itemSize = item.size;
                const itemSha = item.sha;
                const itemUrl = item.url;
                const entryName = itemPath;
                const path = join(this.path, entryName);
                const writeable = false;

                if (itemType == "blob") {
                    // isFile
                    const file = new GithubFile(this.config, itemUrl, path, entryName, [], itemSize, 0);
                    this._entries[entryName] = new GithubFileHandle(
                        this.config,
                        itemUrl,
                        path,
                        entryName,
                        file,
                        writeable
                    );
                } else if (itemType == "tree") {
                    //isDir
                    this._entries[entryName] = new GithubFolderHandle(this.config, path, entryName, writeable);
                }
            }
        } catch (error) {
            console.error("populateEntries cached error: ", error);
        }
    }

    async *entries(): AsyncGenerator<[string, GithubFileHandle | GithubFolderHandle]> {
        await this.populateEntries();
        if (this.deleted) throw new NotFoundError();
        for (const [k, v] of Object.entries(this._entries)) {
            yield [k, v];
        }
    }

    async *values(): AsyncGenerator<GithubFileHandle | GithubFolderHandle> {
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

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        if (this.deleted) throw new NotFoundError();
        const entry = this._entries[name];
        if (entry) {
            // entry exist
            if (entry instanceof GithubFileHandle) {
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

    public async getFileHandle(name: string, options?: { create?: boolean }): Promise<GithubFileHandle> {
        const entry = this._entries[name];
        const isFile = entry instanceof GithubFileHandle;
        let do_create = false;
        if (options) {
            if (options.create) {
                do_create = options.create;
            }
        }
        if (entry && isFile) return entry;
        if (entry && !isFile) {
            githubDebug(`TypeMismatchError for name: ${name} options: ${options}`);
            throw new TypeMismatchError();
        }
        if (!entry && !do_create) {
            githubDebug(`NotFoundError for name: ${name} options: ${options}`);
            throw new NotFoundError();
        }
        if (!entry && do_create) {
            throw new Error("create not supported");
        }
        throw new NotFoundError();
    }

    public async removeEntry(name: string, opts: { recursive?: boolean }): Promise<void> {
        const entry = this._entries[name];
        if (!entry) throw new NotFoundError();
        entry.destroy(opts.recursive);
        delete this._entries[name];
    }

    public destroy(recursive?: boolean) {
        for (const x of Object.values(this._entries)) {
            if (!recursive) throw new InvalidModificationError();
            x.destroy(recursive);
        }
        this._entries = {};
        this.deleted = true;
    }

    resolve(_possibleDescendant: GithubFileHandle | GithubFolderHandle): Promise<string[] | null> {
        throw new Error("Method not implemented.");
    }
}

export class GithubRepoHandle extends GithubFolderHandle {
    constructor(githubUrl: string, secretStore?: any) {
        const { gitHubConfig: config, newUrl: newUrl } = parseGithubUrl(githubUrl, secretStore);
        const name = config.repoName;
        super(config, "", name);
        this.url = newUrl;
        this.config = config;
    }
    url: string;
    config: GithubConfig;
}

export class GithubRepoListHandle implements ImplFolderHandle<GithubFileHandle, GithubRepoHandle> {
    constructor(githubUrl: string, secretStore?: any) {
        const { gitHubConfig: config, newUrl: newUrl } = parseGithubUrl(githubUrl, secretStore);
        const owner = config.owner;
        const name = `github-${owner}`;
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
    config: GithubConfig;
    _entries: Record<string, GithubRepoHandle | GithubFileHandle>;
    name: string;
    deleted: boolean;
    readable: boolean;
    writable: boolean;
    public kind = "directory" as const;
    public path = "";
    secretStore: any;

    public async queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState> {
        return "granted" as const;
    }

    public async requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState> {
        return "granted" as const;
    }

    // List the entries in the bucket
    async populateEntries() {
        try {
            const owner = this.config.owner;
            let data = await this.config.fetchRepoList(owner);
            githubDebug("data: ", data);

            // @ts-ignore
            data = await data.json();
            githubDebug("datajson: ", data);

            // @ts-ignore
            for (const item of data || []) {
                const itemName = item.name;
                const itemFullName = item.fullName;
                const urlParsed = parseUrl(this.url);
                urlParsed.pathname = `/${itemName}`;
                const repoGithubUrl = urlParsed.toString();
                githubDebug(`repoGithubUrl: ${repoGithubUrl}`);
                this._entries[itemName] = new GithubRepoHandle(repoGithubUrl, this.secretStore);
            }
        } catch (error) {
            githubDebug("populateEntries cached error: ", error);
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

    async isSameEntry(other: any) {
        return this === other;
    }

    public async getDirectoryHandle(name: string, options: { create?: boolean; capture?: boolean } = {}) {
        if (this.deleted) throw new NotFoundError();
        const entry = this._entries[name];
        if (entry) {
            // entry exist
            if (entry instanceof GithubFileHandle) {
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

    // @ts-ignore
    public async getFileHandle(_name: string, _opts?: { create?: boolean }): Promise<undefined> {
        throw new TypeMismatchError();
    }

    public async removeEntry(name: string, opts: { recursive?: boolean }): Promise<void> {
        throw new Error("remove not supported");
    }

    public destroy(recursive?: boolean) {
        throw new Error("destroy not supported");
    }
}

function GetRepoHandle(githubUrl: string, secretStore?: any): GithubRepoHandle | GithubRepoListHandle {
    const { gitHubConfig: config, newUrl: newUrl } = parseGithubUrl(githubUrl, secretStore);
    const repoName = config.repoName;
    githubDebug(`reponame: ${repoName}`);
    if (repoName != "") {
        // returning one repo if set
        const h = new GithubRepoHandle(newUrl, secretStore);
        return h;
    } else {
        // returning a list of repos if no repo set
        const h = new GithubRepoListHandle(newUrl, secretStore);
        return h;
    }
}

export default (githubUrl: string, secretStore?: any) => GetRepoHandle(githubUrl, secretStore);
