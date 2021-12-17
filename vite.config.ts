import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/qr-webrtc/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        lang: 'ja',
        name: 'QR WebRTC',
        short_name: 'QRTC',
        display: 'standalone',
        scope: '/qr-webrtc/',
        start_url: '/qr-webrtc/',
        icons: [
          { src: 'icons/48x48.png', sizes: '48x48', type: 'image/png', purpose: 'any' },
          { src: 'icons/48x48.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      wasm: path.resolve(__dirname, 'wasm/pkg'),
    },
  },
  build: {
    outDir: 'docs',
  },
});
