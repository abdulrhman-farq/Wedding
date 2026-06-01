import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'النقيدان و المحيسن',
        short_name: 'النقيدان والمحيسن',
        description: 'اسحب لتتصفّح ذكرياتنا · Swipe through our wedding memories',
        lang: 'ar',
        dir: 'rtl',
        theme_color: '#100d09',
        background_color: '#100d09',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Offline isn't a priority — keep the precache small so first visit is fast.
        // Large chunks (e.g. face-api) load on demand instead of precaching.
        maximumFileSizeToCacheInBytes: 700 * 1024,
        globPatterns: ['**/*.{css,html,svg,woff2}'],
        navigateFallback: null,
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 8000,
  },
})
