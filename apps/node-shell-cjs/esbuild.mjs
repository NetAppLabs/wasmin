import esbuild from 'esbuild';
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';

await esbuild.build({
  entryPoints: [
    "src/index.ts",
    "src/wasmComponentWorkerThread.ts",
    "src/wasmCoreWorkerThread.ts",
    "src/wasiWorkerThread.ts"
  ],
  loader: {'.wasm': 'file'},
  bundle: true,
  //outfile: 'dist/index.js',
  outdir: 'dist',
  outbase: 'src',
  sourcemap: true,
  //plugins: [envPlugin],
  //plugins: [metaUrlPlugin()],
  format: "cjs",
  platform: "node"
})
