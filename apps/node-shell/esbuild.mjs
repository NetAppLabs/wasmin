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
  ],
  banner:{
    js: `
    import { fileURLToPath } from 'url';
    import { createRequire as topLevelCreateRequire } from 'module';
    const require = topLevelCreateRequire(import.meta.url);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    `
  }
})

//import { createRequire } from 'module';const require = createRequire(import.meta.url);".to_string();