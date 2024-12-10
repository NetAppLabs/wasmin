import { build } from 'esbuild';
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';

let activePlugins = [
    metaUrlPlugin({emit: true}),
];

await build({
  entryPoints: [
    'src/functions/trigger.ts',
    'src/functions/wasiWorkerThreadNode.ts',
    'src/functions/wasmCoreWorkerThreadNode.ts',
    'src/functions/wasmComponentWorkerThreadNode.ts',
  ],
  format: 'esm',
  splitting: false,
  minify: false,
  bundle: true,
  platform: 'node',
  target: 'node20',
  sourcemap: false,
  //watch: false,
  outdir: 'dist/functions',
  plugins: activePlugins,
  //outExtension: { '.js' : '.mjs' },
  // external: [
  //   "@azure/functions",
  //   "@azure/storage-queue",
  // ],
  external: [
     "@azure/functions-core",
  ],
  banner:{
    js: `
    import { Buffer } from 'node:buffer';
    import { fileURLToPath } from 'node:url';
    import { createRequire as topLevelCreateRequire } from 'node:module';
    const require = topLevelCreateRequire(import.meta.url);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    `
  }
});
