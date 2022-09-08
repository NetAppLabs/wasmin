import { defineConfig } from "vite";

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
