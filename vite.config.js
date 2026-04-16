/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/bm-training-lms/' : '/',
  test: {
    environment: 'jsdom',
    globals: true,
    // Tests live next to the code they cover (src/**/__tests__/*.test.js)
    // to keep the service-layer seam obvious — the tests read like a
    // contract for what the future backend has to honor.
    include: ['src/**/*.test.{js,jsx}'],
    // Each test file gets a fresh localStorage. Keeps the persistence
    // assertions from leaking between tests that exercise different keys.
    setupFiles: ['./src/test-setup.js'],
  },
})
