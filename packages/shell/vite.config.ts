import { defineConfig } from "vite";

export default defineConfig({
    build: {
        target: "esnext",
        lib: {
            entry: "src/index.ts",
            name: "@wasm-env/shell",
        },
        rollupOptions: {
            external: [
                "node:fs",
                "node:path",
                "node",
                "node:fs:promises",
                "node:dns",
                "node:net",
                "node:url",
                "node:child_process",
                "node:module",
                "node:worker_threads",
                "node:console",
            ],
            output: {
                globals: {
                    fs: "fs",
                    path: "path",
                    node: "node",
                    "node:fs": "fs",
                    "node:path": "path",
                },
            },
        },
    },
});
