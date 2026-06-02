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
      // Offline/PWA caused stale "black screen" loads on redeploys; we don't need
      // offline. selfDestroying ships a service worker that unregisters itself and
      // clears old caches on every device, so the site always loads fresh.
      selfDestroying: true,
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: [],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 8000,
  },
})
