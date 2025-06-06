import { defineConfig } from 'vite'
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
// vite.config.js
import basicSsl from '@vitejs/plugin-basic-ssl'


/*
export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'es',
  },
  plugins: [importMetaAssets()],
};
*/

export default defineConfig({
  plugins: [
    basicSsl({
      /** name of certification */
      name: 'localhost',
      /** custom trust domains */
      domains: ['*.custom.com'],
      /** custom certification directory */
      //certDir: '/Users/.../.devServer/cert'
    }),
    //importMetaAssets(),
    /*{
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
          res.setHeader("Access-Control-Allow-Origin", "*");
          next();
        });
      },
    },*/
  ],
  build: {
    target: "esnext",
    rollupOptions: {
      external: [
        'node:fs',
        'node:path',
        'promises',
        'node:net',
        'node:dns',
        'node:url',
        'node:child_process',
        'node:worker_threads',
        'node:module',
        'node:console'
      ],
    },
    output: {
      globals: {
        fs: "fs",
        path: "path",
        "node:fs": "node:fs",
        "node:path": "node:path",
        promises: "promises",
      },
    },
  },
  server: {
    proxy: {
      '/s3': {
        target: 'https://s3.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, '')
      }
    },
    //cors: true,
    headers: {
      //'Access-Control-Allow-Origin': "*",
      'Cross-Origin-Embedder-Policy': "require-corp",
      'Cross-Origin-Opener-Policy': "same-origin"
    }
  }
})
