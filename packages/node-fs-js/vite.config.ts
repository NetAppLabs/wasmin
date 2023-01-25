import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: "src/index.ts",
      name: "@wasm-env/node-fs-js",
    },
    rollupOptions: {
      external: ["node:fs", "node:path", "node", "node:fs:promises"],
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