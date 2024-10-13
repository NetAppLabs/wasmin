import esbuild from 'esbuild';
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url';
import textReplace from 'esbuild-plugin-text-replace';
import { Transform } from 'esbuild-plugin-transform'

let tmpDir = '"/tmp/wasmin-tmp/"';
let tmpDirUrl = `"file://${tmpDir}"`;

let pattern = '__filename'

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

let replacePlugin = textReplace(
  {
    include: /\.js*$/ ,
    pattern:[
          [pattern, tmpDir],
    ]
  }
)

export function rewriteNodeExternal() {
  return {
    name: 'rewriteNodeExternal',
    setup(build) {
      build.onResolve({ filter: /(^crypto$|^buffer$|^stream$|^util$|^url$|^child_process$|^http$|^http2$|^os$|^path$|^fs$|^process$)/ }, (args) => ({
        path: `node:${args.path}`,
        external: true,
      }))
    },
  }
}

let activePlugins = [Transform({
  plugins: [
    rewriteNodeExternal(),
    metaUrlPlugin({emit: true}),
    replacePlugin,
  ]
})];

await esbuild.build({
  entryPoints: [
    "src/index.ts",
    "src/wasmComponentWorkerThreadNode.ts",
    "src/wasmCoreWorkerThreadNode.ts",
    "src/wasiWorkerThreadNode.ts"
  ],
  loader: {'.wasm': 'file'},
  bundle: true,
  outdir: 'dist',
  outbase: 'src',
  sourcemap: true,
  plugins: activePlugins,
  format: "cjs",
  platform: "node",
  external: [
    "bun",
  ]
})
