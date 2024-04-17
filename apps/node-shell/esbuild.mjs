import esbuild from 'esbuild';
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';


await esbuild.build({
  entryPoints: [
    "src/index.ts",
    "src/wasmComponentWorkerThreadNode.ts",
    "src/wasmCoreWorkerThreadNode.ts",
    "src/wasiWorkerThreadNode.ts"
  ],
  bundle: true,
  //outfile: 'dist/index.js',
  outdir: 'dist',
  //outbase: 'src',
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
    "node:fs/promises",
    "node:util",
    "bun"
  ]
})
