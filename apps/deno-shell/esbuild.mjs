import esbuild from 'esbuild';
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';
import textReplace from 'esbuild-plugin-text-replace'
import { Transform } from 'esbuild-plugin-transform'


let tmpDir = "/tmp/wasmin-deno-tmp/";
let tmpDirUrl = `"file://${tmpDir}"`;

let replacePlugin = textReplace(
  {
    include: /\.js*$/ ,
    pattern:[
          ['import.meta.url', tmpDirUrl],
    ]
  }
)

let activePlugins = [Transform({
  plugins: [
    metaUrlPlugin({emit: true}),
    replacePlugin,
  ]
})];

await esbuild.build({
  entryPoints: [
    "src/entry.ts",
    "src/wasmComponentWorkerThread.ts",
    "src/wasmCoreWorkerThread.ts",
    "src/wasiWorkerThread.ts"
  ],
  bundle: true,
  outdir: 'dist',
  loader: {'.wasm': 'file'},
  sourcemap: true,
  //plugins: [metaUrlPlugin({emit: true}), replacePlugin],
  plugins: activePlugins,
  format: "esm",
  platform: "node",
  external: [
    "node:buffer",
    "node:dns",
    "node:dgram",
    "node:net",
    "node:worker_threads",
    "node:process",
    "node:url",
    "node:vm",
    "crypto",
    "fs/promises",
    "node:path",
    "node:os",
    "node:fs",
    "node:util",
    "node:fs/promises",
    "bun",
  ],
  banner:{
    js: `
    import { fileURLToPath } from 'node:url';
    import { createRequire as topLevelCreateRequire } from 'node:module';
    const require = topLevelCreateRequire(import.meta.url);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    `
  }
})

await esbuild.build({
  entryPoints: [
    "src/entry.ts",
    "src/wasmComponentWorkerThread.ts",
    "src/wasmCoreWorkerThread.ts",
    "src/wasiWorkerThread.ts"
  ],
  bundle: true,
  outdir: 'dist-dev',
  loader: {'.wasm': 'file'},
  sourcemap: true,
  plugins: [metaUrlPlugin({emit: true})],
  format: "esm",
  platform: "node",
  external: [
    "node:buffer",
    "node:dns",
    "node:dgram",
    "node:net",
    "node:worker_threads",
    "node:process",
    "node:url",
    "node:vm",
    "crypto",
    "fs/promises",
    "node:path",
    "node:os",
    "node:fs",
    "node:util",
    "node:fs/promises",
    "bun",
  ],
  banner:{
    js: `
    import { fileURLToPath } from 'node:url';
    import { createRequire as topLevelCreateRequire } from 'node:module';
    const require = topLevelCreateRequire(import.meta.url);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    `
  }
})
