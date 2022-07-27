import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: "esnext"
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
