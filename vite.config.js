import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Simulador-Microeconomia/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  esbuild: globalThis.process?.env?.VITEST ? { jsx: 'automatic' } : undefined,
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
