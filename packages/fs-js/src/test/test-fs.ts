import {
    streamFromFetch,
    getFileSize,
    getFileContents,
    getDirectoryEntryCount,
    getSortedDirectoryEntries,
    createDirectory,
    createEmptyFile,
    createFileWithContents,
    capture,
    cleanupSandboxedFileSystem,
} from "./util.js";

import { FileSystemDirectoryHandle, isBun } from "../index.js";
import { isDeno } from "../NFileSystemFileHandle.js";
import {vitest} from "vitest";

export const TestsFileSystemHandle = (
    name: string,
    getRootFunc: () => Promise<FileSystemDirectoryHandle>,
    beforeAllFunc?: (this: unknown) => void | Promise<void>,
    afterAllFunc?: (this: unknown) => void | Promise<void>,
    beforeEachFunc?: (this: unknown) => void | Promise<void>
) => {
    return TestsFileSystemHandleImportTestDefinitions(
        name,
        // @ts-ignore
        test,
        // @ts-ignore
        describe,
        // @ts-ignore
        expect,
        // @ts-ignore
        beforeEach,
        // @ts-ignore
        beforeAll,
        // @ts-ignore
        afterAll,
        getRootFunc,
        beforeAllFunc,
        afterAllFunc,
        beforeEachFunc,
    )
}

// commented out because of issues with deno types
//type It = jest.It;
//type Describe = jest.Describe;
//type Expect = jest.Expect;
//type Lifecycle = jest.Lifecycle;

type It = any;
type Describe = any;
type Expect = any;
type Lifecycle = any;

export const TestsFileSystemHandleImportTestDefinitions = (
    name: string,
    test: It,
    describe: Describe,
    expect: Expect,
    beforeEach: Lifecycle,
    beforeAll: Lifecycle,
    afterAll: Lifecycle,
    getRootFunc: () => Promise<FileSystemDirectoryHandle>,
    beforeAllFunc?: (this: unknown) => void | Promise<void>,
    afterAllFunc?: (this: unknown) => void | Promise<void>,
    beforeEachFunc?: (this: unknown) => void | Promise<void>,
) => {

    const testOnlyMemory = (name: string) => (name === "memory" ? test : test.skip);
    const testNotOnBun = (name: string) => (name === "bun" ? test.skip : test);

    let root: FileSystemDirectoryHandle;

    beforeAll(async () => {
        root = await getRootFunc();
    });

    if (beforeAllFunc) {
        beforeAll(beforeAllFunc);
    }

    if (!beforeEachFunc) {
        beforeEachFunc = async () => {
            await cleanupSandboxedFileSystem(root);
        };
    }

    if (beforeEachFunc) {
        beforeEach(beforeEachFunc);
    }

    if (afterAllFunc) {
        afterAll(afterAllFunc);
    }

    describe("getDirectoryHandle()", () => {
        test("getDirectoryHandle(create=false) rejects for non-existing directories", async () => {
            const err = await capture(root.getDirectoryHandle("non-existing-dir"));
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe(
                "A requested file or directory could not be found at the time an operation was processed."
            );
            expect(err.name).toBe("NotFoundError");
        });

        test("getDirectoryHandle(create=true) creates an empty directory", async () => {
            const handle = await root.getDirectoryHandle("non-existing-dir", {
                create: true,
            });
            expect(handle.kind).toBe("directory");
            expect(handle.name).toBe("non-existing-dir");
            expect(await getDirectoryEntryCount(handle)).toBe(0);
            expect(await getSortedDirectoryEntries(root)).toEqual(["non-existing-dir/"]);
        });

        test("getDirectoryHandle(create=false) returns existing directories", async () => {
            const existing_handle = await root.getDirectoryHandle("dir-with-contents", {
                create: true,
            });
            await createEmptyFile("test-file", existing_handle);
            const handle = await root.getDirectoryHandle("dir-with-contents", {
                create: false,
            });
            expect(handle.kind).toBe("directory");
            expect(handle.name).toBe("dir-with-contents");
            expect(await getSortedDirectoryEntries(handle)).toEqual(["test-file"]);
        });

        test("getDirectoryHandle(create=true) returns existing directories without erasing", async () => {
            const existing_handle = await root.getDirectoryHandle("dir-with-contents", {
                create: true,
            });
            await existing_handle.getFileHandle("test-file", { create: true });
            const handle = await root.getDirectoryHandle("dir-with-contents", {
                create: true,
            });
            expect(handle.kind).toBe("directory");
            expect(handle.name).toBe("dir-with-contents");
            expect(await getSortedDirectoryEntries(handle)).toEqual(["test-file"]);
        });

        test("getDirectoryHandle() when a file already exists with the same name", async () => {
            await createEmptyFile("file-name", root);
            let err = await capture(root.getDirectoryHandle("file-name"));
            expect(err.name).toBe("TypeMismatchError");
            expect(err.message).toBe("The path supplied exists, but was not an entry of requested type.");
            err = await capture(root.getDirectoryHandle("file-name", { create: false }));
            expect(err.name).toBe("TypeMismatchError");
            expect(err.message).toBe("The path supplied exists, but was not an entry of requested type.");
            err = await capture(root.getDirectoryHandle("file-name", { create: true }));
        });

        test("getDirectoryHandle() with empty name", async () => {
            let err = await capture(root.getDirectoryHandle("", { create: true }));
            expect(err).toBeInstanceOf(TypeError);
            err = await capture(root.getDirectoryHandle("", { create: false }));
            expect(err).toBeInstanceOf(TypeError);
        });

        test("getDirectoryHandle(create=true) with empty name", async () => {
            let err = await capture(root.getDirectoryHandle("."));
            expect(err).toBeInstanceOf(TypeError);
            err = await capture(root.getDirectoryHandle(".", { create: true }));
            expect(err).toBeInstanceOf(TypeError);
        });

        test('getDirectoryHandle() with ".." name', async () => {
            const subDir = await createDirectory("subdir-name", root);
            let err = await capture(subDir.getDirectoryHandle(".."));
            expect(err).toBeInstanceOf(TypeError);
            err = await capture(subDir.getDirectoryHandle("..", { create: true }));
            expect(err).toBeInstanceOf(TypeError);
        });

        test("getDirectoryHandle(create=false) with a path separator when the directory exists", async () => {
            const first_subDir_name = "first-subdir-name";
            const first_subDir = await createDirectory(first_subDir_name, root);
            const second_subDir_name = "second-subdir-name";
            await createDirectory(second_subDir_name, first_subDir);
            const path_with_separator = `${first_subDir_name}/${second_subDir_name}`;
            const err = await capture(root.getDirectoryHandle(path_with_separator));
            expect(err).toBeInstanceOf(TypeError);
        });

        test("getDirectoryHandle(create=true) with a path separator", async () => {
            const subdir_name = "subdir-name";
            await createDirectory(subdir_name, root);
            const path_with_separator = `${subdir_name}/file_name`;
            const err = await capture(root.getDirectoryHandle(path_with_separator, { create: true }));
            expect(err).toBeInstanceOf(TypeError);
        });
    });

    describe("getFileHandle()", () => {
        test("getFileHandle(create=false) rejects for non-existing files", async () => {
            const err = await capture(root.getFileHandle("non-existing-file"));
            expect(err.message).toBe(
                "A requested file or directory could not be found at the time an operation was processed."
            );
            expect(err.name).toBe("NotFoundError");
        });

        test("getFileHandle(create=true) creates an empty file for non-existing files", async () => {
            const handle = await root.getFileHandle("non-existing-file", {
                create: true,
            });
            expect(handle.kind).toBe("file");
            expect(handle.name).toBe("non-existing-file");
            expect(await getFileSize(handle)).toBe(0);
            expect(await getFileContents(handle)).toBe("");
        });

        test("getFileHandle(create=false) returns existing files", async () => {
            await createFileWithContents("existing-file", "1234567890", root);
            const handle = await root.getFileHandle("existing-file");
            expect(handle.kind).toBe("file");
            expect(handle.name).toBe("existing-file");
            expect(await getFileSize(handle)).toBe(10);
            expect(await getFileContents(handle)).toBe("1234567890");
        });

        test("getFileHandle(create=true) returns existing files without erasing", async () => {
            await createFileWithContents("file-with-contents", "1234567890", root);
            const handle = await root.getFileHandle("file-with-contents", {
                create: true,
            });
            expect(handle.kind).toBe("file");
            expect(handle.name).toBe("file-with-contents");
            expect(await getFileSize(handle)).toBe(10);
            expect(await getFileContents(handle)).toBe("1234567890");
        });

        test("getFileHandle(create=false) when a directory already exists with the same name", async () => {
            await root.getDirectoryHandle("dir-name", { create: true });
            const err = await capture(root.getFileHandle("dir-name"));
            expect(err.name).toBe("TypeMismatchError");
            expect(err.message).toBe("The path supplied exists, but was not an entry of requested type.");
        });

        test("getFileHandle(create=true) when a directory already exists with the same name", async () => {
            await root.getDirectoryHandle("dir-name", { create: true });
            const err = await capture(root.getFileHandle("dir-name", { create: true }));
            expect(err.name).toBe("TypeMismatchError");
            expect(err.message).toBe("The path supplied exists, but was not an entry of requested type.");
        });

        test("getFileHandle() with empty name", async () => {
            let err = await capture(root.getFileHandle("", { create: true }));
            expect(err).toBeInstanceOf(TypeError);
            err = await capture(root.getFileHandle("", { create: false }));
            expect(err).toBeInstanceOf(TypeError);
        });

        test('getFileHandle() with "." name', async () => {
            let err = await capture(root.getFileHandle("."));
            expect(err).toBeInstanceOf(TypeError);
            err = await capture(root.getFileHandle(".", { create: true }));
            expect(err).toBeInstanceOf(TypeError);
        });

        test('getFileHandle() with ".." name', async () => {
            let err = await capture(root.getFileHandle(".."));
            expect(err).toBeInstanceOf(TypeError);
            err = await capture(root.getFileHandle("..", { create: true }));
            expect(err).toBeInstanceOf(TypeError);
        });

        test("getFileHandle(create=false) with a path separator when the file exists.", async () => {
            await createDirectory("subdir-name", root);
            const err = await capture(root.getFileHandle("subdir-name/file_name"));
            expect(err).toBeInstanceOf(TypeError);
        });

        test("getFileHandle(create=true) with a path separator", async () => {
            await createDirectory("subdir-name", root);
            const err = await capture(root.getFileHandle("subdir-name/file_name", { create: true }));
            expect(err).toBeInstanceOf(TypeError);
        });
    });

    describe("removeEntry()", () => {
        test("removeEntry() to remove a file", async () => {
            const handle = await createFileWithContents("file-to-remove", "12345", root);
            await createFileWithContents("file-to-keep", "abc", root);
            await root.removeEntry("file-to-remove");
            expect(await getSortedDirectoryEntries(root)).toEqual(["file-to-keep"]);
            const err = await capture(getFileContents(handle));
            let errMsg = "A requested file or directory could not be found at the time an operation was processed.";
            let errName = "NotFoundError";
            if (name == "bun") {
                errMsg = "No such file or directory";
                errName = "ENOENT";
            }
            console.log(`errName: ${errName}`);
            console.log(`errMsg: ${errMsg}`);
            expect(err.message).toBe(errMsg);
            expect(err.name).toBe(errName);
        });

        test("removeEntry() on an already removed file should fail", async () => {
            await createFileWithContents("file-to-remove", "12345", root);
            await root.removeEntry("file-to-remove");
            const err = await capture(root.removeEntry("file-to-remove"));
            let errMsg = "A requested file or directory could not be found at the time an operation was processed.";
            expect(err.message).toBe(errMsg);
            expect(err.name).toBe("NotFoundError");
        });

        test("removeEntry() to remove an empty directory", async () => {
            const handle = await root.getDirectoryHandle("dir-to-remove", {
                create: true,
            });
            await createFileWithContents("file-to-keep", "abc", root);
            await root.removeEntry("dir-to-remove");
            expect(await getSortedDirectoryEntries(root)).toEqual(["file-to-keep"]);
            const err = await capture(getSortedDirectoryEntries(handle));
            expect(err.message).toBe(
                "A requested file or directory could not be found at the time an operation was processed."
            );
            expect(err.name).toBe("NotFoundError");
        });

        test("removeEntry() on a non-empty directory should fail", async () => {
            const handle = await root.getDirectoryHandle("dir-to-remove", {
                create: true,
            });
            await createEmptyFile("file-in-dir", handle);
            const err = await capture(root.removeEntry("dir-to-remove"));
            expect(err.message).toBe("The object can not be modified in this way.");
            expect(err.name).toBe("InvalidModificationError");
            expect(await getSortedDirectoryEntries(root)).toEqual(["dir-to-remove/"]);
            expect(await getSortedDirectoryEntries(handle)).toEqual(["file-in-dir"]);
        });

        test("removeEntry() with empty name should fail", async () => {
            const handle = await createDirectory("dir", root);
            const err = await capture(handle.removeEntry(""));
            expect(err).toBeInstanceOf(TypeError);
        });

        test('removeEntry() with "." name should fail', async () => {
            const handle = await createDirectory("dir", root);
            const err = await capture(handle.removeEntry("."));
            expect(err).toBeInstanceOf(TypeError);
        });

        test('removeEntry() with ".." name should fail', async () => {
            const handle = await createDirectory("dir", root);
            const err = await capture(handle.removeEntry(".."));
            expect(err).toBeInstanceOf(TypeError);
        });

        test("removeEntry() with a path separator should fail.", async () => {
            const dir = await createDirectory("dir-name", root);
            await createEmptyFile("file-name", dir);
            const err = await capture(root.removeEntry("dir-name/file-name"));
            expect(err).toBeInstanceOf(TypeError);
        });
    });

    describe("getFile()", () => {
        test("getFile() provides a file that can be sliced", async () => {
            // TODO BunFile.slice() seems to be broken
            const fileContents = "awesome content";
            const handle = await createFileWithContents("awesome.txt", fileContents, root);
            const file = await handle.getFile();
            const slice = file.slice(1, file.size);
            const actualContents = await slice.text();
            expect(actualContents).toEqual(fileContents.slice(1, fileContents.length));
        });

        testNotOnBun(name)("getFile() provides a file that can be sliced not to end", async () => {
            // TODO BunFile.slice() seems to be broken
            const fileContents = "awesome content";
            const handle = await createFileWithContents("awesome.txt", fileContents, root);
            const file = await handle.getFile();
            const slice = file.slice(1, file.size-1);
            const actualContents = await slice.text();
            expect(actualContents).toEqual(fileContents.slice(1, fileContents.length-1));
        });

        test("getFile() provides a file that can be read via arrayBuffer()", async () => {
            const fileContents = "average content";
            const handle = await createFileWithContents("average.txt", fileContents, root);
            const file = await handle.getFile();
            const actualContents = await file.arrayBuffer();
            const expectedContents = new TextEncoder().encode(fileContents);
            expect(actualContents).toEqual(expectedContents.buffer);
        });

        test("getFile() provides a file that can be read via stream()", async () => {
            const fileContents = "superb content";
            const handle = await createFileWithContents("superb.txt", fileContents, root);
            const file = await handle.getFile();
            const stream = file.stream();
            const reader = stream.getReader();
            const actualContents = new Uint8Array(file.size);
            let idx = 0;
            do {
                const chunk = await reader.read();
                if (chunk.done) {
                    break;
                }
                actualContents.set(chunk.value, idx);
                idx += chunk.value.byteLength;
            } while (true);
            expect(actualContents).toEqual(new TextEncoder().encode(fileContents));
        });

        test("getFile() provides a file that can be read via text()", async () => {
            const fileContents = "abysmal content";
            const handle = await createFileWithContents("abysmal.txt", fileContents, root);
            const file = await handle.getFile();
            const actualContents = await file.text();
            expect(actualContents).toEqual(fileContents);
        });

        test("getFile() returns last modified time", async () => {
            const handle = await createEmptyFile("mtime.txt", root);
            const first_mtime = (await handle.getFile()).lastModified;
            await new Promise((rs) => setTimeout(rs, 10)); // FF is too fast on memory adapter
            const wfs = await handle.createWritable({ keepExistingData: false });
            await wfs.write("foo");
            await wfs.close();
            const second_mtime = (await handle.getFile()).lastModified;
            const fileReplica = await handle.getFile();
            expect(second_mtime).toEqual(fileReplica.lastModified);
            expect(first_mtime < second_mtime);
        });
    });

    test("can be piped to with a string", async () => {
        const handle = await createEmptyFile("foo_string.txt", root);
        const wfs = await handle.createWritable();
        const rs = new ReadableStream({
            start(ctrl) {
                ctrl.enqueue("foo_string");
                ctrl.close();
            },
        });

        await rs.pipeTo(wfs as WritableStream, { preventCancel: true });
        expect(await getFileContents(handle)).toBe("foo_string");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("can be piped to with an ArrayBuffer", async () => {
        const handle = await createEmptyFile("foo_arraybuf.txt", root);
        const wfs = await handle.createWritable();
        const rs = new ReadableStream({
            start(controller) {
                controller.enqueue(new Uint8Array([102, 111, 111]).buffer);
                controller.close();
            },
        });
        await rs.pipeTo(wfs as WritableStream, { preventCancel: true });
        expect(await getFileContents(handle)).toBe("foo");
        expect(await getFileSize(handle)).toBe(3);
    });

    test("can be piped to with a Blob", async () => {
        const handle = await createEmptyFile("foo_arraybuf.txt", root);
        const wfs = await handle.createWritable();
        const rs = new ReadableStream({
            start(controller) {
                controller.enqueue(new Blob(["foo"]));
                controller.close();
            },
        });
        await rs.pipeTo(wfs as WritableStream, { preventCancel: true });
        expect(await getFileContents(handle)).toBe("foo");
        expect(await getFileSize(handle)).toBe(3);
    });

    test("can be piped to with a param object with write command", async () => {
        const handle = await createEmptyFile("foo_write_param.txt", root);
        const wfs = await handle.createWritable();
        const rs = new ReadableStream({
            start(controller) {
                controller.enqueue({ type: "write", data: "foobar" });
                controller.close();
            },
        });
        await rs.pipeTo(wfs as WritableStream, { preventCancel: true });
        expect(await getFileContents(handle)).toBe("foobar");
        expect(await getFileSize(handle)).toBe(6);
    });

    test("can be piped to with a param object with multiple commands", async () => {
        const handle = await createEmptyFile("foo_write_param.txt", root);
        const wfs = await handle.createWritable();
        const rs = new ReadableStream({
            async start(controller) {
                controller.enqueue({ type: "write", data: "foobar" });
                controller.enqueue({ type: "truncate", size: 10 });
                controller.enqueue({ type: "write", position: 0, data: "baz" });
                controller.close();
            },
        });
        await rs.pipeTo(wfs as WritableStream);
        expect(await getFileContents(handle)).toBe("bazbar\0\0\0\0");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("multiple operations can be queued", async () => {
        const handle = await createEmptyFile("foo_write_queued.txt", root);
        const wfs = await handle.createWritable();
        const rs = new ReadableStream({
            start(controller) {
                controller.enqueue("foo");
                controller.enqueue("bar");
                controller.enqueue("baz");
                controller.close();
            },
        });
        await rs.pipeTo(wfs as WritableStream, { preventCancel: true });
        expect(await getFileContents(handle)).toBe("foobarbaz");
        expect(await getFileSize(handle)).toBe(9);
    });

    test("plays well with fetch", async () => {
        const handle = await createEmptyFile("fetched.txt", root);
        const wfs = await handle.createWritable();
        const body = streamFromFetch("fetched from far");
        await body.pipeTo(wfs as WritableStream, { preventCancel: true });
        expect(await getFileContents(handle)).toBe("fetched from far");
        expect(await getFileSize(handle)).toBe(16);
    });

    test("abort() aborts write", async () => {
        const handle = await createEmptyFile("aborted should_be_empty.txt", root);
        const wfs = await handle.createWritable();
        streamFromFetch("fetched from far");
        const abortController = new AbortController();
        const signal = abortController.signal;
        abortController.abort();
        const promise = new ReadableStream().pipeTo(wfs as WritableStream, {
            signal,
        });
        let err = await capture(promise);
        // May be different depending on implementations:
        // expect(err.message).toBe("Aborted");
        let errMsg = "This operation was aborted";
        const isRunningInsideBun = isBun();
        const isRunningInsideDeno = isDeno();
        if (isRunningInsideBun) {
            errMsg = "The operation was aborted.";
        } else if (isRunningInsideDeno) {
            errMsg = "The signal has been aborted";
        }
        expect(err.message).toBe(errMsg);
        err = await capture(wfs.close());
        expect(err).toBeInstanceOf(TypeError);
        expect(await getFileContents(handle)).toBe("");
        expect(await getFileSize(handle)).toBe(0);
    });

    test("write() with an empty blob to an empty file", async () => {
        const handle = await createEmptyFile("empty_blob", root);
        const wfs = await handle.createWritable();
        await wfs.write(new Blob([]));
        await wfs.close();
        expect(await getFileContents(handle)).toBe("");
        expect(await getFileSize(handle)).toBe(0);
    });

    test("write() a blob to an empty file", async () => {
        const handle = await createEmptyFile("valid_blob", root);
        const wfs = await handle.createWritable();
        await wfs.write(new Blob(["1234567890"]));
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234567890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() with WriteParams without position to an empty file", async () => {
        const handle = await createEmptyFile("write_param_empty", root);
        const wfs = await handle.createWritable();
        await wfs.write({ type: "write", data: "1234567890" });
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234567890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() a string to an empty file with zero offset", async () => {
        const handle = await createEmptyFile("string_zero_offset", root);
        const wfs = await handle.createWritable();
        await wfs.write({ type: "write", position: 0, data: "1234567890" });
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234567890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() a blob to an empty file with zero offset", async () => {
        const handle = await createEmptyFile("blob_zero_offset", root);
        const wfs = await handle.createWritable();
        await wfs.write({
            type: "write",
            position: 0,
            data: new Blob(["1234567890"]),
        });
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234567890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() called consecutively appends", async () => {
        const handle = await createEmptyFile("write_appends", root);
        const wfs = await handle.createWritable();
        await wfs.write("12345");
        await wfs.write("67890");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234567890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() WriteParams without position and string appends", async () => {
        const handle = await createEmptyFile("write_appends_object_string", root);
        const wfs = await handle.createWritable();
        await wfs.write("12345");
        await wfs.write({ type: "write", data: "67890" });
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234567890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() WriteParams without position and blob appends", async () => {
        const handle = await createEmptyFile("write_appends_object_blob", root);
        const wfs = await handle.createWritable();
        await wfs.write("12345");
        await wfs.write({ type: "write", data: new Blob(["67890"]) });
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234567890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() called with a string and a valid offset", async () => {
        const handle = await createEmptyFile("string_with_offset", root);
        const wfs = await handle.createWritable();
        await wfs.write("1234567890");
        await wfs.write({ type: "write", position: 4, data: "abc" });
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234abc890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() called with a blob and a valid offset", async () => {
        const handle = await createEmptyFile("blob_with_offset", root);
        const wfs = await handle.createWritable();
        await wfs.write("1234567890");
        await wfs.write({ type: "write", position: 4, data: new Blob(["abc"]) });
        await wfs.close();
        expect(await getFileContents(handle)).toBe("1234abc890");
        expect(await getFileSize(handle)).toBe(10);
    });

    test("write() called with an larger offset than size", async () => {
        const handle = await createEmptyFile("bad_offset", root);
        const wfs = await handle.createWritable();
        await wfs.write({ type: "write", position: 4, data: new Blob(["abc"]) });
        await wfs.close();
        expect(await getFileContents(handle)).toBe("\0\0\0\0abc");
        expect(await getFileSize(handle)).toBe(7);
    });

    test("write() with an empty string to an empty file", async () => {
        const handle = await createEmptyFile("empty_string", root);
        const wfs = await handle.createWritable();
        await wfs.write("");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("");
        expect(await getFileSize(handle)).toBe(0);
    });

    test("write() with a valid utf-8 string", async () => {
        const handle = await createEmptyFile("valid_utf8_string", root);
        const wfs = await handle.createWritable();
        await wfs.write("foo🤘");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("foo🤘");
        expect(await getFileSize(handle)).toBe(7);
    });

    test("write() with a string with unix line ending preserved", async () => {
        const handle = await createEmptyFile("string_with_unix_line_ending", root);
        const wfs = await handle.createWritable();
        await wfs.write("foo\n");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("foo\n");
        expect(await getFileSize(handle)).toBe(4);
    });

    test("write() with a string with windows line ending preserved", async () => {
        const handle = await createEmptyFile("string_with_windows_line_ending", root);
        const wfs = await handle.createWritable();
        await wfs.write("foo\r\n");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("foo\r\n");
        expect(await getFileSize(handle)).toBe(5);
    });

    test("write() with an empty array buffer to an empty file", async () => {
        const handle = await createEmptyFile("empty_array_buffer", root);
        const wfs = await handle.createWritable();
        await wfs.write(new ArrayBuffer(0));
        await wfs.close();
        expect(await getFileContents(handle)).toBe("");
        expect(await getFileSize(handle)).toBe(0);
    });

    test("write() with a valid typed array buffer", async () => {
        const handle = await createEmptyFile("valid_string_typed_byte_array", root);
        const wfs = await handle.createWritable();
        const buf = new Uint8Array([102, 111, 111]).buffer;
        await wfs.write(buf);
        await wfs.close();
        expect(await getFileContents(handle)).toBe("foo");
        expect(await getFileSize(handle)).toBe(3);
    });

    testOnlyMemory(name)("atomic writes: close() fails when parent directory is removed", async () => {
        const dir = await createDirectory("parent_dir", root);
        const file_name = "close_fails_when_dir_removed.txt";
        const handle = await createEmptyFile(file_name, dir);
        const wfs = await handle.createWritable();
        await wfs.write("foo");
        await root.removeEntry("parent_dir", { recursive: true });
        const err = await capture(wfs.close());
        expect(err.message).toBe(
            "A requested file or directory could not be found at the time an operation was processed."
        );
        expect(err.name).toBe("NotFoundError");
    });

    testOnlyMemory(name)("atomic writes: writable file streams make atomic changes on close", async () => {
        const handle = await createEmptyFile("atomic_writes.txt", root);
        const wfs = await handle.createWritable();
        await wfs.write("foox");
        const wfs2 = await handle.createWritable();
        await wfs2.write("bar");
        expect(await getFileSize(handle)).toBe(0);
        await wfs2.close();
        expect(await getFileContents(handle)).toBe("bar");
        expect(await getFileSize(handle)).toBe(3);
        await wfs.close();
        expect(await getFileContents(handle)).toBe("foox");
        expect(await getFileSize(handle)).toBe(4);
    });

    /*
    testOnlyMemory(name)("atomic writes: writable file stream persists file on close, even if file is removed", async () => {
        const fileName = 'atomic_writable_file_stream_persists_removed.txt'
        const dir = await createDirectory('parent_dir', root)
        const handle = await createFileWithContents(fileName, 'foo', dir)
        const wfs = await handle.createWritable();
        await wfs.write("bar");
        await dir.removeEntry(fileName);
        const err = await getFileContents(handle).catch(e=>e)
        expect(err.name ).toBe( 'NotFoundError')
        await wfs.close();
        expect(await getFileContents(handle) ).toBe( 'bar')
    });
    */

    test("atomic writes: write() after close() fails", async () => {
        const handle = await createEmptyFile("atomic_write_after_close.txt", root);
        const wfs = await handle.createWritable();
        await wfs.write("foo");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("foo");
        expect(await getFileSize(handle)).toBe(3);
        const err = await capture(wfs.write("abc"));
        expect(err).toBeInstanceOf(TypeError);
    });

    test("atomic writes: truncate() after close() fails", async () => {
        const handle = await createEmptyFile("atomic_truncate_after_close.txt", root);
        const wfs = await handle.createWritable();
        await wfs.write("foo");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("foo");
        expect(await getFileSize(handle)).toBe(3);
        const err = await capture(wfs.truncate(0));
        expect(err).toBeInstanceOf(TypeError);
    });

    test("atomic writes: close() after close() fails", async () => {
        const handle = await createEmptyFile("atomic_close_after_close.txt", root);
        const wfs = await handle.createWritable();
        await wfs.write("foo");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("foo");
        expect(await getFileSize(handle)).toBe(3);
        const err = await capture(wfs.close());
        expect(err).toBeInstanceOf(TypeError);
    });

    test("atomic writes: only one close() operation may succeed", async () => {
        const handle = await createEmptyFile("there_can_be_only_one.txt", root);
        const wfs = await handle.createWritable();
        await wfs.write("foo");
        // This test might be flaky if there is a race condition allowing
        // close() to be called multiple times.
        const success_promises = [...Array(100)].map(() =>
            wfs
                .close()
                .then(() => 1)
                .catch(() => 0)
        );
        const close_attempts = await Promise.all(success_promises);
        const success_count = close_attempts.reduce((x, y) => x + y);
        expect(success_count).toBe(1);
    });

    test("getWriter() can be used", async () => {
        const handle = await createEmptyFile("writer_written", root);
        const wfs = await handle.createWritable();
        const writer = wfs.getWriter();
        await writer.write("foo");
        await writer.write(new Blob(["bar"]));
        await writer.write({ type: "seek", position: 0 });
        await writer.write({ type: "write", data: "baz" });
        await writer.close();
        expect(await getFileContents(handle)).toBe("bazbar");
        expect(await getFileSize(handle)).toBe(6);
    });

    test("writing small bits advances the position", async () => {
        const handle = await createEmptyFile("writer_written", root);
        const wfs = await handle.createWritable();
        const writer = wfs.getWriter();
        await writer.write("foo");
        await writer.write(new Blob(["bar"]));
        await writer.write({ type: "seek", position: 0 });
        await writer.write({ type: "write", data: "b" });
        await writer.write({ type: "write", data: "a" });
        await writer.write({ type: "write", data: "z" });
        await writer.close();
        expect(await getFileContents(handle)).toBe("bazbar");
        expect(await getFileSize(handle)).toBe(6);
    });

    test("WriteParams: truncate missing size param", async () => {
        const handle = await createFileWithContents("content.txt", "very long string", root);
        const wfs = await handle.createWritable();
        const err = await capture(wfs.write({ type: "truncate" }));
        expect(err.name).toBe("SyntaxError");
        expect(err.message).toBe("truncate requires a size argument");
    });

    test("WriteParams: write missing data param", async () => {
        const handle = await createEmptyFile("content.txt", root);
        const wfs = await handle.createWritable();
        const err = await capture(wfs.write({ type: "write" }));
        expect(err.name).toBe("SyntaxError");
        expect(err.message).toBe("write requires a data argument");
    });

    test("WriteParams: seek missing position param", async () => {
        const handle = await createFileWithContents("content.txt", "seekable", root);
        const wfs = await handle.createWritable();
        const err = await capture(wfs.write({ type: "seek" }));
        expect(err.name).toBe("SyntaxError");
        expect(err.message).toBe("seek requires a position argument");
    });

    test("truncate() to shrink a file", async () => {
        const handle = await createEmptyFile("trunc_shrink", root);
        const wfs = await handle.createWritable();
        await wfs.write("1234567890");
        await wfs.truncate(5);
        await wfs.close();
        expect(await getFileContents(handle)).toBe("12345");
        expect(await getFileSize(handle)).toBe(5);
    });

    test("truncate() to grow a file", async () => {
        const handle = await createEmptyFile("trunc_grow", root);
        const wfs = await handle.createWritable();
        await wfs.write("abc");
        await wfs.truncate(5);
        await wfs.close();
        expect(await getFileContents(handle)).toBe("abc\0\0");
        expect(await getFileSize(handle)).toBe(5);
    });

    test("createWritable() fails when parent directory is removed", async () => {
        const dir = await createDirectory("parent_dir", root);
        const handle = await createEmptyFile("create_writable_fails_when_dir_removed.txt", dir);
        await root.removeEntry("parent_dir", { recursive: true });
        const err = await capture(handle.createWritable());
        expect(err.message).toBe(
            "A requested file or directory could not be found at the time an operation was processed."
        );
        expect(err.name).toBe("NotFoundError");
    });

    test.skip("write() fails when parent directory is removed", async () => {
        const dir = await createDirectory("parent_dir", root);
        const handle = await createEmptyFile("write_fails_when_dir_removed.txt", dir);
        const wfs = await handle.createWritable();
        await root.removeEntry("parent_dir", { recursive: true });
        const err = await capture(await wfs.write("foo"));
        expect(err.message).toBe("write() fails when parent directory is removed");
    });

    test.skip("truncate() fails when parent directory is removed", async () => {
        // TODO: fix me
        const dir = await createDirectory("parent_dir", root);
        const file_name = "truncate_fails_when_dir_removed.txt";
        const handle = await createEmptyFile(file_name, dir);
        const wfs = await handle.createWritable();
        await root.removeEntry("parent_dir", { recursive: true });
        const err = await wfs.truncate(0).catch((e) => e);
        expect(err?.name).toBe("NotFoundError");
    });

    test("createWritable({keepExistingData: true}): atomic writable file stream initialized with source contents", async () => {
        const handle = await createFileWithContents("atomic_file_is_copied.txt", "fooks", root);
        const wfs = await handle.createWritable({ keepExistingData: true });
        await wfs.write("bar");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("barks");
        expect(await getFileSize(handle)).toBe(5);
    });

    test("createWritable({keepExistingData: false}): non-atomic writable file stream initialized with empty file", async () => {
        // TODO: fix me
        const handle = await createFileWithContents("atomic_file_is_not_copied.txt", "very long string", root);
        const wfs = await handle.createWritable({ keepExistingData: false });
        await wfs.write("bar");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("bar");
        expect(await getFileSize(handle)).toBe(3);
    });

    testOnlyMemory(name)(
        "createWritable({keepExistingData: false}): atomic writable file stream initialized with empty file",
        async () => {
            // TODO: fix me
            const handle = await createFileWithContents("atomic_file_is_not_copied.txt", "very long string", root);
            const wfs = await handle.createWritable({ keepExistingData: false });
            await wfs.write("bar");
            expect(await getFileContents(handle)).toBe("very long string");
            await wfs.close();
            expect(await getFileContents(handle)).toBe("bar");
            expect(await getFileSize(handle)).toBe(3);
        }
    );

    test("cursor position: truncate size > offset", async () => {
        const handle = await createFileWithContents("trunc_smaller_offset.txt", "1234567890", root);
        const wfs = await handle.createWritable({ keepExistingData: true });
        await wfs.truncate(5);
        await wfs.write("abc");
        await wfs.close();

        expect(await getFileContents(handle)).toBe("abc45");
        expect(await getFileSize(handle)).toBe(5);
    });

    test("cursor position: truncate size < offset", async () => {
        const handle = await createFileWithContents("trunc_bigger_offset.txt", "1234567890", root);
        const wfs = await handle.createWritable({ keepExistingData: true });
        await wfs.seek(6);
        await wfs.truncate(5);
        await wfs.write("abc");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("12345abc");
        expect(await getFileSize(handle)).toBe(8);
    });

    test("commands are queued", async () => {
        const handle = await createEmptyFile("contents", root);
        const wfs = await handle.createWritable();
        await wfs.write("abc");
        await wfs.write("def");
        await wfs.truncate(9);
        await wfs.seek(0);
        await wfs.write("xyz");
        await wfs.close();
        expect(await getFileContents(handle)).toBe("xyzdef\0\0\0");
        expect(await getFileSize(handle)).toBe(9);
    });

    test("queryPermission(writable=false) returns granted", async () => {
        expect(await root.queryPermission({ mode: "read" })).toBe("granted");
    });

    test("queryPermission(writable=true) returns granted", async () => {
        expect(await root.queryPermission({ mode: "readwrite" })).toBe("granted");
    });

    test("queryPermission(readable=true) returns granted", async () => {
        expect(await root.queryPermission({ mode: "read" })).toBe("granted");
    });

    test("queryPermission(readable=false) returns granted", async () => {
        expect(await root.queryPermission()).toBe("granted");
    });

    test("isSameEntry for identical directory handles returns true", async () => {
        expect(await root.isSameEntry(root)).toBeTruthy();
        const subDir = await createDirectory("subdir-name", root);
        expect(await subDir.isSameEntry(subDir)).toBeTruthy();
    });

    test("isSameEntry for different directories returns false", async () => {
        const subDir = await createDirectory("subdir-name", root);
        expect(await root.isSameEntry(subDir)).toBeFalsy();
        expect(await subDir.isSameEntry(root)).toBeFalsy();
    });

    test("isSameEntry for different handles for the same directory", async () => {
        const subDir = await createDirectory("subdir-name", root);
        const dir = await root.getDirectoryHandle("subdir-name");
        expect(await subDir.isSameEntry(dir)).toBeTruthy();
        expect(await dir.isSameEntry(subDir)).toBeTruthy();
    });

    test("isSameEntry for identical file handles returns true", async () => {
        const handle = await createEmptyFile("mtime.txt", root);
        expect(await handle.isSameEntry(handle)).toBeTruthy();
    });

    test("isSameEntry for different files returns false", async () => {
        const handle1 = await createEmptyFile("mtime.txt", root);
        const handle2 = await createEmptyFile("foo.txt", root);

        expect(await handle1.isSameEntry(handle2)).toBeFalsy();
        expect(await handle2.isSameEntry(handle1)).toBeFalsy();
    });

    test("isSameEntry comparing a file to a file in a different directory returns false", async () => {
        const handle1 = await createEmptyFile("mtime.txt", root);
        const subdir = await createDirectory("subdir-name", root);
        const handle2 = await createEmptyFile("mtime.txt", subdir);

        expect(await handle1.isSameEntry(handle2)).toBeFalsy();
        expect(await handle2.isSameEntry(handle1)).toBeFalsy();
    });

    test("isSameEntry comparing a file to a directory returns false", async () => {
        const handle1 = await createEmptyFile("mtime.txt", root);
        const handle2 = await createDirectory("subdir-name", root);

        expect(await handle1.isSameEntry(handle2)).toBeFalsy();
        expect(await handle2.isSameEntry(handle1)).toBeFalsy();
    });

    test.skip("Large real data test", async () => {
        // const res = await fetch("https://webtorrent.io/torrents/Sintel/Sintel.mp4");
        // const fileHandle = await root.getFile("movie.mp4", { create: true });
        // const writable = await fileHandle.createWritable();
        // await writable.truncate(~~res.headers.get("content-length"));
        // const writer = writable.getWriter();
        // const reader = res.body.getReader();
        // const pump = () =>
        //   reader
        //     .read()
        //     .then((res) =>
        //       res.done ? writer.close() : writer.write(res.value).then(pump)
        //     );
        // await pump();
        // console.log("done downloading to fs");
        // return pump();
    });
};
