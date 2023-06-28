export namespace NfsRsComponentNfs {
  export function parseUrlAndMount(url: string): void;
  export function null(): void;
  export function access(fh: Uint8Array | ArrayBuffer, mode: number): number;
  export function accessPath(path: string, mode: number): number;
  export function close(seqid: number, stateid: bigint): void;
  export function commit(fh: Uint8Array | ArrayBuffer, offset: bigint, count: number): void;
  export function commitPath(path: string, offset: bigint, count: number): void;
  export function create(dirFh: Uint8Array | ArrayBuffer, filename: string, mode: number): Uint8Array;
  export function createPath(path: string, mode: number): Uint8Array;
  export function delegpurge(clientid: bigint): void;
  export function delegreturn(stateid: bigint): void;
  export function getattr(fh: Uint8Array | ArrayBuffer): Attr;
  export function getattrPath(path: string): Attr;
  export function setattr(fh: Uint8Array | ArrayBuffer, guardCtime: Time | null, mode: number | null, uid: number | null, gid: number | null, size: bigint | null, atime: Time | null, mtime: Time | null): void;
  export function setattrPath(path: string, specifyGuard: boolean, mode: number | null, uid: number | null, gid: number | null, size: bigint | null, atime: Time | null, mtime: Time | null): void;
  export function getfh(): void;
  export function link(srcFh: Uint8Array | ArrayBuffer, dstDirFh: Uint8Array | ArrayBuffer, dstFilename: string): Attr;
  export function linkPath(srcPath: string, dstPath: string): Attr;
  export function symlink(srcPath: string, dstDirFh: Uint8Array | ArrayBuffer, dstFilename: string): Uint8Array;
  export function symlinkPath(srcPath: string, dstPath: string): Uint8Array;
  export function readlink(fh: Uint8Array | ArrayBuffer): string;
  export function readlinkPath(path: string): string;
  export function lookup(path: string): Uint8Array;
  export function pathconf(fh: Uint8Array | ArrayBuffer): PathConf;
  export function pathconfPath(path: string): PathConf;
  export function read(fh: Uint8Array | ArrayBuffer, offset: bigint, count: number): Uint8Array;
  export function readPath(path: string, offset: bigint, count: number): Uint8Array;
  export function write(fh: Uint8Array | ArrayBuffer, offset: bigint, data: Uint8Array | ArrayBuffer): number;
  export function writePath(path: string, offset: bigint, data: Uint8Array | ArrayBuffer): number;
  export function readdir(dirFh: Uint8Array | ArrayBuffer): ReaddirEntry[];
  export function readdirPath(dirPath: string): ReaddirEntry[];
  export function readdirplus(dirFh: Uint8Array | ArrayBuffer): ReaddirplusEntry[];
  export function readdirplusPath(dirPath: string): ReaddirplusEntry[];
  export function mkdir(dirFh: Uint8Array | ArrayBuffer, dirname: string, mode: number): Uint8Array;
  export function mkdirPath(path: string, mode: number): Uint8Array;
  export function remove(dirFh: Uint8Array | ArrayBuffer, filename: string): void;
  export function removePath(path: string): void;
  export function rmdir(dirFh: Uint8Array | ArrayBuffer, dirname: string): void;
  export function rmdirPath(path: string): void;
  export function rename(fromDirFh: Uint8Array | ArrayBuffer, fromFilename: string, toDirFh: Uint8Array | ArrayBuffer, toFilename: string): void;
  export function renamePath(fromPath: string, toPath: string): void;
  export function umount(): void;
}
export interface Time {
  seconds: number,
  nseconds: number,
}
export interface Attr {
  attrType: number,
  fileMode: number,
  nlink: number,
  uid: number,
  gid: number,
  filesize: bigint,
  used: bigint,
  specData: [number, number],
  fsid: bigint,
  fileid: bigint,
  atime: Time,
  mtime: Time,
  ctime: Time,
}
export interface PathConf {
  attr?: Attr,
  linkmax: number,
  nameMax: number,
  noTrunc: boolean,
  chownRestricted: boolean,
  caseInsensitive: boolean,
  casePreserving: boolean,
}
export interface ReaddirEntry {
  fileid: bigint,
  fileName: string,
  cookie: bigint,
}
export interface ReaddirplusEntry {
  fileid: bigint,
  fileName: string,
  cookie: bigint,
  attr?: Attr,
  handle: Uint8Array,
}
