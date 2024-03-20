// from https://github.com/node-fetch/fetch-blob/blob/main/test.js
import "jest-extended";

import path from "node:path";
import { promises as fs } from "node:fs";
import { utimesSync } from "node:fs";
import buffer from "node:buffer";
import { MyFile } from "../src/fetch-blob/file";
import { MyBlob } from "../src/fetch-blob/blob";
import { fileFrom, blobFrom } from "../src/fetch-blob/form";

export function capture(p: any): Promise<Error> {
    return p.catch((_: Error) => _);
}

describe("fetch-blob", () => {
    const licensePath = path.resolve(path.join(__dirname, "..", "LICENSE"));
    let license: string;

    beforeAll(async () => {
        // eslint-disable-next-line
        license = await fs.readFile(licensePath, "utf-8");
    });

    test("new Blob()", () => {
        const blob = new MyBlob();
        expect(blob).toBeInstanceOf(MyBlob);
    });

    test("new Blob(parts)", () => {
        const data = "a=1";
        const blob = new MyBlob([data]);
        expect(blob).toBeInstanceOf(MyBlob);
    });

    test("Blob ctor parts", async () => {
        const parts = [
            "a",
            new Uint8Array([98]),
            new Uint16Array([25699]),
            new Uint8Array([101]).buffer,
            Buffer.from("f"),
            new MyBlob(["g"]),
            {},
            new URLSearchParams("foo"),
        ];

        const blob = new MyBlob(parts);
        expect(await blob.text()).toBe("abcdefg[object Object]foo=");
    });

    test("Blob ctor threats an object with @@iterator as a sequence", async () => {
        const blob = new MyBlob({
            [Symbol.iterator]: Array.prototype[Symbol.iterator],
        } as any);

        expect(blob.size).toBe(0);
        expect(await blob.text()).toBe("");
    });

    test("Blob ctor reads blob parts from object with @@iterator", async () => {
        const input = ["one", "two", "three"];
        const expectedText = input.join("");

        const blob = new MyBlob({
            *[Symbol.iterator]() {
                yield* input;
            },
        } as any);

        expect(blob.size).toBe(new TextEncoder().encode(expectedText).byteLength);
        expect(await blob.text()).toBe(expectedText);
    });

    test("Blob ctor threats Uint8Array as a sequence", async () => {
        const input = [1, 2, 3];
        const blob = new MyBlob(new Uint8Array(input));
        expect(await blob.text()).toBe(input.join(""));
    });

    test("Blob size", () => {
        const data = "a=1";
        const blob = new MyBlob([data]);
        expect(blob.size).toBe(data.length);
    });

    test("Blob type", () => {
        const type = "text/plain";
        const blob = new MyBlob([], { type });
        expect(blob.type).toBe(type);
    });

    test("Blob slice type", () => {
        const type = "text/plain";
        const blob = new MyBlob().slice(0, 0, type);
        expect(blob.type).toBe(type);
    });

    test("invalid Blob type", () => {
        const blob = new MyBlob([], { type: "\u001Ftext/plain" });
        expect(blob.type).toBe("");
    });

    test("invalid Blob slice type", () => {
        const blob = new MyBlob().slice(0, 0, "\u001Ftext/plain");
        expect(blob.type).toBe("");
    });

    test("Blob text()", async () => {
        const data = "a=1";
        const type = "text/plain";
        const blob = new MyBlob([data], { type });
        expect(await blob.text()).toBe(data);
    });

    test("Blob arrayBuffer()", async () => {
        const data = "a=1";
        const type = "text/plain";
        const blob = new MyBlob([data], { type });

        const decoder = new TextDecoder("utf-8");
        const buffer = await blob.arrayBuffer();
        expect(decoder.decode(buffer)).toBe(data);
    });

    test("Blob stream()", async () => {
        const data = "a=1";
        const type = "text/plain";
        const blob = new MyBlob([data], { type });

        for await (const chunk of blob.stream()) {
            expect(chunk.join()).toBe([97, 61, 49].join());
        }
    });

    test("Blob toString()", () => {
        const data = "a=1";
        const type = "text/plain";
        const blob = new MyBlob([data], { type });
        expect(blob.toString()).toBe("[object Blob]");
    });

    test("Blob slice()", async () => {
        const data = "abcdefgh";
        const blob = new MyBlob([data]).slice();
        expect(await blob.text()).toBe(data);
    });

    test("Blob slice(0, 1)", async () => {
        const data = "abcdefgh";
        const blob = new MyBlob([data]).slice(0, 1);
        expect(await blob.text()).toBe("a");
    });

    test("Blob slice(-1)", async () => {
        const data = "abcdefgh";
        const blob = new MyBlob([data]).slice(-1);
        expect(await blob.text()).toBe("h");
    });

    test("Blob slice(0, -1)", async () => {
        const data = "abcdefgh";
        const blob = new MyBlob([data]).slice(0, -1);
        expect(await blob.text()).toBe("abcdefg");
    });

    test('Blob(["hello ", "world"]).slice(5)', async () => {
        const parts = ["hello ", "world"];
        const blob = new MyBlob(parts);
        expect(await blob.slice(5).text()).toBe(" world");
    });

    test("throw away unwanted parts", async () => {
        const blob = new MyBlob(["a", "b", "c"]).slice(1, 2);
        expect(await blob.text()).toBe("b");
    });

    test("blob part backed up by filesystem", async () => {
        const blob = await blobFrom(licensePath);
        expect(await blob.slice(0, 3).text()).toStrictEqual(license.slice(0, 3));
        expect(await blob.slice(4, 11).text()).toStrictEqual(license.slice(4, 11));
    });

    test("Reading after modified should fail", async () => {
        const blob = await blobFrom(licensePath);
        // Change modified time
        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
        const now = new Date();
        utimesSync(licensePath, now, now);
        const error = await capture(blob.text());
        console.log(error);

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("NotReadableError");

        const file = await fileFrom(licensePath);
        // Above test updates the last modified date to now
        expect(typeof file.lastModified).toBe("number");
        // The lastModifiedDate is deprecated and removed from spec
        expect("lastModifiedDate" in file).toBeFalsy();
        const mod = file.lastModified - Date.now();
        expect(mod <= 0 && mod >= -1000).toBeTruthy(); // Close to tolerance: 0.500m
    });

    test("Reading file after modified should fail", async () => {
        const file = await fileFrom(licensePath);
        await new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
        const now = new Date();
        // Change modified time
        await fs.utimes(licensePath, now, now);
        const error = await capture(file.text());
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe("NotReadableError");
    });

    test("create a blob from path asynchronous", async () => {
        const blob = await blobFrom(licensePath);
        const actual = await blob.text();
        expect(actual).toBe(license);
    });

    test("Reading empty blobs", async () => {
        const blob = (await blobFrom(licensePath)).slice(0, 0);
        const actual = await blob.text();
        expect(actual).toBe("");
    });

    /** @see https://github.com/w3c/FileAPI/issues/43 - important to keep boundary value */
    test("Dose not lowercase the blob values", () => {
        const type = "multipart/form-data; boundary=----WebKitFormBoundaryTKqdrVt01qOBltBd";
        expect(new MyBlob([], { type }).type).toBe(type);
    });

    test("Parts are immutable", async () => {
        const buf = new Uint8Array([97]);
        const blob = new MyBlob([buf]);
        buf[0] = 98;
        expect(await blob.text()).toBe("a");
    });

    test("Blobs are immutable", async () => {
        const buf = new Uint8Array([97]);
        const blob = new MyBlob([buf]);
        const chunk = await blob.stream().getReader().read();
        expect(chunk.value[0]).toBe(97);
        chunk.value[0] = 98;
        expect(await blob.text()).toBe("a");
    });

    // This was necessary to avoid large ArrayBuffer clones (slice)
    test("Large chunks are divided into smaller chunks", async () => {
        const buf = new Uint8Array(65590);
        const blob = new MyBlob([buf]);
        let i = 0;
        // eslint-disable-next-line
        for await (const _chunk of blob.stream()) {
            i++;
        }
        expect(i).toBe(2);
    });

    test("Can wrap buffer.Blob to a fetch-blob", async () => {
        const blob1 = new buffer.Blob(["blob part"]);
        const blob2 = new MyBlob([blob1]);
        expect(await blob2.text()).toBe("blob part");
    });

    test("File is a instance of blob", () => {
        expect(new MyFile([], "")).toBeInstanceOf(MyBlob);
    });

    test("fileFrom returns the name", async () => {
        expect((await fileFrom(licensePath)).name).toBe("LICENSE");
    });

    test("fileFrom(path, type) sets the type", async () => {
        expect((await fileFrom(licensePath, "text/plain")).type).toBe("text/plain");
    });

    test("blobFrom(path, type) sets the type", async () => {
        expect((await blobFrom(licensePath, "text/plain")).type).toBe("text/plain");
    });

    test("new MyFile(,,{lastModified: 100})", () => {
        const mod = new MyFile([], "", { lastModified: 100 }).lastModified;
        expect(mod).toBe(100);
    });

    test('new MyFile(,,{lastModified: "200"})', () => {
        const mod = new MyFile([], "", { lastModified: "200" }).lastModified;
        expect(mod).toBe(200);
    });

    test("new MyFile(,,{lastModified: true})", () => {
        const mod = new MyFile([], "", { lastModified: true }).lastModified;
        expect(mod).toBe(1);
    });

    test("new MyFile(,,{lastModified: new Date()})", () => {
        const mod = new MyFile([], "", { lastModified: new Date() }).lastModified - Date.now();
        expect(mod <= 0 && mod >= -20).toBeTruthy(); // Close to tolerance: 0.020ms
    });

    test("new MyFile(,,{}) sets current time", () => {
        const mod = new MyFile([], "").lastModified - Date.now();
        expect(mod <= 0 && mod >= -20).toBeTruthy(); // Close to tolerance: 0.020ms
    });

    test("blobFrom(path, type) sets the type", async () => {
        const blob = await blobFrom(licensePath, "text/plain");
        expect(blob.type).toBe("text/plain");
    });

    test("blobFrom(path) sets empty type", async () => {
        const blob = await blobFrom(licensePath);
        expect(blob.type).toBe("");
    });

    test("can slice zero sized blobs", async () => {
        const blob = new MyBlob();
        const txt = await blob.slice(0, 0).text();
        expect(txt).toBe("");
    });

    test("returns a readable stream", () => {
        const stream = new MyFile([], "").stream();
        expect(typeof stream.getReader).toBe("function");
    });

    test("checking instanceof blob#stream", async () => {
        const stream = new MyFile([], "").stream();
        expect(stream).toBeInstanceOf(ReadableStream);
    });
});
