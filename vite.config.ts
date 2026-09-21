import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['seed/world-bible-v1.md'],
      manifest: {
        name: 'Schism Codex',
        short_name: 'Schism Codex',
        description: 'A local-first world bible and narrative campaign manager.',
        theme_color: '#07110f',
        background_color: '#07110f',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      }
    })
  ]
});
