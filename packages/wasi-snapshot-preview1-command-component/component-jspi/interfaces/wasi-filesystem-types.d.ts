export namespace WasiFilesystemTypes {
  export { Descriptor };
  export { DirectoryEntryStream };
  export function  filesystemErrorCode(err: Error): Promise<ErrorCode | undefined>;
}
export type Filesize = bigint;
import type { InputStream } from '../interfaces/wasi-io-streams.js';
export { InputStream };
/**
 * # Variants
 * 
 * ## `"access"`
 * 
 * ## `"would-block"`
 * 
 * ## `"already"`
 * 
 * ## `"bad-descriptor"`
 * 
 * ## `"busy"`
 * 
 * ## `"deadlock"`
 * 
 * ## `"quota"`
 * 
 * ## `"exist"`
 * 
 * ## `"file-too-large"`
 * 
 * ## `"illegal-byte-sequence"`
 * 
 * ## `"in-progress"`
 * 
 * ## `"interrupted"`
 * 
 * ## `"invalid"`
 * 
 * ## `"io"`
 * 
 * ## `"is-directory"`
 * 
 * ## `"loop"`
 * 
 * ## `"too-many-links"`
 * 
 * ## `"message-size"`
 * 
 * ## `"name-too-long"`
 * 
 * ## `"no-device"`
 * 
 * ## `"no-entry"`
 * 
 * ## `"no-lock"`
 * 
 * ## `"insufficient-memory"`
 * 
 * ## `"insufficient-space"`
 * 
 * ## `"not-directory"`
 * 
 * ## `"not-empty"`
 * 
 * ## `"not-recoverable"`
 * 
 * ## `"unsupported"`
 * 
 * ## `"no-tty"`
 * 
 * ## `"no-such-device"`
 * 
 * ## `"overflow"`
 * 
 * ## `"not-permitted"`
 * 
 * ## `"pipe"`
 * 
 * ## `"read-only"`
 * 
 * ## `"invalid-seek"`
 * 
 * ## `"text-file-busy"`
 * 
 * ## `"cross-device"`
 */
export type ErrorCode = 'access' | 'would-block' | 'already' | 'bad-descriptor' | 'busy' | 'deadlock' | 'quota' | 'exist' | 'file-too-large' | 'illegal-byte-sequence' | 'in-progress' | 'interrupted' | 'invalid' | 'io' | 'is-directory' | 'loop' | 'too-many-links' | 'message-size' | 'name-too-long' | 'no-device' | 'no-entry' | 'no-lock' | 'insufficient-memory' | 'insufficient-space' | 'not-directory' | 'not-empty' | 'not-recoverable' | 'unsupported' | 'no-tty' | 'no-such-device' | 'overflow' | 'not-permitted' | 'pipe' | 'read-only' | 'invalid-seek' | 'text-file-busy' | 'cross-device';
import type { OutputStream } from '../interfaces/wasi-io-streams.js';
export { OutputStream };
/**
 * # Variants
 * 
 * ## `"normal"`
 * 
 * ## `"sequential"`
 * 
 * ## `"random"`
 * 
 * ## `"will-need"`
 * 
 * ## `"dont-need"`
 * 
 * ## `"no-reuse"`
 */
export type Advice = 'normal' | 'sequential' | 'random' | 'will-need' | 'dont-need' | 'no-reuse';
export interface DescriptorFlags {
  read?: boolean,
  write?: boolean,
  fileIntegritySync?: boolean,
  dataIntegritySync?: boolean,
  requestedWriteSync?: boolean,
  mutateDirectory?: boolean,
}
/**
 * # Variants
 * 
 * ## `"unknown"`
 * 
 * ## `"block-device"`
 * 
 * ## `"character-device"`
 * 
 * ## `"directory"`
 * 
 * ## `"fifo"`
 * 
 * ## `"symbolic-link"`
 * 
 * ## `"regular-file"`
 * 
 * ## `"socket"`
 */
export type DescriptorType = 'unknown' | 'block-device' | 'character-device' | 'directory' | 'fifo' | 'symbolic-link' | 'regular-file' | 'socket';
import type { Datetime } from '../interfaces/wasi-clocks-wall-clock.js';
export { Datetime };
export type NewTimestamp = NewTimestampNoChange | NewTimestampNow | NewTimestampTimestamp;
export interface NewTimestampNoChange {
  tag: 'no-change',
}
export interface NewTimestampNow {
  tag: 'now',
}
export interface NewTimestampTimestamp {
  tag: 'timestamp',
  val: Datetime,
}
export type LinkCount = bigint;
export interface DescriptorStat {
  type: DescriptorType,
  linkCount: LinkCount,
  size: Filesize,
  dataAccessTimestamp?: Datetime,
  dataModificationTimestamp?: Datetime,
  statusChangeTimestamp?: Datetime,
}
export interface PathFlags {
  symlinkFollow?: boolean,
}
export interface OpenFlags {
  create?: boolean,
  directory?: boolean,
  exclusive?: boolean,
  truncate?: boolean,
}
export interface MetadataHashValue {
  lower: bigint,
  upper: bigint,
}
export interface DirectoryEntry {
  type: DescriptorType,
  name: string,
}
import type { Error } from '../interfaces/wasi-io-streams.js';
export { Error };

export class DirectoryEntryStream {
  readDirectoryEntry(): Promise<DirectoryEntry | undefined>;
}

export class Descriptor {
  readViaStream(offset: Filesize): Promise<InputStream>;
  writeViaStream(offset: Filesize): Promise<OutputStream>;
  appendViaStream(): Promise<OutputStream>;
  advise(offset: Filesize, length: Filesize, advice: Advice): Promise<void>;
  syncData(): Promise<void>;
  getFlags(): Promise<DescriptorFlags>;
  getType(): Promise<DescriptorType>;
  setSize(size: Filesize): Promise<void>;
  setTimes(dataAccessTimestamp: NewTimestamp, dataModificationTimestamp: NewTimestamp): Promise<void>;
  read(length: Filesize, offset: Filesize): Promise<[Uint8Array, boolean]>;
  write(buffer: Uint8Array, offset: Filesize): Promise<Filesize>;
  readDirectory(): Promise<DirectoryEntryStream>;
  sync(): Promise<void>;
  createDirectoryAt(path: string): Promise<void>;
  stat(): Promise<DescriptorStat>;
  statAt(pathFlags: PathFlags, path: string): Promise<DescriptorStat>;
  setTimesAt(pathFlags: PathFlags, path: string, dataAccessTimestamp: NewTimestamp, dataModificationTimestamp: NewTimestamp): Promise<void>;
  linkAt(oldPathFlags: PathFlags, oldPath: string, newDescriptor: Descriptor, newPath: string): Promise<void>;
  openAt(pathFlags: PathFlags, path: string, openFlags: OpenFlags, flags: DescriptorFlags): Promise<Descriptor>;
  readlinkAt(path: string): Promise<string>;
  removeDirectoryAt(path: string): Promise<void>;
  renameAt(oldPath: string, newDescriptor: Descriptor, newPath: string): Promise<void>;
  symlinkAt(oldPath: string, newPath: string): Promise<void>;
  unlinkFileAt(path: string): Promise<void>;
  metadataHash(): Promise<MetadataHashValue>;
  metadataHashAt(pathFlags: PathFlags, path: string): Promise<MetadataHashValue>;
}
