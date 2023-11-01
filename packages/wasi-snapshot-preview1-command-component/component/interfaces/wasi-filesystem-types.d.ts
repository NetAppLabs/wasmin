export namespace WasiFilesystemTypes {
  export function readViaStream(this_: Descriptor, offset: Filesize): InputStream;
  export function writeViaStream(this_: Descriptor, offset: Filesize): OutputStream;
  export function appendViaStream(this_: Descriptor): OutputStream;
  export function advise(this_: Descriptor, offset: Filesize, length: Filesize, advice: Advice): void;
  export function syncData(this_: Descriptor): void;
  export function getFlags(this_: Descriptor): DescriptorFlags;
  export function getType(this_: Descriptor): DescriptorType;
  export function setSize(this_: Descriptor, size: Filesize): void;
  export function setTimes(this_: Descriptor, dataAccessTimestamp: NewTimestamp, dataModificationTimestamp: NewTimestamp): void;
  export function read(this_: Descriptor, length: Filesize, offset: Filesize): [Uint8Array, boolean];
  export function write(this_: Descriptor, buffer: Uint8Array, offset: Filesize): Filesize;
  export function readDirectory(this_: Descriptor): DirectoryEntryStream;
  export function sync(this_: Descriptor): void;
  export function createDirectoryAt(this_: Descriptor, path: string): void;
  export function stat(this_: Descriptor): DescriptorStat;
  export function statAt(this_: Descriptor, pathFlags: PathFlags, path: string): DescriptorStat;
  export function setTimesAt(this_: Descriptor, pathFlags: PathFlags, path: string, dataAccessTimestamp: NewTimestamp, dataModificationTimestamp: NewTimestamp): void;
  export function linkAt(this_: Descriptor, oldPathFlags: PathFlags, oldPath: string, newDescriptor: Descriptor, newPath: string): void;
  export function openAt(this_: Descriptor, pathFlags: PathFlags, path: string, openFlags: OpenFlags, flags: DescriptorFlags, modes: Modes): Descriptor;
  export function readlinkAt(this_: Descriptor, path: string): string;
  export function removeDirectoryAt(this_: Descriptor, path: string): void;
  export function renameAt(this_: Descriptor, oldPath: string, newDescriptor: Descriptor, newPath: string): void;
  export function symlinkAt(this_: Descriptor, oldPath: string, newPath: string): void;
  export function unlinkFileAt(this_: Descriptor, path: string): void;
  export function dropDescriptor(this_: Descriptor): void;
  export function readDirectoryEntry(this_: DirectoryEntryStream): DirectoryEntry | undefined;
  export function dropDirectoryEntryStream(this_: DirectoryEntryStream): void;
  export function metadataHash(this_: Descriptor): MetadataHashValue;
  export function metadataHashAt(this_: Descriptor, pathFlags: PathFlags, path: string): MetadataHashValue;
}
export type Descriptor = number;
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
export type DirectoryEntryStream = number;
export type LinkCount = bigint;
export interface DescriptorStat {
  type: DescriptorType,
  linkCount: LinkCount,
  size: Filesize,
  dataAccessTimestamp: Datetime,
  dataModificationTimestamp: Datetime,
  statusChangeTimestamp: Datetime,
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
export interface Modes {
  readable?: boolean,
  writable?: boolean,
  executable?: boolean,
}
export interface DirectoryEntry {
  type: DescriptorType,
  name: string,
}
export interface MetadataHashValue {
  lower: bigint,
  upper: bigint,
}
