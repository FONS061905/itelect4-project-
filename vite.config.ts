import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  // GT6: npm run dev and npm run build skip this block. npm test reads
  // the whole file and then this.
  test: {
    // A pretend browser page inside Node, so render() has a document.
    environment: 'jsdom',
    // Runs before every test file: jest-dom matchers and cleanup().
    setupFiles: ['./src/test/setup.ts'],
    // client.ts throws at import if VITE_API_URL is missing, and the
    // form under test imports it. The tests never call this address.
    env: { VITE_API_URL: 'http://localhost:4000' },
  },
})
