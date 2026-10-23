import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import { contentPlugin } from './tools/content/vite-plugin.ts';

export default defineConfig({
  // Relative asset URLs: the same build works from any sub-path (GitHub Pages) and from a desktop shell.
  base: './',
  plugins: [
    react(),
    contentPlugin(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false, // src/lib/pwa.ts registers it, outside the desktop app
      manifest: {
        name: 'Baza wiedzy FE',
        short_name: 'Baza FE',
        description: 'Przygotowanie do rozmów front-end: tematy, pytania, quiz, fiszki i checklista. Działa offline.',
        lang: 'pl',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#101010',
        theme_color: '#101010',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // The app, every content part and the Latin fonts (Polish needs latin-ext); other scripts never load.
        globPatterns: ['**/*.{html,js,css,svg}', '**/*-latin-*.woff2'], // the plugin adds the manifest icons
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globalSetup: ['./src/test-global-setup.ts'],
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tools/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
});
