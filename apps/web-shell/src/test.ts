import { WASI, OpenFiles, stringOut, bufferIn } from "@netapplabs/wasi-js";

const EOL = "\n";

type Test = Partial<{
    exitCode: number;
    stdin: string;
    stdout: string;
}>;

const tests: (Test & { test: string })[] = [
    // faild
    // { test: "getentropy" },
    // { test: "link" },
    // { test: "stat" },
    // ---
    { test: "cant_dotdot" },
    { test: "clock_getres" },
    { test: "exitcode", exitCode: 120 },
    { test: "fd_prestat_get_refresh" },
    { test: "freopen", stdout: `hello from input2.txt${EOL}` },
    { test: "getrusage" },
    { test: "gettimeofday" },
    { test: "main_args" },
    { test: "notdir" },
    { test: "poll" },
    { test: "preopen_populates" },
    { test: "read_file", stdout: `hello from input.txt${EOL}` },
    {
        test: "read_file_twice",
        stdout: `hello from input.txt${EOL}hello from input.txt${EOL}`,
    },
    { test: "write_file" },
    { test: "stdin", stdin: "hello world", stdout: "hello world" },
    { test: "stdout", stdout: "42" },
    { test: "stdout_with_flush", stdout: `12${EOL}34` },
    { test: "stdout_with_setbuf", stdout: `42` },
    { test: "async-export", stdout: `10 + 3 = 13${EOL}10 / 3 = 3.33${EOL}` },
];

const table = document.getElementById("tests-table") as HTMLTableElement;

const preparedTests: (Test & {
    module: Promise<WebAssembly.Module>;
    resultCell: HTMLTableDataCellElement;
})[] = tests.map(({ test, ...expect }) => {
    const module = WebAssembly.compileStreaming(fetch(`tests/async-wasm/${test}.wasm`));
    const resultCell = Object.assign(document.createElement("td"), {
        textContent: "NOT RUN",
    });
    const row = table.insertRow();
    row.insertCell().textContent = test;
    row.appendChild(resultCell);
    return {
        ...expect,
        module,
        resultCell,
    };
});

const runBtn = document.getElementById("run-btn") as HTMLButtonElement;

const textEncoder = new TextEncoder();
runBtn.onclick = async () => {
    runBtn.disabled = true;
    try {
        // @ts-ignore
        const rootHandle = await showDirectoryPicker();
        const [sandbox, tmp] = await Promise.all([
            rootHandle.getDirectoryHandle("sandbox"),
            rootHandle.getDirectoryHandle("tmp").then(async (tmp: any) => {
                const promises = [];
                for await (const name of tmp.keys()) {
                    promises.push(tmp.removeEntry(name, { recursive: true }));
                }
                await Promise.all(promises);
                return tmp;
            }),
        ]);

        await Promise.allSettled(
            preparedTests.map(async ({ module, resultCell, stdin, stdout = "", exitCode = 0 }) => {
                resultCell.textContent = "Running... ";
                let actualStdout = "";
                let actualStderr = "";
                try {
                    const actualExitCode = await new WASI({
                        openFiles: new OpenFiles({
                            "/sandbox": sandbox,
                            "/tmp": tmp,
                        }),
                        stdin: bufferIn(textEncoder.encode(stdin)),
                        stdout: stringOut((text) => (actualStdout += text)),
                        stderr: stringOut((text) => (actualStderr += text)),
                        args: ["foo", "-bar", "--baz=value"],
                        env: {
                            NODE_PLATFORM: "win32",
                        },
                    }).run(await module);
                    if (actualExitCode !== exitCode) {
                        throw new Error(`Expected exit code: ${exitCode}\nActual exit code: ${actualExitCode}`);
                    }
                    if (actualStdout !== stdout) {
                        throw new Error(
                            `Expected stdout: ${JSON.stringify(stdout)}\nActual stdout: ${JSON.stringify(actualStdout)}`
                        );
                    }
                    if (actualStderr !== "") {
                        throw new Error(`Unexpected stderr: ${JSON.stringify(actualStderr)}`);
                    }
                    resultCell.textContent = "OK";
                } catch (err: any) {
                    console.error(err);
                    let message;
                    if (err instanceof WebAssembly.RuntimeError) {
                        message = `Wasm failed on \`unreachable\`:\n${actualStderr}`;
                    } else {
                        message = err.message;
                    }
                    resultCell.textContent = `NOT OK: ${message}`;
                }
            })
        );
    } finally {
        runBtn.disabled = false;
    }
};

runBtn.disabled = false;
