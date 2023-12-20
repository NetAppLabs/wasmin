import esbuild from 'esbuild';
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';

await esbuild.build({
  entryPoints: [
    "src/index.ts",
    "src/entry.ts",
    "src/wasmComponentWorkerThread.ts",
    "src/wasmCoreWorkerThread.ts",
    "src/wasiWorkerThread.ts"
  ],
  bundle: true,
  //outfile: 'dist/index.js',
  outdir: 'dist',
  //outbase: 'src',
  loader: {'.wasm': 'file'},
  sourcemap: true,
  //plugins: [envPlugin],
  plugins: [metaUrlPlugin({emit: true})],
  //plugins: [excludeImportMetaUrl()],
  format: "esm",
  platform: "browser",
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
  ]
})
