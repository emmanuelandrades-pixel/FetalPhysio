import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'FetalPhysio — CTG Physiology Training',
        short_name: 'FetalPhysio',
        description: 'Plataforma interactiva de entrenamiento clínico en cardiotocografía basada en fisiología.',
        theme_color: '#0B1120',
        background_color: '#0B1120',
        display: 'standalone',
        start_url: '/',
        lang: 'es',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cache',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
