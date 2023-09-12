import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        target: "esnext",
        lib: {
            formats: ["cjs"],
            entry: "src/server/index.ts",
            name: "@wasm-env/server",
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
                "util",
                "node:buffer",
                "node:net",
                "node:url",
                "bun-livereload",
            ],
            output: {
                globals: {
                    fs: "fs",
                    path: "path",
                    node: "node",
                    util: "util",
                    "node:fs": "fs",
                    "node:path": "path",
                    "node:stream": "stream",
                    "node:net": "net",
                    "node:buffer": "buffer",
                    "node:util": "util",
                    "node:crypto": "crypto",
                    "node:url": "url",
                },
            },
        },
    },
});

/*
import { default as path } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@wasm-env/fs-js",
      fileName: (format) => `dist/@wasm-env/fs-js.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["node"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          node: "node",
        },
      },
    },
  },
});
*/

/*
import nodeResolve from "@rollup/plugin-node-resolve";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: "src/index.ts",
      name: "@wasm-env/fs-js",
    },
    rollupOptions: {
      external: ["fs", "path", "node"],
      output: {
        globals: {
          fs: "fs",
          path: "path",
          node: "node",
        },
      },
      plugins: [
        nodeResolve({
          browser: true,
          preferBuiltins: false,
        }),
        nodePolyfills({ include: ["path", "fs", "fs/promises"] }),
      ],
    },
  },
});
*/
