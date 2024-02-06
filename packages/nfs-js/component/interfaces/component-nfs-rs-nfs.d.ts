export namespace ComponentNfsRsNfs {
  export { NfsMount };
  export function parseUrlAndMount(url: string): NfsMount;
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

export class NfsMount {
  nullOp(): void;
  access(fh: Uint8Array, mode: number): number;
  accessPath(path: string, mode: number): number;
  close(seqid: number, stateid: bigint): void;
  commit(fh: Uint8Array, offset: bigint, count: number): void;
  commitPath(path: string, offset: bigint, count: number): void;
  create(dirFh: Uint8Array, filename: string, mode: number): Uint8Array;
  createPath(path: string, mode: number): Uint8Array;
  delegpurge(clientid: bigint): void;
  delegreturn(stateid: bigint): void;
  getattr(fh: Uint8Array): Attr;
  getattrPath(path: string): Attr;
  setattr(fh: Uint8Array, guardCtime: Time | undefined, mode: number | undefined, uid: number | undefined, gid: number | undefined, size: bigint | undefined, atime: Time | undefined, mtime: Time | undefined): void;
  setattrPath(path: string, specifyGuard: boolean, mode: number | undefined, uid: number | undefined, gid: number | undefined, size: bigint | undefined, atime: Time | undefined, mtime: Time | undefined): void;
  getfh(): void;
  link(srcFh: Uint8Array, dstDirFh: Uint8Array, dstFilename: string): Attr;
  linkPath(srcPath: string, dstPath: string): Attr;
  symlink(srcPath: string, dstDirFh: Uint8Array, dstFilename: string): Uint8Array;
  symlinkPath(srcPath: string, dstPath: string): Uint8Array;
  readlink(fh: Uint8Array): string;
  readlinkPath(path: string): string;
  lookup(dirFh: Uint8Array, filename: string): Uint8Array;
  lookupPath(path: string): Uint8Array;
  pathconf(fh: Uint8Array): PathConf;
  pathconfPath(path: string): PathConf;
  read(fh: Uint8Array, offset: bigint, count: number): Uint8Array;
  readPath(path: string, offset: bigint, count: number): Uint8Array;
  write(fh: Uint8Array, offset: bigint, data: Uint8Array): number;
  writePath(path: string, offset: bigint, data: Uint8Array): number;
  readdir(dirFh: Uint8Array): ReaddirEntry[];
  readdirPath(dirPath: string): ReaddirEntry[];
  readdirplus(dirFh: Uint8Array): ReaddirplusEntry[];
  readdirplusPath(dirPath: string): ReaddirplusEntry[];
  mkdir(dirFh: Uint8Array, dirname: string, mode: number): Uint8Array;
  mkdirPath(path: string, mode: number): Uint8Array;
  remove(dirFh: Uint8Array, filename: string): void;
  removePath(path: string): void;
  rmdir(dirFh: Uint8Array, dirname: string): void;
  rmdirPath(path: string): void;
  rename(fromDirFh: Uint8Array, fromFilename: string, toDirFh: Uint8Array, toFilename: string): void;
  renamePath(fromPath: string, toPath: string): void;
  umount(): void;
}
