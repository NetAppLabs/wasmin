export namespace ComponentNfsRsNfs {
  export function parseUrlAndMount(url: string): Mount;
  export function nullOp(mnt: Mount): void;
  export function access(mnt: Mount, fh: Uint8Array, mode: number): number;
  export function accessPath(mnt: Mount, path: string, mode: number): number;
  export function close(mnt: Mount, seqid: number, stateid: bigint): void;
  export function commit(mnt: Mount, fh: Uint8Array, offset: bigint, count: number): void;
  export function commitPath(mnt: Mount, path: string, offset: bigint, count: number): void;
  export function create(mnt: Mount, dirFh: Uint8Array, filename: string, mode: number): Uint8Array;
  export function createPath(mnt: Mount, path: string, mode: number): Uint8Array;
  export function delegpurge(mnt: Mount, clientid: bigint): void;
  export function delegreturn(mnt: Mount, stateid: bigint): void;
  export function getattr(mnt: Mount, fh: Uint8Array): Attr;
  export function getattrPath(mnt: Mount, path: string): Attr;
  export function setattr(mnt: Mount, fh: Uint8Array, guardCtime: Time | undefined, mode: number | undefined, uid: number | undefined, gid: number | undefined, size: bigint | undefined, atime: Time | undefined, mtime: Time | undefined): void;
  export function setattrPath(mnt: Mount, path: string, specifyGuard: boolean, mode: number | undefined, uid: number | undefined, gid: number | undefined, size: bigint | undefined, atime: Time | undefined, mtime: Time | undefined): void;
  export function getfh(mnt: Mount): void;
  export function link(mnt: Mount, srcFh: Uint8Array, dstDirFh: Uint8Array, dstFilename: string): Attr;
  export function linkPath(mnt: Mount, srcPath: string, dstPath: string): Attr;
  export function symlink(mnt: Mount, srcPath: string, dstDirFh: Uint8Array, dstFilename: string): Uint8Array;
  export function symlinkPath(mnt: Mount, srcPath: string, dstPath: string): Uint8Array;
  export function readlink(mnt: Mount, fh: Uint8Array): string;
  export function readlinkPath(mnt: Mount, path: string): string;
  export function lookup(mnt: Mount, dirFh: Uint8Array, filename: string): Uint8Array;
  export function lookupPath(mnt: Mount, path: string): Uint8Array;
  export function pathconf(mnt: Mount, fh: Uint8Array): PathConf;
  export function pathconfPath(mnt: Mount, path: string): PathConf;
  export function read(mnt: Mount, fh: Uint8Array, offset: bigint, count: number): Uint8Array;
  export function readPath(mnt: Mount, path: string, offset: bigint, count: number): Uint8Array;
  export function write(mnt: Mount, fh: Uint8Array, offset: bigint, data: Uint8Array): number;
  export function writePath(mnt: Mount, path: string, offset: bigint, data: Uint8Array): number;
  export function readdir(mnt: Mount, dirFh: Uint8Array): ReaddirEntry[];
  export function readdirPath(mnt: Mount, dirPath: string): ReaddirEntry[];
  export function readdirplus(mnt: Mount, dirFh: Uint8Array): ReaddirplusEntry[];
  export function readdirplusPath(mnt: Mount, dirPath: string): ReaddirplusEntry[];
  export function mkdir(mnt: Mount, dirFh: Uint8Array, dirname: string, mode: number): Uint8Array;
  export function mkdirPath(mnt: Mount, path: string, mode: number): Uint8Array;
  export function remove(mnt: Mount, dirFh: Uint8Array, filename: string): void;
  export function removePath(mnt: Mount, path: string): void;
  export function rmdir(mnt: Mount, dirFh: Uint8Array, dirname: string): void;
  export function rmdirPath(mnt: Mount, path: string): void;
  export function rename(mnt: Mount, fromDirFh: Uint8Array, fromFilename: string, toDirFh: Uint8Array, toFilename: string): void;
  export function renamePath(mnt: Mount, fromPath: string, toPath: string): void;
  export function umount(mnt: Mount): void;
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
export interface Error {
  nfsErrorCode?: number,
  message: string,
}
export type Mount = number;
