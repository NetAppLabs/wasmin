import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
        external: ['node:fs', 'node:path', 'promises'],
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
    }
  }
})
