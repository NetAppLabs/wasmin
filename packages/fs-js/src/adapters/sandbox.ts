import { NotAllowedError } from "../errors";

class Sink {
  constructor(writer: FileWriter, fileEntry: FileEntry) {
    this.writer = writer;
    this.fileEntry = fileEntry;
  }

  writer: FileWriter;
  fileEntry: FileEntry;

  /**
   * @param {BlobPart | Object} chunk
   */
  async write(chunk: any) {
    if (typeof chunk === "object") {
      if (chunk.type === "write") {
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          this.writer.seek(chunk.position);
          if (this.writer.position !== chunk.position) {
            await new Promise((resolve, reject) => {
              this.writer.onwriteend = resolve;
              this.writer.onerror = reject;
              this.writer.truncate(chunk.position);
            });
            this.writer.seek(chunk.position);
          }
        }
        if (!("data" in chunk)) {
          throw new Error(
            "[SyntaxError] Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. write requires a data argument"
          );
        }
        chunk = chunk.data;
      } else if (chunk.type === "seek") {
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          this.writer.seek(chunk.position);
          if (this.writer.position !== chunk.position) {
            throw new Error("[InvalidStateError] seeking position failed");
          }
          return;
        } else {
          throw new Error(
            "[SyntaxError] Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. seek requires a position argument"
          );
        }
      } else if (chunk.type === "truncate") {
        return new Promise<void>((resolve) => {
          if (Number.isInteger(chunk.size) && chunk.size >= 0) {
            this.writer.onwriteend = (_evt) => resolve();
            this.writer.truncate(chunk.size);
          } else {
            throw new Error(
              "[SyntaxError] Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. truncate requires a size argument"
            );
          }
        });
      }
    }
    await new Promise((resolve, reject) => {
      this.writer.onwriteend = resolve;
      this.writer.onerror = reject;
      this.writer.write(new Blob([chunk]));
    });
  }

  close() {
    return new Promise(this.fileEntry.file.bind(this.fileEntry));
  }
}

export class FileHandle {
  constructor(file: FileEntry, writable = true) {
    this.file = file;
    this.writable = writable;
    this.readable = true;
  }

  file: FileEntry;
  writable: boolean;
  readable: boolean;
  public kind = "file";

  get name() {
    return this.file.name;
  }

  isSameEntry(other: any) {
    return this === other;
  }

  getFile(): Promise<File> {
    return new Promise(this.file.file.bind(this.file));
  }

  createWritable(opts: { keepExistingData?: boolean } = {}): Promise<Sink> {
    if (!this.writable) throw new NotAllowedError();

    return new Promise((resolve, reject) =>
      this.file.createWriter((fileWriter) => {
        if (opts.keepExistingData === false) {
          fileWriter.onwriteend = (_evt) =>
            resolve(new Sink(fileWriter, this.file));
          fileWriter.truncate(0);
        } else {
          resolve(new Sink(fileWriter, this.file));
        }
      }, reject)
    );
  }
}

export class FolderHandle {
  constructor(dir: DirectoryEntry, writable = true) {
    this.dir = dir;
    this.writable = writable;
    this.readable = true;
    this.name = dir.name;
  }

  dir: DirectoryEntry;
  writable: boolean;
  readable: boolean;
  name: string;
  public kind = "directory";

  isSameEntry(other: FolderHandle) {
    return this.dir.fullPath === other.dir.fullPath;
  }

  async *entries() {
    const reader = this.dir.createReader();
    const entries: any = await new Promise(reader.readEntries.bind(reader));
    for (const x of entries) {
      yield [
        x.name,
        x.isFile
          ? new FileHandle(x as any, this.writable)
          : new FolderHandle(x as any, this.writable),
      ];
    }
  }

  getDirectoryHandle(name: string, opts = {}): Promise<FolderHandle> {
    return new Promise((resolve, reject) => {
      this.dir.getDirectory(
        name,
        opts,
        (dir) => {
          resolve(new FolderHandle(dir));
        },
        reject
      );
    });
  }

  getFileHandle(name: string, opts = {}): Promise<FileHandle> {
    return new Promise((resolve, reject) =>
      this.dir.getFile(
        name,
        opts,
        (file) => resolve(new FileHandle(file)),
        reject
      )
    );
  }

  async removeEntry(name: string, opts: { recursive: any }) {
    const entry: Error | FolderHandle | FileHandle =
      await this.getDirectoryHandle(name).catch((err) =>
        err.name === "TypeMismatchError" ? this.getFileHandle(name) : err
      );

    if (entry instanceof Error) throw entry;

    return new Promise<void>((resolve, reject) => {
      if (entry instanceof FolderHandle) {
        opts.recursive
          ? entry.dir.removeRecursively(() => resolve(), reject)
          : entry.dir.remove(() => resolve(), reject);
      } else if (entry.file) {
        entry.file.remove(() => resolve(), reject);
      }
    });
  }
}

export default (opts: any = {}) =>
  new Promise((resolve, reject) =>
    window.webkitRequestFileSystem(
      opts._persistent,
      0,
      // @ts-ignore
      (e) => resolve(new FolderHandle(e.root)),
      reject
    )
  );
