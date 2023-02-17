import { defineConfig } from 'vite'

export default defineConfig({
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
    }
  }
})
