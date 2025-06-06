/** @module Interface component:nfs-rs/nfs **/
export function parseUrlAndMount(url: string): NfsMount;
export type Fh = Uint8Array;
export type Bytes = Uint8Array;
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
export interface ObjRes {
  obj: Fh,
  attr?: Attr,
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
}
export interface ReaddirplusEntry {
  fileid: bigint,
  fileName: string,
  attr?: Attr,
  handle: Fh,
}
/**
 * # Variants
 * 
 * ## `"nfs-v3"`
 * 
 * ## `"nfs-v4"`
 * 
 * ## `"nfs-v4p1"`
 */
export type NfsVersion = 'nfs-v3' | 'nfs-v4' | 'nfs-v4p1';
export interface Error {
  nfsErrorCode?: number,
  message: string,
}

export class NfsMount {
  /**
   * This type does not have a public constructor.
   */
  private constructor();
  nullOp(): void;
  access(fh: Fh, mode: number): number;
  accessPath(path: string, mode: number): number;
  close(seqid: number, stateid: bigint): void;
  commit(fh: Fh, offset: bigint, count: number): void;
  commitPath(path: string, offset: bigint, count: number): void;
  create(dirFh: Fh, filename: string, mode: number): ObjRes;
  createPath(path: string, mode: number): ObjRes;
  delegpurge(clientid: bigint): void;
  delegreturn(stateid: bigint): void;
  getattr(fh: Fh): Attr;
  getattrPath(path: string): Attr;
  setattr(fh: Fh, guardCtime: Time | undefined, mode: number | undefined, uid: number | undefined, gid: number | undefined, size: bigint | undefined, atime: Time | undefined, mtime: Time | undefined): void;
  setattrPath(path: string, specifyGuard: boolean, mode: number | undefined, uid: number | undefined, gid: number | undefined, size: bigint | undefined, atime: Time | undefined, mtime: Time | undefined): void;
  getfh(): void;
  link(srcFh: Fh, dstDirFh: Fh, dstFilename: string): Attr;
  linkPath(srcPath: string, dstPath: string): Attr;
  symlink(srcPath: string, dstDirFh: Fh, dstFilename: string): ObjRes;
  symlinkPath(srcPath: string, dstPath: string): ObjRes;
  readlink(fh: Fh): string;
  readlinkPath(path: string): string;
  lookup(dirFh: Fh, filename: string): ObjRes;
  lookupPath(path: string): ObjRes;
  pathconf(fh: Fh): PathConf;
  pathconfPath(path: string): PathConf;
  read(fh: Fh, offset: bigint, count: number): Bytes;
  readPath(path: string, offset: bigint, count: number): Bytes;
  write(fh: Fh, offset: bigint, data: Bytes): number;
  writePath(path: string, offset: bigint, data: Bytes): number;
  readdir(dirFh: Fh): Array<ReaddirEntry>;
  readdirPath(dirPath: string): Array<ReaddirEntry>;
  readdirplus(dirFh: Fh): Array<ReaddirplusEntry>;
  readdirplusPath(dirPath: string): Array<ReaddirplusEntry>;
  mkdir(dirFh: Fh, dirname: string, mode: number): ObjRes;
  mkdirPath(path: string, mode: number): ObjRes;
  remove(dirFh: Fh, filename: string): void;
  removePath(path: string): void;
  rmdir(dirFh: Fh, dirname: string): void;
  rmdirPath(path: string): void;
  rename(fromDirFh: Fh, fromFilename: string, toDirFh: Fh, toFilename: string): void;
  renamePath(fromPath: string, toPath: string): void;
  umount(): void;
  version(): NfsVersion;
}
