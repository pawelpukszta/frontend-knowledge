import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { contentPlugin } from './tools/content/vite-plugin.ts';

export default defineConfig({
  // Relative asset URLs: the same build works from any sub-path (GitHub Pages) and from a desktop shell.
  base: './',
  plugins: [react(), contentPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tools/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
});
