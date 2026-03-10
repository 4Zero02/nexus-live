import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'client/shared'),
      '@output': path.resolve(__dirname, 'client/output'),
      '@control': path.resolve(__dirname, 'client/control'),
    }
  },
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:8765',
        ws: true
      },
      '/assets/list': {
        target: 'http://localhost:8765'
      },
      '/assets/file': {
        target: 'http://localhost:8765'
      },
      '/gsi': {
        target: 'http://localhost:8765'
      }
    }
  }
})
