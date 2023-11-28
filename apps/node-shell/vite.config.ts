import { defineConfig } from "vite";

export default defineConfig({
    build: {
        target: "esnext",
        lib: {
            entry: "src/index.ts",
            name: "@wasmin/node-shell",
        },
        rollupOptions: {
            external: [
                "node:fs",
                "node:path",
                "node",
                "node:fs:promises",
                "node:crypto",
                "stream",
                "node:stream",
                "http",
                "https",
                "node:util",
                "node:buffer",
                "node:dns",
                "node:net",
                "node:url",
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
                    "node:stream": "stream",
                    "node:dns": "dns",
                    "node:net": "net",
                    "node:buffer": "buffer",
                    "node:util": "util",
                    "node:crypto": "crypto",
                    "node:url": "url",
                    "node:worker_threads": "worker_threads",
                },
            },
        },
    },
});
