import type { BunPlugin, PluginBuilder } from "bun";
import { constants } from "bun:sqlite";

const myPlugin: BunPlugin = {
  name: "Custom loader",
  setup(builder: PluginBuilder) {
    builder.onLoad({ filter: /^hello:world$/ }, (args) => {
      console.log("onload hello: ", args);
      return { exports: { foo: "bar" }, loader: "object" };
    });
    builder.onResolve({ filter: /^wasm$/ }, (args) => {
      console.log("resolved wasm: ", args);
      return { path: "/tmp/woah.wasm" };
    });
   //  console.log("build: ", build);
    // implementation
  },
};

let output = await Bun.build({
  entrypoints: [
    "./src/index.ts",
    "./src/wasmComponentWorkerThread.ts",
    "./src/wasmCoreWorkerThread.ts",
    "./src/wasiWorkerThread.ts"
  ],
  outdir: "./dist",
  //plugins: [myPlugin],
  root: "./src",
  //splitting: true,
  target: "bun",
  //splitting: false,
  //minify: true,
  sourcemap: 'external',
});

console.log(output);
