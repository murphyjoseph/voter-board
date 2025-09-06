import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    include: ['test/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist', '.next'],
  },
  resolve: {
    alias: {
      '@': resolve(process.cwd(), './src'),
    },
  },
})
